import React, { createContext, useContext, useEffect, useMemo } from "react";
import type {
  User,
  Project,
  Task,
  Notification,
  Activity,
  AuthUser,
  AppSettings,
  TaskStatus,
} from "../types";
import { users as seedUsers, projects as seedProjects, tasks as seedTasks, notifications as seedNotifications, activities as seedActivities } from "../data/seedData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { uid } from "../utils/helpers";

interface AppContextValue {
  users: User[];
  projects: Project[];
  tasks: Task[];
  notifications: Notification[];
  activities: Activity[];
  theme: "light" | "dark";
  auth: AuthUser;
  settings: AppSettings;
  currentUser: User;

  toggleTheme: () => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;

  addProject: (project: Omit<Project, "id" | "files">) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addTask: (task: Omit<Task, "id" | "createdAt" | "comments" | "subtasks"> & { subtasks?: string[] }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, status: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addComment: (taskId: string, text: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  logActivity: (action: string, target: string, type: Activity["type"]) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useLocalStorage<User[]>("tf_users", seedUsers);
  const [projects, setProjects] = useLocalStorage<Project[]>("tf_projects", seedProjects);
  const [tasks, setTasks] = useLocalStorage<Task[]>("tf_tasks", seedTasks);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>("tf_notifications", seedNotifications);
  const [activities, setActivities] = useLocalStorage<Activity[]>("tf_activities", seedActivities);
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("tf_theme", "light");
  const [auth, setAuth] = useLocalStorage<AuthUser>("tf_auth", { name: "Sarah Chen", email: "sarah.chen@taskflow.io", loggedIn: true });
  const [settings, setSettings] = useLocalStorage<AppSettings>("tf_settings", {
    language: "English (US)",
    timezone: "Pacific Time (US & Canada)",
    emailNotifications: true,
    taskNotifications: true,
    projectNotifications: false,
  });
  const [profileOverrides, setProfileOverrides] = useLocalStorage<Partial<User>>("tf_profile", {});

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const currentUser: User = useMemo(() => {
    const base = users.find((u) => u.email === auth.email) || users[0];
    return { ...base, ...profileOverrides };
  }, [users, auth.email, profileOverrides]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const login = (name: string, email: string) => setAuth({ name, email, loggedIn: true });
  const logout = () => setAuth((a) => ({ ...a, loggedIn: false }));

  const updateProfile = (updates: Partial<User>) => setProfileOverrides((p) => ({ ...p, ...updates }));
  const updateSettings = (updates: Partial<AppSettings>) => setSettings((s) => ({ ...s, ...updates }));

  const logActivity = (action: string, target: string, type: Activity["type"]) => {
    setActivities((prev) => [
      { id: uid("a"), userId: currentUser.id, action, target, type, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const addProject: AppContextValue["addProject"] = (project) => {
    const newProject: Project = { ...project, id: uid("p"), files: [] };
    setProjects((prev) => [newProject, ...prev]);
    logActivity("created a new project", newProject.name, "create");
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    const p = projects.find((pr) => pr.id === id);
    if (p) logActivity("updated a project", p.name, "update");
  };

  const deleteProject = (id: string) => {
    const p = projects.find((pr) => pr.id === id);
    setProjects((prev) => prev.filter((pr) => pr.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    if (p) logActivity("deleted a project", p.name, "delete");
  };

  const addTask: AppContextValue["addTask"] = (task) => {
    const newTask: Task = {
      ...task,
      id: uid("t"),
      createdAt: new Date().toISOString(),
      comments: [],
      subtasks: (task.subtasks || []).map((title) => ({ id: uid("st"), title, completed: false })),
    };
    setTasks((prev) => [newTask, ...prev]);
    logActivity("created a new task", newTask.title, "create");
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    const t = tasks.find((tk) => tk.id === id);
    if (t) {
      if (updates.priority && updates.priority !== t.priority) logActivity("changed task priority", t.title, "priority");
      else if (updates.status === "Completed") logActivity("completed a task", t.title, "complete");
      else logActivity("updated a task", t.title, "update");
    }
  };

  const deleteTask = (id: string) => {
    const t = tasks.find((tk) => tk.id === id);
    setTasks((prev) => prev.filter((tk) => tk.id !== id));
    if (t) logActivity("deleted a task", t.title, "delete");
  };

  const moveTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    const t = tasks.find((tk) => tk.id === id);
    if (t) {
      if (status === "Completed") logActivity("completed a task", t.title, "complete");
      else logActivity(`moved a task to ${status}`, t.title, "update");
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s)) }
          : t
      )
    );
  };

  const addComment = (taskId: string, text: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, comments: [...t.comments, { id: uid("c"), userId: currentUser.id, text, createdAt: new Date().toISOString() }] }
          : t
      )
    );
    const t = tasks.find((tk) => tk.id === taskId);
    if (t) logActivity("added a comment", t.title, "comment");
  };

  const markNotificationRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllNotificationsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearNotifications = () => setNotifications([]);

  const value: AppContextValue = {
    users,
    projects,
    tasks,
    notifications,
    activities,
    theme,
    auth,
    settings,
    currentUser,
    toggleTheme,
    login,
    logout,
    updateProfile,
    updateSettings,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
    toggleSubtask,
    addComment,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    logActivity,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
