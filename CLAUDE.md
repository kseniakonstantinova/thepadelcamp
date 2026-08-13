# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing/booking site for **The Padel Camp Cyprus** (thepadelcamp.com.cy), a padel training camp event. Plain HTML/CSS/JS — no framework, no build step, no package.json. Deployed via GitHub Pages (see `CNAME`).

## Working locally

There is no build/lint/test tooling in this repo. Just edit the HTML/CSS/JS files directly and preview with any static file server, e.g.:

```
python -m http.server 8000
```

or open the HTML files directly in a browser.

## Architecture

### Bilingual pages via full duplication, not i18n

The site is EN/RU with **no templating or i18n framework** — each language is a fully separate set of HTML files:

- English pages live at the repo root: `index.html`, `partners.html`, `terms.html`, `privacy-policy.html`, `register/*.html`.
- Russian pages live under `ru/`, mirroring the same structure: `ru/index.html`, `ru/partners.html`, `ru/register/*.html`, etc.
- Root-level `*-ru.html` files (`index-ru.html`, `partners-ru.html`, `terms-ru.html`, `privacy-policy-ru.html`) are **legacy redirect stubs** — each is a 12-line meta-refresh page pointing to the corresponding `/ru/...` page. They exist only to preserve old URLs; don't add real content to them.

Because content is duplicated rather than generated, **any structural change (header, modals, footer, form markup) made to an EN page must be manually mirrored in its RU counterpart**, and vice versa. `index.html` and `ru/index.html` are the largest and most important pair (1163 lines each).

All pages share one stylesheet, `assets/css/style.css` (~4400 lines) — there's no per-page or per-language CSS.

### Shared JS, no bundler

- `assets/js/main.js` — all interactive behavior for the main pages: mobile menu, countdown timer, program tabs, FAQ/approach accordions, header scroll effect, venue gallery modal, and every booking/registration form (camp registration, service booking, massage booking, media package).
- `assets/js/pixels.js` — GDPR-gated analytics: shows a cookie consent banner, and only loads Meta Pixel / GA4 / Google Ads (`META_PIXEL_ID`, `GA4_ID`, `GADS_ID` constants at the top) after the user accepts. `trackRegistration`, `trackBooking`, `trackContact` are the event helpers other code calls into; they no-op unless consent was accepted (checked via `localStorage['cookie_consent']`).

### Form submission flow

All forms (registration, massage booking, service booking, media package) funnel through `sendToGoogleSheets()` in `main.js`, which POSTs JSON to a single Google Apps Script Web App URL (`GOOGLE_SCRIPT_URL` constant, `mode: 'no-cors'` so the response isn't read). That script forwards submissions to Google Sheets + Telegram — it isn't part of this repo.

After submit, the JS swaps the modal's inner HTML in place to show a payment screen: a Stripe Checkout link plus a QR code image (`assets/qr/*.jpeg`) for bank transfer, then a WhatsApp deep link (`wa.me/...`) to confirm payment. Stripe links, QR image paths, and prices are hardcoded per price tier directly in the submit handlers in `main.js` — when a price or Stripe link changes, update it there (and in the mirrored RU copy path if the flow differs per language).

### Pages outside the site nav

`docs/*.html` (`email-padel-massage.html`, `email-private-lessons.html`) are standalone HTML email templates, not linked from site navigation and not part of the deployed page structure.

### SEO/meta plumbing

Every page pair cross-references its counterpart via `<link rel="alternate" hreflang="en|ru">` and sets a `canonical` URL — keep these in sync when adding or renaming pages, and update `sitemap.xml` accordingly.
