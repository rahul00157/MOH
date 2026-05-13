import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:wght@200;300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

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
  transition: width .4s var(--ease-luxury), height .4s var(--ease-luxury),
              border-color .4s;
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
  padding: 36px 64px;
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
.nav-links { display: flex; gap: 44px; list-style: none; }
.nav-link {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .3em; text-transform: uppercase; color: var(--mist);
  text-decoration: none; position: relative;
  transition: color .3s;
}
.nav-link::after {
  content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px;
  background: var(--white); transition: width .38s var(--ease-luxury);
}
.nav-link:hover { color: var(--white); }
.nav-link:hover::after { width: 100%; }
.nav-btn {
  font-family: var(--sans); font-size: 9px; font-weight: 400;
  letter-spacing: .32em; text-transform: uppercase;
  color: var(--ink); background: var(--white);
  border: none; padding: 13px 30px; text-decoration: none;
  transition: background .3s, transform .3s; display: inline-block;
}
.nav-btn:hover { background: var(--gold-pale); transform: translateY(-2px); }

/* ── HERO ── */
.hero {
  min-height: 100vh; display: flex; flex-direction: column;
  justify-content: flex-end; padding: 0 64px 80px;
  position: relative; overflow: hidden;
}
.hero-grid {
  position: absolute; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
  background-size: 88px 88px;
  animation: gridIn 3s var(--ease-luxury) forwards;
}
@keyframes gridIn { from{opacity:0} to{opacity:1} }
.hero-vignette {
  position: absolute; inset: 0; z-index: 1;
  background:
    radial-gradient(ellipse 70% 70% at 15% 60%, rgba(184,160,122,.04) 0%, transparent 65%),
    radial-gradient(ellipse 50% 90% at 85% 20%, rgba(255,255,255,.015) 0%, transparent 60%),
    linear-gradient(to top, rgba(3,3,3,.9) 0%, transparent 50%);
}
.hero-eyebrow {
  position: relative; z-index: 3;
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 18px;
  opacity: 0; animation: fuA .9s var(--ease-luxury) .6s forwards;
  margin-bottom: 36px;
}
.hero-eyebrow::before { content:''; display:block; width:36px; height:1px; background:var(--gold); }
.hero-hl {
  position: relative; z-index: 3;
  font-family: var(--serif); font-weight: 900;
  font-size: clamp(72px, 11.5vw, 196px);
  line-height: .9; letter-spacing: -.02em;
  color: var(--white); overflow: hidden;
  margin-bottom: 0;
}
.hero-hl-line {
  display: block; opacity: 0; transform: translateY(110%);
  animation: revLine 1.3s var(--ease-luxury) forwards;
}
.hero-hl-line:nth-child(1){ animation-delay:.9s }
.hero-hl-line:nth-child(2){ animation-delay:1.1s; color: var(--silver); }
.hero-hl-line:nth-child(3){ animation-delay:1.3s }
.hero-hl .it { font-style: italic; color: var(--haze); }
@keyframes revLine { to { opacity:1; transform:translateY(0) } }

