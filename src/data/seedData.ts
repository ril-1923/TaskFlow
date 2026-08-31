import type {
  User,
  Project,
  Task,
  Notification,
  Activity,
  TaskStatus,
  TaskPriority,
  ProjectStatus,
  Priority,
} from "../types";
import { addDays, uid } from "../utils/helpers";

const today = new Date();

export const users: User[] = [
  { id: "u1", name: "Sarah Chen", email: "sarah.chen@taskflow.io", role: "Project Manager", department: "Operations", avatarColor: "#6366F1", initials: "SC", status: "Active", jobTitle: "Senior Project Manager", location: "San Francisco, CA", bio: "Keeps every project on track and every team aligned." },
  { id: "u2", name: "John Miller", email: "john.miller@taskflow.io", role: "Frontend Developer", department: "Engineering", avatarColor: "#0EA5E9", initials: "JM", status: "Active", jobTitle: "Senior Frontend Developer", location: "Austin, TX", bio: "React enthusiast who cares deeply about UI performance." },
  { id: "u3", name: "Mohamed Ali", email: "mohamed.ali@taskflow.io", role: "Backend Developer", department: "Engineering", avatarColor: "#14B8A6", initials: "MA", status: "Away", jobTitle: "Backend Engineer", location: "Cairo, EG", bio: "Builds resilient APIs and loves a clean database schema." },
  { id: "u4", name: "Emma Davis", email: "emma.davis@taskflow.io", role: "UI/UX Designer", department: "Design", avatarColor: "#F59E0B", initials: "ED", status: "Active", jobTitle: "Product Designer", location: "London, UK", bio: "Designs interfaces people actually enjoy using." },
  { id: "u5", name: "Alex Johnson", email: "alex.johnson@taskflow.io", role: "QA Engineer", department: "Engineering", avatarColor: "#EF4444", initials: "AJ", status: "Active", jobTitle: "QA Lead", location: "Toronto, CA", bio: "Finds the bugs before your customers do." },
  { id: "u6", name: "Priya Patel", email: "priya.patel@taskflow.io", role: "Marketing Manager", department: "Marketing", avatarColor: "#EC4899", initials: "PP", status: "Offline", jobTitle: "Marketing Lead", location: "Mumbai, IN", bio: "Turns product milestones into stories worth sharing." },
  { id: "u7", name: "David Kim", email: "david.kim@taskflow.io", role: "Backend Developer", department: "Engineering", avatarColor: "#8B5CF6", initials: "DK", status: "Active", jobTitle: "Backend Engineer", location: "Seoul, KR", bio: "Infrastructure and scaling are his happy place." },
  { id: "u8", name: "Laura Bennett", email: "laura.bennett@taskflow.io", role: "Frontend Developer", department: "Engineering", avatarColor: "#22C55E", initials: "LB", status: "Active", jobTitle: "Frontend Developer", location: "Berlin, DE", bio: "Component libraries and design systems are her craft." },
  { id: "u9", name: "Carlos Rivera", email: "carlos.rivera@taskflow.io", role: "Project Manager", department: "Operations", avatarColor: "#F97316", initials: "CR", status: "Away", jobTitle: "Program Manager", location: "Mexico City, MX", bio: "Coordinates cross-functional launches end to end." },
  { id: "u10", name: "Nina Kowalski", email: "nina.kowalski@taskflow.io", role: "UI/UX Designer", department: "Design", avatarColor: "#06B6D4", initials: "NK", status: "Active", jobTitle: "UX Researcher", location: "Warsaw, PL", bio: "Talks to users so the team doesn't have to guess." },
];

