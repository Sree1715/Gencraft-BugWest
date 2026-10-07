const { spawn } = require('child_process');
const path = require('path');

console.log('Starting BUGWEST Express API Server & Vite Dev Server...');

// Start Express API server
const serverProcess = spawn('node', [path.join(__dirname, 'index.js')], {
  stdio: 'inherit',
  shell: true
});

// Start Vite Dev Server
const viteProcess = spawn('npx', ['vite', '--port=3000', '--host=0.0.0.0'], {
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nShutting down servers...');
  serverProcess.kill();
  viteProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
