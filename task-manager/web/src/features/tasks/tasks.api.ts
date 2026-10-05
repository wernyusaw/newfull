import type { StatusFilter, Task } from "./tasks.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function apiRequest(path: string, init: RequestInit = {}): Promise<unknown> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    throw new Error(payload?.error?.message ?? `เกิดข้อผิดพลาด (${response.status})`);
  }

  return response.status === 204 ? null : response.json();
}

export async function fetchTasks(filter: StatusFilter): Promise<Task[]> {
  const query = filter === "ALL" ? "" : `?status=${filter}`;
  const result = (await apiRequest(`/tasks${query}`)) as { tasks: Task[] };
  return result.tasks;
}