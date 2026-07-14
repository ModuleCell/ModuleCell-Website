# ModuleCell Design System & Style Guide

Welcome to the design documentation for **ModuleCell** — a modern modular pre-fab architectural design studio website. The website's aesthetic draws inspiration from **Nordic/Japanese minimalism (Biotope style)**, featuring a deep dark forest backdrop, glowing organic teal accents, editorial typography, and high-fidelity geometric imagery.

---

## 🎨 Color Palette & Design Tokens

The colors are defined as CSS Custom Properties in the `:root` selector of `styles.css`.

| Variable Name | Color Hex/Value | Visual Role |
| :--- | :--- | :--- |
| `--bg-primary` | `#0a0d0c` | Deep forest charcoal; primary background |
| `--bg-secondary` | `#111614` | Muted dark gray-green; used for alternating section blocks |
| `--bg-card` | `rgba(17, 22, 20, 0.65)` | Translucent dark glass; card and box overlays |
| `--bg-glass` | `rgba(10, 13, 12, 0.85)` | Blur-filter navbar background |
| `--accent` | `#00b4a2` | Vibrant organic teal; branding highlights & active states |
| `--accent-hover` | `#33ccbb` | Lighter teal; used for cursor hover feedback |
| `--accent-dark` | `#008276` | Darker teal tint; for deep borders |
| `--text-primary` | `#f4f6f5` | Crisp off-white; main headlines and body text |
| `--text-secondary` | `#a2b0ac` | Sage gray-green; descriptions and subtitles |
| `--text-muted` | `#63726e` | Muted sage gray; copyright and years |
| `--border-color` | `rgba(0, 180, 162, 0.15)` | Thin glowing teal lines for dividers and structural borders |
| `--border-light` | `rgba(255, 255, 255, 0.05)` | Faint white border line for dark elements |

---

## ✍️ Typography

- **Headings Font**: `Outfit` (sans-serif)
  - Characterized by clean geometric shapes, matching modular structural layouts.
  - Used with an *editorial light weight* (`font-weight: 300`) to evoke architectural sophistication.
- **Body Font**: `Inter` (sans-serif)
  - Highly legible, neutral sans-serif for descriptive paragraphs.
  - Set to `font-weight: 300` for general text and `500` for bold text.

---

## 📐 Layout & Grids

### 1. Main Container
- Maximum width: `1200px` (`--container-width`)
- Centered layout: `margin: 0 auto; padding: 0 2rem;`

### 2. Hero Section Split Grid
- Desktop layout divides the viewport into a split column:
  `grid-template-columns: 1.15fr 0.85fr`
- Left side: Title, subtitles, and CTA buttons.
- Right side: Perfect circle slideshow window.

### 3. Past Experience Project Cards Grid
- Displayed in a 3-column layout:
  `grid-template-columns: repeat(3, 1fr)`
- Uses circular image frames with titles and metadata centered below.

---

## 🧩 Key Components

### 1. Fixed Navbar with Scroll Shrink
- Uses `backdrop-filter: blur(12px)` for a premium frosted glass effect.
- **Dynamic Scroll States**:
  - Top State: Height is `90px` with a `54px` logo.
  - Scrolled State: Height shrinks to `64px` with a `42px` logo and adds a drop shadow + glow border.
- **Logo Click Action**: Clicking the header Logo smoothly scrolls the window back to the very top.

### 2. Bilingual Stacking Buttons (`.btn`)
- Buttons enforce **6px rounded corners** (`border-radius: 6px`).
- To accommodate bilingual text without wrapping, buttons are structured vertically:
  - `.btn-en`: English label in capital letters (`font-size: 0.95rem`, `font-weight: 600`, letter-spacing).
  - `.btn-zh`: Chinese translation positioned underneath (`font-size: 0.72rem`, `opacity: 0.85`).

### 3. Circular Project Cards (`.project-card`)
- Image wrapper is styled as a perfect circle (`border-radius: 50%`).
- **Hover Micro-animations**:
  - Image scales up smoothly (`transform: scale(1.08)`).
  - Circle frame lifts upwards (`transform: translateY(-8px)`) and gains a teal shadow glow.

---

## 🔄 Dynamic Slideshows

### 1. Hero Section Slideshow
- **Shape**: Perfect circle (`width: 480px`, `height: 480px`, `border-radius: 50%`).
- **Logic**: Cycles through 4 signature project rendering images every **6 seconds** (`6000ms`).
- **Transition**: Ken Burns effect (opacity fades over `1.6s` combined with a slow scale zoom `scale(1.0) -> scale(1.06)` over `8s`).

### 2. Lab & Prototyping Slideshow
- **Shape**: Perfect circle (`width: 440px`, `height: 440px`, `border-radius: 50%`).
- **Top Alignment**: The circle is aligned to the top of the section column (`align-items: start` in the grid), with a `margin-top: 0.35rem` to align the circle's top edge visually with the first row of text.
- **Logic**: Cycles through 4 physical prototyping & rendering images every **5 seconds** (`5000ms`).
- **Transition**: Ken Burns zoom fade transition matching the Hero slideshow.
- **Tags**: Tech tags are positioned directly underneath the circle rather than overlaid, keeping layout lines clean.

---

## 📱 Responsive Specifications

The website uses media queries to transition layouts smoothly across devices:

### 1. Tablet Breakpoint (`max-width: 1024px`)
- **Grids**: Split grids (Hero and Lab sections) collapse into a single column.
- **Circle Sizes**: Circles scale down to `380px` (Hero) and `360px` (Lab) to adapt to tablet viewport limits.
- **Margins**: Vertical offsets (such as negative top margin for the Lab circle) are reset to `0` to prevent layout overlaps.

### 2. Mobile Breakpoint (`max-width: 768px`)
- **Navigation**: Desktop links hide and toggle to a full-screen mobile menu drawer via the hamburger button.
- **Hero Circle**: Scales down to `280px` to fit mobile widths.
- **Lab Circle**: Scales down to `280px`.
- **Project Grid**: Collapses into a single-column layout.
