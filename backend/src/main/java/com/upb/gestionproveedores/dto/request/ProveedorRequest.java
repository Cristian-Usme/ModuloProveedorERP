package com.upb.gestionproveedores.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProveedorRequest {
    @NotBlank(message = "El nombre del proveedor es obligatorio")
    private String nombre;

    @NotBlank(message = "El RUC/NIT es obligatorio")
    private String rucNit;

    @Email(message = "Formato de email inválido")
    private String email;

    private String telefono;
    private String direccion;
}
