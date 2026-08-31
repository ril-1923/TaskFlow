# TaskFlow

**Plan. Collaborate. Get Things Done.**

TaskFlow is a modern, fully frontend project & task management SaaS application, built as a professional React developer portfolio piece. It looks and works like a real product — Trello/Asana/ClickUp-style — with its own design identity.

## Tech Stack

- React 19 + TypeScript
- Vite
- Bootstrap 5 + React Bootstrap
- React Router DOM
- React Icons
- LocalStorage for persistence (no backend required)

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Demo Login

Authentication is frontend-only (simulated). On the login screen, any email/password combination will log you in — a demo account (`sarah.chen@taskflow.io`) is pre-filled for convenience. You can also register a new account from `/register`.

## Features

- Dashboard with live stats, progress charts, activity feed and upcoming deadlines
- Projects: grid/list views, search, filter, sort, full CRUD, tabbed project details (overview, tasks, team, activity, files)
- Tasks: full CRUD, subtasks, comments, tags, priorities, statuses
- Kanban board with drag-and-drop status changes
- Monthly calendar view of task due dates
- Team directory with per-member task/project stats
- Global activity timeline
- Notification center with read/unread state
- Profile and Settings pages (general, appearance, notifications, security)
- Global search across projects, tasks, and people
- Full light/dark theme support
- Fully responsive: desktop, tablet, and mobile (collapsible sidebar)

All application data (projects, tasks, notifications, profile, settings, theme) persists in the browser's LocalStorage, and the app ships with realistic demo data out of the box.

## Project Structure

```
src/
  assets/
  components/
    common/       shared UI primitives (badges, avatars, modals, etc.)
    dashboard/
    projects/
    tasks/
    team/
    layout/       Sidebar, Topbar, AppLayout
  context/        AppContext (global state + localStorage)
  data/           seed/demo data
  hooks/          useLocalStorage
  pages/          route-level pages
  routes/         ProtectedRoute
  types/          shared TypeScript types
  utils/          helper functions
```
