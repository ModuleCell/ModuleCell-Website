# ModuleCell Daily Visual Archive

- Live site target: `https://www.modulecell.com` (GitHub Pages, repo `ModuleCell/ModuleCell-Website`, branch `main`).
- Domain DNS: Wix A records (`185.199.108-111.153`) + `www` CNAME -> `modulecell.github.io`. Keep `CNAME` and `.nojekyll` in repo root.
- Aesthetic: Warm archival museum paper (`#F6F4EF` paper, `#EFECE5` linen, `#161614` ink), geometric-dialogue gallery on `index.html` using strictly 4 pure shapes (square, rectangle, circle, parallelogram) composed in relational groupings (shared datum horizons, centerline axes, Bauhaus circle-square ratios, parallel diagonal shears) with randomized close-up detail framing (all personal creations, no categories/tags, strictly ordered by creation time newest-first), dedicated `work/YYYY-MM-DD/index.html` detail pages showing the full uncropped plates with Open Graph previews + `<dialog>` fullscreen zoom, and minimalist `about/index.html`.
- Bilingual: EN / Traditional Chinese (`zh-Hant`), auto-detected in `<head>` with top-right `EN / 中文` toggle.

## Important Environment Note (Windows + Google Drive `G:\`)
- This folder lives on Google Drive (`G:\`), where `npm install` cannot reliably extract `node_modules`.
- Keep `node_modules/` out of `G:\`. Instead, `sharp` is installed in `%LOCALAPPDATA%\modulecell-tools`:
  ```powershell
  npm.cmd --prefix "$env:LOCALAPPDATA\modulecell-tools" install sharp
  ```
- `scripts/build.mjs` automatically loads `sharp` from local `node_modules` first and falls back to `%LOCALAPPDATA%\modulecell-tools`.

## Rules
- `_raw/` and `_inbox/` are gitignored and local-only. Never commit uncompressed raw PNGs/originals to the public GitHub repository; only commit optimized WebP/JPG assets inside `media/`.
- Never push to GitHub without the owner's explicit OK. Before switching `ModuleCell/ModuleCell-Website` `main` to this new site, archive the previous `main` branch (e.g., `archive/openbim-2026`) so nothing is lost.
- Edit brand copy, studio statement, email, and social links in `site.config.json`, then run `node scripts/build.mjs`.

## Daily Publish Workflow (for Antigravity / AI Assistant)
When the user drops files into `_inbox/` or provides images (1–6 plates) plus a short note in Chinese or English:
1. Determine the date (`YYYY-MM-DD`, default today) and move/copy raw images into `_raw/<date>/` (clearing processed items from `_inbox/`).
2. Write or refine concise bilingual `title` (`en` / `zh`), `caption` (`en` / `zh`), and image `alt` texts (no categories or tags needed).
3. Create `content/<date>/entry.json` (or run `node scripts/new-entry.mjs ...`).
4. Run `node scripts/build.mjs` to generate compressed `media/<date>/*-thumb.webp`, `*-full.webp`, `og.jpg`, and updated `index.html`, `work/<date>/index.html`, `about/index.html`, and `sitemap.xml`.
5. Run `node scripts/serve.mjs` to preview locally at `http://localhost:4173` and wait for the owner's OK before committing or pushing.
