const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      avatarColor TEXT,
      joinDate TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_problems (
      username TEXT,
      problemId TEXT,
      status TEXT,
      PRIMARY KEY (username, problemId),
      FOREIGN KEY (username) REFERENCES users(username)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      username TEXT,
      problemId TEXT,
      problemTitle TEXT,
      language TEXT,
      code TEXT,
      status TEXT,
      passed INTEGER,
      total INTEGER,
      runtime INTEGER,
      timestamp TEXT,
      FOREIGN KEY (username) REFERENCES users(username)
    )
  `);
});

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

module.exports = { db, run, get, all };
