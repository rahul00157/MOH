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

@media(max-width:960px) {
  .nav { padding:24px 28px; }
  .nav.stuck { padding:14px 28px; }
  .nav-links, .nav-btn { display:none; }
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
  { label: "What We Do", href: "/#what-we-do" },
  { label: "Work",       href: "/#work" },
  { label: "Contact",    href: "/#contact" },
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
  const [stuck, setStuck] = useState(false);

  /** Sets `stuck` when the page has scrolled past the navbar threshold. */
  useEffect(() => {
    const handleScroll = () => setStuck(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{NAV_CSS}</style>
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
        <a href="/#contact" className="nav-btn" onMouseEnter={onEnter} onMouseLeave={onLeave}>
          Let's Talk
        </a>
      </nav>
    </>
  );
}
