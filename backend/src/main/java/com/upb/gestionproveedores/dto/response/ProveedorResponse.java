package com.upb.gestionproveedores.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProveedorResponse {
    private Long id;
    private String nombre;
    private String rucNit;
    private String email;
    private String telefono;
    private String direccion;
    private BigDecimal calificacionPromedio;
    private Integer totalCalificaciones;
    private Boolean activo;
    private LocalDateTime creadoEn;
}
