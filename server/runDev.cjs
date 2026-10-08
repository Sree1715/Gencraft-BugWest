const { spawn } = require('child_process');
const path = require('path');

console.log('[BUGWEST Launcher] Starting Express API Server & Vite Dev Server...');

const indexPath = `"${path.join(__dirname, 'index.cjs')}"`;

// Start Express API server
const serverProcess = spawn('node', [indexPath], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});

// Start Vite Dev Server
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const viteProcess = spawn(npxCmd, ['vite', '--port=3000', '--host=0.0.0.0'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});

const cleanup = () => {
  console.log('\nShutting down servers...');
  try { serverProcess.kill(); } catch (e) {}
  try { viteProcess.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
