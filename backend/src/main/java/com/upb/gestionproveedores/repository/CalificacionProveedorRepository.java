package com.upb.gestionproveedores.repository;

import com.upb.gestionproveedores.model.CalificacionProveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CalificacionProveedorRepository extends JpaRepository<CalificacionProveedor, Long> {

    @Query("SELECT AVG(c.puntuacion) FROM CalificacionProveedor c WHERE c.proveedor.id = :proveedorId")
    Optional<Double> calcularPromedioByProveedorId(Long proveedorId);

    long countByProveedorId(Long proveedorId);

    Optional<CalificacionProveedor> findByProveedorIdAndUsuarioId(Long proveedorId, Long usuarioId);
}
