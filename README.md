# Iron Rules Fitness API

This API is a fitness management system designed with three "Iron Rules" of validation across different architectural layers: Runtime (Zod), Business Logic (Controllers), and Database (Atomic Transactions).

**Repository Link:** [https://github.com/venkateshmalakala/iron-rules-api.git](https://github.com/venkateshmalakala/iron-rules-api.git)

---

## 🚀 Setup & Installation

The entire environment is containerized and automated. You do not need to run manual migrations or seed commands.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/venkateshmalakala/iron-rules-api.git](https://github.com/venkateshmalakala/iron-rules-api.git)
   cd iron-rules-api
   ```

2. **Start the system:**
   ```bash
   docker-compose up --build
   ```
## What to expect after startup
Once the process is complete, you should see the following sequence in your terminal logs:

**Database Health:** The db-1 container initializes:

```
database system is ready to accept connections
```

**Prisma Sync:** The app-1 container automatically syncs the schema:

```
Your database is now in sync with your Prisma schema.
```

**Seeding:** The app-1 container populates the test data:

```
Running seed command psql -h db -U user -d fitness -f prisma/seed.sql ...
```

**API Live:** The final confirmation message:

```
Iron Rules API running on port 3000
```

## ️ The Iron Rules: Evaluator's Testing Guide
### 1. Rule 1: Gym Capacity (Database Layer)
**Goal:** Prove that a gym cannot exceed its maximum capacity using an atomic transaction.

**Setup:** `gym_elite_01` (Elite Fitness) has a capacity of 2.

**Action:** Send a POST request to enroll a member.

**URL:** `POST http://localhost:3000/api/members/member_malakala_02/enrollments`

**Body:**

```JSON
{
  "gymId": "gym_elite_01",
  "membershipTier": "Gold"
}
```
**Expected Result:**
* The first request returns `201 Created`.

* The second request returns `400 Bad Request` with:

```JSON
{
  "success": false,
  "error": {
    "layer": "database",
    "message": "Gym has reached maximum capacity"
  }
}
```
### 2. Rule 2: Trainer Limits (Business Logic Layer)
**Goal:** Prove that an "Advanced" trainer is limited to 3 gym assignments.

**Setup:** `trainer_vikram_01` is already assigned to 2 gyms.

**URL:** `POST http://localhost:3000/api/trainers/trainer_vikram_01/assignments`

**Body:** `{"gymId": "gym_flex_03"}`

**Expected Result:** Success (`201`). Attempting a 4th assignment to a new gym will return:

```JSON
{
  "success": false,
  "error": {
    "layer": "runtime",
    "message": "Trainer with advanced certification cannot be assigned to more than 3 gyms"
  }
}
```
### 3. Rule 3: Error Contract (Zod/Middleware Layer)
**Goal:** Prove all errors follow the mandatory JSON  format with the `layer` field.

**Action:** Send a POST request to `/api/gyms` with an invalid (0) capacity.

**URL:** `POST http://localhost:3000/api/gyms`

**Body:** `{"name": "Validation Gym", "capacity": 0, "address": "..."}`

**Expected Result:**

```JSON
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
## Tech Stack
**Runtime:** Node.js (v22)

**Database:** PostgreSQL (v14)

**ORM:** Prisma

**Validation:** Zod

**Containerization:** Docker & Docker Compose