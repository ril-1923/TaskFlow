import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiZap, FiMail, FiLock, FiUser } from "react-icons/fi";
import { useApp } from "../context/AppContext";

const Register: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    login(form.name, form.email);
    navigate("/dashboard");
  };

  return (
    <div className="tf-auth-page">
      <div className="tf-auth-visual d-none d-lg-flex">
        <div className="d-flex align-items-center gap-2 fw-bold fs-4">
          <FiZap /> TaskFlow
        </div>
        <div>
          <h2 className="text-white fw-bold mb-3">Join your team's<br />command center.</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 380 }}>
            Create an account to start organizing projects, assigning tasks, and tracking progress in real time.
          </p>
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>© 2026 TaskFlow. All rights reserved.</div>
      </div>
      <div className="tf-auth-form-wrap">
        <div className="tf-auth-card">
          <div className="d-lg-none d-flex align-items-center gap-2 fw-bold fs-4 mb-4" style={{ color: "var(--tf-primary)" }}>
            <FiZap /> TaskFlow
          </div>
          <h3 className="mb-1">Create your account</h3>
          <p className="mb-4" style={{ color: "var(--tf-text-muted)" }}>Get started in less than a minute.</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <div className="position-relative">
                <FiUser className="position-absolute" style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--tf-text-faint)" }} />
                <input className={`form-control ps-5 ${errors.name ? "is-invalid" : ""}`} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Jane Cooper" />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="position-relative">
                <FiMail className="position-absolute" style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--tf-text-faint)" }} />
                <input type="email" className={`form-control ps-5 ${errors.email ? "is-invalid" : ""}`} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@company.com" />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="position-relative">
                <FiLock className="position-absolute" style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--tf-text-faint)" }} />
                <input type="password" className={`form-control ps-5 ${errors.password ? "is-invalid" : ""}`} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Confirm password</label>
              <div className="position-relative">
                <FiLock className="position-absolute" style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--tf-text-faint)" }} />
                <input type="password" className={`form-control ps-5 ${errors.confirm ? "is-invalid" : ""}`} value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" />
                {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 mb-3">Create Account</button>
            <p className="text-center mb-0" style={{ fontSize: "0.88rem", color: "var(--tf-text-muted)" }}>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
