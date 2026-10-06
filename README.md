# Task Management Web Application — Documentation

## 1. Introduction

The Task Management Web Application is a full-stack web application designed to help users create, organize, update, and track their daily tasks.

The application provides task management features such as:

* Creating tasks
* Viewing tasks
* Updating tasks
* Deleting tasks
* Setting task priority
* Tracking task status
* Selecting task date and time
* Filtering tasks by status
* Viewing tasks for a selected date

The application follows a three-layer architecture consisting of a React frontend, Go REST API backend, and PostgreSQL database.

---

# 2. Technology Stack

## Frontend

* React
* Vite
* JavaScript
* HTML
* CSS
* React Router
* Fetch API

## Backend

* Go
* `net/http`
* REST API
* `pgx` PostgreSQL driver
* `godotenv`

## Database

* PostgreSQL

## Development Tools

* Visual Studio Code
* PowerShell
* Git
* GitHub
* PostgreSQL / psql

## Deployment

* Vercel — Frontend
* Render — Backend
* PostgreSQL — Database

---

# 3. System Architecture

The application follows a three-layer architecture:

```text
                    ┌───────────────────┐
                    │       User        │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  React Frontend   │
                    │      Vercel       │
                    └─────────┬─────────┘
                              │
                         HTTP / JSON
                              │
                              ▼
                    ┌───────────────────┐
                    │    Go REST API    │
                    │      Render       │
                    └─────────┬─────────┘
                              │
                         SQL Queries
                              │
                              ▼
                    ┌───────────────────┐
                    │    PostgreSQL     │
                    │     Database      │
                    └───────────────────┘
```

### Request Flow

When a user performs an operation:

1. The user interacts with the React frontend.
2. React creates an HTTP request.
3. The request is sent to the Go REST API.
4. The Go backend receives and validates the request.
5. The backend communicates with PostgreSQL.
6. PostgreSQL performs the required database operation.
7. The backend receives the database result.
8. The Go API returns a JSON response.
9. React updates the user interface.

---

# 4. Frontend

The frontend is developed using React and Vite.

The frontend is responsible for:

* Displaying tasks
* Providing task forms
* Handling user interactions
* Validating user input
* Sending API requests
* Displaying API responses
* Showing errors
* Filtering tasks
* Selecting task dates

The frontend communicates with the backend using HTTP requests.

### Example

When a user creates a task:

```text
User
  ↓
Task Form
  ↓
React
  ↓
POST Request
  ↓
Go REST API
```

The backend then stores the task in PostgreSQL.

---

# 5. Backend

The backend is developed using Go.

The backend provides REST APIs for task management.

The backend is responsible for:

* Receiving HTTP requests
* Validating request data
* Processing business logic
* Communicating with PostgreSQL
* Returning JSON responses
* Handling invalid requests
* Handling database errors
* Managing CORS
* Providing production configuration

The server uses Go's standard `net/http` package.

---

# 6. REST API

The backend exposes REST API endpoints for managing tasks.

## Create Task

```http
POST /api/tasks
```

Creates a new task.

Example request:

```json
{
  "title": "Complete assignment",
  "description": "Finish the task management project",
  "status": "Pending",
  "priority": "High",
  "task_date": "2026-10-06",
  "task_time": "18:00"
}
```

---

## Get All Tasks

```http
GET /api/tasks
```

Returns all tasks.

---

## Get Single Task

```http
GET /api/tasks/{id}
```

Returns a specific task using its ID.

---

## Update Task

```http
PUT /api/tasks/{id}
```

Updates an existing task.

---

## Delete Task

```http
DELETE /api/tasks/{id}
```

Deletes an existing task.

---

## Filter Tasks by Date

The API supports retrieving tasks associated with a selected date.

Example:

```http
GET /api/tasks?date=2026-10-06
```

---

# 7. Task Data Model

Each task contains information such as:

| Field        | Description                         |
| ------------ | ----------------------------------- |
| ID           | Unique task identifier              |
| Title        | Name of the task                    |
| Description  | Detailed task information           |
| Status       | Current task state                  |
| Priority     | Importance of the task              |
| Task Date    | Date associated with the task       |
| Task Time    | Time associated with the task       |
| Created Date | Date when the task was created      |
| Updated Date | Date when the task was last updated |

---

# 8. Task Status

The application supports three task statuses.

### Pending

The task has been created but work has not started.

### In Progress

Work on the task is currently ongoing.

### Completed

The task has been successfully completed.

```text
Pending
   ↓
In Progress
   ↓
Completed
```

---

# 9. Task Priority

Tasks can have three priority levels:

### Low

Used for tasks that are not urgent.

### Medium

Used for normal-priority tasks.

### High

Used for important or urgent tasks.

---

# 10. Validation

Validation is implemented on both the frontend and backend.

The application validates:

* Task title
* Task date
* Task status
* Task priority
* Date format
* Task ID
* JSON request format

