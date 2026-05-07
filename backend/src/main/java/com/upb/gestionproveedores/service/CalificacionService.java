package com.upb.gestionproveedores.service;

import com.upb.gestionproveedores.auth.UserDetailsImpl;
import com.upb.gestionproveedores.dto.request.CalificacionRequest;
import com.upb.gestionproveedores.dto.response.CalificacionResponse;
import com.upb.gestionproveedores.exception.ResourceNotFoundException;
import com.upb.gestionproveedores.model.CalificacionProveedor;
import com.upb.gestionproveedores.model.Proveedor;
import com.upb.gestionproveedores.model.Usuario;
import com.upb.gestionproveedores.repository.CalificacionProveedorRepository;
import com.upb.gestionproveedores.repository.ProveedorRepository;
import com.upb.gestionproveedores.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CalificacionService {

    private final CalificacionProveedorRepository calificacionRepository;
    private final ProveedorService proveedorService;
    private final ProveedorRepository proveedorRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Calificar o actualizar calificación de un proveedor.
     * Si el usuario ya calificó este proveedor, actualiza en lugar de crear duplicado.
     */
    @Transactional
    public CalificacionResponse calificar(Long proveedorId, CalificacionRequest request) {
        Proveedor proveedor = proveedorService.findById(proveedorId);
        Usuario usuario = getUsuarioAutenticado();

        Optional<CalificacionProveedor> existente = calificacionRepository
            .findByProveedorIdAndUsuarioId(proveedorId, usuario.getId());

        CalificacionProveedor calificacion;

        if (existente.isPresent()) {
            // UPDATE — actualizar calificación existente
            calificacion = existente.get();
            calificacion.setPuntuacion(request.getPuntuacion());
            calificacion.setComentario(request.getComentario());
            calificacion.setActualizadoEn(LocalDateTime.now());
        } else {
            // INSERT — crear nueva calificación
            calificacion = CalificacionProveedor.builder()
                .proveedor(proveedor)
                .usuario(usuario)
                .puntuacion(request.getPuntuacion())
                .comentario(request.getComentario())
                .build();
        }

        calificacionRepository.save(calificacion);

        // Recalcular promedio del proveedor
        actualizarPromedioProveedor(proveedorId, proveedor);

        return toResponse(calificacion);
    }

    /**
     * Obtener la calificación del usuario autenticado para un proveedor específico.
     * Retorna Optional.empty() si el usuario no ha calificado.
     */
    @Transactional(readOnly = true)
    public Optional<CalificacionResponse> obtenerCalificacionUsuario(Long proveedorId) {
        // Verificar que el proveedor existe
        proveedorService.findById(proveedorId);

        Usuario usuario = getUsuarioAutenticado();

        return calificacionRepository
            .findByProveedorIdAndUsuarioId(proveedorId, usuario.getId())
            .map(this::toResponse);
    }

    private void actualizarPromedioProveedor(Long proveedorId, Proveedor proveedor) {
        double promedio = calificacionRepository
            .calcularPromedioByProveedorId(proveedorId).orElse(0.0);
        long total = calificacionRepository.countByProveedorId(proveedorId);
        proveedor.setCalificacionPromedio(BigDecimal.valueOf(promedio).setScale(2, RoundingMode.HALF_UP));
        proveedor.setTotalCalificaciones((int) total);
        proveedorRepository.save(proveedor);
    }

    private Usuario getUsuarioAutenticado() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();
        return usuarioRepository.findById(principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", principal.getId()));
    }

    private CalificacionResponse toResponse(CalificacionProveedor cal) {
        return CalificacionResponse.builder()
            .id(cal.getId())
            .puntuacion(cal.getPuntuacion())
            .comentario(cal.getComentario())
            .creadoEn(cal.getCreadoEn())
            .actualizadoEn(cal.getActualizadoEn())
            .build();
    }
}
