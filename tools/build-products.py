#!/usr/bin/env python3
"""Generate the product pages (zeroauth/ ... revive/) and the product-driven parts of index.html.

Edit product facts in tools/products.py, then run from the repo root:

    python3 tools/build-products.py && python3 tools/build-pages.py

Parts of index.html between <!-- gen:NAME --> and <!-- /gen:NAME --> are rewritten here
(menu apps, the hero panel, app rows, How we build, the closing band, footer apps and the
Organization data). Everything else in index.html is hand-written. The header and footer
of every page are copied from index.html by this script and by build-pages.py."""
import html, json, re, sys, pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from products import PRODUCTS

ROOT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent

ARROW = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CHECK = '<span class="tick" aria-hidden="true"></span>'
e = html.escape
BADGES = {'app-store': ('', 'badge-app-store.svg', 135, 45, 'App Store', 'Download'),
          'google-play': (' gp', 'badge-google-play.png', 168, 65, 'Google Play', 'Get')}
SLUGS = '|'.join(p['slug'] for p in PRODUCTS)


def icon_src(p, prefix):
    return f'{prefix}assets/img/{p["icon"]}'


# ---------------------------------------------------------------- homepage regions

def badges_html(p, prefix, indent):
    out = []
    for kind, href in p.get('badges', []):
        cls, src, w, h, store, verb = BADGES[kind]
        out.append(f'{indent}  <a class="store-badge{cls}" href="{href}"><img src="{prefix}assets/img/{src}" alt="{verb} {e(p["name"])} on {store}" width="{w}" height="{h}"></a>')
    return f'{indent}<span class="badges">\n' + '\n'.join(out) + f'\n{indent}</span>' if out else ''


def region_menu_apps():
    return '\n'.join(
        f'            <li><a href="{p["slug"]}/"><img src="{icon_src(p, "")}" alt="" width="40" height="40">{e(p["name"])}<small>{e(p["short"])}</small></a></li>'
        for p in PRODUCTS)


def region_receipt_rows():
    return '\n'.join(f'''          <li><a class="row" href="{p["slug"]}/">
              <img src="{icon_src(p, "")}" alt="" width="48" height="48">
              <span class="row-name">{e(p["name"])}<small>{e(p["leaves"])}</small></span>
              <span class="row-val"><span class="row-check" aria-hidden="true"></span><span class="sr">Sent off your device: </span>{e(p["verdict"])}</span>
            </a></li>''' for p in PRODUCTS)


def region_app_bands():
    out = []
    for p in PRODUCTS:
        primary = 'btn-lime' if p['tone'] == 'forest' else 'btn-ink'
        chips = '\n'.join(f'                <li>{e(f)}</li>' for f in p['band_facts'])
        extra = ''.join(f'\n                <a class="btn btn-ghost" href="{href}">{e(label)}</a>' for _, label, href, _ in p['actions'][1:])
        bad = badges_html(p, '', '                ')
        status = '' if bad else f'\n                <span class="status">{e(p["status"].split(". ")[0].rstrip("."))}.</span>'
        out.append(f'''          <li class="app app-{p["tone"]}" id="{p["slug"]}" data-reveal>
            <div class="app-main">
              <img class="app-icon" src="{icon_src(p, "")}" alt="" width="96" height="96" loading="lazy">
              <div>
                <h3 class="app-name">{e(p["name"])}</h3>
                <p class="app-job">{e(p["job"])}</p>
              </div>
            </div>
            <div class="app-body">
              <dl class="pf">
                <div class="pf-row pf-problem"><dt>The problem</dt><dd>{e(p["problem"])}</dd></div>
                <div class="pf-row pf-fix"><dt>What we fixed</dt><dd>{e(p["fix"])}</dd></div>
              </dl>
              <ul class="app-facts">
{chips}
              </ul>
              <div class="app-actions">
                <a class="btn {primary}" href="{p["slug"]}/">More about {e(p["name"])}{ARROW}</a>
                <a class="btn btn-ghost" href="{p["site"]}">Visit {e(p["site_label"])}</a>{extra}{chr(10) + bad if bad else ""}{status}
              </div>
            </div>
          </li>''')
    return '\n\n'.join(out)


RULES = [('stays', 'Your data stays with you.'), ('account', 'No account unless the job needs one.'), ('control', 'You stay in control.')]


