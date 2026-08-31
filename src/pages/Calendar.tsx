import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import PriorityBadge from "../components/common/PriorityBadge";
import { isOverdue } from "../utils/helpers";
import type { Task } from "../types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const priorityDotColor: Record<string, string> = {
  Low: "var(--tf-accent-soft)",
  Medium: "var(--tf-primary-soft)",
  High: "var(--tf-warn-soft)",
  Urgent: "var(--tf-danger-soft)",
};
const priorityTextColor: Record<string, string> = {
  Low: "var(--tf-accent)",
  Medium: "var(--tf-primary)",
  High: "var(--tf-warn)",
  Urgent: "var(--tf-danger)",
};

const Calendar: React.FC = () => {
  const { tasks, projects } = useApp();
  const navigate = useNavigate();
  const [cursor, setCursor] = useState(() => new Date());
  const [projectFilter, setProjectFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(
    () => tasks.filter((t) => (projectFilter === "all" || t.projectId === projectFilter) && (priorityFilter === "all" || t.priority === priorityFilter)),
    [tasks, projectFilter, priorityFilter]
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells: Array<{ date: Date; inMonth: boolean }> = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ date: new Date(year, month, i - startOffset + 1), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
  }

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    filteredTasks.forEach((t) => {
      const key = t.dueDate;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [filteredTasks]);

  const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const overdueTasks = filteredTasks.filter((t) => isOverdue(t.dueDate, t.status));
  const upcomingTasks = [...filteredTasks].filter((t) => t.status !== "Completed" && !isOverdue(t.dueDate, t.status)).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 6);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h3 className="mb-0">Calendar</h3>
        <div className="d-flex gap-2">
          <select className="form-select" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
            <option value="all">All Projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="form-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            {["Low", "Medium", "High", "Urgent"].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-9">
          <div className="tf-card tf-card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-outline-secondary" onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month"><FiChevronLeft /></button>
              <h5 className="mb-0">{cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h5>
              <button className="btn btn-outline-secondary" onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month"><FiChevronRight /></button>
            </div>
            <div className="tf-calendar-grid mb-2">
              {WEEKDAYS.map((w) => (
                <div key={w} className="text-center" style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--tf-text-faint)" }}>{w}</div>
              ))}
            </div>
            <div className="tf-calendar-grid">
              {cells.map((c, i) => {
                const key = dateKey(c.date);
                const dayTasks = tasksByDate[key] || [];
                const isToday = dateKey(today) === key;
                return (
                  <div key={i} className={`tf-calendar-cell${!c.inMonth ? " tf-muted" : ""}${isToday ? " tf-today" : ""}`}>
                    <div style={{ fontWeight: isToday ? 800 : 600, color: isToday ? "var(--tf-primary)" : "var(--tf-text)" }}>{c.date.getDate()}</div>
                    {dayTasks.slice(0, 3).map((t) => (
                      <button
                        key={t.id}
                        className="tf-calendar-dot border-0 w-100 text-start"
                        style={{ background: priorityDotColor[t.priority], color: priorityTextColor[t.priority] }}
                        onClick={() => setSelectedTask(t)}
                      >
                        {t.title}
                      </button>
                    ))}
                    {dayTasks.length > 3 && <div style={{ fontSize: "0.65rem", color: "var(--tf-text-faint)" }}>+{dayTasks.length - 3} more</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="tf-card tf-card-body mb-3">
            <h6 className="tf-section-title mb-3" style={{ color: "var(--tf-danger)" }}>Overdue ({overdueTasks.length})</h6>
            {overdueTasks.length === 0 ? (
              <span style={{ fontSize: "0.85rem", color: "var(--tf-text-muted)" }}>Nothing overdue.</span>
            ) : (
              <div className="d-flex flex-column gap-2">
                {overdueTasks.slice(0, 5).map((t) => (
                  <button key={t.id} className="btn text-start p-0" style={{ fontSize: "0.85rem" }} onClick={() => setSelectedTask(t)}>{t.title}</button>
                ))}
              </div>
            )}
          </div>
          <div className="tf-card tf-card-body">
            <h6 className="tf-section-title mb-3">Upcoming</h6>
            {upcomingTasks.length === 0 ? (
              <span style={{ fontSize: "0.85rem", color: "var(--tf-text-muted)" }}>Nothing scheduled.</span>
            ) : (
              <div className="d-flex flex-column gap-2">
                {upcomingTasks.map((t) => (
                  <button key={t.id} className="btn text-start p-0 d-flex justify-content-between" style={{ fontSize: "0.85rem" }} onClick={() => setSelectedTask(t)}>
                    <span>{t.title}</span><PriorityBadge priority={t.priority} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTask && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }} onClick={() => setSelectedTask(null)}>
          <div className="tf-card p-4" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="mb-0">{selectedTask.title}</h5>
              <PriorityBadge priority={selectedTask.priority} />
            </div>
            <p style={{ color: "var(--tf-text-muted)", fontSize: "0.88rem" }}>{selectedTask.description}</p>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span style={{ fontSize: "0.8rem", color: "var(--tf-text-muted)" }}>Due {selectedTask.dueDate}</span>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/tasks/${selectedTask.id}`)}>Open Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
