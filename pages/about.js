import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */

/** Page-specific styles. Shared design tokens (fonts, variables, cursor) are defined here;
 *  navbar styles are injected by the Navbar component. */
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

/* ── ABOUT HERO ── */
.about-hero {
  min-height: 60vh;
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
@keyframes mohHighlight {
  0%, 100% { color: #ffffff; text-shadow: 0 0 0px transparent; }
  50%       { color: #e8d9be; text-shadow: 0 0 60px rgba(184,160,122,0.6), 0 0 120px rgba(184,160,122,0.3); }
}
.moh-highlight {
  display: inline-block;
  background: linear-gradient(90deg, transparent 0%, rgba(184,160,122,0.15) 50%, transparent 100%);
  color: #ffffff;
  animation: mohHighlight 2.5s ease-in-out infinite;
}

/* ── STORY ── */
.story {
  padding: 60px 64px 160px;
  border-top: 1px solid var(--ash);
  position: relative; overflow: hidden;
}
.story-deco {
  position: absolute; top: 60px; right: 64px;
  font-family: var(--serif); font-size: 280px; font-weight: 900;
  color: rgba(255,255,255,0.015); letter-spacing: -.04em;
  line-height: 1; pointer-events: none; user-select: none;
}
.story-inner { max-width: 860px; position: relative; z-index: 2; }
.story-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 16px;
}
.story-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.story-hook {
  font-family: var(--serif); font-weight: 700;
  font-size: clamp(24px, 3vw, 42px);
  color: var(--white); line-height: 1.2;
  margin-bottom: 16px;
}
.story-intro {
  font-family: var(--sans); font-weight: 300;
  font-size: clamp(14px, 1.4vw, 18px);
  color: #aaaaaa; line-height: 1.5;
  margin-bottom: 16px;
}
.story-box {
  margin-bottom: 16px;
  display: flex; flex-direction: column; gap: 8px;
}
.story-box-line {
  font-family: var(--sans); font-weight: 300;
  font-size: 14px;
  color: #cccccc; line-height: 1.5;
  display: flex; align-items: baseline; gap: 12px;
  opacity: 0;
}
.story-box-line .arrow { color: var(--gold); flex-shrink: 0; }
.story-box.in .story-box-line { animation: fadeIn .5s ease forwards; }
.story-box.in .story-box-line:nth-child(1) { animation-delay: .15s; }
.story-box.in .story-box-line:nth-child(2) { animation-delay: .45s; }
.story-box.in .story-box-line:nth-child(3) { animation-delay: .75s; }
.story-box.in .story-box-line:nth-child(4) { animation-delay: 1.05s; }
.story-box.in .story-box-line:nth-child(5) { animation-delay: 1.35s; }
.story-verdict {
  font-family: var(--serif); font-weight: 700;
  font-size: clamp(14px, 1.4vw, 18px);
  color: var(--white); line-height: 1.3;
  margin-bottom: 16px;
}
.story-question {
  font-family: var(--sans); font-weight: 300;
  font-size: clamp(14px, 1.4vw, 18px);
  color: #aaaaaa; line-height: 1.5;
  margin-bottom: 16px;
}
.story-noise {
  font-family: var(--serif); font-weight: 700; font-style: italic;
  font-size: clamp(19px, 2.2vw, 35px);
  color: var(--white); line-height: 1.2;
  margin-bottom: 16px;
  animation: goldGlow 2.5s ease-in-out infinite;
}
.story-origin {
  font-family: var(--serif); font-weight: 400;
  font-size: clamp(13px, 1.4vw, 19px);
  color: var(--gold); line-height: 1.6;
  margin-bottom: 12px;
}
.story-origin-emphasis {
  display: inline-block;
  font-family: var(--serif); font-weight: 700;
  font-size: clamp(18px, 2vw, 30px);
  color: #e8d9be; line-height: 1.4;
  margin-top: 12px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes goldGlow {
  0%, 100% { color: var(--white); text-shadow: none; }
  50%       { color: var(--gold-pale); text-shadow: 0 0 40px rgba(184,160,122,0.5), 0 0 80px rgba(184,160,122,0.25); }
}

/* ── TEAM ── */
.team {
  padding: 160px 64px;
  border-top: 1px solid var(--ash);
}
.team-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 80px;
}
.team-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.team-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 40px; max-width: 1000px;
}
.team-card {
  background: var(--soot);
  border: 1px solid var(--ash);
  padding: 40px;
  display: flex; flex-direction: column; gap: 28px;
  transition: border-color .4s var(--ease-luxury);
}
.team-card:hover { border-color: var(--gold-dim); }
.team-photo {
  width: 100%; aspect-ratio: 4/3;
  background: var(--slate);
  display: flex; align-items: center; justify-content: center;
}
.team-photo-inner {
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--smoke);
}
.team-info { display: flex; flex-direction: column; gap: 8px; }
.team-name {
  font-family: var(--serif); font-size: clamp(20px, 2vw, 28px);
  font-weight: 700; color: var(--white); letter-spacing: -.01em;
}
.team-role {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .4em; text-transform: uppercase; color: var(--gold);
}
.team-bio {
  font-family: var(--sans); font-size: clamp(13px, 1.3vw, 16px);
  font-weight: 300; color: var(--haze); line-height: 1.7;
  margin-top: 4px;
}

