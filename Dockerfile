# Multi-stage Dockerfile to build frontend (Vite) and backend (Maven), then produce a runnable JRE image

FROM node:18-alpine AS frontend-build
WORKDIR /workspace/frontend
COPY frontend/package*.json ./
RUN npm ci --silent
COPY frontend/ .
RUN npm run build

FROM maven:3.8.8-eclipse-temurin-17 AS backend-build
WORKDIR /workspace/backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY backend/src ./src
# Copy built frontend into Spring Boot static resources so backend serves the SPA
COPY --from=frontend-build /workspace/frontend/dist ./src/main/resources/static
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /workspace/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "if [ ! -z \"$DATABASE_URL\" ]; then export SPRING_DATASOURCE_URL=\"$(echo $DATABASE_URL | sed -e 's/^postgres:\/\//jdbc:postgresql:\/\//')\"; fi; exec java -Dserver.port=${PORT:-8080} -jar app.jar"]
