import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../components/Navbar";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */

const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:wght@200;300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

:root {
  --ink:       #0f0a0a;
  --ash:       #1f1414;
  --smoke:     #2a1a1a;
  --fog:       #554444;
  --haze:      #998888;
  --pearl:     #d8d0d0;
  --white:     #ffffff;
  --gold:      #b8a07a;
  --gold-dim:  #7d6c52;
  --gold-pale: #e8d9be;
  --serif:  'Playfair Display', 'Georgia', serif;
  --sans:   'DM Sans', 'Helvetica Neue', sans-serif;
  --ease-luxury: cubic-bezier(0.19, 1, 0.22, 1);
}

html { background: #0f0a0a; color: var(--pearl); overflow-x: hidden; scroll-behavior: smooth; }
body { background: #0f0a0a; font-family: var(--sans); font-weight: 300; cursor: none; }

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

/* ── RED TINT ── */
.page-tint {
  position: fixed; inset: 0; pointer-events: none; z-index: 1;
  background: rgba(120,0,20,0.08);
}

/* ── BACK LINK ── */
.cs-back {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .4em; text-transform: uppercase; color: var(--gold);
  text-decoration: none;
  display: inline-flex; align-items: center; gap: 8px;
  transition: color .3s, gap .3s var(--ease-luxury);
}
.cs-back:hover { color: var(--white); gap: 14px; }

/* ── HERO ── */
.cs-hero {
  min-height: 100vh; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: center;
  padding: 160px 64px 100px;
  border-bottom: 1px solid var(--ash);
}
.cs-hero-back {
  position: absolute; top: 120px; left: 64px;
  z-index: 3;
  opacity: 0; animation: heroFadeIn 1s ease 0.3s forwards;
}
.cs-hero-inner {
  position: relative; z-index: 3;
  max-width: 1100px;
}
.cs-hero-tag {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 48px;
  opacity: 0; animation: heroFadeIn 1s ease 0.5s forwards;
}
.cs-hero-tag::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.cs-hero-title {
  font-family: var(--serif); font-weight: 900; font-style: italic;
  font-size: clamp(64px, 10vw, 160px);
  line-height: .92; letter-spacing: -.03em; color: var(--white);
  margin-bottom: 40px;
  opacity: 0; animation: heroSlideUp 1.4s var(--ease-luxury) 0.7s forwards;
}
.cs-hero-sub {
  font-family: var(--serif); font-size: clamp(18px, 2vw, 30px);
  font-weight: 400; font-style: italic;
  color: #888888; line-height: 1.5; max-width: 640px;
  opacity: 0; animation: heroFadeIn 1.2s ease 1.2s forwards;
}
@keyframes heroFadeIn { from{ opacity:0; } to{ opacity:1; } }
@keyframes heroSlideUp { from{ opacity:0; transform:translateY(40px); } to{ opacity:1; transform:translateY(0); } }

/* ── BRIEF ── */
.cs-brief {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 80px; padding: 120px 64px;
  border-bottom: 1px solid var(--ash);
}
.cs-brief-label-row {
  display: flex; flex-direction: column; gap: 32px;
}
.cs-brief-pair { display: flex; flex-direction: column; gap: 6px; }
.cs-brief-key {
  font-family: var(--sans); font-size: 9px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
}
.cs-brief-val {
  font-family: var(--sans); font-size: 15px; font-weight: 400;
  color: var(--white); letter-spacing: .02em;
}
.cs-brief-quote {
  font-family: var(--serif); font-weight: 500; font-style: italic;
  font-size: clamp(28px, 3.5vw, 52px);
  color: var(--white); line-height: 1.2; letter-spacing: -.02em;
  align-self: center;
}

/* ── CHALLENGE ── */
.cs-challenge {
  padding: 120px 64px;
  border-bottom: 1px solid var(--ash);
  display: flex; justify-content: center;
}
.cs-challenge-text {
  font-family: var(--serif); font-weight: 400;
  font-size: clamp(18px, 2vw, 28px);
  color: #aaaaaa; line-height: 1.75; max-width: 800px;
  text-align: center; letter-spacing: -.01em;
}

/* ── NUMBERS ── */
.cs-numbers {
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--ash);
}
.cs-stat {
  padding: 80px 48px;
  border-right: 1px solid var(--ash);
  display: flex; flex-direction: column; gap: 12px;
}
.cs-stat:last-child { border-right: none; }
.cs-stat-num {
  font-family: var(--serif); font-weight: 900;
  font-size: clamp(48px, 6vw, 96px);
  color: var(--white); letter-spacing: -.04em; line-height: 1;
}
.cs-stat-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .45em; text-transform: uppercase; color: var(--gold);
}

