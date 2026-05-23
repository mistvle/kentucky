const Database = require("better-sqlite3");

const path = require("path");
const Database = require("better-sqlite3");

const db = new Database(
    path.join(__dirname, "data", "database.sqlite")
);
// ================= INFRACTIONS =================
db.prepare(`
CREATE TABLE IF NOT EXISTS infractions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    type TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

// ================= BLACKLISTS =================
db.prepare(`
CREATE TABLE IF NOT EXISTS blacklists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    duration TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at INTEGER NOT NULL
)
`).run();

module.exports = db;