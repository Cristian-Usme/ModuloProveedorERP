package com.upb.gestionproveedores.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuration - now managed centrally in SecurityConfig
 * This file is kept for backwards compatibility but is no longer used.
 * All CORS configuration is done in SecurityConfig.securityFilterChain()
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CORS is configured in SecurityConfig - this is kept as documentation only
    }
}

