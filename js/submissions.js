// ============================================
// TCS NQT Coding Platform — Submissions
// ============================================

const Submissions = (() => {
  const SUBMISSIONS_KEY = 'tcs_nqt_submissions';

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveAll(submissions) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  }

  return {
    // Add a new submission
    add(submission) {
      const all = getAll();
      const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        username: submission.username,
        problemId: submission.problemId,
        problemTitle: submission.problemTitle,
        language: submission.language,
        code: submission.code,
        status: submission.status,
        passed: submission.passed,
        total: submission.total,
        runtime: submission.runtime || 0,
        timestamp: new Date().toISOString()
      };
      all.unshift(entry); // newest first
      // Keep last 500 submissions
      if (all.length > 500) all.length = 500;
      saveAll(all);
      return entry;
    },

    // Get submissions for a specific user
    getByUser(username) {
      return getAll().filter(s => s.username === username);
    },

    // Get submissions for a specific problem
    getByProblem(problemId) {
      return getAll().filter(s => s.problemId === problemId);
    },

    // Get submissions filtered
    getFiltered({ username, problemId, status, language } = {}) {
      let results = getAll();
      if (username) results = results.filter(s => s.username === username);
      if (problemId) results = results.filter(s => s.problemId === problemId);
      if (status) results = results.filter(s => s.status === status);
      if (language) results = results.filter(s => s.language === language);
      return results;
    },

    // Get user's best submission for a problem
    getBest(username, problemId) {
      const subs = getAll().filter(s => s.username === username && s.problemId === problemId);
      const accepted = subs.filter(s => s.status === 'Accepted');
      if (accepted.length > 0) {
        return accepted.reduce((best, s) => s.runtime < best.runtime ? s : best);
      }
      return subs[0] || null;
    },

    // Get submission count stats for a user
    getUserStats(username) {
      const subs = getAll().filter(s => s.username === username);
      const accepted = subs.filter(s => s.status === 'Accepted');
      const uniqueSolved = [...new Set(accepted.map(s => s.problemId))];
      const totalAttempts = subs.length;
      const acceptanceRate = totalAttempts > 0 ? Math.round((accepted.length / totalAttempts) * 100) : 0;

      return {
        totalSubmissions: totalAttempts,
        accepted: accepted.length,
        uniqueSolved: uniqueSolved.length,
        acceptanceRate
      };
    },

    // Get all submissions (for leaderboard)
    getAll() {
      return getAll();
    },

    // Format timestamp for display
    formatTime(isoString) {
      const date = new Date(isoString);
      const now = new Date();
      const diff = now - date;

      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };
})();

window.Submissions = Submissions;
