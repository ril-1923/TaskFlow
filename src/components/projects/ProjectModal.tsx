import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import type { Project, ProjectStatus, Priority } from "../../types";
import { useApp } from "../../context/AppContext";

interface Props {
  show: boolean;
  onHide: () => void;
  project?: Project | null;
}

const emptyForm = {
  name: "",
  description: "",
  managerId: "",
  memberIds: [] as string[],
  status: "Planning" as ProjectStatus,
  priority: "Medium" as Priority,
  startDate: "",
  dueDate: "",
};

const ProjectModal: React.FC<Props> = ({ show, onHide, project }) => {
  const { users, addProject, updateProject } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (show) {
      if (project) {
        setForm({
          name: project.name,
          description: project.description,
          managerId: project.managerId,
          memberIds: project.memberIds,
          status: project.status,
          priority: project.priority,
          startDate: project.startDate,
          dueDate: project.dueDate,
        });
      } else {
        setForm({ ...emptyForm, managerId: users[0]?.id || "" });
      }
      setErrors({});
    }
  }, [show, project, users]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Project name is required.";
    if (!form.managerId) errs.managerId = "Select a manager.";
    if (!form.startDate) errs.startDate = "Start date is required.";
    if (!form.dueDate) errs.dueDate = "Due date is required.";
    if (form.startDate && form.dueDate && form.dueDate < form.startDate) errs.dueDate = "Due date must be after start date.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const toggleMember = (id: string) => {
    setForm((f) => ({
      ...f,
      memberIds: f.memberIds.includes(id) ? f.memberIds.filter((m) => m !== id) : [...f.memberIds, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (project) {
      updateProject(project.id, form);
    } else {
      addProject(form);
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.1rem" }}>{project ? "Edit Project" : "Create Project"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Project name</Form.Label>
            <Form.Control isInvalid={!!errors.name} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Customer Support Portal" />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What is this project about?" />
          </Form.Group>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label>Project manager</Form.Label>
              <Form.Select isInvalid={!!errors.managerId} value={form.managerId} onChange={(e) => setForm((f) => ({ ...f, managerId: e.target.value }))}>
                <option value="">Select manager</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.managerId}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label>Status</Form.Label>
              <Form.Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProjectStatus }))}>
                {["Planning", "In Progress", "On Hold", "Completed"].map((s) => <option key={s} value={s}>{s}</option>)}
              </Form.Select>
            </Col>
          </Row>
          <Row className="g-3 mb-3">
            <Col md={4}>
              <Form.Label>Priority</Form.Label>
              <Form.Select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}>
                {["Low", "Medium", "High", "Critical"].map((s) => <option key={s} value={s}>{s}</option>)}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Start date</Form.Label>
              <Form.Control type="date" isInvalid={!!errors.startDate} value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Due date</Form.Label>
              <Form.Control type="date" isInvalid={!!errors.dueDate} value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
              <Form.Control.Feedback type="invalid">{errors.dueDate}</Form.Control.Feedback>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Team members</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {users.map((u) => (
                <Form.Check
                  key={u.id}
                  type="checkbox"
                  id={`member-${u.id}`}
                  label={u.name}
                  checked={form.memberIds.includes(u.id)}
                  onChange={() => toggleMember(u.id)}
                  className="border rounded-pill px-3 py-1"
                  style={{ borderColor: "var(--tf-border)" }}
                />
              ))}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">{project ? "Save Changes" : "Create Project"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProjectModal;
