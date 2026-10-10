#!/usr/bin/env python3
"""Generate the four product detail pages (zeroauth/, saifu/, parchi/, tegami/).

Edit the product facts in PRODUCTS below, then run from the repo root:

    python3 tools/build-products.py

Header and footer are copied from index.html, so change those there first.
Facts come from each product's own site source: zeroauth-web, kaunsa-card/site,
parchi-site and tegami-site. Do not add claims those sites do not make."""
import html, json, re, sys, pathlib

ROOT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent
idx = (ROOT / 'index.html').read_text()

ARROW = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CHECK = '<span class="tick" aria-hidden="true"></span>'
e = html.escape

PF = {'zeroauth': ('Many authenticator apps sync your secret keys to the cloud, where one breach can expose every code.', 'ZeroAuth makes your codes on the phone, with no internet needed, and keeps the keys in an encrypted vault that never leaves it.'), 'saifu': ('With a few credit cards, it is hard to know which one pays most at checkout, and fee waivers, monthly caps and expiring points slip by.', 'Saifu ranks your cards for each spend and warns you before a fee waiver, a cap or your points run out.'), 'parchi': ("Prescriptions, lab reports and hospital bills pile up in drawers and photo galleries, and the one you need is never at hand at the doctor's.", 'Parchi reads each paper on your phone, files it under the right family member and makes a one-page summary for the next visit.'), 'tegami': ('Letters from Japanese government offices come in formal Japanese, with deadlines, amounts and era dates that are easy to miss.', 'Tegami tells you what the letter is, what to do and by when, in plain English, without the letter leaving your phone.')}