const projectSeed: Array<{
  name: string;
  description: string;
  managerId: string;
  memberIds: string[];
  status: ProjectStatus;
  priority: Priority;
  startOffset: number;
  dueOffset: number;
}> = [
  { name: "E-Commerce Platform", description: "A full-featured online storefront with cart, checkout, and order management.", managerId: "u1", memberIds: ["u2", "u3", "u4", "u5"], status: "In Progress", priority: "High", startOffset: -40, dueOffset: 25 },
  { name: "Mobile Banking App", description: "Secure mobile banking experience with biometric login and instant transfers.", managerId: "u9", memberIds: ["u3", "u7", "u10", "u5"], status: "In Progress", priority: "Critical", startOffset: -60, dueOffset: 15 },
  { name: "Marketing Website", description: "Public marketing site redesign to support the new product launch.", managerId: "u6", memberIds: ["u4", "u8", "u10"], status: "Completed", priority: "Medium", startOffset: -90, dueOffset: -10 },
  { name: "CRM Dashboard", description: "Internal CRM dashboard for the sales team with pipeline analytics.", managerId: "u1", memberIds: ["u2", "u7", "u5"], status: "Planning", priority: "Medium", startOffset: 5, dueOffset: 70 },
  { name: "Travel Booking System", description: "End-to-end travel booking flow with flights, hotels, and itineraries.", managerId: "u9", memberIds: ["u3", "u8", "u4", "u10"], status: "In Progress", priority: "High", startOffset: -30, dueOffset: 40 },
  { name: "Healthcare Portal", description: "Patient portal for appointments, records, and secure messaging.", managerId: "u1", memberIds: ["u7", "u2", "u5", "u10"], status: "On Hold", priority: "High", startOffset: -20, dueOffset: 50 },
  { name: "AI SaaS Platform", description: "Analytics platform powered by machine learning insights for enterprise teams.", managerId: "u9", memberIds: ["u3", "u7", "u8", "u4"], status: "In Progress", priority: "Critical", startOffset: -15, dueOffset: 60 },
  { name: "Company Website Redesign", description: "Refresh of the corporate website with a new visual identity and CMS.", managerId: "u6", memberIds: ["u4", "u10", "u8"], status: "Planning", priority: "Low", startOffset: 10, dueOffset: 45 },
];

export const projects: Project[] = projectSeed.map((p, i) => ({
  id: `p${i + 1}`,
  name: p.name,
  description: p.description,
  managerId: p.managerId,
  memberIds: p.memberIds,
  startDate: addDays(today, p.startOffset),
  dueDate: addDays(today, p.dueOffset),
  status: p.status,
  priority: p.priority,
  files: [
    { id: uid("f"), name: "Project Brief.pdf", size: "1.2 MB", type: "pdf", uploadedAt: addDays(today, p.startOffset + 1), uploadedBy: p.managerId },
    { id: uid("f"), name: "Design Assets.fig", size: "8.4 MB", type: "figma", uploadedAt: addDays(today, p.startOffset + 4), uploadedBy: p.memberIds[0] },
  ],
}));

const taskTitles = [
  "Design landing page hero section", "Set up authentication flow", "Build REST API for orders",
  "Create database schema", "Implement payment gateway", "Write unit tests for checkout",
  "Fix responsive layout bugs", "Optimize image loading", "Set up CI/CD pipeline",
  "Design onboarding flow", "Build notification service", "Create admin dashboard",
  "Integrate analytics tracking", "Write API documentation", "Conduct usability testing",
  "Set up staging environment", "Design email templates", "Implement search functionality",
  "Build user profile page", "Create component library", "Fix accessibility issues",
  "Implement dark mode", "Set up error monitoring", "Design mobile navigation",
  "Build data export feature", "Optimize database queries", "Create style guide",
  "Implement two-factor auth", "Design pricing page", "Write end-to-end tests",
];