/* ── RESULT ── */
.cs-result {
  padding: 160px 64px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 80px;
}
.cs-result-text {
  font-family: var(--serif); font-weight: 400;
  font-size: clamp(18px, 2vw, 28px);
  color: var(--pearl); line-height: 1.8; max-width: 800px;
  letter-spacing: -.01em;
}

/* ── REVEAL ── */
.rv { opacity:0; transform:translateY(48px); transition:opacity 1.1s var(--ease-luxury), transform 1.1s var(--ease-luxury); }
.rv.in { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:.12s }
.rv-d2 { transition-delay:.26s }
.rv-d3 { transition-delay:.42s }

/* ── MOBILE ── */
@media(max-width:960px) {
  .cs-hero { padding:140px 28px 80px; }
  .cs-hero-back { top:100px; left:28px; }
  .cs-brief { grid-template-columns:1fr; gap:60px; padding:80px 28px; }
  .cs-challenge { padding:80px 28px; }
  .cs-numbers { grid-template-columns:1fr 1fr; }
  .cs-stat { padding:48px 28px; border-right:none; border-bottom:1px solid var(--ash); }
  .cs-stat:last-child { border-bottom:none; }
  .cs-result { padding:100px 28px; gap:48px; }
}
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const BRIEF = [
  { key: "Brand",     val: "H&M India" },
  { key: "Platform",  val: "Meta · Facebook · Instagram" },
  { key: "Duration",  val: "6 Months" },
  { key: "Objective", val: "Brand Awareness · Brand Recall" },
];

const STATS = [
  { num: "48L", label: "Impressions Delivered" },
  { num: "48%", label: "Impression Share" },
  { num: "25%", label: "Brand Recall Rate" },
  { num: "6",   label: "Months" },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function HMCaseStudy() {
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
      <div className="page-tint" aria-hidden="true" />

      <Navbar onEnter={onEnter} onLeave={onLeave} activePage="Work" />

      {/* ──────── HERO ──────── */}
      <section className="cs-hero">
        <div className="cs-hero-back">
          <a href="/work" className="cs-back" onMouseEnter={onEnter} onMouseLeave={onLeave}>← Back to Work</a>
        </div>
        <div className="cs-hero-inner">
          <div className="cs-hero-tag">Case Study</div>
          <h1 className="cs-hero-title">H&amp;M India.</h1>
          <p className="cs-hero-sub">48 lakh impressions. 1 in 4 people remembered the brand.</p>
        </div>
      </section>

      {/* ──────── BRIEF ──────── */}
      <section className="cs-brief">
        <div className="cs-brief-label-row">
          {BRIEF.map(({ key, val }) => (
            <div key={key} className="cs-brief-pair rv" ref={reveal}>
              <span className="cs-brief-key">{key}</span>
              <span className="cs-brief-val">{val}</span>
            </div>
          ))}
        </div>
        <p className="cs-brief-quote rv" ref={reveal}>
          Fashion moves fast. Attention moves faster.
        </p>
      </section>

      {/* ──────── CHALLENGE ──────── */}
      <section className="cs-challenge">
        <p className="cs-challenge-text rv" ref={reveal}>
          H&amp;M is a global name. But in India — every fashion brand is fighting for the same feed.
          The same scroll. The same 3 seconds of attention. The challenge wasn&rsquo;t just reach.
          It was recall. Anyone can get impressions. Making someone remember you —
          that&rsquo;s the real game.
        </p>
      </section>

      {/* ──────── NUMBERS ──────── */}
      <section className="cs-numbers">
        {STATS.map(({ num, label }, i) => (
          <div key={label} className={`cs-stat rv rv-d${Math.min(i + 1, 3)}`} ref={reveal}>
            <div className="cs-stat-num">{num}</div>
            <div className="cs-stat-label">{label}</div>
          </div>
        ))}
      </section>

      {/* ──────── RESULT ──────── */}
      <section className="cs-result">
        <p className="cs-result-text rv" ref={reveal}>
          48 lakh impressions delivered. Almost half the impression share in a highly competitive
          space. And 1 in 4 people — when asked about the brand — remembered H&amp;M.
          That&rsquo;s not just reach. That&rsquo;s memory.
          That&rsquo;s what real brand building looks like.
        </p>
        <a href="/work" className="cs-back rv rv-d1" ref={reveal} onMouseEnter={onEnter} onMouseLeave={onLeave}>
          ← Back to Work
        </a>
      </section>
    </>
  );
}
