# Hibiscus Coral Inn

Static marketing site for a small inn on Bantayan Island, Cebu, Philippines.
One page, aimed at people who come for the island rather than the diving. No
booking system — enquiries go to WhatsApp.

Built with [Astro](https://astro.build), plain CSS, and no client-side framework.
The production build ships one small inline script: the button that loads the
Google map on request. Everything else works with JavaScript off.

The owners' dive centre, Island Divers, gets one short section that links out.
Its full site lived in the previous repo (`../HibiscusDiveInn`) and will become
its own site later.

---

## Running it

You need [Node](https://nodejs.org) 22 or newer. The version is pinned in `.nvmrc`,
so `nvm use` will pick it up.

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command                       | What it does                                           |
| ----------------------------- | ------------------------------------------------------ |
| `npm run dev`                 | Development server, with placeholder warnings          |
| `npm run build`               | Production build. **Fails** while any `TODO_` remains  |
| `npm run build:preview`       | Client preview build — noindexed, placeholders allowed |
| `npm run preview`             | Serve the last build locally                           |
| `npm run check`               | Type-check components and validate content files       |
| `npm run check:contrast`      | Verify every colour pairing against WCAG AA            |
| `npm run placeholders`        | List every value still to confirm with the owner       |
| `npm run images:placeholders` | Create stand-in photos for anything missing            |
| `npm run images:og`           | Rebuild the social sharing card from the hero photo    |
| `npm run format`              | Format everything with Prettier                        |

> If the dev server starts reporting collections as empty or content files as
> missing when they are plainly there, its content store is stale. Fix it with
> `npx astro dev stop && rm -rf .astro && npm run dev`.

---

## Deploying

Cloudflare Pages builds from `main` automatically. Settings:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 22

Every pull request runs formatting, type-checking, the contrast audit and a full
build through GitHub Actions (`.github/workflows/ci.yml`).

**The production build deliberately fails while any `TODO_` placeholder remains.**
That makes it impossible to ship a page with an invented ferry time or an unset
email address on it. Run `npm run placeholders` to see what is outstanding.

### Previews for the client

```bash
npm run build:preview                          # PREVIEW=true astro build
npx wrangler pages deploy dist --project-name=hibiscus-coral-inn
```

`PREVIEW=true` lets the build through with placeholders still showing as badges,
and in the same stroke adds `noindex`, blocks everything in `robots.txt`, and
drops the sitemap — a placeholder-filled `.pages.dev` URL must not be indexed.
**Never set `PREVIEW` on the production deployment.**

`ALLOW_PLACEHOLDERS=1` (`npm run build:audit`) also builds through placeholders
but stays indexable, for local Lighthouse runs only.

---

## Before launch

`npm run placeholders` prints the current list with file names and line numbers.

**Contact details — `src/config/site.ts`.** The WhatsApp number
(`+63 977 328 4208`) is set. Still needed: `TODO_SITE_URL`, `TODO_EMAIL`,
`TODO_ADDRESS`, `TODO_FACEBOOK_URL`, `TODO_INSTAGRAM_URL`,
`TODO_CLOUDFLARE_ANALYTICS_TOKEN`. The map, map link and coordinates are set
from the inn's Google Maps listing. The site
builds against `https://hibiscus-coral-inn.pages.dev` until the real domain is
set in `astro.config.mjs` (marked `TODO`).

**Rates and travel — `src/content/`.** Room rates and what each rate covers;
the bus journey time and fare; bus and ferry times. **None of these were
invented** — guessing at a ferry time is worse than shipping nothing.

---

## Changing the content

All the words live in `src/content/`. Nothing is written into the components,
so a text change is a one-file edit.

```
src/content/
  rooms/                 one file per room type
    single.md
    double.md
    four-person.md
  pages/                 one file per homepage section
    about.md             "A small place…"
    rooms.md             heading and intro above the room cards
    island-divers.md     the short diving mention
    getting-here.md      the journey, including bus and ferry times
    contact.md           heading and intro above the contact details
```

Each file has a block of settings between `---` lines, then the body text.
Changing the body text is always safe. If a setting is misspelt or deleted,
`npm run check` says exactly what broke rather than the page quietly rendering
wrong. Room order is the `order:` number — lower first.

---

## Photographs

There are almost no usable photos yet: what the owners have is nearly all
underwater. Missing images are solid colour blocks at the exact size the real
photo should be, so dropping one in is a straight file replacement — same
filename, into `src/assets/images/`. `npm run images:placeholders` recreates any
that go missing and never overwrites a real photo.

This mirrors `src/config/images.ts`:

| File                   | Size        | What it should show                                                                                        |
| ---------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `hero.jpg`             | 2400 × 1600 | ✅ Sunset swim off the beach. A wide shot of the inn or its shoreline at golden hour would be better still |
| `about.jpg`            | 1600 × 2000 | The inn itself — front, garden, veranda, or the owners. Portrait                                           |
| `room-single.jpg`      | 1600 × 1200 | The single room, from the doorway, bed and window in frame. Daylight                                       |
| `room-double.jpg`      | 1600 × 1200 | The double room, from the doorway so the whole room reads in one frame. Daylight                           |
| `room-four-person.jpg` | 1600 × 1200 | The four-person room, wide enough to show all the beds. Daylight                                           |
| `island-divers.jpg`    | 1600 × 1200 | ✅ Turtle over white sand. Bright and calm suits non-divers better than deep blue                          |

The social sharing card, `public/og-default.jpg`, is generated from `hero.jpg`.
Run `npm run images:og` after replacing the hero.

---

## For the owner — sending photos and text changes

You do not need to touch any of the above. Send Daniel:

**Photos.** The originals, straight off the camera or phone — do not resize,
crop or compress them. Bigger is better; they get shrunk automatically. Say
which room each one is of. Daylight, doors and windows open, beds made. The
table above is the list of what is needed — the rooms matter most.

**Text.** Write it in a message, saying which part of the site it belongs to
("the About bit", "the Double Room"). It does not need formatting.

**Prices, times and fares.** These are what is holding up launch. For each
room: the nightly rate, what it includes, and whether it changes by season. For
the journey: how long the bus from Cebu City to Santa Fe takes, what it costs,
and roughly when the buses and ferries run.

**A new logo.** The current logo still says "Hibiscus Dive Inn" and has a diver
in it. Until there is one with the new name, the site uses the name set in type.

---

## How it is put together

- **`src/config/site.ts`** — contact details, WhatsApp message, metadata
- **`src/config/images.ts`** — the photo manifest above
- **`src/content.config.ts`** — the rules each content file must follow
- **`src/styles/tokens.css`** — colours, type scale, spacing, the tones
- **`src/components/`** — layout and page sections
- **`src/integrations/placeholder-guard.ts`** — what fails the build

Each section sets a `data-tone` — `linen`, `sand`, `warm`, `ochre` or `plum` —
that picks its background, and everything inside follows from it. The page
gets gradually warmer down to the dark plum contact section and footer.
