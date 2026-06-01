const Leaderboard = (() => {
  const API_URL = '/api';

  return {
    async getRankings() {
      try {
        const res = await fetch(`${API_URL}/leaderboard`);
        const data = await res.json();
        return data.success ? data.rankings : [];
      } catch (e) {
        return [];
      }
    },

    async getTopN(n = 10) {
      const rankings = await this.getRankings();
      return rankings.slice(0, n);
    },

    async getUserRank(username) {
      const rankings = await this.getRankings();
      const idx = rankings.findIndex(r => r.username === username);
      return idx >= 0 ? idx + 1 : null;
    },

    async getProblemLeaderboard(problemId) {
      try {
        const res = await fetch(`${API_URL}/leaderboard/problem/${encodeURIComponent(problemId)}`);
        const data = await res.json();
        return data.success ? data.leaderboard : [];
      } catch (e) {
        return [];
      }
    }
  };
})();

window.Leaderboard = Leaderboard;
