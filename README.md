# Full-Stack Live Clock with Auto-Theme

A secure, dockerized full-stack application featuring a Real-Time Digital Clock with automatic theme switching based on time of day, now powered by a FastAPI backend and MongoDB authentication.

## Features

*   **Secure Authentication**: JWT-based Login and Register with password hashing.
*   **Protected Routes**: Clock access restricted to authenticated users.
*   **Full-Stack Architecture**: React Frontend + FastAPI Backend + MongoDB.
*   **Dockerized**: Easy deployment with `docker-compose`.
*   **Auto-Theme**: Dynamic light/dark mode based on time of day.
*   **Animations**: Smooth framer-motion animations for auth pages.
*   **Widgets**: Stopwatch, Timer, Alarm, World Clock, Calendar.

## Tech Stack

*   **Frontend**: React, Vite, Framer Motion, Axios.
*   **Backend**: FastAPI, Pydantic, Motor (Async MongoDB).
*   **Database**: MongoDB.
*   **DevOps**: Docker, Docker Compose, Nginx.

## Installation & Setup

1.  **Clone the repository**
2.  **Run with Docker Compose** (Recommended)

    ```bash
    docker-compose up --build
    ```

    *   Frontend will be available at: `http://localhost:5173`
    *   Backend API docs: `http://localhost:8000/docs`

3.  **Manual Setup (Without Docker)**

    **Backend:**
    ```bash
    cd backend
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

    **Frontend:**
    Open a new terminal:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## API Endpoints

*   `POST /auth/register`: Create a new user account.
*   `POST /auth/login`: Authenticate and receive access token.
*   `GET /auth/me`: Get current user profile (Protected).

## Project Structure

```
/
├── backend/            # FastAPI Application
│   ├── routers/        # API Routes
│   ├── auth.py         # JWT & Hashing Logic
│   ├── database.py     # MongoDB Connection
│   ├── main.py         # App Entry Point
│   ├── models.py       # Data Models
│   ├── schemas.py      # Pydantic Schemas
│   └── Dockerfile
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # React Components (Login, Clock, etc.)
│   │   ├── contexts/   # Auth Context
│   │   └── App.jsx     # Main App Component
│   └── Dockerfile
└── docker-compose.yml  # Container Orchestration
```

## Contributing

1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.
