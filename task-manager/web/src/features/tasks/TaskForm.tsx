import type { SubmitEvent } from "react";

interface TaskFormProps {
  title: string;
  description: string;
  dueDate: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

export function TaskForm({
  title,
  description,
  dueDate,
  isSubmitting,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onSubmit,
}: TaskFormProps) {
  return (
    <section className="create-panel" aria-labelledby="create-heading">
      <div className="section-heading">
        <span className="section-index">01</span>
        <h2 id="create-heading">เพิ่มงานใหม่</h2>
      </div>
      <form className="task-form" onSubmit={onSubmit}>
        <label htmlFor="new-title">ชื่องาน <span aria-hidden="true">*</span></label>
        <input
          id="new-title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          maxLength={120}
          placeholder="เช่น อ่านเอกสาร API"
          required
        />

        <label htmlFor="new-description">รายละเอียด</label>
        <textarea
          id="new-description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="ข้อมูลเพิ่มเติมของงานนี้"
        />

        <label htmlFor="new-due-date">วันครบกำหนด</label>
        <input
          id="new-due-date"
          type="date"
          value={dueDate}
          onChange={(event) => onDueDateChange(event.target.value)}
        />

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "กำลังบันทึก..." : "เพิ่มงาน"}
        </button>
      </form>
      <p className="form-note"><span aria-hidden="true">*</span> จำเป็นต้องกรอก</p>
    </section>
  );
}