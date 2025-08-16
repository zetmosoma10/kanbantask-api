# KANBAN TASK API

A RESTful API built with **Node**, **Typescript**, **Express** and **MongoDB** for managing Boards, Columns and Task with CRUD operations and jwt authentication.

## TABLE OF CONTENT

- [Features](#Features)
- [Tech Stack](#Tech-Stack)
- [Prerequisites](#Prerequisites)
- [Installation](#Installation)
- [Usage](#Usage)
- [Environment Variables](#Environment-variables)
- [API Endpoints](#API-Endpoints)

## ✨ Features

- User authentication with jsonwebtoken
- User upload profile image to cloudinary
- User forgot/reset password functionality
- Sending user real emails
- Perform CRUD operations on Boards, Columns and Tasks
- Add subtasks on Tasks, and mark subtask as completed

## 🔧 Tech-Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Typescript** - Static typing
- **MongoDB + Mongoose** - Database and ORM
- **Jsonwebtoken** - Authentication
- **Zod** - Data validations

## 📑 Prerequisites

- [Node.js]('https://nodejs.org/en')
- [MongoDB]('https://www.mongodb.com/')

# 📦 Installation

### Clone the repository

```bash
git clone https://github.com/zetmosoma10/kanbantasks-api.git
cd kanbantasks-api
```

### Install dependencies

```bash
npm install
```

### Build the TypeScript code

```bash
npm run build
```

## 🔑 Environment Variables

- PORT=your port
- NODE_ENV=your environment
- KANBAN_DB_CONN_STR=your database connection string
- KANBAN_JWT_SECRET=your jwt secret string
- KANBAN_EMAIL_HOST=your email host
- KANBAN_EMAIL_SERVICES=your email services
- KANBAN_EMAIL_USER=your email
- KANBAN_EMAIL_PORT=your email port
- KANBAN_EMAIL_PASS=your email password
- KANBAN_CLIENT=your frontend website url
- CLOUD_NAME=your cloudinary name
- CLOUD_API_KEY=your cloudinary api key
- CLOUD_API_SECRET=your cloudinary api secret

## 🚀 Usage

### Start dev server

```bash
npm run dev
```

### Build and run for production

```bash
npm run build
npm start
```

## 📡 API Endpoints

| Method | Endpoint                  | Description         | Auth Required |
| ------ | ------------------------- | ------------------- | ------------- |
| POST   | /api/auth/register        | Register new user   | No            |
| POST   | /api/auth/login           | Login user          | No            |
| POST   | /api/auth/forgot-password | forgot password     | No            |
| PATCH  | /api/auth/reset-password  | reset password      | No            |
| GET    | /api/user/me              | Get Login User      | Yes           |
| POST   | /api/user/delete-account  | Delete User Account | Yes           |
| PATCH  | /api/user/upload-image    | Upload User Image   | Yes           |
| DELETE | /api/user/delete-image    | Delete User Image   | Yes           |
| POST   | /api/boards               | Create User Board   | Yes           |
| GET    | /api/boards               | Get all User Boards | Yes           |
| PATCH  | /api/boards/:id           | Update Board        | Yes           |
| DELETE | /api/boards/:id           | Delete Board        | Yes           |
| POST   | /api/columns              | Create Column       | Yes           |
| GET    | /api/columns              | Get all Use Columns | Yes           |
| DELETE | /api/columns/:id          | Delete Column       | Yes           |
| POST   | /api/tasks                | Create task         | Yes           |
| PATCH  | /api/tasks/:id            | Update task         | Yes           |
| DELETE | /api/tasks/:id            | Delete task         | Yes           |
