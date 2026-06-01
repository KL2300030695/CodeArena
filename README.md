# ⟨/⟩ TCS NQT 2026 — Coding Platform

A premium, fully client-side coding practice platform built for **TCS NQT 2026** preparation. Features 20 curated problems across 10 categories with a built-in code editor, live execution engine, submissions tracking, and leaderboards — all running entirely in the browser.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-007ACC?style=flat&logo=visualstudiocode&logoColor=white)
![Pyodide](https://img.shields.io/badge/Pyodide-3776AB?style=flat&logo=python&logoColor=white)

---

## ✨ Features

### 🧑‍💻 Code Editor
- **Monaco Editor** (same engine as VS Code) with custom dark theme
- Syntax highlighting for Python, JavaScript, C, and Java
- Auto-save to localStorage on every keystroke
- Keyboard shortcuts: `Ctrl+Enter` to run, `Ctrl+S` to submit
- Resizable split panel — drag the divider between problem description and editor

### ⚡ Live Code Execution
- **Python** — executed in-browser via [Pyodide](https://pyodide.org/) (WebAssembly)
- **JavaScript** — sandboxed execution with custom `readline` interface support
- **C** — executed via [Piston API](https://github.com/engineer-man/piston) (remote execution service)
- **Java** — executed via [Piston API](https://github.com/engineer-man/piston) (remote execution service)
- 5-second time limit per test case
- Full stdin/stdout simulation

### 📝 20 Curated Problems
Problems sourced from TCS NQT 2026 and CodeChef, spanning:

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | Discount Calculator | 🟢 Easy | Conditional Logic |
| 2 | Arrange the King's Army | 🟡 Medium | Combinatorics / DP |
| 3 | Parking Fine Calculation | 🟢 Easy | Conditional Logic |
| 4 | Maximum Sum ≤ Limit | 🟡 Medium | DP / Subset |
| 5 | Soldier Arrangement | 🟡 Medium | DP / Combinatorics |
| 6 | Gym Membership Cost | 🟢 Easy | Conditional Logic |
| 7 | Balloon Capacity | 🟢 Easy | Greedy |
| 8 | Minimum Cost to Connect Nodes | 🔴 Hard | Graphs / MST |
| 9 | First and Last Occurrence | 🟡 Medium | Binary Search |
| 10 | Minimum Coins Required | 🟢 Easy | Greedy |
| 11 | House Robber Problem | 🟡 Medium | Dynamic Programming |
| 12 | Minimum Path Sum in Matrix | 🟡 Medium | Dynamic Programming |
| 13 | Number of Islands | 🟡 Medium | Graphs / BFS / DFS |
| 14 | Transaction Monitoring | 🟡 Medium | Simulation |
| 15 | Vendor Gate Management | 🟡 Medium | Simulation |
| 16 | Count Pairs Divisible by 2 | 🟢 Easy | Arrays |
| 17 | Row with Most 1s | 🟢 Easy | Arrays / Matrix |
| 18 | Count Character Occurrences | 🟢 Easy | Strings |
| 19 | Good Number | 🟢 Easy | Number Theory |
| 20 | Vehicle Manufacturing | 🟢 Easy | Math / Algebra |

Each problem includes:
- Detailed description with input/output format and constraints
- Multiple examples with explanations
- Hidden test cases for submission judging
- Expandable hints
- Full editorial with solution code

### 🔐 Authentication
- Register / Login with username, email, and password
- Passwords hashed with SHA-256 (via Web Crypto API)
- Session management with localStorage
- Avatar colors generated from username hash

### 📊 Progress Tracking
- Circular SVG progress ring on the dashboard
- Per-category progress bars
- Difficulty breakdown (Easy / Medium / Hard)
- Solved vs attempted vs unsolved status per problem

### 📋 Submissions History
- Full submission log with status, language, runtime, and timestamp
- Per-problem submission history in the problem detail view
- Relative timestamps ("5m ago", "2h ago", etc.)

### 🏆 Leaderboard
- Ranked by problems solved, then acceptance rate
- Gold / Silver / Bronze badges for top 3
- Per-problem leaderboard (fastest accepted solutions)

### 🎨 Premium UI
- Dark theme with glassmorphism and backdrop blur
- Animated floating orbs and subtle grid overlay
- Gradient borders and glow effects on hover
- Staggered entry animations
- Toast notifications with animated progress bars
- Responsive design (mobile, tablet, desktop)
- Custom scrollbar styling

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | HTML5, semantic elements |
| **Styling** | Vanilla CSS with custom properties (CSS variables) |
| **Logic** | Vanilla JavaScript (ES6+ modules via IIFE pattern) |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) v0.45.0 (CDN) |
| **Python Runtime** | [Pyodide](https://pyodide.org/) v0.25.1 (WebAssembly, CDN) |
| **C / Java Execution** | [Piston API](https://github.com/engineer-man/piston) (remote API) |
| **Fonts** | Google Fonts — Inter, Outfit, JetBrains Mono |
| **Storage** | localStorage (all data persists in the browser) |

> **Zero backend. Zero dependencies. Zero build step.** Just open `index.html`.

---

## 📂 Project Structure

```
TCS Coding/
├── index.html              # Entry point — loads all scripts & styles
├── README.md               # This file
├── Tcs Coding Questions.pptx  # Original problem reference
├── css/
│   └── index.css           # Complete design system (~1800 lines)
│                            #   - CSS custom properties (tokens)
│                            #   - Component styles (navbar, cards, tables, etc.)
│                            #   - Animations & keyframes
│                            #   - Responsive breakpoints
│                            #   - Utility classes
└── js/
    ├── problems.js         # All 20 problem definitions (data layer)
    │                        #   - descriptions, test cases, hints, editorials
    │                        #   - boilerplate code for Python & JavaScript
    │                        #   - category definitions
    ├── auth.js             # Authentication module
    │                        #   - register, login, logout
    │                        #   - SHA-256 password hashing
    │                        #   - session & user data management
    ├── editor.js           # Monaco Editor wrapper
    │                        #   - lazy loading via AMD
    │                        #   - custom dark theme
    │                        #   - language switching
    ├── executor.js         # Code execution engine
    │                        #   - Python via Pyodide (WASM)
    │                        #   - JavaScript via sandboxed Function()
    │                        #   - stdin/stdout simulation
    │                        #   - time limit enforcement
    ├── submissions.js      # Submissions data management
    │                        #   - add, query, filter submissions
    │                        #   - user stats computation
    ├── leaderboard.js      # Leaderboard computation
    │                        #   - rankings by solved count
    │                        #   - per-problem fastest solutions
    ├── ui.js               # UI rendering (all page components)
    │                        #   - SPA page renderers
    │                        #   - toast notifications
    │                        #   - form handlers
    │                        #   - footer
    └── app.js              # SPA router & app initialization
                             #   - hash-based routing
                             #   - resizable panel divider
                             #   - keyboard shortcuts
```

---

## 🚀 Getting Started

### Option 1: Open directly
Simply double-click `index.html` in your browser. Everything loads from CDNs.

### Option 2: Local server (recommended)
```bash
# Using Python
cd "TCS Coding"
python -m http.server 8765

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8765
```

Then open **http://localhost:8765** in your browser.

> **Note:** A local server is recommended because some browsers restrict `file://` protocol features (like Web Crypto API for password hashing).

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Run code against example test cases |
| `Ctrl + S` | Submit code against all test cases |

---

## 🏗️ Architecture

The app follows an **IIFE module pattern** — each JS file exposes a single global object (`Auth`, `Editor`, `Executor`, `Submissions`, `Leaderboard`, `UI`, `App`) via `window`.

```
┌─────────────┐
│   App.js    │  ← SPA Router, init, keyboard shortcuts
├─────────────┤
│   UI.js     │  ← Page renderers, form handlers, toast
├──────┬──────┤
│Auth  │Editor│  ← Auth module  │  Monaco wrapper
├──────┼──────┤
│Exec  │Subs  │  ← Code runner  │  Submission storage
├──────┴──────┤
│ Leaderboard │  ← Rankings computation
├─────────────┤
│ Problems.js │  ← Static problem data (20 problems)
└─────────────┘
```

**Data flow:**
1. `App.js` listens to `hashchange` and calls `UI.render*()`
2. `UI.js` renders HTML strings into `#app`
3. On problem pages, `Editor.init()` creates Monaco, `Executor.runAllTests()` runs code
4. Results flow to `Submissions.add()` → `Auth.markSolved()` → `Leaderboard.getRankings()`

---

## 📱 Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| **> 1024px** | Side-by-side problem/editor split with resizable divider |
| **768–1024px** | Stacked problem/editor layout |
| **< 768px** | Mobile-optimized with hamburger menu, single-column layout |

---

## 🧪 How Code Execution Works

### Python
1. **Pyodide** (Python compiled to WebAssembly) is lazy-loaded on first run
2. `input()` is monkey-patched to read from a pre-populated list (simulating stdin)
3. `sys.stdout` is redirected to a `StringIO` buffer
4. Output is compared line-by-line against expected output

### JavaScript
1. Code is wrapped in a `new Function()` sandbox
2. `console.log` captures output
3. `require('readline')` pattern is auto-detected and shimmed
4. Async callbacks get a 100ms grace period

All four languages enforce a **5-second time limit** per test case.

> **Note:** C and Java execution requires a Piston API server. By default, the platform uses `https://emkc.org/api/v2/piston/execute`. You can configure a custom endpoint by setting `localStorage.setItem('piston_api_url', 'your-url-here')` in the browser console.

---

## 📄 License

This project is built for educational and practice purposes. Problems are sourced from TCS NQT 2026 and CodeChef.

---

<p align="center">
  <strong>Built with ❤️ for TCS NQT 2026 aspirants</strong><br>
  <sub>Practice. Submit. Improve. Repeat.</sub>
</p>
