import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from './build.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : '';
    args[key] = val;
  }
  return args;
}

function getTodayDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const date = args.date || getTodayDate();
  const imagePaths = (args.images || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (imagePaths.length === 0) {
    console.error(
      'Usage: node scripts/new-entry.mjs --date YYYY-MM-DD --title-en "..." --title-zh "..." --caption-en "..." --caption-zh "..." --images "img1.png,img2.png"'
    );
    process.exit(1);
  }

  const rawDir = path.join(ROOT, '_raw', date);
  const contentDir = path.join(ROOT, 'content', date);
  await fs.mkdir(rawDir, { recursive: true });
  await fs.mkdir(contentDir, { recursive: true });

  const images = [];
  for (const srcInput of imagePaths) {
    const srcAbs = path.resolve(srcInput);
    if (!existsSync(srcAbs)) {
      throw new Error(`Image file not found: ${srcAbs}`);
    }
    const filename = path.basename(srcAbs);
    const destRaw = path.join(rawDir, filename);
    if (path.resolve(destRaw) !== srcAbs) {
      await fs.copyFile(srcAbs, destRaw);
    }
    images.push({
      file: filename,
      alt: {
        en: args['title-en'] || `Daily creation ${date}`,
        zh: args['title-zh'] || args['title-en'] || `每日創作 ${date}`,
      },
    });
  }

  const tags = (args.tags || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const medium =
    args['medium-en'] || args['medium-zh'] || args.medium
      ? {
          en: args['medium-en'] || args.medium || args['medium-zh'],
          zh: args['medium-zh'] || args.medium || args['medium-en'],
        }
      : undefined;

  const entry = {
    date,
    title: {
      en: args['title-en'] || `Study ${date}`,
      zh: args['title-zh'] || args['title-en'] || `作品 ${date}`,
    },
    ...(medium ? { medium } : {}),
    caption: {
      en: args['caption-en'] || '',
      zh: args['caption-zh'] || args['caption-en'] || '',
    },
    tags,
    images,
  };

  await fs.writeFile(
    path.join(contentDir, 'entry.json'),
    JSON.stringify(entry, null, 2) + '\n',
    'utf8'
  );

  console.log(`Created content/${date}/entry.json with ${images.length} image(s). Building site...`);
  await buildSite();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
