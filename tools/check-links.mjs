// Check every internal link, image, stylesheet and script in the site's HTML files,
// including #anchors. External links are not fetched. No dependencies.
//
//   node tools/check-links.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skipDirs = new Set(['.git', '.github', '.impeccable', 'node_modules', 'tools', '_site']);

const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!skipDirs.has(e.name)) walk(path.join(dir, e.name)); }
    else if (e.name.endsWith('.html')) htmlFiles.push(path.join(dir, e.name));
  }
})(root);

const idsCache = new Map();
const idsOf = (file) => {
  if (!idsCache.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
};

const resolveTarget = (from, ref) => {
  const base = ref.startsWith('/') ? root : path.dirname(from);
  let p = path.join(base, decodeURIComponent(ref.replace(/^\//, '')));
  if (ref.endsWith('/') || (fs.existsSync(p) && fs.statSync(p).isDirectory())) p = path.join(p, 'index.html');
  return p;
};

const problems = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [ref, hash] = url.split('#');
    const target = ref ? resolveTarget(file, ref) : file;
    if (!fs.existsSync(target)) { problems.push(`${rel}: missing ${url}`); continue; }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) problems.push(`${rel}: no #${hash} in ${path.relative(root, target)}`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} broken link(s) in ${htmlFiles.length} pages`);
  process.exit(1);
}
console.log(`All internal links and anchors resolve (${htmlFiles.length} pages).`);
