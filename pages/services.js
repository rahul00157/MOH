import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */

const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:wght@200;300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

:root {
  --ink:       #030303;
  --ash:       #1e1e1e;
  --smoke:     #2a2a2a;
  --fog:       #555;
  --haze:      #999;
  --pearl:     #d8d8d8;
  --white:     #ffffff;
  --gold:      #b8a07a;
  --gold-dim:  #7d6c52;
  --gold-pale: #e8d9be;
  --serif:  'Playfair Display', 'Georgia', serif;
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
  transition: width .25s, height .25s;
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

/* ── GRAIN ── */
.grain {
  position: fixed; inset: 0; pointer-events: none; z-index: 2; opacity: .032;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* ── HERO ── */
.sv-hero {
  min-height: 100vh; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: center;
  padding: 160px 64px 120px;
  border-bottom: 1px solid var(--ash);
}
.sv-hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.016) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.016) 1px, transparent 1px);
  background-size: 88px 88px;
}
.sv-hero-vignette {
  position: absolute; inset: 0; z-index: 1;
  background:
    radial-gradient(ellipse 70% 80% at 15% 50%, rgba(184,160,122,.04) 0%, transparent 65%),
    linear-gradient(to bottom, rgba(3,3,3,.5) 0%, transparent 40%, rgba(3,3,3,.9) 100%);
}
.sv-hero-inner {
  position: relative; z-index: 3;
  max-width: 1100px;
}
.sv-hero-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 48px;
  opacity: 0; animation: svFadeUp .9s var(--ease-luxury) .4s forwards;
}
.sv-hero-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.sv-hero-title {
  font-family: var(--serif); font-weight: 900; font-style: italic;
  font-size: clamp(48px, 7.5vw, 130px);
  line-height: .94; letter-spacing: -.03em; color: var(--white);
  margin-bottom: 44px;
  opacity: 0; animation: svSlideUp 1.4s var(--ease-luxury) .7s forwards;
}
.sv-hero-sub {
  font-family: var(--serif); font-size: clamp(18px, 2vw, 28px);
  font-weight: 400; font-style: italic;
  color: #888; line-height: 1.5; max-width: 580px;
  opacity: 0; animation: svFadeUp 1.2s var(--ease-luxury) 1.2s forwards;
}

@keyframes svFadeUp  { from{ opacity:0; transform:translateY(24px); } to{ opacity:1; transform:translateY(0); } }
@keyframes svSlideUp { from{ opacity:0; transform:translateY(44px); } to{ opacity:1; transform:translateY(0); } }

/* ── SERVICES GRID ── */
.sv-list {
  border-top: 1px solid var(--ash);
}
.sv-item {
  display: grid; grid-template-columns: 80px 1fr 1fr;
  align-items: start;
  gap: 48px;
  padding: 72px 64px;
  border-bottom: 1px solid var(--ash);
  transition: background .4s var(--ease-luxury);
}
.sv-item:hover { background: rgba(255,255,255,.018); }
.sv-item-num {
  font-family: var(--serif); font-weight: 900; font-style: italic;
  font-size: 13px; color: var(--gold-dim);
  letter-spacing: .04em; padding-top: 6px;
}
.sv-item-name {
  font-family: var(--serif); font-weight: 700; font-style: italic;
  font-size: clamp(28px, 3.5vw, 52px);
  color: var(--white); line-height: 1.05; letter-spacing: -.02em;
}
.sv-item-body {
  font-family: var(--sans); font-size: 15px; font-weight: 300;
  color: var(--haze); line-height: 1.8; letter-spacing: .01em;
  padding-top: 8px;
}

/* ── CLOSING ── */
.sv-close {
  padding: 160px 64px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 56px;
  border-top: 1px solid var(--ash);
}
.sv-close-text {
  font-family: var(--serif); font-weight: 400; font-style: italic;
  font-size: clamp(24px, 3vw, 48px);
  color: var(--white); line-height: 1.2; letter-spacing: -.02em;
  max-width: 820px;
}
.sv-close-sub {
  font-family: var(--sans); font-size: 14px; font-weight: 300;
  letter-spacing: .3em; text-transform: uppercase; color: var(--haze);
}
.sv-cta {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .45em; text-transform: uppercase; color: var(--gold);
  text-decoration: none;
  display: inline-flex; align-items: center; gap: 10px;
  transition: color .3s, gap .3s var(--ease-luxury);
}
.sv-cta:hover { color: var(--white); gap: 18px; }

