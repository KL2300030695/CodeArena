// ============================================
// TCS NQT Coding Platform — Leaderboard
// ============================================

const Leaderboard = (() => {
  return {
    // Get ranked users
    getRankings() {
      const users = Auth.getAllUsers();
      const rankings = users.map(user => {
        const stats = Submissions.getUserStats(user.username);
        return {
          username: user.username,
          avatarColor: user.avatarColor,
          solved: user.solved,
          solvedIds: user.solvedIds,
          totalSubmissions: stats.totalSubmissions,
          acceptanceRate: stats.acceptanceRate,
          joinDate: user.joinDate
        };
      });

      // Sort by solved count (desc), then by acceptance rate (desc)
      rankings.sort((a, b) => {
        if (b.solved !== a.solved) return b.solved - a.solved;
        return b.acceptanceRate - a.acceptanceRate;
      });

      return rankings;
    },

    // Get top N users
    getTopN(n = 10) {
      return this.getRankings().slice(0, n);
    },

    // Get user's rank
    getUserRank(username) {
      const rankings = this.getRankings();
      const idx = rankings.findIndex(r => r.username === username);
      return idx >= 0 ? idx + 1 : null;
    },

    // Get problem-specific leaderboard (fastest accepted solutions)
    getProblemLeaderboard(problemId) {
      const allSubs = Submissions.getAll();
      const accepted = allSubs.filter(s => s.problemId === problemId && s.status === 'Accepted');
      
      // Group by user, keep fastest
      const userBest = {};
      for (const sub of accepted) {
        if (!userBest[sub.username] || sub.runtime < userBest[sub.username].runtime) {
          userBest[sub.username] = sub;
        }
      }

      return Object.values(userBest)
        .sort((a, b) => a.runtime - b.runtime)
        .map((sub, idx) => ({
          rank: idx + 1,
          username: sub.username,
          runtime: sub.runtime,
          language: sub.language,
          timestamp: sub.timestamp
        }));
    }
  };
})();

window.Leaderboard = Leaderboard;
