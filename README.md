# Paatha - Indoor Navigation System

A comprehensive indoor navigation and floor plan mapping system. This project is structured as a monorepo containing both the frontend application and the backend API.

## Repository Structure

```
Paatha-simple-full/
├── paatha-frontend/      # React + Vite (Frontend Application)
└── paatha-backend/       # FastAPI + SQLAlchemy + PostgreSQL (Backend API)
```

---

## 📱 Frontend

The frontend is a modern web application built using **React** and **Vite**, featuring interactive floor plans, path visualization using SVG, and route finding (Dijkstra's algorithm).

### Key Features
- Dynamic SVG floor switcher and interactive paths.
- QR-code based initial location setup and recalibration.
- Interactive creator UI to draw maps, place markers, and connect nodes.
- Redux-based state management for navigation routing.

### Quick Start
1. Navigate to the frontend directory:
   ```bash
   cd paatha-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```

---

## ⚙️ Backend

The backend is built with **FastAPI**, **SQLAlchemy** (with `asyncpg` for asynchronous PostgreSQL access), and **Alembic** for migrations.

### Key Features
- RESTful APIs for managing Blocks, Floors, Nodes, Edges, and Markers.
- SQLite or PostgreSQL integration.
- Authentication and User Management.
- Alembic database migration support.

### Quick Start
1. Navigate to the backend directory:
   ```bash
   cd paatha-backend
   ```
2. Set up virtual environment and install requirements:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set up your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
4. Run migrations and start the server:
   ```bash
   alembic upgrade head
   uvicorn main:app --reload
   ```
