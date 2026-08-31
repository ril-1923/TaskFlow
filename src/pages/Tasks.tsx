import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiCheckSquare, FiTrash2 } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import FilterBar from "../components/common/FilterBar";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import UserAvatar from "../components/common/UserAvatar";
import TaskModal from "../components/tasks/TaskModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import { formatDate, isOverdue } from "../utils/helpers";

const PAGE_SIZE = 10;

const Tasks: React.FC = () => {
  const { tasks, users, projects, deleteTask } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
    if (status !== "all") list = list.filter((t) => t.status === status);
    if (priority !== "all") list = list.filter((t) => t.priority === priority);
    if (projectFilter !== "all") list = list.filter((t) => t.projectId === projectFilter);
    return [...list].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks, search, status, priority, projectFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h3 className="mb-1">Tasks</h3>
          <p className="mb-0" style={{ color: "var(--tf-text-muted)" }}>{filtered.length} task{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}><FiPlus /> Create Task</button>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search tasks..."
        selects={[
          { value: status, onChange: (v) => { setStatus(v); setPage(1); }, options: [{ value: "all", label: "All Statuses" }, { value: "To Do", label: "To Do" }, { value: "In Progress", label: "In Progress" }, { value: "Review", label: "Review" }, { value: "Completed", label: "Completed" }] },
          { value: priority, onChange: (v) => { setPriority(v); setPage(1); }, options: [{ value: "all", label: "All Priorities" }, { value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }, { value: "Urgent", label: "Urgent" }] },
          { value: projectFilter, onChange: (v) => { setProjectFilter(v); setPage(1); }, options: [{ value: "all", label: "All Projects" }, ...projects.map((p) => ({ value: p.id, label: p.name }))] },
        ]}
      />

      {pageItems.length === 0 ? (
        <div className="tf-card"><EmptyState icon={FiCheckSquare} title="No tasks found" message="Try adjusting your filters or create a new task." /></div>
      ) : (
        <div className="tf-card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>
                  <th>Task</th><th>Project</th><th>Assignee</th><th>Priority</th><th>Status</th><th>Due</th><th></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((t) => {
                  const assignee = users.find((u) => u.id === t.assigneeId);
                  const project = projects.find((p) => p.id === t.projectId);
                  const overdue = isOverdue(t.dueDate, t.status);
                  return (
                    <tr key={t.id} className="tf-clickable" onClick={() => navigate(`/tasks/${t.id}`)}>
                      <td style={{ fontWeight: 600, fontSize: "0.88rem" }}>{t.title}</td>
                      <td style={{ fontSize: "0.82rem", color: "var(--tf-text-muted)" }}>{project?.name}</td>
                      <td><UserAvatar user={assignee} size={26} showName /></td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td><StatusBadge status={t.status} /></td>
                      <td style={{ fontSize: "0.82rem", color: overdue ? "var(--tf-danger)" : "var(--tf-text-muted)", fontWeight: overdue ? 700 : 400 }}>{formatDate(t.dueDate)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-sm btn-outline-danger border-0" onClick={() => setDeleteId(t.id)} aria-label="Delete task"><FiTrash2 /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-3"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>

      <TaskModal show={showModal} onHide={() => setShowModal(false)} />
      <ConfirmDialog
        show={!!deleteId}
        title="Delete task"
        message="Are you sure you want to delete this task? This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteTask(deleteId); setDeleteId(null); }}
      />
    </div>
  );
};

export default Tasks;
