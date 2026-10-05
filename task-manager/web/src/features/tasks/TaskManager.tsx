"use client";

import { TaskManagerView } from "./TaskManagerView";
import { useTasks } from "./useTasks";

export function TaskManager() {
  const taskState = useTasks();
  return <TaskManagerView {...taskState} />;
}