# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Hibiscus Coral Inn — Build Brief

Static marketing site for a small, owner-run inn on **Bantayan Island, Cebu,
Philippines**. Mobile-first. No booking system. Enquiries go to WhatsApp.

**Audience: non-divers.** In October 2026 the client split the old site
(`../HibiscusDiveInn`, "Hibiscus Dive Inn") in two. This repo is the rooms
site, marketed to people who come for the island. Diving is run by the owners'
own dive centre, **Island Divers**, which gets one short section here that
links out to its Google Maps listing. It will get its own site later. Do not
grow diving back into this site.

Room details are placeholders until the owner finishes the rooms.

---

## 1. Scope

**In scope**

- One page: hero, about, rooms, Island Divers mention, getting here, contact
- WhatsApp deep link with a prefilled enquiry template as the primary CTA
- Static build, deployed to Cloudflare Pages

**Out of scope — do not build**

- Booking engine, availability calendar, date pickers, payments
- Database, CMS, admin panel, authentication
- Contact form with a backend (WhatsApp + `mailto:` only)
- Cookie banner (Cloudflare Web Analytics is cookieless)
- Multi-language support
- Dive sites, courses, instructor pages — those belong to the dive site

A booking system (Payload + Postgres + PayMongo) is deferred. Do not build
toward it, but keep content in structured files so it is not made harder.
The client expects guests to "book" eventually — the WhatsApp template is the
current answer to that.

---

## 2. Stack

| Concern   | Choice                                                               |
| --------- | -------------------------------------------------------------------- |
| Framework | **Astro** 7, static output, no client JS beyond the map loader       |
| Styling   | Plain CSS with custom properties. No Tailwind, no CSS-in-JS          |
| Content   | Astro Content Collections (markdown) + `src/config/site.ts`          |
| Images    | `astro:assets` — AVIF, responsive `srcset`, lazy below the fold      |
| Fonts     | Self-hosted woff2 in `src/assets/fonts`. No Google Fonts request     |
| Analytics | Cloudflare Web Analytics, injected only once a token is set          |
| Host      | Cloudflare Pages, from `main`                                        |

**No React, Vue, or Svelte.** Performance target: Lighthouse mobile 95+ across
the board, LCP under 2.0s on throttled 4G. Guests load this on Philippine
mobile data.

---

## 3. Design direction

### Section tones

Each section carries a `data-tone` that sets its background. The page gets
gradually warmer toward the dark contact section:

```
hero          sunset photograph
about         linen   #FBF6EE
rooms         sand    #F5EBDA
island divers warm    #EFDDC4
getting here  ochre   #E8C9A4
contact       plum    #2C2134  (footer stays plum)
```

A "time of day" concept (section time labels and a sun mark) was tried and
removed in October 2026. Do not reintroduce it.

### Colour

Taken from the logo. `src/styles/tokens.css` is the source of truth;
`scripts/check-contrast.mjs` mirrors it and must be kept in step.

```
--ink        #2A1E19   text on light tones
--sea        #1B5873   links on light tones
--hibiscus   #B3302A   CTA fill (white text) — interactive only
--sun        #E9A23B   accent and CTA hover on plum; never text on a light tone
--sun-pale   #F5C46A   CTA fill and links on plum
```

Components use only the semantic tokens (`--bg`, `--fg`, `--cta-bg` …), so a
tone change re-themes everything inside a section.

### Type

- **Display:** Fraunces Variable, "soft" cut, `font-variation-settings: 'SOFT' 100`
- **Body:** Figtree Variable. Minimum 17px on mobile. Fluid `clamp()` scale

Avoid the generic resort look: no turquoise gradients, no palm-leaf dividers,
no carousels.

---

## 4. Content model

All copy lives in content files — Daniel maintains this alone, and edits must be
one-file changes.

```
src/content/rooms/*.md      one per room type (Zod schema in content.config.ts)
src/content/pages/*.md      one per homepage section
src/config/site.ts          contact details, WhatsApp template, metadata
src/config/images.ts        photo manifest — every image the site needs
```

### Placeholders

Unconfirmed values use the `TODO_` convention (`TODO_EMAIL`,
`TODO_RATE_DOUBLE`). `src/integrations/placeholder-guard.ts` **fails a
production build** while any remain and lists them. In dev they render as
visible badges. `PREVIEW=true` allows a noindexed client preview.
**Never invent** rates, travel times, fares, distances or facts about the
island — use a placeholder.

---

## 5. The WhatsApp CTA

`<WhatsAppLink context="the Double Room">` → `https://wa.me/{number}?text=…`

```
Hi Hibiscus Coral Inn! I'd like to ask about a stay.

Asking about: the Double Room      ← only when context is given

Dates:
Guests:
Arriving from:
```

"Arriving from" exists because getting across depends on the last bus and
ferry. `ContactMethods` adds a `tel:` link and a `mailto:` fallback beneath it.

### The map

`LocationMap.astro` shows a placeholder panel and loads the Google Maps iframe
only when a visitor taps "Show the map here". Do not embed the iframe
directly: it loads several hundred KB of Google's JavaScript and sets Google
cookies, which would break the speed target and the no-cookie-banner footing.
Without JS the panel is a plain link to Google Maps. The embed URL lives in
`CONTACT.mapsEmbedUrl`; keep its language pair at `!1sen!2sph`.

---

## 6. Quality floor

- Mobile-first: author for 360px, breakpoints at 768 and 1200
- Visible `:focus-visible` on every interactive element, tap targets 44px
- Semantic landmarks, one `<h1>`, alt text on every image
- `prefers-reduced-motion` respected everywhere
- WCAG AA contrast, verified by `npm run check:contrast`
- Works with JavaScript disabled
- SEO: `LodgingBusiness` JSON-LD with rooms as `Accommodation`, OG/Twitter
  card, sitemap + robots via `@astrojs/sitemap`, canonical URLs,
  geo-targeted titles and descriptions for Bantayan Island and Cebu

---

## 7. Acceptance

- [ ] One page complete, all sections content-driven
- [ ] All unconfirmed data behind `TODO_`; production build fails if unset
- [ ] Lighthouse mobile 95+ performance, accessibility, best practices, SEO
- [ ] No client JS beyond the click-to-load map (`LocationMap.astro`)
- [ ] `npm run check`, `check:contrast`, `format:check` clean
