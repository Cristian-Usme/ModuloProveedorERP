package com.upb.gestionproveedores.repository;

import com.upb.gestionproveedores.model.Proveedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

    boolean existsByRucNit(String rucNit);

    @Query(value = "SELECT * FROM proveedores p WHERE p.activo = true AND " +
           "(COALESCE(CAST(:search AS VARCHAR), '') = '' OR " +
           "LOWER(p.nombre) LIKE LOWER('%' || :search || '%') OR " +
           "LOWER(p.ruc_nit) LIKE LOWER('%' || :search || '%')) " +
           "ORDER BY p.creado_en DESC", nativeQuery = true)
    Page<Proveedor> findBySearch(String search, Pageable pageable);
}