/* ── BELIEFS ── */
.beliefs {
  padding: 160px 64px;
  border-top: 1px solid var(--ash);
}
.beliefs-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 80px;
}
.beliefs-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.beliefs-list { max-width: 1000px; }
.beliefs-item {
  padding: 56px 0;
  border-bottom: 1px solid var(--gold-dim);
}
.beliefs-item:first-child { border-top: 1px solid var(--gold-dim); }
.beliefs-statement {
  font-family: var(--serif); font-weight: 700;
  font-size: clamp(24px, 3vw, 48px);
  line-height: 1.25; color: var(--white);
  letter-spacing: -.02em;
}
.beliefs-num {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .4em; color: var(--gold);
  margin-bottom: 20px;
}

/* ── CTA ── */
.cta {
  padding: 180px 64px;
  border-top: 1px solid var(--ash);
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
}
.cta-heading {
  font-family: var(--serif); font-weight: 900;
  font-size: clamp(36px, 5.5vw, 88px);
  line-height: 1.05; letter-spacing: -.03em;
  color: var(--white); max-width: 900px;
  margin-bottom: 32px;
}
.cta-heading em { font-style: italic; color: var(--haze); }
.cta-sub {
  font-family: var(--serif); font-size: clamp(16px, 1.8vw, 26px);
  font-weight: 400; font-style: italic;
  color: var(--mist); margin-bottom: 64px;
}
.cta-btn {
  display: inline-flex; align-items: center; gap: 14px;
  font-family: var(--sans); font-size: 11px; font-weight: 400;
  letter-spacing: .35em; text-transform: uppercase; text-decoration: none;
  color: var(--ink); background: var(--white);
  padding: 20px 52px;
  border: 1px solid var(--white);
  transition: background .35s var(--ease-luxury), color .35s var(--ease-luxury), border-color .35s var(--ease-luxury);
}
.cta-btn:hover {
  background: transparent;
  color: var(--white);
  border-color: var(--white);
}

/* ── REVEAL ── */
.rv { opacity:0; transform:translateY(48px); transition:opacity 1.1s var(--ease-luxury), transform 1.1s var(--ease-luxury); }
.rv.in { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:.1s }
.rv-d2 { transition-delay:.22s }
.rv-d3 { transition-delay:.36s }

