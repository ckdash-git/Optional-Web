#!/usr/bin/env python3
"""Build the company pages that share the homepage header and footer:
privacy-policy.html, privacy-policy-optional-app.html and about/index.html.

Run from anywhere:  python3 tools/build-pages.py
Change the header or footer in index.html first; this copies them.
The Optional app policy text is kept verbatim in tools/legacy-optional-app-policy.html.
"""
import datetime, pathlib, re, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from products import PRODUCTS

ROOT = pathlib.Path(__file__).resolve().parent.parent
SLUGS = '|'.join([p['slug'] for p in PRODUCTS] + ['about', 'careers', 'enquire'])
idx = (ROOT / 'index.html').read_text()


def chrome(tag, cls):
    m = re.search(r'  <%s class="%s".*?</%s>\n' % (tag, cls, tag), idx, re.S).group(0)
    return re.sub(r'<!-- /?gen:[a-z-]+ -->\n?\s*', '', m)


HEADER, FOOTER = chrome('header', 'top'), chrome('footer', 'foot')


def root_level(x):
    return re.sub(r'href="#(apps|how|contact)"', r'href="./#\1"', x)


def depth1(x):
    x = x.replace('href="./"', 'href="../"').replace('src="assets/', 'src="../assets/')
    x = re.sub(r'href="#(apps|how|contact)"', r'href="../#\1"', x)
    x = re.sub(r'href="(%s)/"' % SLUGS, r'href="../\1/"', x)
    return x.replace('href="privacy-policy.html"', 'href="../privacy-policy.html"').replace('href="manage-account.html"', 'href="../manage-account.html"')


BASE_CSP = ("default-src 'self'; script-src 'self' 'sha256-Du+OJKJSbdUgz5nrHeWWINvez6XKDDU/tyj/5c2uvwo='; "
            "style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; "
            "base-uri 'self'; form-action 'none'; upgrade-insecure-requests")

# The account page signs in to the Optional app's Firebase project, so it also allows
# Firebase's SDK, Google and Apple sign-in windows and Firebase's APIs. No other page does.
FIREBASE = '10.14.1'
ACCOUNT_CSP = ("default-src 'self'; script-src 'self' 'sha256-Du+OJKJSbdUgz5nrHeWWINvez6XKDDU/tyj/5c2uvwo=' "
               "https://www.gstatic.com https://apis.google.com; style-src 'self'; "
               "img-src 'self' data: https://*.googleusercontent.com; font-src 'self'; "
               "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com "
               "https://firestore.googleapis.com https://www.googleapis.com; "
               "frame-src https://optional-25cd8.firebaseapp.com https://accounts.google.com https://appleid.apple.com; "
               "object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests")


def page(title, desc, canon, og, prefix, main, wrap, csp=BASE_CSP, scripts='', robots=''):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="{csp}">
  <meta name="referrer" content="strict-origin-when-cross-origin">{robots}
  <title>{title}</title>
  <meta name="description" content="{desc}">
  {f'<link rel="canonical" href="https://optionallabs.com/{canon}">' if canon is not None else ''}
  <meta name="theme-color" content="#ffffff">
  <link rel="icon" type="image/png" sizes="32x32" href="{prefix}assets/img/icon-32.png">
  <link rel="apple-touch-icon" href="{prefix}assets/img/icon-180.png">
  <meta property="og:type" content="website">
  {f'<meta property="og:url" content="https://optionallabs.com/{canon}">' if canon is not None else ''}
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="https://optionallabs.com/assets/og/{og}.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="{prefix}assets/css/site.css">
  <script>document.documentElement.classList.add('js')</script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>

{wrap(HEADER)}
{main}

{wrap(FOOTER)}
  <script src="{prefix}assets/js/site.js" defer></script>{scripts}
