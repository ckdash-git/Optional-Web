# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, deployed to GitHub Pages from `main` (`.github/workflows/static.yml`), custom domain `optionallabs.com` (CNAME). No build step.

## Users

- People who heard of one Optional Labs app (ZeroAuth, Saifu, Parchi, Tegami, Passo, JobMatch, Helm, Revive) and want to know who makes it and whether to trust it.
- People browsing the studio itself: press, partners, app-store reviewers, prospective collaborators.

## Product Purpose

optionallabs.com is the hub for Optional Labs, the registered company (Optional Labs LLP) behind its apps. It introduces the studio, lists each product with what it does and where to get it, and sends visitors to each product's own site. Success: a visitor understands in seconds that every app keeps their data on their phone, and reaches the product they came for.

## Positioning

Small apps that keep your data with you, and say plainly what leaves your device. Headline: "Your data. Your device. Your call." The claim must stay true for all eight apps, so never write "nothing leaves your phone" or "no account" for the whole range:

- Saifu, Parchi, Tegami, Passo, Revive: no account. Revive can send a short summary for AI explanations, only if the user turns that on.
- ZeroAuth: has a sign-up (owner correction, Oct 2026), but codes, passwords and 2FA seeds never leave the phone.
- JobMatch: a desktop app (Windows, macOS). The resume stays on the computer; job boards see a job title and a city.
- Helm: needs a Google sign-in; terminal, screen and files go device to device, encrypted; its server holds account email and name, device names and online status.

## Products (only these eight are listed; facts live in `tools/products.py`)

| Product | Site | Status |
|---|---|---|
| ZeroAuth | https://zeroauth.in | Live on App Store and Google Play |
| Saifu | https://saifu.in | Web tools live; app links pending |
| Parchi | https://getparchi.com | Coming soon to App Store and Google Play |
| Tegami | https://tegami.optionallabs.com | Coming soon to the App Store |
| Passo | https://passo.optionallabs.com | Free on the App Store (iPhone, iOS 18+) |
| JobMatch | https://jobmatch.optionallabs.com | Windows 10/11 and macOS; 2 free searches, then a one-time pass |
| Helm | https://helm.optionallabs.com | Free terminal; Pro adds screen, files, chat, audio |
| Revive | https://revive.optionallabs.com | Coming soon (invite list) |

Store links known: ZeroAuth iOS `https://apps.apple.com/in/app/zeroauth/id6764048764`, Android `https://play.google.com/store/apps/details?id=com.OptionalLabs.zeroauth`; Passo iOS `https://apps.apple.com/us/app/passo-travel-stamps/id6827809454`.
Do not print prices on the hub: JobMatch and Helm read theirs from the server and change them. Revive's source repo is `optionallabs/heliostrap`.

## Capabilities and Constraints

- Product facts come from each product's own site or repo (zeroauth-web, kaunsa-card/site, parchi-site, tegami-site, passo, jobmatch, helm, heliostrap). Product code is not modified from here. Helm's own privacy page is still marked "Draft" in its repo.
- Keep `privacy-policy.html`, `app-ads.txt` and `CNAME` working at their current URLs.
- `manage-account.html` is the account page for the earlier Optional app: Firebase sign-in (email, Google, Apple), sign-out and account deletion. Its URL was given to the App Store and Google Play as the account deletion URL, so it must stay live (restored Oct 2026 after a store notice). Old URLs `login.html`, `registration-html.html`, `welcome.html` and `dashboard.html` redirect to it.

## Brand Commitments

- Legal entity: **Optional Labs LLP**, LLPIN **ADD-5789**. Registered office: **Kotpad, Koraput Dist, Odisha, India, 764058** (owner, Oct 2026). Brand name used in headings: Optional Labs. Do not say Bengaluru; the older product sites (for example Tegami) still do and are not edited from here.
- Contact: contact@optionallabs.com (general), career@optionallabs.com (hiring).
- Logo: `assets/img/ol-mark.png` (from the original `Assets/light_mode(2).png`; the old `Assets/` folder with the logo video, dark-mode logo and Open Sauce font was removed from the site in Oct 2026 and remains in git history).
- Voice across products: plain, factual, short sentences, no hype ("No account to make.").

## Evidence on Hand

- Product copy and icons in each product's site repo (Saifu icon: `kaunsa-card/site/static/brand/icon.svg`; Parchi `parchi-site/icon.png`; Tegami `tegami-site/icon.png`; ZeroAuth `zeroauth-web/public/app_logo_circle.png`).
- No testimonials, user counts, press or revenue figures exist. Do not invent any.

## Product Principles

1. Data stays on the phone; say it plainly and show the proof per product.
2. One job per product, explained in one sentence.
3. Send visitors onward to the product site quickly.
4. Never claim what the products' own sites do not claim.

## Accessibility & Inclusion

WCAG 2.2 AA. Respect `prefers-reduced-motion` for all animation.
