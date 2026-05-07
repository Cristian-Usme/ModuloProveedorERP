package com.upb.gestionproveedores.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String nombre;
    private String email;
    private Set<String> roles;
    private Boolean activo;
    private Boolean editable;
    private LocalDateTime creadoEn;
}
