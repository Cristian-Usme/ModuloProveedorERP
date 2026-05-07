package com.upb.gestionproveedores.service;

import com.upb.gestionproveedores.auth.UserDetailsImpl;
import com.upb.gestionproveedores.dto.request.OrdenCompraRequest;
import com.upb.gestionproveedores.dto.response.DetalleOrdenResponse;
import com.upb.gestionproveedores.dto.response.OrdenCompraResponse;
import com.upb.gestionproveedores.exception.BusinessException;
import com.upb.gestionproveedores.exception.ResourceNotFoundException;
import com.upb.gestionproveedores.model.*;
import com.upb.gestionproveedores.repository.OrdenCompraRepository;
import com.upb.gestionproveedores.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdenCompraService {

    private final OrdenCompraRepository ordenCompraRepository;
    private final ProveedorService proveedorService;
    private final ProductoService productoService;
    private final UsuarioRepository usuarioRepository;

    public Page<OrdenCompraResponse> listar(EstadoOrden estado, Pageable pageable) {
        Long usuarioId = null;
        if (tieneRol("ROLE_COMPRADOR") && !tieneRol("ROLE_ADMIN")) {
            usuarioId = getUsuarioActual().getId();
        }
        return ordenCompraRepository.findByEstadoAndUsuario(estado, usuarioId, pageable)
            .map(this::toResponse);
    }

    public OrdenCompraResponse obtenerPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public OrdenCompraResponse crear(OrdenCompraRequest request) {
        Proveedor proveedor = proveedorService.findById(request.getProveedorId());
        Usuario usuario = getUsuarioActual();

        OrdenCompra orden = OrdenCompra.builder()
            .numeroOrden(generarNumeroOrden())
            .proveedor(proveedor).usuario(usuario)
            .observaciones(request.getObservaciones())
            .build();

        BigDecimal total = BigDecimal.ZERO;
        for (var req : request.getDetalles()) {
            Producto producto = productoService.findById(req.getProductoId());
            BigDecimal subtotal = req.getPrecioUnitario().multiply(BigDecimal.valueOf(req.getCantidad()));
            orden.getDetalles().add(DetalleOrden.builder()
                .orden(orden).producto(producto)
                .cantidad(req.getCantidad())
                .precioUnitario(req.getPrecioUnitario())
                .subtotal(subtotal).build());
            total = total.add(subtotal);
        }
        orden.setTotal(total);
        return toResponse(ordenCompraRepository.save(orden));
    }

    @Transactional
    public OrdenCompraResponse aprobar(Long id, String observaciones) {
        OrdenCompra orden = findById(id);
        validarTransicion(orden);
        orden.setEstado(EstadoOrden.APROBADA);
        if (observaciones != null) orden.setObservaciones(observaciones);
        orden.setFechaActualizacion(LocalDateTime.now());
        return toResponse(ordenCompraRepository.save(orden));
    }

    @Transactional
    public OrdenCompraResponse rechazar(Long id, String observaciones) {
        OrdenCompra orden = findById(id);
        validarTransicion(orden);
        orden.setEstado(EstadoOrden.RECHAZADA);
        if (observaciones != null) orden.setObservaciones(observaciones);
        orden.setFechaActualizacion(LocalDateTime.now());
        return toResponse(ordenCompraRepository.save(orden));
    }

    @Transactional
    public OrdenCompraResponse cancelar(Long id) {
        OrdenCompra orden = findById(id);
        validarTransicion(orden);
        if (!tieneRol("ROLE_ADMIN")) {
            if (!orden.getUsuario().getId().equals(getUsuarioActual().getId())) {
                throw new BusinessException("Solo puede cancelar sus propias órdenes");
            }
        }
        orden.setEstado(EstadoOrden.CANCELADA);
        orden.setFechaActualizacion(LocalDateTime.now());
        return toResponse(ordenCompraRepository.save(orden));
    }

    private void validarTransicion(OrdenCompra orden) {
        if (orden.getEstado() != EstadoOrden.PENDIENTE) {
            throw new BusinessException(
                "Solo se puede cambiar el estado de una orden PENDIENTE. Estado actual: " + orden.getEstado());
        }
    }

    private String generarNumeroOrden() {
        String prefijo = "OC-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = ordenCompraRepository.count() + 1;
        return prefijo + "-" + String.format("%04d", count);
    }

    private OrdenCompra findById(Long id) {
        return ordenCompraRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("OrdenCompra", id));
    }

    private Usuario getUsuarioActual() {
        UserDetailsImpl p = (UserDetailsImpl) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();
        return usuarioRepository.findById(p.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", p.getId()));
    }

    private boolean tieneRol(String role) {
        return SecurityContextHolder.getContext().getAuthentication()
            .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(role));
    }

    private OrdenCompraResponse toResponse(OrdenCompra o) {
        List<DetalleOrdenResponse> detalles = o.getDetalles().stream()
            .map(d -> DetalleOrdenResponse.builder()
                .id(d.getId())
                .productoId(d.getProducto().getId())
                .productoNombre(d.getProducto().getNombre())
                .cantidad(d.getCantidad())
                .precioUnitario(d.getPrecioUnitario())
                .subtotal(d.getSubtotal()).build())
            .collect(Collectors.toList());

        return OrdenCompraResponse.builder()
            .id(o.getId()).numeroOrden(o.getNumeroOrden())
            .fechaCreacion(o.getFechaCreacion()).fechaActualizacion(o.getFechaActualizacion())
            .estado(o.getEstado()).observaciones(o.getObservaciones()).total(o.getTotal())
            .proveedorId(o.getProveedor().getId()).proveedorNombre(o.getProveedor().getNombre())
            .usuarioId(o.getUsuario().getId()).usuarioNombre(o.getUsuario().getNombre())
            .detalles(detalles).build();
    }
}
