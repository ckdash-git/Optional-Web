---
name: Optional Labs
description: Everyday apps that keep your data on your phone; privacy shown as proof on a black panel.
colors:
  coral: "#ff5a4f"
  coral-hover: "#ff7468"
  coral-press: "#f2473c"
  ink: "#0e0f0c"
  ink-hover: "#2b2c29"
  canvas: "#ffffff"
  warm-neutral: "#f4f3f1"
  warm-neutral-deep: "#e7e5e1"
  blush: "#ffe9e6"
  body: "#4a4a48"
  mute: "#666664"
  tint-zeroauth: "#ffe9e6"
  tint-saifu: "#e7efff"
  tint-parchi: "#e5f7ea"
  tint-tegami: "#fff1d6"
  tint-passo: "#efe8ff"
  tint-jobmatch: "#ffe6f1"
  tint-helm: "#e1f5f6"
  tint-revive: "#f0ece6"
  danger: "#d03238"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(50px, 6.4vw, 92px)"
    fontWeight: 900
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(40px, 6vw, 80px)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(30px, 3.4vw, 46px)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  tile-name:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(30px, 3vw, 40px)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.035em"
  lede:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(18px, 1.6vw, 21px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  caption:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
rounded:
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "44px"
  pill: "999px"
spacing:
  chip: "8px"
  stack: "16px"
  block: "24px"
  gutter: "clamp(16px, 4vw, 32px)"
  section: "clamp(64px, 9vw, 128px)"
  wrap: "1280px"
components:
  button-coral:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "48px"
  button-coral-hover:
    backgroundColor: "{colors.coral-hover}"
  button-coral-active:
    backgroundColor: "{colors.coral-press}"
  button-neutral:
    backgroundColor: "{colors.warm-neutral}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "48px"
  button-neutral-hover:
    backgroundColor: "{colors.warm-neutral-deep}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.coral}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "48px"
  button-ink-hover:
    backgroundColor: "{colors.ink-hover}"
  button-lg:
    padding: "16px 32px"
    height: "60px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
  tile:
    backgroundColor: "{colors.warm-neutral}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "clamp(22px, 2.4vw, 32px)"
    height: "440px"
  tile-lg:
    height: "600px"
  tile-zeroauth:
    backgroundColor: "{colors.tint-zeroauth}"
  tile-saifu:
    backgroundColor: "{colors.tint-saifu}"
  tile-parchi:
    backgroundColor: "{colors.tint-parchi}"
  tile-tegami:
    backgroundColor: "{colors.tint-tegami}"
  tile-passo:
    backgroundColor: "{colors.tint-passo}"
  tile-jobmatch:
    backgroundColor: "{colors.tint-jobmatch}"
  tile-helm:
    backgroundColor: "{colors.tint-helm}"
  tile-revive:
    backgroundColor: "{colors.tint-revive}"
  proof-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "clamp(28px, 5vw, 72px)"
  receipt-row:
    textColor: "{colors.canvas}"
    rounded: "18px"
    padding: "10px 16px 10px 10px"
  hero-stage:
    backgroundColor: "{colors.blush}"
    rounded: "{rounded.xl}"
  hero-chip:
    backgroundColor: "{colors.canvas}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "10px 16px 10px 10px"
  rule-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "clamp(24px, 3.4vw, 44px)"
  closing-panel:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "clamp(32px, 6vw, 80px)"
  field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
    height: "52px"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
---

# Design System: Optional Labs

## Overview

**Creative North Star: "The Proof Panel"**

Canvas is a white page with near-black ink, one hot coral (the dot of the Optional logo) for whatever you can press, warm neutrals, and a pastel tint per app. Inter is self-hosted (400, 600, 900; OFL) and set very heavy and tight. The signature object is the proof panel: a single black slab holding a receipt of what each app sends off your device, each row ticked by an animated check, ending on the claim that nothing leaves.

Density is generous and confident. Surfaces are big rounded slabs (24-44px corners) laid on white, and they separate from each other by fill colour, not by outlines. The one authored moment is the home hero: a blush stage where two tilted phone screenshots rise and then drift, two claim chips pop in, and a coral ripple animation sits behind them, eased away by scroll. Everywhere else motion is small and tactile (tile lift, icon tilt, a phone peeking up, press scale on pills). Pages cross-fade through view transitions. Every animation has a reduced-motion path and the content is complete without JavaScript.

The site is light only (`color-scheme: light`).

**Key Characteristics:**
- White canvas, ink type and ink panels, coral as the single action colour, warm neutral and per-app pastel fills.
- Inter 900 display, tight tracking (-0.035em to -0.04em), line height 0.9-0.98, in ink rather than a brand colour.
- Pills for every control; 16 / 24 / 32 / 44px radii for surfaces.
- Fill-based separation; one soft shadow vocabulary.
- App tiles carry the problem and the fix as a pair, on the app's own tint.

## Colors

A restrained light palette: ink and white do the work, coral marks the next step, and pastels are reserved for identifying apps.

### Primary
- **Logo Coral** (coral): the fill of every primary action (header CTA, hero CTA), the closing panel, the step numbers, feature ticks, the "What we fixed" tag on a coral or ink ground, receipt check discs, text selection, the skip link, and the full-stop in the hero headline. Text on coral is always ink.
- **Coral Lift** (coral-hover) and **Coral Press** (coral-press): hover and pressed states of coral pills only.

### Secondary
- **Ink** (ink): all display and body text, the proof panel, the footer, the privacy band on product pages, the inverse pill (ink fill, coral text) used where the ground is coral, tinted or neutral, the arrow disc on tiles, and the focus ring. Ink Lift (ink-hover) is its hover.

### Neutral
- **Canvas White** (canvas): page ground, rule cards, fields, hero chips, floating cards.
- **Warm Neutral** (warm-neutral): secondary pills, the "How we build" ground, default tile fill, proof rows, steps ground, fact rows, nav hover. Its deeper step (warm-neutral-deep) is the hover for those controls, the field border and the scrollbar thumb.
- **Blush** (blush): the hero stage, the kind pills, success notes, legal notes.
- **Body Grey** (body): ledes, sublines, legal copy. **Mute Grey** (mute): hints and captions; the quietest text allowed.

### Tile tints
One pastel per app, used as the tile fill on the home page and as the hero ground of that app's page: zeroauth (tint-zeroauth), saifu (tint-saifu), parchi (tint-parchi), tegami (tint-tegami), passo (tint-passo), jobmatch (tint-jobmatch), helm (tint-helm), revive (tint-revive). They identify an app and nothing else.

### Status colours
- **Danger** (`--danger` #d03238, hover #a72027): the delete-account button only.
- **Error note** (#fde8e8 ground, #8a1c21 text): form and account error messages. Success notes use Blush with ink.

### Named Rules
**The Coral Means Go Rule.** Coral is the colour of the next action. On white, neutral, tinted and ink grounds the primary pill is coral with ink text; where the ground is itself coral, the primary pill flips to ink with coral text so there is still exactly one obvious action. On the tinted product heroes the primary is the ink pill with coral text, so the call to action keeps its contrast on every tint (coral on blush is too faint); the coral pill returns in the get-it block below. The About, Careers and Enquire heroes are full-width ink slabs: display type there is coral and white, the same inverse the product privacy band uses.

**The Ink Voice Rule.** Display type is ink on light grounds, white on the proof panel, and coral on the product-page privacy band; never a pastel and never a grey.

### Role tokens
Components read role tokens, so a theme only overrides tokens: `--heading` (display text), `--on-deep` (text on ink), `--bezel` (phone frame), `--chip-soft`, `--card-soft`, `--ghost-soft`, `--ghost-soft-hover` (translucent fills on tinted grounds). Product-page heroes and tiles set local `--bg`, `--fg`, `--name`, `--soft`, `--ghost` per variant (tint, ink, coral, neutral, blush).

## Typography

**Display Font:** Inter 900 (with system-ui, -apple-system, sans-serif)
**Body Font:** Inter 400 and 600 (same stack)

**Character:** One family at its extremes: a dense, near-black-weight display set like a shop sign against a calm 17px body. Weight 600 carries every label, button and name; there is no third family and no mono.

### Hierarchy
- **Display** (900, clamp(50px, 6.4vw, 92px), 0.94, -0.04em): the home headline, three short phrases each on its own line, with a coral full stop. Product-page titles use clamp(42px, 5.6vw, 84px).
- **Headline** (900, clamp(40px, 6vw, 80px), 0.9, -0.04em): section heads; the proof panel head is clamp(38px, 4.8vw, 64px), the closing panel up to 96px.
- **Title** (900, clamp(30px, 3.4vw, 46px), 0.98, -0.035em): rule cards; tile names are clamp(30px, 3vw, 40px) at line height 1; legal h2 at 24-30px.
- **Lede** (400, clamp(18px, 1.6vw, 21px), 1.5): intro paragraphs in body grey, capped at 34-44ch.
- **Body** (400, 17px, 1.55): running text; legal text capped at 72ch.
- **Label** (600, 15px): nav, chips, tile jobs, problem/fix tags (14px), footer links; buttons are 600 at 16px (18px large).
- **Figure** (900, 15px, -0.01em): the receipt value beside each tick.
- **Caption** (400, 13-14px): receipt sublines and footnote, footer base.

### Named Rules
**The Heavy and Tight Rule.** Anything at title size or above is Inter 900 with negative tracking and line height under 1 (tile names sit at exactly 1). Never set large type at 400 or 600.

**The Sentence Case Rule.** Labels, tags and buttons are sentence case at 600; nothing is uppercased or open-tracked.

## Layout

Content sits in a 1280px wrap with a fluid gutter (clamp(16px, 4vw, 32px)). The hero is a two-column grid (1.05fr headline, 1fr stage) that stacks at 960px. Section heads pair a headline with a right-aligned lede and stack at 860px. Apps form a 12-column bento with 16px gaps: tiles span 3 columns (440px minimum height) and large tiles span 6 (600px, 720px when holding a desktop window), going to 6 columns at 960px and a single column at 640px. The proof panel is a two-column grid (sticky head left, receipt right) that stacks at 960px. "How we build" is a neutral ground with a sticky left head beside a stack of white rule cards. Product pages run: tinted hero (1.15fr copy to 0.85fr art), screenshot gallery with scroll-snap, a 3-up steps strip, a 2-up feature list, the ink privacy band with two columns, then a get-it block. Section rhythm is clamp(64px, 9vw, 128px); inner gaps are 8px for chips and rows, 16px for slabs, 24px between blocks. The header is a sticky 76px white bar (64px under 860px, where the text links are replaced by a details-based menu).

## Elevation & Depth

Mostly flat, built from tonal layers: tinted tiles and an ink panel on white, white cards on neutral. Shadows are soft, diffuse, and reserved for things that float or respond. Tilt is a second depth cue: phones and tiles' screenshots sit rotated a few degrees.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 2px 6px rgb(14 15 12 / 0.05), 0 28px 56px -24px rgb(14 15 12 / 0.3)`): form cards, desktop-window screenshots, the mobile menu (with a stronger variant).
- **Tile lift** (`box-shadow: 0 32px 56px -32px rgb(14 15 12 / 0.4)` with translateY(-6px)): tiles on hover or focus-within.
- **Phone** (`box-shadow: 0 2px 6px rgb(14 15 12 / 0.12), 0 40px 72px -36px rgb(14 15 12 / 0.55)`): the phone bezel frame.
- **Chip float** (`box-shadow: 0 2px 6px rgb(14 15 12 / 0.06), 0 18px 32px -14px rgb(14 15 12 / 0.35)`): the two hero claim chips.
- **Icon drop** (`box-shadow: 0 12px 24px -12px rgb(14 15 12 / 0.45)`): app icons on tiles and pages.

### Named Rules
**The Fill Not Line Rule.** Surfaces separate by fill colour and radius, never by outlines or rings. The only rules that exist are native ones: the scrolled-header edge (1px), the footer base divider (1px), the "or" rules (1px) and the delete-zone rule (2px) on the account page, the 2px field border that turns ink on focus, and the 4px ring on a tile opened by a `#app` link (it shows where the visitor landed).

## Shapes

Large, soft rectangles and full pills. The stage and proof panel use 44px; tiles, rule cards, the closing panel, privacy band and form cards use 32px; steps, role cards and menu panel use 24px; inner rows, fields and notes use 16-18px; every button, chip, nav link and replay control is a 999px pill. App icons are rounded squares (24% at large scale, 9-17px when small). Checks are coral discs with an ink tick (a drawn Lottie check when JavaScript runs, a CSS tick otherwise). Focus is a 3px ink outline offset 3px with an 8px radius.

## Components

### Buttons
Confident, chunky pills that grow slightly under the pointer.
- **Shape:** full pill (999px), minimum height 48px (60px large, 44px in the header).
- **Primary (coral):** coral fill, ink text, 600 weight, 12px 24px padding; inline SVG arrows at 18px.
- **Hover / Active:** coral lifts to coral-hover and scales to 1.03; pressed goes to coral-press at 0.97. Transitions 0.2s on the long-tail ease-out.
- **Secondary (neutral):** warm neutral fill, ink text, deeper hover; pairs with coral in the hero.
- **Inverse (ink):** ink fill, coral text; the primary action on a coral ground.
- **Ghost:** a translucent tint of the band's own text colour, inheriting text colour; store links and secondary actions.

### Hero stage (signature)
A 44px blush-gradient stage holding two tilted phone frames (-6deg and 5deg), two white claim chips with app icons, and a coral ripple Lottie centred behind. On load the phones rise 56px while straightening, then drift 10px on a 7s alternate loop; the chips pop in after 0.9s and 1.1s. Where scroll-driven animation is supported, the ripple eases down and grows over the first 640px of scroll. The Lottie loads only when near the screen and never under reduced motion.

### App tiles (signature)
Tinted 32px slabs that name the app, then a problem and a fix as a labelled pair: the problem tag is a translucent pill, the fix tag is ink with coral text. A footer holds a white "Visit site" pill and an ink arrow disc. Big tiles carry a rotated phone (or desktop window) screenshot clipped at the bottom edge. On hover or focus the tile lifts 6px, the icon tilts -8deg and scales 1.06, the screenshot peeks up 18-22px, and the arrow nudges right. Tiles rise 36px on scroll in a short stagger (JS only). The whole tile is one link via a stretched pseudo-element on the name.

### Problem / fix pair (large)
On product pages, two 32px cards side by side: the problem on warm neutral, the fix on coral, both with 900 copy at clamp(22px, 2.2vw, 31px).

### Proof panel and receipt (signature)
A 44px ink slab with a white 900 headline and a translucent lede on the left, and the receipt on the right: a small 600 heading with a "Replay" pill, then one row per app (44px icon, 600 name with a 13px subline, a coral check and a 900 value) on a 7% white fill, then a footnote. With JS, rows dim, a coral sheen scans each in turn, the Lottie check draws in sync with its row and the value settles; Replay reruns it. Without JS or with reduced motion it is shown complete. Rows link to each product page.

### Chips
- **Hero claims:** white pill, 600 at 14px, with a 30px app icon, floating on the stage.
- **Kinds:** blush pill, 900 at clamp(20px, 2.4vw, 32px).

### Cards / Containers
- **Corner Style:** 32px for slabs, 24px for secondary cards, 16px for rows.
- **Background:** white on neutral grounds; neutral on white; pastel tint for tiles; ink for the panel and privacy band.
- **Shadow Strategy:** flat, except form cards and windows (Float) and lifted tiles.
- **Border:** none.

### Inputs / Fields
White fill, 16px radius, 52px minimum height, 2px warm-neutral-deep border that turns ink on focus (outline removed in favour of the border). Labels are 600 at 15px. Careers, enquire and account share one single-column form in a white 32px Float card with a coral pill submit and a status note above the fields; error notes are #fde8e8 with #8a1c21 text, success notes blush.

### Navigation
Brand lockup (36px mark that tilts -12deg on hover, Inter 900 at 21px) left; 600 15px ink text links as pills with warm-neutral hover; a coral pill CTA last. Under 860px a details-based menu pill opens a white 24px panel listing apps and links. The header is white and gains a 1px edge plus soft shadow after scrolling. Footer: ink ground, off-white text, coral brand and column heads, four columns collapsing to two.

### Privacy band (product pages)
Ink 32px band with a drawn shield Lottie (72px, plays once on entering view), a coral 900 headline, and two translucent columns of dotted lists.

### Motion
One long-tail ease, `cubic-bezier(0.16, 1, 0.3, 1)`, for movement; 0.2s ease for colour. Cross-document view transitions fade the old page out in 0.18s and the new in 0.32s (`@view-transition { navigation: auto }`). `prefers-reduced-motion: reduce` collapses all CSS animation and transition durations to 0.01ms, disables smooth scroll, and stops the Lottie loader and the receipt sequence in JavaScript.

## Do's and Don'ts

### Do:
- **Do** make the next action a coral pill with ink text, or an ink pill with coral text when the ground is coral.
- **Do** set every title-size-and-up line in Inter 900, ink (white on the panel), with negative tracking and line height under 1.
- **Do** separate surfaces with fill colour (pastel tile, ink panel, white card on neutral) and 16 / 24 / 32 / 44px radii.
- **Do** give each app its tint, on its tile and on its page hero, and nowhere else.
- **Do** use the single long-tail ease for movement and give every animation a prefers-reduced-motion path and a complete no-JS state.
- **Do** inline icons as stroked SVG in currentColor.

### Don't:
- **Don't** outline cards, rows or tiles with 1px borders or rings; the listed native rules are the only lines.
- **Don't** set display type below weight 900 or in a pastel or grey.
- **Don't** use square or small-radius buttons; every control is a pill.
- **Don't** introduce a second display family, a mono, or uppercase tracked labels.
- **Don't** put more than one coral-filled primary action in the same group.
- **Don't** stack heavy shadows or add a dark mode; the world is light only.
