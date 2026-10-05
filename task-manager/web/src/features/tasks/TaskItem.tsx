import type { SubmitEvent } from "react";
import { useState } from "react";
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskEditFields, type TaskStatus } from "./tasks.types";

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  isBusy: boolean;
  onStartEditing: (taskId: string) => void;
  onCancelEditing: () => void;
  onSave: (taskId: string, fields: TaskEditFields) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onRemove: (task: Task) => void;
}

export function TaskItem({
  task,
  isEditing,
  isBusy,
  onStartEditing,
  onCancelEditing,
  onSave,
  onStatusChange,
  onRemove,
}: TaskItemProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");

  function startEditing() {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate ?? "");
    onStartEditing(task.id);
  }

  function saveTask(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(task.id, { title, description, dueDate: dueDate || null });
  }

  return (
    <li className="task-item">
      {isEditing ? (
        <form className="edit-form" onSubmit={saveTask}>
          <label htmlFor={`edit-title-${task.id}`}>ชื่องาน</label>
          <input
            id={`edit-title-${task.id}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            required
          />
          <label htmlFor={`edit-description-${task.id}`}>รายละเอียด</label>
          <textarea
            id={`edit-description-${task.id}`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
            rows={3}
          />
          <label htmlFor={`edit-date-${task.id}`}>วันครบกำหนด</label>
          <input
            id={`edit-date-${task.id}`}
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
          <div className="task-actions">
            <button className="small-primary-button" type="submit" disabled={isBusy}>
              บันทึก
            </button>
            <button className="text-button" type="button" onClick={onCancelEditing}>
              ยกเลิก
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-content">
            <div className="task-title-row">
              <h3>{task.title}</h3>
              <span className={`status-dot status-${task.status.toLowerCase()}`} aria-hidden="true" />
            </div>
            {task.description && <p className="task-description">{task.description}</p>}
            <div className="task-meta">
              <label className="status-control">
                <span className="visually-hidden">สถานะของ {task.title}</span>
                <select
                  value={task.status}
                  disabled={isBusy}
                  onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)}
                >
                  {TASK_STATUSES.map((status) => (
                    <option value={status} key={status}>{STATUS_LABELS[status]}</option>
                  ))}
                </select>
              </label>
              {task.dueDate && <span className="due-date">ครบกำหนด {task.dueDate}</span>}
            </div>
          </div>
          <div className="task-actions">
            <button className="text-button" type="button" onClick={startEditing}>
              แก้ไข
            </button>
            <button
              className="text-button delete-button"
              type="button"
              disabled={isBusy}
              onClick={() => onRemove(task)}
            >
              ลบ
            </button>
          </div>
        </>
      )}
    </li>
  );
}