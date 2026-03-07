# VaultFlow API

## Overview

VaultFlow API is a scalable backend system built using **FastAPI** and **MySQL**. It provides secure user authentication using **JWT tokens**, role-based access control (User/Admin), and CRUD operations for managing todos.

The project demonstrates best practices in backend architecture, including modular project structure, password hashing, token-based authentication, and API versioning.

---

## User Interface

### Signup Page with Owl Mascot
![Signup Page](./images/signup_view.png)

### My Tasks Dashboard
![Dashboard](./images/dashboard_view.png)

### System Architecture

```mermaid
graph TD
    subgraph Client ["Client (Browser)"]
        UI["React SPA (Vite)"]
        AC["AuthContext (JWT Storage)"]
    end

    subgraph API ["Backend API (FastAPI)"]
        direction LR
        Routes["Routes (Auth, Todo, Admin)"]
        Deps["Dependencies (Auth / RBAC)"]
        Services["Services (Business Logic)"]
        Core["Core (Security / JWT)"]
        Models["Models (SQLAlchemy)"]
        
        Routes --> Deps
        Deps --> Services
        Services --> Core
        Services --> Models
    end

    subgraph DB ["Database"]
        MySQL[("MySQL Database")]
    end

    UI <--> AC
    UI -- "Axios Requests (Bearer Token)" --> Routes
    Models <--> MySQL
```

---

## Tech Stack

**Backend Framework**
- FastAPI

**Database**
- MySQL

**ORM**
- SQLAlchemy

**Authentication**
- JWT (JSON Web Tokens)

**Password Security**
- Passlib (bcrypt)

**Server**
- Uvicorn

**API Documentation**
- Swagger UI (auto-generated)

---

## Features

- User registration and login
- Secure password hashing using bcrypt
- JWT authentication
- Role-based access control (user/admin)
- Todo CRUD operations
- Modular and scalable project architecture
- API versioning (`/api/v1`)
- Automatic API documentation via Swagger

---

## Project Structure

```
VaultFlow
│
├── backend
│   ├── core
│   │   ├── hashing.py
│   │   └── security.py
│   │
│   ├── dependencies
│   │   └── auth_dependency.py
│   │
│   ├── models
│   │   ├── user_model.py
│   │   └── todo_model.py
│   │
│   ├── routes
│   │   ├── auth_routes.py
│   │   └── todo_routes.py
│   │
│   ├── schemas
│   │   ├── user_schema.py
│   │   └── todo_schema.py
│   │
│   ├── services
│   │   ├── auth_service.py
│   │   └── todo_service.py
│   │
│   ├── utils
│   │   └── responses.py
│   │
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
└── frontend
```

---

## Database Schema

### Users Table

| Column     | Type              | Description           |
| ---------- | ----------------- | --------------------- |
| id         | INT               | Primary Key           |
| email      | VARCHAR           | Unique email          |
| password   | VARCHAR           | Hashed password       |
| role       | ENUM(user, admin) | User role             |
| is_active  | BOOLEAN           | Active status         |

### Todos Table

| Column      | Type      | Description                   |
| ----------- | --------- | ----------------------------- |
| id          | INT       | Primary Key                   |
| title       | VARCHAR   | Todo title                    |
| description | TEXT      | Todo description              |
| completed   | BOOLEAN   | Status                        |
| owner_id    | INT       | Foreign key referencing users |

Relationship:
```
Users (1) ──────── (Many) Todos
```

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/abhixw/Vaultflow.git
cd Vaultflow
```

---

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 3. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

---

### 4. Configure Database
Create MySQL database:
```sql
CREATE DATABASE secure_task_api;
```
Update the connection string inside `backend/.env`.

Example:
`DATABASE_URL=mysql+pymysql://username:password@localhost/secure_task_api`

---

### 5. Run the Server
```bash
cd backend
uvicorn main:app --reload
```
Server will start at: `http://127.0.0.1:8000`

---

## API Documentation

FastAPI automatically generates API documentation.

Swagger UI: `http://127.0.0.1:8000/docs`
Alternative documentation: `http://127.0.0.1:8000/redoc`

---

## API Endpoints

### Authentication
**Register User**
`POST /api/v1/auth/register`

**Login User**
`POST /api/v1/auth/login` (Returns JWT token)

---

### Todos CRUD
**Create Todo**
`POST /api/v1/todos`

**Get User Todos**
`GET /api/v1/todos`

**Update Todo**
`PUT /api/v1/todos/{id}`

**Delete Todo**
`DELETE /api/v1/todos/{id}`

---

## Authentication Flow
1. User registers
2. User logs in
3. Server generates JWT token
4. Client sends token in request header

Example header:
`Authorization: Bearer <JWT_TOKEN>`

Protected routes require a valid token.

---

## Scalability Considerations
The project follows a modular architecture separating routes, services, models, and dependencies. This structure allows easy expansion into microservices if required.

Potential improvements for production:
- Redis caching
- Docker containerization
- Load balancing with Nginx
- Background tasks using Celery
- Rate limiting
- Centralized logging

---

## License
This project is developed as part of a backend developer internship assignment.
