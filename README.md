# NestJS GraphQL API

This is a full-stack application built with TypeScript, Node.js, GraphQL, PostgreSQL, and React.

## Project Structure

- `/src` - Backend TypeScript/Node.js/GraphQL server
- `/frontend` - React frontend application

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn

## Getting Started

### Running with Docker Compose

1. Clone the repository
2. Start the application using Docker Compose:

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database
- Backend API (2 replicas)
- Frontend application

The services will be available at:
- Frontend: http://localhost:3000
- GraphQL API: http://localhost:4000/graphql
- PostgreSQL: localhost:5432

### Development Setup

#### Backend

1. Navigate to the root directory
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

#### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm start
```

## Features

- GraphQL API with Apollo Server
- TypeORM for database management
- CRUD operations for users
- City management with enum values
- React frontend with Apollo Client
- Docker containerization with multiple replicas
- PostgreSQL database

## API Operations

### Queries
- `users`: Get all users
- `user(id: ID!)`: Get a single user by ID

### Mutations
- `createUser(data: CreateUserInput!)`: Create a new user
- `updateUser(id: ID!, data: UpdateUserInput!)`: Update an existing user
- `deleteUser(id: ID!)`: Delete a user

## Data Structure

### User
- id: ID
- firstName: String
- lastName: String
- birthDate: DateTime
- city: City
- createdAt: DateTime
- updatedAt: DateTime

### City (Enum)
- Or-Yehuda
- Tel-Aviv
- Jerusalem
- Haifa 