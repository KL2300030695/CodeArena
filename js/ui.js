// ============================================
// TCS NQT Coding Platform — UI Components
// Page renderers for all routes
// ============================================

const UI = (() => {
  const app = () => document.getElementById('app');

  // ── Toast Notifications ──
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✗', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ── Navbar ──
  function renderNavbar() {
    const session = Auth.getSession();
    const currentHash = location.hash || '#/';

    const navLinks = [
      { href: '#/', label: 'Dashboard', icon: '🏠' },
      { href: '#/problems', label: 'Problems', icon: '📝' },
      { href: '#/submissions', label: 'Submissions', icon: '📊' },
      { href: '#/leaderboard', label: 'Leaderboard', icon: '🏆' },
    ];

    return `
      <nav class="navbar" id="main-navbar">
        <div class="navbar-brand" onclick="location.hash='#/'">
          <div class="brand-icon">⟨/⟩</div>
          <span class="text-gradient">TCS NQT</span>
        </div>
        <ul class="navbar-nav">
          ${navLinks.map(link => `
            <li>
              <span class="nav-link ${currentHash === link.href ? 'active' : ''}"
                    onclick="location.hash='${link.href}'" id="nav-${link.label.toLowerCase()}">
                ${link.label}
              </span>
            </li>
          `).join('')}
        </ul>
        <div class="navbar-right">
          ${session ? `
            <div class="user-cell" style="cursor:pointer" onclick="location.hash='#/profile'" id="nav-profile-btn">
              <div class="avatar avatar-sm" style="background:${session.avatarColor}">
                ${session.username[0].toUpperCase()}
              </div>
              <span class="text-sm">${session.username}</span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="Auth.logout(); location.hash='#/'; App.render();" id="logout-btn">
              Logout
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="location.hash='#/login'" id="login-btn">
              Sign In
            </button>
          `}
        </div>
        <button class="mobile-menu-btn" onclick="UI.toggleMobileMenu()">☰</button>
      </nav>
    `;
  }

  // ── Dashboard / Landing Page ──
  function renderDashboard() {
    const session = Auth.getSession();
    const stats = Auth.getStats();

    const categoryCards = CATEGORIES.filter(c => c.name !== 'All').map(cat => {
      const total = cat.problems ? cat.problems.length : 0;
      const solved = cat.problems ? cat.problems.filter(id => stats.solvedIds && stats.solvedIds.includes(id)).length : 0;
      const progress = total > 0 ? (solved / total) * 100 : 0;

      return `
        <div class="category-card" onclick="location.hash='#/problems?category=${encodeURIComponent(cat.name)}'">
          <div class="category-icon">${cat.icon}</div>
          <div class="category-name">${cat.name}</div>
          <div class="category-count">${total} problem${total !== 1 ? 's' : ''}</div>
          <div class="category-progress">
            <div class="category-progress-fill" style="width:${progress}%"></div>
          </div>
          <div class="text-xs text-muted mt-md">${solved}/${total} solved</div>
        </div>
      `;
    }).join('');

    const solvedPercent = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (solvedPercent / 100) * circumference;

    // Difficulty breakdown
    const easyProblems = PROBLEMS.filter(p => p.difficulty === 'Easy');
    const mediumProblems = PROBLEMS.filter(p => p.difficulty === 'Medium');
    const hardProblems = PROBLEMS.filter(p => p.difficulty === 'Hard');
    const easySolved = easyProblems.filter(p => stats.solvedIds && stats.solvedIds.includes(p.id)).length;
    const mediumSolved = mediumProblems.filter(p => stats.solvedIds && stats.solvedIds.includes(p.id)).length;
    const hardSolved = hardProblems.filter(p => stats.solvedIds && stats.solvedIds.includes(p.id)).length;

    return `
      ${renderNavbar()}
      <div class="dashboard-container">
        <div class="hero-section animate-fade-in-up">
          <h1><span class="text-gradient">TCS NQT 2026</span><br>Coding Platform</h1>
          <p class="hero-subtitle">
            Master 20 curated coding problems from TCS NQT 2026 & CodeChef.
            Practice, submit, and track your progress.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="location.hash='#/problems'" id="start-practice-btn">
              🚀 Start Practicing
            </button>
            ${!session ? `
              <button class="btn btn-secondary btn-lg" onclick="location.hash='#/login'" id="hero-signin-btn">
                Create Account
              </button>
            ` : ''}
          </div>
          <div class="hero-quick-stats">
            <div class="hero-quick-stat">
              <div class="stat-number">${PROBLEMS.length}</div>
              <div class="stat-desc">Curated Problems</div>
            </div>
            <div class="hero-quick-stat">
              <div class="stat-number">${CATEGORIES.length - 1}</div>
              <div class="stat-desc">Categories</div>
            </div>
            <div class="hero-quick-stat">
              <div class="stat-number">2</div>
              <div class="stat-desc">Languages</div>
            </div>
            <div class="hero-quick-stat">
              <div class="stat-number">∞</div>
              <div class="stat-desc">Submissions</div>
            </div>
          </div>
        </div>

        ${session ? `
        <div class="section">
          <div class="section-header">
            <h2>Your Progress</h2>
          </div>
          <div class="progress-overview animate-fade-in-up">
            <div class="progress-ring-wrapper">
              <div class="progress-ring-container">
                <svg width="140" height="140" class="progress-ring">
                  <circle class="progress-ring-bg" cx="70" cy="70" r="54"
                    stroke-width="10" fill="none" />
                  <circle class="progress-ring-fill" cx="70" cy="70" r="54"
                    stroke-width="10" fill="none"
                    stroke="url(#progressGrad)"
                    stroke-linecap="round"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${offset}" />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#6366f1" />
                      <stop offset="100%" stop-color="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <span class="progress-ring-text text-gradient">${solvedPercent}%</span>
              </div>
            </div>
            <div class="progress-details">
              <h3>${stats.solved} of ${stats.total} problems solved</h3>
              <div class="difficulty-stats">
                <div class="difficulty-stat">
                  <span class="badge badge-easy">Easy</span>
                  <div class="difficulty-bar">
                    <div class="difficulty-bar-fill easy" style="width:${easyProblems.length > 0 ? (easySolved / easyProblems.length) * 100 : 0}%"></div>
                  </div>
                  <span class="text-sm text-muted">${easySolved}/${easyProblems.length}</span>
                </div>
                <div class="difficulty-stat">
                  <span class="badge badge-medium">Medium</span>
                  <div class="difficulty-bar">
                    <div class="difficulty-bar-fill medium" style="width:${mediumProblems.length > 0 ? (mediumSolved / mediumProblems.length) * 100 : 0}%"></div>
                  </div>
                  <span class="text-sm text-muted">${mediumSolved}/${mediumProblems.length}</span>
                </div>
                <div class="difficulty-stat">
                  <span class="badge badge-hard">Hard</span>
                  <div class="difficulty-bar">
                    <div class="difficulty-bar-fill hard" style="width:${hardProblems.length > 0 ? (hardSolved / hardProblems.length) * 100 : 0}%"></div>
                  </div>
                  <span class="text-sm text-muted">${hardSolved}/${hardProblems.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="stats-grid stagger-children">
            <div class="stat-card">
              <div class="stat-icon" style="background:rgba(99,102,241,0.12)">📊</div>
              <div class="stat-value">${stats.solved}/${stats.total}</div>
              <div class="stat-label">Problems Solved</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:rgba(16,185,129,0.12)">🎯</div>
              <div class="stat-value">${solvedPercent}%</div>
              <div class="stat-label">Completion Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:rgba(245,158,11,0.12)">⚡</div>
              <div class="stat-value">${stats.attempted}</div>
              <div class="stat-label">In Progress</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:rgba(6,182,212,0.12)">🏆</div>
              <div class="stat-value">${Leaderboard.getUserRank(session.username) || '-'}</div>
              <div class="stat-label">Your Rank</div>
            </div>
          </div>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-header">
            <h2>Problem Categories</h2>
          </div>
          <div class="category-grid stagger-children">
            ${categoryCards}
          </div>
        </div>
      </div>
      ${renderFooter()}
    `;
  }

  // ── Problem List Page ──
  function renderProblemList() {
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    const filterCategory = params.get('category') || 'All';
    const filterDifficulty = params.get('difficulty') || 'All';

    let filtered = [...PROBLEMS];
    if (filterCategory !== 'All') {
      const cat = CATEGORIES.find(c => c.name === filterCategory);
      if (cat && cat.problems) {
        filtered = filtered.filter(p => cat.problems.includes(p.id));
      }
    }
    if (filterDifficulty !== 'All') {
      filtered = filtered.filter(p => p.difficulty === filterDifficulty);
    }

    const rows = filtered.map(p => {
      const status = Auth.getProblemStatus(p.id);
      const statusIcon = status === 'solved' ? '<div class="problem-status-icon solved">✓</div>' :
                         status === 'attempted' ? '<div class="problem-status-icon attempted">◐</div>' :
                         '<div class="problem-status-icon unsolved">○</div>';
      const diffClass = p.difficulty.toLowerCase();

      return `
        <tr onclick="location.hash='#/problem/${p.id}'" id="problem-row-${p.id}">
          <td>${statusIcon}</td>
          <td>
            <div class="problem-title-cell">
              <span>${p.id}. ${p.title}</span>
            </div>
          </td>
          <td><span class="badge badge-${diffClass}">${p.difficulty}</span></td>
          <td>${p.category}</td>
          <td>
            <div class="flex gap-sm" style="flex-wrap:wrap">
              ${p.tags.map(t => `<span class="badge badge-tag">${t}</span>`).join('')}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    return `
      ${renderNavbar()}
      <div class="page-container animate-fade-in">
        <div class="page-header">
          <h1>Problems</h1>
          <p class="page-subtitle">20 curated problems from TCS NQT 2026 & CodeChef</p>
        </div>

        <div class="flex gap-md mb-lg" style="flex-wrap:wrap;align-items:center">
          <div class="search-box" style="flex:1;min-width:200px">
            <span class="search-icon">🔍</span>
            <input type="text" class="input" placeholder="Search problems..." id="problem-search"
                   oninput="UI.filterProblems(this.value)">
          </div>
          <select class="input" style="width:auto" id="filter-category"
                  onchange="location.hash='#/problems?category='+this.value+'&difficulty=${filterDifficulty}'">
            <option value="All" ${filterCategory === 'All' ? 'selected' : ''}>All Categories</option>
            ${CATEGORIES.filter(c => c.name !== 'All').map(c =>
              `<option value="${c.name}" ${filterCategory === c.name ? 'selected' : ''}>${c.icon} ${c.name}</option>`
            ).join('')}
          </select>
          <select class="input" style="width:auto" id="filter-difficulty"
                  onchange="location.hash='#/problems?category=${filterCategory}&difficulty='+this.value">
            <option value="All" ${filterDifficulty === 'All' ? 'selected' : ''}>All Difficulties</option>
            <option value="Easy" ${filterDifficulty === 'Easy' ? 'selected' : ''}>🟢 Easy</option>
            <option value="Medium" ${filterDifficulty === 'Medium' ? 'selected' : ''}>🟡 Medium</option>
            <option value="Hard" ${filterDifficulty === 'Hard' ? 'selected' : ''}>🔴 Hard</option>
          </select>
        </div>

        <div class="card">
          <table class="problem-table" id="problem-table">
            <thead>
              <tr>
                <th style="width:40px">Status</th>
                <th>Title</th>
                <th style="width:100px">Difficulty</th>
                <th style="width:160px">Category</th>
                <th style="width:200px">Tags</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
      ${renderFooter()}
    `;
  }

  // ── Problem Detail Page ──
  function renderProblemDetail(id) {
    const problem = PROBLEMS.find(p => p.id === parseInt(id));
    if (!problem) {
      return `${renderNavbar()}<div class="page-container"><div class="empty-state"><div class="empty-icon">❌</div><h3>Problem not found</h3></div></div>`;
    }

    const diffClass = problem.difficulty.toLowerCase();

    const examplesHtml = problem.examples.map((ex, i) => `
      <div class="example-block">
        <div class="example-header">Example ${i + 1}</div>
        <div class="example-body">
          <div class="example-io">
            <div class="label">Input</div>
            <pre style="margin:0;background:none;border:none;padding:0;font-size:0.85rem">${ex.input}</pre>
          </div>
          <div class="example-io">
            <div class="label">Output</div>
            <pre style="margin:0;background:none;border:none;padding:0;font-size:0.85rem">${ex.output}</pre>
          </div>
        </div>
        ${ex.explanation ? `<div style="padding:0 16px 12px;font-size:0.85rem;color:var(--text-secondary)"><strong>Explanation:</strong> ${ex.explanation}</div>` : ''}
      </div>
    `).join('');

    const hintsHtml = problem.hints.map((hint, i) => `
      <div class="hint-block">
        <div class="hint-toggle" onclick="this.nextElementSibling.classList.toggle('show')">
          <span>💡 Hint ${i + 1}</span>
          <span>▼</span>
        </div>
        <div class="hint-content">${hint}</div>
      </div>
    `).join('');

    // Navigation
    const prevId = problem.id > 1 ? problem.id - 1 : null;
    const nextId = problem.id < PROBLEMS.length ? problem.id + 1 : null;

    return `
      ${renderNavbar()}
      <div class="problem-layout">
        <!-- Left Panel: Problem Description -->
        <div class="problem-description-panel" id="problem-desc-panel">
          <div class="problem-header">
            <div class="flex items-center gap-md mb-md">
              <button class="btn btn-ghost btn-sm" onclick="location.hash='#/problems'" id="back-to-problems">
                ← Back
              </button>
              <div class="flex gap-sm" style="margin-left:auto">
                ${prevId ? `<button class="btn btn-ghost btn-sm" onclick="location.hash='#/problem/${prevId}'">← Prev</button>` : ''}
                ${nextId ? `<button class="btn btn-ghost btn-sm" onclick="location.hash='#/problem/${nextId}'">Next →</button>` : ''}
              </div>
            </div>
            <h2>${problem.id}. ${problem.title}</h2>
            <div class="flex gap-sm items-center mt-md">
              <span class="badge badge-${diffClass}">${problem.difficulty}</span>
              ${problem.tags.map(t => `<span class="badge badge-tag">${t}</span>`).join('')}
            </div>
          </div>

          <div class="problem-content">
            <div class="tabs" id="problem-tabs">
              <button class="tab active" onclick="UI.switchProblemTab('description', this)" id="tab-description">Description</button>
              <button class="tab" onclick="UI.switchProblemTab('editorial', this)" id="tab-editorial">Editorial</button>
              <button class="tab" onclick="UI.switchProblemTab('submissions', this)" id="tab-submissions">Submissions</button>
            </div>

            <div id="problem-tab-content">
              <div id="tab-content-description">
                <p style="white-space:pre-line;margin-top:16px">${problem.description}</p>

                <h3>Input Format</h3>
                <p style="white-space:pre-line">${problem.inputFormat}</p>

                <h3>Output Format</h3>
                <p style="white-space:pre-line">${problem.outputFormat}</p>

                <h3>Constraints</h3>
                <p><code>${problem.constraints}</code></p>

                <h3>Examples</h3>
                ${examplesHtml}

                <h3>Hints</h3>
                ${hintsHtml}
              </div>

              <div id="tab-content-editorial" style="display:none">
                <div style="margin-top:16px;white-space:pre-line;line-height:1.8">${formatEditorial(problem.editorial)}</div>
              </div>

              <div id="tab-content-submissions" style="display:none">
                <div id="problem-submissions-list" style="margin-top:16px">
                  ${renderProblemSubmissions(problem.id)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resizable Divider -->
        <div class="panel-resizer" id="panel-resizer"></div>

        <!-- Right Panel: Code Editor -->
        <div class="problem-editor-panel" id="problem-editor-panel">
          <div class="editor-toolbar">
            <div class="editor-toolbar-left">
              <select class="language-selector" id="language-select" onchange="UI.onLanguageChange(this.value, ${problem.id})">
                <option value="python">🐍 Python</option>
                <option value="javascript">🟨 JavaScript</option>
              </select>
              <span class="text-xs text-muted" id="editor-status">Ready</span>
            </div>
            <div class="editor-toolbar-right">
              <button class="btn btn-secondary btn-sm" onclick="UI.resetCode(${problem.id})" id="reset-code-btn">
                ↺ Reset
              </button>
              <button class="btn btn-secondary btn-sm" onclick="UI.runCode(${problem.id})" id="run-code-btn">
                ▶ Run <span class="kbd">Ctrl+↵</span>
              </button>
              <button class="btn btn-success btn-sm" onclick="UI.submitCode(${problem.id})" id="submit-code-btn">
                ✓ Submit <span class="kbd">Ctrl+S</span>
              </button>
            </div>
          </div>
          <div class="editor-container" id="monaco-container"></div>
          <div class="results-panel" id="results-panel" style="display:none">
            <div class="results-header">
              <h4 id="results-title">Test Results</h4>
              <button class="btn btn-ghost btn-sm" onclick="document.getElementById('results-panel').style.display='none'">✕</button>
            </div>
            <div id="results-body"></div>
          </div>
        </div>
      </div>
    `;
  }

  function formatEditorial(text) {
    // Simple markdown-ish formatting for code blocks
    return text
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function renderProblemSubmissions(problemId) {
    const session = Auth.getSession();
    if (!session) return '<div class="empty-state"><p class="text-muted">Sign in to view your submissions</p></div>';

    const subs = Submissions.getFiltered({ username: session.username, problemId });
    if (subs.length === 0) {
      return '<div class="empty-state"><p class="text-muted">No submissions yet</p></div>';
    }

    return `<table class="submissions-table">
      <thead><tr><th>Status</th><th>Language</th><th>Runtime</th><th>Time</th></tr></thead>
      <tbody>
        ${subs.map(s => `
          <tr>
            <td><span class="badge badge-${s.status === 'Accepted' ? 'accepted' : s.status === 'Time Limit Exceeded' ? 'tle' : 'wrong'}">${s.status}</span></td>
            <td>${s.language}</td>
            <td>${s.runtime}ms</td>
            <td>${Submissions.formatTime(s.timestamp)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
  }

  // ── Submissions Page ──
  function renderSubmissions() {
    const session = Auth.getSession();
    if (!session) {
      return `${renderNavbar()}<div class="page-container"><div class="empty-state"><div class="empty-icon">🔒</div><h3>Sign in to view submissions</h3><button class="btn btn-primary mt-lg" onclick="location.hash='#/login'">Sign In</button></div></div>`;
    }

    const subs = Submissions.getByUser(session.username);

    const rows = subs.map(s => `
      <tr onclick="location.hash='#/problem/${s.problemId}'" style="cursor:pointer">
        <td><span class="badge badge-${s.status === 'Accepted' ? 'accepted' : s.status === 'Time Limit Exceeded' ? 'tle' : 'wrong'}">${s.status}</span></td>
        <td>${s.problemTitle}</td>
        <td>${s.language}</td>
        <td>${s.passed}/${s.total}</td>
        <td>${s.runtime}ms</td>
        <td>${Submissions.formatTime(s.timestamp)}</td>
      </tr>
    `).join('');

    return `
      ${renderNavbar()}
      <div class="page-container animate-fade-in">
        <div class="page-header">
          <h1>Submissions</h1>
          <p class="page-subtitle">Your submission history</p>
        </div>

        ${subs.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>No submissions yet</h3>
            <p class="text-muted">Start solving problems to see your submissions here</p>
            <button class="btn btn-primary mt-lg" onclick="location.hash='#/problems'">Browse Problems</button>
          </div>
        ` : `
          <div class="card">
            <table class="submissions-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Problem</th>
                  <th>Language</th>
                  <th>Result</th>
                  <th>Runtime</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `}
      </div>
      ${renderFooter()}
    `;
  }

  // ── Leaderboard Page ──
  function renderLeaderboard() {
    const rankings = Leaderboard.getRankings();

    const rows = rankings.map((user, idx) => {
      const rank = idx + 1;
      const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';

      return `
        <tr>
          <td><span class="rank-badge ${rankClass}">${rank}</span></td>
          <td>
            <div class="user-cell">
              <div class="avatar avatar-sm" style="background:${user.avatarColor}">
                ${user.username[0].toUpperCase()}
              </div>
              <span>${user.username}</span>
            </div>
          </td>
          <td><strong>${user.solved}</strong></td>
          <td>${user.totalSubmissions}</td>
          <td>${user.acceptanceRate}%</td>
        </tr>
      `;
    }).join('');

    return `
      ${renderNavbar()}
      <div class="page-container animate-fade-in">
        <div class="page-header">
          <h1>🏆 Leaderboard</h1>
          <p class="page-subtitle">Top coders on the platform</p>
        </div>

        ${rankings.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">🏆</div>
            <h3>No rankings yet</h3>
            <p class="text-muted">Be the first to solve a problem!</p>
          </div>
        ` : `
          <div class="card">
            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th style="width:60px">Rank</th>
                  <th>User</th>
                  <th style="width:100px">Solved</th>
                  <th style="width:120px">Submissions</th>
                  <th style="width:120px">Acceptance</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `}
      </div>
      ${renderFooter()}
    `;
  }

  // ── Auth Pages ──
  function renderLogin() {
    return `
      <div class="auth-container animate-fade-in">
        <div class="auth-card">
          <div class="navbar-brand justify-center mb-lg" onclick="location.hash='#/'" style="cursor:pointer">
            <div class="brand-icon">⟨/⟩</div>
            <span class="text-gradient">TCS NQT</span>
          </div>
          <h2>Welcome Back</h2>
          <p class="auth-subtitle">Sign in to track your progress</p>

          <div id="auth-form-container">
            <form class="auth-form" onsubmit="UI.handleLogin(event)" id="login-form">
              <div class="input-group">
                <label for="login-username">Username</label>
                <input type="text" class="input" id="login-username" placeholder="Enter your username" required autocomplete="username">
              </div>
              <div class="input-group">
                <label for="login-password">Password</label>
                <input type="password" class="input" id="login-password" placeholder="Enter your password" required autocomplete="current-password">
              </div>
              <div id="login-error" style="color:var(--color-error);font-size:0.85rem;display:none"></div>
              <button type="submit" class="btn btn-primary w-full" id="login-submit-btn">Sign In</button>
            </form>
            <div class="auth-footer">
              Don't have an account? <a onclick="UI.showRegister()">Create one</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderRegister() {
    return `
      <form class="auth-form" onsubmit="UI.handleRegister(event)" id="register-form">
        <div class="input-group">
          <label for="reg-username">Username</label>
          <input type="text" class="input" id="reg-username" placeholder="Choose a username" required minlength="3">
        </div>
        <div class="input-group">
          <label for="reg-email">Email</label>
          <input type="email" class="input" id="reg-email" placeholder="your@email.com" required>
        </div>
        <div class="input-group">
          <label for="reg-password">Password</label>
          <input type="password" class="input" id="reg-password" placeholder="Create a password" required minlength="4">
        </div>
        <div id="register-error" style="color:var(--color-error);font-size:0.85rem;display:none"></div>
        <button type="submit" class="btn btn-primary w-full" id="register-submit-btn">Create Account</button>
      </form>
      <div class="auth-footer">
        Already have an account? <a onclick="UI.showLogin()">Sign in</a>
      </div>
    `;
  }

  // ── Profile Page ──
  function renderProfile() {
    const session = Auth.getSession();
    if (!session) {
      return `${renderNavbar()}<div class="page-container"><div class="empty-state"><div class="empty-icon">🔒</div><h3>Sign in to view your profile</h3><button class="btn btn-primary mt-lg" onclick="location.hash='#/login'">Sign In</button></div></div>`;
    }

    const user = Auth.getCurrentUser();
    const stats = Submissions.getUserStats(session.username);
    const authStats = Auth.getStats();
    const rank = Leaderboard.getUserRank(session.username);

    const joinDate = new Date(session.joinDate).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    // Solved problems list
    const solvedProblems = PROBLEMS.filter(p => authStats.solvedIds && authStats.solvedIds.includes(p.id));

    return `
      ${renderNavbar()}
      <div class="page-container animate-fade-in">
        <div class="profile-header">
          <div class="avatar avatar-xl" style="background:${session.avatarColor}">
            ${session.username[0].toUpperCase()}
          </div>
          <div class="profile-info">
            <h2>${session.username}</h2>
            <div class="profile-email">${session.email}</div>
            <div class="profile-date">🗓 Joined ${joinDate}</div>
          </div>
        </div>

        <div class="stats-grid stagger-children mb-lg">
          <div class="stat-card">
            <div class="stat-value">${authStats.solved}</div>
            <div class="stat-label">Problems Solved</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.totalSubmissions}</div>
            <div class="stat-label">Total Submissions</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.acceptanceRate}%</div>
            <div class="stat-label">Acceptance Rate</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">#${rank || '-'}</div>
            <div class="stat-label">Rank</div>
          </div>
        </div>

        <div class="section">
          <h2 class="mb-lg">Solved Problems</h2>
          ${solvedProblems.length === 0 ? `
            <div class="empty-state">
              <p class="text-muted">No problems solved yet. Start practicing!</p>
            </div>
          ` : `
            <div class="card">
              <table class="problem-table">
                <thead><tr><th>Problem</th><th>Difficulty</th><th>Category</th></tr></thead>
                <tbody>
                  ${solvedProblems.map(p => `
                    <tr onclick="location.hash='#/problem/${p.id}'" style="cursor:pointer">
                      <td>${p.id}. ${p.title}</td>
                      <td><span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span></td>
                      <td>${p.category}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
      ${renderFooter()}
    `;
  }

  // ── Footer ──
  function renderFooter() {
    return `
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <div class="brand-icon-sm">⟨/⟩</div>
            <span>TCS NQT 2026</span>
          </div>
          <div class="footer-links">
            <a onclick="location.hash='#/problems'">Problems</a>
            <a onclick="location.hash='#/leaderboard'">Leaderboard</a>
            <a onclick="location.hash='#/submissions'">Submissions</a>
          </div>
          <div class="footer-copy">© 2026 TCS NQT Coding Platform. Built for practice.</div>
        </div>
      </footer>
    `;
  }

  // ── Public API ──
  return {
    showToast,
    renderNavbar,
    renderDashboard,
    renderProblemList,
    renderProblemDetail,
    renderSubmissions,
    renderLeaderboard,
    renderLogin,
    renderProfile,
    renderFooter,

    // Auth form handlers
    showRegister() {
      const container = document.getElementById('auth-form-container');
      if (container) {
        const card = container.closest('.auth-card');
        card.querySelector('h2').textContent = 'Create Account';
        card.querySelector('.auth-subtitle').textContent = 'Join the coding challenge';
        container.innerHTML = renderRegister();
      }
    },

    showLogin() {
      // Re-render the login page
      location.hash = '#/login';
      App.render();
    },

    async handleLogin(e) {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');

      const result = await Auth.login(username, password);
      if (result.success) {
        showToast('Welcome back, ' + username + '!', 'success');
        location.hash = '#/';
        App.render();
      } else {
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
      }
    },

    async handleRegister(e) {
      e.preventDefault();
      const username = document.getElementById('reg-username').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const errorEl = document.getElementById('register-error');

      const result = await Auth.register(username, email, password);
      if (result.success) {
        showToast('Account created! Welcome, ' + username + '!', 'success');
        location.hash = '#/';
        App.render();
      } else {
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
      }
    },

    // Problem tab switching
    switchProblemTab(tab, btn) {
      document.querySelectorAll('#problem-tabs .tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('[id^="tab-content-"]').forEach(c => c.style.display = 'none');
      document.getElementById('tab-content-' + tab).style.display = 'block';
    },

    // Language change
    onLanguageChange(lang, problemId) {
      const problem = PROBLEMS.find(p => p.id === problemId);
      Editor.setLanguage(lang);

      // Load saved code or boilerplate
      const savedKey = `code_${problemId}_${lang}`;
      const savedCode = localStorage.getItem(savedKey);
      if (savedCode) {
        Editor.setCode(savedCode);
      } else {
        Editor.setCode(problem.boilerplate[lang] || '');
      }
    },

    // Reset code
    resetCode(problemId) {
      const lang = Editor.getLanguage();
      const problem = PROBLEMS.find(p => p.id === problemId);
      Editor.setCode(problem.boilerplate[lang] || '');
      localStorage.removeItem(`code_${problemId}_${lang}`);
      showToast('Code reset to template', 'info');
    },

    // Run code (test with examples only)
    async runCode(problemId) {
      const problem = PROBLEMS.find(p => p.id === problemId);
      const code = Editor.getCode();
      const lang = Editor.getLanguage();

      // Save code
      localStorage.setItem(`code_${problemId}_${lang}`, code);

      const statusEl = document.getElementById('editor-status');
      const runBtn = document.getElementById('run-code-btn');
      const resultsPanel = document.getElementById('results-panel');
      const resultsBody = document.getElementById('results-body');
      const resultsTitle = document.getElementById('results-title');

      runBtn.disabled = true;
      statusEl.textContent = lang === 'python' ? 'Loading Python runtime...' : 'Running...';
      statusEl.style.color = 'var(--color-warning)';

      resultsPanel.style.display = 'block';
      resultsBody.innerHTML = '<div class="loading-overlay" style="padding:24px"><div class="spinner"></div><span>Running test cases...</span></div>';

      // Run only against examples
      const testCases = problem.examples.map(ex => ({ input: ex.input, output: ex.output }));

      const result = await Executor.runAllTests(code, lang, testCases, (tc, idx, total) => {
        statusEl.textContent = `Running test ${idx}/${total}...`;
      });

      resultsTitle.textContent = `Test Results: ${result.passed}/${result.total} passed`;
      resultsTitle.style.color = result.allPassed ? 'var(--color-success)' : 'var(--color-error)';

      resultsBody.innerHTML = result.results.map(r => `
        <div class="result-item">
          <span class="result-status ${r.status}">${r.statusLabel}</span>
          <div class="result-details">
            <span>Test ${r.testCase}</span>
            <span>${r.runtime}ms</span>
            ${r.status === 'fail' ? `<span style="color:var(--color-error)">Expected: "${r.expected}" Got: "${r.actual}"</span>` : ''}
            ${r.error ? `<span style="color:var(--color-error)">${r.error.substring(0, 100)}</span>` : ''}
          </div>
        </div>
      `).join('');

      runBtn.disabled = false;
      statusEl.textContent = result.allPassed ? '✓ All tests passed' : '✗ Some tests failed';
      statusEl.style.color = result.allPassed ? 'var(--color-success)' : 'var(--color-error)';

      // Resize editor after showing results
      Editor.resize();
    },

    // Submit code (run against all test cases)
    async submitCode(problemId) {
      const session = Auth.getSession();
      if (!session) {
        showToast('Please sign in to submit', 'error');
        location.hash = '#/login';
        return;
      }

      const problem = PROBLEMS.find(p => p.id === problemId);
      const code = Editor.getCode();
      const lang = Editor.getLanguage();

      // Save code
      localStorage.setItem(`code_${problemId}_${lang}`, code);

      const statusEl = document.getElementById('editor-status');
      const submitBtn = document.getElementById('submit-code-btn');
      const runBtn = document.getElementById('run-code-btn');
      const resultsPanel = document.getElementById('results-panel');
      const resultsBody = document.getElementById('results-body');
      const resultsTitle = document.getElementById('results-title');

      submitBtn.disabled = true;
      runBtn.disabled = true;
      statusEl.textContent = lang === 'python' ? 'Loading Python runtime...' : 'Submitting...';
      statusEl.style.color = 'var(--color-warning)';

      resultsPanel.style.display = 'block';
      resultsBody.innerHTML = '<div class="loading-overlay" style="padding:24px"><div class="spinner"></div><span>Running all test cases...</span></div>';

      // Run against ALL test cases
      const result = await Executor.runAllTests(code, lang, problem.testCases, (tc, idx, total) => {
        statusEl.textContent = `Judging ${idx}/${total}...`;
      });

      // Record submission
      const totalRuntime = result.results.reduce((sum, r) => sum + r.runtime, 0);
      Submissions.add({
        username: session.username,
        problemId: problem.id,
        problemTitle: problem.title,
        language: lang,
        code,
        status: result.overallStatus,
        passed: result.passed,
        total: result.total,
        runtime: totalRuntime
      });

      // Update user progress
      if (result.allPassed) {
        Auth.markSolved(problem.id);
        showToast('🎉 Accepted! All test cases passed!', 'success');
      } else {
        Auth.markAttempted(problem.id);
        showToast(`${result.overallStatus} — ${result.passed}/${result.total} test cases passed`, 'error');
      }

      resultsTitle.textContent = `Submission: ${result.overallStatus} (${result.passed}/${result.total})`;
      resultsTitle.style.color = result.allPassed ? 'var(--color-success)' : 'var(--color-error)';

      resultsBody.innerHTML = result.results.map(r => `
        <div class="result-item">
          <span class="result-status ${r.status}">${r.statusLabel}</span>
          <div class="result-details">
            <span>Test ${r.testCase}</span>
            <span>${r.runtime}ms</span>
            ${r.status === 'fail' ? `<span style="color:var(--color-error)">Expected: "${r.expected}" Got: "${r.actual}"</span>` : ''}
            ${r.error ? `<span style="color:var(--color-error)">${r.error.substring(0, 100)}</span>` : ''}
          </div>
        </div>
      `).join('');

      submitBtn.disabled = false;
      runBtn.disabled = false;
      statusEl.textContent = result.allPassed ? '✓ Accepted!' : `✗ ${result.overallStatus}`;
      statusEl.style.color = result.allPassed ? 'var(--color-success)' : 'var(--color-error)';

      Editor.resize();
    },

    // Search filter
    filterProblems(query) {
      const rows = document.querySelectorAll('#problem-table tbody tr');
      const q = query.toLowerCase();
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    },

    toggleMobileMenu() {
      // Simple mobile menu toggle
      const nav = document.querySelector('.navbar-nav');
      if (nav) {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        nav.style.position = 'absolute';
        nav.style.top = '64px';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'var(--bg-secondary)';
        nav.style.flexDirection = 'column';
        nav.style.padding = '16px';
        nav.style.borderBottom = '1px solid var(--border-primary)';
        nav.style.zIndex = '999';
      }
    }
  };
})();

window.UI = UI;
