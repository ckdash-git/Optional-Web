---
name: Optional Labs
description: Everyday apps that keep your data on your phone; privacy shown as an accounting fact.
colors:
  lime: "#9fe870"
  lime-hover: "#b4f08d"
  lime-press: "#8ad65a"
  forest: "#163300"
  canvas: "#ffffff"
  sage: "#e8ebe6"
  sage-deep: "#d9ded5"
  pale: "#e2f6d5"
  ink: "#0e0f0c"
  body: "#454745"
  mute: "#6a6c6a"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(48px, 6.6vw, 96px)"
    fontWeight: 900
    lineHeight: 0.92
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
  figure:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "22px"
    fontWeight: 900
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
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
  pill: "999px"
spacing:
  chip: "8px"
  stack: "16px"
  block: "24px"
  gutter: "clamp(16px, 4vw, 32px)"
  section: "clamp(64px, 9vw, 128px)"
  wrap: "1280px"
components:
  button-lime:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.forest}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "48px"
  button-lime-hover:
    backgroundColor: "{colors.lime-hover}"
  button-lime-active:
    backgroundColor: "{colors.lime-press}"
  button-sage:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "48px"
  button-sage-hover:
    backgroundColor: "{colors.sage-deep}"
  button-ink:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.lime}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "48px"
  button-lg:
    padding: "16px 32px"
    height: "60px"
  chip-fact:
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  card-white:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "clamp(24px, 3.4vw, 44px)"
  receipt-row:
    backgroundColor: "{colors.sage}"
    rounded: "20px"
    padding: "14px 18px 14px 14px"
  app-band:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "clamp(24px, 4vw, 56px)"
  app-band-forest:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.pale}"
  app-band-lime:
    backgroundColor: "{colors.lime}"
  app-band-pale:
    backgroundColor: "{colors.pale}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
---

# Design System: Optional Labs

## Overview

**Creative North Star: "The Zero Receipt"**

The system is the Wise theme (VoltAgent/awesome-design-md, design-md/wise) applied to a privacy studio, with Inter self-hosted (400, 600, 900; OFL) in place of Wise Sans. It reads like a friendly fintech statement: a white canvas, sage fills, lime for anything you can press, and very heavy forest-green display type set tight. The signature object is a receipt: rows on sage, a figure in heavy tabular numerals, a bold total line, and the total is zero.

Density is generous and confident. Surfaces are big rounded slabs (24-32px corners) laid on white or sage, and they separate from each other by fill colour, not by outlines. Depth is quiet: one soft two-layer shadow for the floating receipt, a lift on hover for app bands, and otherwise tonal layering. Motion uses a single long-tail ease-out and always has a reduced-motion path; content is complete without JavaScript.

**Key Characteristics:**
- White canvas, sage neutrals, lime as the action colour, forest as display ink.
- Inter 900 display, tight tracking (-0.035em to -0.045em), line height 0.9-0.98.
- Pills for every control; 16 / 24 / 32px radii for surfaces.
- Fill-based separation; one soft shadow vocabulary.
- Colour-banded product slabs (forest, lime, sage, pale) that swap their own local palette.

## Colors

A light, green-leaning palette: one saturated lime, one deep forest, and a family of warm-grey sage neutrals.

