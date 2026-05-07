package com.upb.gestionproveedores.repository;

import com.upb.gestionproveedores.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailAndActivoTrue(String email);
    boolean existsByEmail(String email);
}
