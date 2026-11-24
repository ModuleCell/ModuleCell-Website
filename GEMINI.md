# ModuleCell Daily Visual Archive — Agent Instructions

See [CLAUDE.md](./CLAUDE.md) for full architecture, environment notes (`%LOCALAPPDATA%\modulecell-tools` for `sharp` on Windows), GitHub Pages rules, and the Daily Publish Workflow.

Quick commands (from `07_ModuleCell_Daily`):
- Build static pages & WebP assets: `node scripts/build.mjs`
- Local preview server (`http://127.0.0.1:4173`): `node scripts/serve.mjs`
- Create entry + build: `node scripts/new-entry.mjs --date YYYY-MM-DD --title-en "..." --title-zh "..." --caption-en "..." --caption-zh "..." --tags "Tag1,Tag2" --images "path1.png,path2.png"`
