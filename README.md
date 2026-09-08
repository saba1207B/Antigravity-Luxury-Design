# Antigravity — Luxury Beyond Weight
### Acoustic Levitation Design System & Interactive Experience

> **"Where gravity yields to intention. A new paradigm of luxury, suspended between materiality and the intangible."**

---

## 🏛️ Overview

**Antigravity** is a high-craft luxury digital flagship and design system engineered around acoustic levitation technology, obsidian ceramic materiality, and architectural precision. Built entirely with clean, vanilla modern web standards (semantic HTML5, custom modular CSS with design tokens, and modular vanilla JavaScript physics engines), it delivers a zero-dependency, ultra-smooth 60fps luxury experience.

---

## 📁 Source Code Directory Structure

```
Antigravity Luxury Design System/
├── index.html                           # Main flagship landing experience (501 lines)
├── 404.html                             # Custom "Equilibrium Lost" luxury 404 error page (147 lines)
├── robots.txt                           # Search engine crawling rules
├── sitemap.xml                          # Canonical XML sitemap
│
├── assets/
│   └── images/
│       ├── hero_levitation_core.jpg     # Hero acoustic levitation core (Obsidian & Gold)
│       ├── bento_acoustic_chamber.jpg   # Acoustic transducer chamber visualization
│       ├── bento_editorial_human.jpg    # Human scale & editorial portrait
│       └── bento_material_detail.jpg    # Macro obsidian ceramic materiality
│
├── css/
│   ├── tokens.css                       # Design tokens: palette, typography, elevation, motion
│   ├── reset.css                        # Modern CSS reset, typography base, custom scrollbars
│   ├── components.css                   # Buttons, nav-pill, bento cards, commission modal, forms
│   ├── layout.css                       # Responsive grid, hero section, bento layout, breakpoints
│   └── reactive-cursor.css              # Canvas z-indexing and pointer-events layering
│
├── js/
│   ├── app.js                           # Master orchestration, modal management, smooth scrolling
│   ├── navigation.js                    # Dynamic shrinking nav-pill & accessible mobile drawer
│   ├── motion.js                        # IntersectionObserver scroll reveal system
│   ├── acoustic-field.js                # HTML5 Canvas 40kHz acoustic standing wave simulation
│   ├── bento-interactions.js            # Material switcher, frequency tuner, live telemetry
│   └── reactive-cursor.js               # Google Antigravity-style particle repulsion physics
│
└── antigravity-luxury.zip               # Production-ready deployment package
```

---

## 💎 Design System & Architecture

### 1. Color Palette (Obsidian & Gold)
- **Obsidian Dark Theme:**
  - Background Base: `#080908` (`--color-obsidian`)
  - Elevated Surfaces: `#111311` (`--color-obsidian-surface`)
  - Elevated Cards: `#1A1D1A` (`--color-obsidian-elevated`)
  - Borders: `rgba(250, 249, 246, 0.08)` (`--color-border`)
- **Royal & Champagne Gold:**
  - Primary Accent: `#D4AF37` (`--color-gold-royal`)
  - Soft Highlight: `#E7C873` (`--color-gold-champagne`)
  - Deep Bronze: `#A67C1F` (`--color-gold-antique`)

### 2. Typography
- **Editorial Serif:** `Cormorant Garamond` (Light 300, Regular 400, Italic) for high-fashion display headlines.
- **Modern Sans:** `Manrope` (300 to 800) for UI, crisp legibility, and geometric precision.
- **Monospace Telemetry:** `JetBrains Mono` for frequencies, sensor readouts, and scientific coordinates.

### 3. Glassmorphism & Elevation
- Multi-tier backdrop blur (`blur(16px)` to `blur(24px)`).
- Hairline subtle inner borders (`1px solid rgba(250, 249, 246, 0.08)`).
- Deep ambient luminescence box-shadows.

---

## ⚡ Interactive Engine Features

| Feature | File | Description |
| :--- | :--- | :--- |
| **Acoustic Levitation Field** | `js/acoustic-field.js` | Real-time Canvas simulation rendering 5 standing wave pressure nodes with 80 suspended particles reacting dynamically to cursor coordinates. |
| **Reactive Particle Field** | `js/reactive-cursor.js` | Custom physics engine featuring radial force-field repulsion and spring-return damping inspired by the Google Antigravity experience. |
| **Shrinking Glassmorphism Pill** | `js/navigation.js` | Fixed floating header that smoothly contracts upon scroll with full ARIA accessibility and mobile drawer focus trap. |
| **Interactive Material Switcher** | `js/bento-interactions.js` | Live switching between *Obsidian Ceramic*, *Brushed Titanium*, and *Champagne Gold* with CSS hardware-accelerated filter transitions. |
| **40 kHz Frequency Tuner** | `js/bento-interactions.js` | Interactive slider simulating transducer harmonics, acoustic node lock, and stability telemetry. |
| **Bespoke Commission Drawer** | `js/app.js` | Accessible slide-over consultation modal with backdrop blur, focus trap, and Escape key dismissal. |
| **Custom 404 Experience** | `404.html` | "Equilibrium Lost" error page styled with ambient gold glow and reactive cursor integration. |

---

## 🚀 Running Locally

Because this project is built entirely on native web standards, it requires no compilation, bundler, or build step.

### Option 1: Python HTTP Server (Built-in)
```bash
python -m http.server 8080
```
Then open [http://localhost:8080](http://localhost:8080) in any modern browser.

### Option 2: Node `serve` or `npx http-server`
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click `index.html` and click **"Open with Live Server"**.

---

## 🌐 Netlify Drop Deployment (1-Click)

The codebase has been validated for instant, zero-configuration static drop hosting:
1. Locate the pre-packaged archive:
   - **Local Workspace:** `antigravity-luxury.zip`
   - **User Downloads:** `C:\Users\Test User\Downloads\antigravity-luxury.zip`
2. Navigate to **[app.netlify.com/drop](https://app.netlify.com/drop)** in your web browser.
3. Drag and drop `antigravity-luxury.zip` directly onto the drop zone.
4. Netlify will extract the root `index.html` and assets instantly and provide your live production URL.

---

## 📋 File Verification & Integrity

All 20 files are fully verified with zero code reductions:
- `index.html` — Complete main application
- `404.html` — Custom error page
- `robots.txt` & `sitemap.xml` — SEO configurations
- 4 High-Resolution Assets (`assets/images/*.jpg`)
- 5 Modular Stylesheets (`css/*.css`)
- 6 Interactive JavaScript Engines (`js/*.js`)
- `antigravity-luxury.zip` — Complete distribution package

---

© 2026 Antigravity Atelier. All rights reserved.
