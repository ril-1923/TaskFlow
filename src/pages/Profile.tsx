import React, { useState } from "react";
import { FiSave, FiMail, FiBriefcase, FiMapPin } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import UserAvatar from "../components/common/UserAvatar";

const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    jobTitle: currentUser.jobTitle,
    department: currentUser.department,
    location: currentUser.location,
    bio: currentUser.bio,
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="mb-1">Profile</h3>
        <p className="mb-0" style={{ color: "var(--tf-text-muted)" }}>Manage your personal information.</p>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="tf-card tf-card-body text-center">
            <UserAvatar user={{ ...currentUser, ...form, initials: form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() }} size={90} />
            <h5 className="mt-3 mb-0">{form.name}</h5>
            <p style={{ color: "var(--tf-text-muted)", fontSize: "0.85rem" }}>{form.jobTitle}</p>
            <div className="d-flex flex-column gap-2 mt-3 text-start">
              <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.85rem", color: "var(--tf-text-muted)" }}><FiMail /> {form.email}</div>
              <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.85rem", color: "var(--tf-text-muted)" }}><FiBriefcase /> {form.department}</div>
              <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.85rem", color: "var(--tf-text-muted)" }}><FiMapPin /> {form.location}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="tf-card tf-card-body">
            <h6 className="tf-section-title mb-3">Edit Information</h6>
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full name</label>
                  <input className={`form-control ${errors.name ? "is-invalid" : ""}`} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Job title</label>
                  <input className="form-control" value={form.jobTitle} onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Department</label>
                  <input className="form-control" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input className="form-control" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                </div>
                <div className="col-12">
                  <label className="form-label">Bio</label>
                  <textarea className="form-control" rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 mt-3">
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2"><FiSave /> Save Changes</button>
                {saved && <span style={{ color: "var(--tf-success)", fontSize: "0.85rem", fontWeight: 600 }}>Profile updated successfully.</span>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