/* ── MOBILE ── */
@media(max-width:960px) {
  .about-hero { padding:0 28px; }
  .story { padding:100px 28px; }
  .story-deco { display:none; }
  .story-list { padding-left:24px; }
  .team { padding:100px 28px; }
  .team-grid { grid-template-columns: 1fr; gap:28px; }
  .beliefs { padding:100px 28px; }
  .beliefs-item { padding:40px 0; }
  .cta { padding:120px 28px; }
}
`;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

/**
 * AboutPage — the About Us page for the MOH media and growth agency.
 * Shares the same design system and cursor as the homepage.
 * Navbar is rendered via the shared Navbar component with activePage="About Us".
 */
export default function AboutPage() {
  const [dot, setDot]       = useState({ x: -100, y: -100 });
  const [ring, setRing]     = useState({ x: -100, y: -100 });
  const [expand, setExpand] = useState(false);
  const ringTarget          = useRef({ x: -100, y: -100 });
  const rafId               = useRef(null);
  const revealEls           = useRef([]);

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

  /** Observes registered elements and adds the `.in` class when they enter the viewport. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /** Ref callback — registers an element for scroll-reveal observation. */
  const reveal = useCallback(el => {
    if (el && !revealEls.current.includes(el)) revealEls.current.push(el);
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
      <Navbar onEnter={onEnter} onLeave={onLeave} activePage="About Us" />

      {/* ──────── ABOUT HERO ──────── */}
      <section className="about-hero">
        <div className="about-hero-bg" aria-hidden="true" />
        <div className="about-hero-vignette" aria-hidden="true" />
        <div className="about-hero-inner">
          <div className="about-hero-label">About Us</div>
          <h1 className="about-hero-title">
            We Are<br /><em>the <span className="moh-highlight">MOH</span>.</em>
          </h1>
          <p className="about-hero-sub">
            Built from the inside. For those who deserve better.
          </p>
        </div>
      </section>

      {/* ──────── STORY ──────── */}
      <section className="story">
        <div className="story-deco" aria-hidden="true">MOH</div>
        <div className="story-inner">

          <div className="story-label rv" ref={reveal}>Our Story</div>

          <p className="story-hook rv" ref={reveal}>
            95% of agencies work the same way.
          </p>

          <p className="story-intro rv rv-d1" ref={reveal}>
            A client walks in with a dream. They walk out with a package.
          </p>

          <div className="story-box rv" ref={reveal}>
            <div className="story-box-line"><span className="arrow">→</span>SEO? Started.</div>
            <div className="story-box-line"><span className="arrow">→</span>Social media posts? Scheduled.</div>
            <div className="story-box-line"><span className="arrow">→</span>Google Ads? Running.</div>
            <div className="story-box-line"><span className="arrow">→</span>Website? Built.</div>
            <div className="story-box-line"><span className="arrow">→</span>Invoice sent. Job done.</div>
            <p style={{ fontSize: 'clamp(18px,2vw,28px)', color: '#ffffff', fontWeight: 700, borderLeft: '3px solid #cc2200', paddingLeft: '20px' }}>
              This is not marketing. These are just checkpoints.
            </p>
          </div>

          <p className="story-question rv rv-d1" ref={reveal}>
            Nobody asked what the brand actually needed. Who is their audience? What will make them stop scrolling?
          </p>

          <p className="story-verdict rv" ref={reveal}>
            Just a checklist. Sold as marketing.
          </p>

          <p className="story-noise rv" ref={reveal}>
            That's not marketing. That's noise.
          </p>

          <p className="story-origin rv rv-d1" ref={reveal}>
            We started the MOH because real brands deserve real thinking. Not packages. Not templates. A system built for you —
          </p>
          <div className="story-origin-emphasis rv rv-d2" ref={reveal}>
            your audience, your market, your moment.
          </div>

        </div>
      </section>

      {/* ──────── BELIEFS ──────── */}
      <section className="beliefs">
        <div className="beliefs-label rv" ref={reveal}>What We Believe</div>
        <div className="beliefs-list">

          <div className="beliefs-item rv" ref={reveal}>
            <div className="beliefs-num">01</div>
            <div className="beliefs-statement">Every brand is different. Your strategy should be too.</div>
          </div>

          <div className="beliefs-item rv rv-d1" ref={reveal}>
            <div className="beliefs-num">02</div>
            <div className="beliefs-statement">Real marketing is not a checklist. It is a system.</div>
          </div>

          <div className="beliefs-item rv rv-d2" ref={reveal}>
            <div className="beliefs-num">03</div>
            <div className="beliefs-statement">We never run ads before we understand your audience.</div>
          </div>

        </div>
      </section>

      {/* ──────── TEAM ──────── */}
      <section className="team">
        <div className="team-label rv" ref={reveal}>The People</div>
        <div className="team-grid">

          <div className="team-card rv" ref={reveal}>
            <div className="team-photo" aria-hidden="true">
              <div className="team-photo-inner" />
            </div>
            <div className="team-info">
              <div className="team-name">Rahul Gupta</div>
              <div className="team-role">Founder &amp; CEO</div>
              <div className="team-bio">The strategy. The vision. The obsession.</div>
            </div>
          </div>

          <div className="team-card rv rv-d1" ref={reveal}>
            <div className="team-photo" aria-hidden="true">
              <div className="team-photo-inner" />
            </div>
            <div className="team-info">
              <div className="team-name">Mansi Rajpoot</div>
              <div className="team-role">Co-Founder &amp; COO</div>
              <div className="team-bio">The operations. The creative. The execution.</div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="cta">
        <h2 className="cta-heading rv" ref={reveal}>
          Ready to be <em>impossible</em> to ignore?
        </h2>
        <p className="cta-sub rv rv-d1" ref={reveal}>Let's build something real.</p>
        <a
          className="cta-btn rv rv-d2"
          href="/contact"
          ref={reveal}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          Let's Talk
        </a>
      </section>
    </>
  );
}
