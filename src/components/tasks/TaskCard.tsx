import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiCheckSquare } from "react-icons/fi";
import type { Task } from "../../types";
import { useApp } from "../../context/AppContext";
import PriorityBadge from "../common/PriorityBadge";
import UserAvatar from "../common/UserAvatar";
import { formatDate, isOverdue } from "../../utils/helpers";

interface Props {
  task: Task;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}

const TaskCard: React.FC<Props> = ({ task, draggable, onDragStart }) => {
  const { users, projects } = useApp();
  const navigate = useNavigate();
  const assignee = users.find((u) => u.id === task.assigneeId);
  const project = projects.find((p) => p.id === task.projectId);
  const subtaskDone = task.subtasks.filter((s) => s.completed).length;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      className="tf-task-card"
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
      onClick={() => navigate(`/tasks/${task.id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
        <PriorityBadge priority={task.priority} />
        {project && <span style={{ fontSize: "0.68rem", color: "var(--tf-text-faint)", fontWeight: 600 }}>{project.name}</span>}
      </div>
      <div style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: 6 }}>{task.title}</div>
      {task.tags.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mb-2">
          {task.tags.map((t) => (
            <span key={t} className="tf-badge" style={{ background: "var(--tf-surface-alt)", color: "var(--tf-text-muted)", border: "1px solid var(--tf-border)" }}>
              #{t}
            </span>
          ))}
        </div>
      )}
      <div className="d-flex align-items-center justify-content-between">
        <UserAvatar user={assignee} size={26} />
        <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.72rem", color: overdue ? "var(--tf-danger)" : "var(--tf-text-muted)" }}>
          {task.subtasks.length > 0 && (
            <span><FiCheckSquare className="me-1" />{subtaskDone}/{task.subtasks.length}</span>
          )}
          <span><FiCalendar className="me-1" />{formatDate(task.dueDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
