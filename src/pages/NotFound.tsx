import React from "react";
import { Link } from "react-router-dom";
import { FiAlertOctagon } from "react-icons/fi";

const NotFound: React.FC = () => (
  <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: "100vh", padding: "2rem" }}>
    <FiAlertOctagon size={48} style={{ color: "var(--tf-text-faint)" }} className="mb-3" />
    <h2 className="mb-2">Page not found</h2>
    <p className="mb-4" style={{ color: "var(--tf-text-muted)" }}>The page you're looking for doesn't exist or was moved.</p>
    <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
  </div>
);

export default NotFound;
