import React, { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import TaskCard from "../components/tasks/TaskCard";
import TaskModal from "../components/tasks/TaskModal";
import FilterBar from "../components/common/FilterBar";
import type { Task, TaskStatus } from "../types";

const columns: { status: TaskStatus; color: string }[] = [
  { status: "To Do", color: "var(--tf-primary)" },
  { status: "In Progress", color: "var(--tf-warn)" },
  { status: "Review", color: "var(--tf-accent)" },
  { status: "Completed", color: "var(--tf-success)" },
];

const Kanban: React.FC = () => {
  const { tasks, projects, moveTaskStatus } = useApp();
  const [projectFilter, setProjectFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<TaskStatus>("To Do");
  const draggedTask = React.useRef<Task | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (projectFilter !== "all" && t.projectId !== projectFilter) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, projectFilter, search]);

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask.current && draggedTask.current.status !== status) {
      moveTaskStatus(draggedTask.current.id, status);
    }
    setDragOverCol(null);
    draggedTask.current = null;
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h3 className="mb-1">Kanban Board</h3>
          <p className="mb-0" style={{ color: "var(--tf-text-muted)" }}>Drag tasks between columns to update their status.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setModalStatus("To Do"); setShowModal(true); }}><FiPlus /> New Task</button>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tasks on board..."
        selects={[{ value: projectFilter, onChange: setProjectFilter, options: [{ value: "all", label: "All Projects" }, ...projects.map((p) => ({ value: p.id, label: p.name }))] }]}
      />

      <div className="tf-kanban-wrap">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);
          return (
            <div className="tf-kanban-col" key={col.status}>
              <div className="tf-kanban-col-header">
                <span className="d-flex align-items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, display: "inline-block" }} />
                  {col.status}
                  <span style={{ color: "var(--tf-text-faint)", fontWeight: 500 }}>({colTasks.length})</span>
                </span>
                <button className="btn btn-sm p-0" style={{ color: "var(--tf-text-faint)" }} onClick={() => { setModalStatus(col.status); setShowModal(true); }} aria-label={`Add task to ${col.status}`}>
                  <FiPlus />
                </button>
              </div>
              <div
                className={`tf-kanban-col-body tf-scrollbar${dragOverCol === col.status ? " tf-drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.status); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={() => handleDrop(col.status)}
              >
                {colTasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    draggable
                    onDragStart={(_e, task) => { draggedTask.current = task; }}
                  />
                ))}
                {colTasks.length === 0 && (
                  <div className="text-center py-4" style={{ fontSize: "0.8rem", color: "var(--tf-text-faint)" }}>No tasks here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal show={showModal} onHide={() => setShowModal(false)} defaultStatus={modalStatus} />
    </div>
  );
};

export default Kanban;
