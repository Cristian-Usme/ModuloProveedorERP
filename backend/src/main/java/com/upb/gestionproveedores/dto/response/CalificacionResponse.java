package com.upb.gestionproveedores.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalificacionResponse {
    private Long id;
    private Integer puntuacion;
    private String comentario;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
}
