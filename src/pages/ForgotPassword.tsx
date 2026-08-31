import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiZap, FiMail, FiCheckCircle } from "react-icons/fi";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    setError("");
    setSent(true);
  };

  return (
    <div className="tf-auth-page">
      <div className="tf-auth-visual d-none d-lg-flex">
        <div className="d-flex align-items-center gap-2 fw-bold fs-4">
          <FiZap /> TaskFlow
        </div>
        <div>
          <h2 className="text-white fw-bold mb-3">Forgot your<br />password?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 380 }}>
            No worries. We'll help you get back into your workspace in a couple of clicks.
          </p>
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>© 2026 TaskFlow. All rights reserved.</div>
      </div>
      <div className="tf-auth-form-wrap">
        <div className="tf-auth-card">
          <div className="d-lg-none d-flex align-items-center gap-2 fw-bold fs-4 mb-4" style={{ color: "var(--tf-primary)" }}>
            <FiZap /> TaskFlow
          </div>
          {sent ? (
            <div className="text-center">
              <FiCheckCircle size={44} style={{ color: "var(--tf-success)" }} className="mb-3" />
              <h4 className="mb-2">Check your inbox</h4>
              <p style={{ color: "var(--tf-text-muted)" }}>
                We sent a password reset link to <strong>{email}</strong>. It may take a minute to arrive.
              </p>
              <Link to="/login" className="btn btn-outline-secondary mt-2">Back to login</Link>
            </div>
          ) : (
            <>
              <h3 className="mb-1">Reset your password</h3>
              <p className="mb-4" style={{ color: "var(--tf-text-muted)" }}>Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label className="form-label">Email</label>
                  <div className="position-relative">
                    <FiMail className="position-absolute" style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--tf-text-faint)" }} />
                    <input type="email" className={`form-control ps-5 ${error ? "is-invalid" : ""}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                    {error && <div className="invalid-feedback">{error}</div>}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2 mb-3">Send Reset Link</button>
                <p className="text-center mb-0" style={{ fontSize: "0.88rem", color: "var(--tf-text-muted)" }}>
                  Remembered it? <Link to="/login">Back to login</Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
