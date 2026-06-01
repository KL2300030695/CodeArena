const Leaderboard = (() => {
  return {
    async getRankings() {
      const { collection, getDocs } = window.FirebaseFirestore;
      const db = window.FirebaseDB;
      
      try {
        const snap = await getDocs(collection(db, "users"));
        const users = snap.docs.map(doc => doc.data());
        
        users.sort((a, b) => {
          const aSolved = a.solved ? a.solved.length : 0;
          const bSolved = b.solved ? b.solved.length : 0;
          if (bSolved !== aSolved) return bSolved - aSolved;
          return new Date(a.joinDate) - new Date(b.joinDate);
        });
        
        return users;
      } catch (e) {
        console.error("Firestore Leaderboard Error:", e);
        return [];
      }
    },

    async getUserRank(username) {
      const rankings = await this.getRankings();
      const session = Auth.getSession();
      if (!session) return '-';
      
      // Since usernames might change or be generated, check by uid if possible, otherwise by username.
      const index = rankings.findIndex(u => u.username === username || u.email === session.email);
      return index !== -1 ? index + 1 : '-';
    },

    async getProblemLeaderboard(problemId) {
      const { collection, getDocs, query, where } = window.FirebaseFirestore;
      const db = window.FirebaseDB;
      
      try {
        const q = query(collection(db, "submissions"), where("problemId", "==", problemId), where("status", "==", "Accepted"));
        const snap = await getDocs(q);
        const docs = snap.docs.map(doc => doc.data());
        
        // Group by user, keep best runtime
        const bestSubs = {};
        docs.forEach(sub => {
          if (!bestSubs[sub.uid] || sub.runtime < bestSubs[sub.uid].runtime) {
            bestSubs[sub.uid] = sub;
          }
        });
        
        const sorted = Object.values(bestSubs).sort((a,b) => a.runtime - b.runtime);
        return sorted;
      } catch (e) {
        console.error("Firestore Problem Leaderboard Error:", e);
        return [];
      }
    }
  };
})();

window.Leaderboard = Leaderboard;
