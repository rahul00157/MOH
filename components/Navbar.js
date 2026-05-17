import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */

/** All navbar-specific CSS. Injected once per page render via <style>. */
const NAV_CSS = `
/* ── NAVBAR ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 28px 64px;
  transition: padding .55s var(--ease-luxury), background .55s, backdrop-filter .55s, border-color .55s;
  border-bottom: 1px solid transparent;
}
.nav.stuck {
  padding: 18px 64px;
  background: rgba(3,3,3,.88);
  backdrop-filter: blur(22px) saturate(1.4);
  border-color: rgba(255,255,255,.04);
}
.nav-brand { text-decoration: none; display: flex; flex-direction: column; line-height: 1; }
.nav-brand-the {
  font-family: var(--sans); font-size: 9px; font-weight: 300;
  letter-spacing: .55em; text-transform: uppercase; color: var(--gold);
  margin-bottom: 2px;
}
.nav-brand-moh {
  font-family: var(--serif); font-size: 26px; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase; color: var(--white);
}
.nav-links {
  display: flex; gap: 44px; list-style: none;
  position: absolute; left: 50%; transform: translateX(-50%);
}
.nav-link {
  font-family: var(--sans); font-size: 11px; font-weight: 400;
  letter-spacing: .3em; text-transform: uppercase; color: #e0e0e0;
  text-decoration: none; position: relative;
  transition: color .3s;
}
.nav-link::after {
  content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px;
  background: var(--white); transition: width .38s var(--ease-luxury);
}
.nav-link:hover { color: var(--white); }
.nav-link:hover::after { width: 100%; }
.nav-link.active { color: var(--gold); }
.nav-link.active::after { width: 100%; background: var(--gold); }
.nav-btn {
  font-family: var(--sans); font-size: 9px; font-weight: 400;
  letter-spacing: .32em; text-transform: uppercase;
  color: var(--ink); background: var(--white);
  border: none; padding: 13px 30px; text-decoration: none;
  transition: background .3s, transform .3s; display: inline-block;
}
.nav-btn:hover { background: var(--gold-pale); transform: translateY(-2px); }

/* ── HAMBURGER ── */
.nav-hamburger {
  display: none;
  flex-direction: column; gap: 5px;
  background: none; border: none; cursor: none;
  padding: 4px; z-index: 201;
}
.nav-hamburger span {
  display: block; width: 24px; height: 1.5px;
  background: var(--white);
  transition: transform .35s var(--ease-luxury), opacity .35s;
}

/* ── OVERLAY ── */
.nav-overlay {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(3,3,3,.97);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity .45s var(--ease-luxury);
}
.nav-overlay.open { opacity: 1; pointer-events: all; }
.nav-overlay-close {
  position: absolute; top: 28px; right: 28px;
  background: none; border: none; cursor: none;
  font-family: var(--sans); font-size: 11px; font-weight: 300;
  letter-spacing: .35em; text-transform: uppercase; color: var(--white);
  display: flex; align-items: center; gap: 8px;
  opacity: .6; transition: opacity .3s;
}
.nav-overlay-close:hover { opacity: 1; }
.nav-overlay-links {
  list-style: none;
  display: flex; flex-direction: column;
  align-items: center; gap: 28px;
}
.nav-overlay-link {
  font-family: var(--serif); font-size: clamp(36px, 9vw, 72px);
  font-weight: 700; color: var(--white);
  text-decoration: none; letter-spacing: -.02em; line-height: 1;
  opacity: 0; transform: translateY(22px);
  transition: color .3s, opacity .45s var(--ease-luxury), transform .45s var(--ease-luxury);
}
.nav-overlay.open .nav-overlay-links li:nth-child(1) .nav-overlay-link { opacity:1; transform:translateY(0); transition-delay:.08s; }
.nav-overlay.open .nav-overlay-links li:nth-child(2) .nav-overlay-link { opacity:1; transform:translateY(0); transition-delay:.14s; }
.nav-overlay.open .nav-overlay-links li:nth-child(3) .nav-overlay-link { opacity:1; transform:translateY(0); transition-delay:.20s; }
.nav-overlay.open .nav-overlay-links li:nth-child(4) .nav-overlay-link { opacity:1; transform:translateY(0); transition-delay:.26s; }
.nav-overlay.open .nav-overlay-links li:nth-child(5) .nav-overlay-link { opacity:1; transform:translateY(0); transition-delay:.32s; }
.nav-overlay-link:hover { color: var(--gold); }
.nav-overlay-link.active { color: var(--gold); }

@media(max-width:960px) {
  .nav { padding:24px 28px; }
  .nav.stuck { padding:14px 28px; }
  .nav-links, .nav-btn { display:none; }
  .nav-hamburger { display: flex; }
}
@media(max-width:600px) {
  .nav-brand-moh { font-size:22px; }
}
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

/** Site-wide navigation entries with labels and hrefs. */
const NAV_ITEMS = [
  { label: "Home",       href: "/" },
  { label: "About Us",   href: "/about" },
  { label: "What We Do", href: "/services" },
  { label: "Work",       href: "/work" },
  { label: "Contact",    href: "/contact" },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

/**
 * Navbar — shared site navigation used across all pages.
 *
 * @param {Function} onEnter    - Mouse enter handler for cursor expand effect.
 * @param {Function} onLeave    - Mouse leave handler for cursor reset.
 * @param {string}   activePage - Label of the currently active nav item (e.g. "About Us").
 */
export default function Navbar({ onEnter, onLeave, activePage = "" }) {
  const [stuck, setStuck]       = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /** Sets `stuck` when the page has scrolled past the navbar threshold. */
  useEffect(() => {
    const handleScroll = () => setStuck(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** Lock body scroll while overlay is open. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <style>{NAV_CSS}</style>

      {/* ── Fullscreen overlay menu ── */}
      <div className={`nav-overlay${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <button className="nav-overlay-close" onClick={close} aria-label="Close menu">
          Close &nbsp;✕
        </button>
        <ul className="nav-overlay-links">
          {NAV_ITEMS.map(n => (
            <li key={n.label}>
              <a
                href={n.href}
                className={`nav-overlay-link${n.label === activePage ? " active" : ""}`}
                onClick={close}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Navbar ── */}
      <nav className={`nav ${stuck ? "stuck" : ""}`}>
        <a href="/" className="nav-brand" onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <span className="nav-brand-the">the</span>
          <span className="nav-brand-moh">MOH</span>
        </a>
        <ul className="nav-links">
          {NAV_ITEMS.map(n => (
            <li key={n.label}>
              <a
                href={n.href}
                className={`nav-link${n.label === activePage ? " active" : ""}`}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/contact" className="nav-btn" onMouseEnter={onEnter} onMouseLeave={onLeave}>
          Let's Talk
        </a>
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <span /><span /><span />
        </button>
      </nav>
    </>
  );
}
