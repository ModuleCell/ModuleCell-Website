# ModuleCell Daily Visual Archive — Agent Instructions

See [CLAUDE.md](./CLAUDE.md) for full architecture, environment notes (`%LOCALAPPDATA%\modulecell-tools` for `sharp` on Windows), GitHub Pages rules, and the Daily Publish Workflow.

Paired Creation Studio: `g:\Other computers\ModuleCell-25\01_Career\04_Hobby\05_Daily Creation` (keep all working drafts, raw files, audio, and 3D scenes there under `YYYY_MMDD_<Short_Topic>\`; only copy selected finals into `_raw/<entry-id>/` when publishing).

Quick commands (from `07_ModuleCell_Daily`):
- Build static pages & WebP assets: `node scripts/build.mjs`
- Local preview server (`http://127.0.0.1:4173`): `node scripts/serve.mjs`
- Create entry + build: `node scripts/new-entry.mjs --date YYYY-MM-DD --title-en "..." --title-zh "..." --medium-en "..." --medium-zh "..." --caption-en "..." --caption-zh "..." --images "path1.png,path2.png"`
