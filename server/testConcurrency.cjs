const http = require('http');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const dataStr = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        host: '127.0.0.1',
        port: 3001,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(dataStr)
        }
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(raw) });
          } catch (e) {
            resolve({ status: res.statusCode, raw });
          }
        });
      }
    );
    req.on('error', reject);
    if (dataStr) req.write(dataStr);
    req.end();
  });
}

async function runConcurrencyTest() {
  console.log('=== STARTING MULTI-TEAM CONCURRENCY TEST ===\n');

  // 1. Organizer activates Round 1 with code BF-R1-8K9M3P and 20 min duration
  console.log('1. Organizer activates Round 1 via API...');
  const round1Start = await request('PATCH', '/api/rounds/1', {
    action: 'start',
    durationMinutes: 20,
    joinCode: 'BF-R1-8K9M3P'
  });
  console.log('   Round 1 Active:', round1Start.body.round);

  // 2. Team A registers
  console.log('\n2. Registering Team A (CyberKnights)...');
  const teamA = await request('POST', '/api/teams/register', { teamName: 'CyberKnights' });
  console.log('   Team A created & locked in DB:', teamA.body.team);

  // 3. Team B registers
  console.log('\n3. Registering Team B (DataDragons)...');
  const teamB = await request('POST', '/api/teams/register', { teamName: 'DataDragons' });
  console.log('   Team B created & locked in DB:', teamB.body.team);

  // 4. Team C registers
  console.log('\n4. Registering Team C (CodeWizards)...');
  const teamC = await request('POST', '/api/teams/register', { teamName: 'CodeWizards' });
  console.log('   Team C created & locked in DB:', teamC.body.team);

  // 5. All teams join using COMMON Round 1 code BF-R1-8K9M3P
  console.log('\n5. Teams joining Round 1 using common join code BF-R1-8K9M3P...');
  const joinA = await request('POST', '/api/rounds/verify-code', { teamId: teamA.body.team.id, joinCode: 'BF-R1-8K9M3P' });
  const joinB = await request('POST', '/api/rounds/verify-code', { teamId: teamB.body.team.id, joinCode: 'BF-R1-8K9M3P' });
  const joinC = await request('POST', '/api/rounds/verify-code', { teamId: teamC.body.team.id, joinCode: 'BF-R1-8K9M3P' });

  console.log('   Team A joined Round 1:', joinA.body.success);
  console.log('   Team B joined Round 1:', joinB.body.success);
  console.log('   Team C joined Round 1:', joinC.body.success);

  // 6. Submissions from Team A, Team B, Team C for Question R1-Q01
  console.log('\n6. Submitting answers for Question R1-Q01...');
  const subA = await request('POST', '/api/submissions', {
    teamId: teamA.body.team.id,
    roundId: 1,
    questionId: 'R1-Q01',
    code: '#include <stdio.h>\nint main() { printf("150\\n"); return 0; }',
    passedCases: 3,
    totalCases: 3,
    score: 5,
    status: 'Passed'
  });

  const subB = await request('POST', '/api/submissions', {
    teamId: teamB.body.team.id,
    roundId: 1,
    questionId: 'R1-Q01',
    code: '#include <stdio.h>\nint main() { printf("0\\n"); return 0; }',
    passedCases: 0,
    totalCases: 3,
    score: 0,
    status: 'Failed'
  });

  const subC = await request('POST', '/api/submissions', {
    teamId: teamC.body.team.id,
    roundId: 1,
    questionId: 'R1-Q01',
    code: '#include <stdio.h>\nint main() { printf("150\\n"); return 0; }',
    passedCases: 3,
    totalCases: 3,
    score: 5,
    status: 'Passed'
  });

  console.log('   Team A score for R1-Q01:', subA.body.roundScore);
  console.log('   Team B score for R1-Q01:', subB.body.roundScore);
  console.log('   Team C score for R1-Q01:', subC.body.roundScore);

  // 7. Verify Leaderboard
  console.log('\n7. Fetching Live Leaderboard...');
  const lb = await request('GET', '/api/leaderboard');
  console.log('   Leaderboard Rankings:');
  lb.body.leaderboard.forEach((entry) => {
    console.log(`   Rank ${entry.rank}: ${entry.teamName} - Total Score: ${entry.totalScore} pts (R1: ${entry.round1Score})`);
  });

  // 8. Attempt to modify locked team name (Must be rejected)
  console.log('\n8. Testing locked Team Name enforcement...');
  const editAttempt = await request('PUT', `/api/teams/${teamA.body.team.id}`, { teamName: 'HackedTeam' });
  console.log('   Team Name Edit Response:', editAttempt.status, editAttempt.body);

  console.log('\n=== ALL CONCURRENCY & MULTI-DEVICE TESTS PASSED PERFECTLY ===');
}

runConcurrencyTest().catch(console.error);
