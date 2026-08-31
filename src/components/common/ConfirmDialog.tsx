import React from "react";
import { Modal, Button } from "react-bootstrap";

interface Props {
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({ show, title, message, confirmLabel = "Confirm", variant = "danger", onConfirm, onCancel }) => (
  <Modal show={show} onHide={onCancel} centered>
    <Modal.Header closeButton>
      <Modal.Title style={{ fontSize: "1.05rem" }}>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onCancel}>Cancel</Button>
      <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmDialog;
