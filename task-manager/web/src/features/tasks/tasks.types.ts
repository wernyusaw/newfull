export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const FILTERS = ["ALL", ...TASK_STATUSES] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type StatusFilter = (typeof FILTERS)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskEditFields {
  title: string;
  description: string;
  dueDate: string | null;
}

export const STATUS_LABELS: Record<StatusFilter, string> = {
  ALL: "ทั้งหมด",
  TODO: "ต้องทำ",
  IN_PROGRESS: "กำลังทำ",
  DONE: "เสร็จแล้ว",
};