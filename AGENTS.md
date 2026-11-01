# ST aluminum — working notes

## What this repo is
A single-page static marketing site (Thai) for **ST aluminum**, a glass & aluminium
installation contractor (รับเหมาติดตั้งกระจก อลูมิเนียม). No framework, no build step,
no package manager.

- `index.html` — the whole page (hero, trust strip, services, works, process, FAQ, contact, footer)
- `assets/css/tokens.css` — design tokens (palette, Fibonacci spacing, Φ type scale)
- `assets/css/site.css` — section + component styles
- `assets/js/site.js` — nav, scroll state, works lightbox, FAQ accordion, quote form
- `assets/img/*.jpg` — imagery (`hero-install`, `svc-*` service cards, `work-01…06`, `og-cover`)

## Running it
```bash
docker compose -f docker-compose.base44.yml up -d
```
`web` is `python:3.12-slim` running `python -m http.server 3000` with the repo bind-mounted,
so edits are served immediately (hard-refresh if a browser cached a file). There is nothing
to install, build, or migrate.

Verify: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → `200`, and the page
must return the real markup (`<title>ST aluminum …`), not a directory listing.

## Things that are easy to break
- Type sizes and spacing come from the Fibonacci tokens (`--f8 … --f89`) and the `1.618`
  ratios (hero 38.2/61.8, works 2-column feature span). Keep new sections on that system.
- The works grid expects exactly 6 tiles: one `.work--feature` (2×2) plus 5 singles fills the
  3-column grid.
- Section labels/menu use the same `#services #works #process #faq #contact` ids as the nav
  anchors; renaming a section means updating both.
- Thai copy needs `IBM Plex Sans Thai`; headings use `Inter Tight`. Body line-height is 1.618.
- Images are generated, then the bottom ~11% is cropped away to remove the generator's
  watermark — keep that in mind when swapping in new photos.

## Contact details
Phone, LINE, email and service area in the page are placeholders for the brand and should be
replaced with the client's real data.
