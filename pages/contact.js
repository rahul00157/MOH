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

/* ── CONTACT HERO ── */
.contact-hero {
  min-height: 50vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 0 64px 40px;
  position: relative; overflow: hidden;
}
.contact-hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
  background-size: 88px 88px;
}
.contact-hero-vignette {
  position: absolute; inset: 0; z-index: 1;
  background:
    radial-gradient(ellipse 70% 70% at 20% 50%, rgba(184,160,122,.04) 0%, transparent 65%),
    linear-gradient(to bottom, rgba(3,3,3,.6) 0%, transparent 40%, rgba(3,3,3,.8) 100%);
}
.contact-hero-inner {
  position: relative; z-index: 3;
  max-width: 1200px;
}
.contact-hero-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 48px;
  opacity: 0; animation: fadeUp .9s var(--ease-luxury) .4s forwards;
}
.contact-hero-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.contact-hero-title {
  font-family: var(--serif); font-weight: 900;
  font-size: clamp(56px, 9vw, 160px);
  line-height: .92; letter-spacing: -.03em; color: var(--white);
  margin-bottom: 48px;
  opacity: 0; animation: fadeUp 1.2s var(--ease-luxury) .7s forwards;
}
.contact-hero-title em { font-style: italic; color: var(--haze); }
.contact-hero-sub {
  font-family: var(--serif); font-size: clamp(16px, 1.8vw, 26px);
  font-weight: 400; font-style: italic;
  color: #aaaaaa; line-height: 1.6; max-width: 640px;
  opacity: 0; animation: fadeUp 1s var(--ease-luxury) 1.1s forwards;
}

@keyframes fadeUp { from{ opacity:0; transform:translateY(32px) } to{ opacity:1; transform:translateY(0) } }

/* ── REVEAL ── */
.rv { opacity:0; transform:translateY(48px); transition:opacity 1.1s var(--ease-luxury), transform 1.1s var(--ease-luxury); }
.rv.in { opacity:1; transform:translateY(0); }
.rv-d1 { transition-delay:.1s }
.rv-d2 { transition-delay:.22s }
.rv-d3 { transition-delay:.36s }

/* ── STATEMENT ── */
.stmt {
  padding: 40px 64px 40px;
  border-top: 1px solid var(--ash);
  position: relative; overflow: hidden;
}
.stmt-q {
  font-family: var(--sans); font-weight: 400; font-style: normal;
  font-size: clamp(15px, 1.6vw, 20px);
  color: #cccccc; line-height: 1.7; letter-spacing: 0;
  max-width: 960px;
  margin-bottom: 20px;
}
.stmt-q:last-of-type { margin-bottom: 0; }
.stmt-deny {
  font-family: var(--serif); font-weight: 700; font-style: normal;
  font-size: clamp(20px, 2.2vw, 32px);
  line-height: 1.1; letter-spacing: -.02em;
  color: var(--gold);
  margin-top: 32px; margin-bottom: 56px;
}
.stmt-cta {
  font-family: var(--sans); font-size: 16px;
  font-weight: 300; color: #cccccc;
  line-height: 1.8; max-width: 700px; margin-top: 16px;
}

/* ── CONTACT FORM + SERVICES ── */
.contact-section {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 100px; padding: 60px 64px 180px;
  border-top: 1px solid var(--ash);
}