</body>
</html>
'''


POLICY_LINKS = '\n'.join(f'        <li><a href="{p["policy"]}">{p["name"]} privacy policy</a></li>' for p in PRODUCTS)

PRIVACY = '''  <main id="main" class="wrap legal">
    <article class="legal-in">
      <h1>Privacy policy</h1>
      <p>Effective 31 October 2026. Publisher: Optional Labs LLP (LLPIN ADD-5789), registered office Kotpad, Koraput Dist, Odisha, India, 764058.</p>

      <h2>Summary</h2>
      <p>This website does not use analytics, advertising or tracking. Its only sign-in is the account page for the earlier Optional app. Each Optional Labs app has its own privacy policy, linked below, which says exactly what that app stores and where.</p>

      <h2>Our apps</h2>
      <p>Each Optional Labs app has its own privacy policy, which says exactly what that app stores, where it keeps it and what leaves your device. Read the one for the app you use:</p>
      <ul>
{POLICY_LINKS}
      </ul>
      <p>For the earlier Optional app (job referral requests), see the <a href="privacy-policy-optional-app.html">Optional app privacy policy</a>.</p>

      <h2>This website</h2>
      <ul>
        <li>No analytics, advertising or tracking scripts.</li>
        <li>Fonts, images and scripts are served from this website itself, not from third parties, except on the account page described below.</li>
      </ul>

      <h2>Account page for the Optional app</h2>
      <p>The <a href="manage-account.html">account page</a> lets people with an account in the earlier Optional app sign in, sign out and delete that account. It uses Google Firebase, the same service the app uses, to sign you in with email and password, Google or Apple. Firebase keeps your sign-in session in your browser's storage until you sign out. When you delete your account there, we delete your Optional account and the profile stored with it (name, email, photo and sign-in details). If you cannot sign in, email us from the address on your account and we will delete it for you. The rest of this website loads nothing from Firebase.</p>
      <p>The site is hosted on GitHub Pages. Like any web host, GitHub may record technical information such as your IP address when you visit, to run and protect its service. That is covered by <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub's privacy statement</a>. We do not receive or use those records.</p>

      <h2>When you email us</h2>
      <p>If you write to us, we use your email address and message only to reply to you, and keep them only as long as needed for that.</p>

      <h2>Job applications</h2>
      <p>If you write to <a href="mailto:career@optionallabs.com">career@optionallabs.com</a>, we use your message and anything you attach only to consider you for a role and to reply. We keep it for as long as that needs, and delete it when you ask us to. The careers page opens your own email app; it sends nothing itself.</p>

      <h2>Enquiries</h2>
      <p>The enquiry page asks for your name, phone number, what you need and a short message. We use them only to reply and to prepare a quote, and we delete them when you ask. The page opens WhatsApp (or your own email app) with the message filled in; what you send through WhatsApp is also covered by WhatsApp\'s own terms. If we connect it to our customer records, the same details are also saved there, and this policy will say so.</p>

      <h2>Children</h2>
      <p>This website is not directed at children under 13 and collects no data from anyone.</p>

      <h2>Changes and contact</h2>
      <p>Changes to this policy will be posted on this page with a new effective date. Questions or complaints about privacy: <a href="mailto:contact@optionallabs.com">contact@optionallabs.com</a>, or write to Optional Labs LLP, Kotpad, Koraput Dist, Odisha, India, 764058.</p>
    </article>
  </main>'''

PRIVACY = PRIVACY.replace('{POLICY_LINKS}', POLICY_LINKS)

ABOUT_APPS = '\n'.join(
    f'        <li><a href="../{p["slug"]}/"><img src="../assets/img/{p["icon"]}" alt="" width="64" height="64"><span><strong>{p["name"]}</strong>{p["job"]}. {p["status"].split(". ")[0].rstrip(".")}.</span></a></li>'
    for p in PRODUCTS)

ABOUT = '''  <main id="main">
    <section class="pd-hero pd-ink" aria-labelledby="about-title">
      <div class="wrap about-hero">
        <h1 class="pd-title" id="about-title">Small apps that keep your data with you.</h1>
        <p class="pd-lede">Optional Labs LLP is a small company in India. We make apps for everyday life: sign-in codes, credit cards, medical papers, government letters, travel stamps, job search, remote access to your Mac, and sleep and recovery.</p>
      </div>
    </section>

    <section class="pd-section wrap" aria-labelledby="why-title">
      <div class="section-head">
        <h2 class="display h2" id="why-title">Why we build this way</h2>
        <p class="lede">The things these apps handle are personal. We think they belong with you, not on our servers.</p>
      </div>
      <ul class="pd-features">
        <li><span class="tick" aria-hidden="true"></span><div><h3>On your device first</h3><p>Each app reads, stores and works on your own device. What you put in stays there unless you choose to export it, share it or turn on an extra feature.</p></div></li>
        <li><span class="tick" aria-hidden="true"></span><div><h3>One job each</h3><p>Every app does one everyday job well, so it is easy to understand and easy to trust.</p></div></li>
        <li><span class="tick" aria-hidden="true"></span><div><h3>Show our work</h3><p>Where an app reads a paper or a letter, it shows the original next to what it read, so you can check it.</p></div></li>
        <li><span class="tick" aria-hidden="true"></span><div><h3>Plain words</h3><p>Short sentences, real numbers and no fine print you have to decode.</p></div></li>
      </ul>
    </section>

    <section class="pd-section wrap" aria-labelledby="apps-title">
      <h2 class="display h2" id="apps-title">What we make</h2>
      <ul class="about-apps">
{ABOUT_APPS}
      </ul>
    </section>

    <section class="pd-section wrap" aria-labelledby="company-title">
      <div class="pd-get">
        <div>
          <h2 class="display" id="company-title">Company</h2>
          <dl class="pd-facts">
            <div><dt>Legal name</dt><dd>Optional Labs LLP</dd></div>
            <div><dt>LLPIN</dt><dd>ADD-5789</dd></div>
            <div><dt>Registered office</dt><dd>Kotpad, Koraput Dist, Odisha, India, 764058</dd></div>
            <div><dt>Contact</dt><dd><a href="mailto:contact@optionallabs.com">contact@optionallabs.com</a></dd></div>
          </dl>
        </div>
        <div class="pd-get-actions">
          <a class="btn btn-coral btn-lg" href="mailto:contact@optionallabs.com">Write to us</a>
          <a class="pd-support" href="../privacy-policy.html">Privacy policy</a>
        </div>
      </div>
    </section>
  </main>'''

ACCOUNT = '''  <main id="main" class="wrap account">
    <div class="account-in">
      <h1 class="display account-title">Your Optional account</h1>
      <p class="lede">Sign in to see your account for the Optional app, sign out, or delete your account and its data.</p>

      <p class="acct-status" role="status" aria-live="polite" data-status hidden></p>

      <section class="acct-card" data-state="loading" aria-label="Checking sign-in">
        <p class="acct-muted">Checking whether you are signed in…</p>
        <noscript><p>This page needs JavaScript to sign in. To delete your account without signing in, email <a href="mailto:contact@optionallabs.com?subject=Delete%20my%20Optional%20account">contact@optionallabs.com</a> from the address on your account.</p></noscript>
      </section>

      <section class="acct-card" data-state="unavailable" hidden aria-label="Sign-in unavailable">
        <p>Sign-in could not load. Check your connection and reload the page, or email <a href="mailto:contact@optionallabs.com?subject=Delete%20my%20Optional%20account">contact@optionallabs.com</a> from the address on your account and we will delete it for you.</p>
      </section>

      <section class="acct-card" data-state="signed-out" hidden aria-labelledby="signin-title">
        <h2 id="signin-title">Sign in</h2>
        <p class="acct-muted">Use the same method you use in the Optional app.</p>
        <div class="acct-providers">
          <button class="btn btn-sage btn-lg" type="button" data-provider="google">Continue with Google</button>
          <button class="btn btn-sage btn-lg" type="button" data-provider="apple">Continue with Apple</button>
        </div>
        <p class="acct-or"><span>or with email</span></p>
        <form id="signin-form" class="acct-form" novalidate>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required>
          <label for="password">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required>
          <div class="acct-actions">
            <button class="btn btn-coral btn-lg" type="submit">Sign in</button>
            <button class="acct-link" id="reset" type="button">Reset password</button>
          </div>
        </form>
      </section>

      <section class="acct-card" data-state="signed-in" hidden aria-labelledby="account-title">
        <h2 id="account-title">Signed in</h2>
        <dl class="pd-facts acct-facts">
          <div><dt>Email</dt><dd data-email></dd></div>
          <div><dt>Signed in with</dt><dd data-method></dd></div>
          <div><dt>Account created</dt><dd data-created></dd></div>
          <div><dt>Last sign-in</dt><dd data-last></dd></div>
        </dl>
        <button class="btn btn-sage" type="button" id="signout">Sign out</button>

        <div class="acct-danger">
          <h2>Delete account</h2>
          <p>This permanently deletes your Optional account and the profile stored with it: your name, email, photo and sign-in details. You will not be able to sign in again with this account. This cannot be undone.</p>
          <button class="btn btn-danger" type="button" id="delete-start">Delete my account</button>
          <div id="delete-confirm" hidden>
            <form id="delete-form" class="acct-form" novalidate>
              <label for="confirm-email">To confirm, type the email address on this account</label>
              <input id="confirm-email" name="confirm-email" type="email" autocomplete="off" required>
              <div class="acct-actions">
                <button class="btn btn-danger" type="submit">Permanently delete</button>
                <button class="acct-link" id="delete-cancel" type="button">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section class="acct-card acct-done" data-state="deleted" hidden aria-labelledby="deleted-title">
        <h2 id="deleted-title">Your account is deleted</h2>
        <p>Your Optional account and its profile have been removed. You can close this page.</p>
        <a class="btn btn-coral" href="./">Back to Optional Labs</a>
      </section>

      <aside class="acct-help" aria-labelledby="help-title">
        <h2 id="help-title">Can't sign in?</h2>
        <p>Email <a href="mailto:contact@optionallabs.com?subject=Delete%20my%20Optional%20account">contact@optionallabs.com</a> from the address on your account and ask us to delete it. We will delete the account and its data and reply to confirm.</p>
        <p>This page is for the Optional app. ZeroAuth, Saifu, Parchi and Tegami have their own settings and support. See the <a href="privacy-policy-optional-app.html">Optional app privacy policy</a>.</p>
      </aside>
    </div>
  </main>'''


def absolute(x):
    x = re.sub(r'href="#(apps|how|contact)"', r'href="/#\1"', x).replace('href="./"', 'href="/"').replace('src="assets/', 'src="/assets/')
    x = re.sub(r'href="(%s)/"' % SLUGS, r'href="/\1/"', x)
    return re.sub(r'href="(privacy-policy|manage-account)\.html"', r'href="/\1.html"', x)


NOTFOUND = '''  <main id="main" class="wrap legal">
    <div class="legal-in">
      <h1>This page is not on our phone, or yours.</h1>
      <p>The address may be old or mistyped. Every Optional Labs app is one tap away from the homepage.</p>
      <p><a class="btn btn-coral btn-lg" href="/">Go to the homepage</a></p>
    </div>
  </main>'''


def redirect(to, title):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0; url={to}">
  <link rel="canonical" href="https://optionallabs.com/{to}">
  <title>{title} | Optional Labs</title>
</head>
<body>
  <p>This page has moved to <a href="{to}">{title}</a>.</p>
</body>
</html>
'''

