import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve('outputs');
const htmlFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
}

function localPath(file, url) {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean || /^(https?:|mailto:|tel:|javascript:)/i.test(clean)) return null;
  return clean.startsWith('/') ? join(root, clean.slice(1)) : join(dirname(file), clean);
}

walk(root);

const broken = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target = localPath(file, match[1]);
    if (target && !existsSync(target)) {
      broken.push(`${file.replace(`${root}\\`, '').replace(`${root}/`, '')} -> ${match[1]}`);
    }
  }
}

if (broken.length > 0) {
  console.error(`Broken local references (${broken.length}):`);
  for (const item of broken) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Static site check passed: ${htmlFiles.length} HTML files, no broken local href/src references.`);
