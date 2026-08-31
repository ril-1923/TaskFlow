import React from "react";
import { FiBell, FiClock, FiUserPlus, FiCheckCircle, FiMessageSquare, FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import EmptyState from "../components/common/EmptyState";
import { timeAgo } from "../utils/helpers";
import type { Notification } from "../types";

const iconFor: Record<Notification["type"], React.ReactElement> = {
  deadline: <FiClock style={{ color: "var(--tf-warn)" }} />,
  assignment: <FiUserPlus style={{ color: "var(--tf-primary)" }} />,
  completion: <FiCheckCircle style={{ color: "var(--tf-success)" }} />,
  comment: <FiMessageSquare style={{ color: "var(--tf-accent)" }} />,
  urgent: <FiAlertTriangle style={{ color: "var(--tf-danger)" }} />,
};

const Notifications: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useApp();

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h3 className="mb-1">Notifications</h3>
          <p className="mb-0" style={{ color: "var(--tf-text-muted)" }}>{notifications.filter((n) => !n.read).length} unread</p>
        </div>
        {notifications.length > 0 && (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={markAllNotificationsRead}>Mark all read</button>
            <button className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={clearNotifications}><FiTrash2 /> Clear all</button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="tf-card"><EmptyState icon={FiBell} title="No notifications" message="You're all caught up." /></div>
      ) : (
        <div className="tf-card">
          {notifications.map((n, i) => (
            <button
              key={n.id}
              className="btn w-100 text-start d-flex gap-3 p-3 border-0 rounded-0"
              style={{ background: n.read ? "transparent" : "var(--tf-primary-soft)", borderTop: i > 0 ? "1px solid var(--tf-border)" : "none" }}
              onClick={() => markNotificationRead(n.id)}
            >
              <span className="fs-5 mt-1">{iconFor[n.type]}</span>
              <span className="flex-grow-1">
                <div style={{ fontWeight: 600 }}>{n.title}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--tf-text-muted)" }}>{n.message}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>{timeAgo(n.createdAt)}</div>
              </span>
              {!n.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--tf-primary)", marginTop: 6 }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
