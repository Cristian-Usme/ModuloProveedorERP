package com.upb.gestionproveedores.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precioReferencia;
    private String unidad;
    private Long proveedorId;
    private String proveedorNombre;
    private Boolean activo;
    private LocalDateTime creadoEn;
}
