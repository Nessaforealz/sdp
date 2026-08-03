import Database from 'better-sqlite3';
import path from 'path';

//It's where the db file will live.
const dbPath = path.join(process.cwd(), 'local_tasks.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
// Create the tasks table if it doesn't exist.
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT NOT NULL,
    topic TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Todo', 'In-Progress', 'Complete')),
    is_archived INTEGER NOT NULL DEFAULT 0 CHECK(is_archived IN (0, 1)),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;