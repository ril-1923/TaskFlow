import React, { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiFile, FiUpload, FiCalendar, FiCheckSquare } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import ProgressBar from "../components/common/ProgressBar";
import UserAvatar from "../components/common/UserAvatar";
import TaskCard from "../components/tasks/TaskCard";
import TaskModal from "../components/tasks/TaskModal";
import ProjectModal from "../components/projects/ProjectModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import { formatDate, timeAgo, uid } from "../utils/helpers";

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, users, activities, updateProject, deleteProject } = useApp();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const project = projects.find((p) => p.id === id);

  const projectTasks = useMemo(() => tasks.filter((t) => t.projectId === id), [tasks, id]);
  const manager = users.find((u) => u.id === project?.managerId);
  const members = users.filter((u) => project?.memberIds.includes(u.id));
  const projectActivities = useMemo(
    () => activities.filter((a) => a.target === project?.name || projectTasks.some((t) => t.title === a.target)),
    [activities, project, projectTasks]
  );

  if (!project) {
    return (
      <EmptyState icon={FiFile} title="Project not found" message="It may have been deleted." action={<Link to="/projects" className="btn btn-primary">Back to Projects</Link>} />
    );
  }

  const completed = projectTasks.filter((t) => t.status === "Completed").length;
  const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;

  const addMockFile = () => {
    const newFile = { id: uid("f"), name: `New Document ${project.files.length + 1}.pdf`, size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB`, type: "pdf", uploadedAt: new Date().toISOString(), uploadedBy: manager?.id || "" };
    updateProject(project.id, { files: [...project.files, newFile] });
  };

  return (
    <div>
      <button className="btn btn-outline-secondary border-0 mb-3 d-flex align-items-center gap-2 px-0" onClick={() => navigate("/projects")}>
        <FiArrowLeft /> Back to Projects
      </button>

      <div className="tf-card tf-card-body mb-3">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              <h3 className="mb-0">{project.name}</h3>
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
            <p className="mb-0" style={{ color: "var(--tf-text-muted)", maxWidth: 640 }}>{project.description}</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => setShowEditModal(true)}><FiEdit2 /> Edit</button>
            <button className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => setShowDelete(true)}><FiTrash2 /> Delete</button>
          </div>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-6 col-md-3">
            <div style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>Project Manager</div>
            <div className="d-flex align-items-center gap-2 mt-1"><UserAvatar user={manager} size={28} /><span style={{ fontSize: "0.88rem" }}>{manager?.name}</span></div>
          </div>
          <div className="col-6 col-md-3">
            <div style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>Start Date</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 600 }}><FiCalendar className="me-1" />{formatDate(project.startDate)}</div>
          </div>
          <div className="col-6 col-md-3">
            <div style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>Deadline</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 600 }}><FiCalendar className="me-1" />{formatDate(project.dueDate)}</div>
          </div>
          <div className="col-6 col-md-3">
            <div style={{ fontSize: "0.75rem", color: "var(--tf-text-faint)" }}>Tasks Completed</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 600 }}><FiCheckSquare className="me-1" />{completed}/{projectTasks.length}</div>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={progress} showLabel />
        </div>
      </div>

      <Tabs defaultActiveKey="overview" className="mb-3">
        <Tab eventKey="overview" title="Overview">
          <div className="row g-3">
            <div className="col-lg-8">
              <div className="tf-card tf-card-body">
                <h6 className="tf-section-title mb-3">Project Summary</h6>
                <p style={{ color: "var(--tf-text-muted)" }}>{project.description}</p>
                <div className="row g-3 mt-1">
                  <div className="col-6 col-md-3 text-center p-2">
                    <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{projectTasks.length}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--tf-text-muted)" }}>Total Tasks</div>
                  </div>
                  <div className="col-6 col-md-3 text-center p-2">
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--tf-success)" }}>{completed}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--tf-text-muted)" }}>Completed</div>
                  </div>
                  <div className="col-6 col-md-3 text-center p-2">
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--tf-warn)" }}>{projectTasks.filter((t) => t.status === "In Progress").length}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--tf-text-muted)" }}>In Progress</div>
                  </div>
                  <div className="col-6 col-md-3 text-center p-2">
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--tf-primary)" }}>{members.length}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--tf-text-muted)" }}>Team Members</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="tf-card tf-card-body">
                <h6 className="tf-section-title mb-3">Team</h6>
                <div className="d-flex flex-column gap-2">
                  {members.map((m) => <UserAvatar key={m.id} user={m} showName size={32} />)}
                </div>
              </div>
            </div>
          </div>
        </Tab>

        <Tab eventKey="tasks" title={`Tasks (${projectTasks.length})`}>
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowTaskModal(true)}><FiPlus /> Add Task</button>
          </div>
          {projectTasks.length === 0 ? (
            <EmptyState icon={FiCheckSquare} title="No tasks found" message="Add the first task for this project." />
          ) : (
            <div className="row g-2">
              {projectTasks.map((t) => (
                <div className="col-12 col-md-6 col-xl-4" key={t.id}><TaskCard task={t} /></div>
              ))}
            </div>
          )}
        </Tab>

        <Tab eventKey="team" title="Team">
          <div className="row g-3">
            {members.map((m) => (
              <div className="col-12 col-sm-6 col-lg-4" key={m.id}>
                <div className="tf-card tf-card-body d-flex align-items-center gap-3">
                  <UserAvatar user={m} size={48} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--tf-text-muted)" }}>{m.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tab>

        <Tab eventKey="activity" title="Activity">
          {projectActivities.length === 0 ? (
            <EmptyState icon={FiCalendar} title="No activity yet" />
          ) : (
            <div className="tf-card tf-card-body">
              <div className="d-flex flex-column gap-3">
                {projectActivities.map((a) => {
                  const user = users.find((u) => u.id === a.userId);
                  return (
                    <div key={a.id} className="d-flex gap-2">
                      <UserAvatar user={user} size={30} />
                      <div>
                        <div style={{ fontSize: "0.85rem" }}><strong>{user?.name}</strong> {a.action} <em>"{a.target}"</em></div>
                        <div style={{ fontSize: "0.72rem", color: "var(--tf-text-faint)" }}>{timeAgo(a.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Tab>

        <Tab eventKey="files" title="Files">
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={addMockFile}><FiUpload /> Add File</button>
          </div>
          {project.files.length === 0 ? (
            <EmptyState icon={FiFile} title="No files yet" message="Add a document to keep everything in one place." />
          ) : (
            <div className="tf-card">
              {project.files.map((f, i) => (
                <div key={f.id} className={`d-flex align-items-center justify-content-between p-3 ${i > 0 ? "border-top" : ""}`} style={{ borderColor: "var(--tf-border)" }}>
                  <div className="d-flex align-items-center gap-3">
                    <FiFile size={20} style={{ color: "var(--tf-primary)" }} />
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{f.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--tf-text-muted)" }}>{f.size} · Uploaded {formatDate(f.uploadedAt)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Tab>
      </Tabs>

      <TaskModal show={showTaskModal} onHide={() => setShowTaskModal(false)} defaultProjectId={project.id} />
      <ProjectModal show={showEditModal} onHide={() => setShowEditModal(false)} project={project} />
      <ConfirmDialog
        show={showDelete}
        title="Delete project"
        message={`Are you sure you want to delete "${project.name}"? This will also delete its tasks.`}
        confirmLabel="Delete"
        onCancel={() => setShowDelete(false)}
        onConfirm={() => {
          deleteProject(project.id);
          navigate("/projects");
        }}
      />
    </div>
  );
};

export default ProjectDetails;
