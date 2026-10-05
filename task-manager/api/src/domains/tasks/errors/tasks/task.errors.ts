import type { Response } from "express";

export class TaskValidationError extends Error {}

export function sendTaskError(response: Response, error: unknown): void {
  if (error instanceof TaskValidationError) {
    response.status(400).json({ error: { code: "VALIDATION_ERROR", message: error.message } });
    return;
  }

  response.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
  });
}

export function sendTaskNotFound(response: Response): void {
  response.status(404).json({ error: { code: "NOT_FOUND", message: "Task was not found." } });
}