(() => {
  const STORAGE_KEY = 'mc_lang';

  // ------------------------------------------------------------------------
  // 1. Bilingual Language Switcher (EN / 中文)
  // ------------------------------------------------------------------------
  function syncLanguageUI(lang) {
    const html = document.documentElement;
    html.dataset.lang = lang;
    html.lang = lang === 'zh' ? 'zh-Hant' : 'en';

    const titleEl = document.querySelector('title');
    if (titleEl) {
      const nextTitle = titleEl.getAttribute(`data-title-${lang}`);
      if (nextTitle) document.title = nextTitle;
    }

    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      const active = btn.getAttribute('data-set-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function initLanguageToggle() {
    const initial = document.documentElement.dataset.lang === 'zh' ? 'zh' : 'en';
    syncLanguageUI(initial);

    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextLang = btn.getAttribute('data-set-lang') === 'zh' ? 'zh' : 'en';
        try {
          localStorage.setItem(STORAGE_KEY, nextLang);
        } catch {
          // Ignore storage errors in restricted contexts
        }
        syncLanguageUI(nextLang);
      });
    });
  }

  // ------------------------------------------------------------------------
  // 2. Geometric Dialogue Stage (Square, Rectangle, Circle, Parallelogram)
  //    Strict newest-first chronological order with relational proportions
  // ------------------------------------------------------------------------
  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function randomBetween(min, max) {
    return Math.round(min + Math.random() * (max - min));
  }

  function getStageMode(width) {
    if (width < 640) return 'mobile';
    if (width < 900) return 'tablet';
    return 'desktop';
  }

  function initFreeformStage() {
    const stage = document.getElementById('freeform-stage');
    if (!stage) return;

    const cards = Array.from(stage.querySelectorAll('.entry-card'));
    if (!cards.length) return;

    // 4 pure geometries only: square, rect, circle, parallelogram
    const SKEW_RIGHT = 'polygon(11% 0%, 100% 0%, 89% 100%, 0% 100%)';
    const SKEW_LEFT = 'polygon(0% 0%, 89% 0%, 100% 100%, 11% 100%)';

    // Relational row compositions for 12-col desktop grid.
    // Each composition encodes an intentional geometric relationship:
    //   - horizon: different shapes locked to the exact same datum height (span / ratio = const)
    //   - axis: tall vertical shape paired with a centerline-aligned circle/square/parallelogram
    //   - diagonal: parallelogram slant vector echoed by companion shape's elevation or parallel shear
    //   - ratio: Bauhaus circle-and-square proportion dialogue
    const DESKTOP_TRIO_DIALOGUES = [
      // Equal-height horizon (height = 4 cols): vertical rect + circle + parallelogram
      {
        relation: 'horizon',
        slots: [
          { start: 1, span: 3, shape: 'rect', ratio: '3 / 4', valign: 'start', offsetY: 0 },
          { start: 4, span: 4, shape: 'circle', ratio: '1 / 1', valign: 'start', offsetY: 0 },
          { start: 8, span: 5, shape: 'parallelogram', ratio: '5 / 4', clip: SKEW_RIGHT, valign: 'start', offsetY: 0 },
        ],
      },
      // Equal-height horizon (height = 4 cols): parallelogram + square + vertical rect
      {
        relation: 'horizon',
        slots: [
          { start: 1, span: 5, shape: 'parallelogram', ratio: '5 / 4', clip: SKEW_LEFT, valign: 'start', offsetY: 0 },
          { start: 6, span: 4, shape: 'square', ratio: '1 / 1', valign: 'start', offsetY: 0 },
          { start: 10, span: 3, shape: 'rect', ratio: '3 / 4', valign: 'start', offsetY: 0 },
        ],
      },
      // Equal-module geometric triad: square + circle + parallelogram (all 4 cols, shared horizon)
      {
        relation: 'triad',
        slots: [
          { start: 1, span: 4, shape: 'square', ratio: '1 / 1', valign: 'start', offsetY: 0 },
          { start: 5, span: 4, shape: 'circle', ratio: '1 / 1', valign: 'start', offsetY: 0 },
          { start: 9, span: 4, shape: 'parallelogram', ratio: '1 / 1', clip: SKEW_RIGHT, valign: 'start', offsetY: 0 },
        ],
      },
      // Diagonal cadence: ascending slope across parallelogram -> circle -> tall rectangle
      {
        relation: 'diagonal',
        slots: [
          { start: 1, span: 5, shape: 'parallelogram', ratio: '4 / 3', clip: SKEW_RIGHT, valign: 'start', offsetY: 64 },
          { start: 6, span: 3, shape: 'circle', ratio: '1 / 1', valign: 'start', offsetY: 32 },
          { start: 9, span: 4, shape: 'rect', ratio: '3 / 4', valign: 'start', offsetY: 0 },
        ],
      },
      // Counterweight axis: tall rect + centered circle + bottom-aligned parallelogram
      {
        relation: 'axis',
        slots: [
          { start: 1, span: 4, shape: 'rect', ratio: '2 / 3', valign: 'start', offsetY: 0 },
          { start: 5, span: 3, shape: 'circle', ratio: '1 / 1', valign: 'center', offsetY: 0 },
          { start: 8, span: 5, shape: 'parallelogram', ratio: '16 / 10', clip: SKEW_LEFT, valign: 'end', offsetY: 0 },
        ],
      },
    ];

    const DESKTOP_PAIR_DIALOGUES = [
      // Equal-height horizon (height = 4 cols): square + 2:1 wide rectangle
      {
        relation: 'horizon',
        slots: [
          { start: 1, span: 4, shape: 'square', ratio: '1 / 1', valign: 'start', offsetY: 0 },
          { start: 5, span: 8, shape: 'rect', ratio: '2 / 1', valign: 'start', offsetY: 0 },
        ],
      },
      // Equal-height horizon (height = 4 cols): 2:1 parallelogram + circle
      {
        relation: 'horizon',
        slots: [
          { start: 1, span: 8, shape: 'parallelogram', ratio: '2 / 1', clip: SKEW_RIGHT, valign: 'start', offsetY: 0 },
          { start: 9, span: 4, shape: 'circle', ratio: '1 / 1', valign: 'start', offsetY: 0 },
        ],
      },
      // Equal-height horizon (height = 5 cols): circle + 7:5 rectangle
      {
        relation: 'horizon',
        slots: [
          { start: 1, span: 5, shape: 'circle', ratio: '1 / 1', valign: 'start', offsetY: 0 },
          { start: 6, span: 7, shape: 'rect', ratio: '7 / 5', valign: 'start', offsetY: 0 },
        ],
      },
      // Bauhaus circle-in-square proportion dialogue (same 1:1 ratio, golden scale contrast, centerline locked)
      {
        relation: 'ratio',
        slots: [
          { start: 1, span: 7, shape: 'square', ratio: '1 / 1', valign: 'center', offsetY: 0 },
          { start: 9, span: 4, shape: 'circle', ratio: '1 / 1', valign: 'center', offsetY: 0 },
        ],
      },
      // Bauhaus inverse: large circle + centered smaller square
      {
        relation: 'ratio',
        slots: [
          { start: 1, span: 6, shape: 'circle', ratio: '1 / 1', valign: 'center', offsetY: 0 },
          { start: 8, span: 4, shape: 'square', ratio: '1 / 1', valign: 'center', offsetY: 0 },
        ],
      },
      // Parallel shear: two parallelograms leaning in the exact same direction, stepped diagonally
      {
        relation: 'parallel',
        slots: [
          { start: 1, span: 6, shape: 'parallelogram', ratio: '4 / 3', clip: SKEW_RIGHT, valign: 'start', offsetY: 0 },
          { start: 7, span: 6, shape: 'parallelogram', ratio: '4 / 3', clip: SKEW_RIGHT, valign: 'start', offsetY: 56 },
        ],
      },
      // Perpendicular counterweight: tall vertical rectangle + centerline-locked wide parallelogram
      {
        relation: 'axis',
        slots: [
          { start: 1, span: 4, shape: 'rect', ratio: '2 / 3', valign: 'start', offsetY: 0 },
          { start: 6, span: 7, shape: 'parallelogram', ratio: '16 / 9', clip: SKEW_LEFT, valign: 'center', offsetY: 0 },
        ],
      },
      // Diagonal prop: wide rectangle + leaning parallelogram aligned to its baseline
      {
        relation: 'diagonal',
        slots: [
          { start: 1, span: 7, shape: 'rect', ratio: '16 / 10', valign: 'end', offsetY: 0 },
          { start: 8, span: 5, shape: 'parallelogram', ratio: '4 / 5', clip: SKEW_LEFT, valign: 'end', offsetY: 0 },
        ],
      },
    ];

    const DESKTOP_SOLO_ANCHORS = [
      { start: 1, span: 9, shape: 'rect', ratio: '21 / 10', valign: 'start', offsetY: 0 },
      { start: 3, span: 8, shape: 'parallelogram', ratio: '16 / 9', clip: SKEW_RIGHT, valign: 'start', offsetY: 0 },
      { start: 2, span: 8, shape: 'parallelogram', ratio: '16 / 9', clip: SKEW_LEFT, valign: 'start', offsetY: 0 },
      { start: 4, span: 6, shape: 'square', ratio: '1 / 1', valign: 'start', offsetY: 0 },
      { start: 4, span: 5, shape: 'circle', ratio: '1 / 1', valign: 'start', offsetY: 0 },
      { start: 3, span: 9, shape: 'rect', ratio: '16 / 9', valign: 'start', offsetY: 0 },
    ];

    const TABLET_PAIR_DIALOGUES = [
      {
        relation: 'horizon',
        slots: [
          { start: 1, span: 5, shape: 'circle', ratio: '1 / 1', valign: 'start', offsetY: 0 },
          { start: 6, span: 7, shape: 'rect', ratio: '7 / 5', valign: 'start', offsetY: 0 },
        ],
      },
      {
        relation: 'ratio',
        slots: [
          { start: 1, span: 6, shape: 'square', ratio: '1 / 1', valign: 'center', offsetY: 0 },
          { start: 7, span: 6, shape: 'parallelogram', ratio: '4 / 3', clip: SKEW_RIGHT, valign: 'center', offsetY: 0 },
        ],
      },
      {
        relation: 'parallel',
        slots: [
          { start: 1, span: 6, shape: 'parallelogram', ratio: '4 / 3', clip: SKEW_LEFT, valign: 'start', offsetY: 0 },
          { start: 7, span: 6, shape: 'parallelogram', ratio: '4 / 3', clip: SKEW_LEFT, valign: 'start', offsetY: 36 },
        ],
      },
      {
        relation: 'axis',
        slots: [
          { start: 1, span: 5, shape: 'rect', ratio: '3 / 4', valign: 'start', offsetY: 0 },
          { start: 6, span: 7, shape: 'circle', ratio: '1 / 1', valign: 'center', offsetY: 0 },
        ],
      },
    ];

    const TABLET_SOLO_ANCHORS = [
      { start: 1, span: 10, shape: 'rect', ratio: '16 / 9', valign: 'start', offsetY: 0 },
      { start: 2, span: 10, shape: 'parallelogram', ratio: '16 / 10', clip: SKEW_RIGHT, valign: 'start', offsetY: 0 },
      { start: 3, span: 8, shape: 'square', ratio: '1 / 1', valign: 'start', offsetY: 0 },
      { start: 3, span: 7, shape: 'circle', ratio: '1 / 1', valign: 'start', offsetY: 0 },
    ];

    const MOBILE_SEQUENCE = [
      { shape: 'rect', ratio: '16 / 10', width: 100, align: 'stretch' },
      { shape: 'circle', ratio: '1 / 1', width: 82, align: 'end' },
      { shape: 'parallelogram', ratio: '4 / 3', clip: SKEW_RIGHT, width: 94, align: 'start' },
      { shape: 'square', ratio: '1 / 1', width: 86, align: 'center' },
      { shape: 'rect', ratio: '3 / 4', width: 84, align: 'start' },
      { shape: 'parallelogram', ratio: '16 / 10', clip: SKEW_LEFT, width: 96, align: 'end' },
    ];

    function computeClampedPan(fx, fy, zoom) {
      const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
      const maxRight = fx * (zoom - 1);
      const maxLeft = -(100 - fx) * (zoom - 1);
      const maxDown = fy * (zoom - 1);
      const maxUp = -(100 - fy) * (zoom - 1);
      return {
        x: Number(clamp(50 - fx, maxLeft, maxRight).toFixed(2)),
        y: Number(clamp(50 - fy, maxUp, maxDown).toFixed(2)),
      };
    }

    function applyCloseUpLens(card, shape) {
      const hasFocus =
        card.hasAttribute('data-focus-x') && card.hasAttribute('data-focus-y');

      let originX;
      let originY;
      let zoom;
      let hoverZoom;
      let pan = { x: 0, y: 0 };
      let hoverPan = { x: 0, y: 0 };

      if (hasFocus) {
        originX = Number(card.getAttribute('data-focus-x'));
        originY = Number(card.getAttribute('data-focus-y'));
        const isEdgeFocus = originX < 30 || originX > 70 || originY < 30 || originY > 70;
        const needsStrongerZoom =
          isEdgeFocus || shape === 'circle' || shape === 'parallelogram';
        const minZoom = isEdgeFocus && (shape === 'circle' || shape === 'parallelogram') ? 1.42 : needsStrongerZoom ? 1.32 : 1.18;
        const maxZoom = isEdgeFocus ? 2.15 : 2.05;

        zoom = Number((minZoom + Math.random() * (maxZoom - minZoom)).toFixed(2));
        hoverZoom = Number(Math.max(1.12, zoom * 0.93).toFixed(2));
        pan = computeClampedPan(originX, originY, zoom);
        hoverPan = computeClampedPan(originX, originY, hoverZoom);
      } else {
        // ~80% close-up detail shot (1.30x - 2.20x), ~20% wider framing (1.02x - 1.15x)
        const isCloseUp = Math.random() < 0.8;
        zoom = isCloseUp
          ? Number((1.3 + Math.random() * 0.9).toFixed(2))
          : Number((1.02 + Math.random() * 0.13).toFixed(2));
        hoverZoom = isCloseUp
          ? Number(Math.max(1.06, zoom * 0.93).toFixed(2))
          : Number((zoom * 1.04).toFixed(2));
        originX = randomBetween(18, 82);
        originY = randomBetween(18, 82);
      }

      card.style.setProperty('--mc-zoom', String(zoom));
      card.style.setProperty('--mc-hover-zoom', String(hoverZoom));
      card.style.setProperty('--mc-origin-x', `${originX}%`);
      card.style.setProperty('--mc-origin-y', `${originY}%`);
      card.style.setProperty('--mc-pan-x', `${pan.x}%`);
      card.style.setProperty('--mc-pan-y', `${pan.y}%`);
      card.style.setProperty('--mc-hover-pan-x', `${hoverPan.x}%`);
      card.style.setProperty('--mc-hover-pan-y', `${hoverPan.y}%`);
    }

    function applySlotGeometry(card, slot) {
      card.dataset.shape = slot.shape;
      card.style.setProperty('--mc-col', slot.col || `${slot.start} / span ${slot.span}`);
      card.style.setProperty('--mc-width', `${slot.width ?? 100}%`);
      card.style.setProperty('--mc-align', slot.align || 'stretch');
      card.style.setProperty('--mc-valign', slot.valign || 'start');
      card.style.setProperty('--mc-offset-y', `${slot.offsetY ?? 0}px`);
      card.style.setProperty('--mc-ratio', slot.ratio);
      card.style.setProperty('--mc-radius', slot.shape === 'circle' ? '50%' : '0px');
      card.style.setProperty(
        '--mc-clip',
        slot.shape === 'parallelogram' ? slot.clip || SKEW_RIGHT : 'none'
      );
      applyCloseUpLens(card, slot.shape);
    }

    function applyFreeformLayout() {
      const mode = getStageMode(stage.clientWidth || window.innerWidth);

      if (mode === 'mobile') {
        const startOffset = Math.floor(Math.random() * MOBILE_SEQUENCE.length);
        cards.forEach((card, idx) => {
          const spec = MOBILE_SEQUENCE[(startOffset + idx) % MOBILE_SEQUENCE.length];
          applySlotGeometry(card, {
            col: '1 / -1',
            shape: spec.shape,
            ratio: spec.ratio,
            clip: spec.clip,
            width: idx === 0 && spec.shape !== 'circle' ? 100 : spec.width,
            align: spec.align,
            valign: 'start',
            offsetY: 0,
          });
        });
        stage.classList.add('is-staged');
        return;
      }

      let cursor = 0;
      let lastRelation = '';
      let lastSoloShape = '';
      let lastRowSize = 0;

      while (cursor < cards.length) {
        const remaining = cards.length - cursor;
        let rowSize;

        if (mode === 'tablet') {
          if (remaining === 1) {
            rowSize = 1;
          } else if (lastRowSize === 1) {
            rowSize = 2;
          } else {
            rowSize = Math.random() < 0.35 ? 1 : 2;
          }
        } else {
          if (remaining === 1) {
            rowSize = 1;
          } else if (remaining === 2) {
            rowSize = 2;
          } else {
            const roll = Math.random();
            if (lastRowSize !== 1 && roll < 0.25) {
              rowSize = 1;
            } else if (roll < 0.65) {
              rowSize = 2;
            } else {
              rowSize = 3;
            }
          }
        }

        if (rowSize === 1) {
          const pool = mode === 'tablet' ? TABLET_SOLO_ANCHORS : DESKTOP_SOLO_ANCHORS;
          const filtered = pool.filter((s) => s.shape !== lastSoloShape);
          const solo = pickRandom(filtered.length ? filtered : pool);
          applySlotGeometry(cards[cursor], solo);
          lastSoloShape = solo.shape;
          lastRelation = 'solo';
        } else if (rowSize === 2) {
          const pool = mode === 'tablet' ? TABLET_PAIR_DIALOGUES : DESKTOP_PAIR_DIALOGUES;
          const filtered = pool.filter((d) => d.relation !== lastRelation);
          const dialogue = pickRandom(filtered.length ? filtered : pool);
          dialogue.slots.forEach((slot, i) => applySlotGeometry(cards[cursor + i], slot));
          lastRelation = dialogue.relation;
        } else {
          const filtered = DESKTOP_TRIO_DIALOGUES.filter((d) => d.relation !== lastRelation);
          const dialogue = pickRandom(filtered.length ? filtered : DESKTOP_TRIO_DIALOGUES);
          dialogue.slots.forEach((slot, i) => applySlotGeometry(cards[cursor + i], slot));
          lastRelation = dialogue.relation;
        }

        cursor += rowSize;
        lastRowSize = rowSize;
      }

      stage.classList.add('is-staged');
    }

    applyFreeformLayout();

    let lastMode = getStageMode(stage.clientWidth || window.innerWidth);
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const nextMode = getStageMode(entry.contentRect.width);
          if (nextMode !== lastMode) {
            lastMode = nextMode;
            applyFreeformLayout();
          }
        }
      });
      ro.observe(stage);
    } else {
      window.addEventListener('resize', () => {
        const nextMode = getStageMode(stage.clientWidth || window.innerWidth);
        if (nextMode !== lastMode) {
          lastMode = nextMode;
          applyFreeformLayout();
        }
      });
    }
  }

  // ------------------------------------------------------------------------
  // 3. Fullscreen Image Zoom <dialog> with Modern Top-Layer Fallbacks
  // ------------------------------------------------------------------------
  let supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
      return false;
    }
    const probe = document.createElement('div');
    probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = 'none';
    supportsDisplayTransition = getComputedStyle(probe).display === 'block';
    probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay();
  }

  async function closeTopLayer(element) {
    if (!element.open) return;
    if (!supportsTopLayerExit()) {
      element.setAttribute('data-closing', '');
      const animations = element.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 400)),
        ]);
      }
      if (!element.hasAttribute('data-closing')) return;
      element.removeAttribute('data-closing');
    }
    element.close();
  }

  function initLightbox() {
    const dialog = document.getElementById('plate-lightbox');
    if (!dialog) return;

    const triggers = Array.from(document.querySelectorAll('[data-lightbox-index]'));
    const imgEl = dialog.querySelector('.lightbox-img');
    const counterEl = dialog.querySelector('.lightbox-counter');
    const prevBtn = dialog.querySelector('[data-lightbox-prev]');
    const nextBtn = dialog.querySelector('[data-lightbox-next]');
    const closeBtn = dialog.querySelector('[data-lightbox-close]');

    if (!triggers.length || !imgEl) return;

    const items = triggers.map((btn) => ({
      src: btn.getAttribute('data-full-src') || '',
      alt: btn.getAttribute('data-full-alt') || '',
      width: btn.getAttribute('data-full-width') || '',
      height: btn.getAttribute('data-full-height') || '',
    }));

    let currentIndex = 0;

    function renderSlide(index) {
      currentIndex = (index + items.length) % items.length;
      const item = items[currentIndex];
      imgEl.src = item.src;
      imgEl.alt = item.alt;
      if (item.width) imgEl.width = Number(item.width);
      if (item.height) imgEl.height = Number(item.height);
      if (counterEl) {
        const pad = (n) => String(n).padStart(2, '0');
        counterEl.textContent = `${pad(currentIndex + 1)} / ${pad(items.length)}`;
      }
      const multi = items.length > 1;
      if (prevBtn) prevBtn.disabled = !multi;
      if (nextBtn) nextBtn.disabled = !multi;
    }

    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-lightbox-index')) || 0;
        renderSlide(idx);
        dialog.removeAttribute('data-closing');
        dialog.showModal();
      });
    });

    prevBtn?.addEventListener('click', () => renderSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => renderSlide(currentIndex + 1));
    closeBtn?.addEventListener('click', () => closeTopLayer(dialog));

    // Route native close requests (Esc, closedby light-dismiss) through exit animation helper
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeTopLayer(dialog);
    });

    // Mandatory fallback for browsers without <dialog closedby> support (e.g., Safari)
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        closeTopLayer(dialog);
      });
    }

    dialog.addEventListener('keydown', (event) => {
      if (items.length <= 1) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        renderSlide(currentIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        renderSlide(currentIndex + 1);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 4. Minimal Like Buttons (persisted per browser via localStorage)
  // ------------------------------------------------------------------------
  const LIKES_STORAGE_KEY = 'mc_likes_v1';

  function readLikes() {
    try {
      const raw = localStorage.getItem(LIKES_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeLikes(state) {
    try {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  function initLikeButtons() {
    const buttons = Array.from(document.querySelectorAll('[data-like-id]'));
    if (!buttons.length) return;

    function syncAll() {
      const state = readLikes();
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-like-id') || '';
        const liked = Boolean(state[id]);
        btn.classList.toggle('is-liked', liked);
        btn.setAttribute('aria-pressed', String(liked));
        const countEl = btn.querySelector('.like-count');
        if (countEl) {
          countEl.textContent = liked ? '1' : '';
        }
      });
    }

    syncAll();

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-like-id') || '';
        if (!id) return;
        const state = readLikes();
        const nextLiked = !state[id];
        if (nextLiked) {
          state[id] = true;
        } else {
          delete state[id];
        }
        writeLikes(state);
        syncAll();

        if (nextLiked) {
          btn.classList.add('is-popping');
          setTimeout(() => btn.classList.remove('is-popping'), 220);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLanguageToggle();
    initFreeformStage();
    initLightbox();
    initLikeButtons();
  });
})();
