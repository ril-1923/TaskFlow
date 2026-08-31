import React, { useMemo, useState } from "react";
import { FiGrid, FiList, FiFolder, FiPlus } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import FilterBar from "../components/common/FilterBar";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectModal from "../components/projects/ProjectModal";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";

const PAGE_SIZE = 8;

const Projects: React.FC = () => {
  const { projects } = useApp();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("dueDate");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (status !== "all") list = list.filter((p) => p.status === status);
    if (priority !== "all") list = list.filter((p) => p.priority === priority);
    list = [...list].sort((a, b) => {
      if (sort === "dueDate") return a.dueDate.localeCompare(b.dueDate);
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "priority") {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
      }
      return 0;
    });
    return list;
  }, [projects, search, status, priority, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h3 className="mb-1">Projects</h3>
          <p className="mb-0" style={{ color: "var(--tf-text-muted)" }}>{filtered.length} project{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <FiPlus /> Create Project
        </button>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search projects..."
        selects={[
          { value: status, onChange: (v) => { setStatus(v); setPage(1); }, options: [{ value: "all", label: "All Statuses" }, { value: "Planning", label: "Planning" }, { value: "In Progress", label: "In Progress" }, { value: "On Hold", label: "On Hold" }, { value: "Completed", label: "Completed" }] },
          { value: priority, onChange: (v) => { setPriority(v); setPage(1); }, options: [{ value: "all", label: "All Priorities" }, { value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }, { value: "Critical", label: "Critical" }] },
          { value: sort, onChange: setSort, options: [{ value: "dueDate", label: "Sort: Due Date" }, { value: "name", label: "Sort: Name" }, { value: "priority", label: "Sort: Priority" }] },
        ]}
        rightSlot={
          <div className="btn-group">
            <button className={`btn btn-outline-secondary ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")} aria-label="Grid view"><FiGrid /></button>
            <button className={`btn btn-outline-secondary ${view === "list" ? "active" : ""}`} onClick={() => setView("list")} aria-label="List view"><FiList /></button>
          </div>
        }
      />

      {pageItems.length === 0 ? (
        <div className="tf-card">
          <EmptyState icon={FiFolder} title="No projects found" message="Try adjusting your filters or create a new project." />
        </div>
      ) : view === "grid" ? (
        <div className="row g-3">
          {pageItems.map((p) => (
            <div className="col-12 col-sm-6 col-xl-3" key={p.id}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      ) : (
        <div>{pageItems.map((p) => <ProjectCard key={p.id} project={p} view="list" />)}</div>
      )}

      <div className="mt-3">
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      <ProjectModal show={showModal} onHide={() => setShowModal(false)} />
    </div>
  );
};

export default Projects;
