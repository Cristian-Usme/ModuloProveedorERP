package com.upb.gestionproveedores.controller;

import com.upb.gestionproveedores.dto.request.OrdenCompraRequest;
import com.upb.gestionproveedores.dto.response.OrdenCompraResponse;
import com.upb.gestionproveedores.model.EstadoOrden;
import com.upb.gestionproveedores.service.OrdenCompraService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
@Tag(name = "Órdenes de Compra")
public class OrdenCompraController {

    private final OrdenCompraService ordenCompraService;

    @GetMapping
    @Operation(summary = "Listar órdenes (CONSULTA ve todas, COMPRADOR solo las suyas)")
    public ResponseEntity<Page<OrdenCompraResponse>> listar(
            @RequestParam(required = false) EstadoOrden estado, Pageable pageable) {
        return ResponseEntity.ok(ordenCompraService.listar(estado, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener orden por ID")
    public ResponseEntity<OrdenCompraResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ordenCompraService.obtenerPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPRADOR')")
    @Operation(summary = "Crear orden de compra")
    public ResponseEntity<OrdenCompraResponse> crear(@Valid @RequestBody OrdenCompraRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ordenCompraService.crear(request));
    }

    @PatchMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Aprobar orden PENDIENTE")
    public ResponseEntity<OrdenCompraResponse> aprobar(
            @PathVariable Long id,
            @RequestParam(required = false) String observaciones) {
        return ResponseEntity.ok(ordenCompraService.aprobar(id, observaciones));
    }

    @PatchMapping("/{id}/rechazar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Rechazar orden PENDIENTE")
    public ResponseEntity<OrdenCompraResponse> rechazar(
            @PathVariable Long id,
            @RequestParam(required = false) String observaciones) {
        return ResponseEntity.ok(ordenCompraService.rechazar(id, observaciones));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPRADOR')")
    @Operation(summary = "Cancelar orden PENDIENTE")
    public ResponseEntity<OrdenCompraResponse> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(ordenCompraService.cancelar(id));
    }
}
