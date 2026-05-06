package com.upb.gestionproveedores.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Tag(name = "Health & Monitoring")
public class HealthCheckController {

    private final HealthEndpoint healthEndpoint;

    @GetMapping
    @Operation(summary = "System health status")
    public ResponseEntity<?> getHealth() {
        HealthComponent health = healthEndpoint.health();
        return ResponseEntity.ok(health);
    }

    @GetMapping("/live")
    @Operation(summary = "Liveness probe for Kubernetes")
    public ResponseEntity<Map<String, String>> liveness() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis() + "");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ready")
    @Operation(summary = "Readiness probe for Kubernetes")
    public ResponseEntity<Map<String, String>> readiness() {
        HealthComponent health = healthEndpoint.health();
        Map<String, String> response = new HashMap<>();
        response.put("status", health.getStatus().toString());
        response.put("timestamp", System.currentTimeMillis() + "");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/startup")
    @Operation(summary = "Startup probe for Kubernetes")
    public ResponseEntity<Map<String, String>> startup() {
        HealthComponent health = healthEndpoint.health();
        Map<String, String> response = new HashMap<>();
        response.put("status", health.getStatus().toString());
        response.put("message", "Application startup completed");
        return ResponseEntity.ok(response);
    }
}
