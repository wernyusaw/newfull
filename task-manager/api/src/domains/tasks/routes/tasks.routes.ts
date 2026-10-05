import { Router } from "express";
import { type TaskStatus } from "../models/tasks/tasks.model.js";
import { sendTaskError, sendTaskNotFound, TaskValidationError } from "../errors/tasks/task.errors.js";
import { isTaskStatus } from "../validation/tasks/tasks.validation.js";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "../repositories/tasks/tasks.repository.js";

const taskRoutes = Router();

taskRoutes.get("/", (request, response) => {
  const status = request.query.status;
  if (status !== undefined && !isTaskStatus(status)) {
    sendTaskError(response, new TaskValidationError("Status filter must be TODO, IN_PROGRESS, or DONE."));
    return;
  }

  response.status(200).json({ tasks: listTasks(status as TaskStatus | undefined) });
});

taskRoutes.get("/:id", (request, response) => {
  const task = getTask(request.params.id);
  if (!task) {
    sendTaskNotFound(response);
    return;
  }
  response.status(200).json({ task });
});

taskRoutes.post("/", (request, response) => {
  try {
    response.status(201).json({ task: createTask(request.body) });
  } catch (error) {
    sendTaskError(response, error);
  }
});

taskRoutes.patch("/:id", (request, response) => {
  try {
    const task = updateTask(request.params.id, request.body);
    if (!task) {
      sendTaskNotFound(response);
      return;
    }
    response.status(200).json({ task });
  } catch (error) {
    sendTaskError(response, error);
  }
});

taskRoutes.delete("/:id", (request, response) => {
  if (!deleteTask(request.params.id)) {
    sendTaskNotFound(response);
    return;
  }
  response.status(204).send();
});

export default taskRoutes;