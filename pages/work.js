import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";

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

/* ── WORK HERO ── */
.work-hero {
  min-height: 60vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 0 64px;
  position: relative; overflow: hidden;
}
.work-hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
  background-size: 88px 88px;
}
.work-hero-vignette {
  position: absolute; inset: 0; z-index: 1;
  background:
    radial-gradient(ellipse 70% 70% at 20% 50%, rgba(184,160,122,.04) 0%, transparent 65%),
    linear-gradient(to bottom, rgba(3,3,3,.6) 0%, transparent 40%, rgba(3,3,3,.8) 100%);
}
.work-hero-inner {
  position: relative; z-index: 3;
  max-width: 1200px;
}
.work-hero-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 48px;
  opacity: 0; animation: fadeUp .9s var(--ease-luxury) .4s forwards;
}
.work-hero-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.work-hero-title {
  font-family: var(--serif); font-weight: 900; font-style: italic;
  font-size: clamp(56px, 9vw, 160px);
  line-height: .92; letter-spacing: -.03em; color: var(--white);
  margin-bottom: 40px;
  opacity: 0; animation: fadeUp 1.2s var(--ease-luxury) .7s forwards;
}
.work-hero-sub {
  font-family: var(--serif); font-size: clamp(16px, 1.8vw, 26px);
  font-weight: 400; font-style: italic;
  color: #aaaaaa; line-height: 1.6; max-width: 640px;
  opacity: 0; animation: fadeUp 1s var(--ease-luxury) 1.1s forwards;
}

@keyframes fadeUp { from{ opacity:0; transform:translateY(32px) } to{ opacity:1; transform:translateY(0) } }

