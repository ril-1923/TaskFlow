import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiCheckSquare } from "react-icons/fi";
import type { Project } from "../../types";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import ProgressBar from "../common/ProgressBar";
import UserAvatar from "../common/UserAvatar";
import { formatDate } from "../../utils/helpers";

const ProjectCard: React.FC<{ project: Project; view?: "grid" | "list" }> = ({ project, view = "grid" }) => {
  const { users, tasks } = useApp();
  const navigate = useNavigate();
  const manager = users.find((u) => u.id === project.managerId);
  const members = users.filter((u) => project.memberIds.includes(u.id));
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completed = projectTasks.filter((t) => t.status === "Completed").length;
  const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;

  if (view === "list") {
    return (
      <div className="tf-card tf-clickable p-3 mb-2 d-flex flex-column flex-md-row align-items-md-center gap-3" onClick={() => navigate(`/projects/${project.id}`)}>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
            <h6 className="mb-0">{project.name}</h6>
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
          <p className="mb-0 text-truncate" style={{ color: "var(--tf-text-muted)", fontSize: "0.85rem", maxWidth: 480 }}>{project.description}</p>
        </div>
        <div style={{ width: 140 }}>
          <ProgressBar value={progress} showLabel />
        </div>
        <div className="d-flex align-items-center" style={{ minWidth: 90 }}>
          {members.slice(0, 3).map((m, i) => (
            <div key={m.id} style={{ marginLeft: i > 0 ? -10 : 0, border: "2px solid var(--tf-surface)", borderRadius: "50%" }}>
              <UserAvatar user={m} size={28} />
            </div>
          ))}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--tf-text-muted)", minWidth: 110 }}>
          <FiCalendar className="me-1" />{formatDate(project.dueDate)}
        </div>
      </div>
    );
  }

  return (
    <div className="tf-card tf-clickable p-3 h-100 d-flex flex-column" onClick={() => navigate(`/projects/${project.id}`)}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <StatusBadge status={project.status} />
        <PriorityBadge priority={project.priority} />
      </div>
      <h6 className="mb-1">{project.name}</h6>
      <p className="flex-grow-1" style={{ color: "var(--tf-text-muted)", fontSize: "0.85rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {project.description}
      </p>
      <div className="mb-2">
        <ProgressBar value={progress} showLabel />
      </div>
      <div className="d-flex align-items-center justify-content-between mt-1">
        <div className="d-flex align-items-center">
          {members.slice(0, 4).map((m, i) => (
            <div key={m.id} style={{ marginLeft: i > 0 ? -10 : 0, border: "2px solid var(--tf-surface)", borderRadius: "50%" }}>
              <UserAvatar user={m} size={28} />
            </div>
          ))}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--tf-text-muted)" }}>
          <FiCheckSquare className="me-1" />{completed}/{projectTasks.length}
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top" style={{ borderColor: "var(--tf-border)", fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>
        <span>Manager: {manager?.name}</span>
        <span><FiCalendar className="me-1" />{formatDate(project.dueDate)}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
