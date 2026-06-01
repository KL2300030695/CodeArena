const Auth = (() => {
  const TOKEN_KEY = 'tcs_nqt_token';
  const API_URL = '/api';
  
  let currentUser = null;

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  return {
    async register(username, email, password) {
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (data.success) {
          setToken(data.token);
          currentUser = data.user;
        }
        return data;
      } catch (e) {
        return { success: false, error: 'Network error. Backend might be down.' };
      }
    },

    async login(username, password) {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
          setToken(data.token);
          currentUser = data.user;
        }
        return data;
      } catch (e) {
        return { success: false, error: 'Network error. Backend might be down.' };
      }
    },

    logout() {
      setToken(null);
      currentUser = null;
    },

    async fetchCurrentUser() {
      const token = getToken();
      if (!token) return null;
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          return currentUser;
        } else {
          setToken(null);
          return null;
        }
      } catch (e) {
        return null; 
      }
    },

    getCurrentUser() {
      return currentUser;
    },

    isLoggedIn() {
      return !!getToken();
    },

    getToken,

    getSession() {
      return currentUser; // mapped to currentUser
    },

    getProblemStatus(problemId) {
      if (!currentUser) return 'unsolved';
      if (currentUser.solved && currentUser.solved.includes(problemId)) return 'solved';
      if (currentUser.attempted && currentUser.attempted.includes(problemId)) return 'attempted';
      return 'unsolved';
    },

    getStats() {
      if (!currentUser) return { solved: 0, attempted: 0, total: 20 };
      return {
        solved: currentUser.solved ? currentUser.solved.length : 0,
        attempted: currentUser.attempted ? currentUser.attempted.length : 0,
        total: 20,
        solvedIds: currentUser.solved || [],
        attemptedIds: currentUser.attempted || []
      };
    },

    getAvatarColor(username) {
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash % 360);
      return `hsl(${hue}, 65%, 55%)`;
    },

    markSolved(problemId) {
      if (!currentUser) return;
      if (!currentUser.solved) currentUser.solved = [];
      if (!currentUser.attempted) currentUser.attempted = [];
      
      if (!currentUser.solved.includes(problemId)) {
        currentUser.solved.push(problemId);
        currentUser.attempted = currentUser.attempted.filter(id => id !== problemId);
      }
    },

    markAttempted(problemId) {
      if (!currentUser) return;
      if (!currentUser.solved) currentUser.solved = [];
      if (!currentUser.attempted) currentUser.attempted = [];
      
      if (!currentUser.solved.includes(problemId) && !currentUser.attempted.includes(problemId)) {
        currentUser.attempted.push(problemId);
      }
    }
  };
})();

window.Auth = Auth;