PRODUCTS = [
  dict(
    slug='zeroauth', name='ZeroAuth', icon='zeroauth.png', tone='forest', job='Authenticator for iPhone and Android',
    title='ZeroAuth: offline authenticator for iPhone and Android',
    desc='ZeroAuth makes two-factor codes on your phone, with no internet needed, and keeps them in an AES-256-GCM encrypted vault.',
    headline='Secure your digital life with ZeroAuth.',
    lede='A privacy-first authenticator. Your two-factor codes are made on the phone, with no internet needed, and kept in an encrypted vault that never leaves it.',
    actions=[('btn-lime', 'Visit zeroauth.in', 'https://zeroauth.in', True)],
    badges=[('app-store', 'https://apps.apple.com/in/app/zeroauth/id6764048764'), ('google-play', 'https://play.google.com/store/apps/details?id=com.OptionalLabs.zeroauth')],
    status='On the App Store and Google Play',
    hero=dict(kind='wide', src='zeroauth-hero.webp', w=1200, h=900, alt='Two iPhones showing the ZeroAuth code list with live six-digit codes'),
    screens_title='Inside ZeroAuth',
    screens_lede='The code list, the QR scanner, settings and sharing, from the ZeroAuth app.',
    screens=[], wide=dict(src='zeroauth-screens.webp', w=1400, h=1400, alt='A grid of ZeroAuth screens: the code list, scanner, security settings and empty vault'),
    steps=[('Scan', 'Scan the QR code a website shows when you turn on two-factor sign-in, or type the key yourself.'),
           ('Encrypt on the phone', 'ZeroAuth encrypts the secret with AES-256-GCM and keeps the key in the phone\'s secure hardware.'),
           ('Use the code', 'Codes refresh in the app and show up in your keyboard through Apple AutoFill and Android Autofill.')],
    features=[('Codes work offline', 'Time-based codes are made on the phone, with no internet connection.'),
              ('Autofill', 'Codes, usernames and passwords appear in your keyboard. No app switching or copy-pasting.'),
              ('Passkeys', 'Works with FIDO2 and WebAuthn passkey sign-in on iPhone and Android.'),
              ('Travel Mode', 'Remove the vault from the phone before crossing a border, so there is nothing on it to seize.'),
              ('Secure sharing', 'Share access with a one-time encrypted QR code instead of a plain-text message.'),
              ('Breach alerts', 'Checks whether a password has appeared in a breach, using a method that never sends the password.'),
              ('Password generator', 'Strong passwords and usernames made on the phone.'),
              ('Encrypted backup', 'Export your vault as a file encrypted with AES-256 and a passphrase you choose.')],
    privacy_title='What ZeroAuth does, and what it avoids',
    privacy=[('Does', ['Keeps your data on your own phone', 'Encrypts with AES-256-GCM', 'Holds keys in the iOS Keychain or Android Keystore, unlocked by PIN, Face ID or fingerprint', 'Works fully offline for codes and the vault']),
             ('Avoids', ['Cloud sync that exposes key material', 'Telemetry, trackers and plain-text logs', 'Sending passwords or 2FA seeds online', 'Custom, home-made cryptography'])],
    note='ZeroAuth does not send, sync or store your passwords, account credentials or 2FA seeds on its servers. They leave the phone only if you export an encrypted backup.',
    facts=[('Platforms', 'iPhone and Android'), ('Encryption', 'AES-256-GCM, PBKDF2 key stretching'), ('Unlock', 'PIN, Face ID, Touch ID or fingerprint')],
    site='https://zeroauth.in', site_label='zeroauth.in', support=('Support', 'mailto:support@zeroauth.in', 'support@zeroauth.in'),
  ),
  dict(
    slug='saifu', name='Saifu', icon='saifu.svg', tone='lime', job='Credit card advisor for India',
    title='Saifu: which credit card to use at checkout',
    desc='Saifu tells you which of your credit cards pays most for each purchase, and tracks fee waivers, caps, expiring points and lounge visits, on your phone.',
    headline='Which card at checkout. And what you are about to lose.',
    lede='Saifu tells you which of your cards pays most for this purchase. It also shows the fee waivers, monthly caps and points about to run out, and how many free lounge visits you have left.',
    actions=[('btn-ink', 'Visit saifu.in', 'https://saifu.in', True), ('btn-ghost', 'Find my best card', 'https://saifu.in/card-finder/', False)],
    status='Web tools live now. App coming soon.',
    hero=dict(kind='phone', src='saifu-answer.webp', alt='Saifu answering which card to use for an 800 rupee Swiggy order'),
    screens_title='Screens from the app',
    screens_lede='Swipe through the main screens. They use the app\'s sample wallet.',
    screens=[('saifu-home.webp', 'Home', 'Where you are paying, changes on your cards, what you earned and what was left on the table.'),
             ('saifu-answer.webp', 'Which card', 'The card that pays most for this spend, and what each of your other cards would give.'),
             ('saifu-spends.webp', 'Spends', 'Monthly bars and a category breakdown, for everyone or one person.'),
             ('saifu-wallet.webp', 'Wallet', 'Your cards, their rewards value and whether each fee waiver is on track.'),
             ('saifu-changes.webp', 'Card changes', 'What a bank\'s rule change costs you a year, and cards that would suit your spends better.'),
             ('saifu-subscriptions.webp', 'Subscriptions', 'Charges coming up, matched to your cards, with the monthly and yearly total.')],
    steps=[('Add your cards', 'Pick the cards you hold from 336 cards issued in India. No card numbers and no bank login.'),
           ('Say where you are paying', 'Type the shop and the amount, like Swiggy for 800 rupees.'),
           ('Use the card it picks', 'Saifu ranks your cards with their caps and exclusions, and shows what each one gives back.')],
    features=[('Which card?', 'Ranks your cards, or a family member\'s, for a shop and an amount.'),
              ('Fee waivers', 'Progress through each card year and how much to spend each month to get the fee back.'),
              ('Family wallet', 'Cards tagged by person. Rank across everyone or one person.'),
              ('Reward points', 'Balance, rupee value and expiry, with reminders 30 and 7 days before.'),
              ('Statement import', 'Read a PDF statement on the phone. Its password is asked once and never stored.'),
              ('Spends', 'Monthly totals, categories and rewards earned, for 3, 6 or 12 months.'),
              ('Foreign currency', 'The real cost on each card after markup and GST, and what it earns.'),
              ('Lounges and EMI', 'Free lounge visits left, an EMI calculator with GST, and an eligibility check.')],
    privacy_title='Your money stays private',
    privacy=[('On your phone', ['Your cards and spends', 'Statements, read on the phone', 'An encrypted backup file you control (AES-256-GCM)', 'Optional Face ID or fingerprint lock']),
             ('Never asked for', ['An account or sign-up', 'Card numbers', 'Your bank login', 'Statement passwords, which are never stored'])],
    note='Some cards link to an affiliate offer. Those links are labelled, and they are looked up only after your cards are ranked, so they never change the answer.',
    facts=[('Cards listed', '336 cards issued in India'), ('Account', 'None'), ('Platforms', 'iPhone and Android, plus free web tools at saifu.in')],
    site='https://saifu.in', site_label='saifu.in', support=('Privacy questions', 'mailto:privacy@saifu.in', 'privacy@saifu.in'),
  ),
  dict(
    slug='parchi', name='Parchi', icon='parchi.png', tone='sage', job='Family medical papers',
    title='Parchi: family medical papers on iPhone and Android',
    desc='Parchi reads and keeps your family\'s prescriptions, lab reports and hospital bills on your phone, with no account and no servers.',
    headline='Your family\'s medical papers, read and kept on your phone.',
    lede='Photograph a prescription, a lab report or a hospital bill. Parchi reads it on your phone, files it under the family member it belongs to, and gives you a one-page summary for the next doctor visit.',
    actions=[('btn-ink', 'Visit getparchi.com', 'https://getparchi.com', True)],
    status='Coming soon to the App Store and Google Play',
    hero=dict(kind='phone', src='parchi-papers.webp', alt='The Parchi Papers tab with a prescription that needs attention'),
    screens_title='Screens from the app',
    screens_lede='Swipe through the main screens, from the iPhone app with sample data.',
    screens=[('parchi-add.webp', 'Add a paper', 'Use the camera, pick from Photos or import a PDF.'),
             ('parchi-review.webp', 'Check what was read', 'Dates, clinic and medicines sit next to the photo. Correct anything before saving.'),
             ('parchi-papers.webp', 'Papers', 'Everything you scanned, searchable, with what needs attention first.'),
             ('parchi-health.webp', 'Health', 'Today\'s medicines and home readings for each person.'),
             ('parchi-lab-trends.webp', 'Lab results over time', 'Test values from your reports, shown as a trend.'),
             ('parchi-insurance.webp', 'Insurance', 'Health, life, travel and corporate policies, with the next renewal.'),
             ('parchi-family.webp', 'Family', 'One entry for each person, with their papers and policies together.'),
             ('parchi-card.webp', 'Health card', 'Blood group, allergies and who to call, as one page to show a doctor.')],
    steps=[('Photograph', 'Take a picture of a prescription, a report or a bill, or choose one from your photos.'),
           ('Check', 'Parchi reads the printed text on your phone and fills in dates, clinic and medicines. Correct anything before saving.'),
           ('Keep', 'The paper is filed under the right person, easy to search, with medicine reminders and a summary for the doctor.')],
    features=[('Reads printed papers', 'Dates, clinics, amounts, medicines and test values, pulled out for you to check.'),
              ('Import lab PDFs', 'Share a report PDF to Parchi from Files, Mail, Gmail or WhatsApp.'),
              ('Medicines and refills', 'Tick each dose and get a reminder before a supply may run out.'),
              ('Home readings', 'Blood pressure, sugar and weight for each person, as a simple chart.'),
              ('Every policy in one place', 'Policy numbers, nominees, renewal reminders and the policy papers.'),
              ('Insurance claim pack', 'One PDF of the papers for a hospital stay, with a checklist and the date to send it by.'),
              ('A summary for the doctor', 'One page of what matters, with the original scans attached if you want.'),
              ('English and Japanese', 'Every screen, reminder and health card in either language.')],
    privacy_title='Nothing leaves your phone',
    privacy=[('How it works', ['Papers are read on the phone: Apple Vision on iPhone, Google ML Kit on Android', 'Face ID, fingerprint or passcode lock', 'Backup to a file protected by your own password']),
             ('What it never has', ['An account to make', 'A server to sign in to', 'Analytics'])],
    note='Parchi never says whether a reading is good or bad, and the camera pulse check is an estimate, not a medical device.',
    facts=[('iPhone', 'iOS 17 or later'), ('Android', 'Android 7.0 or later'), ('Reads', 'Printed English, plus Hindi on Android')],
    site='https://getparchi.com', site_label='getparchi.com', support=('Support', 'mailto:support@getparchi.com', 'support@getparchi.com'),
  ),
  dict(
    slug='tegami', name='Tegami', icon='tegami.png', tone='pale', job='City-hall letters, for residents of Japan',
    title='Tegami: letters from city hall in Japan, explained in plain English',
    desc='Tegami tells you what a letter from a Japanese government office is, what you need to do, and by when, without the letter leaving your iPhone.',
    headline='Every letter from city hall, explained in plain English.',
    lede='Photograph a notice from the ward office, the pension service, the tax office or immigration. Tegami tells you what it is, what you need to do, and by when, without the letter ever leaving your phone.',
    actions=[('btn-ink', 'Visit Tegami', 'https://tegami.optionallabs.com', True)],
    status='Coming soon to the App Store',
    hero=dict(kind='icon'),
    screens_title='Letters Tegami explains',
    screens_lede='Common notices from Japanese offices, named and explained.',
    screens=[], kinds=['Resident tax', 'National Health Insurance', 'Pension', 'My Number', 'Immigration', 'Utilities'],
    steps=[('Photograph', 'Take a picture of the notice, on your iPhone.'),
           ('Read the explanation', 'What it is, what you need to do, and by when, with deadlines and amounts pulled out.'),
           ('Check it yourself', 'See the original and the exact text that was read, next to the explanation.')],
    features=[('What it is', 'Resident tax, National Health Insurance, pension, My Number, immigration and utilities, named and explained.'),
              ('What to do, and by when', 'Deadlines and amounts pulled out, with era dates like 令和8年 converted for you.'),
              ('Check it yourself', 'The original letter and the exact text that was read, beside the explanation.'),
              ('Shared with your family', 'Three letters free. Then ¥1,800 a year or ¥4,500 once, shared with your family.')],
    privacy_title='Nothing leaves your phone',
    privacy=[('On your iPhone', ['Your letters and their photos, encrypted on the device', 'Moved to a new iPhone only by your own encrypted backup']),
             ('What it never has', ['An account', 'A server', 'Analytics'])],
    note='Tegami has no accounts and no servers, so there is nothing to reset or recover online.',
    facts=[('Platform', 'iPhone'), ('Price', 'Three letters free, then ¥1,800 a year or ¥4,500 once'), ('Account', 'None')],
    site='https://tegami.optionallabs.com', site_label='tegami.optionallabs.com', support=('Support', 'https://tegami.optionallabs.com/support/', 'Tegami support'),
  ),
]

