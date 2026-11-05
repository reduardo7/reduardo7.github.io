# AGENTS.md

Static personal site published by GitHub Pages at <https://reduardo7.github.io/>.
No build, no dependencies, no tests, no CI. Pushing to `master` is the deploy —
GitHub Pages serves the repo root as-is.

## Commands

- `npm start` (alias `npm run dev`) → `node scripts/serve.js`, <http://127.0.0.1:8080/>.
  Override with `PORT=3000 npm start`, `HOST=0.0.0.0`.
- There is no lint/format/test script. `.prettierrc.js` + `.editorconfig` define the style
  (2 spaces, LF, 100 cols, single quotes, trailing commas); Prettier is not installed, so
  match it by hand and verify changes by loading the page.
- Node >= 18, standard library only. On this machine `node`/`npm` are not on `PATH`;
  activate NVM first (see the `node` skill) or every command fails with `command not found`.
- `scripts/serve.js` mirrors GitHub Pages: `/dir` 301s to `/dir/`, `/dir/` serves its
  `index.html`, everything is sent with `Cache-Control: no-store`. Preserve that behavior.

## Layout

- `index.html` is the current site, styled by `src/styles.css` (page) and
  `src/link-list.css` (standalone reusable component; its markup is documented in a header
  comment there and in `README.md`). Page-specific rules go in `styles.css`, not the component.
- To add a link, copy an `<li>` in `index.html` and set `--link-list-accent` (color) and
  `--i` (stagger index, 0,1,2…). The `01`, `02`… numbering is CSS `counter` output — never
  write it into the HTML.
- `x28-control/` and `akoko-privacy-policy.html` are legacy self-contained pages with inline
  CSS and a different look. Leave their style alone unless asked, and do not move or rename
  them: they are live URLs linked from Play Store listings.
- `git-productivity.sh` must stay at the repo root — it is distributed as
  `curl -s https://reduardo7.github.io/git-productivity.sh | bash`. It uses BSD `date -v`,
  so it only runs on macOS, not Linux/GNU date.

## Gotchas

- `src/script.js` validates the password and decrypts the Drive URL against hardcoded AES
  ciphertexts (CryptoJS loaded from a CDN). The passphrase is deliberately not in the repo.
  Do not re-encrypt, reformat, or try to "clean up" those blobs, and keep the
  `href="javascript:openDrive()"` item as-is.
- No bundler: `src/*.css` and `src/script.js` are loaded by the browser directly. Root pages
  use `src/…` or `/src/…`; a page in a subdirectory must use `/src/…` or `../src/…`.
- No `.nojekyll`, so GitHub Pages still runs Jekyll — files or directories starting with `_`
  are dropped from the published site. Add `.nojekyll` before introducing any.
- Page copy and the README are Spanish (`lang="es"`); keep new content in Spanish.
