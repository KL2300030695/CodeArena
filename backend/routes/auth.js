const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get, all } = require('../database');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const JWT_SECRET = 'tcs_nqt_secret_key_2026';

let firebaseAdminApp;
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  firebaseAdminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.warn("⚠️ Firebase Admin SDK not initialized: serviceAccountKey.json not found.");
}

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

// Google Login
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ success: false, error: 'Token missing.' });

  try {
    if (!firebaseAdminApp) {
      return res.status(500).json({ success: false, error: 'Firebase Admin not configured on server (Missing serviceAccountKey.json)' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(credential);
    const email = decodedToken.email;
    const name = decodedToken.name || email.split('@')[0];

    const row = await get('SELECT * FROM users WHERE email = ?', [email]);

    if (row) {
      const token = jwt.sign({ username: row.username, email: row.email, avatarColor: row.avatarColor, joinDate: row.joinDate }, JWT_SECRET);
      res.json({ success: true, token, user: row });
    } else {
      const baseUsername = name.replace(/\s+/g, '').toLowerCase();
      const username = baseUsername + Math.floor(Math.random() * 1000);
      const joinDate = new Date().toISOString();
      const passwordHash = await bcrypt.hash(Math.random().toString(36), 10);
      let hash = 0;
      for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
      const avatarColor = `hsl(${Math.abs(hash % 360)}, 65%, 55%)`;

      await run('INSERT INTO users (username, email, password, avatarColor, joinDate) VALUES (?, ?, ?, ?, ?)',
        [username, email, passwordHash, avatarColor, joinDate]);
      
      const newUser = { username, email, avatarColor, joinDate };
      const token = jwt.sign(newUser, JWT_SECRET);
      res.json({ success: true, token, user: newUser });
    }
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid Google token.' });
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
