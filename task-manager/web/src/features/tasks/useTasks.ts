import { useEffect, useState } from "react";
import { apiRequest, fetchTasks } from "./tasks.api";
import type { StatusFilter, Task, TaskEditFields, TaskStatus } from "./tasks.types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [loadedFilter, setLoadedFilter] = useState<StatusFilter | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);
  const isLoading = loadedFilter !== filter;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    fetchTasks(filter)
      .then((result) => {
        if (isCurrent) {
          setTasks(result);
          setError("");
          setLoadFailed(false);
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(requestError instanceof Error ? requestError.message : "โหลดรายการงานไม่สำเร็จ");
          setLoadFailed(true);
        }
      })
      .finally(() => {
        if (isCurrent) setLoadedFilter(filter);
      });

    return () => {
      isCurrent = false;
    };
  }, [filter, refreshToken]);

  async function reloadTasks() {
    setTasks(await fetchTasks(filter));
  }

  async function createTask() {
    setIsSubmitting(true);
    setError("");
    try {
      await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description, dueDate: dueDate || null }),
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      await reloadTasks();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "สร้างงานไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function changeStatus(task: Task, status: TaskStatus) {
    setBusyTaskId(task.id);
    setError("");
    try {
      const result = (await apiRequest(`/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })) as { task: Task };
      setTasks((current) => current.map((item) => (item.id === task.id ? result.task : item)));
      if (filter !== "ALL" && filter !== status) await reloadTasks();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "เปลี่ยนสถานะไม่สำเร็จ");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function saveTask(taskId: string, fields: TaskEditFields) {
    setBusyTaskId(taskId);
    setError("");
    try {
      const result = (await apiRequest(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(fields),
      })) as { task: Task };
      setTasks((current) => current.map((item) => (item.id === taskId ? result.task : item)));
      setEditingTaskId(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "บันทึกการแก้ไขไม่สำเร็จ");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function removeTask(task: Task) {
    if (!window.confirm(`ลบงาน “${task.title}” หรือไม่?`)) return;
    setBusyTaskId(task.id);
    setError("");
    try {
      await apiRequest(`/tasks/${task.id}`, { method: "DELETE" });
      setTasks((current) => current.filter((item) => item.id !== task.id));
      if (editingTaskId === task.id) setEditingTaskId(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "ลบงานไม่สำเร็จ");
    } finally {
      setBusyTaskId(null);
    }
  }

  return {
    tasks,
    filter,
    setFilter,
    isLoading,
    loadFailed,
    isSubmitting,
    busyTaskId,
    error,
    clearError: () => setError(""),
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    editingTaskId,
    setEditingTaskId,
    retry: () => setRefreshToken((value) => value + 1),
    createTask,
    changeStatus,
    saveTask,
    removeTask,
  };
}

export type UseTasksResult = ReturnType<typeof useTasks>;