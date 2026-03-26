package com.upb.gestionproveedores.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "proveedores")
@SQLRestriction("activo = true")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(name = "ruc_nit", nullable = false, unique = true, length = 20)
    private String rucNit;

    @Column(length = 150)
    private String email;

    @Column(length = 20)
    private String telefono;

    @Column(columnDefinition = "TEXT")
    private String direccion;

    @Column(name = "calificacion_promedio", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal calificacionPromedio = BigDecimal.ZERO;

    @Column(name = "total_calificaciones")
    @Builder.Default
    private Integer totalCalificaciones = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @Column(name = "creado_en", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime creadoEn = LocalDateTime.now();
}
