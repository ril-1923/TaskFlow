import React from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { FiBell, FiClock, FiUserPlus, FiCheckCircle, FiMessageSquare, FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { timeAgo } from "../../utils/helpers";
import type { Notification } from "../../types";

const iconFor: Record<Notification["type"], React.ReactElement> = {
  deadline: <FiClock style={{ color: "var(--tf-warn)" }} />,
  assignment: <FiUserPlus style={{ color: "var(--tf-primary)" }} />,
  completion: <FiCheckCircle style={{ color: "var(--tf-success)" }} />,
  comment: <FiMessageSquare style={{ color: "var(--tf-accent)" }} />,
  urgent: <FiAlertTriangle style={{ color: "var(--tf-danger)" }} />,
};

const NotificationDropdown: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Dropdown align="end">
      <Dropdown.Toggle as="button" className="btn btn-outline-secondary position-relative border-0" id="notif-toggle" aria-label="Notifications">
        <FiBell size={18} />
        {unread > 0 && (
          <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: "0.6rem" }}>
            {unread}
          </Badge>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ width: 340, maxHeight: 420, overflowY: "auto" }} className="p-0 tf-scrollbar">
        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom" style={{ borderColor: "var(--tf-border)" }}>
          <strong style={{ fontSize: "0.9rem" }}>Notifications</strong>
          <div className="d-flex gap-2">
            {notifications.length > 0 && (
              <>
                <button className="btn btn-sm p-0" style={{ fontSize: "0.75rem", color: "var(--tf-primary)" }} onClick={markAllNotificationsRead}>
                  Mark all read
                </button>
                <button className="btn btn-sm p-0" style={{ fontSize: "0.75rem", color: "var(--tf-text-muted)" }} onClick={clearNotifications} aria-label="Clear all notifications">
                  <FiTrash2 />
                </button>
              </>
            )}
          </div>
        </div>
        {notifications.length === 0 && (
          <div className="text-center py-4" style={{ color: "var(--tf-text-muted)", fontSize: "0.85rem" }}>
            You're all caught up.
          </div>
        )}
        {notifications.map((n) => (
          <button
            key={n.id}
            className="btn w-100 text-start d-flex gap-2 px-3 py-2 border-0 rounded-0"
            style={{ background: n.read ? "transparent" : "var(--tf-primary-soft)" }}
            onClick={() => markNotificationRead(n.id)}
          >
            <span className="mt-1">{iconFor[n.type]}</span>
            <span className="flex-grow-1">
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{n.title}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--tf-text-muted)" }}>{n.message}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--tf-text-faint)" }}>{timeAgo(n.createdAt)}</div>
            </span>
          </button>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
