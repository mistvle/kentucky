const path = require("path");
const BetterSqlite3 = require("better-sqlite3");

const db = new BetterSqlite3(
    path.join(__dirname, "data", "database.sqlite")
);

// ================= INFRACTIONS =================
db.prepare(`
CREATE TABLE IF NOT EXISTS infractions (
    id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    type TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

// ================= INFRACTION MIGRATIONS =================
try {
    db.prepare(`
        ALTER TABLE infractions
        ADD COLUMN voided INTEGER DEFAULT 0
    `).run();
} catch {}

try {
    db.prepare(`
        ALTER TABLE infractions
        ADD COLUMN approval_message_id TEXT
    `).run();
} catch {}

try {
    db.prepare(`
        ALTER TABLE infractions
        ADD COLUMN approval_channel_id TEXT
    `).run();
} catch {}

try {
    db.prepare(`
        ALTER TABLE infractions
        ADD COLUMN issued_message_id TEXT
    `).run();
} catch {}

try {
    db.prepare(`
        ALTER TABLE infractions
        ADD COLUMN issued_channel_id TEXT
    `).run();
} catch {}

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