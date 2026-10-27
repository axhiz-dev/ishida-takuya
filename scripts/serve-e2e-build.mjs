// Reuse only an explicitly built static export; never silently rebuild in CI.
import { access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
try {
  await access('out/index.html');
} catch {
  console.error('Static export missing. Run npm run build:export before reusing it.');
  process.exit(1);
}
const child = spawn(process.execPath, ['node_modules/serve/build/main.js', 'out', '-l', process.argv[2] ?? '4321', '--no-clipboard'], { stdio: 'inherit' });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', error => { console.error(error); process.exitCode = 1; });
child.on('exit', code => process.exit(code ?? 1));
