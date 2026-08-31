import React, { useState } from "react";
import { FiSun, FiMoon, FiSave, FiLock } from "react-icons/fi";
import { useApp } from "../context/AppContext";

const timezones = ["Pacific Time (US & Canada)", "Mountain Time (US & Canada)", "Central Time (US & Canada)", "Eastern Time (US & Canada)", "Greenwich Mean Time", "Central European Time", "India Standard Time"];
const languages = ["English (US)", "English (UK)", "Spanish", "French", "German", "Hindi", "Japanese"];

const Settings: React.FC = () => {
  const { settings, updateSettings, theme, toggleTheme, currentUser, updateProfile } = useApp();
  const [general, setGeneral] = useState({ name: currentUser.name, email: currentUser.email, language: settings.language, timezone: settings.timezone });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [generalSaved, setGeneralSaved] = useState(false);

  const saveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: general.name, email: general.email });
    updateSettings({ language: general.language, timezone: general.timezone });
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 2500);
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next) return setPasswordError("Please fill in all password fields.");
    if (passwordForm.next.length < 6) return setPasswordError("New password must be at least 6 characters.");
    if (passwordForm.next !== passwordForm.confirm) return setPasswordError("Passwords do not match.");
    setPasswordError("");
    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="mb-1">Settings</h3>
        <p className="mb-0" style={{ color: "var(--tf-text-muted)" }}>Manage your account and workspace preferences.</p>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="tf-card tf-card-body mb-3">
            <h6 className="tf-section-title mb-3">General</h6>
            <form onSubmit={saveGeneral}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" value={general.name} onChange={(e) => setGeneral((g) => ({ ...g, name: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={general.email} onChange={(e) => setGeneral((g) => ({ ...g, email: e.target.value }))} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label">Language</label>
                  <select className="form-select" value={general.language} onChange={(e) => setGeneral((g) => ({ ...g, language: e.target.value }))}>
                    {languages.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Timezone</label>
                  <select className="form-select" value={general.timezone} onChange={(e) => setGeneral((g) => ({ ...g, timezone: e.target.value }))}>
                    {timezones.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2"><FiSave /> Save</button>
                {generalSaved && <span style={{ color: "var(--tf-success)", fontSize: "0.85rem", fontWeight: 600 }}>Saved.</span>}
              </div>
            </form>
          </div>

          <div className="tf-card tf-card-body">
            <h6 className="tf-section-title mb-3">Appearance</h6>
            <div className="d-flex gap-3">
              <button
                className="btn flex-fill d-flex flex-column align-items-center gap-2 py-3"
                style={{ border: `2px solid ${theme === "light" ? "var(--tf-primary)" : "var(--tf-border)"}` }}
                onClick={() => theme !== "light" && toggleTheme()}
              >
                <FiSun size={22} /> Light Mode
              </button>
              <button
                className="btn flex-fill d-flex flex-column align-items-center gap-2 py-3"
                style={{ border: `2px solid ${theme === "dark" ? "var(--tf-primary)" : "var(--tf-border)"}` }}
                onClick={() => theme !== "dark" && toggleTheme()}
              >
                <FiMoon size={22} /> Dark Mode
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="tf-card tf-card-body mb-3">
            <h6 className="tf-section-title mb-3">Notifications</h6>
            <div className="d-flex flex-column gap-3">
              <div className="form-check form-switch d-flex justify-content-between align-items-center px-0">
                <label className="form-check-label" htmlFor="emailNotif">Email notifications</label>
                <input className="form-check-input" type="checkbox" role="switch" id="emailNotif" checked={settings.emailNotifications} onChange={(e) => updateSettings({ emailNotifications: e.target.checked })} />
              </div>
              <div className="form-check form-switch d-flex justify-content-between align-items-center px-0">
                <label className="form-check-label" htmlFor="taskNotif">Task notifications</label>
                <input className="form-check-input" type="checkbox" role="switch" id="taskNotif" checked={settings.taskNotifications} onChange={(e) => updateSettings({ taskNotifications: e.target.checked })} />
              </div>
              <div className="form-check form-switch d-flex justify-content-between align-items-center px-0">
                <label className="form-check-label" htmlFor="projectNotif">Project notifications</label>
                <input className="form-check-input" type="checkbox" role="switch" id="projectNotif" checked={settings.projectNotifications} onChange={(e) => updateSettings({ projectNotifications: e.target.checked })} />
              </div>
            </div>
          </div>

          <div className="tf-card tf-card-body">
            <h6 className="tf-section-title mb-3">Security</h6>
            <form onSubmit={savePassword}>
              <div className="mb-3">
                <label className="form-label">Current password</label>
                <input type="password" className="form-control" value={passwordForm.current} onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label">New password</label>
                  <input type="password" className="form-control" value={passwordForm.next} onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))} />
                </div>
                <div className="col-6">
                  <label className="form-label">Confirm password</label>
                  <input type="password" className="form-control" value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} />
                </div>
              </div>
              {passwordError && <div className="alert alert-danger py-2" style={{ fontSize: "0.85rem" }}>{passwordError}</div>}
              <div className="d-flex align-items-center gap-3">
                <button type="submit" className="btn btn-outline-secondary d-flex align-items-center gap-2"><FiLock /> Change Password</button>
                {passwordSaved && <span style={{ color: "var(--tf-success)", fontSize: "0.85rem", fontWeight: 600 }}>Password updated.</span>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
