const path = require('path');
const INITIAL_QUESTIONS = require('./questionsData.json');

// DB_PATH env var lets Docker point the database at the mounted volume (/data/bugwest.db).
// Falls back to the repo-local path for local development.
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'bugwest.db');

let db;

try {
  const Database = require('better-sqlite3');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  console.log('[Database] Loaded SQLite via better-sqlite3');
} catch (err) {
  try {
    const { DatabaseSync } = require('node:sqlite');
    const rawDb = new DatabaseSync(dbPath);
    try { rawDb.exec('PRAGMA journal_mode = WAL;'); } catch (e) {}

    class StatementWrapper {
      constructor(stmt) {
        this._stmt = stmt;
      }
      get(...args) {
        if (args.length === 1 && Array.isArray(args[0])) return this._stmt.get(...args[0]);
        return this._stmt.get(...args);
      }
      all(...args) {
        if (args.length === 1 && Array.isArray(args[0])) return this._stmt.all(...args[0]);
        return this._stmt.all(...args);
      }
      run(...args) {
        if (args.length === 1 && Array.isArray(args[0])) return this._stmt.run(...args[0]);
        return this._stmt.run(...args);
      }
    }

    db = {
      prepare: (sql) => new StatementWrapper(rawDb.prepare(sql)),
      exec: (sql) => rawDb.exec(sql),
      pragma: (sql) => { try { rawDb.exec(`PRAGMA ${sql};`); } catch (e) {} },
      close: () => rawDb.close(),
    };
    console.log('[Database] Loaded SQLite via native node:sqlite');
  } catch (fallbackErr) {
    console.error('Failed to initialize database with better-sqlite3 or node:sqlite:', fallbackErr);
    throw fallbackErr;
  }
}

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    team_name TEXT NOT NULL UNIQUE,
    locked INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rounds (
    id INTEGER PRIMARY KEY,
    event_id TEXT NOT NULL,
    round_number INTEGER NOT NULL,
    round_name TEXT NOT NULL,
    join_code TEXT NOT NULL UNIQUE,
    start_time TEXT,
    end_time TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 20,
    status TEXT NOT NULL DEFAULT 'locked'
  );

  CREATE TABLE IF NOT EXISTS team_rounds (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    round_id INTEGER NOT NULL,
    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'joined',
    score INTEGER NOT NULL DEFAULT 0,
    started_at TEXT,
    submitted_at TEXT,
    UNIQUE(team_id, round_id),
    FOREIGN KEY(team_id) REFERENCES teams(id),
    FOREIGN KEY(round_id) REFERENCES rounds(id)
  );

  CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    round_id INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    code TEXT NOT NULL,
    passed_cases INTEGER NOT NULL DEFAULT 0,
    total_cases INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Evaluated',
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, round_id, question_id),
    FOREIGN KEY(team_id) REFERENCES teams(id),
    FOREIGN KEY(round_id) REFERENCES rounds(id)
  );

  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    round INTEGER NOT NULL,
    title TEXT NOT NULL,
    language TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    points INTEGER NOT NULL,
    bug_description TEXT NOT NULL,
    buggy_code TEXT NOT NULL,
    hint TEXT,
    test_cases TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed default Event
const eventCount = db.prepare('SELECT COUNT(*) as cnt FROM events').get().cnt;
if (eventCount === 0) {
  db.prepare('INSERT INTO events (id, name, status) VALUES (?, ?, ?)').run(
    'evt-bugwest-2026',
    'BUGWEST 2026',
    'active'
  );
}

// Seed default Rounds if missing
const roundCount = db.prepare('SELECT COUNT(*) as cnt FROM rounds').get().cnt;
if (roundCount === 0) {
  const insertRound = db.prepare(`
    INSERT INTO rounds (id, event_id, round_number, round_name, join_code, duration_minutes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertRound.run(1, 'evt-bugwest-2026', 1, 'ROUND 1 - Basic Debugging', 'BF-R1-8K9M3P', 20, 'active');
  insertRound.run(2, 'evt-bugwest-2026', 2, 'ROUND 2 - Core Programming & Debugging', 'BF-R2-7X4W9Q', 25, 'locked');
  insertRound.run(3, 'evt-bugwest-2026', 3, 'ROUND 3 - Advanced Professional Debugging', 'BF-R3-5N2J8L', 30, 'locked');
}

// Seed Questions if missing
const questionCount = db.prepare('SELECT COUNT(*) as cnt FROM questions').get().cnt;
if (questionCount === 0 && INITIAL_QUESTIONS && INITIAL_QUESTIONS.length > 0) {
  const insertQ = db.prepare(`
    INSERT INTO questions (id, round, title, language, difficulty, points, bug_description, buggy_code, hint, test_cases)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const q of INITIAL_QUESTIONS) {
    insertQ.run(
      q.id,
      q.round,
      q.title,
      q.language,
      q.difficulty,
      q.points || q.marks || 5,
      q.bugDescription || '',
      q.buggyCode || '',
      q.hint || '',
      JSON.stringify(q.testCases || q.visibleTestCases || [])
    );
  }
}

// Seed Default Teams removed

module.exports = db;
