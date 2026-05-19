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
  min-height: 60vh; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: center;
  padding: 140px 64px 60px;
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

/* ── SERVICE SECTIONS ── */
.sv-section {
  padding: 120px 64px;
  border-top: 1px solid var(--ash);
}
.sv-section-header {
  display: flex; align-items: baseline; gap: 32px;
  margin-bottom: 72px;
}
.sv-section-num {
  font-family: var(--sans); font-size: 11px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  flex-shrink: 0; padding-top: 6px;
}
.sv-section-title {
  font-family: var(--serif); font-weight: 900; font-style: italic;
  font-size: clamp(48px, 7vw, 110px);
  line-height: .92; letter-spacing: -.03em; color: var(--white);
}
.sv-section-body {
  display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
  align-items: start;
}
.sv-section-desc {
  font-family: var(--serif); font-weight: 400;
  font-size: clamp(18px, 2vw, 26px);
  color: #aaaaaa; line-height: 1.75; letter-spacing: -.01em;
}
.sv-subs {
  display: flex; flex-direction: column; gap: 0;
}
.sv-sub {
  font-family: var(--sans); font-size: 13px; font-weight: 300;
  letter-spacing: .25em; text-transform: uppercase; color: var(--pearl);
  padding: 20px 0;
  border-bottom: 1px solid var(--ash);
  display: flex; align-items: center; gap: 16px;
}
.sv-sub::before {
  content: ''; display: block; flex-shrink: 0;
  width: 20px; height: 1px; background: var(--gold);
}
.sv-sub:first-child { border-top: 1px solid var(--ash); }

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
.sv-cta-btn {
  font-family: var(--sans); font-size: 11px; font-weight: 400;
  letter-spacing: .35em; text-transform: uppercase; color: var(--ink);
  background: var(--gold); text-decoration: none;
  display: inline-flex; align-items: center;
  padding: 20px 52px;
  transition: background .35s var(--ease-luxury), color .35s, letter-spacing .35s var(--ease-luxury);
}
.sv-cta-btn:hover { background: var(--white); letter-spacing: .5em; }

/* ── REVEAL ── */
.rv { opacity:0; transform:translateY(48px); transition:opacity 1.1s var(--ease-luxury), transform 1.1s var(--ease-luxury); }
.rv.in { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:.12s }
.rv-d2 { transition-delay:.26s }
.rv-d3 { transition-delay:.42s }

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
.foot-divider { width:1px; background: var(--ash); align-self: stretch; }
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
@keyframes mohFooterGlow {
  0%,100%{ color:#ffffff; text-shadow:none; }
  50%{ color:#e8d9be; text-shadow: 0 0 40px rgba(184,160,122,0.4), 0 0 80px rgba(184,160,122,0.2); }
}

/* ── MOBILE ── */
@media(max-width:960px) {
  .sv-hero { padding:120px 28px 60px; }
  .sv-section { padding:80px 28px; }
  .sv-section-header { flex-direction:column; gap:16px; margin-bottom:48px; }
  .sv-section-body { grid-template-columns:1fr; gap:48px; }
  .sv-close { padding:100px 28px; gap:40px; }
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

const SERVICES = [
  {
    num: "01",
    name: "Attention Marketing",
    desc: "You're posting. You're creating. But nobody's watching. We build social systems that stop the scroll.",
    subs: ["Social Strategy", "Viral Content Systems", "Brand Visibility Growth", "Audience Engagement", "Community Growth"],
  },
  {
    num: "02",
    name: "Performance Growth",
    desc: "Most people run ads without knowing who they're talking to. We don't touch your ad account until we understand your buyer.",
    subs: ["Meta Ad Systems", "Google Growth Campaigns", "LinkedIn Ads", "Conversion Advertising", "Revenue Funnel Optimization"],
  },
  {
    num: "03",
    name: "Creative & Visual",
    desc: "People judge your brand in 3 seconds. We make sure those 3 seconds count.",
    subs: ["Brand Visual Identity", "Ad Creative Production", "Motion Graphics", "Video Editing", "Logo Design"],
  },
  {
    num: "04",
    name: "Founder Branding",
    desc: "People don't buy products. They buy from people they trust. If you're not visible you're invisible.",
    subs: ["Founder Branding", "LinkedIn Authority Building", "Personal Brand Systems", "Thought Leadership Positioning", "Public Influence Growth"],
  },
  {
    num: "05",
    name: "Digital Infrastructure",
    desc: "Your brand needs more than marketing. It needs a digital home that converts. We build everything your business needs to run and grow online.",
    subs: ["High-Conversion Websites", "E-Commerce Development", "Landing Page Systems", "CRM Systems", "Automation Workflows", "Custom Software"],
  },
  {
    num: "06",
    name: "Full Growth System",
    desc: "Everything connected. One goal. Unstoppable growth. For brands that are done doing things in pieces.",
    subs: ["Complete Brand Audit", "Multi-Channel Strategy", "Paid & Organic Combined", "Analytics Dashboard", "Monthly Scaling"],
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
      {SERVICES.map(({ num, name, desc, subs }) => (
        <section key={num} className="sv-section">
          <div className="sv-section-header rv" ref={reveal}>
            <span className="sv-section-num">{num}</span>
            <h2 className="sv-section-title">{name}</h2>
          </div>
          <div className="sv-section-body">
            <p className="sv-section-desc rv rv-d1" ref={reveal}>{desc}</p>
            <ul className="sv-subs rv rv-d2" ref={reveal}>
              {subs.map(s => (
                <li key={s} className="sv-sub">{s}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      {/* ──────── CTA ──────── */}
      <section className="sv-close" style={{ borderTop: "1px solid var(--ash)" }}>
        <h2 className="sv-close-text rv" ref={reveal}>
          If you&rsquo;re looking for a vendor,{" "}
          <em style={{ fontStyle: "italic", color: "var(--gold)" }}>we&rsquo;re not it.</em>
          <br />
          If you&rsquo;re looking for a partner — let&rsquo;s talk.
        </h2>
        <a
          href="/contact"
          className="sv-cta-btn rv rv-d1"
          ref={reveal}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          Let&rsquo;s Talk
        </a>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="foot">
        <div className="foot-top">
          <div className="foot-brand rv" ref={reveal}>
            <div className="foot-the">the</div>
            <div className="foot-moh"><span style={{ animation: "mohFooterGlow 3s ease-in-out infinite" }}>MOH</span></div>
            <div className="foot-line">Media &amp; Growth Company</div>
            <div style={{ fontFamily:"var(--sans)", fontSize:"13px", letterSpacing:".3em", color:"#aaaaaa", textTransform:"uppercase", marginTop:"6px", fontWeight:500 }}>India · USA · Canada · UAE</div>
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
