import React from "react";
import type { IconType } from "react-icons";

interface Props {
  icon: IconType;
  title: string;
  message?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<Props> = ({ icon: Icon, title, message, action }) => (
  <div className="tf-empty-state">
    <div className="tf-empty-icon">
      <Icon />
    </div>
    <h5 className="mb-1">{title}</h5>
    {message && <p className="mb-3" style={{ fontSize: "0.9rem" }}>{message}</p>}
    {action}
  </div>
);

export default EmptyState;
