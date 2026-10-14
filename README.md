# Memory Jar — for Mena

A jar full of our little memories: shake it, pull one out, and add your own.
Part of the **Love for Mena** collection.

**Live:** https://menaammarpro.github.io/love-memory-jar/

## What it does

- Shows a jar of memories; **Draw a memory** shakes the jar and unfolds a
  random note
- **Add a memory** lets you (or Mena) drop a new one in — saved in the
  browser, on that device only
- **All memories** lists everything in the jar
- Offline-capable PWA

## Editing the starting memories

Open `js/memories-data.js` and edit the `window.MENA_MEMORIES` array — each
item is `{ text, date? }`. These are the ones everyone sees; anything added on
the page only lives in that visitor's browser.

## Files

- `index.html` — the page
- `css/theme.css` — shared love-theme (copied from `_love-theme/`)
- `css/app.css` — page-specific styles (the jar lives here)
- `js/theme-main.js`, `js/effects.js` — shared behaviour/effects
- `js/memories-data.js` — the starting memories
- `js/app.js` — draw / add / reset logic
- `manifest.webmanifest`, `sw.js` — PWA
- `assets/` — favicon and icons

## Run locally

```powershell
py -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

Static site, deployed with GitHub Pages from `main`.

## License

Creative Commons BY-NC-ND 4.0 — see [`LICENSE`](LICENSE).
© 2026 Ammar (MenaAmmarPro). Made with care for Mena.
