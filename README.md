# 🌍 RCS — Real Country Sim

> A browser-based country simulation game where you take on the role of a national leader and manage every aspect of your country — from mining raw materials to building a thriving economy.

---

## 📖 Overview

**Real Country Sim (RCS)** is a simulation game currently in active early development. Players manage a virtual nation by making decisions across farming, mining, trade, military, science, infrastructure, and more. Every choice shapes the destiny of your country.

The project is a fullstack monorepo consisting of:

- A **React + Vite** frontend client
- An **Express.js** backend server
- **Appwrite** as the Backend-as-a-Service (BaaS) for authentication, database, and session management
- **Semantic Release** for automated versioning and changelog generation via Conventional Commits

---

## 🗂️ Project Structure

```
rcs/
├── client/               # React + Vite frontend
│   └── src/
│       ├── appwrite/     # Appwrite client setup
│       ├── components/   # Shared UI components
│       ├── pages/
│       │   ├── auth/     # Login & Register pages
│       │   ├── game/     # Game pages (Overview, Inventory)
│       │   └── admin/    # Admin panel pages
│       └── lib/          # Utility functions
├── server/               # Express.js backend
│   └── src/
│       ├── config/       # Appwrite config (DB IDs, table names)
│       ├── modules/
│       │   ├── auth/     # Registration logic
│       │   ├── player/   # Player stats
│       │   ├── inventory/# Inventory management
│       │   ├── mining/   # Mining activity & cooldowns
│       │   ├── economy/  # Balance/economy endpoints
│       │   ├── market/   # Marketplace (WIP)
│       │   └── admin/    # Admin endpoints (items, players)
│       ├── shared/       # Shared services (inventory mutations)
│       └── utils/        # Session extractor, Appwrite client, item picker
├── .github/workflows/    # CI/CD via GitHub Actions (semantic-release)
├── CHANGELOG.md
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- A running [Appwrite](https://appwrite.io/) instance
- npm

### 1. Clone the repository

```bash
git clone https://github.com/ZYRACX/rcs.git
cd rcs
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
```

Fill in your `.env`:

```env
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_PROJECT_NAME=RCS
APPWRITE_ENDPOINT=http://localhost/v1
APPWRITE_KEY=your_api_key
```

### 3. Configure the client

```bash
cd client
cp .env.example .env
```

Fill in your `.env`:

```env
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_PROJECT_NAME=RCS
APPWRITE_ENDPOINT=http://localhost/v1
```

### 4. Install dependencies & run

```bash
# Server
cd server
npm install
npm run dev