.hero-sub {
  position: relative; z-index: 3;
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-top: 56px; gap: 40px;
  opacity: 0; animation: fuA 1s var(--ease-luxury) 2s forwards;
}
.hero-tagline {
  font-family: var(--sans); font-size: 11px; font-weight: 300;
  letter-spacing: .22em; text-transform: uppercase; color: var(--fog);
  line-height: 2.2; max-width: 260px;
}
.hero-tagline strong { color: var(--pearl); font-weight: 400; }
.hero-ctas { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.btn-p {
  font-family: var(--sans); font-size: 10px; font-weight: 400;
  letter-spacing: .3em; text-transform: uppercase;
  color: var(--ink); background: var(--white);
  border: none; padding: 18px 44px; text-decoration: none;
  transition: background .3s, transform .35s; display: inline-block;
}
.btn-p:hover { background: var(--gold-pale); transform: translateY(-3px); }
.btn-g {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .3em; text-transform: uppercase;
  color: var(--silver); background: transparent;
  border: 1px solid var(--ash); padding: 18px 44px; text-decoration: none;
  transition: border-color .3s, color .3s, transform .35s; display: inline-block;
}
.btn-g:hover { border-color: var(--silver); color: var(--white); transform: translateY(-3px); }
.hero-scroll {
  position: absolute; bottom: 84px; right: 64px; z-index: 3;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  opacity: 0; animation: fuA 1s ease 2.6s forwards;
}
.hero-scroll span {
  font-family: var(--sans); font-size: 9px; font-weight: 300;
  letter-spacing: .45em; text-transform: uppercase; color: var(--fog);
  writing-mode: vertical-rl;
}
.hero-scroll-line {
  width: 1px; height: 54px;
  background: linear-gradient(var(--fog), transparent);
  animation: lineP 2.2s ease infinite;
}
@keyframes lineP { 0%,100%{opacity:.35;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(.55)} }

@keyframes fuA { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

/* ── TICKER ── */
.ticker {
  border-top: 1px solid var(--ash); border-bottom: 1px solid var(--ash);
  background: var(--soot); padding: 20px 0; overflow: hidden;
}
.ticker-track {
  display: flex; gap: 0; width: max-content;
  animation: tick 35s linear infinite;
}
.ticker-item {
  font-family: var(--serif2); font-style: italic;
  font-size: 13px; color: var(--fog);
  padding: 0 64px; white-space: nowrap;
  display: flex; align-items: center; gap: 64px;
}
.ticker-item::after { content:'·'; font-size:22px; color:var(--gold-dim); }
@keyframes tick { to{ transform:translateX(-50%) } }

/* ── STATEMENT ── */
.stmt {
  padding: 200px 64px;
  border-top: 1px solid var(--ash);
  position: relative; overflow: hidden;
}
.stmt-deco {
  position: absolute; top: 80px; right: 64px;
  font-family: var(--serif); font-size: 220px; font-weight: 900;
  color: rgba(255,255,255,.018); letter-spacing: -.04em;
  line-height: 1; pointer-events: none; user-select: none;
}
.stmt-inner { max-width: 1300px; }
.stmt-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 72px;
}
.stmt-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.stmt-copy {
  font-family: var(--serif); font-weight: 400;
  font-size: clamp(34px, 4.8vw, 78px);
  line-height: 1.18; letter-spacing: -.015em; color: var(--white);
}
.stmt-copy em { font-style: italic; color: var(--haze); }
.stmt-copy .accent { color: var(--gold-pale); }
.stmt-foot {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 100px; padding-top: 56px; border-top: 1px solid var(--ash);
  gap: 40px; flex-wrap: wrap;
}
.stmt-foot-text {
  font-family: var(--sans); font-size: 12px; font-weight: 300;
  letter-spacing: .18em; text-transform: uppercase; color: var(--fog);
  max-width: 400px; line-height: 2;
}
.stmt-num {
  font-family: var(--serif); font-size: 88px; font-weight: 900;
  color: var(--ash); letter-spacing: -.04em; line-height: 1;
  user-select: none;
}

/* ── WORK ── */
.work {
  padding: 160px 64px;
  border-top: 1px solid var(--ash);
}
.work-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 96px; gap: 32px; flex-wrap: wrap;
}
.work-title {
  font-family: var(--serif); font-weight: 900;
  font-size: clamp(44px, 5.5vw, 88px);
  line-height: .95; letter-spacing: -.02em; color: var(--white);
}
.work-title span { display:block; font-style:italic; color:var(--haze); font-size:.72em; }
.work-idx {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .35em; text-transform: uppercase; color: var(--fog);
}
.work-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-template-rows: auto auto;
  gap: 3px;
}
.wcard {
  position: relative; overflow: hidden; background: var(--soot);
  cursor: none;
}
.wcard:first-child { grid-row: span 2; min-height: 740px; }
.wcard-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  transition: transform 1s var(--ease-luxury), filter 1s;
  filter: grayscale(100%) brightness(.38);
}
.wcard:hover .wcard-bg { transform: scale(1.07); filter: grayscale(55%) brightness(.52); }
.wcard-inner { position:relative; min-height:360px; height:100%; }
.wcard:first-child .wcard-inner { min-height:740px; }
.wcard-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.82) 0%, rgba(0,0,0,.1) 55%, transparent 100%);
  z-index: 1;
}
.wcard-body {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 44px 44px 44px;
  z-index: 2;
}
.wcard-tag {
  font-family: var(--sans); font-size: 9px; font-weight: 300;
  letter-spacing: .45em; text-transform: uppercase; color: var(--gold);
  margin-bottom: 14px; display: flex; align-items: center; gap: 10px;
}
.wcard-tag::before { content:'—'; }
.wcard-ttl {
  font-family: var(--serif); font-weight: 700;
  font-size: clamp(22px, 2.6vw, 40px);
  line-height: 1.1; letter-spacing: -.01em; color: var(--white);
  margin-bottom: 22px;
}
.wcard-link {
  font-family: var(--sans); font-size: 9px; font-weight: 300;
  letter-spacing: .32em; text-transform: uppercase; color: var(--silver);
  text-decoration: none; display: inline-flex; align-items: center; gap: 10px;
  transition: color .3s, gap .35s;
}
.wcard-link::after { content:'→'; font-size: 15px; transition: transform .35s; }
.wcard:hover .wcard-link { color: var(--white); gap: 16px; }
.wcard:hover .wcard-link::after { transform: translateX(4px); }
.wcard-accent {
  position: absolute; bottom: 0; left: 0; width: 0; height: 2px;
  background: var(--gold); z-index: 3;
  transition: width .6s var(--ease-luxury);
}
.wcard:hover .wcard-accent { width: 100%; }

