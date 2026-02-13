# Iron Rules API

A Type-Safe Fitness Tracking API with Multi-Level Schema Validation.

## Architecture Overview

This project implements a three-layer validation model:

1.  **TypeScript (Compile-Time Layer):** Enforces the shape and type of data during development.
2.  **Zod (Application Runtime Layer):** Validates external data as it enters the system via API requests.
3.  **PostgreSQL (Database Layer):** Enforces data integrity at the storage level using constraints.

The application is built with Node.js, Express, TypeScript, Prisma, Zod, and PostgreSQL. It is fully containerized using Docker.

## Setup Instructions

1.  Ensure you have Docker and Docker Compose installed and running.
2.  Create a `.env` file from the `.env.example` file and fill in the required environment variables.
3.  Run the following command to start the application:

    ```bash
    docker-compose up --build -d
    ```

## API Usage Examples

### Create a Gym

**Request:**

`POST /api/gyms`

```json
{
  "name": "Gold's Gym",
  "capacity": 100,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "country": "USA"
  }
}
```

**Response:**

`201 Created`

```json
{
  "id": "clx...",
  "name": "Gold's Gym",
  "capacity": 100,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "country": "USA"
  }
}
```

### Enroll a Member

**Request:**

`POST /api/members/{memberId}/enrollments`

```json
{
  "gymId": "clx...",
  "membershipTier": "premium"
}
```

**Response:**

`201 Created`

```json
{
  "id": "clx...",
  "memberId": "clx...",
  "gymId": "clx...",
  "membershipTier": "premium"
}
```
