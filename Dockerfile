# ==========================================
# STAGE 1: Build the React Frontend
# ==========================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package definitions and install
COPY frontend/package*.json ./
# Using legacy-peer-deps to bypass the Vite dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend source code
COPY frontend/ ./

# Build the production static bundle
RUN npm run build

# ==========================================
# STAGE 2: Build the Spring Boot Backend
# ==========================================
FROM maven:3.9.4-eclipse-temurin-17 AS backend-builder
WORKDIR /app/backend

# Copy the Maven wrapper and pom.xml
COPY backend/pom.xml .

# Go offline to cache dependencies (optional but recommended)
RUN mvn dependency:go-offline

# Copy backend source code
COPY backend/src ./src

# Inject the built React frontend into Spring Boot's static resources folder
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Package the application (skip tests to speed up deployment pipeline)
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 3: Run the Application (Google Cloud Run)
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Copy the built jar file from the backend-builder stage
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Run the single monorepo container
ENTRYPOINT ["java", "-jar", "app.jar"]
