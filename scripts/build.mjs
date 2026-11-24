import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const RAW_DIR = path.join(ROOT, '_raw');
const MEDIA_DIR = path.join(ROOT, 'media');

function loadSharp() {
  try {
    const localReq = createRequire(import.meta.url);
    return localReq('sharp');
  } catch {
    const toolsDir =
      process.env.MODULECELL_TOOLS_DIR ||
      path.join(process.env.LOCALAPPDATA || '', 'modulecell-tools');
    const toolsPkg = path.join(toolsDir, 'package.json');
    if (toolsDir && existsSync(toolsPkg)) {
      try {
        const toolsReq = createRequire(toolsPkg);
        return toolsReq('sharp');
      } catch (err) {
        throw new Error(`Failed loading sharp from ${toolsDir}: ${err.message}`);
      }
    }
    throw new Error(
      'Cannot find "sharp". Run:\n  npm.cmd --prefix "%LOCALAPPDATA%\\modulecell-tools" install sharp'
    );
  }
}

const sharp = loadSharp();

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'plate';
}

function formatDotDate(dateStr) {
  return dateStr.replaceAll('-', '.');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function needsRebuild(srcPath, destPath) {
  try {
    const [srcStat, destStat] = await Promise.all([fs.stat(srcPath), fs.stat(destPath)]);
    return srcStat.mtimeMs > destStat.mtimeMs;
  } catch {
    return true;
  }
}

async function resolveSourceImage(slug, filename) {
  const candidates = [
    path.join(RAW_DIR, slug, filename),
    path.join(CONTENT_DIR, slug, filename),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  throw new Error(`Source image not found for ${slug}: ${filename} (checked _raw/${slug} and content/${slug})`);
}

async function processImage(slug, imageItem, index) {
  const srcPath = await resolveSourceImage(slug, imageItem.file);
  const outDir = path.join(MEDIA_DIR, slug);
  await ensureDir(outDir);

  const baseSlug = `${String(index + 1).padStart(2, '0')}-${slugify(imageItem.file)}`;
  const thumbName = `${baseSlug}-thumb.webp`;
  const fullName = `${baseSlug}-full.webp`;
  const thumbPath = path.join(outDir, thumbName);
  const fullPath = path.join(outDir, fullName);

  if (await needsRebuild(srcPath, thumbPath)) {
    await sharp(srcPath)
      .rotate()
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(thumbPath);
  }

  if (await needsRebuild(srcPath, fullPath)) {
    await sharp(srcPath)
      .rotate()
      .resize({ width: 2200, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(fullPath);
  }

  let ogRel = null;
  if (index === 0) {
    const ogPath = path.join(outDir, 'og.jpg');
    if (await needsRebuild(srcPath, ogPath)) {
      await sharp(srcPath)
        .rotate()
        .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(ogPath);
    }
    ogRel = `media/${slug}/og.jpg`;
  }

  const [thumbMeta, fullMeta] = await Promise.all([
    sharp(thumbPath).metadata(),
    sharp(fullPath).metadata(),
  ]);

  return {
    thumbRel: `media/${slug}/${thumbName}`,
    fullRel: `media/${slug}/${fullName}`,
    ogRel,
    thumbWidth: thumbMeta.width || 900,
    thumbHeight: thumbMeta.height || 675,
    fullWidth: fullMeta.width || 1600,
    fullHeight: fullMeta.height || 1200,
    focus: Array.isArray(imageItem.focus) && imageItem.focus.length === 2 ? imageItem.focus : null,
    altEn: imageItem.alt?.en || '',
    altZh: imageItem.alt?.zh || imageItem.alt?.en || '',
  };
}

function renderHead({ titleEn, titleZh, description, canonicalUrl, ogImageUrl, prefix }) {
  const safeTitleEn = escapeHtml(titleEn);
  const safeTitleZh = escapeHtml(titleZh);
  const safeDesc = escapeHtml(description);

  return `<!DOCTYPE html>
<html lang="en" data-lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title data-title-en="${safeTitleEn}" data-title-zh="${safeTitleZh}">${safeTitleEn}</title>
  <meta name="description" content="${safeDesc}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${safeTitleEn}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  ${ogImageUrl ? `<meta property="og:image" content="${escapeHtml(ogImageUrl)}">` : ''}
  <meta name="twitter:card" content="${ogImageUrl ? 'summary_large_image' : 'summary'}">
  <meta name="twitter:title" content="${safeTitleEn}">
  <meta name="twitter:description" content="${safeDesc}">
  ${ogImageUrl ? `<meta name="twitter:image" content="${escapeHtml(ogImageUrl)}">` : ''}
  <script>
    (() => {
      try {
        const saved = localStorage.getItem('mc_lang');
        const lang = saved === 'zh' || saved === 'en'
          ? saved
          : ((navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');
        document.documentElement.dataset.lang = lang;
        document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
      } catch {
        document.documentElement.dataset.lang = 'en';
        document.documentElement.lang = 'en';
      }
    })();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Noto+Sans+TC:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${prefix}assets/styles.css">
</head>`;
}

function renderHeader({ config, prefix, currentPage }) {
  const homeCurrent = currentPage === 'archive' ? ' aria-current="page"' : '';
  const aboutCurrent = currentPage === 'about' ? ' aria-current="page"' : '';

  return `<header class="site-header">
  <div class="container header-inner">
    <a href="${prefix}index.html" class="brand-link">
      <span class="brand-wordmark">${escapeHtml(config.brand)}</span>
    </a>
    <nav class="header-nav" aria-label="Primary">
      <a href="${prefix}index.html" class="nav-item"${homeCurrent}>
        <span class="t-en">Works</span>
        <span class="t-zh">創作</span>
      </a>
      <a href="${prefix}about/index.html" class="nav-item"${aboutCurrent}>
        <span class="t-en">About</span>
        <span class="t-zh">關於</span>
      </a>
      <div class="lang-switch" role="group" aria-label="Language">
        <button type="button" class="lang-btn is-active" data-set-lang="en" aria-pressed="true">EN</button>
        <span class="lang-sep" aria-hidden="true">/</span>
        <button type="button" class="lang-btn" data-set-lang="zh" aria-pressed="false">中文</button>
      </div>
    </nav>
  </div>
</header>`;
}

function renderFooter(config) {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <span>&copy; ${year} ${escapeHtml(config.brand)}</span>
    <span>
      <span class="t-en">${escapeHtml(config.about.location.en)} &middot; Personal Creations</span>
      <span class="t-zh">${escapeHtml(config.about.location.zh)} &middot; 個人創作展演</span>
    </span>
  </div>
</footer>`;
}

function renderLikeButton(entry) {
  return `<button type="button" class="like-btn" data-like-id="${escapeHtml(entry.slug)}" aria-pressed="false" aria-label="Like ${escapeHtml(entry.title.en)}">
                <svg class="like-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M12 20.4c-.3 0-.6-.1-.8-.3C6.2 15.6 3 12.6 3 8.8 3 6 5.2 4 7.8 4c1.6 0 3.1.8 4.2 2.1C13.1 4.8 14.6 4 16.2 4 18.8 4 21 6 21 8.8c0 3.8-3.2 6.8-8.2 11.3-.2.2-.5.3-.8.3Z" />
                </svg>
                <span class="like-count" aria-live="polite"></span>
              </button>`;
}

function renderHomePage(config, entriesDesc) {
  const head = renderHead({
    titleEn: `${config.brand} — Personal Creations`,
    titleZh: `${config.brand} — 個人創作展演舞台`,
    description: config.tagline.en,
    canonicalUrl: `${config.siteUrl}/`,
    ogImageUrl: entriesDesc[0]?.ogRel ? `${config.siteUrl}/${entriesDesc[0].ogRel}` : '',
    prefix: './',
  });

  const cardsHtml = entriesDesc
    .map((entry, idx) => {
      const cover = entry.plates[0];
      const priorityAttr = idx < 2 ? ' fetchpriority="high"' : ' loading="lazy"';
      const multiBadge =
        entry.plates.length > 1
          ? `<span class="card-count-badge" aria-label="${entry.plates.length} images">${String(entry.plates.length).padStart(2, '0')} PLATES</span>`
          : '';

      const focusAttrs = cover.focus
        ? ` data-focus-x="${cover.focus[0]}" data-focus-y="${cover.focus[1]}" style="--mc-origin-x:${cover.focus[0]}%;--mc-origin-y:${cover.focus[1]}%;"`
        : '';

      return `      <article class="entry-card" data-aspect="${(cover.thumbWidth / cover.thumbHeight).toFixed(3)}"${focusAttrs}>
        <a href="./work/${entry.slug}/index.html" class="entry-link">
          <div class="card-media">
            <img
              src="./${cover.thumbRel}"
              alt="${escapeHtml(cover.altEn || entry.title.en)}"
              width="${cover.thumbWidth}"
              height="${cover.thumbHeight}"${priorityAttr}>
            ${multiBadge}
          </div>
        </a>
        <div class="card-placard">
          <div class="placard-meta">
            <span>No. ${entry.number}</span>
            <time datetime="${entry.date}">${formatDotDate(entry.date)}</time>
          </div>
          <div class="placard-title-row">
            <h2 class="placard-title">
              <a href="./work/${entry.slug}/index.html" class="placard-title-link">
                <span class="t-en">${escapeHtml(entry.title.en)}</span>
                <span class="t-zh">${escapeHtml(entry.title.zh)}</span>
              </a>
            </h2>
            ${renderLikeButton(entry)}
          </div>
          <p class="placard-caption">
            <span class="t-en">${escapeHtml(entry.caption.en)}</span>
            <span class="t-zh">${escapeHtml(entry.caption.zh)}</span>
          </p>
        </div>
      </article>`;
    })
    .join('\n');

  return `${head}
<body>
  ${renderHeader({ config, prefix: './', currentPage: 'archive' })}
  <main class="container">
    <h1 class="sr-only">
      <span class="t-en">${escapeHtml(config.brand)} — ${escapeHtml(config.tagline.en)}</span>
      <span class="t-zh">${escapeHtml(config.brand)} — ${escapeHtml(config.tagline.zh)}</span>
    </h1>

    <section class="gallery-section" aria-label="Personal Creations Gallery">
      <div class="freeform-stage" id="freeform-stage">
${cardsHtml}
      </div>
    </section>
  </main>
  ${renderFooter(config)}
  <script src="./assets/app.js" defer></script>
</body>
</html>
`;
}

function renderDetailPage(config, entry, prevEntry, nextEntry) {
  const prefix = '../../';
  const head = renderHead({
    titleEn: `No. ${entry.number} — ${entry.title.en} | ${config.brand}`,
    titleZh: `No. ${entry.number} — ${entry.title.zh} | ${config.brand}`,
    description: entry.caption.en,
    canonicalUrl: `${config.siteUrl}/work/${entry.slug}/`,
    ogImageUrl: entry.ogRel ? `${config.siteUrl}/${entry.ogRel}` : '',
    prefix,
  });

  const platesHtml = entry.plates
    .map((plate, idx) => {
      const priorityAttr = idx === 0 ? ' fetchpriority="high"' : ' loading="lazy"';
      const plateNum = String(idx + 1).padStart(2, '0');
      const altText = plate.altEn || `${entry.title.en} — Plate ${plateNum}`;

      return `      <figure class="plate-figure">
        <button
          type="button"
          class="plate-trigger"
          data-lightbox-index="${idx}"
          data-full-src="../../${plate.fullRel}"
          data-full-alt="${escapeHtml(altText)}"
          data-full-width="${plate.fullWidth}"
          data-full-height="${plate.fullHeight}"
          aria-label="Inspect Plate ${plateNum} in fullscreen">
          <img
            src="../../${plate.fullRel}"
            alt="${escapeHtml(altText)}"
            width="${plate.fullWidth}"
            height="${plate.fullHeight}"${priorityAttr}>
          <span class="plate-zoom-hint">
            <span class="t-en">Zoom</span>
            <span class="t-zh">放大檢視</span>
          </span>
        </button>
        <figcaption class="plate-footer">
          <span>PLATE ${plateNum} / ${String(entry.plates.length).padStart(2, '0')}</span>
          <span>${plate.fullWidth} &times; ${plate.fullHeight}</span>
        </figcaption>
      </figure>`;
    })
    .join('\n');

  const prevHtml = prevEntry
    ? `<a href="../${prevEntry.slug}/index.html" class="pager-link is-prev">
        <span class="pager-dir">&larr; <span class="t-en">Previous</span><span class="t-zh">上一篇</span> &middot; No. ${prevEntry.number}</span>
        <span class="pager-title"><span class="t-en">${escapeHtml(prevEntry.title.en)}</span><span class="t-zh">${escapeHtml(prevEntry.title.zh)}</span></span>
      </a>`
    : `<div class="pager-empty"><span class="t-en">Earliest Entry</span><span class="t-zh">已是最早一篇</span></div>`;

  const nextHtml = nextEntry
    ? `<a href="../${nextEntry.slug}/index.html" class="pager-link is-next">
        <span class="pager-dir">No. ${nextEntry.number} &middot; <span class="t-en">Next</span><span class="t-zh">下一篇</span> &rarr;</span>
        <span class="pager-title"><span class="t-en">${escapeHtml(nextEntry.title.en)}</span><span class="t-zh">${escapeHtml(nextEntry.title.zh)}</span></span>
      </a>`
    : `<div class="pager-empty" style="text-align:right;"><span class="t-en">Latest Entry</span><span class="t-zh">已是最新一篇</span></div>`;

  return `${head}
<body>
  ${renderHeader({ config, prefix, currentPage: 'work' })}
  <main class="container">
    <article class="work-article">
      <div class="work-breadcrumb">
        <a href="../../index.html" class="back-link">
          &larr; <span class="t-en">Back to Works</span><span class="t-zh">返回創作舞台</span>
        </a>
      </div>

      <header class="work-header">
        <div class="work-meta-col">
          <span class="work-number">No. ${entry.number}</span>
          <time datetime="${entry.date}">${formatDotDate(entry.date)}</time>
          <span>${String(entry.plates.length).padStart(2, '0')} ${entry.plates.length > 1 ? 'PLATES' : 'PLATE'}</span>
        </div>
        <div>
          <div class="work-title-row">
            <h1 class="work-title">
              <span class="t-en">${escapeHtml(entry.title.en)}</span>
              <span class="t-zh">${escapeHtml(entry.title.zh)}</span>
            </h1>
            ${renderLikeButton(entry)}
          </div>
          <p class="work-caption">
            <span class="t-en">${escapeHtml(entry.caption.en)}</span>
            <span class="t-zh">${escapeHtml(entry.caption.zh)}</span>
          </p>
        </div>
      </header>

      <section class="work-plates" aria-label="Artwork Plates">
${platesHtml}
      </section>

      <nav class="work-pager" aria-label="Entry navigation">
        ${prevHtml}
        ${nextHtml}
      </nav>
    </article>
  </main>

  <dialog id="plate-lightbox" class="lightbox" closedby="any" aria-label="Fullscreen artwork view">
    <div class="lightbox-shell">
      <div class="lightbox-topbar">
        <span class="lightbox-counter">01 / 01</span>
        <div class="lightbox-controls">
          <button type="button" class="lightbox-btn" data-lightbox-prev aria-label="Previous plate">&larr;</button>
          <button type="button" class="lightbox-btn" data-lightbox-next aria-label="Next plate">&rarr;</button>
          <button type="button" class="lightbox-btn" data-lightbox-close>
            <span class="t-en">Close (Esc)</span>
            <span class="t-zh">關閉 (Esc)</span>
          </button>
        </div>
      </div>
      <div class="lightbox-stage">
        <img class="lightbox-img" src="" alt="">
      </div>
    </div>
  </dialog>

  ${renderFooter(config)}
  <script src="../../assets/app.js" defer></script>
</body>
</html>
`;
}

function renderAboutPage(config, totalEntries) {
  const prefix = '../';
  const head = renderHead({
    titleEn: `About — ${config.brand}`,
    titleZh: `關於 — ${config.brand}`,
    description: config.about.heading.en.replaceAll('\n', ', '),
    canonicalUrl: `${config.siteUrl}/about/`,
    ogImageUrl: '',
    prefix,
  });

  const headingEn = escapeHtml(config.about.heading.en).replaceAll('\n', '<br>');
  const headingZh = escapeHtml(config.about.heading.zh).replaceAll('\n', '<br>');
  const enParas = (config.about.bio?.en || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('\n          ');
  const zhParas = (config.about.bio?.zh || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('\n          ');
  const bioBlock =
    enParas || zhParas
      ? `\n          <div class="about-paragraphs t-en">\n            ${enParas}\n          </div>\n          <div class="about-paragraphs t-zh">\n            ${zhParas}\n          </div>`
      : '';
  const socialsHtml = config.about.socials
    .map(
      (s) =>
        `<a href="${escapeHtml(s.url)}" class="aside-link" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)}</a>`
    )
    .join('\n            ');

  return `${head}
<body>
  ${renderHeader({ config, prefix, currentPage: 'about' })}
  <main class="container">
    <section class="about-section">
      <div class="about-grid">
        <div>
          <h1 class="about-heading">
            <span class="t-en">${headingEn}</span>
            <span class="t-zh">${headingZh}</span>
          </h1>${bioBlock}
        </div>

        <aside class="about-aside">
          <div>
            <div class="aside-block-label">
              <span class="t-en">Location</span>
              <span class="t-zh">駐地</span>
            </div>
            <div class="aside-block-value">
              <span class="t-en">${escapeHtml(config.about.location.en)}</span>
              <span class="t-zh">${escapeHtml(config.about.location.zh)}</span>
            </div>
          </div>

          <div>
            <div class="aside-block-label">
              <span class="t-en">Archive Count</span>
              <span class="t-zh">累積作品</span>
            </div>
            <div class="aside-block-value">${String(totalEntries).padStart(3, '0')} Works</div>
          </div>

          <div>
            <div class="aside-block-label">
              <span class="t-en">Contact</span>
              <span class="t-zh">聯絡</span>
            </div>
            <div class="aside-block-value">
              <a href="mailto:${escapeHtml(config.about.email)}" class="aside-link">${escapeHtml(config.about.email)}</a>
            </div>
          </div>

          <div>
            <div class="aside-block-label">
              <span class="t-en">Links</span>
              <span class="t-zh">社群</span>
            </div>
            <div class="aside-socials">
              ${socialsHtml}
            </div>
          </div>
        </aside>
      </div>
    </section>
  </main>
  ${renderFooter(config)}
  <script src="../assets/app.js" defer></script>
</body>
</html>
`;
}

function renderSitemap(config, entriesDesc) {
  const urls = [
    `${config.siteUrl}/`,
    `${config.siteUrl}/about/`,
    ...entriesDesc.map((e) => `${config.siteUrl}/work/${e.slug}/`),
  ];

  const items = urls
    .map((url) => `  <url>\n    <loc>${escapeHtml(url)}</loc>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;
}

export async function buildSite() {
  const configRaw = await fs.readFile(path.join(ROOT, 'site.config.json'), 'utf8');
  const config = JSON.parse(configRaw);

  await ensureDir(CONTENT_DIR);
  await ensureDir(MEDIA_DIR);

  const dirEntries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  const rawEntries = [];

  for (const dirent of dirEntries) {
    if (!dirent.isDirectory()) continue;
    const entryJsonPath = path.join(CONTENT_DIR, dirent.name, 'entry.json');
    if (!existsSync(entryJsonPath)) continue;
    const data = JSON.parse(await fs.readFile(entryJsonPath, 'utf8'));
    rawEntries.push({
      ...data,
      slug: data.slug || dirent.name,
    });
  }

  // Chronological ascending by creation time (createdAt or date) to assign sequential numbers (No. 001, 002, ...)
  rawEntries.sort((a, b) => (a.createdAt || a.date).localeCompare(b.createdAt || b.date));

  const processedAsc = [];
  for (let i = 0; i < rawEntries.length; i++) {
    const entry = rawEntries[i];
    const number = String(i + 1).padStart(3, '0');
    const plates = [];
    for (let j = 0; j < entry.images.length; j++) {
      plates.push(await processImage(entry.slug, entry.images[j], j));
    }
    processedAsc.push({
      ...entry,
      number,
      plates,
      ogRel: plates[0]?.ogRel || null,
    });
  }

  // Strictly newest first on the gallery stage
  const entriesDesc = [...processedAsc].reverse();

  // Write index.html
  await fs.writeFile(
    path.join(ROOT, 'index.html'),
    renderHomePage(config, entriesDesc),
    'utf8'
  );

  // Write about/index.html
  const aboutDir = path.join(ROOT, 'about');
  await ensureDir(aboutDir);
  await fs.writeFile(
    path.join(aboutDir, 'index.html'),
    renderAboutPage(config, entriesDesc.length),
    'utf8'
  );

  // Write work/<slug>/index.html
  for (let i = 0; i < processedAsc.length; i++) {
    const entry = processedAsc[i];
    const prevEntry = i > 0 ? processedAsc[i - 1] : null; // Earlier entry
    const nextEntry = i < processedAsc.length - 1 ? processedAsc[i + 1] : null; // Newer entry
    const workDir = path.join(ROOT, 'work', entry.slug);
    await ensureDir(workDir);
    await fs.writeFile(
      path.join(workDir, 'index.html'),
      renderDetailPage(config, entry, prevEntry, nextEntry),
      'utf8'
    );
  }

  // Write sitemap.xml
  await fs.writeFile(path.join(ROOT, 'sitemap.xml'), renderSitemap(config, entriesDesc), 'utf8');

  console.log(`Built ${processedAsc.length} entries -> index.html, about/index.html, work/*, sitemap.xml`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildSite().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