def chrome(part):
    m = re.search(r'  <%s class="(top|foot)".*?</%s>\n' % (part, part), idx, re.S).group(0)
    m = m.replace('href="./"', 'href="../"').replace('src="assets/', 'src="../assets/')
    m = re.sub(r'href="#(apps|how|contact)"', r'href="../#\1"', m)
    m = re.sub(r'href="(zeroauth|saifu|parchi|tegami)/"', r'href="../\1/"', m)
    m = m.replace('href="privacy-policy.html"', 'href="../privacy-policy.html"')
    return m

HEADER, FOOTER = chrome('header'), chrome('footer')

def actions(p):
    out = []
    for cls, label, href, arrow in p['actions']:
        out.append(f'<a class="btn {cls} btn-lg" href="{href}">{e(label)}{ARROW if arrow else ""}</a>')
    if p.get('badges'):
        imgs = {'app-store': ('', 'badge-app-store.svg', 135, 45, 'App Store'), 'google-play': (' gp', 'badge-google-play.png', 168, 65, 'Google Play')}
        bs = []
        for kind, href in p['badges']:
            cls, src, w, h, store = imgs[kind]
            verb = 'Download' if kind == 'app-store' else 'Get'
            bs.append(f'<a class="store-badge{cls}" href="{href}"><img src="../assets/img/{src}" alt="{verb} {e(p["name"])} on {store}" width="{w}" height="{h}"></a>')
        out.append('<span class="badges">' + ''.join(bs) + '</span>')
    return '\n            '.join(out)

