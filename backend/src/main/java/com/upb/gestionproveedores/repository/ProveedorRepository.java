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

    @Query("SELECT p FROM Proveedor p WHERE " +
           "(:search IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.rucNit) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Proveedor> findBySearch(String search, Pageable pageable);
}
