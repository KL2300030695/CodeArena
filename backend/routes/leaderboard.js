const express = require('express');
const { all } = require('../database');

const router = express.Router();

// Get rankings
router.get('/', async (req, res) => {
  try {
    const users = await all('SELECT username, avatarColor, joinDate FROM users');
    
    // Get stats for all users
    const allSubs = await all('SELECT username, problemId, status FROM submissions');
    
    const rankings = users.map(user => {
      const userSubs = allSubs.filter(s => s.username === user.username);
      const totalSubmissions = userSubs.length;
      const accepted = userSubs.filter(s => s.status === 'Accepted');
      const uniqueSolved = new Set(accepted.map(s => s.problemId)).size;
      const acceptanceRate = totalSubmissions > 0 ? Math.round((accepted.length / totalSubmissions) * 100) : 0;
      
      return {
        username: user.username,
        avatarColor: user.avatarColor,
        solved: uniqueSolved,
        totalSubmissions,
        acceptanceRate,
        joinDate: user.joinDate
      };
    });

    rankings.sort((a, b) => {
      if (b.solved !== a.solved) return b.solved - a.solved;
      return b.acceptanceRate - a.acceptanceRate;
    });

    res.json({ success: true, rankings });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get problem-specific leaderboard
router.get('/problem/:problemId', async (req, res) => {
  try {
    const accepted = await all('SELECT username, runtime, language, timestamp FROM submissions WHERE problemId = ? AND status = ?', [req.params.problemId, 'Accepted']);
    
    // Group by user, keep fastest
    const userBest = {};
    for (const sub of accepted) {
      if (!userBest[sub.username] || sub.runtime < userBest[sub.username].runtime) {
        userBest[sub.username] = sub;
      }
    }

    const leaderboard = Object.values(userBest)
      .sort((a, b) => a.runtime - b.runtime)
      .map((sub, idx) => ({
        rank: idx + 1,
        username: sub.username,
        runtime: sub.runtime,
        language: sub.language,
        timestamp: sub.timestamp
      }));

    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
