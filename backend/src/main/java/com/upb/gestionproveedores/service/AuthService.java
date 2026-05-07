package com.upb.gestionproveedores.service;

import com.upb.gestionproveedores.auth.JwtTokenProvider;
import com.upb.gestionproveedores.auth.UserDetailsImpl;
import com.upb.gestionproveedores.dto.request.LoginRequest;
import com.upb.gestionproveedores.dto.request.RegisterRequest;
import com.upb.gestionproveedores.dto.response.AuthResponse;
import com.upb.gestionproveedores.dto.response.UserResponse;
import com.upb.gestionproveedores.exception.BusinessException;
import com.upb.gestionproveedores.exception.ResourceNotFoundException;
import com.upb.gestionproveedores.model.Rol;
import com.upb.gestionproveedores.model.Usuario;
import com.upb.gestionproveedores.repository.RolRepository;
import com.upb.gestionproveedores.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(auth);
        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();

        Set<String> roles = user.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .map(r -> r.replace("ROLE_", ""))
            .collect(Collectors.toSet());

        return AuthResponse.builder()
            .token(token).tipo("Bearer")
            .id(user.getId()).nombre(user.getNombre())
            .email(user.getUsername()).roles(roles)
            .build();
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("El email ya está registrado: " + request.getEmail());
        }

        Set<String> rolesReq = (request.getRoles() == null || request.getRoles().isEmpty())
            ? Set.of("CONSULTA") : request.getRoles();

        // Bloquear creación de usuarios con rol ADMIN
        if (rolesReq.stream().anyMatch(r -> r.equalsIgnoreCase("ADMIN"))) {
            throw new BusinessException("No se permite crear usuarios con rol ADMIN");
        }

        Set<Rol> roles = new HashSet<>();
        for (String rolNombre : rolesReq) {
            roles.add(rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new BusinessException("Rol no encontrado: " + rolNombre)));
        }

        Usuario usuario = Usuario.builder()
            .nombre(request.getNombre())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .roles(roles)
            .build();
        usuarioRepository.save(usuario);

        return toUserResponse(usuario);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listarUsuarios() {
        return usuarioRepository.findAll().stream()
            .map(this::toUserResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse toggleActivoUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));

        // No permitir desactivar admins
        boolean isAdmin = usuario.getRoles().stream()
            .anyMatch(r -> r.getNombre().equalsIgnoreCase("ADMIN"));
        if (isAdmin) {
            throw new BusinessException("No se puede desactivar un usuario administrador");
        }

        usuario.setActivo(!usuario.getActivo());
        usuarioRepository.save(usuario);

        return toUserResponse(usuario);
    }

    private UserResponse toUserResponse(Usuario usuario) {
        Set<String> roleNames = usuario.getRoles().stream()
            .map(Rol::getNombre)
            .collect(Collectors.toSet());

        boolean isAdmin = roleNames.contains("ADMIN");

        return UserResponse.builder()
            .id(usuario.getId())
            .nombre(usuario.getNombre())
            .email(usuario.getEmail())
            .roles(roleNames)
            .activo(usuario.getActivo())
            .editable(!isAdmin)
            .creadoEn(usuario.getCreadoEn())
            .build();
    }
}
