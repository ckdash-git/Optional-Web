// Render the 1200x630 share images in assets/og/ from the site's own fonts and icons.
//
//   npm i --no-save playwright && npx playwright install chromium
//   node tools/make-og.mjs
//
// Set PLAYWRIGHT_MODULE to a playwright entry file to use an installed copy instead.
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'assets/og');
fs.mkdirSync(out, { recursive: true });

const TONES = {
  ink: { bg: '#0e0f0c', ink: '#ffffff', soft: '#c4c3bf' },
  coral: { bg: '#ff5a4f', ink: '#0e0f0c', soft: '#3d0f0b' },
  zeroauth: { bg: '#ffe9e6', ink: '#0e0f0c', soft: '#4a4a48' },
  saifu: { bg: '#e7efff', ink: '#0e0f0c', soft: '#4a4a48' },
  parchi: { bg: '#e5f7ea', ink: '#0e0f0c', soft: '#4a4a48' },
  tegami: { bg: '#fff1d6', ink: '#0e0f0c', soft: '#4a4a48' },
  passo: { bg: '#efe8ff', ink: '#0e0f0c', soft: '#4a4a48' },
  jobmatch: { bg: '#ffe6f1', ink: '#0e0f0c', soft: '#4a4a48' },
  helm: { bg: '#e1f5f6', ink: '#0e0f0c', soft: '#4a4a48' },
  revive: { bg: '#f0ece6', ink: '#0e0f0c', soft: '#4a4a48' },
  white: { bg: '#ffffff', ink: '#0e0f0c', soft: '#4a4a48' },
};

const CARDS = [
  { file: 'home', tone: 'white', icon: 'ol-mark.png', name: 'Optional Labs', line: 'Your data. Your device. Your call.', foot: 'Eight small apps that keep your data with you' },
  { file: 'zeroauth', tone: 'zeroauth', icon: 'zeroauth.png', name: 'ZeroAuth', line: 'Two-factor codes made on your phone, in an encrypted vault.', foot: 'Authenticator for iPhone and Android' },
  { file: 'saifu', tone: 'saifu', icon: 'saifu.svg', name: 'Saifu', line: 'Which card at checkout. And what you are about to lose.', foot: 'Credit card advisor for India' },
  { file: 'parchi', tone: 'parchi', icon: 'parchi.png', name: 'Parchi', line: 'Your family’s medical papers, read and kept on your phone.', foot: 'iPhone and Android' },
  { file: 'tegami', tone: 'tegami', icon: 'tegami.png', name: 'Tegami', line: 'Every letter from city hall, explained in plain English.', foot: 'For residents of Japan' },
  { file: 'about', tone: 'ink', icon: 'ol-mark.png', name: 'Optional Labs', line: 'Small apps that keep your data with you.', foot: 'Optional Labs LLP' },
  { file: 'passo', tone: 'passo', icon: 'passo.png', name: 'Passo', line: 'A passport you can stamp.', foot: 'Travel stamps journal for iPhone' },
  { file: 'jobmatch', tone: 'jobmatch', icon: 'jobmatch.png', name: 'JobMatch', line: 'Upload your resume once. See the jobs that fit.', foot: 'Job search for India, on your computer' },
  { file: 'helm', tone: 'helm', icon: 'helm.svg', name: 'Helm', line: 'Your Mac, in your pocket.', foot: 'Mac remote control from iPhone and Android' },
  { file: 'revive', tone: 'revive', icon: 'revive.png', name: 'Revive', line: 'Answers, not dashboards.', foot: 'Sleep, recovery and HRV from your wearable' },
  { file: 'careers', tone: 'ink', icon: 'ol-mark.png', name: 'Optional Labs', line: 'Come build small apps with us.', foot: 'career@optionallabs.com' },
  { file: 'enquire', tone: 'coral', icon: 'ol-mark.png', name: 'Optional Labs', line: 'Tell us what you need built.', foot: 'optionallabs.com/enquire' },
];

const font = (w) => pathToFileURL(path.join(root, `assets/fonts/inter-latin-${w}-normal.woff2`)).href;
const html = (c) => {
  const t = TONES[c.tone];
  const icon = pathToFileURL(path.join(root, 'assets/img', c.icon)).href;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;font-weight:600;src:url(${font(600)})}
@font-face{font-family:Inter;font-weight:900;src:url(${font(900)})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:${t.bg};font-family:Inter;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden}
.id{display:flex;align-items:center;gap:22px}
.id img{width:96px;height:96px;border-radius:24px;box-shadow:0 18px 36px -18px rgba(14,15,12,.5)}
.id b{font-weight:900;font-size:44px;letter-spacing:-.03em;color:${t.ink}}
h1{font-weight:900;font-size:76px;line-height:.95;letter-spacing:-.04em;color:${t.ink};max-width:16ch}
.foot{display:flex;justify-content:space-between;font-weight:600;font-size:26px;color:${t.soft}}
</style></head><body>
<div class="id"><img src="${icon}"><b>${c.name}</b></div>
<h1>${c.line}</h1>
<div class="foot"><span>${c.foot}</span><span>optionallabs.com</span></div>
</body></html>`;
};

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of CARDS) {
  const tmp = path.join(out, `.${c.file}.html`);
  fs.writeFileSync(tmp, html(c));
  await page.goto(pathToFileURL(tmp).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, `${c.file}.png`) });
  fs.unlinkSync(tmp);
  console.log('wrote', `assets/og/${c.file}.png`);
}
await browser.close();
