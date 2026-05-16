import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:wght@200;300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');

/* ── RESET ── */
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

/* ── VARIABLES ── */
:root {
  --ink:       #030303;
  --deep:      #090909;
  --void:      #060606;
  --coal:      #111;
  --soot:      #161616;
  --ash:       #1e1e1e;
  --smoke:     #2a2a2a;
  --slate:     #383838;
  --fog:       #555;
  --mist:      #777;
  --haze:      #999;
  --silver:    #bbb;
  --pearl:     #d8d8d8;
  --ivory:     #ededed;
  --snow:      #f5f5f5;
  --white:     #ffffff;
  --gold:      #b8a07a;
  --gold-dim:  #7d6c52;
  --gold-pale: #e8d9be;

  --serif:  'Playfair Display', 'Georgia', serif;
  --serif2: 'DM Serif Display', 'Georgia', serif;
  --sans:   'DM Sans', 'Helvetica Neue', sans-serif;

  --ease-luxury: cubic-bezier(0.19, 1, 0.22, 1);
}

html { background: var(--ink); color: var(--pearl); overflow-x: hidden; scroll-behavior: smooth; }
body { background: var(--ink); font-family: var(--sans); font-weight: 300; cursor: none; }

::selection { background: var(--gold-dim); color: var(--white); }

/* ── CURSOR ── */
#cur-dot {
  position: fixed; width: 7px; height: 7px;
  background: var(--white); border-radius: 50%;
  pointer-events: none; z-index: 9999;
  transform: translate(-50%,-50%);
  mix-blend-mode: difference;
  transition: width .25s, height .25s, background .25s;
}
#cur-dot.big { width: 14px; height: 14px; }
#cur-ring {
  position: fixed; width: 38px; height: 38px;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 50%; pointer-events: none; z-index: 9998;
  transform: translate(-50%,-50%);
  transition: width .4s var(--ease-luxury), height .4s var(--ease-luxury), border-color .4s;
}
#cur-ring.expand { width: 70px; height: 70px; border-color: rgba(184,160,122,.45); }

/* ── NOISE GRAIN ── */
.grain {
  position: fixed; inset: 0; pointer-events: none; z-index: 2;
  opacity: .032;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

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
.nav-links { display: flex; gap: 44px; list-style: none; position: absolute; left: 50%; transform: translateX(-50%); }
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

/* ── ABOUT HERO ── */
.about-hero {
  min-height: 100vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 0 64px;
  position: relative; overflow: hidden;
}
.about-hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
  background-size: 88px 88px;
}
.about-hero-vignette {
  position: absolute; inset: 0; z-index: 1;
  background:
    radial-gradient(ellipse 70% 70% at 20% 50%, rgba(184,160,122,.04) 0%, transparent 65%),
    linear-gradient(to bottom, rgba(3,3,3,.6) 0%, transparent 40%, rgba(3,3,3,.8) 100%);
}
.about-hero-inner {
  position: relative; z-index: 3;
  max-width: 1200px;
}
.about-hero-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 48px;
  opacity: 0; animation: fadeUp .9s var(--ease-luxury) .4s forwards;
}
.about-hero-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.about-hero-title {
  font-family: var(--serif); font-weight: 900;
  font-size: clamp(56px, 9vw, 160px);
  line-height: .92; letter-spacing: -.03em; color: var(--white);
  margin-bottom: 48px;
  opacity: 0; animation: fadeUp 1.2s var(--ease-luxury) .7s forwards;
}
.about-hero-title em { font-style: italic; color: var(--haze); }
.about-hero-sub {
  font-family: var(--serif); font-size: clamp(16px, 1.8vw, 26px);
  font-weight: 400; font-style: italic;
  color: #aaaaaa; line-height: 1.6; max-width: 640px;
  opacity: 0; animation: fadeUp 1s var(--ease-luxury) 1.1s forwards;
}

@keyframes fadeUp { from{ opacity:0; transform:translateY(32px) } to{ opacity:1; transform:translateY(0) } }

/* ── MOBILE ── */
@media(max-width:960px) {
  .nav { padding:24px 28px; }
  .nav.stuck { padding:14px 28px; }
  .nav-links, .nav-btn { display:none; }
  .about-hero { padding:0 28px; }
}
@media(max-width:600px) {
  .nav-brand-moh { font-size:22px; }
}
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

/** Navigation entries with explicit hrefs for cross-page routing. */
const NAV_ITEMS = [
  { label: "Home",       href: "/" },
  { label: "About Us",   href: "/about" },
  { label: "What We Do", href: "/#services" },
  { label: "Work",       href: "/#work" },
  { label: "Contact",    href: "/#contact" },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

/**
 * AboutPage — the About Us page for the MOH media and growth agency.
 * Shares the same design system, cursor, and navbar as the homepage.
 */
export default function AboutPage() {
  const [stuck, setStuck]   = useState(false);
  const [dot, setDot]       = useState({ x: -100, y: -100 });
  const [ring, setRing]     = useState({ x: -100, y: -100 });
  const [expand, setExpand] = useState(false);
  const ringTarget          = useRef({ x: -100, y: -100 });
  const rafId               = useRef(null);

  /** Sets `stuck` when the page has scrolled past the navbar threshold. */
  useEffect(() => {
    const handleScroll = () => setStuck(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** Tracks mouse position for the dot cursor and lerps the ring cursor via RAF. */
  useEffect(() => {
    const onMove = (e) => {
      setDot({ x: e.clientX, y: e.clientY });
      ringTarget.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    const lerp = () => {
      setRing(prev => ({
        x: prev.x + (ringTarget.current.x - prev.x) * 0.11,
        y: prev.y + (ringTarget.current.y - prev.y) * 0.11,
      }));
      rafId.current = requestAnimationFrame(lerp);
    };
    rafId.current = requestAnimationFrame(lerp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const expandClass = (isExpanded) => isExpanded ? "expand" : "";
  const onEnter = () => setExpand(true);
  const onLeave = () => setExpand(false);

  return (
    <>
      <style>{G}</style>

      {/* Cursor */}
      <div id="cur-dot" className={expand ? "big" : ""} style={{ left: dot.x, top: dot.y }} />
      <div id="cur-ring" className={expandClass(expand)} style={{ left: ring.x, top: ring.y }} />
      <div className="grain" aria-hidden="true" />

      {/* ──────── NAVBAR ──────── */}
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
                className={`nav-link${n.label === "About Us" ? " active" : ""}`}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/#contact" className="nav-btn" onMouseEnter={onEnter} onMouseLeave={onLeave}>Let's Talk</a>
      </nav>

      {/* ──────── ABOUT HERO ──────── */}
      <section className="about-hero">
        <div className="about-hero-bg" aria-hidden="true" />
        <div className="about-hero-vignette" aria-hidden="true" />
        <div className="about-hero-inner">
          <div className="about-hero-label">About Us</div>
          <h1 className="about-hero-title">
            We Are<br /><em>the MOH.</em>
          </h1>
          <p className="about-hero-sub">
            Built from the inside. For those who deserve better.
          </p>
        </div>
      </section>
    </>
  );
}
