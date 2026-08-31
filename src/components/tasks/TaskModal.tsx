import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import type { Task, TaskPriority, TaskStatus } from "../../types";
import { useApp } from "../../context/AppContext";

interface Props {
  show: boolean;
  onHide: () => void;
  task?: Task | null;
  defaultProjectId?: string;
  defaultStatus?: TaskStatus;
}

const emptyForm = {
  title: "",
  description: "",
  status: "To Do" as TaskStatus,
  priority: "Medium" as TaskPriority,
  assigneeId: "",
  projectId: "",
  dueDate: "",
  tags: "",
};

const TaskModal: React.FC<Props> = ({ show, onHide, task, defaultProjectId, defaultStatus }) => {
  const { projects, users, addTask, updateTask } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (show) {
      if (task) {
        setForm({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigneeId: task.assigneeId,
          projectId: task.projectId,
          dueDate: task.dueDate,
          tags: task.tags.join(", "),
        });
      } else {
        setForm({ ...emptyForm, projectId: defaultProjectId || projects[0]?.id || "", assigneeId: users[0]?.id || "", status: defaultStatus || "To Do" });
      }
      setErrors({});
    }
  }, [show, task, defaultProjectId, defaultStatus, projects, users]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.projectId) errs.projectId = "Select a project.";
    if (!form.assigneeId) errs.assigneeId = "Select an assignee.";
    if (!form.dueDate) errs.dueDate = "Due date is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (task) {
      updateTask(task.id, { ...form, tags });
    } else {
      addTask({ ...form, tags });
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.1rem" }}>{task ? "Edit Task" : "Create Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Task title</Form.Label>
            <Form.Control
              value={form.title}
              isInvalid={!!errors.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Design the checkout page"
            />
            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What needs to be done?"
            />
          </Form.Group>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label>Project</Form.Label>
              <Form.Select isInvalid={!!errors.projectId} value={form.projectId} onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}>
                <option value="">Select project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.projectId}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label>Assignee</Form.Label>
              <Form.Select isInvalid={!!errors.assigneeId} value={form.assigneeId} onChange={(e) => setForm((f) => ({ ...f, assigneeId: e.target.value }))}>
                <option value="">Select assignee</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.assigneeId}</Form.Control.Feedback>
            </Col>
          </Row>
          <Row className="g-3 mb-3">
            <Col md={4}>
              <Form.Label>Status</Form.Label>
              <Form.Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}>
                {["To Do", "In Progress", "Review", "Completed"].map((s) => <option key={s} value={s}>{s}</option>)}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Priority</Form.Label>
              <Form.Select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}>
                {["Low", "Medium", "High", "Urgent"].map((s) => <option key={s} value={s}>{s}</option>)}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Due date</Form.Label>
              <Form.Control type="date" isInvalid={!!errors.dueDate} value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
              <Form.Control.Feedback type="invalid">{errors.dueDate}</Form.Control.Feedback>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="frontend, urgent" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">{task ? "Save Changes" : "Create Task"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TaskModal;
