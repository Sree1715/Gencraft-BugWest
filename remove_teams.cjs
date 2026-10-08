const db = require('./server/db.cjs');

console.log('Deleting existing teams...');
db.exec('DELETE FROM team_rounds;');
db.exec('DELETE FROM teams;');
console.log('Default teams removed successfully.');