.form-section-label {
  font-family: var(--sans); font-size: 11px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 28px;
}
.form-section-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }
.form-section-heading {
  font-family: var(--serif); font-weight: 700;
  font-size: clamp(36px, 5vw, 72px);
  color: #ffffff; line-height: 1.05; letter-spacing: -0.02em;
  margin-bottom: 60px;
  opacity: 0; animation: fuA 1s ease forwards;
}
@keyframes fuA { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

.form-field { display: flex; flex-direction: column; margin-bottom: 32px; }
.form-field-label {
  font-family: var(--sans); font-size: 13px; font-weight: 500;
  letter-spacing: 0.35em; text-transform: uppercase; color: #ffffff;
  margin-bottom: 14px;
}
.form-input,
.form-select,
.form-textarea {
  font-family: var(--sans); font-size: 18px; font-weight: 300;
  color: #ffffff; background: transparent;
  border: none; border-bottom: 1px solid #444444;
  padding: 16px 0; outline: none; width: 100%;
  transition: border-color .4s var(--ease-luxury);
  caret-color: var(--gold);
}
.form-input:focus,
.form-select:focus,
.form-textarea:focus { border-bottom-color: #ffffff; }
.form-input::placeholder,
.form-textarea::placeholder { color: #555555; }

.form-select-wrap { position: relative; }
.form-select {
  appearance: none; cursor: none;
  color: var(--fog);
}
.form-select.has-value { color: var(--white); }
.form-select option { background: var(--coal); color: var(--white); }
.form-select-arrow {
  position: absolute; right: 0; bottom: 18px;
  width: 7px; height: 7px;
  border-right: 1px solid rgba(255,255,255,.3);
  border-bottom: 1px solid rgba(255,255,255,.3);
  transform: rotate(45deg);
  pointer-events: none;
}
.form-textarea { resize: none; line-height: 1.8; min-height: 160px; }

.form-submit {
  font-family: var(--sans); font-size: 11px; font-weight: 400;
  letter-spacing: .35em; text-transform: uppercase;
  color: var(--ink); background: var(--white);
  border: 1px solid var(--white); padding: 20px 52px;
  cursor: none; margin-top: 8px; display: inline-block;
  transition: background .35s var(--ease-luxury), color .35s var(--ease-luxury);
}
.form-submit:hover { background: transparent; color: var(--white); }

.services-section-label {
  font-family: var(--sans); font-size: 10px; font-weight: 300;
  letter-spacing: .5em; text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 64px;
}
.services-section-label::before { content:''; display:block; width:28px; height:1px; background:var(--gold); }

.service-card {
  display: flex; align-items: flex-start; gap: 28px;
  padding: 16px 0; border-bottom: 1px solid var(--ash);
  transition: border-color .3s;
}
.service-card:first-of-type { border-top: 1px solid var(--ash); }
.service-num {
  font-family: var(--sans); font-size: 11px; font-weight: 300;
  letter-spacing: .4em; color: var(--gold);
  min-width: 42px; padding-top: 5px; flex-shrink: 0;
}
.service-name {
  font-family: var(--serif); font-weight: 700;
  font-size: clamp(16px, 1.8vw, 22px);
  color: var(--white); letter-spacing: -.01em;
  margin-bottom: 10px;
}
.service-desc {
  font-family: var(--sans); font-size: 13px; font-weight: 300;
  color: #aaaaaa; line-height: 1.8;
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
@keyframes mohFooterGlow {
  0%,100%{ color:#ffffff; text-shadow:none; }
  50%{ color:#e8d9be; text-shadow: 0 0 40px rgba(184,160,122,0.4), 0 0 80px rgba(184,160,122,0.2); }
}

/* ── MOBILE ── */
@media(max-width:960px) {
  .contact-hero { padding:0 28px; }
  .stmt { padding:100px 28px 120px; }
  .contact-section { grid-template-columns:1fr; gap:80px; padding:100px 28px 120px; }
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
  { num: "01", name: "Attention Marketing", desc: "You're posting. You're creating. But nobody's watching. The problem isn't your product — it's that your content is reaching the wrong people, at the wrong time, on the wrong platform. We fix that. We figure out exactly where your audience lives online, what makes them stop scrolling, and build a real attention strategy." },
  { num: "02", name: "Performance Growth",  desc: "You've probably already tried running ads. Maybe they worked, maybe they didn't. The real problem is most people run ads without knowing who they're talking to. We don't touch your ad account until we understand your buyer. Then we pick the right platform and scale what works." },
  { num: "03", name: "Creative and Visual", desc: "People judge your brand in 3 seconds. If your visuals don't look premium, they move on. We handle everything visual — brand identity, ad creatives, motion graphics, social content. Your brand should look like it belongs at the top." },
  { num: "04", name: "Founder Branding",    desc: "Here's something most founders don't realise — people don't just buy products, they buy from people they trust. If you're not visible, you're invisible. We build your personal brand so that when someone searches your name or sees your content, they already respect you before you've said a word." },
  { num: "05", name: "Full Growth System",  desc: "This is for brands that are done doing things in pieces. You don't need a social media guy, a separate ads person, and someone else for the website. You need one system where everything talks to each other. We build that — strategy, content, paid media, analytics — all connected, all working toward one goal." },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function ContactPage() {
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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const reveal = useCallback(el => {
    if (el && !revealEls.current.includes(el)) revealEls.current.push(el);
  }, []);

  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", country: "", service: "", brief: "" });
  const setField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

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
      <Navbar onEnter={onEnter} onLeave={onLeave} activePage="Contact" />

      {/* ──────── HERO ──────── */}
      <section className="contact-hero">
        <div className="contact-hero-bg" aria-hidden="true" />
        <div className="contact-hero-vignette" aria-hidden="true" />
        <div className="contact-hero-inner">
          <div className="contact-hero-label">Contact</div>
          <h1 className="contact-hero-title">
            Let's <em>Talk.</em>
          </h1>
          <p className="contact-hero-sub">
            Tell us about your brand. We'll tell you what's possible.
          </p>
        </div>
      </section>

      {/* ──────── STATEMENT ──────── */}
      <section className="stmt">
        <p className="stmt-q rv" ref={reveal}>
          Still paying for 30 posts a month that nobody sees?
        </p>
        <p className="stmt-q rv" ref={reveal}>
          Still running ads with no idea which paid media platform is the best fit for your needs?
        </p>
        <p className="stmt-q rv" ref={reveal}>
          Still waiting for that SEO report that shows progress but zero leads?
        </p>
        <p className="stmt-q rv" ref={reveal}>
          Still getting a new strategy deck every month that looks different but does the same nothing?
        </p>

        <p className="stmt-deny rv" ref={reveal}>
          We don't do any of that.
        </p>
        <p className="stmt-cta rv" ref={reveal}>
          Fill the form. Tell us about your brand. We'll tell you exactly what it needs.{" "}
          No deck. No package. No template. Just real work.
        </p>
      </section>

      {/* ──────── FORM + SERVICES ──────── */}
      <section className="contact-section">

        {/* Left: Form */}
        <div>
          <div className="form-section-label rv" ref={reveal}>Get in Touch</div>
          <h2 className="form-section-heading">Let's Build Something Real.</h2>
          <form onSubmit={e => e.preventDefault()}>

            <div className="form-field rv" ref={reveal}>
              <label className="form-field-label" htmlFor="cf-name">Full Name</label>
              <input id="cf-name" className="form-input" type="text"
                value={form.name} onChange={setField("name")}
                onMouseEnter={onEnter} onMouseLeave={onLeave} />
            </div>

            <div className="form-field rv" ref={reveal}>
              <label className="form-field-label" htmlFor="cf-email">Email</label>
              <input id="cf-email" className="form-input" type="email"
                value={form.email} onChange={setField("email")}
                onMouseEnter={onEnter} onMouseLeave={onLeave} />
            </div>

            <div className="form-field rv" ref={reveal}>
              <label className="form-field-label" htmlFor="cf-phone">Phone Number</label>
              <input id="cf-phone" className="form-input" type="tel"
                value={form.phone} onChange={setField("phone")}
                onMouseEnter={onEnter} onMouseLeave={onLeave} />
            </div>

            <div className="form-field rv" ref={reveal}>
              <label className="form-field-label" htmlFor="cf-company">Company or Brand Name</label>
              <input id="cf-company" className="form-input" type="text"
                value={form.company} onChange={setField("company")}
                onMouseEnter={onEnter} onMouseLeave={onLeave} />
            </div>

            <div className="form-field rv" ref={reveal}>
              <label className="form-field-label" htmlFor="cf-country">Country</label>
              <input id="cf-country" className="form-input" type="text"
                value={form.country} onChange={setField("country")}
                onMouseEnter={onEnter} onMouseLeave={onLeave} />
            </div>

            <div className="form-field rv" ref={reveal}>
              <label className="form-field-label" htmlFor="cf-service">What do you need help with</label>
              <div className="form-select-wrap">
                <select id="cf-service"
                  className={`form-select${form.service ? " has-value" : ""}`}
                  value={form.service} onChange={setField("service")}
                  onMouseEnter={onEnter} onMouseLeave={onLeave}>
                  <option value="" disabled hidden />
                  <option value="attention">Attention Marketing</option>
                  <option value="performance">Performance Growth</option>
                  <option value="creative">Creative and Visual</option>
                  <option value="founder">Founder Branding</option>
                  <option value="full">Full Growth System</option>
                  <option value="notsure">Not Sure — Let's Talk</option>
                </select>
                <div className="form-select-arrow" aria-hidden="true" />
              </div>
            </div>

            <div className="form-field rv" ref={reveal}>
              <label className="form-field-label" htmlFor="cf-brief">Tell us about your brand</label>
              <textarea id="cf-brief" className="form-textarea" rows={5}
                value={form.brief} onChange={setField("brief")}
                onMouseEnter={onEnter} onMouseLeave={onLeave} />
            </div>

            <button className="form-submit rv" ref={reveal} type="submit"
              onMouseEnter={onEnter} onMouseLeave={onLeave}>
              Let's Talk
            </button>

          </form>
        </div>

        {/* Right: Services */}
        <div>
          <div className="services-section-label rv" ref={reveal}>What We Do</div>
          {SERVICES.map(({ num, name, desc }) => (
            <div key={num} className="service-card rv" ref={reveal}
              onMouseEnter={onEnter} onMouseLeave={onLeave}>
              <div className="service-num">{num}</div>
              <div>
                <div className="service-name">{name}</div>
                <div className="service-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="foot">
        <div className="foot-top">
          <div className="foot-brand rv" ref={reveal}>
            <div className="foot-the">the</div>
            <div className="foot-moh"><span style={{ animation: "mohFooterGlow 3s ease-in-out infinite" }}>MOH</span></div>
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