ABOUT = ABOUT.replace('{ABOUT_APPS}', ABOUT_APPS)

# Open roles: add one tuple per real opening, then rebuild. (title, where, what you would do)
# The page says no roles are listed while this is empty. Do not invent roles.
ROLES = []

AREAS = ['Engineering', 'Design', 'Product', 'Writing and support', 'Sales and partnerships', 'Something else']


def roles_html():
    if not ROLES:
        return '''      <div class="role-empty">
        <h3>No roles are listed right now.</h3>
        <p>We still like hearing from people who could help. Tell us what you would work on and send a link to something you built.</p>
        <a class="btn btn-ink" href="#apply">Write to us</a>
      </div>'''
    cards = '\n'.join(
        f'''        <li class="role"><h3>{t}</h3><p class="role-meta">{w}</p><p>{d}</p><a class="btn btn-ink" href="mailto:career@optionallabs.com?subject=Application%3A%20{t.replace(" ", "%20")}">Apply by email</a></li>'''
        for t, w, d in ROLES)
    return f'      <ul class="roles">\n{cards}\n      </ul>'


def careers_main():
    options = ''.join(f'<option>{a}</option>' for a in AREAS)
    return f'''  <main id="main">
    <section class="pd-hero pd-ink" aria-labelledby="careers-title">
      <div class="wrap about-hero">
        <h1 class="pd-title" id="careers-title">Come build small apps with us.</h1>
        <p class="pd-lede">Optional Labs LLP is a small company in India that makes eight apps for phones and computers. If you want to help build them, write to <a class="pd-mail" href="mailto:career@optionallabs.com">career@optionallabs.com</a>.</p>
        <div class="hero-cta"><a class="btn btn-coral btn-lg" href="#apply">Write to us</a></div>
      </div>
    </section>

    <section class="pd-section wrap" aria-labelledby="roles-title">
      <h2 class="display h2" id="roles-title">Open roles</h2>
{roles_html()}
    </section>

    <section class="pd-section wrap" aria-labelledby="work-title">
      <div class="section-head">
        <h2 class="display h2" id="work-title">What you would work on</h2>
        <p class="lede">Pick the app that interests you most, and tell us why when you write.</p>
      </div>
      <ul class="about-apps">
{ABOUT_APPS}
      </ul>
    </section>

    <section class="pd-section wrap" aria-labelledby="how-title">
      <h2 class="display h2" id="how-title">How we build</h2>
      <ul class="pd-features">
        <li><span class="tick" aria-hidden="true"></span><div><h3>Small and focused</h3><p>Each app does one everyday job, so it can be understood, finished and trusted.</p></div></li>
        <li><span class="tick" aria-hidden="true"></span><div><h3>Honest about data</h3><p>What an app sends off your device is written down, and the websites claim only what the apps do.</p></div></li>
        <li><span class="tick" aria-hidden="true"></span><div><h3>Built to be checked</h3><p>Where an app reads a paper or a letter, it shows the original beside what it read.</p></div></li>
        <li><span class="tick" aria-hidden="true"></span><div><h3>Plain words</h3><p>Short sentences and real numbers, on the screen and in the code comments.</p></div></li>
      </ul>
    </section>

    <section class="pd-section wrap" id="apply" aria-labelledby="apply-title">
      <div class="apply">
        <div>
          <h2 class="display" id="apply-title">Write to us</h2>
          <p class="lede">Tell us who you are, link to something you built, and say what you would like to work on.</p>
          <p class="apply-note">Prefer your own email app? Write to <a href="mailto:career@optionallabs.com">career@optionallabs.com</a> and attach your CV.</p>
        </div>
        <form class="form" id="apply-form" novalidate data-mailto="career@optionallabs.com">
          <p class="form-status" role="status" aria-live="polite" data-status hidden></p>
          <div class="field"><label for="a-name">Your name</label><input id="a-name" name="name" type="text" autocomplete="name" required></div>
          <div class="field"><label for="a-area">Area you could help with</label><select id="a-area" name="area">{options}</select><p class="form-hint">Engineering covers iOS, Android, web and backend.</p></div>
          <div class="field"><label for="a-link">Link to your work</label><input id="a-link" name="link" type="url" inputmode="url" autocomplete="url" placeholder="GitHub, portfolio, an app, writing"></div>
          <div class="field"><label for="a-note">A few lines about you</label><textarea id="a-note" name="message" rows="5" required></textarea></div>
          <button class="btn btn-coral btn-lg" type="submit">Open email draft</button>
          <p class="form-hint">This opens your email app with the message filled in, addressed to career@optionallabs.com. Nothing is sent from this page, and a web page cannot attach files, so add your CV in the email.</p>
        </form>
      </div>
      <p class="pd-note">We use what you send only to consider you for a role and to reply. Ask us to delete it and we will. See the <a href="../privacy-policy.html">privacy policy</a>.</p>
    </section>
  </main>'''



