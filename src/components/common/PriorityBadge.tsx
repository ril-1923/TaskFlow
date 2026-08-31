import React from "react";

const priorityColors: Record<string, { bg: string; fg: string }> = {
  Low: { bg: "var(--tf-accent-soft)", fg: "var(--tf-accent)" },
  Medium: { bg: "var(--tf-primary-soft)", fg: "var(--tf-primary)" },
  High: { bg: "var(--tf-warn-soft)", fg: "var(--tf-warn)" },
  Critical: { bg: "var(--tf-danger-soft)", fg: "var(--tf-danger)" },
  Urgent: { bg: "var(--tf-danger-soft)", fg: "var(--tf-danger)" },
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const c = priorityColors[priority] || { bg: "var(--tf-border)", fg: "var(--tf-text-muted)" };
  return (
    <span className="tf-badge" style={{ background: c.bg, color: c.fg }}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