def region_how_rules():
    out = []
    for key, title in RULES:
        rows = '\n'.join(
            f'              <li><img src="{icon_src(p, "")}" alt="" width="28" height="28" loading="lazy"><b>{e(p["name"])}</b><span>{e(p["how"][key])}</span></li>'
            for p in PRODUCTS if key in p['how'])
        out.append(f'''          <article class="rule">
            <h3>{e(title)}</h3>
            <ul class="proof">
{rows}
            </ul>
          </article>''')
    return '\n'.join(out)


def region_close_apps():
    return '\n'.join(
        f'          <li><a href="{p["slug"]}/"><img src="{icon_src(p, "")}" alt="" width="56" height="56" loading="lazy">{e(p["name"])}</a></li>'
        for p in PRODUCTS)


def region_footer_apps():
    return '\n'.join(f'          <li><a href="{p["slug"]}/">{e(p["name"])}</a></li>' for p in PRODUCTS)


def region_org_ld():
    org = {
        '@context': 'https://schema.org', '@type': 'Organization', 'name': 'Optional Labs', 'legalName': 'Optional Labs LLP',
        'identifier': {'@type': 'PropertyValue', 'propertyID': 'LLPIN', 'value': 'ADD-5789'},
        'url': 'https://optionallabs.com/', 'logo': 'https://optionallabs.com/assets/img/icon-512.png', 'email': 'contact@optionallabs.com',
        'address': {'@type': 'PostalAddress', 'streetAddress': 'Kotpad, Koraput Dist', 'addressLocality': 'Kotpad',
                    'addressRegion': 'Odisha', 'postalCode': '764058', 'addressCountry': 'IN'},
        'brand': [{'@type': 'Brand', 'name': p['name'], 'url': p['site']} for p in PRODUCTS],
    }
    return '  <script type="application/ld+json">' + json.dumps(org, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + '</script>'


REGIONS = {'menu-apps': region_menu_apps, 'receipt-rows': region_receipt_rows, 'app-bands': region_app_bands,
           'how-rules': region_how_rules, 'close-apps': region_close_apps, 'footer-apps': region_footer_apps, 'org-ld': region_org_ld}


def update_index():
    f = ROOT / 'index.html'
    t = f.read_text()
    for name, fn in REGIONS.items():
        pat = re.compile(r'(<!-- gen:%s -->\n).*?(\n[ \t]*<!-- /gen:%s -->)' % (name, name), re.S)
        assert pat.search(t), f'index.html has no gen:{name} markers'
        t = pat.sub(lambda m: m.group(1) + fn() + m.group(2), t, count=1)
    f.write_text(t)
    return t


idx = update_index()


# ---------------------------------------------------------------- product pages

def chrome(part):
    m = re.search(r'  <%s class="(top|foot)".*?</%s>\n' % (part, part), idx, re.S).group(0)
    m = re.sub(r'<!-- /?gen:[a-z-]+ -->\n?\s*', '', m)
    m = m.replace('href="./"', 'href="../"').replace('src="assets/', 'src="../assets/')
    m = re.sub(r'href="#(apps|how|contact)"', r'href="../#\1"', m)
    m = re.sub(r'href="(%s|about|careers|enquire)/"' % SLUGS, r'href="../\1/"', m)
    return m.replace('href="privacy-policy.html"', 'href="../privacy-policy.html"').replace('href="manage-account.html"', 'href="../manage-account.html"')


HEADER, FOOTER = chrome('header'), chrome('footer')


def actions(p):
    out = [f'<a class="btn {cls} btn-lg" href="{href}">{e(label)}{ARROW if arrow else ""}</a>' for cls, label, href, arrow in p['actions']]
    bad = badges_html(p, '../', '')
    if bad:
        out.append(bad)
    return '\n            '.join(out)


def dims(p):
    return p.get('screen_dims', (560, 1212))


def hero_art(p):
    h = p['hero']
    w, ht = dims(p)
    if h['kind'] == 'phone':
        return f'<div class="pd-art"><figure class="phone phone-lg"><img src="../assets/screens/{h["src"]}" alt="{e(h["alt"])}" width="{w}" height="{ht}"></figure></div>'
    if h['kind'] == 'desktop':
        return f'<div class="pd-art"><figure class="win win-lg"><div class="win-bar" aria-hidden="true"><i></i><i></i><i></i></div><img src="../assets/screens/{h["src"]}" alt="{e(h["alt"])}" width="{h["w"]}" height="{h["h"]}"></figure></div>'
    if h['kind'] == 'wide':
        small = h['src'].replace('.webp', '-640.webp')
        return f'<div class="pd-art"><img class="pd-wide" src="../assets/screens/{h["src"]}" srcset="../assets/screens/{small} 640w, ../assets/screens/{h["src"]} {h["w"]}w" sizes="(max-width: 960px) 92vw, 520px" alt="{e(h["alt"])}" width="{h["w"]}" height="{h["h"]}"></div>'
    return f'<div class="pd-art pd-art-icon"><img src="{icon_src(p, "../")}" alt="" width="192" height="192"></div>'


def gallery(p):
    w, ht = dims(p)
    desktop = p.get('screen_kind') == 'desktop'
    items = []
    for src, t, c in p['screens']:
        frame = (f'<div class="win"><div class="win-bar" aria-hidden="true"><i></i><i></i><i></i></div><img src="../assets/screens/{src}" alt="{e(t)}: {e(c)}" width="{w}" height="{ht}" loading="lazy"></div>'
                 if desktop else
                 f'<div class="phone"><img src="../assets/screens/{src}" alt="{e(t)}: {e(c)}" width="{w}" height="{ht}" loading="lazy"></div>')
        items.append(f'''          <li class="shot">
            <figure>
              {frame}
              <figcaption><strong>{e(t)}</strong>{e(c)}</figcaption>
            </figure>
          </li>''')
    prev = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    nxt = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    return f'''        <div class="gallery{" gallery-wide" if desktop else ""}" data-gallery>
          <div class="gallery-nav" data-gallery-nav hidden>
            <button class="gnav" type="button" data-dir="-1" aria-label="Previous screen">{prev}</button>
            <button class="gnav" type="button" data-dir="1" aria-label="Next screen">{nxt}</button>
          </div>
          <ol class="shots" tabindex="0" aria-label="{e(p["name"])} screens">
{chr(10).join(items)}
          </ol>
        </div>'''


def screens(p):
    if p.get('screens'):
        return gallery(p)
    if p.get('wide'):
        w = p['wide']
        small = w['src'].replace('.webp', '-760.webp')
        return f'        <img class="pd-wide pd-wide-lg" src="../assets/screens/{w["src"]}" srcset="../assets/screens/{small} 760w, ../assets/screens/{w["src"]} {w["w"]}w" sizes="(max-width: 960px) 92vw, 880px" alt="{e(w["alt"])}" width="{w["w"]}" height="{w["h"]}" loading="lazy">'
    chips = ''.join(f'<li>{e(k)}</li>' for k in (p.get('kinds') or p['chips']))
    note = p.get('screens_note')
    return f'        <ul class="kinds">{chips}</ul>' + (f'\n        <p class="pd-note">{e(note)}</p>' if note else '')


def ld(p):
    data = {
        '@context': 'https://schema.org', '@type': p['ld_type'],
        'name': p['name'], 'description': p['desc'], 'url': f"https://optionallabs.com/{p['slug']}/",
        'sameAs': p['site'], 'applicationCategory': p['category'], 'operatingSystem': p['os'],
        'image': f"https://optionallabs.com/assets/img/{p['icon']}",
        'publisher': {'@type': 'Organization', 'name': 'Optional Labs LLP', 'url': 'https://optionallabs.com/'},
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
    others = '\n'.join(f'          <li><a href="../{o["slug"]}/"><img src="{icon_src(o, "../")}" alt="" width="56" height="56" loading="lazy">{o["name"]}</a></li>' for o in PRODUCTS if o is not p)
    sl, sh, st = p['support']
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'sha256-Du+OJKJSbdUgz5nrHeWWINvez6XKDDU/tyj/5c2uvwo='; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests">
  <meta name="referrer" content="strict-origin-when-cross-origin">
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
          <div class="pd-id"><img class="app-icon" src="{icon_src(p, "../")}" alt="" width="72" height="72"><div><p class="pd-name">{e(p["name"])}</p><p class="pd-job">{e(p["job"])}</p></div></div>
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
        <div class="pf-row pf-problem"><dt>The problem</dt><dd>{e(p["problem"])}</dd></div>
        <div class="pf-row pf-fix"><dt>What we fixed</dt><dd>{e(p["fix"])}</dd></div>
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
        <p class="pd-privacy-note">{e(p["note"])} <a href="{p["policy"]}">Read {e(p["name"])}'s privacy policy.</a></p>
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
        <ul class="close-apps">
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
    d = ROOT / p['slug']
    d.mkdir(exist_ok=True)
    (d / 'index.html').write_text(page(p))
print('wrote index.html regions and', ', '.join(p['slug'] + '/' for p in PRODUCTS))
