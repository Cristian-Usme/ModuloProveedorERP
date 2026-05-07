package com.upb.gestionproveedores.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductoRequest {
    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombre;

    private String descripcion;
    private BigDecimal precioReferencia;
    private String unidad;

    @NotNull(message = "El proveedor es obligatorio")
    private Long proveedorId;
}