/* ── PHILOSOPHY ── */
.philo {
  padding: 0; border-top: 1px solid var(--ash);
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;
  background: var(--ash);
}
.philo-card {
  background: var(--ink); padding: 100px 64px;
  border-right: 1px solid var(--ash);
  position: relative; overflow: hidden;
  transition: background .5s;
  cursor: none;
}
.philo-card:last-child { border-right: none; }
.philo-card:hover { background: var(--soot); }
.philo-num {
  font-family: var(--serif); font-size: 100px; font-weight: 900;
  color: rgba(255,255,255,.04); letter-spacing: -.04em; line-height: 1;
  position: absolute; top: 32px; right: 40px;
  transition: color .5s;
}
.philo-card:hover .philo-num { color: rgba(184,160,122,.08); }
.philo-icon {
  width: 32px; height: 1px; background: var(--gold-dim);
  margin-bottom: 40px;
  transition: width .4s var(--ease-luxury);
}
.philo-card:hover .philo-icon { width: 56px; }
.philo-word {
  font-family: var(--serif); font-weight: 900;
  font-size: clamp(40px, 4.5vw, 72px);
  letter-spacing: -.02em; line-height: 1;
  color: var(--white); margin-bottom: 28px;
}
.philo-desc {
  font-family: var(--sans); font-size: 11px; font-weight: 300;
  letter-spacing: .12em; line-height: 2; color: var(--fog);
  max-width: 280px;
  transition: color .4s;
}
.philo-card:hover .philo-desc { color: var(--mist); }

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
.foot-nav { display: flex; flex-direction: column; gap: 18px; list-style: none; align-items: flex-end; }
.foot-nav a {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .3em; text-transform: uppercase; color: var(--fog);
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
  letter-spacing: .2em; color: var(--fog);
}
.foot-social { display: flex; gap: 36px; }
.foot-social a {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .28em; text-transform: uppercase; color: var(--fog);
  text-decoration: none; transition: color .3s;
}
.foot-social a:hover { color: var(--white); }

/* ── REVEAL ANIMATIONS ── */
.rv {
  opacity: 0; transform: translateY(48px);
  transition: opacity 1.1s var(--ease-luxury), transform 1.1s var(--ease-luxury);
}
.rv.in { opacity: 1; transform: translateY(0); }
.rv-d1 { transition-delay: .1s }
.rv-d2 { transition-delay: .22s }
.rv-d3 { transition-delay: .36s }
.rv-d4 { transition-delay: .5s }

