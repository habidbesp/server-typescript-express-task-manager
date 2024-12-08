# Project & Task Management API

This is a backend application built with Node.js, Express, and MongoDB. It provides an API to manage projects and tasks, where each project can have multiple tasks, and each task belongs to a single project.

## Features

- **Project Management:** Create, read, update, and delete projects.
- **Task Management:** Create, read, update, and delete tasks.
- **Validation:** Input validation using `express-validator`.
- **Database:** MongoDB as the database, with models defined using Mongoose.
- **Relationships:** Tasks are associated with a specific project.
- **Testing:** Routes were tested using **ThunderClient**.

## Technologies Used

- **Node.js:** Runtime environment for building server-side applications.
- **Express:** Web framework for building RESTful APIs.
- **MongoDB:** NoSQL database for storing data.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
- **Express Validator:** Middleware for validating incoming request data.
- **ThunderClient:** Lightweight VS Code extension for testing API endpoints.

## Installation

1. Clone the repository:

   ```bash
    git clone https://github.com/habidbesp/server-typescript-express-task-manager.git
    cd server-typescript-express-task-manager
   ```

2. Install dependencies:

   ```bash
    npm install
   ```

3. Set up the environment variables. Create a .env file in the root directory and add the following variables:

   ```env
   PORT=<your-preferred-port-of-use>
   MONGO_URI=mongodb://localhost:27017/project-task-management
   ```

   - If PORT is not provided, the application will default to port 4000.

4. Start the development server:

   ```bash
   npm run dev
   ```

   if PORT is not set, the server will run on http://localhost:4000

## API Endpoints

### Projects

Create a new project

- POST /api/projects
- Request body (example):
  ```json
  {
    "projectName": "Project Name",
    "clientName": "Client Name",
    "description": "Project Description"
  }
  ```
  Get all projects
- GET `/api/projects`

Get a single project

- GET `/api/projects/:id`

Update a project

- PUT `/api/projects/:projectId`
- Request body:
  ```json
  {
    "projectName": "Updated Project Name",
    "clientName": "Updated Client Name",
    "description": "Updated Project Description"
  }
  ```

Delete a project

- DELETE `/api/projects/:projectId`

### Tasks

Create a new task

- POST `/api/projects/:projectId/tasks`
- Request body:
  ```json
  {
    "name": "Task Name",
    "description": "Task Description"
  }
  ```

Get all tasks

- GET `/api/projects/:projectId/tasks`

Get a single task

- GET `/api/projects/:projectId/tasks/:taskId`

Update a task

- PUT `/api/projects/:projectId/tasks/:taskId`

- Request body:

  ```json
  {
    "name": "Updated Task Name",
    "description": "Updated Task Description"
  }
  ```

Delete a task

- DELETE `/api/projects/:projectId/tasks/:taskId`

Update task status

- POST `/api/projects/:projectId/tasks/:taskId/status`
- Request body:

  ```json
  {
    "status": "completed"
  }
  ```

## Database Models

### Project

- Schema:

  ```typescript

  ```
