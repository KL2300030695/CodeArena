const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get, all } = require('../database');

const router = express.Router();
const JWT_SECRET = 'tcs_nqt_secret_key_2026';

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ success: false, error: 'All fields required' });
  
  try {
    const existingUser = await get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser) {
      if (existingUser.username === username) return res.status(400).json({ success: false, error: 'Username exists' });
      return res.status(400).json({ success: false, error: 'Email registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const joinDate = new Date().toISOString();
    
    // Hash for avatar color
    let hash = 0;
    for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
    const avatarColor = `hsl(${Math.abs(hash % 360)}, 65%, 55%)`;

    await run('INSERT INTO users (username, email, password, avatarColor, joinDate) VALUES (?, ?, ?, ?, ?)', 
      [username, email, hashedPassword, avatarColor, joinDate]);

    const user = { username, email, avatarColor, joinDate };
    const token = jwt.sign(user, JWT_SECRET);
    
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, error: 'All fields required' });

  try {
    const userRow = await get('SELECT * FROM users WHERE username = ?', [username]);
    if (!userRow) return res.status(400).json({ success: false, error: 'User not found' });

    const isMatch = await bcrypt.compare(password, userRow.password);
    if (!isMatch) return res.status(400).json({ success: false, error: 'Incorrect password' });

    const user = { 
      username: userRow.username, 
      email: userRow.email, 
      avatarColor: userRow.avatarColor, 
      joinDate: userRow.joinDate 
    };
    const token = jwt.sign(user, JWT_SECRET);

    res.json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, error: 'Unauthorized' });
  
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Get current user details + solved/attempted
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userProblems = await all('SELECT problemId, status FROM user_problems WHERE username = ?', [req.user.username]);
    const solved = userProblems.filter(p => p.status === 'solved').map(p => p.problemId);
    const attempted = userProblems.filter(p => p.status === 'attempted').map(p => p.problemId);
    
    res.json({ success: true, user: { ...req.user, solved, attempted } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = { router, authMiddleware };
