// Pulls the inline <script> out of app/index.html and runs `node --check` on it.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const html = readFileSync(new URL('../app/index.html', import.meta.url), 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error('No inline <script> found in app/index.html'); process.exit(1); }
const file = join(mkdtempSync(join(tmpdir(), 'dr-')), 'app.js');
writeFileSync(file, m[1]);
try {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  console.log('Syntax OK');
} catch { process.exit(1); }
