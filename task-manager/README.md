# Task Manager

Learning project for a single-user task manager.

## Current features

- Create tasks with a title, description, and optional due date
- List tasks and filter them by `TODO`, `IN_PROGRESS`, or `DONE`
- Edit task details, change status, and delete tasks
- `web/`: Next.js with React and TypeScript
- `api/`: standalone Node.js API with Express and TypeScript

## Frontend structure

```text
web/src/
  app/page.tsx                  # route / renders the task manager
  features/tasks/
    TaskManager.tsx             # connects task state to the page view
    TaskManagerView.tsx         # page markup and component composition
    useTasks.ts                 # task state, loading, and CRUD actions
    TaskForm.tsx                # create form
    TaskFilters.tsx             # status filters
    TaskList.tsx                # loading, error, empty, and list views
    TaskList.types.ts           # props contract for TaskList
    TaskItem.tsx                # task details and edit form
    tasks.api.ts                # requests to the standalone Node API
    tasks.types.ts              # task types and status labels
```

## API structure

```text
api/src/
  server.ts
  domains/tasks/
    constants/task-status.constants.ts
    errors/task.errors.ts
    models/task.model.ts
    repositories/tasks/tasks.repository.ts
    routes/health/health.routes.ts
    routes/tasks/tasks.routes.ts
    validation/tasks/task.validation.ts
```

Each domain owns its route definitions and domain-specific logic. Register new domain routers in `api/src/server.ts` without putting endpoint handlers there.

The API contract is implemented at `/api/v1/tasks`:

| Method | Endpoint | Result |
| --- | --- | --- |
| `GET` | `/api/v1/tasks?status=TODO` | List tasks, optionally filtered by status |
| `GET` | `/api/v1/tasks/:id` | Get one task |
| `POST` | `/api/v1/tasks` | Create a task (`201`) |
| `PATCH` | `/api/v1/tasks/:id` | Update task fields (`200`) |
| `DELETE` | `/api/v1/tasks/:id` | Delete a task (`204`) |

The API also exposes `GET /health`. Validation errors return `400`, and requests for unknown task IDs return `404`. Task data is currently held in memory and is cleared when the API process restarts; persistent database storage has not been added yet.

## Requirements

- Node.js 20 or later and npm
- Go is not required for the initial Next.js and Node.js setup

## Run locally

Install dependencies in each app:

```powershell
cd api
npm install
```

```powershell
cd web
npm install
```

Start the API in one terminal:

```powershell
cd api
npm run dev
```

Start the frontend in another terminal:

```powershell
cd web
npm run dev
```

The frontend is available at <http://localhost:3000>. The API health check is at <http://localhost:4000/health>.

The API reads `PORT` (default `4000`) and `FRONTEND_ORIGIN` (default `http://localhost:3000`) from the environment.