import type { StatusFilter, Task, TaskEditFields, TaskStatus } from "./tasks.types";

export interface TaskListProps {
  tasks: Task[];
  filter: StatusFilter;
  isLoading: boolean;
  loadFailed: boolean;
  error: string;
  editingTaskId: string | null;
  busyTaskId: string | null;
  onFilterChange: (filter: StatusFilter) => void;
  onRetry: () => void;
  onStartEditing: (taskId: string) => void;
  onCancelEditing: () => void;
  onSave: (taskId: string, fields: TaskEditFields) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onRemove: (task: Task) => void;
}