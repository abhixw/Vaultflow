# Vaultflow - Task Management System

A secure, scalable Task Management API built with FastAPI and React.

## Features
- **Authentication**: JWT-based login and registration with password hashing.
- **RBAC**: Role-Based Access Control (Admin vs User).
- **CRUD Operations**: Manage todos with strict PUT semantics and ownership validation.
- **Scalability**: Modular project structure for easy extension.
- **Documentation**: Interactive API docs via Swagger.

## Technology Stack
- **Backend**: FastAPI, SQLAlchemy, MySQL (PyMySQL), PyJWT.
- **Frontend**: React.js, Vite, Axios, React Router.

## Setup Instructions

### Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Configure your database in `config.py`.
4. Run the server: `uvicorn main:app --reload`.

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

---

## Scalability Note

### 1. Database Optimization (Caching)
Implementing **Redis** for caching frequently accessed data (like user profiles or the global todo list for admins) will significantly reduce database load and improve response times.

### 2. Microservices Architecture
The current modular structure allows for easy separation. The **Authentication** and **Todo** services can be decoupled into independent microservices, each with its own database, communicating via an API Gateway or Message Queue (like RabbitMQ/Kafka) for high availability.

### 3. Load Balancing
By deploying multiple instances of the FastAPI server behind a **Nginx** or **AWS ALB** load balancer, we can distribute incoming traffic evenly, ensuring the system remains responsive under heavy load.

### 4. Background Processing
Using **Celery** with Redis/RabbitMQ would move long-running tasks (like sending registration emails or generating reports) out of the request-response cycle, keeping the API fast and responsive.
