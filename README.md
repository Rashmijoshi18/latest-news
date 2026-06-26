# 📰 GNews Reader
# 📰 GNews Reader 

[![Node Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-blue.svg?style=for-the-badge)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-9333ea?style=for-the-badge&logo=vite)](https://vite.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)

A high-performance, beautifully styled, full-stack news reading application built with a **React (Vite) TypeScript frontend** and an **Express (Node.js) backend**. The application pulls live news articles using the GNews API, managing state gracefully on the client while establishing rigorous request caching, sanitation, and security rate limits on the backend.

Designed as an interview-ready showcase, the project emphasizes clean engineering patterns, custom React hooks in TypeScript, responsive UI layouts with zero UI frameworks (pure CSS), and offline-resilient local persistence.

---

## 🎨 Preview & Live Demo

> **Live Demo Link:** `https://your-portfolio-link.vercel.app` *(Replace with your deployment)*

```
[ INSERT APP GIF / SCREENSHOT CAROUSEL HERE ]
```

---

## 🚀 Features Checklist

- [x] **🌓 Dynamic Dark Mode Toggle** — Instantly switch between light and dark modes. State is fully synchronized across the application and persisted in `localStorage`.
- [x] **⭐ Client-Side Bookmarks** — Save articles to read offline. Includes a responsive badge count in the navigation bar that synchronizes instantly using cross-component custom events.
- [x] **♾️ Infinite Scroll** — Replaces jerky pagination with an elegant, infinite-scrolling feed powered by the native HTML5 `IntersectionObserver` API.
- [x] **⚡ Shimmer Skeleton Loaders** — Uses CSS-only animated placeholder cards while articles are loading, avoiding layout shifts (CLS) and replacing generic loaders.
- [x] **🔗 Web Share Integration** — Seamlessly share articles with native device menus using the `navigator.share` API, falling back to clipboard copying with toast confirmation alerts.
- [x] **📈 Top Progress Loading Bar** — An animating top loading indicator bar running at the header during server roundtrips, styled using CSS transitions.
- [x] **🛡️ Backend Rate-Limiting** — Express server rate limits requests (100 requests / 15 mins per IP) using `express-rate-limit` to prevent denial-of-service and API abuse.
- [x] **🧹 Query Input Sanitation** — Sanitizes, validates, and filters incoming URL query parameters on the backend utilizing `express-validator` to mitigate security exploits.
- [x] **⚠️ Error Boundary & Empty States** — Handles JavaScript errors gracefully without crashing the whole application, showing friendly error recovery cards and interactive empty states.

---

## 🛠️ Tech Stack & Badges

### Frontend
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## 📁 Folder Structure Directory Tree

```
latest-news/
├── package.json               # Root workspace controller (npm run dev runs concurrently)
├── news-backend/              # Express API Server
│   ├── controllers/           # Route logic handlers
│   ├── models/                # MongoDB/Mongoose Schemas
│   ├── routes/                # Endpoint routes definitions
│   ├── utils/                 # Caching and mock news data modules
│   ├── render.yaml            # Render hosting cloud configurations
│   ├── index.js               # Server boot, environment & rate-limit configuration
│   └── package.json
└── news-frontend/             # React Application (Vite-powered)
    ├── vercel.json            # Vercel SPA routing redirects
    ├── tsconfig.json          # Main TypeScript reference configs
    ├── tsconfig.app.json      # App TypeScript compile rules
    ├── tsconfig.node.json     # Node scripts (Vite configs) compiler rules
    ├── index.html
    ├── src/
    │   ├── main.tsx           # Mounting logic and global stylesheet loading
    │   ├── App.tsx            # Routing, global alerts, and state coordinator
    │   ├── components/        # Reusable visual components
    │   │   ├── ErrorBoundary.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── NewsCard.tsx
    │   │   ├── Skeleton.tsx
    │   │   └── Toast.tsx
    │   ├── constants/         # Static lookup collections & clients
    │   │   ├── api.ts
    │   │   └── categories.ts
    │   ├── hooks/             # Custom React Hooks
    │   │   ├── useBookmarks.ts
    │   │   ├── useDarkMode.ts
    │   │   └── useNews.ts
    │   ├── pages/             # Page-level route targets
    │   │   ├── Bookmarks.tsx
    │   │   ├── Home.tsx
    │   │   └── NotFound.tsx
    │   ├── styles/            # Themes & Core layouts
    │   │   ├── global.css
    │   │   └── variables.css
    │   └── utils/             # Independent helper modules
    │       ├── formatDate.ts
    │       └── truncateText.ts
    └── package.json
```

---

## ⚙️ Getting Started & Local Setup

Follow these simple steps to run the entire application on your system locally:

### 1. Pre-requisites
- **Node.js** v18.0.0 or higher
- **MongoDB** installed and running locally (optional: backend runs and falls back gracefully)
- A **GNews API Key** (obtain a free key at [GNews.io](https://gnews.io/))

### 2. Clone and Install Root
Clone the repository, enter the root directory, and run the install script:
```bash
git clone https://github.com/Rashmijoshi18/latest-news.git
cd latest-news
npm install
```

### 3. Setup Configurations
Create a `.env` configuration file inside `news-backend/`:
```bash
# Enter news-backend folder
cd news-backend
touch .env
```
Inside `news-backend/.env`, add:
```env
PORT=5000
GNEWS_API_KEY=your_gnews_api_token_here
MONGO_URI=mongodb://127.0.0.1:27017/newsapi
```

### 4. Launch Application in Development
Return to the root folder (`latest-news/`) and launch the unified dev server:
```bash
cd ..
npm run dev
```
Both servers boot concurrently:
- **Frontend App:** [http://localhost:5173](http://localhost:5173) (Vite Dev Server)
- **Backend API:** [http://localhost:5000](http://localhost:5000) (Express App)

---

## 🔗 Express API Endpoints

The backend routes serve news articles and store MongoDB articles if configured:

| Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/news` | `country`, `topic`, `q`, `max`, `page` | Fetches live articles using GNews API. Sanitized & validated. |
| `GET` | `/api/articles` | `topic` | Retrieves saved news from MongoDB database. |
| `POST` | `/api/articles` | *(Body JSON)* | Saves an article directly into the database. |

---

## 💻 What I Learned (Interview Highlights)

Building this application helped me practice and implement several key full-stack software design concepts:

* **TypeScript Type Safety & Quality Standards:** Migrated the frontend React client to TypeScript. Defined strict interface boundaries for news payloads (`Article`, `ArticleSource`), custom hooks, and React component props, preventing compilation bugs and ensuring standard production safety.
* **Custom Hooks for State Isolation:** Separating core logic (fetching news, toggling dark mode, saving bookmarks) into reusable hooks (`useNews`, `useDarkMode`, `useBookmarks`) keeps components modular, testable, and clean.
* **Optimized Web API Integration:** Using `IntersectionObserver` for infinite scroll instead of bloated external libraries keeps the package bundle small. Implementing debouncing on search parameters saves GNews API quota usage.
* **Defensive Frontend Engineering:** Wrapped the layout inside a custom React class `ErrorBoundary` so that single-component rendering bugs catch gracefully instead of displaying a blank white browser screen.
* **REST Security Best Practices:** Added `express-rate-limit` middleware on the Node backend to deter Denial of Service (DoS) and API abuse, alongside validation schemas in `express-validator` to reject malformed parameters.
* **Offline-Resilience:** Bookmarked articles are managed using client-side `localStorage`, meaning users can recall saved news items even without internet connection or a running MongoDB server database.

---

## 🌎 Deployment Guide

### Vercel (Frontend Client)
1. Install Vercel CLI or connect GitHub:
2. Ensure you have the `vercel.json` rewrite file included in `news-frontend/` (pre-configured).
3. Set your environment variable: `VITE_BACKEND_URL=https://your-backend-url.render.com`

### Render (Backend API Server)
1. Deploy `news-backend/` as a web service.
2. Setup environment variables: `GNEWS_API_KEY`, `PORT=5000`.
3. Render automatically reads the `render.yaml` infrastructure configuration.