const statuses: TaskStatus[] = ["To Do", "In Progress", "Review", "Completed"];
const taskPriorities: TaskPriority[] = ["Low", "Medium", "High", "Urgent"];
const tagPool = ["frontend", "backend", "design", "bug", "urgent", "api", "ux", "infra", "docs", "testing"];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export const tasks: Task[] = taskTitles.map((title, i) => {
  const project = projects[i % projects.length];
  const assignee = project.memberIds[i % project.memberIds.length];
  const status = pick(statuses, i);
  const priority = pick(taskPriorities, i + 2);
  const dueOffset = (i % 20) - 8;
  const subtaskCount = (i % 3) + 2;
  return {
    id: `t${i + 1}`,
    title,
    description: `Detailed work item covering "${title.toLowerCase()}" for the ${project.name} project. Includes coordination with the wider team and review before merging.`,
    status,
    priority,
    assigneeId: assignee,
    projectId: project.id,
    dueDate: addDays(today, dueOffset),
    createdAt: addDays(today, dueOffset - 12),
    tags: [pick(tagPool, i), pick(tagPool, i + 3)],
    comments: [
      { id: uid("c"), userId: project.managerId, text: "Let's make sure this lines up with the sprint goals.", createdAt: addDays(today, dueOffset - 3) },
    ],
    subtasks: Array.from({ length: subtaskCount }).map((_, si) => ({
      id: uid("st"),
      title: `Subtask ${si + 1} for ${title}`,
      completed: status === "Completed" ? true : si < subtaskCount - 2,
    })),
  };
});

const notifTemplates: Array<{ title: string; message: string; type: Notification["type"] }> = [
  { title: "Deadline approaching", message: "\"Design landing page hero section\" is due tomorrow.", type: "deadline" },
  { title: "Task assigned to you", message: "Sarah Chen assigned you \"Build REST API for orders\".", type: "assignment" },
  { title: "Project completed", message: "\"Marketing Website\" has been marked as completed.", type: "completion" },
  { title: "New comment", message: "Emma Davis commented on \"Create admin dashboard\".", type: "comment" },
  { title: "Task marked urgent", message: "\"Implement payment gateway\" was changed to Urgent priority.", type: "urgent" },
  { title: "Deadline approaching", message: "\"Fix responsive layout bugs\" is due in 2 days.", type: "deadline" },
  { title: "Task assigned to you", message: "Carlos Rivera assigned you \"Set up CI/CD pipeline\".", type: "assignment" },
  { title: "New comment", message: "Mohamed Ali replied on \"Build user profile page\".", type: "comment" },
  { title: "Project completed", message: "\"Q2 Internal Tools\" milestone reached completion.", type: "completion" },
  { title: "Task marked urgent", message: "\"Set up staging environment\" is now Urgent.", type: "urgent" },
  { title: "Deadline approaching", message: "\"Design onboarding flow\" is due today.", type: "deadline" },
  { title: "Task assigned to you", message: "Alex Johnson assigned you \"Write end-to-end tests\".", type: "assignment" },
  { title: "New comment", message: "Nina Kowalski commented on \"Design pricing page\".", type: "comment" },
  { title: "Deadline approaching", message: "\"Implement two-factor auth\" is overdue.", type: "deadline" },
  { title: "Project completed", message: "\"Company intranet revamp\" was completed ahead of schedule.", type: "completion" },
];

export const notifications: Notification[] = notifTemplates.map((n, i) => ({
  id: uid("n"),
  title: n.title,
  message: n.message,
  type: n.type,
  read: i > 4,
  createdAt: addDays(today, -(i % 7)),
}));

const activityVerbs: Array<{ action: string; type: Activity["type"] }> = [
  { action: "created a new task", type: "create" },
  { action: "completed a task", type: "complete" },
  { action: "updated a project", type: "update" },
  { action: "changed task priority", type: "priority" },
  { action: "added a comment", type: "comment" },
  { action: "updated the project deadline", type: "update" },
  { action: "deleted a task", type: "delete" },
  { action: "moved a task to Review", type: "update" },
  { action: "created a new project", type: "create" },
  { action: "marked a task as completed", type: "complete" },
];

export const activities: Activity[] = Array.from({ length: 20 }).map((_, i) => {
  const verb = pick(activityVerbs, i);
  const project = pick(projects, i);
  const task = pick(tasks, i * 3);
  const user = pick(users, i);
  const target = verb.action.includes("project") ? project.name : task.title;
  return {
    id: uid("a"),
    userId: user.id,
    action: verb.action,
    target,
    type: verb.type,
    createdAt: addDays(today, -(i % 10)) + `T${String(8 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:00`,
  };
}).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