def hero_art(p):
    h = p['hero']
    if h['kind'] == 'phone':
        return f'<div class="pd-art"><figure class="phone phone-lg"><img src="../assets/screens/{h["src"]}" alt="{e(h["alt"])}" width="560" height="1212"></figure></div>'
    if h['kind'] == 'wide':
        return f'<div class="pd-art"><img class="pd-wide" src="../assets/screens/{h["src"]}" alt="{e(h["alt"])}" width="{h["w"]}" height="{h["h"]}"></div>'
    return f'<div class="pd-art pd-art-icon"><img src="../assets/img/{p["icon"]}" alt="" width="192" height="192"></div>'

def screens(p):
    if p['screens']:
        items = '\n'.join(
            f'''          <li class="shot">
            <figure>
              <div class="phone"><img src="../assets/screens/{src}" alt="{e(t)}: {e(c)}" width="560" height="1212" loading="lazy"></div>
              <figcaption><strong>{e(t)}</strong>{e(c)}</figcaption>
            </figure>
          </li>''' for src, t, c in p['screens'])
        return f'''        <div class="gallery" data-gallery>
          <div class="gallery-nav" data-gallery-nav hidden>
            <button class="gnav" type="button" data-dir="-1" aria-label="Previous screen"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <button class="gnav" type="button" data-dir="1" aria-label="Next screen"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          </div>
          <ol class="shots" tabindex="0" aria-label="{e(p["name"])} screens">
{items}
          </ol>
        </div>'''
    if p.get('wide'):
        w = p['wide']
        return f'        <img class="pd-wide pd-wide-lg" src="../assets/screens/{w["src"]}" alt="{e(w["alt"])}" width="{w["w"]}" height="{w["h"]}" loading="lazy">'
    chips = ''.join(f'<li>{e(k)}</li>' for k in p['kinds'])
    return f'        <ul class="kinds">{chips}</ul>\n        <p class="pd-note">Screens will appear here when Tegami reaches the App Store.</p>'

