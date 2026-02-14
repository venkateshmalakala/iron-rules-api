# Iron Rules Fitness API

This API is a fitness management system designed with three "Iron Rules" of validation across different architectural layers: Runtime (Zod), Business Logic (Controllers), and Database (Atomic Transactions).

## Setup & Installation

1.  **Build and Start Containers:**
    ```bash
    docker-compose up --build
    ```

2.  **Sync Database Schema:**
    ```bash
    npx prisma db push
    ```

3.  **Seed the Data:**
    ```bash
    docker exec -it iron-rules-api-db-1 psql -U user -d fitness -f /docker-entrypoint-initdb.d/seed.sql
    ```

---

## ️ The Iron Rules: Evaluator's Testing Guide

This guide provides specific actions and expected JSON outputs to verify that the logic is working correctly at the Runtime, Controller, and Database levels.

### 1. Test Rule 1: Gym Capacity (Database Layer)

**Goal:** Prove that a gym cannot exceed its maximum capacity using an atomic transaction.

**Setup:** The `seed.sql` creates "Elite Fitness" (`gym_elite_01`) with a capacity of 2 and enrolls 1 member (`member_venkatesh_01`).

**Step 1:** Send a `POST` request to `http://localhost:3000/api/members/member_malakala_02/enrollments`.

*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/members/member_malakala_02/enrollments`
*   **Body:**
    ```json
    {
      "gymId": "gym_elite_01",
      "membershipTier": "Gold"
    }
    ```
*   **Result:** `201 Created` (Gym is now 2/2 full).

**Step 2 (The Failure):** Send the exact same request again.

*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/members/member_malakala_02/enrollments`
*   **Body:**
    ```json
    {
      "gymId": "gym_elite_01",
      "membershipTier": "Gold"
    }
    ```
*   **Expected Response:**
    *   **Status Code:** `400 Bad Request`
    *   **JSON Body:**
        ```json
        {
          "success": false,
          "error": {
            "layer": "database",
            "message": "Gym has reached maximum capacity"
          }
        }
        ```

### 2. Test Rule 2: Trainer Limits (Business Logic Layer)

**Goal:** Prove that an "Advanced" trainer is limited to 3 gym assignments.

**Setup:** `trainer_vikram_01` (Advanced) is already assigned to 2 gyms via `seed.sql`.

**Step 1:** Send a `POST` request to `http://localhost:3000/api/trainers/trainer_vikram_01/assignments`.

*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/trainers/trainer_vikram_01/assignments`
*   **Body:**
    ```json
    {
      "gymId": "gym_flex_03"
    }
    ```
*   **Result:** `201 Created` (Trainer is now at 3/3 limit).

**Step 2 (The Failure):** Change the body to `{"gymId": "gym_iron_04"}` and send again.

*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/trainers/trainer_vikram_01/assignments`
*   **Body:**
    ```json
    {
      "gymId": "gym_iron_04"
    }
    ```
*   **Expected Response:**
    *   **Status Code:** `400 Bad Request`
    *   **JSON Body:**
        ```json
        {
          "success": false,
          "error": {
            "layer": "runtime",
            "message": "Trainer with advanced certification cannot be assigned to more than 3 gyms"
          }
        }
        ```

### 3. Test Rule 3: Error Contract (Zod/Middleware Layer)

**Goal:** Prove that all errors follow the mandatory JSON format with the `layer` field.

**Action:** Send a `POST` request to `http://localhost:3000/api/gyms` with an invalid capacity.

*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/gyms`
*   **Body:**
    ```json
    {
      "name": "Validation Gym",
      "capacity": 0,
      "address": { "street": "Test", "city": "Test", "country": "Test" }
    }
    ```
*   **Expected Response:**
    *   **Status Code:** `400 Bad Request`
    *   **JSON Body:**
        ```json
        {
          "success": false,
          "error": {
            "layer": "runtime",
            "errors": [
              {
                "field": "capacity",
                "message": "Number must be greater than 0"
              }
            ]
          }
        }
        ```

---

## ️ Evaluator Tips

*   **Port:** The API runs on `3000` inside the Docker container.
*   **Prefix:** All endpoints are prefixed with `/api`.

---

## Tech Stack

*   **Runtime:** Node.js (v22)
*   **Database:** PostgreSQL (v14)
*   **ORM:** Prisma
*   **Validation:** Zod
*   **Containerization:** Docker & Docker Compose