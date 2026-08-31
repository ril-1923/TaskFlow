export type ProjectStatus = "Planning" | "In Progress" | "On Hold" | "Completed";
export type Priority = "Low" | "Medium" | "High" | "Critical";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "To Do" | "In Progress" | "Review" | "Completed";
export type UserStatus = "Active" | "Away" | "Offline";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarColor: string;
  initials: string;
  status: UserStatus;
  jobTitle: string;
  location: string;
  bio: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  projectId: string;
  dueDate: string;
  createdAt: string;
  tags: string[];
  comments: Comment[];
  subtasks: Subtask[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  managerId: string;
  memberIds: string[];
  startDate: string;
  dueDate: string;
  status: ProjectStatus;
  priority: Priority;
  files: ProjectFile[];
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "deadline" | "assignment" | "completion" | "comment" | "urgent";
  read: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  target: string;
  type: "create" | "update" | "complete" | "comment" | "delete" | "priority";
  createdAt: string;
}

export interface AuthUser {
  name: string;
  email: string;
  loggedIn: boolean;
}

export interface AppSettings {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  taskNotifications: boolean;
  projectNotifications: boolean;
}
