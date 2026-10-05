import { TASK_STATUSES } from "../../constants/tasks/tasks-status.constants.js";
import { type TaskFields, type TaskStatus } from "../../models/tasks/tasks.model.js";
import { TaskValidationError } from "../../errors/tasks/task.errors.js";

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && TASK_STATUSES.includes(value as TaskStatus);
}

function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateTaskFields(value: unknown, partial: boolean): Partial<TaskFields> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TaskValidationError("Request body must be a JSON object.");
  }

  const input = value as Record<string, unknown>;
  const allowedFields = ["title", "description", "status", "dueDate"];
  const suppliedFields = Object.keys(input);

  if (suppliedFields.some((field) => !allowedFields.includes(field))) {
    throw new TaskValidationError("Request contains an unsupported field.");
  }
  if (partial && suppliedFields.length === 0) {
    throw new TaskValidationError("Provide at least one field to update.");
  }
  if (!partial && typeof input.title !== "string") {
    throw new TaskValidationError("Title is required.");
  }

  const fields: Partial<TaskFields> = {};

  if ("title" in input) {
    if (typeof input.title !== "string" || !input.title.trim()) {
      throw new TaskValidationError("Title cannot be empty.");
    }
    const title = input.title.trim();
    if (title.length > 120) {
      throw new TaskValidationError("Title must be 120 characters or fewer.");
    }
    fields.title = title;
  }

  if ("description" in input) {
    if (typeof input.description !== "string" || input.description.length > 2000) {
      throw new TaskValidationError("Description must be 2000 characters or fewer.");
    }
    fields.description = input.description.trim();
  } else if (!partial) {
    fields.description = "";
  }

  if ("status" in input) {
    if (!isTaskStatus(input.status)) {
      throw new TaskValidationError("Status must be TODO, IN_PROGRESS, or DONE.");
    }
    fields.status = input.status;
  } else if (!partial) {
    fields.status = "TODO";
  }

  if ("dueDate" in input) {
    if (input.dueDate !== null && (typeof input.dueDate !== "string" || !isDateOnly(input.dueDate))) {
      throw new TaskValidationError("Due date must be a valid YYYY-MM-DD date or null.");
    }
    fields.dueDate = input.dueDate as string | null;
  } else if (!partial) {
    fields.dueDate = null;
  }

  return fields;
}