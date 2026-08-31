import React from "react";
import type { User } from "../../types";

interface Props {
  user?: User;
  size?: number;
  showName?: boolean;
  className?: string;
}

const UserAvatar: React.FC<Props> = ({ user, size = 36, showName = false, className = "" }) => {
  if (!user) {
    return (
      <span className={`tf-avatar ${className}`} style={{ width: size, height: size, background: "#9497AC", fontSize: size * 0.38 }}>
        ?
      </span>
    );
  }
  return (
    <span className={`d-inline-flex align-items-center gap-2 ${className}`}>
      <span
        className="tf-avatar"
        style={{ width: size, height: size, background: user.avatarColor, fontSize: size * 0.38 }}
        title={user.name}
        aria-label={user.name}
      >
        {user.initials}
      </span>
      {showName && (
        <span className="d-flex flex-column lh-sm">
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{user.name}</span>
          <span style={{ fontSize: "0.72rem", color: "var(--tf-text-muted)" }}>{user.role}</span>
        </span>
      )}
    </span>
  );
};

export default UserAvatar;
