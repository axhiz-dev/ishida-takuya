// Build an isolated checkout with a fake public ID; never edit production config.
import { cpSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { spawn } from 'node:child_process';
const root = process.cwd();
const scratch = mkdtempSync(join(tmpdir(), 'business-contact-e2e-'));
const excluded = new Set(['.git', 'node_modules', '.next', '.next-dev', 'out', 'test-results', 'playwright-report', 'playwright-contact-report', 'playwright-compat-report']);
cpSync(root, scratch, { recursive: true, filter: (path) => !excluded.has(basename(path)) });
symlinkSync(join(root, 'node_modules'), join(scratch, 'node_modules'), 'dir');
writeFileSync(join(scratch, 'src/components/business/tour/config.ts'), 'export const contactConfig = { formId: "contactTestOnly" };\n');
let child;
const cleanup = () => { child?.kill('SIGTERM'); rmSync(scratch, { recursive: true, force: true }); };
process.on('exit', cleanup);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => process.exit(0));
const run = (cmd, args) => new Promise((resolve, reject) => {
  child = spawn(cmd, args, { cwd: scratch, stdio: 'inherit', env: { ...process.env, NEXT_OUTPUT: 'export', NEXT_BASE_PATH: '' } });
  child.on('error', reject);
  child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)));
});
try {
  await run(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'build']);
  await run(process.execPath, [join(root, 'node_modules/serve/build/main.js'), 'out', '-l', '4322', '--no-clipboard']);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
