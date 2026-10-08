const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'bugwest.db');
const db = new Database(dbPath);

console.log('Deleting existing teams...');
db.exec('DELETE FROM team_rounds;');
db.exec('DELETE FROM teams;');
console.log('Default teams removed successfully.');