/* ── MOBILE ── */
@media(max-width:960px){
  .nav { padding:24px 28px; }
  .nav.stuck { padding:14px 28px; }
  .nav-links, .nav-btn { display:none; }
  .hero { padding: 0 28px 80px; }
  .hero-sub { flex-direction:column; align-items:flex-start; }
  .hero-scroll { right:28px; }
  .stmt { padding:100px 28px; }
  .stmt-deco { display:none; }
  .work { padding:100px 28px; }
  .work-grid { grid-template-columns:1fr; }
  .wcard:first-child { grid-row:span 1; min-height:420px; }
  .wcard-inner, .wcard:first-child .wcard-inner { min-height:360px; }
  .philo { grid-template-columns:1fr; }
  .philo-card { border-right:none; border-bottom:1px solid var(--ash); padding:72px 28px; }
  .foot { padding:80px 28px 48px; }
  .foot-top { grid-template-columns:1fr; }
  .foot-divider { display:none; }
  .foot-nav { align-items:flex-start; }
  .foot-bottom { flex-direction:column; align-items:flex-start; }
}
@media(max-width:600px){
  .hero-hl { font-size: clamp(56px, 16vw, 96px); }
  .nav-brand-moh { font-size:22px; }
}
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const NAV_ITEMS = ["Home", "About", "Services", "Work", "Journal", "Contact"];
const TICKER_ITEMS = ["Brand Identity", "Visual Campaigns", "Growth Strategy", "Moving Image", "Editorial Direction", "Market Dominance", "Founder Branding", "Cultural Influence"];

const WORKS = [
  {
    tag: "Luxury Clinic Growth System",
    title: "Skin & Soul — The Anatomy of Desire",
    bg: "linear-gradient(145deg,#06060a 0%,#0e0c14 45%,#080608 100%)",
  },
  {
    tag: "Modern D2C Launch",
    title: "Mitti — Indian Earth Reimagined",
    bg: "linear-gradient(145deg,#0a0806 0%,#181008 45%,#0a0604 100%)",
  },
  {
    tag: "Premium Founder Branding",
    title: "The Quiet Power of Suresh Mehta",
    bg: "linear-gradient(145deg,#060a08 0%,#0a1210 45%,#060a06 100%)",
  },
];

