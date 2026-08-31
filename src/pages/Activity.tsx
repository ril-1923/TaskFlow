import React, { useState } from "react";
import { FiPlusCircle, FiCheckCircle, FiEdit, FiFlag, FiMessageSquare, FiTrash, FiActivity as FiActivityIcon } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import UserAvatar from "../components/common/UserAvatar";
import EmptyState from "../components/common/EmptyState";
import { formatDateTime } from "../utils/helpers";
import type { Activity as ActivityType } from "../types";

const iconFor: Record<ActivityType["type"], React.ReactElement> = {
  create: <FiPlusCircle style={{ color: "var(--tf-primary)" }} />,
  complete: <FiCheckCircle style={{ color: "var(--tf-success)" }} />,
  update: <FiEdit style={{ color: "var(--tf-warn)" }} />,
  priority: <FiFlag style={{ color: "var(--tf-danger)" }} />,
  comment: <FiMessageSquare style={{ color: "var(--tf-accent)" }} />,
  delete: <FiTrash style={{ color: "var(--tf-text-muted)" }} />,
};

const Activity: React.FC = () => {
  const { activities, users } = useApp();
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = typeFilter === "all" ? activities : activities.filter((a) => a.type === typeFilter);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h3 className="mb-1">Activity</h3>
          <p className="mb-0" style={{ color: "var(--tf-text-muted)" }}>A timeline of everything happening across your workspace.</p>
        </div>
        <select className="form-select" style={{ width: 200 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Activity</option>
          <option value="create">Created</option>
          <option value="update">Updated</option>
          <option value="complete">Completed</option>
          <option value="comment">Comments</option>
          <option value="priority">Priority Changes</option>
          <option value="delete">Deleted</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="tf-card"><EmptyState icon={FiActivityIcon} title="No activity yet" /></div>
      ) : (
        <div className="tf-card tf-card-body">
          <div className="d-flex flex-column">
            {filtered.map((a, i) => {
              const user = users.find((u) => u.id === a.userId);
              return (
                <div key={a.id} className="d-flex gap-3 pb-3 mb-3 position-relative" style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--tf-border)" : "none" }}>
                  <div className="d-flex flex-column align-items-center">
                    <UserAvatar user={user} size={36} />
                  </div>
                  <div className="flex-grow-1">
                    <div style={{ fontSize: "0.9rem" }}>
                      <strong>{user?.name}</strong> {a.action} <em>"{a.target}"</em>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1" style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>
                      {iconFor[a.type]} {formatDateTime(a.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;
