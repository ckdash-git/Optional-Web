#!/usr/bin/env python3
"""Build the company pages that share the homepage header and footer:
privacy-policy.html, privacy-policy-optional-app.html and about/index.html.

Run from anywhere:  python3 tools/build-pages.py
Change the header or footer in index.html first; this copies them.
The Optional app policy text is kept verbatim in tools/legacy-optional-app-policy.html.
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
idx = (ROOT / 'index.html').read_text()
HEADER = re.search(r'  <header class="top" id="top">.*?</header>\n', idx, re.S).group(0)
FOOTER = re.search(r'  <footer class="foot".*?</footer>\n', idx, re.S).group(0)


def root_level(x):
    return re.sub(r'href="#(apps|how|contact)"', r'href="./#\1"', x)


def depth1(x):
    x = x.replace('href="./"', 'href="../"').replace('src="assets/', 'src="../assets/')
    x = re.sub(r'href="#(apps|how|contact)"', r'href="../#\1"', x)
    x = re.sub(r'href="(zeroauth|saifu|parchi|tegami|about)/"', r'href="../\1/"', x)
    return x.replace('href="privacy-policy.html"', 'href="../privacy-policy.html"')


def page(title, desc, canon, og, prefix, main, wrap):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'sha256-Du+OJKJSbdUgz5nrHeWWINvez6XKDDU/tyj/5c2uvwo='; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="https://optionallabs.com/{canon}">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0e110c" media="(prefers-color-scheme: dark)">
  <link rel="icon" type="image/png" sizes="32x32" href="{prefix}assets/img/icon-32.png">
  <link rel="apple-touch-icon" href="{prefix}assets/img/icon-180.png">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://optionallabs.com/{canon}">
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
  <script src="{prefix}assets/js/site.js" defer></script>
</body>
</html>
'''


PRIVACY = '''  <main id="main" class="wrap legal">
    <article class="legal-in">
      <h1>Privacy policy</h1>
      <p>Effective 10 October 2026. Publisher: Optional Labs (Chandan Kumar Dash), Bengaluru, India.</p>

      <h2>Summary</h2>
      <p>This website does not use cookies, analytics, advertising or tracking, and has no forms or sign-in. Each Optional Labs app has its own privacy policy, linked below, which says exactly what that app stores and where.</p>

      <h2>Our apps</h2>
      <p>Each app keeps what you put into it on your phone. Read the policy for the app you use:</p>
      <ul>
        <li><a href="https://zeroauth.in/legal/privacy-policy">ZeroAuth privacy policy</a></li>
        <li><a href="https://saifu.in/privacy/">Saifu privacy policy</a></li>
        <li><a href="https://getparchi.com/privacy/">Parchi privacy policy</a></li>
        <li><a href="https://tegami.optionallabs.com/privacy/">Tegami privacy policy</a></li>
      </ul>
      <p>For the earlier Optional app (job referral requests), see the <a href="privacy-policy-optional-app.html">Optional app privacy policy</a>.</p>

      <h2>This website</h2>
      <ul>
        <li>No cookies, analytics, advertising or tracking scripts.</li>
        <li>No forms, accounts or sign-in.</li>
        <li>Fonts, images and scripts are served from this website itself, not from third parties.</li>
      </ul>
      <p>The site is hosted on GitHub Pages. Like any web host, GitHub may record technical information such as your IP address when you visit, to run and protect its service. That is covered by <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub's privacy statement</a>. We do not receive or use those records.</p>

      <h2>When you email us</h2>
      <p>If you write to us, we use your email address and message only to reply to you, and keep them only as long as needed for that.</p>

      <h2>Children</h2>
      <p>This website is not directed at children under 13 and collects no data from anyone.</p>

      <h2>Changes and contact</h2>
      <p>Changes to this policy will be posted on this page with a new effective date. Questions or complaints about privacy: <a href="mailto:contact@optionallabs.com">contact@optionallabs.com</a>.</p>
    </article>
  </main>'''

ABOUT = '''  <main id="main">
    <section class="pd-hero pd-forest" aria-labelledby="about-title">
      <div class="wrap about-hero">
        <h1 class="pd-title" id="about-title">Everyday apps that keep your data on your phone.</h1>
        <p class="pd-lede">Optional Labs is a small product company in Bengaluru, India. We make apps for the paperwork of everyday life: sign-in codes, credit cards, medical papers and government letters.</p>
      </div>
    </section>

    <section class="pd-section wrap" aria-labelledby="why-title">
      <div class="section-head">
        <h2 class="display h2" id="why-title">Why we build this way</h2>
        <p class="lede">The things these apps handle are personal. We think they belong on your phone, not on our servers.</p>
      </div>
      <ul class="pd-features">
        <li><span class="tick" aria-hidden="true"></span><div><h3>On the phone first</h3><p>Each app reads, stores and works on your phone. What you put in stays there unless you choose to export or back it up.</p></div></li>
        <li><span class="tick" aria-hidden="true"></span><div><h3>One job each</h3><p>Every app does one everyday job well, so it is easy to understand and easy to trust.</p></div></li>
        <li><span class="tick" aria-hidden="true"></span><div><h3>Show our work</h3><p>Where an app reads a paper or a letter, it shows the original next to what it read, so you can check it.</p></div></li>
        <li><span class="tick" aria-hidden="true"></span><div><h3>Plain words</h3><p>Short sentences, real numbers and no fine print you have to decode.</p></div></li>
      </ul>
    </section>

    <section class="pd-section wrap" aria-labelledby="apps-title">
      <h2 class="display h2" id="apps-title">What we make</h2>
      <ul class="about-apps">
        <li><a href="../zeroauth/"><img src="../assets/img/zeroauth.png" alt="" width="64" height="64"><span><strong>ZeroAuth</strong>Authenticator for iPhone and Android. On the App Store and Google Play.</span></a></li>
        <li><a href="../saifu/"><img src="../assets/img/saifu.svg" alt="" width="64" height="64"><span><strong>Saifu</strong>Credit card advisor for India. Web tools live now, app coming soon.</span></a></li>
        <li><a href="../parchi/"><img src="../assets/img/parchi.png" alt="" width="64" height="64"><span><strong>Parchi</strong>Family medical papers. Coming soon to iPhone and Android.</span></a></li>
        <li><a href="../tegami/"><img src="../assets/img/tegami.png" alt="" width="64" height="64"><span><strong>Tegami</strong>City-hall letters, for residents of Japan. Coming soon to iPhone.</span></a></li>
      </ul>
    </section>

    <section class="pd-section wrap" aria-labelledby="company-title">
      <div class="pd-get">
        <div>
          <h2 class="display" id="company-title">Company</h2>
          <dl class="pd-facts">
            <div><dt>Name</dt><dd>Optional Labs</dd></div>
            <div><dt>Publisher</dt><dd>Chandan Kumar Dash</dd></div>
            <div><dt>Based in</dt><dd>Bengaluru, India</dd></div>
            <div><dt>Contact</dt><dd><a href="mailto:contact@optionallabs.com">contact@optionallabs.com</a></dd></div>
          </dl>
        </div>
        <div class="pd-get-actions">
          <a class="btn btn-lime btn-lg" href="mailto:contact@optionallabs.com">Write to us</a>
          <a class="pd-support" href="../privacy-policy.html">Privacy policy</a>
        </div>
      </div>
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
    (ROOT / 'about').mkdir(exist_ok=True)
    (ROOT / 'about/index.html').write_text(page(
        'About Optional Labs',
        'Optional Labs is a small product company in Bengaluru, India, making everyday apps that keep your data on your phone.',
        'about/', 'about', '../', ABOUT, depth1))
    print('wrote privacy-policy.html, privacy-policy-optional-app.html, about/index.html')


if __name__ == '__main__':
    main()
