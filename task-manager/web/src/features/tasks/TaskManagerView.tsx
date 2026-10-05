import type { SubmitEvent } from "react";
import Link from "next/link";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import type { UseTasksResult } from "./useTasks";

type TaskManagerViewProps = UseTasksResult;

export function TaskManagerView({
  tasks,
  filter,
  setFilter,
  isLoading,
  loadFailed,
  isSubmitting,
  busyTaskId,
  error,
  clearError,
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  editingTaskId,
  setEditingTaskId,
  retry,
  createTask,
  changeStatus,
  saveTask,
  removeTask,
}: TaskManagerViewProps) {
  async function handleCreateTask(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    await createTask();
  }

  return (
    <main className="workspace">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Task Manager หน้าหลัก">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>Task Manager</span>
        </Link>
        <span className="workspace-label">พื้นที่ส่วนตัว</span>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">งานของฉัน</p>
          <h1>จัดการงาน</h1>
          <p className="heading-copy">รวบรวมสิ่งที่ต้องทำ แล้วค่อย ๆ ขยับไปให้เสร็จ</p>
        </div>
        <div className="task-total" aria-live="polite">
          <strong>{tasks.length}</strong>
          <span>งานในมุมมองนี้</span>
        </div>
      </section>

      {error && !loadFailed && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button className="text-button" type="button" onClick={clearError}>
            ปิด
          </button>
        </div>
      )}

      <div className="task-layout">
        <TaskForm
          title={title}
          description={description}
          dueDate={dueDate}
          isSubmitting={isSubmitting}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onDueDateChange={setDueDate}
          onSubmit={handleCreateTask}
        />

        <TaskList
          tasks={tasks}
          filter={filter}
          isLoading={isLoading}
          loadFailed={loadFailed}
          error={error}
          editingTaskId={editingTaskId}
          busyTaskId={busyTaskId}
          onFilterChange={setFilter}
          onRetry={retry}
          onStartEditing={setEditingTaskId}
          onCancelEditing={() => setEditingTaskId(null)}
          onSave={saveTask}
          onStatusChange={changeStatus}
          onRemove={removeTask}
        />
      </div>
      <footer className="page-footer">Task Manager <span>·</span> เวอร์ชันฝึกใช้งานส่วนตัว</footer>
    </main>
  );
}