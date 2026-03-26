package com.upb.gestionproveedores.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrdenCompraRequest {
    @NotNull(message = "El proveedor es obligatorio")
    private Long proveedorId;

    private String observaciones;

    @NotEmpty(message = "La orden debe tener al menos un detalle")
    @Valid
    private List<DetalleOrdenRequest> detalles;
}
