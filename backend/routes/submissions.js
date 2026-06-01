const express = require('express');
const { run, get, all } = require('../database');
const { authMiddleware } = require('./auth');

const router = express.Router();

// Get submissions with filters
router.get('/', async (req, res) => {
  const { username, problemId, status, language } = req.query;
  let query = 'SELECT * FROM submissions WHERE 1=1';
  let params = [];
  
  if (username) { query += ' AND username = ?'; params.push(username); }
  if (problemId) { query += ' AND problemId = ?'; params.push(problemId); }
  if (status) { query += ' AND status = ?'; params.push(status); }
  if (language) { query += ' AND language = ?'; params.push(language); }
  
  query += ' ORDER BY timestamp DESC LIMIT 500';

  try {
    const submissions = await all(query, params);
    res.json({ success: true, submissions });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add a new submission
router.post('/', authMiddleware, async (req, res) => {
  const { problemId, problemTitle, language, code, status, passed, total, runtime } = req.body;
  const username = req.user.username;
  
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const timestamp = new Date().toISOString();

  try {
    await run(
      `INSERT INTO submissions (id, username, problemId, problemTitle, language, code, status, passed, total, runtime, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, username, problemId, problemTitle, language, code, status, passed, total, runtime, timestamp]
    );

    // Update user_problems
    const currentStatus = await get('SELECT status FROM user_problems WHERE username = ? AND problemId = ?', [username, problemId]);
    if (status === 'Accepted') {
      if (!currentStatus) {
        await run('INSERT INTO user_problems (username, problemId, status) VALUES (?, ?, ?)', [username, problemId, 'solved']);
      } else if (currentStatus.status !== 'solved') {
        await run('UPDATE user_problems SET status = ? WHERE username = ? AND problemId = ?', ['solved', username, problemId]);
      }
    } else {
      if (!currentStatus) {
        await run('INSERT INTO user_problems (username, problemId, status) VALUES (?, ?, ?)', [username, problemId, 'attempted']);
      }
    }

    res.json({ success: true, submission: { id, username, problemId, problemTitle, language, code, status, passed, total, runtime, timestamp } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get user stats
router.get('/stats/:username', async (req, res) => {
  try {
    const subs = await all('SELECT problemId, status FROM submissions WHERE username = ?', [req.params.username]);
    const totalSubmissions = subs.length;
    const accepted = subs.filter(s => s.status === 'Accepted');
    const uniqueSolved = new Set(accepted.map(s => s.problemId)).size;
    const acceptanceRate = totalSubmissions > 0 ? Math.round((accepted.length / totalSubmissions) * 100) : 0;
    
    res.json({ success: true, stats: { totalSubmissions, accepted: accepted.length, uniqueSolved, acceptanceRate } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
