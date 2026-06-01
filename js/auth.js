// ============================================
// TCS NQT Coding Platform — Authentication
// localStorage-based auth with session management
// ============================================

const Auth = (() => {
  const USERS_KEY = 'tcs_nqt_users';
  const SESSION_KEY = 'tcs_nqt_session';

  // Simple hash function for passwords (demo-grade)
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'tcs_nqt_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getAvatarColor(username) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 65%, 55%)`;
  }

  return {
    // Register a new user
    async register(username, email, password) {
      if (!username || !email || !password) {
        return { success: false, error: 'All fields are required.' };
      }
      if (username.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters.' };
      }
      if (password.length < 4) {
        return { success: false, error: 'Password must be at least 4 characters.' };
      }
      if (!email.includes('@')) {
        return { success: false, error: 'Please enter a valid email.' };
      }

      const users = getUsers();
      if (users[username]) {
        return { success: false, error: 'Username already exists.' };
      }

      // Check if email is taken
      const emailTaken = Object.values(users).some(u => u.email === email);
      if (emailTaken) {
        return { success: false, error: 'Email already registered.' };
      }

      const hashedPass = await hashPassword(password);
      users[username] = {
        username,
        email,
        password: hashedPass,
        avatarColor: getAvatarColor(username),
        joinDate: new Date().toISOString(),
        solved: [],
        attempted: []
      };

      saveUsers(users);

      // Auto-login
      const session = {
        username,
        email,
        avatarColor: users[username].avatarColor,
        joinDate: users[username].joinDate,
        loginTime: Date.now()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      return { success: true, user: session };
    },

    // Login existing user
    async login(username, password) {
      if (!username || !password) {
        return { success: false, error: 'Username and password are required.' };
      }

      const users = getUsers();
      const user = users[username];
      if (!user) {
        return { success: false, error: 'User not found.' };
      }

      const hashedPass = await hashPassword(password);
      if (user.password !== hashedPass) {
        return { success: false, error: 'Incorrect password.' };
      }

      const session = {
        username: user.username,
        email: user.email,
        avatarColor: user.avatarColor,
        joinDate: user.joinDate,
        loginTime: Date.now()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      return { success: true, user: session };
    },

    // Logout
    logout() {
      localStorage.removeItem(SESSION_KEY);
    },

    // Get current session
    getSession() {
      try {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY));
        if (session && session.username) {
          return session;
        }
        return null;
      } catch {
        return null;
      }
    },

    // Get current user's full data
    getCurrentUser() {
      const session = this.getSession();
      if (!session) return null;
      const users = getUsers();
      return users[session.username] || null;
    },

    // Update user data
    updateUserData(username, updates) {
      const users = getUsers();
      if (users[username]) {
        Object.assign(users[username], updates);
        saveUsers(users);
      }
    },

    // Mark a problem as solved
    markSolved(problemId) {
      const session = this.getSession();
      if (!session) return;
      const users = getUsers();
      const user = users[session.username];
      if (user && !user.solved.includes(problemId)) {
        user.solved.push(problemId);
        // Also remove from attempted if present
        user.attempted = user.attempted.filter(id => id !== problemId);
        saveUsers(users);
      }
    },

    // Mark a problem as attempted
    markAttempted(problemId) {
      const session = this.getSession();
      if (!session) return;
      const users = getUsers();
      const user = users[session.username];
      if (user && !user.solved.includes(problemId) && !user.attempted.includes(problemId)) {
        user.attempted.push(problemId);
        saveUsers(users);
      }
    },

    // Get user stats
    getStats() {
      const user = this.getCurrentUser();
      if (!user) return { solved: 0, attempted: 0, total: 20 };
      return {
        solved: user.solved.length,
        attempted: user.attempted.length,
        total: 20,
        solvedIds: user.solved,
        attemptedIds: user.attempted
      };
    },

    // Get problem status for a specific problem
    getProblemStatus(problemId) {
      const user = this.getCurrentUser();
      if (!user) return 'unsolved';
      if (user.solved.includes(problemId)) return 'solved';
      if (user.attempted.includes(problemId)) return 'attempted';
      return 'unsolved';
    },

    // Get all users for leaderboard
    getAllUsers() {
      const users = getUsers();
      return Object.values(users).map(u => ({
        username: u.username,
        avatarColor: u.avatarColor,
        solved: u.solved ? u.solved.length : 0,
        solvedIds: u.solved || [],
        joinDate: u.joinDate
      }));
    },

    // Check if user is logged in
    isLoggedIn() {
      return this.getSession() !== null;
    },

    getAvatarColor
  };
})();

window.Auth = Auth;
