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
- **Paired Creation Studio**: `g:\Other computers\ModuleCell-25\01_Career\04_Hobby\05_Daily Creation` — all creative drafts, raw photos, audio, Blender scenes, and notes live there under `YYYY_MMDD_<Short_Topic>\`. Keep working drafts out of this website folder.
- When the user finishes a creation in `05_Daily Creation`, drops files into `_inbox/`, or provides images (1–6 plates, plus optional audio) and a short note in Chinese or English:
  1. Determine the entry ID: `YYYY-MM-DD` (default today), or `YYYY-MM-DD-<slug>` if publishing multiple works on the same date. Copy final selected plate(s) (and optional audio file) into `_raw/<entry-id>/` (and clear any processed items from `_inbox/`).
  2. Write or refine concise bilingual `title` (`en` / `zh`), `medium` (`en` / `zh`), `caption` (`en` / `zh`), and image `alt` texts (no categories or tags). Include `createdAt` (`YYYY-MM-DDTHH:mm:ss`) for exact newest-first ordering and optional `focus: [x, y]` crop anchors.
  3. Create `content/<entry-id>/entry.json` (or run `node scripts/new-entry.mjs ...`).
  4. Run `node scripts/build.mjs` to generate compressed `media/<entry-id>/*-thumb.webp`, `*-full.webp`, `og.jpg`, optional audio assets, and updated `index.html`, `work/<entry-id>/index.html`, `about/index.html`, and `sitemap.xml`.
  5. Run `node scripts/serve.mjs` to preview locally at `http://127.0.0.1:4173` and wait for the owner's OK before committing or pushing.
