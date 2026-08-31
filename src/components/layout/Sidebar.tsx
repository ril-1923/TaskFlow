import React from "react";
import { NavLink } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import {
  FiGrid, FiFolder, FiCheckSquare, FiTrello, FiCalendar,
  FiUsers, FiActivity, FiBell, FiSettings, FiZap,
} from "react-icons/fi";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/projects", label: "Projects", icon: FiFolder },
  { to: "/tasks", label: "Tasks", icon: FiCheckSquare },
  { to: "/kanban", label: "Kanban Board", icon: FiTrello },
  { to: "/calendar", label: "Calendar", icon: FiCalendar },
  { to: "/team", label: "Team", icon: FiUsers },
  { to: "/activity", label: "Activity", icon: FiActivity },
  { to: "/notifications", label: "Notifications", icon: FiBell },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

const NavItems: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => (
  <nav className="tf-nav">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={onNavigate}
        className={({ isActive }) => `tf-nav-link${isActive ? " active" : ""}`}
      >
        <item.icon />
        <span>{item.label}</span>
      </NavLink>
    ))}
  </nav>
);

export const Brand: React.FC = () => (
  <div className="tf-sidebar-brand">
    <span className="tf-logo-mark"><FiZap /></span>
    TaskFlow
  </div>
);

const Sidebar: React.FC = () => (
  <aside className="tf-sidebar d-none d-lg-flex">
    <Brand />
    <NavItems />
    <div className="tf-sidebar-footer">Plan. Collaborate. Get Things Done.</div>
  </aside>
);

export const SidebarOffcanvas: React.FC<{ show: boolean; onHide: () => void }> = ({ show, onHide }) => (
  <Offcanvas show={show} onHide={onHide} responsive="lg" placement="start" className="tf-sidebar border-0" style={{ position: "fixed" }}>
    <Offcanvas.Header closeButton closeVariant="white">
      <Brand />
    </Offcanvas.Header>
    <NavItems onNavigate={onHide} />
    <div className="tf-sidebar-footer">Plan. Collaborate. Get Things Done.</div>
  </Offcanvas>
);

export default Sidebar;
