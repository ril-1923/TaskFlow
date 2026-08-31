import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiTrash2, FiCalendar, FiFolder, FiSend } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import UserAvatar from "../components/common/UserAvatar";
import ProgressBar from "../components/common/ProgressBar";
import TaskModal from "../components/tasks/TaskModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import { formatDate, formatDateTime, timeAgo } from "../utils/helpers";
import type { TaskStatus } from "../types";

const TaskDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, users, projects, currentUser, deleteTask, toggleSubtask, addComment, moveTaskStatus } = useApp();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [comment, setComment] = useState("");

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return <EmptyState icon={FiFolder} title="Task not found" action={<Link to="/tasks" className="btn btn-primary">Back to Tasks</Link>} />;
  }

  const assignee = users.find((u) => u.id === task.assigneeId);
  const project = projects.find((p) => p.id === task.projectId);
  const doneSubtasks = task.subtasks.filter((s) => s.completed).length;
  const subtaskProgress = task.subtasks.length ? Math.round((doneSubtasks / task.subtasks.length) * 100) : 0;

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(task.id, comment.trim());
    setComment("");
  };

  return (
    <div>
      <button className="btn btn-outline-secondary border-0 mb-3 d-flex align-items-center gap-2 px-0" onClick={() => navigate("/tasks")}>
        <FiArrowLeft /> Back to Tasks
      </button>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="tf-card tf-card-body mb-3">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                  <PriorityBadge priority={task.priority} />
                  {project && <span className="d-inline-flex align-items-center gap-1" style={{ fontSize: "0.78rem", color: "var(--tf-text-muted)" }}><FiFolder />{project.name}</span>}
                </div>
                <h4 className="mb-0">{task.title}</h4>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => setShowEdit(true)}><FiEdit2 /> Edit</button>
                <button className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => setShowDelete(true)}><FiTrash2 /> Delete</button>
              </div>
            </div>
            <p style={{ color: "var(--tf-text-muted)" }}>{task.description}</p>
            {task.tags.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mb-2">
                {task.tags.map((t) => (
                  <span key={t} className="tf-badge" style={{ background: "var(--tf-surface-alt)", color: "var(--tf-text-muted)", border: "1px solid var(--tf-border)" }}>#{t}</span>
                ))}
              </div>
            )}

            <div className="mt-3">
              <label className="form-label">Status</label>
              <div className="d-flex flex-wrap gap-2">
                {(["To Do", "In Progress", "Review", "Completed"] as TaskStatus[]).map((s) => (
                  <button
                    key={s}
                    className="btn btn-sm"
                    style={{
                      border: "1px solid var(--tf-border)",
                      background: task.status === s ? "var(--tf-primary)" : "transparent",
                      color: task.status === s ? "#fff" : "var(--tf-text)",
                    }}
                    onClick={() => moveTaskStatus(task.id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="tf-card tf-card-body mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="tf-section-title mb-0">Subtasks</h6>
              <span style={{ fontSize: "0.78rem", color: "var(--tf-text-muted)" }}>{doneSubtasks}/{task.subtasks.length}</span>
            </div>
            <ProgressBar value={subtaskProgress} />
            <div className="mt-3 d-flex flex-column gap-2">
              {task.subtasks.map((s) => (
                <label key={s.id} className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                  <input type="checkbox" className="form-check-input mt-0" checked={s.completed} onChange={() => toggleSubtask(task.id, s.id)} />
                  <span style={{ textDecoration: s.completed ? "line-through" : "none", color: s.completed ? "var(--tf-text-faint)" : "var(--tf-text)", fontSize: "0.88rem" }}>{s.title}</span>
                </label>
              ))}
              {task.subtasks.length === 0 && <span style={{ fontSize: "0.85rem", color: "var(--tf-text-muted)" }}>No subtasks added.</span>}
            </div>
          </div>

          <div className="tf-card tf-card-body">
            <h6 className="tf-section-title mb-3">Comments</h6>
            <div className="d-flex flex-column gap-3 mb-3">
              {task.comments.map((c) => {
                const user = users.find((u) => u.id === c.userId);
                return (
                  <div key={c.id} className="d-flex gap-2">
                    <UserAvatar user={user} size={32} />
                    <div>
                      <div style={{ fontSize: "0.85rem" }}><strong>{user?.name}</strong> <span style={{ color: "var(--tf-text-faint)", fontSize: "0.72rem" }}>{timeAgo(c.createdAt)}</span></div>
                      <div style={{ fontSize: "0.86rem" }}>{c.text}</div>
                    </div>
                  </div>
                );
              })}
              {task.comments.length === 0 && <span style={{ fontSize: "0.85rem", color: "var(--tf-text-muted)" }}>No comments yet.</span>}
            </div>
            <form onSubmit={submitComment} className="d-flex gap-2">
              <UserAvatar user={currentUser} size={32} />
              <input className="form-control" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
              <button className="btn btn-primary d-flex align-items-center" type="submit" aria-label="Send comment"><FiSend /></button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="tf-card tf-card-body">
            <h6 className="tf-section-title mb-3">Details</h6>
            <div className="d-flex flex-column gap-3">
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>Status</div>
                <StatusBadge status={task.status} />
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>Assignee</div>
                <UserAvatar user={assignee} showName size={32} />
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>Project</div>
                {project && <Link to={`/projects/${project.id}`} style={{ fontSize: "0.88rem" }}>{project.name}</Link>}
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>Due Date</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600 }}><FiCalendar className="me-1" />{formatDate(task.dueDate)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>Created</div>
                <div style={{ fontSize: "0.88rem" }}>{formatDateTime(task.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskModal show={showEdit} onHide={() => setShowEdit(false)} task={task} />
      <ConfirmDialog
        show={showDelete}
        title="Delete task"
        message="Are you sure you want to delete this task? This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setShowDelete(false)}
        onConfirm={() => { deleteTask(task.id); navigate("/tasks"); }}
      />
    </div>
  );
};

export default TaskDetails;