/* ── WORK LIST ── */
.work-list {
  border-top: 1px solid var(--ash);
  padding: 0 0 0;
}
.work-entry {
  padding: 80px 64px;
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid var(--ash);
}
.work-entry-brand {
  font-family: var(--serif); font-weight: 900; font-style: italic;
  font-size: clamp(80px, 12vw, 180px);
  line-height: .88; letter-spacing: -.04em;
  color: #ffffff;
  -webkit-text-stroke: 2px #ffffff;
  margin-bottom: 28px;
  display: block;
  animation: bmwPulse 3s ease-in-out infinite;
}
@keyframes bmwPulse {
  0%, 100% { opacity: 0.3; -webkit-text-stroke: 2px rgba(255,255,255,0.3); }
  50%       { opacity: 1;   -webkit-text-stroke: 2px rgba(255,255,255,0.9); text-shadow: 0 0 80px rgba(255,255,255,0.2); }
}
.work-entry-country {
  font-family: var(--sans); font-size: clamp(18px, 2vw, 28px); font-weight: 700;
  letter-spacing: 0.3em; text-transform: uppercase;
  color: #b8a07a; margin-bottom: 14px;
}
.work-entry-tags {
  font-family: var(--sans); font-size: 14px; font-weight: 500;
  letter-spacing: 0.2em; color: #cccccc;
  margin-bottom: 28px;
}
.work-entry-desc {
  font-family: var(--serif); font-weight: 400; font-style: italic;
  font-size: clamp(20px, 2.2vw, 32px);
  color: var(--white); line-height: 1.3;
  max-width: 760px; margin-bottom: 36px;
  letter-spacing: -.01em;
}
.work-entry-cta {
  display: inline-flex; align-items: center; gap: 12px;
  font-family: var(--sans); font-size: 11px; font-weight: 400;
  letter-spacing: 0.35em; text-transform: uppercase;
  color: #ffffff; text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.3);
  padding-bottom: 6px; margin-top: 32px;
  position: relative;
  animation: viewCasePulse 2.5s ease-in-out infinite;
}
.work-entry-cta:hover .cta-arrow { transform: translateX(6px); }
.cta-arrow { display: inline-block; transition: transform 0.3s; }
@keyframes viewCasePulse {
  0%, 100% { color: #ffffff; border-bottom-color: rgba(255,255,255,0.2); }
  50%       { color: #e8d9be; border-bottom-color: rgba(184,160,122,0.8); }
}

/* ── FOOTER ── */
.foot {
  border-top: 1px solid var(--ash);
  padding: 100px 64px 60px;
  display: flex; flex-direction: column; gap: 80px;
}
.foot-top {
  display: grid; grid-template-columns: 1fr auto 1fr;
  align-items: start; gap: 80px;
}
.foot-brand .foot-the {
  font-family: var(--sans); font-size: 9px; font-weight: 300;
  letter-spacing: .55em; text-transform: uppercase; color: var(--gold);
  margin-bottom: 4px;
}
.foot-brand .foot-moh {
  font-family: var(--serif); font-size: 56px; font-weight: 900;
  letter-spacing: .1em; text-transform: uppercase; color: var(--white);
  line-height: 1;
}
.foot-brand .foot-line {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .28em; text-transform: uppercase; color: var(--fog);
  margin-top: 16px;
}
.foot-divider { width: 1px; background: var(--ash); align-self: stretch; }
.foot-nav { display: flex; flex-direction: column; gap: 18px; list-style: none; align-items: center; }
.foot-nav a {
  font-family: var(--sans); font-size: 12px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; color: #d8d8d8;
  text-decoration: none; transition: color .3s;
}
.foot-nav a:hover { color: var(--white); }
.foot-bottom {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 48px; border-top: 1px solid var(--ash);
  gap: 24px; flex-wrap: wrap;
}
.foot-copy {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .2em; color: #888888;
}
.foot-social { display: flex; gap: 36px; }
.foot-social a {
  font-family: var(--sans); font-size: 12px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; color: #cccccc;
  text-decoration: none; transition: color .3s;
}
.foot-social a:hover { color: #ffffff; }

/* ── ENTRY ANIMATIONS ── */
@keyframes curtainReveal {
  0%   { clip-path: inset(0 0 100% 0); opacity: 0; }
  100% { clip-path: inset(0 0 0% 0);   opacity: 1; }
}
@keyframes fadeInUp {
  0%   { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes watermarkFade {
  0%   { opacity: 0;    transform: translate(-50%,-50%) scale(1.1); }
  100% { opacity: 0.04; transform: translate(-50%,-50%) scale(1); }
}
.work-section {
  min-height: 100vh; position: relative; overflow: hidden;
  display: flex; align-items: center;
  padding: 120px 64px;
}
.brand-name {
  animation: curtainReveal 1.2s cubic-bezier(0.16,1,0.3,1) forwards;
  opacity: 0;
}
.brand-details {
  animation: fadeInUp 1s ease 0.6s forwards;
  opacity: 0;
}
.brand-watermark {
  animation: watermarkFade 1.5s ease 0.3s forwards;
  opacity: 0;
}

/* ── REVEAL ── */
.rv { opacity:0; transform:translateY(48px); transition:opacity 1.1s var(--ease-luxury), transform 1.1s var(--ease-luxury); }
.rv.in { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:.1s }
.rv-d2 { transition-delay:.22s }
.rv-d3 { transition-delay:.36s }

/* ── MOBILE ── */
@media(max-width:960px) {
  .work-hero { padding:0 28px; }
  .work-list { padding:0; }
  .work-entry { padding:60px 28px; }
  .foot { padding:80px 28px 48px; }
  .foot-top { grid-template-columns:1fr; }
  .foot-divider { display:none; }
  .foot-nav { align-items:flex-start; }
  .foot-bottom { flex-direction:column; align-items:flex-start; }
}
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const WORKS = [
  {
    brand:     "BMW",
    country:   "India",
    tags:      "Programmatic · DV360 · Brand Awareness · 2023",
    desc:      "One billion people saw what we made.",
    href:      "#",
    bg:        "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,60,150,0.12) 0%, transparent 70%), #080810",
    watermark: "BMW",
    logoSrc:   "/bmw.png",
  },
  {
    brand:   "GODREJ",
    country: "Properties",
    tags:    "LinkedIn · B2B Lead Gen · Real Estate · India",
    desc:    "684 decision-makers walked in. 28% more qualified than before.",
    href:    "#",
    bg:      "linear-gradient(rgba(0,80,40,0.08),rgba(0,80,40,0.08)),#0a0f0a",
  },
  {
    brand:   "H&M",
    country: "Fashion · India",
    tags:    "Meta · Facebook · Instagram · Brand Recall",
    desc:    "48 lakh impressions. 1 in 4 people remembered the brand.",
    href:    "#",
    bg:      "linear-gradient(rgba(120,0,20,0.08),rgba(120,0,20,0.08)),#0f0a0a",
  },
  {
    brand:   "HIRA",
    country: "Sweets · NCR",
    tags:    "Meta · Facebook · Instagram · Local Campaign",
    desc:    "12.5 lakh impressions. NCR noticed.",
    href:    "#",
    bg:      "linear-gradient(rgba(120,80,0,0.08),rgba(120,80,0,0.08)),#0f0d08",
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function WorkPage() {
  const [dot, setDot]       = useState({ x: -100, y: -100 });
  const [ring, setRing]     = useState({ x: -100, y: -100 });
  const [expand, setExpand] = useState(false);
  const ringTarget          = useRef({ x: -100, y: -100 });
  const rafId               = useRef(null);
  const revealEls           = useRef([]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const reveal = useCallback(el => {
    if (el && !revealEls.current.includes(el)) revealEls.current.push(el);
  }, []);

  const onEnter = () => setExpand(true);
  const onLeave = () => setExpand(false);

  return (
    <>
      <style>{G}</style>

      {/* Cursor */}
      <div id="cur-dot" className={expand ? "big" : ""} style={{ left: dot.x, top: dot.y }} />
      <div id="cur-ring" className={expand ? "expand" : ""} style={{ left: ring.x, top: ring.y }} />
      <div className="grain" aria-hidden="true" />

      {/* ──────── NAVBAR ──────── */}
      <Navbar onEnter={onEnter} onLeave={onLeave} activePage="Work" />

      {/* ──────── HERO ──────── */}
      <section className="work-hero">
        <div className="work-hero-bg" aria-hidden="true" />
        <div className="work-hero-vignette" aria-hidden="true" />
        <div className="work-hero-inner">
          <div className="work-hero-label">Our Work</div>
          <h1 className="work-hero-title">Selected Work.</h1>
          <p className="work-hero-sub">Real brands. Real results. Real work.</p>
        </div>
      </section>

      {/* ──────── WORK LIST ──────── */}
      <section className="work-list">
        {WORKS.map(({ brand, country, tags, desc, href, bg, watermark, logoSrc }) => (
          <article key={brand} className="work-entry" style={{ background: bg, position: "relative" }}>
            {logoSrc && (
              <img
                src={logoSrc} alt="" aria-hidden="true"
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "70%", height: "auto", objectFit: "contain",
                  opacity: 0.04, pointerEvents: "none", userSelect: "none",
                  zIndex: 0, filter: "grayscale(100%)",
                }}
              />
            )}
            {watermark && (
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--serif)", fontSize: "clamp(200px,30vw,500px)",
                fontWeight: 900, color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.04)",
                letterSpacing: "-0.05em", pointerEvents: "none",
                userSelect: "none", zIndex: 0, overflow: "hidden",
              }}>{watermark}</div>
            )}
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="work-entry-brand rv" ref={reveal}>{brand}</span>
              <div className="work-entry-country rv" ref={reveal}>{country}</div>
              <div className="work-entry-tags rv rv-d1" ref={reveal}>{tags}</div>
              <p className="work-entry-desc rv rv-d1" ref={reveal}>{desc}</p>
              <a
                className="work-entry-cta rv rv-d2"
                href={href}
                ref={reveal}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                View Case Study <span className="cta-arrow">→</span>
              </a>
            </div>
          </article>
        ))}
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="foot">
        <div className="foot-top">
          <div className="foot-brand rv" ref={reveal}>
            <div className="foot-the">the</div>
            <div className="foot-moh">MOH</div>
            <div className="foot-line">Media &amp; Growth Company — India</div>
          </div>
          <div className="foot-divider" />
          <ul className="foot-nav rv rv-d1" ref={reveal}>
            {[
              { label: "Home",       href: "/" },
              { label: "About Us",   href: "/about" },
              { label: "What We Do", href: "/services" },
              { label: "Work",       href: "/work" },
              { label: "Contact",    href: "/contact" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href} onMouseEnter={onEnter} onMouseLeave={onLeave}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="foot-bottom rv" ref={reveal}>
          <span className="foot-copy">© 2025 the MOH. All rights reserved.</span>
          <div className="foot-social">
            <a href="https://www.linkedin.com/company/the-moh-media" target="_blank" rel="noopener noreferrer" onMouseEnter={onEnter} onMouseLeave={onLeave}>LinkedIn</a>
            <a href="https://www.instagram.com/themohmedia/" target="_blank" rel="noopener noreferrer" onMouseEnter={onEnter} onMouseLeave={onLeave}>Instagram</a>
            <a href="https://x.com/themohmedia" target="_blank" rel="noopener noreferrer" onMouseEnter={onEnter} onMouseLeave={onLeave}>X</a>
          </div>
        </div>
      </footer>
    </>
  );
}
