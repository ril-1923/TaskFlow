import React, { useMemo, useRef, useState } from "react";
import { FiSearch, FiFolder, FiCheckSquare, FiUser, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const SearchBar: React.FC = () => {
  const { projects, tasks, users } = useApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { projects: [], tasks: [], users: [] };
    return {
      projects: projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4),
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 4),
      users: users.filter((u) => u.name.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [query, projects, tasks, users]);

  const hasResults = results.projects.length + results.tasks.length + results.users.length > 0;

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="position-relative flex-grow-1" ref={wrapRef} style={{ maxWidth: 420 }}>
      <div className="position-relative">
        <FiSearch className="position-absolute" style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--tf-text-faint)" }} />
        <input
          type="search"
          className="form-control ps-5"
          placeholder="Search projects, tasks, people..."
          value={query}
          aria-label="Global search"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button
            type="button"
            className="btn btn-sm position-absolute"
            style={{ right: 4, top: "50%", transform: "translateY(-50%)", color: "var(--tf-text-faint)" }}
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
      </div>
      {open && query && (
        <div className="tf-card position-absolute w-100 mt-1 tf-scrollbar" style={{ zIndex: 50, maxHeight: 360, overflowY: "auto" }}>
          {!hasResults && <div className="p-3 text-center" style={{ color: "var(--tf-text-muted)", fontSize: "0.85rem" }}>No results for "{query}"</div>}
          {results.projects.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1" style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--tf-text-faint)", textTransform: "uppercase" }}>Projects</div>
              {results.projects.map((p) => (
                <button key={p.id} className="btn w-100 text-start d-flex align-items-center gap-2 py-2 px-2" onClick={() => go(`/projects/${p.id}`)}>
                  <FiFolder style={{ color: "var(--tf-primary)" }} /> <span>{p.name}</span>
                </button>
              ))}
            </div>
          )}
          {results.tasks.length > 0 && (
            <div className="p-2 border-top" style={{ borderColor: "var(--tf-border)" }}>
              <div className="px-2 py-1" style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--tf-text-faint)", textTransform: "uppercase" }}>Tasks</div>
              {results.tasks.map((t) => (
                <button key={t.id} className="btn w-100 text-start d-flex align-items-center gap-2 py-2 px-2" onClick={() => go(`/tasks/${t.id}`)}>
                  <FiCheckSquare style={{ color: "var(--tf-accent)" }} /> <span>{t.title}</span>
                </button>
              ))}
            </div>
          )}
          {results.users.length > 0 && (
            <div className="p-2 border-top" style={{ borderColor: "var(--tf-border)" }}>
              <div className="px-2 py-1" style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--tf-text-faint)", textTransform: "uppercase" }}>People</div>
              {results.users.map((u) => (
                <button key={u.id} className="btn w-100 text-start d-flex align-items-center gap-2 py-2 px-2" onClick={() => go(`/team`)}>
                  <FiUser style={{ color: "var(--tf-warn)" }} /> <span>{u.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {open && <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 40 }} onClick={() => setOpen(false)} />}
    </div>
  );
};

export default SearchBar;