const PHILOS = [
  {
    word: "Attention",
    desc: "We engineer the first look. The pause. The moment a market stops scrolling and starts watching.",
  },
  {
    word: "Influence",
    desc: "We architect lasting perception. Not impressions — belief. Not reach — authority.",
  },
  {
    word: "Obsession",
    desc: "We build brands that become desires. That people follow, share, and defend without being asked.",
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function TheMOHHomepage() {
  const [stuck, setStuck]           = useState(false);
  const [dot, setDot]               = useState({ x: -100, y: -100 });
  const [ring, setRing]             = useState({ x: -100, y: -100 });
  const [expand, setExpand]         = useState(false);
  const ringTarget                  = useRef({ x: -100, y: -100 });
  const raf                         = useRef(null);
  const revRefs                     = useRef([]);

  // Scroll stuck
  useEffect(() => {
    const h = () => setStuck(window.scrollY > 70);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Cursor
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
      raf.current = requestAnimationFrame(lerp);
    };
    raf.current = requestAnimationFrame(lerp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const rv = useCallback(el => {
    if (el && !revRefs.current.includes(el)) revRefs.current.push(el);
  }, []);

  const cx = (expand) => expand ? "expand" : "";
  const ho = () => setExpand(true);
  const hl = () => setExpand(false);

  return (
    <>
      <style>{G}</style>

      {/* Cursor */}
      <div id="cur-dot" className={expand ? "big" : ""} style={{ left: dot.x, top: dot.y }} />
      <div id="cur-ring" className={cx(expand)} style={{ left: ring.x, top: ring.y }} />
      <div className="grain" aria-hidden="true" />

      {/* ──────── NAVBAR ──────── */}
      <nav className={`nav ${stuck ? "stuck" : ""}`}>
        <a href="#" className="nav-brand" onMouseEnter={ho} onMouseLeave={hl}>
          <span className="nav-brand-the">the</span>
          <span className="nav-brand-moh">MOH</span>
        </a>
        <ul className="nav-links">
          {NAV_ITEMS.map(n => (
            <li key={n}>
              <a href="#" className="nav-link" onMouseEnter={ho} onMouseLeave={hl}>{n}</a>
            </li>
          ))}
        </ul>
        <a href="#" className="nav-btn" onMouseEnter={ho} onMouseLeave={hl}>Commission</a>
      </nav>

      {/* ──────── HERO ──────── */}
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />

        {/* Logo watermark */}
        <div aria-hidden="true" style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          fontFamily:"var(--serif)", fontWeight:900,
          fontSize:"clamp(180px,28vw,520px)",
          color:"rgba(255,255,255,.018)",
          letterSpacing:".05em", lineHeight:1,
          userSelect:"none", pointerEvents:"none",
          zIndex:0, whiteSpace:"nowrap"
        }}>MOH</div>

        <div style={{ position:"relative", zIndex:3, width:"100%", maxWidth:1400 }}>
          <div className="hero-eyebrow">
            Mumbai · Delhi · Bengaluru — Modern Indian Media Institution
          </div>

          <h1 className="hero-hl">
            <span className="hero-hl-line">We Build</span>
            <span className="hero-hl-line"><span className="it">Brands</span></span>
            <span className="hero-hl-line">People Can't<br/>Ignore.</span>
          </h1>

          <div className="hero-sub">
            <div className="hero-tagline">
              <strong>Attention.</strong> Influence.<br />
              <strong>Obsession.</strong><br />
              the MOH — Media & Growth
            </div>
            <div className="hero-ctas">
              <a href="#" className="btn-p" onMouseEnter={ho} onMouseLeave={hl}>See Our Work</a>
              <a href="#" className="btn-g" onMouseEnter={ho} onMouseLeave={hl}>Our Studio</a>
            </div>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* ──────── TICKER ──────── */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className="ticker-item">{t}</span>
          ))}
        </div>
      </div>

      {/* ──────── STATEMENT ──────── */}
      <section className="stmt">
        <div className="stmt-deco" aria-hidden="true">MOH</div>
        <div className="stmt-inner">
          <div className="stmt-label rv" ref={rv}>Manifesto</div>

          <p className="stmt-copy rv rv-d1" ref={rv}>
            Modern brands no longer<br />
            compete for <em>visibility.</em><br />
            They compete for{" "}
            <span className="accent">attention,<br />relevance,</span> and{" "}
            <em>influence.</em>
          </p>

          <div className="stmt-foot rv rv-d2" ref={rv}>
            <p className="stmt-foot-text">
              the MOH exists at the intersection of strategy,
              story, and aesthetic power — built for businesses
              that refuse to be ordinary.
            </p>
            <div className="stmt-num" aria-hidden="true">MOH</div>
          </div>
        </div>
      </section>

      {/* ──────── FEATURED WORK ──────── */}
      <section className="work">
        <div className="work-head rv" ref={rv}>
          <h2 className="work-title">
            Selected
            <span>Work</span>
          </h2>
          <span className="work-idx">003 / Featured Projects</span>
        </div>

        <div className="work-grid">
          {WORKS.map((w, i) => (
            <div
              key={i}
              className="wcard rv"
              ref={rv}
              style={{ transitionDelay: `${i * 0.12}s` }}
              onMouseEnter={ho} onMouseLeave={hl}
            >
              <div className="wcard-inner">
                <div className="wcard-bg" style={{ background: w.bg }} />
                <div className="wcard-overlay" />
                <div className="wcard-body">
                  <div className="wcard-tag">{w.tag}</div>
                  <h3 className="wcard-ttl">{w.title}</h3>
                  <a href="#" className="wcard-link">View Case Study</a>
                </div>
                <div className="wcard-accent" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── PHILOSOPHY ──────── */}
      <section className="philo" aria-label="MOH Philosophy">
        {PHILOS.map((p, i) => (
          <div
            key={i}
            className="philo-card rv"
            ref={rv}
            style={{ transitionDelay: `${i * 0.14}s` }}
            onMouseEnter={ho} onMouseLeave={hl}
          >
            <div className="philo-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</div>
            <div className="philo-icon" />
            <div className="philo-word">{p.word}</div>
            <p className="philo-desc">{p.desc}</p>
          </div>
        ))}
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="foot">
        <div className="foot-top">
          <div className="foot-brand rv" ref={rv}>
            <div className="foot-the">the</div>
            <div className="foot-moh">MOH</div>
            <div className="foot-line">Media & Growth Institution — India</div>
          </div>
          <div className="foot-divider" />
          <ul className="foot-nav rv rv-d1" ref={rv}>
            {[...NAV_ITEMS, "Commission"].map(n => (
              <li key={n}>
                <a href="#" onMouseEnter={ho} onMouseLeave={hl}>{n}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="foot-bottom rv" ref={rv}>
          <span className="foot-copy">© 2025 the MOH. All rights reserved.</span>
          <div className="foot-social">
            {["Instagram", "LinkedIn", "Behance", "Twitter"].map(s => (
              <a key={s} href="#" onMouseEnter={ho} onMouseLeave={hl}>{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}