const Submissions = (() => {
  const API_URL = '/api';

  return {
    async add(submission) {
      const token = Auth.getToken();
      if (!token) return null;
      try {
        const res = await fetch(`${API_URL}/submissions`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(submission)
        });
        const data = await res.json();
        
        // Optimistically update local user stats
        if (data.success && data.submission.status === 'Accepted') {
          Auth.markSolved(submission.problemId);
        } else if (data.success) {
          Auth.markAttempted(submission.problemId);
        }

        return data.submission;
      } catch (e) {
        console.error('Failed to add submission', e);
        return null;
      }
    },

    async getByUser(username) {
      try {
        const res = await fetch(`${API_URL}/submissions?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        return data.success ? data.submissions : [];
      } catch (e) {
        return [];
      }
    },

    async getByProblem(problemId) {
      try {
        const res = await fetch(`${API_URL}/submissions?problemId=${encodeURIComponent(problemId)}`);
        const data = await res.json();
        return data.success ? data.submissions : [];
      } catch (e) {
        return [];
      }
    },

    async getFiltered({ username, problemId, status, language } = {}) {
      try {
        const params = new URLSearchParams();
        if (username) params.append('username', username);
        if (problemId) params.append('problemId', problemId);
        if (status) params.append('status', status);
        if (language) params.append('language', language);

        const res = await fetch(`${API_URL}/submissions?${params.toString()}`);
        const data = await res.json();
        return data.success ? data.submissions : [];
      } catch (e) {
        return [];
      }
    },

    async getBest(username, problemId) {
      const subs = await this.getFiltered({ username, problemId });
      if (!subs || subs.length === 0) return null;
      const accepted = subs.filter(s => s.status === 'Accepted');
      if (accepted.length > 0) {
        return accepted.reduce((best, s) => s.runtime < best.runtime ? s : best);
      }
      return subs[0];
    },

    async getUserStats(username) {
      try {
        const res = await fetch(`${API_URL}/submissions/stats/${encodeURIComponent(username)}`);
        const data = await res.json();
        if (data.success) return data.stats;
      } catch (e) {}
      
      return { totalSubmissions: 0, accepted: 0, uniqueSolved: 0, acceptanceRate: 0 };
    },

    async getAll() {
      try {
        const res = await fetch(`${API_URL}/submissions`);
        const data = await res.json();
        return data.success ? data.submissions : [];
      } catch (e) {
        return [];
      }
    },

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
