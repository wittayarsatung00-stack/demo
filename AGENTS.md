# Repo notes

Static marketing site for a Thai aluminium/glass installer ("ทรัพย์ไพศาล อลูมิเนียม").
One page: `index.html` with inline CSS + one inline script (the gallery filter). No build
step, no package manager, no backend, no database, no environment variables or secrets.

## Running it

```sh
docker compose -f docker-compose.base44.yml up -d   # nginx:alpine, host port 3000 -> container 80
docker compose -f docker-compose.base44.yml ps
```

The checkout is bind-mounted read-only at nginx's web root, so the running site is always
the current source. There is no dev server / HMR: after editing `index.html` or swapping an
image, the change appears on the next page load (force a preview reload if needed).

## Things worth knowing

- All images referenced by `index.html` must sit next to it at the repo root, because every
  `src`/`url()` is a bare relative filename (e.g. `ประตู7.jpg`, `Hero.jpg`).
- `index.zip` is the original upload bundle for those images. Its entries are stored with
  mojibake names (Thai bytes read as cp437) and its `index.html` is identical to the root
  one, so the images were extracted once with
  `name.encode('cp437').decode('cp874')` and are now plain files in the repo. Do not
  re-extract over the root `index.html` — the zip's copy is the stale duplicate.
- One extracted file is named `ประตุ1.jpg` (short vowel) exactly as in the bundle; it is not
  referenced by the page. The referenced door photos are `ประตู7.jpg` … `ประตู14.jpg`.
- The only interactive behaviour is `filterGallery()` (the portfolio filter buttons) —
  verify it by clicking a filter and checking that gallery items hide/show.
