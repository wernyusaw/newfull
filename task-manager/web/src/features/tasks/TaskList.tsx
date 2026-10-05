import { TaskFilters } from "./TaskFilters";
import { TaskItem } from "./TaskItem";
import { type TaskListProps } from "./TaskList.types";
import { STATUS_LABELS } from "./tasks.types";

export function TaskList({
  tasks,
  filter,
  isLoading,
  loadFailed,
  error,
  editingTaskId,
  busyTaskId,
  onFilterChange,
  onRetry,
  onStartEditing,
  onCancelEditing,
  onSave,
  onStatusChange,
  onRemove,
}: TaskListProps) {
  return (
    <section className="list-panel" aria-labelledby="list-heading">
      <div className="list-header">
        <div className="section-heading">
          <span className="section-index">02</span>
          <h2 id="list-heading">รายการงาน</h2>
        </div>
        <TaskFilters filter={filter} onFilterChange={onFilterChange} />
      </div>

      {isLoading ? (
        <div className="list-message" role="status">กำลังโหลดรายการงาน...</div>
      ) : loadFailed ? (
        <div className="list-message" role="alert">
          <p>{error || "โหลดรายการงานไม่สำเร็จ"}</p>
          <button className="text-button" type="button" onClick={onRetry}>
            ลองอีกครั้ง
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">—</span>
          <h3>{filter === "ALL" ? "ยังไม่มีงานในรายการ" : `ไม่มีงาน${STATUS_LABELS[filter]}`}</h3>
          <p>{filter === "ALL" ? "เพิ่มงานแรกจากแบบฟอร์ม แล้วรายการของคุณจะอยู่ที่นี่" : "ลองเลือกสถานะอื่น หรือเพิ่มงานใหม่"}</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isEditing={editingTaskId === task.id}
              isBusy={busyTaskId === task.id}
              onStartEditing={onStartEditing}
              onCancelEditing={onCancelEditing}
              onSave={onSave}
              onStatusChange={onStatusChange}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </section>
  );
}