package com.upb.gestionproveedores.controller;

import com.upb.gestionproveedores.dto.request.LoginRequest;
import com.upb.gestionproveedores.dto.request.RegisterRequest;
import com.upb.gestionproveedores.dto.response.AuthResponse;
import com.upb.gestionproveedores.dto.response.UserResponse;
import com.upb.gestionproveedores.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Registrar nuevo usuario (solo ADMIN, no permite rol ADMIN)")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos los usuarios (solo ADMIN)")
    public ResponseEntity<List<UserResponse>> listarUsuarios() {
        return ResponseEntity.ok(authService.listarUsuarios());
    }

    @PatchMapping("/users/{id}/toggle-active")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activar/desactivar usuario (solo ADMIN, no permite para ADMIN)")
    public ResponseEntity<UserResponse> toggleActivo(@PathVariable Long id) {
        return ResponseEntity.ok(authService.toggleActivoUsuario(id));
    }
}
