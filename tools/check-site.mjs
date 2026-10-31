// Facts the site must always state. Run one section or all of them:
//
//   node tools/check-site.mjs company products careers enquire
//
// Prints "OK <section>" per passing section and exits 1 listing every failure.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => (fs.existsSync(path.join(root, f)) ? fs.readFileSync(path.join(root, f), 'utf8') : null);
const skip = new Set(['.git', '.github', '.impeccable', 'node_modules', 'tools', '_site', 'assets']);

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!skip.has(e.name)) walk(path.join(dir, e.name)); }
    else if (e.name.endsWith('.html')) pages.push(path.relative(root, path.join(dir, e.name)));
  }
})(root);
// Redirect stubs (old URLs) carry no footer.
const full = pages.filter((p) => read(p).includes('<footer class="foot"'));

const COMPANY = {
  name: 'Optional Labs LLP',
  llpin: 'LLPIN ADD-5789',
  address: 'Kotpad, Koraput Dist, Odisha, India, 764058',
};
const PRODUCTS = {
  zeroauth: 'https://zeroauth.in', saifu: 'https://saifu.in', parchi: 'https://getparchi.com', tegami: 'https://tegami.optionallabs.com',
  passo: 'https://passo.optionallabs.com', jobmatch: 'https://jobmatch.optionallabs.com',
  helm: 'https://helm.optionallabs.com', revive: 'https://revive.optionallabs.com',
};

const sections = {
  company() {
    const bad = [];
    for (const p of full) {
      const t = read(p);
      for (const [k, v] of Object.entries(COMPANY)) if (!t.includes(v)) bad.push(`${p}: footer lacks ${k} "${v}"`);
      if (t.includes('Bengaluru')) bad.push(`${p}: still says Bengaluru`);
    }
    for (const p of ['about/index.html', 'privacy-policy.html']) {
      const t = read(p) || '';
      for (const v of [COMPANY.name, COMPANY.llpin, COMPANY.address]) if (!t.includes(v)) bad.push(`${p}: lacks "${v}"`);
    }
    const ld = (read('index.html') || '').match(/application\/ld\+json">(.*?)<\/script>/s);
    const org = ld && JSON.parse(ld[1]);
    if (!org || org.legalName !== COMPANY.name) bad.push('index.html: Organization JSON-LD legalName is not ' + COMPANY.name);
    else {
      if (org.address?.postalCode !== '764058' || org.address?.addressRegion !== 'Odisha') bad.push('JSON-LD address is not Kotpad, Odisha 764058');
      if (!JSON.stringify(org.identifier || '').includes('ADD-5789')) bad.push('JSON-LD identifier lacks LLPIN ADD-5789');
    }
    return bad;
  },
  products() {
    const bad = [];
    const home = read('index.html') || '';
    const map = read('sitemap.xml') || '';
    for (const [slug, site] of Object.entries(PRODUCTS)) {
      const t = read(`${slug}/index.html`);
      if (!t) { bad.push(`${slug}/index.html is missing`); continue; }
      if (!t.includes(`href="${site}`)) bad.push(`${slug}: no link to ${site}`);
      if (!/<h1[^>]*>[^<]{10,}/.test(t)) bad.push(`${slug}: no h1`);
      if (!t.includes(`https://optionallabs.com/${slug}/`)) bad.push(`${slug}: canonical missing`);
      if (!fs.existsSync(path.join(root, `assets/og/${slug}.png`))) bad.push(`${slug}: share image missing`);
      if (!home.includes(`id="${slug}"`)) bad.push(`${slug}: no band on the homepage`);
      if (!home.includes(`href="${slug}/"`)) bad.push(`${slug}: homepage does not link to its page`);
      if (!map.includes(`https://optionallabs.com/${slug}/`)) bad.push(`${slug}: not in sitemap`);
    }
    // The hero must stay true for all eight apps (Helm has an account, JobMatch sends search words, Revive can send an AI summary).
    for (const claim of ['None of them need an account', '0 KB', 'none of them send']) {
      if (home.includes(claim)) bad.push(`index.html still claims "${claim}", which is not true for all eight apps`);
    }
    return bad;
  },
  careers() {
    const bad = [];
    const t = read('careers/index.html');
    if (!t) return ['careers/index.html is missing'];
    if (!t.includes('mailto:career@optionallabs.com')) bad.push('careers: no mailto:career@optionallabs.com');
    if (/<form[^>]*action="https?:/.test(t)) bad.push('careers: form posts to a third party');
    for (const p of full) if (!read(p).includes('href="careers/"') && !read(p).includes('href="../careers/"') && !read(p).includes('href="/careers/"')) bad.push(`${p}: no link to careers`);
    if (!(read('sitemap.xml') || '').includes('https://optionallabs.com/careers/')) bad.push('careers: not in sitemap');
    return bad;
  },
  enquire() {
    const bad = [];
    const t = read('enquire/index.html');
    if (!t) return ['enquire/index.html is missing'];
    for (const f of ['name="name"', 'name="phone"', 'name="interest"', 'name="message"']) if (!t.includes(f)) bad.push(`enquire: form lacks ${f}`);
    const js = read('assets/js/enquire.js') || '';
    for (const k of ['at', 'site', 'kind', 'name', 'phone', 'interest', 'message', 'page']) if (!new RegExp(`\\b${k}\\b`).test(js)) bad.push(`enquire.js: payload lacks "${k}"`);
    for (const p of full) if (!/href="(\.\.\/|\/)?enquire\/"/.test(read(p))) bad.push(`${p}: no link to enquire`);
    if (!(read('sitemap.xml') || '').includes('https://optionallabs.com/enquire/')) bad.push('enquire: not in sitemap');
    return bad;
  },
};

const want = process.argv.slice(2);
const run = want.length ? want : Object.keys(sections);
let failed = 0;
for (const name of run) {
  if (!sections[name]) { console.error(`unknown section ${name}`); failed++; continue; }
  const bad = sections[name]();
  if (bad.length) { failed++; console.error(`FAIL ${name}\n  ` + bad.join('\n  ')); } else console.log(`OK ${name}`);
}
process.exit(failed ? 1 : 0);
