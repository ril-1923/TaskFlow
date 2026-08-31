import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Kanban from "./pages/Kanban";
import Calendar from "./pages/Calendar";
import Team from "./pages/Team";
import Activity from "./pages/Activity";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const App: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/tasks/:id" element={<TaskDetails />} />
      <Route path="/kanban" element={<Kanban />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/team" element={<Team />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Route>

    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
