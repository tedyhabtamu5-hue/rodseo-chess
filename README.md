# RODSEO - Can you beat the last AI humanity created?

Static site. No build step, no server, no API keys.

## Publish on GitHub Pages
1. Create a new GitHub repository.
2. Upload every file in this folder (including `.nojekyll`) to the repository root.
3. Settings -> Pages -> Source: "Deploy from a branch" -> branch `main`, folder `/ (root)` -> Save.
4. The site appears at https://YOUR-NAME.github.io/REPO-NAME/ after about a minute.
5. Custom domain: Settings -> Pages -> Custom domain, then point your DNS to GitHub Pages.

It must be served over http(s). Opening index.html by double-click can block the engine workers.

## Install as an app
The site is a PWA. On Chrome/Edge (Android and desktop) an "Install app" button appears on the home page, and the browser
also offers install from its menu. On iPhone/iPad use Safari: Share -> Add to Home Screen. Installing needs https
(GitHub Pages and real domains have it). After the first visit the game also opens offline.
When you change any file, raise VERSION in `sw.js` (for example rodseo-v2) so players receive the update.

## Files
- `index.html`    interface, sounds, clocks, save/resume, ban system
- `chess-lite.js` chess rules (verified against standard perft counts)
- `engine.js`     built-in engine, runs in a Web Worker
- `sf-worker.js`  loads the real Stockfish in a Web Worker
- `manifest.webmanifest`, `sw.js`, `icons/`  app install + offline support

## Stockfish (the strong AI)
`sf-worker.js` tries `vendor/stockfish.js` first, then public CDNs. For guaranteed strength, download the
single-file asm.js build of stockfish.js (v10) and save it as `vendor/stockfish.js`. If Stockfish cannot load,
the built-in engine plays instead, so the game never breaks, but it is much weaker.

## Ban and saving
- Games are saved in the browser after every move and resume after a refresh.
- Tampering (edited save data, edited clocks, illegal moves) bans the device for 5 minutes.
- Browser-only: clearing site data or using another browser/incognito removes it. A real ban needs a server.
