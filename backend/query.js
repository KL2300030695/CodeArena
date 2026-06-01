const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all('SELECT username, email, joinDate FROM users', (err, users) => {
    if (err) console.error(err);
    console.log("=== USERS ===");
    console.table(users);
    
    db.all('SELECT id, username, problemId, status, runtime, timestamp FROM submissions', (err, subs) => {
      if (err) console.error(err);
      console.log("\n=== SUBMISSIONS ===");
      console.table(subs);
      db.close();
    });
  });
});
