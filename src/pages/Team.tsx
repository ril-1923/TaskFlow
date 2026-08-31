import React, { useMemo, useState } from "react";
import { FiMail, FiUsers } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import FilterBar from "../components/common/FilterBar";
import UserAvatar from "../components/common/UserAvatar";
import StatusBadge from "../components/common/StatusBadge";
import EmptyState from "../components/common/EmptyState";

const Team: React.FC = () => {
  const { users, tasks, projects } = useApp();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const roles = useMemo(() => Array.from(new Set(users.map((u) => u.role))), [users]);

  const filtered = useMemo(
    () => users.filter((u) => (role === "all" || u.role === role) && u.name.toLowerCase().includes(search.toLowerCase())),
    [users, search, role]
  );

  return (
    <div>
      <div className="mb-3">
        <h3 className="mb-1">Team</h3>
        <p className="mb-0" style={{ color: "var(--tf-text-muted)" }}>{filtered.length} member{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search team members..."
        selects={[{ value: role, onChange: setRole, options: [{ value: "all", label: "All Roles" }, ...roles.map((r) => ({ value: r, label: r }))] }]}
      />

      {filtered.length === 0 ? (
        <div className="tf-card"><EmptyState icon={FiUsers} title="No team members found" /></div>
      ) : (
        <div className="row g-3">
          {filtered.map((u) => {
            const assigned = tasks.filter((t) => t.assigneeId === u.id);
            const completed = assigned.filter((t) => t.status === "Completed").length;
            const activeProjects = projects.filter((p) => p.memberIds.includes(u.id) && p.status !== "Completed").length;
            return (
              <div className="col-12 col-sm-6 col-xl-4" key={u.id}>
                <div className="tf-card tf-card-body h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <UserAvatar user={u} size={54} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{u.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--tf-text-muted)" }}>{u.role}</div>
                    </div>
                    <div className="ms-auto"><StatusBadge status={u.status} /></div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "0.82rem", color: "var(--tf-text-muted)" }}>
                    <FiMail /> {u.email}
                  </div>
                  <div className="row text-center g-2">
                    <div className="col-4">
                      <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{assigned.length}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--tf-text-muted)" }}>Tasks</div>
                    </div>
                    <div className="col-4">
                      <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--tf-success)" }}>{completed}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--tf-text-muted)" }}>Done</div>
                    </div>
                    <div className="col-4">
                      <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--tf-primary)" }}>{activeProjects}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--tf-text-muted)" }}>Active Projects</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Team;
