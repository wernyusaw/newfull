import { FILTERS, STATUS_LABELS, type StatusFilter } from "./tasks.types";

interface TaskFiltersProps {
  filter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

export function TaskFilters({ filter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="filters" role="group" aria-label="กรองตามสถานะ">
      {FILTERS.map((status) => (
        <button
          className={`filter-button${filter === status ? " is-active" : ""}`}
          key={status}
          type="button"
          aria-pressed={filter === status}
          onClick={() => onFilterChange(status)}
        >
          {STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  );
}