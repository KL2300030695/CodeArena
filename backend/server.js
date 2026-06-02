const express = require('express');
const cors = require('cors');
const path = require('path');

const { router: authRoutes } = require('./routes/auth');
const submissionsRoutes = require('./routes/submissions');
const leaderboardRoutes = require('./routes/leaderboard');
const executeRoutes = require('./routes/execute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/execute', executeRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
