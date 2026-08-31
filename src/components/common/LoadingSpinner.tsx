import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
    <Spinner animation="border" style={{ color: "var(--tf-primary)" }} />
    <span style={{ color: "var(--tf-text-muted)", fontSize: "0.85rem" }}>{label}</span>
  </div>
);

export default LoadingSpinner;