OS = {'zeroauth': 'iOS, Android', 'saifu': 'iOS, Android', 'parchi': 'iOS 17+, Android 7.0+', 'tegami': 'iOS'}
CATEGORY = {'zeroauth': 'SecurityApplication', 'saifu': 'FinanceApplication', 'parchi': 'HealthApplication', 'tegami': 'UtilitiesApplication'}

def ld(p):
    data = {
        '@context': 'https://schema.org', '@type': 'MobileApplication',
        'name': p['name'], 'description': p['desc'], 'url': f"https://optionallabs.com/{p['slug']}/",
        'sameAs': p['site'], 'applicationCategory': CATEGORY[p['slug']], 'operatingSystem': OS[p['slug']],
        'image': f"https://optionallabs.com/assets/img/{p['icon']}",
        'publisher': {'@type': 'Organization', 'name': 'Optional Labs', 'url': 'https://optionallabs.com/'},
    }
    return json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')

def page(p):
    steps = '\n'.join(f'          <li><span class="step-n" aria-hidden="true">{i}</span><h3>{e(t)}</h3><p>{e(d)}</p></li>' for i, (t, d) in enumerate(p['steps'], 1))
    feats = '\n'.join(f'          <li>{CHECK}<div><h3>{e(t)}</h3><p>{e(d)}</p></div></li>' for t, d in p['features'])
    priv = '\n'.join(f'''          <div class="pcol">
            <h3>{e(t)}</h3>
            <ul>{''.join(f'<li>{e(x)}</li>' for x in xs)}</ul>
          </div>''' for t, xs in p['privacy'])
    facts = '\n'.join(f'            <div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k, v in p['facts'])
    others = '\n'.join(f'          <li><a href="../{o["slug"]}/"><img src="../assets/img/{o["icon"]}" alt="" width="56" height="56" loading="lazy">{o["name"]}</a></li>' for o in PRODUCTS if o is not p)
    sl, sh, st = p['support']
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(p["title"])} | Optional Labs</title>
  <meta name="description" content="{e(p["desc"])}">
  <link rel="canonical" href="https://optionallabs.com/{p["slug"]}/">
  <meta name="theme-color" content="#ffffff">
  <link rel="icon" type="image/png" sizes="32x32" href="../assets/img/icon-32.png">
  <link rel="apple-touch-icon" href="../assets/img/icon-180.png">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://optionallabs.com/{p["slug"]}/">
  <meta property="og:title" content="{e(p["name"])} by Optional Labs">
  <meta property="og:description" content="{e(p["desc"])}">
  <meta property="og:image" content="https://optionallabs.com/assets/og/{p["slug"]}.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">{ld(p)}</script>
  <link rel="preload" href="../assets/fonts/inter-latin-900-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="../assets/css/site.css">
  <script>document.documentElement.classList.add('js')</script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>

