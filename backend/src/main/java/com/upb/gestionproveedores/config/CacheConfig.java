package com.upb.gestionproveedores.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;

/**
 * Cache Configuration
 * Uses in-memory caching by default (suitable for single instance)
 * For distributed systems, consider Redis caching
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
            "proveedores",
            "productos",
            "ordenes",
            "usuarios",
            "calificaciones",
            "roles"
        );
    }
}