/* ── REVEAL ── */
.rv { opacity:0; transform:translateY(48px); transition:opacity 1.1s var(--ease-luxury), transform 1.1s var(--ease-luxury); }
.rv.in { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:.12s }
.rv-d2 { transition-delay:.26s }
.rv-d3 { transition-delay:.42s }

/* ── MOBILE ── */
@media(max-width:960px) {
  .sv-hero { padding:140px 28px 100px; }
  .sv-item { grid-template-columns:1fr; gap:20px; padding:56px 28px; }
  .sv-item-num { padding-top:0; }
  .sv-close { padding:100px 28px; gap:40px; }
}
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const SERVICES = [
  {
    num: "01",
    name: "Programmatic Advertising",
    body: "DV360. The Trade Desk. Precision targeting at scale. We put your brand in front of the right person on the right screen at the right moment — not just everyone everywhere. Billions of impressions, none of them wasted.",
  },
  {
    num: "02",
    name: "Social Media Marketing",
    body: "Meta. Instagram. Facebook. We don't boost posts. We build campaigns with intent — creative that stops the scroll, strategy that compounds over time, and reporting that tells you exactly what worked.",
  },
  {
    num: "03",
    name: "B2B Lead Generation",
    body: "LinkedIn isn't just a job board. It's where decision-makers live. We engineer campaigns that reach founders, directors, and buyers — and turn them into qualified leads your sales team will actually want to call.",
  },
  {
    num: "04",
    name: "Brand Strategy",
    body: "Before a single rupee goes into media, we make sure your brand knows what it stands for. Positioning, messaging, tone — the foundation that makes everything else work harder and cost less.",
  },
  {
    num: "05",
    name: "Performance Marketing",
    body: "Every campaign is a machine. We build it to convert — from the first impression to the final click. CPL, ROAS, CAC — we track what matters and optimise until the numbers make sense.",
  },
  {
    num: "06",
    name: "Local & Hyperlocal Campaigns",
    body: "National brands don't always need national reach. Sometimes you need NCR. Sometimes you need one pin code. We build campaigns that target the right geography — without wasting spend on the wrong one.",
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function ServicesPage() {
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
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
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

      <div id="cur-dot" className={expand ? "big" : ""} style={{ left: dot.x, top: dot.y }} />
      <div id="cur-ring" className={expand ? "expand" : ""} style={{ left: ring.x, top: ring.y }} />
      <div className="grain" aria-hidden="true" />

      <Navbar onEnter={onEnter} onLeave={onLeave} activePage="Services" />

      {/* ──────── HERO ──────── */}
      <section className="sv-hero">
        <div className="sv-hero-bg" aria-hidden="true" />
        <div className="sv-hero-vignette" aria-hidden="true" />
        <div className="sv-hero-inner">
          <div className="sv-hero-label">What We Do</div>
          <h1 className="sv-hero-title">We don&rsquo;t offer packages.<br />We build systems.</h1>
          <p className="sv-hero-sub">Six ways we make your brand impossible to ignore.</p>
        </div>
      </section>

      {/* ──────── SERVICES ──────── */}
      <section className="sv-list">
        {SERVICES.map(({ num, name, body }, i) => (
          <div
            key={num}
            className={`sv-item rv rv-d${Math.min((i % 3) + 1, 3)}`}
            ref={reveal}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <div className="sv-item-num">{num}</div>
            <div className="sv-item-name">{name}</div>
            <div className="sv-item-body">{body}</div>
          </div>
        ))}
      </section>

      {/* ──────── CLOSING ──────── */}
      <section className="sv-close">
        <p className="sv-close-text rv" ref={reveal}>
          If you&rsquo;re looking for a vendor, we&rsquo;re not it.<br />
          If you&rsquo;re looking for a partner — let&rsquo;s talk.
        </p>
        <p className="sv-close-sub rv rv-d1" ref={reveal}>the MOH · India</p>
        <a
          href="mailto:hello@themoh.in"
          className="sv-cta rv rv-d2"
          ref={reveal}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          Get in touch →
        </a>
      </section>
    </>
  );
}
