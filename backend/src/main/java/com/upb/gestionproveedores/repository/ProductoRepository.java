package com.upb.gestionproveedores.repository;

import com.upb.gestionproveedores.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query(value = "SELECT * FROM productos p WHERE p.activo = true AND " +
           "(COALESCE(CAST(:search AS VARCHAR), '') = '' OR " +
           "LOWER(p.nombre) LIKE LOWER('%' || :search || '%')) " +
           "ORDER BY p.creado_en DESC", nativeQuery = true)
    Page<Producto> findBySearch(String search, Pageable pageable);
}