{HEADER}
  <main id="main">
    <section class="pd-hero pd-{p["tone"]}" aria-labelledby="pd-title">
      <div class="wrap pd-hero-in">
        <div class="pd-copy">
          <a class="pd-back" href="../#apps"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15 10H5m4-4-4 4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>All apps</a>
          <div class="pd-id"><img class="app-icon" src="../assets/img/{p["icon"]}" alt="" width="72" height="72"><div><p class="pd-name">{e(p["name"])}</p><p class="pd-job">{e(p["job"])}</p></div></div>
          <h1 class="pd-title" id="pd-title">{e(p["headline"])}</h1>
          <p class="pd-lede">{e(p["lede"])}</p>
          <div class="app-actions">
            {actions(p)}
          </div>
          <p class="pd-status">{e(p["status"])}</p>
        </div>
        {hero_art(p)}
      </div>
    </section>

    <section class="pd-section wrap" aria-label="The problem and what we fixed">
      <dl class="pf pf-big">
        <div class="pf-row pf-problem"><dt>The problem</dt><dd>{e(PF[p["slug"]][0])}</dd></div>
        <div class="pf-row pf-fix"><dt>What we fixed</dt><dd>{e(PF[p["slug"]][1])}</dd></div>
      </dl>
    </section>

    <section class="pd-section wrap" aria-labelledby="screens-title">
      <div class="section-head">
        <h2 class="display h2" id="screens-title">{e(p["screens_title"])}</h2>
        <p class="lede">{e(p["screens_lede"])}</p>
      </div>
{screens(p)}
    </section>

    <section class="pd-section pd-steps-wrap" aria-labelledby="how-title">
      <div class="wrap">
        <h2 class="display h2" id="how-title">How it works</h2>
        <ol class="pd-steps">
{steps}
        </ol>
      </div>
    </section>

    <section class="pd-section wrap" aria-labelledby="features-title">
      <h2 class="display h2" id="features-title">What you get</h2>
      <ul class="pd-features">
{feats}
      </ul>
    </section>

    <section class="pd-section wrap" aria-labelledby="privacy-title">
      <div class="pd-privacy pd-{p["tone"]}">
        <h2 class="display" id="privacy-title">{e(p["privacy_title"])}</h2>
        <div class="pcols">
{priv}
        </div>
        <p class="pd-privacy-note">{e(p["note"])}</p>
      </div>
    </section>

    <section class="pd-section wrap" aria-labelledby="get-title">
      <div class="pd-get">
        <div>
          <h2 class="display" id="get-title">Get {e(p["name"])}</h2>
          <p class="pd-status">{e(p["status"])}</p>
          <dl class="pd-facts">
{facts}
          </dl>
        </div>
        <div class="pd-get-actions">
          <a class="btn btn-lime btn-lg" href="{p["site"]}">Visit {e(p["site_label"])}{ARROW}</a>
          <a class="pd-support" href="{sh}">{e(sl)}: {e(st)}</a>
        </div>
      </div>
    </section>

    <section class="close wrap" aria-labelledby="others-title">
      <div class="close-in close-sage">
        <h2 class="display" id="others-title">More from Optional Labs</h2>
        <ul class="close-apps close-3">
{others}
        </ul>
      </div>
    </section>
  </main>

{FOOTER}
  <script src="../assets/js/site.js" defer></script>
</body>
</html>
'''

for p in PRODUCTS:
    d = ROOT / p['slug']; d.mkdir(exist_ok=True)
    (d / 'index.html').write_text(page(p))
    print('wrote', d / 'index.html')
