import { TASK_STATUSES } from "../../constants/tasks/tasks-status.constants.js";

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskFields = Pick<Task, "title" | "description" | "status" | "dueDate">;