const Database = require('better-sqlite3');
const path = require('path');
const INITIAL_QUESTIONS = require('./server/questionsData.json');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'bugwest.db');
const db = new Database(dbPath);

console.log('Clearing existing answers and questions...');
db.exec('DELETE FROM answers;');
db.exec('DELETE FROM questions;');

const insertQ = db.prepare(`
  INSERT INTO questions (id, round, title, language, difficulty, points, bug_description, buggy_code, hint, test_cases)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

console.log('Inserting new questions...');
for (const q of INITIAL_QUESTIONS) {
  insertQ.run(
    q.id,
    q.round,
    q.title,
    q.language,
    q.difficulty,
    q.marks || 5,
    q.bugDescription || '',
    q.buggyCode || '',
    q.hint || '',
    JSON.stringify(q.visibleTestCases || [])
  );
}
console.log('Done replacing questions in DB.');