INTERESTS = ['A business website', 'A CRM for my business', 'A customer portal', 'Payments, WhatsApp or other connections', 'Help choosing', 'Something else']

# Set either to switch on that channel: a Google Apps Script web-app URL (see the kit's developer playbook) and a WhatsApp number with country code.
CRM_ENDPOINT = ''
WHATSAPP = '917090702100'

ENQUIRE_CSP = BASE_CSP.replace("connect-src 'self'", "connect-src 'self' https://script.google.com https://script.googleusercontent.com")


def enquire_main():
    options = ''.join(f'<option>{a}</option>' for a in INTERESTS)
    return f'''  <main id="main">
    <section class="pd-hero pd-ink" aria-labelledby="enq-title">
      <div class="wrap about-hero">
        <h1 class="pd-title" id="enq-title">Tell us what you need built.</h1>
        <p class="pd-lede">Optional Labs LLP also builds websites, CRMs and customer portals for businesses in India. Say what you have in mind and we will reply with a plan and a price.</p>
        <div class="hero-cta"><a class="btn btn-coral btn-lg" href="#enquire">Send an enquiry</a></div>
      </div>
    </section>

    <section class="pd-section wrap" id="enquire" aria-labelledby="enq-form-title">
      <div class="apply">
        <div>
          <h2 class="display" id="enq-form-title">Send an enquiry</h2>
          <p class="lede">A name, a phone number and a few lines are enough to start.</p>
          <ul class="enq-steps">
            <li><strong>1. You write.</strong> Say what the business does and what you want.</li>
            <li><strong>2. We reply.</strong> Within two working days, with questions or a plan.</li>
            <li><strong>3. You decide.</strong> A written scope and price first. No commitment from an enquiry.</li>
          </ul>
          <p class="apply-note">Prefer email? Write to <a href="mailto:contact@optionallabs.com">contact@optionallabs.com</a>.</p>
        </div>
        <form class="form" id="enquire-form" novalidate data-mailto="contact@optionallabs.com" data-crm="{CRM_ENDPOINT}" data-wa="{WHATSAPP}">
          <p class="form-status" role="status" aria-live="polite" data-status hidden></p>
          <div class="field"><label for="e-name">Your name</label><input id="e-name" name="name" type="text" autocomplete="name" required></div>
          <div class="field"><label for="e-phone">Phone number</label><input id="e-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="With country code if outside India" required></div>
          <div class="field"><label for="e-interest">What do you need?</label><select id="e-interest" name="interest">{options}</select></div>
          <div class="field"><label for="e-msg">A few lines about it</label><textarea id="e-msg" name="message" rows="5" required></textarea></div>
          <button class="btn btn-coral btn-lg" type="submit">{'Send on WhatsApp' if WHATSAPP else 'Open email draft'}</button>
          <p class="form-hint">{'This opens WhatsApp with your message filled in, and WhatsApp\'s own terms apply to what you send there.' if WHATSAPP else 'This opens your email app with the message filled in, addressed to contact@optionallabs.com.'} Your details go only to us.</p>
        </form>
      </div>
      <p class="pd-note">We use what you send only to reply to your enquiry and to prepare a quote. Ask us to delete it and we will. See the <a href="../privacy-policy.html">privacy policy</a>.</p>
    </section>
  </main>'''