# Client (separate terminal)
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:8000`.

---

## 🗺️ Roadmap

Track development progress. Check off items as they're completed.

### ✅ Completed
- [x] User registration & Appwrite authentication
- [x] Session-based auth with cookie extraction
- [x] Player stats endpoint (balance, level, XP)
- [x] Mining activity with probability-based item drops
- [x] Mining cooldown system (5s rate limit)
- [x] Player inventory system
- [x] Admin panel — item CRUD (add, edit, delete)
- [x] Admin panel — player profile inspector
- [x] Admin panel — player inventory inspector
- [x] Admin endpoints — give/remove items from player inventory
- [x] React frontend — auth pages (Login, Register)
- [x] React frontend — game overview dashboard
- [x] React frontend — inventory page
- [x] React frontend — admin panel with routing
- [x] Semantic release + Conventional Commits CI/CD pipeline

### 🔧 In Progress / Up Next
- [ ] Fishing activity
- [ ] Exploring activity
- [ ] Farming activity
- [ ] Industrial production activity
- [ ] Area expansion system

### 🔜 Planned Features
- [ ] Real-time system (live updates, WebSockets)
- [ ] Season system
- [ ] Craftable items & crafting UI
- [ ] Marketplace — buy/sell items between players
- [ ] Military system
- [ ] Logistics system
- [ ] Army recovery mechanics
- [ ] Global chat (functional, backend-connected)
- [ ] Player leaderboard
- [ ] Quest / task system (backend-connected)
- [ ] Profile page

---

## 🎮 Game Features

### Activities

| Activity | Description | Status |
|---|---|---|
| **Mining** | Collect raw materials like Stone, Coal, Iron, Gold, Uranium, and more with a cooldown system | ✅ Implemented |
| **Fishing** | Catch fish and aquatic resources | 🔜 Planned |
| **Exploring** | Discover new lands and items | 🔜 Planned |
| **Farming** | Grow crops and manage harvests | 🔜 Planned |
| **Industrial Production** | Craft and manufacture goods | 🔜 Planned |
| **Area Expansion** | Expand your territory | 🔜 Planned |

### Items

- **Raw Materials:** Stone, Coal, Iron, Copper, Aluminum, Silver, Silicon, Gold, Platinum, Uranium, Crude Oil, Wood, Cotton, Sand, Sulphur, Water, Limestone, Clay, Chromium
- **Craftable Items:** Planned
- **Fishing Items:** Planned
- **Explore Items:** Planned

### Economy

- Player balance and currency system
- Item base values
- Marketplace (planned)

### Planned Features

- Real-time system
- Season system
- Military system
- Logistics
- Crafting system
- Guns & Ammunition

---

## 🛠️ Tech Stack

### Frontend
- [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- [React Router DOM v7](https://reactrouter.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) (Tabs, Labels, Slots, Tooltips)
- [shadcn/ui](https://ui.shadcn.com/) component patterns
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/)
- [Appwrite JS SDK](https://appwrite.io/docs/sdks#client)

### Backend
- [Express.js 5](https://expressjs.com/)
- [node-appwrite](https://appwrite.io/docs/sdks#server) (Admin SDK)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [nodemon](https://nodemon.io/)

### Infrastructure & Auth
- [Appwrite](https://appwrite.io/) — Auth, Database (TablesDB), Sessions

### DevOps
- [Husky](https://typicode.github.io/husky/) + [Commitlint](https://commitlint.js.org/) — Conventional Commits enforcement
- [Semantic Release](https://semantic-release.gitbook.io/) — Automated versioning & CHANGELOG generation
- [GitHub Actions](https://github.com/features/actions) — CI/CD on push to `master`

---

## 🔐 Authentication

Authentication is handled via **Appwrite**. The client creates an email/password session, and the resulting session cookie (`a_session_<project_id>_legacy`) is forwarded to the backend on every request. The server extracts the cookie, validates it against Appwrite, and uses it to identify the user.

Admin routes additionally check that the authenticated user's Appwrite account has the `admin` label.

---

## 🧩 API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |

### Game
| Method | Path | Description |
|---|---|---|
| `GET` | `/game/playerinfo` | Get player stats (balance, level, XP) |
| `GET` | `/game/inventory` | Get player's inventory |
| `GET` | `/game/mining` | Perform a mining action (5s cooldown) |
| `GET` | `/game/economy/balance` | Get player balance |

### Admin
| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/items` | List all items |
| `POST` | `/admin/items/item/add` | Add a new item |
| `PUT` | `/admin/items/:itemId` | Update an item |
| `DELETE` | `/admin/items/delete/:itemId` | Delete an item |
| `GET` | `/admin/player/:userId` | Get player profile |
| `GET` | `/admin/player/:userId/inventory` | Inspect player inventory |
| `POST` | `/admin/player/:userId/inventory/add` | Add item to player inventory |
| `POST` | `/admin/player/:userId/inventory/remove` | Remove item from player inventory |

---

## 📦 Versioning & Releases

This project uses [Semantic Release](https://semantic-release.gitbook.io/) with [Conventional Commits](https://www.conventionalcommits.org/). Commits are linted using Husky + Commitlint before every push.

Releases are automatically published on push to `master` via GitHub Actions, including:
- Version bump
- `CHANGELOG.md` update
- GitHub Release creation

---

## 📜 License

ISC

---

> ⚠️ This game is currently under active early development by a solo developer. Features and APIs are subject to change.