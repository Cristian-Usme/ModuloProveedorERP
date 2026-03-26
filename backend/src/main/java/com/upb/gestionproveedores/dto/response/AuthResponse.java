package com.upb.gestionproveedores.dto.response;

import lombok.*;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tipo;
    private Long id;
    private String nombre;
    private String email;
    private Set<String> roles;
}