def main():
    legacy = (ROOT / 'tools/legacy-optional-app-policy.html').read_text()
    (ROOT / 'privacy-policy.html').write_text(page(
        'Privacy policy | Optional Labs',
        "How Optional Labs and this website handle your data, with links to each app's own privacy policy.",
        'privacy-policy.html', 'home', '', PRIVACY, root_level))
    (ROOT / 'privacy-policy-optional-app.html').write_text(page(
        'Privacy policy for the Optional app | Optional Labs',
        'Privacy policy for the earlier Optional app (job referral requests).',
        'privacy-policy-optional-app.html', 'home', '',
        f'''  <main id="main" class="wrap legal">
    <article class="legal-in">
      <p class="legal-note">This is the policy for the earlier Optional app (job referral requests), kept here unchanged for that app. For this website and the current apps, see the <a href="privacy-policy.html">Optional Labs privacy policy</a>.</p>{legacy}    </article>
  </main>''', root_level))
    (ROOT / 'careers').mkdir(exist_ok=True)
    (ROOT / 'careers/index.html').write_text(page(
        'Careers | Optional Labs', 'Work with Optional Labs LLP, a small company in India making eight apps for phones and computers. Write to career@optionallabs.com.',
        'careers/', 'careers', '../', careers_main(), depth1, scripts='\n  <script src="../assets/js/careers.js" defer></script>'))
    (ROOT / 'enquire').mkdir(exist_ok=True)
    (ROOT / 'enquire/index.html').write_text(page(
        'Enquire | Optional Labs', 'Ask Optional Labs LLP to build your business website, CRM or customer portal. Send a name, a phone number and a few lines.',
        'enquire/', 'enquire', '../', enquire_main(), depth1, csp=ENQUIRE_CSP, scripts='\n  <script src="../assets/js/enquire.js" defer></script>'))
    (ROOT / 'about').mkdir(exist_ok=True)
    (ROOT / 'about/index.html').write_text(page(
        'About Optional Labs',
        'Optional Labs LLP is a small company in India making small apps that keep your data with you.',
        'about/', 'about', '../', ABOUT, depth1))
    sdk = ''.join(f'\n  <script src="https://www.gstatic.com/firebasejs/{FIREBASE}/firebase-{m}-compat.js" defer></script>' for m in ('app', 'auth', 'firestore'))
    (ROOT / 'manage-account.html').write_text(page(
        'Manage your Optional account | Optional Labs',
        'Sign in to your Optional app account to see it, sign out, or delete your account and its data.',
        'manage-account.html', 'home', '', ACCOUNT, root_level,
        csp=ACCOUNT_CSP, scripts=sdk + '\n  <script src="assets/js/account.js" defer></script>',
        robots='\n  <meta name="robots" content="noindex">'))
    (ROOT / '404.html').write_text(page(
        'Page not found | Optional Labs', 'This page does not exist. Every Optional Labs app is one tap away from the homepage.',
        None, 'home', '/', NOTFOUND, absolute, robots='\n  <meta name="robots" content="noindex">'))
    # Old account URLs from the earlier site, including any given to app stores, land on the account page.
    for old in ('login.html', 'registration-html.html', 'welcome.html', 'dashboard.html'):
        (ROOT / old).write_text(redirect('manage-account.html', 'Manage your Optional account'))
    write_sitemap()
    print('wrote privacy-policy.html, privacy-policy-optional-app.html, about/index.html, manage-account.html, 404.html and redirects')


def write_sitemap():
    """List every public page: the homepage, each folder with an index.html, and the privacy policies."""
    urls = ['']
    urls += sorted(d.name + '/' for d in ROOT.iterdir() if d.is_dir() and (d / 'index.html').exists() and d.name not in ('assets', 'tools'))
    urls += ['privacy-policy.html', 'privacy-policy-optional-app.html']
    today = datetime.date.today().isoformat()
    body = ''.join(f'  <url><loc>https://optionallabs.com/{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls)
    (ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '</urlset>\n')


if __name__ == '__main__':
    main()
