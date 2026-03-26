package com.upb.gestionproveedores.controller;

import com.upb.gestionproveedores.dto.request.CalificacionRequest;
import com.upb.gestionproveedores.dto.request.ProveedorRequest;
import com.upb.gestionproveedores.dto.response.ProveedorResponse;
import com.upb.gestionproveedores.service.CalificacionService;
import com.upb.gestionproveedores.service.ProveedorService;
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
@RequestMapping("/api/proveedores")
@RequiredArgsConstructor
@Tag(name = "Proveedores")
public class ProveedorController {

    private final ProveedorService proveedorService;
    private final CalificacionService calificacionService;

    @GetMapping
    @Operation(summary = "Listar proveedores")
    public ResponseEntity<Page<ProveedorResponse>> listar(
            @RequestParam(required = false) String search, Pageable pageable) {
        return ResponseEntity.ok(proveedorService.listar(search, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener proveedor por ID")
    public ResponseEntity<ProveedorResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(proveedorService.obtenerPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear proveedor")
    public ResponseEntity<ProveedorResponse> crear(@Valid @RequestBody ProveedorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(proveedorService.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar proveedor")
    public ResponseEntity<ProveedorResponse> actualizar(
            @PathVariable Long id, @Valid @RequestBody ProveedorRequest request) {
        return ResponseEntity.ok(proveedorService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar proveedor (soft delete)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        proveedorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/calificacion")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPRADOR')")
    @Operation(summary = "Calificar proveedor 1-5")
    public ResponseEntity<Void> calificar(
            @PathVariable Long id, @Valid @RequestBody CalificacionRequest request) {
        calificacionService.calificar(id, request);
        return ResponseEntity.ok().build();
    }
}
