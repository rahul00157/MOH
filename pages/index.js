import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
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

  --light-bg:     #f5f4f0;
  --light-text:   #111111;
  --light-sub:    #444444;
  --light-border: #e0ddd8;
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
  font-size: clamp(56px, 8vw, 140px);
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
  font-family: var(--sans); font-size: 14px; font-weight: 300;
  letter-spacing: .22em; text-transform: uppercase; color: #e8e8e8;
  line-height: 2.2; max-width: 260px;
}
.hero-tagline strong { color: #ffffff; font-weight: 500; }
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
  font-size: 13px; color: #888888;
  padding: 0 64px; white-space: nowrap;
  display: flex; align-items: center; gap: 64px;
}
.ticker-item::after { content:'·'; font-size:22px; color:var(--gold-dim); }
@keyframes tick { to{ transform:translateX(-50%) } }

/* ── SERVICES ── */
.svc {
  padding: 160px 64px;
  border-top: 1px solid var(--ash);
}
.svc-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 80px; gap: 32px; flex-wrap: wrap;
}
.svc-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
}
.svc-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.svc-title {
  font-family: var(--serif); font-weight: 900;
  font-size: clamp(38px, 4.5vw, 72px);
  line-height: .95; letter-spacing: -.02em; color: var(--white);
}
.svc-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--ash); border-left: 1px solid var(--ash);
}
.svc-card {
  border-right: 1px solid var(--ash); border-bottom: 1px solid var(--ash);
  padding: 64px 56px; position: relative; overflow: hidden;
  transition: background .5s var(--ease-luxury);
}
.svc-card::before {
  content:''; position:absolute; inset:0;
  background: linear-gradient(135deg, rgba(184,160,122,.04) 0%, transparent 60%);
  opacity:0; transition: opacity .5s var(--ease-luxury);
}
.svc-card:hover::before { opacity:1; }
.svc-card:hover { background: var(--soot); }
.svc-num {
  font-family: var(--serif); font-size: 11px; font-weight: 400;
  letter-spacing: .4em; color: var(--gold-dim);
  margin-bottom: 48px; display: block;
}
.svc-card-title {
  font-family: var(--serif); font-weight: 900;
  font-size: clamp(26px, 2.4vw, 42px);
  line-height: 1.05; letter-spacing: -.02em; color: #ffffff;
  margin-bottom: 24px;
}
.svc-desc {
  font-family: var(--sans); font-size: 13px; font-weight: 300;
  letter-spacing: .04em; line-height: 1.9; color: #c0c0c0;
  max-width: 340px; margin-bottom: 48px;
}
.svc-arrow {
  display: inline-flex; align-items: center; gap: 12px;
  font-family: var(--sans); font-size: 10px; font-weight: 400;
  letter-spacing: .35em; text-transform: uppercase; color: var(--gold);
  text-decoration: none;
  transition: gap .35s var(--ease-luxury), color .3s;
}
.svc-arrow::after {
  content: '→'; font-size: 14px; letter-spacing: 0;
  transition: transform .35s var(--ease-luxury);
}
.svc-card:hover .svc-arrow { gap: 20px; color: #6a5a3a; }
.svc-card:hover .svc-arrow::after { transform: translateX(4px); }

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
  font-size: clamp(28px, 3.5vw, 58px);
  line-height: 1.18; letter-spacing: -.015em; color: #f0f0f0;
}
.stmt-copy em { font-style: italic; color: var(--haze); }
.stmt-copy .accent { color: var(--gold-pale); }
.stmt-foot {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--ash);
  gap: 40px; flex-wrap: wrap;
}
.stmt-foot-text {
  font-family: var(--sans); font-size: 13px; font-weight: 300;
  letter-spacing: .18em; color: #cccccc;
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
  line-height: .95; letter-spacing: -.02em; color: #ffffff;
}
.work-title span { display:block; font-style:italic; color:var(--haze); font-size:.72em; }
.work-idx {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .35em; text-transform: uppercase; color: #888888;
}
.work-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.wcard {
  position: relative; overflow: hidden; background: var(--soot);
  cursor: none;
}
.wcard:first-child { min-height: 520px; }
.wcard-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  transition: transform 1s var(--ease-luxury), filter 1s;
  filter: grayscale(100%) brightness(.38);
}
.wcard:hover .wcard-bg { transform: scale(1.07); filter: grayscale(55%) brightness(.52); }
.wcard-inner { position:relative; min-height:520px; height:100%; }
.wcard:first-child .wcard-inner { min-height:520px; }
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
  letter-spacing: .45em; text-transform: uppercase; color: #c8a87a;
  margin-bottom: 14px; display: flex; align-items: center; gap: 10px;
}
.wcard-tag::before { content:'—'; }
.wcard-ttl {
  font-family: var(--serif); font-weight: 700;
  font-size: clamp(22px, 2.6vw, 40px);
  line-height: 1.1; letter-spacing: -.01em; color: #ffffff;
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
.wcard-number {
  position: absolute; top: 44px; left: 44px; z-index: 2;
  font-family: var(--serif); font-size: 120px; font-weight: 900;
  color: rgba(255,255,255,0.04); line-height: 1; user-select: none;
  pointer-events: none;
}
.wcard-year {
  position: absolute; bottom: 44px; right: 44px; z-index: 2;
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .3em; text-transform: uppercase;
  color: rgba(255,255,255,0.15); pointer-events: none;
}
.wcard-line {
  position: absolute; top: 50%; left: 44px; z-index: 2;
  width: 60px; height: 1px; background: rgba(184,160,122,0.2);
  pointer-events: none;
}
.wcard-stats { position:absolute; top:40px; left:44px; transform:none; z-index:2; }
.wcard-stat-num { font-family:var(--serif); font-size:clamp(52px,7vw,96px); font-weight:900; color:#ffffff; line-height:1; letter-spacing:-0.03em; }
.wcard-stat-label { font-family:var(--sans); font-size:13px; font-weight:400; letter-spacing:0.3em; text-transform:uppercase; color:#e0e0e0; margin-top:8px; }
.wcard-stat-sub { font-family:var(--sans); font-size:11px; font-weight:300; letter-spacing:0.25em; text-transform:uppercase; color:#999999; margin-top:6px; }

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
  color: #ffffff; margin-bottom: 28px;
}
.philo-desc {
  font-family: var(--sans); font-size: 13px; font-weight: 300;
  letter-spacing: .12em; line-height: 2; color: #c0c0c0;
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

/* ── ANIMATIONS ── */
.rv {
  opacity: 0; transform: translateY(48px);
  transition: opacity 1.1s var(--ease-luxury), transform 1.1s var(--ease-luxury);
}
.rv.in { opacity: 1; transform: translateY(0); }
.rv-d1 { transition-delay: .1s }
.rv-d2 { transition-delay: .22s }
.rv-d3 { transition-delay: .36s }
.rv-d4 { transition-delay: .5s }

@keyframes shimmerGold {
  0%, 100% { color: var(--haze); text-shadow: none; }
  50% { color: #e8d9be; text-shadow: 0 0 24px rgba(232,217,190,.55); }
}
@keyframes shimmerWhite {
  0%, 100% { color: var(--haze); text-shadow: none; }
  50% { color: #ededed; text-shadow: 0 0 24px rgba(237,237,237,.45); }
}
.shimmer-gold { animation: shimmerGold 4s ease-in-out infinite; }
.shimmer-white { animation: shimmerWhite 4s ease-in-out infinite; animation-delay: 2s; }
@keyframes strokePulse {
  0%,100%{ -webkit-text-stroke:1px rgba(255,255,255,0.06); }
  50%{ -webkit-text-stroke:1px rgba(184,160,122,0.25); }
}
@keyframes highlightPulse {
  0%,100%{ color:#cc2200; }
  50%{ color:#ff4422; }
}
@keyframes mohPulse {
  0%,100%{ opacity:0.08; }
  50%{ opacity:0.9; }
}

/* ── MOBILE ── */
@media(max-width:960px){
  .hero { padding: 0 28px 80px; }
  .hero-sub { flex-direction:column; align-items:flex-start; }
  .hero-scroll { right:28px; }
  .svc { padding:100px 28px; }
  .svc-grid { grid-template-columns:1fr; }
  .svc-card { padding:52px 28px; }
  .stmt { padding:100px 28px; }
  .stmt-deco { display:none; }
  .work { padding:100px 28px; }
  .work-grid { grid-template-columns:1fr; }
  .wcard:first-child { grid-row:span 1; min-height:420px; }
  .wcard-inner, .wcard:first-child .wcard-inner { min-height:420px; }
  .wcard-stats { position:relative; top:auto; left:auto; transform:none; padding:28px 28px 0 28px; }
  .wcard-stat-num { font-size:clamp(36px,10vw,56px); }
  .wcard-body { padding:28px; }
  .wcard-ttl { font-size:clamp(20px,5vw,32px); }
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
}
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

/** Navigation labels rendered in the navbar and footer nav list. */
const NAV_ITEMS = [
  { label: "Home",       href: "/" },
  { label: "About Us",   href: "/about" },
  { label: "What We Do", href: "/services" },
  { label: "Work",       href: "/work" },
  { label: "Contact",    href: "/contact" },
];

/** Marquee labels cycling continuously in the ticker strip. */
const TICKER_ITEMS = ["Attention Marketing", "Performance Growth", "Creative & Visual", "Founder Branding", "Digital Infrastructure", "Full Growth System", "Media & Growth", "India · USA · UAE · Canada"];

/**
 * Featured case study entries shown in the work grid.
 * Each entry includes display text, background gradient, location/year metadata,
 * and a key performance stat rendered as a card overlay.
 */
const WORKS = [
  {
    tag: "Performance · eCommerce · USA",
    title: "A glove brand from America. Nobody knew them. Now they can't be ignored.",
    bg: "linear-gradient(145deg,#06060a 0%,#0e0c14 45%,#080608 100%)",
    location: "USA", year: "2024",
    href: "/work",
    stats: { num: "32×", label: "ROAS", sub: "eCommerce · USA · 9 Months" },
  },
  {
    tag: "Growth · Real Estate · India",
    title: "They were bleeding money on ads. We rebuilt everything. In 30 days — the calls started coming.",
    bg: "linear-gradient(145deg,#0a0806 0%,#181008 45%,#0a0604 100%)",
    location: "India", year: "2024",
    href: "/work",
    stats: { num: "55%", label: "CPL Drop", sub: "Real Estate · India · 30 Days" },
  },
  {
    tag: "Brand · Automotive · India",
    title: "BMW India. One billion people saw what we made.",
    bg: "linear-gradient(145deg,#060a08 0%,#0a1210 45%,#060a06 100%)",
    location: "India", year: "2024",
    href: "/work/bmw",
    stats: { num: "1.12B", label: "Impressions", sub: "Automotive · India · 2023" },
  },
];

/** Philosophy pillars displayed in the three-column philosophy section. */
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

/**
 * TheMOHHomepage — the single-page homepage for the MOH media and growth agency.
 *
 * Responsibilities:
 *  - Custom dual-layer cursor (dot snaps instantly, ring lerps via RAF)
 *  - Scroll-reveal via IntersectionObserver applied to elements registered through `reveal`
 */
export default function TheMOHHomepage() {
  const [dot, setDot]           = useState({ x: -100, y: -100 });
  const [ring, setRing]         = useState({ x: -100, y: -100 });
  const [expand, setExpand]     = useState(false);
  const ringTarget              = useRef({ x: -100, y: -100 });
  const rafId                   = useRef(null);
  const revealEls               = useRef([]);

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

  /** Returns the CSS class for the cursor ring expand state. */
  const expandClass = (isExpanded) => isExpanded ? "expand" : "";

  /** Triggers cursor expand state on interactive element hover. */
  const onEnter = () => setExpand(true);

  /** Resets cursor expand state when leaving an interactive element. */
  const onLeave = () => setExpand(false);

  return (
    <>
      <style>{G}</style>

      {/* Cursor */}
      <div id="cur-dot" className={expand ? "big" : ""} style={{ left: dot.x, top: dot.y }} />
      <div id="cur-ring" className={expandClass(expand)} style={{ left: ring.x, top: ring.y }} />
      <div className="grain" aria-hidden="true" />

      {/* ──────── NAVBAR ──────── */}
      <Navbar onEnter={onEnter} onLeave={onLeave} />

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

        <div style={{ position:"relative", zIndex:3, width:"100%", maxWidth:1400, paddingTop:"120px" }}>
          <div className="hero-eyebrow">
            Media & Growth Company
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
              <a href="/work" className="btn-p" onMouseEnter={onEnter} onMouseLeave={onLeave}>See Our Work</a>
              <a href="/about" className="btn-g" onMouseEnter={onEnter} onMouseLeave={onLeave}>Our Studio</a>
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

      {/* ──────── SERVICES ──────── */}
      <section className="svc">
        <div className="svc-head">
          <div className="svc-label rv" ref={reveal}>What We Do</div>
          <h2 className="svc-title rv rv-d1" ref={reveal}>Our<br /><em>disciplines.</em></h2>
        </div>
        <div className="svc-grid">
          {[
            {
              num: "01",
              title: "Attention Marketing",
              desc: "We engineer scroll-stopping content that makes markets pause. Every asset is built to be remembered — not just seen.",
            },
            {
              num: "02",
              title: "Performance Growth",
              desc: "We run paid ecosystems that compound. No wasted spend — only systems that turn attention into revenue at scale.",
            },
            {
              num: "03",
              title: "Creative & Visual",
              desc: "Identity, campaign, and moving image — crafted for brands that refuse to be ordinary. Beauty with a strategic edge.",
            },
            {
              num: "04",
              title: "Founder Branding",
              desc: "We turn founders into voices their market follows. Authority built through narrative, presence, and consistent signal.",
            },
          ].map((s, i) => (
            <div key={s.num} className={`svc-card rv rv-d${i % 2 + 1}`} ref={reveal}>
              <span className="svc-num">{s.num}</span>
              <h3 className="svc-card-title">{s.title}</h3>
              <p className="svc-desc">{s.desc}</p>
              <a href="#" className="svc-arrow" onMouseEnter={onEnter} onMouseLeave={onLeave}>Explore</a>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── STATEMENT ──────── */}
      <section className="stmt">
        <div className="stmt-deco" aria-hidden="true">MOH</div>
        <div className="stmt-inner">
          <div className="stmt-label rv" ref={reveal}>Manifesto</div>

          <p className="stmt-copy rv rv-d1" ref={reveal}>
            Modern brands no longer<br />
            compete for <em><span className="shimmer-gold">visibility.</span></em><br />
            They compete for{" "}
            <span className="accent">attention,<br />relevance,</span> and{" "}
            <em><span className="shimmer-white">influence.</span></em>
          </p>

          <div className="stmt-foot rv rv-d2" ref={reveal}>
            <div className="stmt-foot-text">
              <p style={{fontFamily:'var(--serif)', fontSize:'clamp(13px,1.4vw,18px)', lineHeight:1.6, color:'#ffffff', marginBottom:'20px'}}>You didn't build a business. You built a belief.</p>
              <p style={{fontFamily:'var(--serif)', fontSize:'clamp(13px,1.4vw,18px)', lineHeight:1.6, color:'#888888', marginBottom:'20px'}}>But out there nobody's paying attention. Your competitor isn't smarter. Their product isn't better. They're just louder.</p>
              <p style={{fontFamily:'var(--serif)', fontSize:'clamp(13px,1.4vw,18px)', lineHeight:1.6, fontStyle:'italic', fontWeight:700, color:'#ffffff', marginBottom:'20px'}}>We <span style={{background:'rgba(255,255,255,0.12)', padding:'2px 8px'}}>engineer obsession</span>. So when your market sees you they <span style={{background:'rgba(255,255,255,0.12)', padding:'2px 8px'}}>can't look away</span>.</p>
            </div>
            <div style={{fontFamily:'var(--serif)', fontSize:'clamp(80px,12vw,200px)', fontWeight:900, color:'#ffffff', letterSpacing:'-0.04em', lineHeight:1, userSelect:'none', animation:'mohPulse 2.5s ease-in-out infinite'}} aria-hidden="true">MOH</div>
          </div>
        </div>
      </section>

      {/* ──────── FEATURED WORK ──────── */}
      <section className="work">
        <div className="work-head rv" ref={reveal}>
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
              ref={reveal}
              style={{ transitionDelay: `${i * 0.12}s` }}
              onMouseEnter={onEnter} onMouseLeave={onLeave}
            >
              <div className="wcard-inner">
                <div className="wcard-bg" style={{ background: w.bg }} />
                <div className="wcard-overlay" />
                <div className="wcard-stats">
                  <div className="wcard-stat-num">{w.stats.num}</div>
                  <div className="wcard-stat-label">{w.stats.label}</div>
                  <div className="wcard-stat-sub">{w.stats.sub}</div>
                </div>
                <div className="wcard-number">{String(i + 1).padStart(2, "0")}</div>
                <div className="wcard-line" />
                <div className="wcard-body">
                  <div className="wcard-tag">{w.tag}</div>
                  <h3 className="wcard-ttl">{w.title}</h3>
                  <a href={w.href} className="wcard-link">View Case Study</a>
                </div>
                <div className="wcard-year">{w.location} · {w.year}</div>
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
            ref={reveal}
            style={{ transitionDelay: `${i * 0.14}s` }}
            onMouseEnter={onEnter} onMouseLeave={onLeave}
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
          <div className="foot-brand rv" ref={reveal}>
            <div className="foot-the">the</div>
            <div className="foot-moh">MOH</div>
            <div className="foot-line">Media & Growth Company</div>
            <div style={{ fontFamily:"var(--sans)", fontSize:"13px", letterSpacing:".3em", color:"#aaaaaa", textTransform:"uppercase", marginTop:"6px", fontWeight:500 }}>India · USA · Canada · UAE</div>
          </div>
          <div className="foot-divider" />
          <ul className="foot-nav rv rv-d1" ref={reveal}>
            {[...NAV_ITEMS, { label: "Let's Talk", href: "/contact" }].map(n => (
              <li key={n.label}>
                <a href={n.href} onMouseEnter={onEnter} onMouseLeave={onLeave}>{n.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="foot-bottom rv" ref={reveal}>
          <span className="foot-copy">© 2025 the MOH. All rights reserved.</span>
          <div className="foot-social">
            <a href="https://www.linkedin.com/company/the-moh-media" target="_blank" rel="noopener noreferrer" onMouseEnter={onEnter} onMouseLeave={onLeave}>LinkedIn</a>
            <a href="https://www.instagram.com/themohmedia/" target="_blank" rel="noopener noreferrer" onMouseEnter={onEnter} onMouseLeave={onLeave}>Instagram</a>
            <a href="https://x.com/themohmedia" target="_blank" rel="noopener noreferrer" onMouseEnter={onEnter} onMouseLeave={onLeave}>X (Twitter)</a>
          </div>
        </div>
      </footer>
    </>
  );
}