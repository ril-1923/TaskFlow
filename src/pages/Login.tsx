import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiZap, FiMail, FiLock } from "react-icons/fi";
import { useApp } from "../context/AppContext";

const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("sarah.chen@taskflow.io");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    login(email.split("@")[0].replace(".", " "), email);
    navigate("/dashboard");
  };

  return (
    <div className="tf-auth-page">
      <div className="tf-auth-visual d-none d-lg-flex">
        <div className="d-flex align-items-center gap-2 fw-bold fs-4">
          <FiZap /> TaskFlow
        </div>
        <div>
          <h2 className="text-white fw-bold mb-3">Plan. Collaborate.<br />Get Things Done.</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 380 }}>
            Everything your team needs to plan sprints, track tasks, and ship projects on time — in one clean workspace.
          </p>
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>© 2026 TaskFlow. All rights reserved.</div>
      </div>
      <div className="tf-auth-form-wrap">
        <div className="tf-auth-card">
          <div className="d-lg-none d-flex align-items-center gap-2 fw-bold fs-4 mb-4" style={{ color: "var(--tf-primary)" }}>
            <FiZap /> TaskFlow
          </div>
          <h3 className="mb-1">Welcome back</h3>
          <p className="mb-4" style={{ color: "var(--tf-text-muted)" }}>Log in to continue to your workspace.</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="position-relative">
                <FiMail className="position-absolute" style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--tf-text-faint)" }} />
                <input type="email" className={`form-control ps-5 ${errors.email ? "is-invalid" : ""}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="position-relative">
                <FiLock className="position-absolute" style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--tf-text-faint)" }} />
                <input type="password" className={`form-control ps-5 ${errors.password ? "is-invalid" : ""}`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <label className="form-check-label" htmlFor="remember" style={{ fontSize: "0.88rem" }}>Remember me</label>
              </div>
              <Link to="/forgot-password" style={{ fontSize: "0.88rem" }}>Forgot password?</Link>
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 mb-3">Log In</button>
            <p className="text-center mb-0" style={{ fontSize: "0.88rem", color: "var(--tf-text-muted)" }}>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
