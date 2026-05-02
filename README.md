# 🟥 SyncSpace: Construct Your Workflow 🟦

A high-performance, visually striking team coordination platform built for the **PromptWars Hackathon**. 

SyncSpace solves the problem of scattered team communication and chaotic task tracking by providing a unified, single-pane-of-glass workspace. It combines drag-and-drop Kanban task management, team chat, and automated workflow tracking, all wrapped in a bespoke **Bauhaus** geometric design system.

---

## 🚀 The Solution & Core Features

- **Team Workspaces**: Create isolated workspaces for specific projects and invite your colleagues.
- **Constructivist Kanban Board**: Track work effortlessly across `TO DO`, `IN PROGRESS`, and `DONE` columns. Includes a dedicated **"My Tasks" filter** to simplify workflows for individual contributors.
- **Integrated Team Chat**: Stop switching tabs to communicate. Discuss tasks directly within the team workspace.
- **Automated Activity Log**: Total visibility. The backend automatically logs whenever a task is created, assigned, or moved, creating a chronological audit trail of team momentum.
- **Bauhaus Design System**: A completely custom, non-generic UI featuring solid primary color blocks (Red `#D02020`, Blue `#1040C0`, Yellow `#F0C020`), thick 4px borders, hard offset shadows, and the `Outfit` geometric typeface.

---

## 🛠️ Tech Stack & Architecture

SyncSpace is designed as a **Monorepo** for seamless development and deployment.

### Backend
- **Java 17 & Spring Boot 3**: Robust, layered REST API.
- **Spring Data JPA & H2**: Embedded SQL database with auto-generated schema.
- **JUnit 5 & Mockito**: Automated unit testing for core business logic.

### Frontend
- **React 18 & Vite**: Lightning-fast, component-based UI.
- **Vanilla CSS**: Custom implementation of the Bauhaus design tokens, completely independent of Tailwind or Bootstrap.
- **Fetch API**: Clean, dependency-free backend communication.

### Deployment
- **Docker**: A multi-stage Dockerfile builds the Vite frontend, packages it inside the Spring Boot JAR, and creates a single, ultra-lightweight Eclipse Temurin Java 17 container.
- **Google Cloud Run**: Ready for instant serverless deployment on Google Cloud infrastructure.

---

## 🏆 Hackathon Evaluation Criteria Fulfilled

1. **Code Quality**: Clean, layered Spring Boot architecture (Controllers → Services → Repositories) with immutable Java 17 `Record` DTOs.
2. **Efficiency**: Single-container deployment bundling frontend and backend together eliminates CORS overhead and reduces server costs. React state-based routing ensures zero page reloads.
3. **Testing**: JUnit Mockito tests verify that our automated workflow triggers (Activity Log) fire correctly.
4. **Accessibility**: High-contrast Bauhaus design (`#121212` text on bright backgrounds), massive geometric typography, and semantic HTML structure.
5. **Problem Statement Alignment**: Directly solves team coordination by unifying tasks and chat, and vastly improves visibility via the Activity Log and "My Tasks" filters.
6. **Google Services**: Completely containerized and optimized specifically for deployment on **Google Cloud Run**.

---

## ⚙️ How to Run Locally

Because of the simplified monorepo architecture, getting SyncSpace running takes seconds.

### 1. Start the Backend
The backend runs on port `8080` and uses an embedded database (no setup required).
```bash
cd backend
./mvnw clean spring-boot:run
```

### 2. Start the Frontend
The frontend runs on port `5173` and automatically proxies `/api` requests to the backend.
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🐳 Docker / Cloud Deployment

To package the entire application into a single production-ready image and deploy it:

```bash
# Build the multi-stage image
docker build -t syncspace-app .

# Run the unified container locally
docker run -p 8080:8080 syncspace-app
```

Once pushed to Artifact Registry, this image can be deployed directly to Google Cloud Run!