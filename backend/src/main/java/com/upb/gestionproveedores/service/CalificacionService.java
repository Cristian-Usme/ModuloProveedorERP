package com.upb.gestionproveedores.service;

import com.upb.gestionproveedores.auth.UserDetailsImpl;
import com.upb.gestionproveedores.dto.request.CalificacionRequest;
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

@Service
@RequiredArgsConstructor
public class CalificacionService {

    private final CalificacionProveedorRepository calificacionRepository;
    private final ProveedorService proveedorService;
    private final ProveedorRepository proveedorRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public void calificar(Long proveedorId, CalificacionRequest request) {
        Proveedor proveedor = proveedorService.findById(proveedorId);
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();
        Usuario usuario = usuarioRepository.findById(principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", principal.getId()));

        calificacionRepository.save(CalificacionProveedor.builder()
            .proveedor(proveedor).usuario(usuario)
            .puntuacion(request.getPuntuacion()).comentario(request.getComentario())
            .build());

        // Actualizar promedio en proveedor
        double promedio = calificacionRepository
            .calcularPromedioByProveedorId(proveedorId).orElse(0.0);
        long total = calificacionRepository.countByProveedorId(proveedorId);
        proveedor.setCalificacionPromedio(BigDecimal.valueOf(promedio).setScale(2, RoundingMode.HALF_UP));
        proveedor.setTotalCalificaciones((int) total);
        proveedorRepository.save(proveedor);
    }
}
