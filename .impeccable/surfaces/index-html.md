---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: optionallabs.com homepage

Scope: `index.html` (homepage hub). Visitor mode: Persuade.

Audience and job: someone who met one Optional Labs app wants to know who makes it and whether to trust it, then reach that product. Action: open a product's site or store page. Proof: each app's own facts (on-device, no account), the "0 KB personal data sent" receipt.

Constraints: static HTML/CSS/JS, GitHub Pages, self-hosted fonts, no invented metrics or testimonials. Product facts only from each product's own site.

Chosen direction: user picked sketch E, "Wise theme" from VoltAgent/awesome-design-md (design-md/wise). Memorable moment: the receipt panel totalling every app at 0 KB.

Unresolved: Saifu and Parchi store links (not live yet); privacy-policy.html text describes an older referral app and needs the owner's rewrite.

## Direction contract

THESIS: Privacy shown as an accounting fact, not a slogan: a receipt that totals what our apps send us, and the total is zero. Refuses the dark studio grid of equal product cards.

OWN-WORLD: White canvas, sage neutral (#e8ebe6), lime (#9fe870) for every primary action, forest (#163300) for display ink, near-black body. Inter 900 display set tight (-0.04em, 0.88 line height), Inter 400/600 body. Big radii (24-32px) on white cards, pill buttons, hairline-free; depth from one soft shadow.

STORY: Visitor reads the headline, sees the receipt total 0 KB across four named apps, believes the claim because each row names what stays on the phone, then picks a product tile and leaves to its site or store.

FIRST VIEWPORT: Left 55%: headline "Your data. Your phone. Nobody else's." at ~112px forest, one lede line, lime pill "Explore the apps". Right 45%: receipt card with four app rows, revealed one by one, each settling on 0 KB, then the total stamps in. Sticky slim header: logo, Apps, How we build, Contact, lime pill.

FORM: Wise theme (user-pinned over the roll; roll assigned candidate 7, line map), seed key b75f8944. Signature interaction: receipt rows reveal in sequence on load and the total stamps in; a replay control reruns it; product tiles expand on hover/focus to show what stays on the phone.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
