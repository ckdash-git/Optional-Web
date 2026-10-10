# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, deployed to GitHub Pages from `main` (`.github/workflows/static.yml`), custom domain `optionallabs.com` (CNAME). No build step.

## Users

- People who heard of one Optional Labs app (ZeroAuth, Saifu, Parchi, Tegami) and want to know who makes it and whether to trust it.
- People browsing the studio itself: press, partners, app-store reviewers, prospective collaborators.

## Product Purpose

optionallabs.com is the hub for Optional Labs, the registered company behind four apps. It introduces the studio, lists each product with what it does and where to get it, and sends visitors to each product's own site. Success: a visitor understands in seconds that every app keeps their data on their phone, and reaches the product they came for.

## Positioning

A privacy-first studio. Every product keeps what you put into it on the phone and sends none of it to Optional Labs servers. Saifu, Parchi and Tegami need no account. ZeroAuth has a sign-up, but codes, passwords and 2FA seeds never leave the phone (owner correction, Oct 2026). Never claim "no account" for all four apps.

## Products (only these four are listed)

| Product | Site | One line (from the product's own site) | Status |
|---|---|---|---|
| ZeroAuth | https://zeroauth.in | Offline, privacy-first authenticator: TOTP codes on device, AES-256-GCM vault, autofill, passkeys. | Live on App Store and Google Play |
| Saifu | https://saifu.in | "Which card at checkout. And what you are about to lose." Ranks your credit cards per spend, tracks fee waivers, caps, expiring points, lounge visits. India, 336 cards catalogued. | Web tools live; app links pending |
| Parchi | https://getparchi.com | "Your family's medical papers, read and kept on your phone." Photograph prescriptions, reports, bills; filed per family member. | Coming soon to App Store and Google Play |
| Tegami | https://tegami.optionallabs.com | "Every letter from city hall, explained in plain English." For residents of Japan. | Coming soon to the App Store |

Store links known: ZeroAuth iOS `https://apps.apple.com/in/app/zeroauth/id6764048764`, Android `https://play.google.com/store/apps/details?id=com.OptionalLabs.zeroauth`.

## Capabilities and Constraints

- Product facts come from each product's own site repo (zeroauth-web, kaunsa-card/site, parchi-site, tegami-site). Product code is not modified from here.
- Keep `privacy-policy.html`, `app-ads.txt` and `CNAME` working at their current URLs.
- Firebase login/registration/dashboard/manage-account pages are removed (user decision).

## Brand Commitments

- Name: Optional Labs. Based in Bengaluru, India (stated on Tegami's site).
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
