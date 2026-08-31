import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiFolder, FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp,
  FiCalendar, FiList, FiPlayCircle,
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import StatCard from "../components/dashboard/StatCard";
import ProgressBar from "../components/common/ProgressBar";
import UserAvatar from "../components/common/UserAvatar";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import EmptyState from "../components/common/EmptyState";
import { formatDate, isOverdue, isDueToday, timeAgo } from "../utils/helpers";

const Dashboard: React.FC = () => {
  const { projects, tasks, users, activities, currentUser } = useApp();

  const stats = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status === "In Progress" || p.status === "Planning").length;
    const completedProjects = projects.filter((p) => p.status === "Completed").length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;
    const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
    const dueToday = tasks.filter((t) => isDueToday(t.dueDate) && t.status !== "Completed").length;
    return {
      totalProjects: projects.length,
      activeProjects,
      completedProjects,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      overdue,
      dueToday,
    };
  }, [projects, tasks]);

  const taskProgress = stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
  const projectProgress = stats.totalProjects ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0;

  const recentTasks = [...tasks].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);
  const recentProjects = [...projects].slice(0, 4);
  const upcoming = [...tasks]
    .filter((t) => t.status !== "Completed")
    .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))
    .slice(0, 5);

  const byStatus = ["To Do", "In Progress", "Review", "Completed"].map((s) => ({
    status: s,
    count: tasks.filter((t) => t.status === s).length,
  }));
  const maxByStatus = Math.max(1, ...byStatus.map((b) => b.count));

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h3 className="mb-1">Welcome back, {currentUser.name.split(" ")[0]} 👋</h3>
          <p className="mb-0" style={{ color: "var(--tf-text-muted)" }}>Here's what's happening across your projects today.</p>
        </div>
        <Link to="/projects" className="btn btn-primary">+ New Project</Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3"><StatCard icon={FiFolder} label="Total Projects" value={stats.totalProjects} color="var(--tf-primary)" softColor="var(--tf-primary-soft)" /></div>
        <div className="col-6 col-lg-3"><StatCard icon={FiPlayCircle} label="Active Projects" value={stats.activeProjects} color="var(--tf-accent)" softColor="var(--tf-accent-soft)" /></div>
        <div className="col-6 col-lg-3"><StatCard icon={FiCheckCircle} label="Completed Projects" value={stats.completedProjects} color="var(--tf-success)" softColor="var(--tf-success-soft)" /></div>
        <div className="col-6 col-lg-3"><StatCard icon={FiList} label="Total Tasks" value={stats.totalTasks} color="var(--tf-warn)" softColor="var(--tf-warn-soft)" /></div>
        <div className="col-6 col-lg-3"><StatCard icon={FiCheckCircle} label="Completed Tasks" value={stats.completedTasks} color="var(--tf-success)" softColor="var(--tf-success-soft)" /></div>
        <div className="col-6 col-lg-3"><StatCard icon={FiClock} label="Pending Tasks" value={stats.pendingTasks} color="var(--tf-primary)" softColor="var(--tf-primary-soft)" /></div>
        <div className="col-6 col-lg-3"><StatCard icon={FiAlertCircle} label="Overdue Tasks" value={stats.overdue} color="var(--tf-danger)" softColor="var(--tf-danger-soft)" /></div>
        <div className="col-6 col-lg-3"><StatCard icon={FiCalendar} label="Due Today" value={stats.dueToday} color="var(--tf-warn)" softColor="var(--tf-warn-soft)" /></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <div className="tf-card tf-card-body h-100">
            <h6 className="tf-section-title mb-3">Task Completion</h6>
            <div className="d-flex align-items-baseline gap-2 mb-2">
              <span style={{ fontSize: "2rem", fontWeight: 800 }}>{taskProgress}%</span>
              <span style={{ color: "var(--tf-text-muted)", fontSize: "0.82rem" }}>of all tasks completed</span>
            </div>
            <ProgressBar value={taskProgress} color="var(--tf-success)" />
            <div className="d-flex gap-3 mt-3" style={{ fontSize: "0.78rem", color: "var(--tf-text-muted)" }}>
              <span><FiTrendingUp className="me-1" style={{ color: "var(--tf-success)" }} />{stats.completedTasks} done</span>
              <span>{stats.pendingTasks} remaining</span>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="tf-card tf-card-body h-100">
            <h6 className="tf-section-title mb-3">Project Progress</h6>
            <div className="d-flex align-items-baseline gap-2 mb-2">
              <span style={{ fontSize: "2rem", fontWeight: 800 }}>{projectProgress}%</span>
              <span style={{ color: "var(--tf-text-muted)", fontSize: "0.82rem" }}>projects wrapped up</span>
            </div>
            <ProgressBar value={projectProgress} color="var(--tf-primary)" />
            <div className="d-flex gap-3 mt-3" style={{ fontSize: "0.78rem", color: "var(--tf-text-muted)" }}>
              <span>{stats.activeProjects} active</span>
              <span>{stats.completedProjects} completed</span>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="tf-card tf-card-body h-100">
            <h6 className="tf-section-title mb-3">Tasks by Status</h6>
            <div className="d-flex flex-column gap-2">
              {byStatus.map((b) => (
                <div key={b.status}>
                  <div className="d-flex justify-content-between" style={{ fontSize: "0.78rem", color: "var(--tf-text-muted)" }}>
                    <span>{b.status}</span><span>{b.count}</span>
                  </div>
                  <ProgressBar value={(b.count / maxByStatus) * 100} height={6} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="tf-card tf-card-body mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="tf-section-title mb-0">Recent Tasks</h6>
              <Link to="/tasks" style={{ fontSize: "0.82rem" }}>View all</Link>
            </div>
            {recentTasks.length === 0 ? (
              <EmptyState icon={FiList} title="No tasks yet" message="Create a task to get started." />
            ) : (
              <div className="d-flex flex-column gap-2">
                {recentTasks.map((t) => {
                  const assignee = users.find((u) => u.id === t.assigneeId);
                  return (
                    <Link key={t.id} to={`/tasks/${t.id}`} className="d-flex align-items-center justify-content-between gap-2 p-2 rounded" style={{ color: "var(--tf-text)" }}>
                      <div className="d-flex align-items-center gap-2 min-w-0">
                        <UserAvatar user={assignee} size={30} />
                        <span className="text-truncate" style={{ fontSize: "0.88rem", fontWeight: 500 }}>{t.title}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <PriorityBadge priority={t.priority} />
                        <StatusBadge status={t.status} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="tf-card tf-card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="tf-section-title mb-0">Recent Projects</h6>
              <Link to="/projects" style={{ fontSize: "0.82rem" }}>View all</Link>
            </div>
            <div className="row g-2">
              {recentProjects.map((p) => {
                const projectTasks = tasks.filter((t) => t.projectId === p.id);
                const done = projectTasks.filter((t) => t.status === "Completed").length;
                const pct = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0;
                return (
                  <div className="col-12 col-sm-6" key={p.id}>
                    <Link to={`/projects/${p.id}`} className="d-block p-2 rounded border h-100" style={{ borderColor: "var(--tf-border)", color: "var(--tf-text)" }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{p.name}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <ProgressBar value={pct} showLabel />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="tf-card tf-card-body mb-3">
            <h6 className="tf-section-title mb-3">Upcoming Deadlines</h6>
            {upcoming.length === 0 ? (
              <EmptyState icon={FiCalendar} title="Nothing due soon" />
            ) : (
              <div className="d-flex flex-column gap-2">
                {upcoming.map((t) => (
                  <Link key={t.id} to={`/tasks/${t.id}`} className="d-flex justify-content-between align-items-center p-2 rounded" style={{ color: "var(--tf-text)" }}>
                    <span className="text-truncate" style={{ fontSize: "0.86rem" }}>{t.title}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isOverdue(t.dueDate, t.status) ? "var(--tf-danger)" : "var(--tf-text-muted)" }}>
                      {formatDate(t.dueDate)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="tf-card tf-card-body">
            <h6 className="tf-section-title mb-3">Activity Feed</h6>
            <div className="d-flex flex-column gap-3">
              {activities.slice(0, 6).map((a) => {
                const user = users.find((u) => u.id === a.userId);
                return (
                  <div key={a.id} className="d-flex gap-2">
                    <UserAvatar user={user} size={30} />
                    <div>
                      <div style={{ fontSize: "0.85rem" }}>
                        <strong>{user?.name}</strong> {a.action} <em>"{a.target}"</em>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--tf-text-faint)" }}>{timeAgo(a.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
