# Task Manager API

A RESTful API for managing tasks built with **Node.js** and **Express.js**, using in-memory storage seeded from `task.json`.

---

## Project Structure

```
task-manager-api/
├── app.js                        # Entry point — mounts routes, global middleware & error handlers
├── task.json                     # Seed data loaded at startup
├── src/
│   ├── routes/
│   │   └── taskRoutes.js         # URL → middleware → controller wiring
│   ├── controllers/
│   │   └── taskController.js     # HTTP request/response handling
│   ├── services/
│   │   └── taskService.js        # Business logic & in-memory data store
│   └── middleware/
│       └── validate.js           # Input validation middleware
└── test/
    └── server.test.js            # Tap + Supertest integration tests
```

### Layer responsibilities

| Layer | File | Responsibility |
|---|---|---|
| **Router** | `taskRoutes.js` | Maps HTTP verbs + paths to middleware chains |
| **Middleware** | `validate.js` | Rejects malformed requests before they reach the controller |
| **Controller** | `taskController.js` | Reads req, calls the service, writes res |
| **Service** | `taskService.js` | All data logic — CRUD, filtering, sorting; no HTTP knowledge |

---

## Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install

```bash
git clone <your-repo-url>
cd task-manager-api
npm install
```

### Run (development)

```bash
npm run dev     # nodemon — auto-restarts on file changes
```

### Run (production)

```bash
npm start
```

### Run tests

```bash
npm test
```

---

## Task Schema

```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "high",
  "createdAt": "2025-05-02T10:00:00.000Z"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | number | auto | Auto-incremented, read-only |
| `title` | string | ✅ | Non-empty |
| `description` | string | ✅ | |
| `completed` | boolean | ✅ | Must be `true` or `false` — not a string |
| `priority` | string | optional | `"low"` \| `"medium"` \| `"high"` — defaults to `"medium"` |
| `createdAt` | ISO 8601 | auto | Set on creation, read-only |

---

## API Endpoints

### `GET /tasks`

Retrieve all tasks. Supports optional query parameters for filtering and sorting.

**Query parameters**

| Param | Type | Description |
|---|---|---|
| `completed` | `true` \| `false` | Filter by completion status |
| `sort` | `asc` \| `desc` | Sort by `createdAt` |
| `priority` | `low` \| `medium` \| `high` | Filter by priority |

**Examples**

```bash
# All tasks
curl http://localhost:3000/tasks

# Only completed tasks
curl "http://localhost:3000/tasks?completed=true"

# Incomplete tasks sorted newest first
curl "http://localhost:3000/tasks?completed=false&sort=desc"

# High-priority tasks
curl "http://localhost:3000/tasks?priority=high"
```

**Response `200 OK`**

```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "high",
    "createdAt": "2025-05-02T10:00:00.000Z"
  }
]
```

---

### `GET /tasks/:id`

Retrieve a single task by its ID.

```bash
curl http://localhost:3000/tasks/1
```

**Response `200 OK`** — task object (see schema above)

**Response `404 Not Found`**

```json
{ "error": "Task with id 999 not found" }
```

---

### `GET /tasks/priority/:level`

Retrieve all tasks matching a specific priority level.

`:level` must be `low`, `medium`, or `high`.

```bash
curl http://localhost:3000/tasks/priority/high
```

**Response `200 OK`** — array of matching tasks

**Response `400 Bad Request`** — invalid level value

---

### `POST /tasks`

Create a new task.

**Request body**

```json
{
  "title": "Write unit tests",
  "description": "Cover all service functions",
  "completed": false,
  "priority": "high"
}
```

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write unit tests","description":"Cover all service functions","completed":false,"priority":"high"}'
```

**Response `201 Created`** — the newly created task (with `id` and `createdAt`)

**Response `400 Bad Request`** — missing or invalid fields

```json
{ "error": "title, description, and completed are all required" }
```

---

### `PUT /tasks/:id`

Replace an existing task entirely.

**Request body** — same shape as POST (all fields required)

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","description":"Updated description","completed":true,"priority":"low"}'
```

**Response `200 OK`** — the updated task

**Response `404 Not Found`** — task does not exist

**Response `400 Bad Request`** — invalid body (e.g., `completed: "true"`)

---

### `DELETE /tasks/:id`

Delete a task by ID.

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Response `200 OK`**

```json
{
  "message": "Task deleted successfully",
  "task": { "id": 1, "title": "...", "..." : "..." }
}
```

**Response `404 Not Found`** — task does not exist

---

## Error Reference

| Status | Meaning |
|---|---|
| `400 Bad Request` | Missing/invalid fields in request body or query params |
| `404 Not Found` | No task exists with the given ID |
| `500 Internal Server Error` | Unexpected server-side error |

---

## Running with Postman

1. Import a new request collection.
2. Set base URL to `http://localhost:3000`.
3. For `POST` and `PUT`, set **Body → raw → JSON** and paste the request body.
4. Send requests and inspect responses.

A sample Postman collection JSON is available in the `/docs` folder (if included in your repo).

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Testing**: [tap](https://node-tap.org/) + [supertest](https://github.com/ladjs/supertest)
- **Dev tooling**: nodemon


//Updated for PR submission