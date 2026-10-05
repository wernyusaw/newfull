import { randomUUID } from "node:crypto";
import { type Task, type TaskFields, type TaskStatus } from "../../models/tasks/tasks.model.js";
import { validateTaskFields } from "../../validation/tasks/tasks.validation.js";

const tasks = new Map<string, Task>();

export function listTasks(status?: TaskStatus): Task[] {
  return [...tasks.values()]
    .filter((task) => !status || task.status === status)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export function getTask(id: string): Task | undefined {
  return tasks.get(id);
}

export function createTask(value: unknown): Task {
  const fields = validateTaskFields(value, false) as TaskFields;
  const now = new Date().toISOString();
  const task: Task = {
    id: randomUUID(),
    ...fields,
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(task.id, task);
  return task;
}

export function updateTask(id: string, value: unknown): Task | undefined {
  const current = tasks.get(id);
  if (!current) return undefined;

  const fields = validateTaskFields(value, true);
  const updated: Task = { ...current, ...fields, updatedAt: new Date().toISOString() };
  tasks.set(id, updated);
  return updated;
}

export function deleteTask(id: string): boolean {
  return tasks.delete(id);
}