### Primary
- **Wise Lime** (lime): the fill of every primary action on light or forest grounds (header CTA, hero CTA, ZeroAuth's visit button), the receipt checkmarks, text selection, the skip link, and two full surfaces (the Saifu band and the closing panel). Text on lime is always forest.
- **Lime Lift** (lime-hover) and **Lime Press** (lime-press): hover and pressed states of lime pills only.

### Secondary
- **Forest Ink** (forest): all display and headline type, receipt figures, the footer ground, the forest product band, the inverse pill (forest fill, lime text) used as the primary action on lime, sage and pale bands, and the focus ring.

### Neutral
- **Canvas White** (canvas): page ground, receipt card, rule cards on sage.
- **Sage** (sage): secondary pills, receipt rows, proof rows, the "How we build" section ground, default band fill, nav hover.
- **Deep Sage** (sage-deep): hover for sage controls; scrollbar thumb.
- **Pale Mint** (pale): the pale product band and all text on the forest footer and forest band (at 70-82% opacity for secondary copy).
- **Near-Black Ink** (ink): default text, the receipt total rule.
- **Body Grey** (body): ledes, sublines, legal copy.
- **Mute Grey** (mute): receipt heading and caption; the quietest text allowed.

### Status colours
- **Danger** (`--danger` #d03238, hover #a72027): the delete-account button only.
- **Error note** (#fde8e8 ground, #8a1c21 text): form error messages on the careers and enquire forms. Success notes use Pale Mint with Forest Ink.

### Named Rules
**The Lime Means Go Rule.** Lime is the colour of the next action. On white, sage and forest the primary pill is lime with forest text; on a lime, sage or pale band the primary pill flips to forest with lime text so there is still exactly one obvious action.

**The Forest Ink Rule.** Display and headline type is forest, never black. Near-black ink is for reading text; forest is for shouting.

### Role tokens
Components read role tokens rather than raw colours, so a theme only overrides tokens:
- `--heading`: display and heading text on canvas, sage and pale (forest in light, lime in dark).
- `--on-deep`: text on forest surfaces (pale mint in both modes).
- `--bezel`: the phone frame around screenshots (near-black in both modes).
- `--chip-soft`, `--card-soft`, `--ghost-soft`, `--ghost-soft-hover`: translucent fills for chips, cards and ghost buttons on neutral bands.

### Light only
The site is always light, whatever the visitor's system setting (owner decision, Oct 2026). The role tokens above stay, so a future theme toggle only needs to override them.

## Typography

**Display Font:** Inter 900 (with system-ui, -apple-system, sans-serif)
**Body Font:** Inter 400 and 600 (same stack)

**Character:** One family at its extremes: a dense, near-black-weight display that sits like printed totals, against a calm 17px body. Weight 600 carries every label, button and name; there is no third family and no mono.

### Hierarchy
- **Display** (900, clamp(48px, 6.6vw, 96px), 0.92, -0.04em): the page headline only, balanced, one line per phrase. Product band names use the same treatment at band scale.
- **Headline** (900, clamp(40px, 6vw, 80px), 0.9, -0.04em): section heads; the closing panel and legal h1 sit in this range.
- **Title** (900, clamp(30px, 3.4vw, 46px), 0.98, -0.035em): rule cards; legal h2 at 24-30px.
- **Figure** (900, 22px, tabular numerals, -0.02em): receipt values; the receipt total scales to clamp(40px, 4.4vw, 56px) at line height 1.
- **Lede** (400, clamp(18px, 1.6vw, 21px), 1.5): intro paragraphs in body grey, capped at 34-40ch.
- **Body** (400, 17px, 1.55): running text; legal text capped at 72ch.
- **Label** (600, 15px): nav, chips, status lines, footer links; buttons are 600 at 16px (18px large).
- **Caption** (400, 14px): figcaptions, footer base, row sublines.

### Named Rules
**The Heavy and Tight Rule.** Anything at title size or above is Inter 900 with negative tracking (-0.02em at figure size down to -0.045em at band-name size) and line height under 1. Never set large type at 400 or 600.

**The No-Caps Rule.** Nothing is uppercased or letter-spaced open; labels are sentence case at 600.

## Layout

Content sits in a 1280px wrap with a fluid gutter (clamp(16px, 4vw, 32px)). The hero is a two-column grid (about 1.15fr text to 1fr receipt) that stacks at 960px. Section heads pair a headline with a right-aligned lede and stack at 860px. Product bands are full-wrap slabs stacked with 16px gaps, each a two-column grid (identity left, copy and actions right) that collapses to one column at 860px, where the icon and name sit side by side. "How we build" uses a sticky left head beside a stack of white cards (unstuck below 960px). Vertical rhythm between sections is clamp(64px, 9vw, 128px); inner gaps use 8px for chips, 10-16px for rows and stacks, 24px between blocks. The header is a sticky 76px bar (64px under 860px, where text nav links hide and only the lime pill remains).

## Elevation & Depth

Mostly flat, built from tonal layers: white on sage, sage on white, coloured bands on white. Shadows are soft, diffuse, and reserved for things that float or respond.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 2px 6px rgb(14 15 12 / 0.05), 0 28px 56px -24px rgb(14 15 12 / 0.3)`): the receipt card, the one resting elevated object.
- **Band lift** (`box-shadow: 0 32px 56px -32px rgb(14 15 12 / 0.45)` with translateY(-6px)): product bands on hover or focus-within.
- **Icon drop** (`box-shadow: 0 12px 24px -12px rgb(14 15 12 / 0.45)`): large app icons inside bands.
- **Header scrolled** (`box-shadow: 0 1px 0 rgb(14 15 12 / 0.1), 0 12px 24px -20px rgb(14 15 12 / 0.4)`): appears only after scrolling.

### Named Rules
**The Fill Not Line Rule.** Surfaces separate by fill colour and radius, never by 1px outlines or rings. The only rules in the system are native ones: the receipt's 2px ink total line, the faint divider above the footer base, the scrolled-header edge, the 1px "or" rules and 2px delete-zone rule on the account page, and the 4px ring on an app band opened by a `#app` link (it shows where the visitor landed).

## Shapes

Large, soft rectangles and full pills. Section-scale surfaces (receipt, bands, rule cards, closing panel) use 32px, dropping bands to 24px under 860px; inner rows use 16-22px; every button, chip, nav link and replay control is a 999px pill. App icons are rounded squares (about 24% radius at band scale, 8-15px when small). Checkmarks are lime circles with a drawn forest tick. Focus is a 3px forest outline offset 3px with an 8px radius.

## Components

### Buttons
Confident, chunky pills that grow slightly under the pointer.
- **Shape:** full pill (999px), minimum height 48px (60px large, 44px in the header).
- **Primary (lime):** lime fill, forest text, 600 weight, 12px 24px padding; inline SVG arrows at 18px.
- **Hover / Active:** lime lifts to lime-hover and scales to 1.03; pressed goes to lime-press at 0.97. Transitions 0.2s on the long-tail ease-out.
- **Secondary (sage):** sage fill, ink text, deep-sage hover; pairs with lime in the hero.
- **Inverse (forest):** forest fill, lime text; the primary action on lime, sage or pale bands.
- **Ghost:** a translucent tint of the band's own text colour (8-14% on light, 12-20% on forest), inheriting text colour; store links and secondary band actions.

### Chips
- **Style:** pill, 600 at 15px, 8px 14px; fill is white at 70% on sage/pale, forest at 10% on lime, lime at 14% with lime text on forest.
- **State:** static facts; they rise 4px in a 60ms stagger when their band is hovered or focused.

### Cards / Containers
- **Corner Style:** 32px (lg).
- **Background:** white on sage grounds; sage, forest, lime or pale for product bands; lime for the closing panel.
- **Shadow Strategy:** flat, except the receipt (Float) and hovered bands (Band lift).
- **Border:** none.
- **Internal Padding:** fluid, roughly 24px to 56px.

### Navigation
- **Style:** brand lockup (36px mark, Inter 900 at 21px, forest) left; 600 15px ink text links as pills with sage hover; a lime pill CTA last. Below 860px only the lime pill stays. Header is 94% white and gains the scrolled shadow after 8px of scroll.
- **Footer:** forest ground, pale text, lime brand and column heads, four columns collapsing to two.

### Receipt (signature)
A white Float card listing each product as a sage row (48px icon, 600 name with a 14px body-grey subline, a lime check and a 900 tabular figure), closed by a 2px ink rule and a forest total at headline scale. With JS, rows dim, a lime sheen scans across each in turn, values settle, and the total stamps in from blur and 1.35x scale; a small sage "Replay" pill reruns it. Without JS or with reduced motion it is shown complete.

### Forms
Careers, enquire and the account page share one form: a canvas card (28px radius, Float shadow) holding 600 labels over 52px-tall fields with a 2px Deep Sage border that turns Forest on focus, a lime pill submit, and a status note above the fields. On a phone the field column is `minmax(0, 1fr)` and inputs are full width, so no field can widen the page. Careers and enquire open an email draft (or WhatsApp) and never send from the page; the enquire form also posts payload v1 to a CRM endpoint when one is configured.

### Product Band (signature)
A full-width 32px slab that redefines its local palette (background, text, name, soft text, chip, ghost) per variant: sage default, forest, lime, pale. Holds a large icon, a 900 band-scale name, a 600 job line, a lede-size description, fact chips and an action row. Reveals by rising 40px on scroll (JS only); on hover or focus it lifts, the icon tilts -8deg and scales 1.06, and the chips rise in stagger.

## Do's and Don'ts

### Do:
- **Do** make the next action a lime pill with forest text, or a forest pill with lime text when the ground is lime, sage or pale.
- **Do** set every title-size-and-up line in Inter 900, forest, with negative tracking and line height under 1.
- **Do** separate surfaces with fill colour (white on sage, sage on white, coloured bands) and 16 / 24 / 32px radii.
- **Do** use the single long-tail ease (cubic-bezier(0.16, 1, 0.3, 1)) for movement and give every animation a prefers-reduced-motion path and a complete no-JS state.
- **Do** use tabular numerals for figures and totals.
- **Do** inline icons as stroked SVG in currentColor.

### Don't:
- **Don't** outline cards, rows or bands with 1px borders or rings; the receipt total rule and footer divider are the only rules.
- **Don't** set display type in black or at weights below 900.
- **Don't** use square or small-radius buttons; every control is a pill.
- **Don't** introduce a second display family, a mono, or uppercase tracked labels.
- **Don't** put more than one lime-filled primary action in the same group.
- **Don't** stack heavy shadows; one Float object per view, lifts only on interaction.