This prevents invalid data from being stored in the database.

---

# 11. Error Handling

The application handles different types of errors.

Examples include:

* Invalid JSON
* Missing task title
* Invalid task ID
* Invalid date
* Invalid status
* Invalid priority
* Task not found
* Database errors
* API errors

The backend returns appropriate HTTP responses and JSON error messages.

---

# 12. CORS Configuration

Since the frontend and backend are deployed separately, Cross-Origin Resource Sharing (CORS) is configured in the Go backend.

The backend reads the frontend URL from an environment variable:

```text
FRONTEND_URL
```

For production, this points to the deployed Vercel frontend.

```text
Vercel Frontend
      ↓
https://task-manager-topaz-chi.vercel.app
      ↓
Go Backend
      ↓
https://task-manager-api-nr8n.onrender.com
```

This allows the deployed frontend to communicate securely with the backend.

---

# 13. Environment Variables

Sensitive configuration is not stored directly in the source code.

The backend uses environment variables for configuration.

Example:

```text
PORT
DATABASE_URL
FRONTEND_URL
```

A `.env.example` file is included in the repository to show the required configuration without exposing sensitive credentials.

Actual secrets should never be committed to GitHub.

---

# 14. Database

PostgreSQL is used as the persistent database.

The database stores task information so that data remains available after the application is restarted.

The Go backend communicates with PostgreSQL using the `pgx` driver.

The general flow is:

```text
React
  ↓
Go API
  ↓
pgx
  ↓
PostgreSQL
```

---

# 15. Project Structure

```text
task-manager/
│
├── backend/
│   │
│   ├── database/
│   │   └── Database connection and queries
│   │
│   ├── handlers/
│   │   └── HTTP request handlers
│   │
│   ├── models/
│   │   └── Task data models
│   │
│   ├── routes/
│   │   └── API route configuration
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── go.mod
│   ├── go.sum
│   └── main.go
│
├── frontend/
│   │
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── vercel.json
│
├── README.md
└── DOCUMENTATION.md
```

---

# 16. Local Development Setup

## Prerequisites

Install the following:

* Go
* Node.js
* npm
* PostgreSQL
* Git

---

## Clone the Repository

```bash
git clone https://github.com/SamruddhiRaskar/task-manager.git
```

Navigate into the project:

```bash
cd task-manager
```

---

# 17. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install Go dependencies:

```bash
go mod download
```

Create a `.env` file based on `.env.example`.

Configure the required environment variables.

Then start the backend:

```bash
go run .
```

The backend will run on:

```text
http://localhost:8080
```

---

# 18. Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 19. Production Deployment

## Frontend

The React frontend is deployed using Vercel.

Live website:

https://task-manager-topaz-chi.vercel.app/

## Backend

The Go backend is deployed using Render.

Backend URL:

https://task-manager-api-nr8n.onrender.com

The production frontend communicates with the production backend using the configured `FRONTEND_URL`.

---

# 20. Deployment Flow

```text
                    GitHub
                       |
          ┌────────────┴────────────┐
          ↓                         ↓
       Vercel                    Render
          ↓                         ↓
   React Frontend               Go API
          │                         │
          └───────────┬─────────────┘
                      ↓
                  PostgreSQL
```

GitHub acts as the source code repository.

Vercel builds and hosts the frontend.

Render builds and runs the Go backend.

PostgreSQL stores the application data.

---

# 21. Testing Checklist

Before submitting the application, verify:

* [ ] Application loads successfully
* [ ] User can create a task
* [ ] User can view tasks
* [ ] User can update a task
* [ ] User can delete a task
* [ ] Task status works correctly
* [ ] Task priority works correctly
* [ ] Date filtering works correctly
* [ ] Invalid input is rejected
* [ ] API errors are handled
* [ ] Data persists after page refresh
* [ ] Production frontend communicates with backend
* [ ] Production deployment is accessible

---

# 22. Live Project

### Frontend

https://task-manager-topaz-chi.vercel.app/

### Backend

https://task-manager-api-nr8n.onrender.com

### Source Code

https://github.com/SamruddhiRaskar/task-manager

---

# 23. Future Improvements

Possible future improvements include:

* User authentication and authorization
* User-specific task management
* Search functionality
* Task sorting
* Pagination
* Notifications and reminders
* Dashboard analytics
* Mobile-responsive improvements
* Automated testing
* CI/CD pipeline
* Role-based access control

---

# 24. Conclusion

The Task Management Web Application demonstrates the development and deployment of a complete full-stack application.

The project combines:

* React for the frontend
* Go for REST API development
* PostgreSQL for persistent storage
* GitHub for source code management
* Vercel for frontend deployment
* Render for backend deployment

The project demonstrates practical concepts including CRUD operations, REST APIs, database integration, validation, error handling, CORS, environment variables, and production deployment.
