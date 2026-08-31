import React from "react";

const statusColors: Record<string, { bg: string; fg: string }> = {
  Planning: { bg: "var(--tf-primary-soft)", fg: "var(--tf-primary)" },
  "To Do": { bg: "var(--tf-primary-soft)", fg: "var(--tf-primary)" },
  "In Progress": { bg: "var(--tf-warn-soft)", fg: "var(--tf-warn)" },
  Review: { bg: "var(--tf-accent-soft)", fg: "var(--tf-accent)" },
  "On Hold": { bg: "var(--tf-danger-soft)", fg: "var(--tf-danger)" },
  Completed: { bg: "var(--tf-success-soft)", fg: "var(--tf-success)" },
  Active: { bg: "var(--tf-success-soft)", fg: "var(--tf-success)" },
  Away: { bg: "var(--tf-warn-soft)", fg: "var(--tf-warn)" },
  Offline: { bg: "var(--tf-border)", fg: "var(--tf-text-muted)" },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const c = statusColors[status] || { bg: "var(--tf-border)", fg: "var(--tf-text-muted)" };
  return (
    <span className="tf-badge" style={{ background: c.bg, color: c.fg }}>
      <span className="tf-badge-dot" />
      {status}
    </span>
  );
};

export default StatusBadge;
