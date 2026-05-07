package com.upb.gestionproveedores.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;

/**
 * Request logging interceptor for distributed tracing
 * Adds correlation ID to all requests for centralized logging
 */
@Slf4j
@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

    public static final String CORRELATION_ID = "X-Correlation-ID";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String correlationId = request.getHeader(CORRELATION_ID);
        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        }
        
        request.setAttribute(CORRELATION_ID, correlationId);
        response.setHeader(CORRELATION_ID, correlationId);

        log.info("[{}] {} {}", 
            correlationId,
            request.getMethod(),
            request.getRequestURI());

        request.setAttribute("startTime", System.currentTimeMillis());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        long startTime = (Long) request.getAttribute("startTime");
        long duration = System.currentTimeMillis() - startTime;
        String correlationId = (String) request.getAttribute(CORRELATION_ID);

        log.info("[{}] {} {} - {} - {}ms", 
            correlationId,
            request.getMethod(),
            request.getRequestURI(),
            response.getStatus(),
            duration);

        if (ex != null) {
            log.error("[{}] Exception occurred", correlationId, ex);
        }
    }
}
