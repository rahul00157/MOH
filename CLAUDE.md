# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

No test suite is configured.

## Architecture

This is a **Next.js 16 Pages Router** project (not App Router) using React 19. The site is a single-page luxury homepage for "the MOH" — an Indian media and growth agency.

### Key structural decisions

**All CSS lives inside `pages/index.js`** as the template literal constant `G`, injected via `<style>{G}</style>`. Do not look for component styles in `styles/` — `styles/globals.css` only handles the base body/html reset and dark-mode color vars. When editing visual styles, edit the `G` string in `pages/index.js`.

**Data arrays are module-level constants** at the top of `pages/index.js`: `NAV_ITEMS`, `TICKER_ITEMS`, `WORKS`, `PHILOS`. Content changes (nav links, work cards, philosophy pillars) go here.

**No separate component files** — the entire page is a single default export `TheMOHHomepage` in `pages/index.js`.

### Notable runtime behaviours in the single component

- **Custom cursor**: a dot (`#cur-dot`) snaps directly to mouse position; a ring (`#cur-ring`) follows with a RAF lerp (factor `0.11`). `expand` state is toggled on interactive elements via `onMouseEnter`/`onMouseLeave` (`ho`/`hl` handlers).
- **Sticky nav**: `stuck` state is set when `scrollY > 70`, adding the `.stuck` class that applies blur/background.
- **Scroll reveal**: `IntersectionObserver` watches elements collected via the `rv` callback ref; crossing the threshold adds class `in` to trigger CSS transitions. Staggered delays use `.rv-d1`–`.rv-d4` utility classes.

### CSS variable palette

All colour tokens are defined in the `:root` block inside `G`. The scale runs from `--ink` (near-black) through to `--white`, plus `--gold` / `--gold-dim` / `--gold-pale` accent colours. `--ease-luxury` is the shared cubic-bezier for premium-feel transitions.

### Routing

`pages/api/hello.js` is a stub API route returning `{ name: "John Doe" }` — not used by the frontend.
