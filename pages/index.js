import { useEffect, useRef, useState } from "react";

const services = [
  {
    id: "01",
    title: "Attention Marketing",
    desc: "We engineer cultural moments that demand attention. Campaigns designed to arrest the scroll, ignite conversation, and burn your brand into memory.",
  },
  {
    id: "02",
    title: "Performance Growth Systems",
    desc: "Data-architected growth engines. We build compounding acquisition systems that scale revenue with ruthless precision.",
  },
  {
    id: "03",
    title: "Creative & Visual Engineering",
    desc: "Cinematic-grade creative production. Motion, identity, and visual storytelling crafted to position you as the definitive luxury category leader.",
  },
  {
    id: "04",
    title: "Founder Branding",
    desc: "Your story is your sharpest asset. We shape the public narrative of visionary founders into cultural authority that opens rooms money cannot.",
  },
  {
    id: "05",
    title: "Digital Infrastructure Development",
    desc: "Bespoke digital ecosystems — platforms, products, and infrastructure engineered for speed, elegance, and scale.",
  },
];

const works = [
  { label: "Brand Identity", title: "EPOCH", sub: "Global Luxury Retailer", year: "2024" },
  { label: "Campaign",       title: "NOIR",  sub: "Fashion House",          year: "2024" },
  { label: "Digital",        title: "STRATUM", sub: "FinTech Platform",     year: "2023" },
  { label: "Founder Brand",  title: "VAEL",  sub: "Venture Studio",         year: "2023" },
];

function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}

export default function MOHHomepage() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxY = scrollY * 0.35;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Bebas+Neue&family=DM+Mono:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black: #050505;
          --white: #f5f3ef;
          --grey-1: #1a1a1a;
          --grey-2: #2e2e2e;
          --grey-3: #888;
          --grey-4: #bbb;
          --accent: #e8e0d0;
          --font-display: 'Bebas Neue', sans-serif;
          --font-serif: 'Cormorant Garamond', serif;
          --font-mono: 'DM Mono', monospace;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--white);
          font-family: var(--font-serif);
          overflow-x: hidden;
        }

        /* NAV */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 2rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          mix-blend-mode: difference;
        }
        .nav-logo {
          font-family: var(--font-display);
          font-size: 2rem;
          letter-spacing: 0.25em;
          color: var(--white);
        }
        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }
        .nav-links a {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--grey-4);
          text-decoration: none;
          transition: color 0.3s;
        }
        .nav-links a:hover { color: var(--white); }

        /* HERO */
        .hero {
          position: relative;
          height: 100vh;
          min-height: 700px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 4rem 3rem;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 60% 40%, rgba(60,60,60,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(30,30,30,0.4) 0%, transparent 60%),
            var(--black);
        }
        .hero-grain {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px;
        }
        .hero-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,243,239,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,243,239,0.025) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .hero-number {
          position: absolute;
          top: 50%;
          right: 6rem;
          font-family: var(--font-display);
          font-size: clamp(16rem, 28vw, 30rem);
          color: transparent;
          -webkit-text-stroke: 1px rgba(245,243,239,0.06);
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }
        .hero-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--grey-3);
          margin-bottom: 2rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1s ease 0.3s forwards;
        }
        .hero-headline {
          font-family: var(--font-display);
          font-size: clamp(5rem, 12vw, 13rem);
          line-height: 0.88;
          letter-spacing: -0.01em;
          color: var(--white);
          opacity: 0;
          transform: translateY(40px);
          animation: fadeUp 1.1s ease 0.5s forwards;
        }
        .hero-headline em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 300;
          font-size: 0.5em;
          color: var(--grey-4);
          display: block;
          line-height: 1.6;
          letter-spacing: 0.05em;
        }
        .hero-bottom {
          margin-top: 3rem;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1s ease 0.9s forwards;
        }
        .hero-desc {
          max-width: 380px;
          font-family: var(--font-serif);
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--grey-3);
          font-weight: 300;
        }
        .hero-cta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }
        .btn-primary {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 1rem 2.5rem;
          background: var(--white);
          color: var(--black);
          border: none;
          cursor: pointer;
          transition: transform 0.3s ease, background 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary:hover { transform: scale(1.03); background: var(--accent); }
        .btn-ghost {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--grey-3);
          text-decoration: none;
          border-bottom: 1px solid var(--grey-2);
          padding-bottom: 2px;
          transition: color 0.3s, border-color 0.3s;
        }
        .btn-ghost:hover { color: var(--white); border-color: var(--grey-4); }
        .hero-scroll {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0;
          animation: fadeIn 1s ease 1.5s forwards;
        }
        .scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, transparent, var(--grey-3));
          animation: scrollPulse 2.5s ease infinite;
        }
        .scroll-label {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 0.25em;
          color: var(--grey-3);
          text-transform: uppercase;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }

        /* SECTIONS */
        section {
          padding: 8rem 3rem;
          position: relative;
        }
        .section-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--grey-3);
          margin-bottom: 5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .section-label::before {
          content: '';
          display: block;
          width: 40px;
          height: 1px;
          background: var(--grey-2);
        }

        /* SERVICES */
        .services-section { border-top: 1px solid var(--grey-2); }
        .services-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 6rem;
          align-items: end;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(3.5rem, 7vw, 7rem);
          line-height: 0.9;
          letter-spacing: 0.02em;
        }
        .section-subtitle {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--grey-3);
          font-weight: 300;
        }
        .services-grid { display: flex; flex-direction: column; }
        .service-item {
          display: grid;
          grid-template-columns: 80px 1fr 1fr;
          gap: 2rem;
          padding: 2.5rem 0;
          border-top: 1px solid var(--grey-2);
          transition: border-color 0.3s;
          align-items: start;
        }
        .service-item:last-child { border-bottom: 1px solid var(--grey-2); }
        .service-item:hover { border-top-color: var(--grey-3); }
        .service-item:hover .service-title { color: var(--white); }
        .service-num {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--grey-3);
          letter-spacing: 0.1em;
          padding-top: 0.4rem;
        }
        .service-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--grey-4);
          transition: color 0.3s;
          letter-spacing: 0.01em;
        }
        .service-desc {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--grey-3);
          font-weight: 300;
        }

        /* ABOUT */
        .about-section {
          background: var(--grey-1);
          border-top: 1px solid var(--grey-2);
          overflow: hidden;
        }
        .about-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8rem;
          align-items: center;
        }
        .about-quote {
          font-family: var(--font-serif);
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          line-height: 1.35;
          font-weight: 300;
          color: var(--white);
          margin-bottom: 3rem;
        }
        .about-quote em { font-style: italic; color: var(--grey-4); }
        .about-body {
          font-family: var(--font-serif);
          font-size: 1rem;
          line-height: 1.85;
          color: var(--grey-3);
          font-weight: 300;
        }
        .about-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px;
        }
        .stat-box {
          background: var(--grey-2);
          padding: 3rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .stat-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(245,243,239,0.04) 0%, transparent 60%);
        }
        .stat-num {
          font-family: var(--font-display);
          font-size: 4rem;
          color: var(--white);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--grey-3);
        }
        .stat-box:first-child { background: var(--white); }
        .stat-box:first-child .stat-num { color: var(--black); }
        .stat-box:first-child .stat-label { color: var(--grey-2); }

        /* WORK */
        .work-section { border-top: 1px solid var(--grey-2); }
        .work-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 5rem;
        }
        .work-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3px;
        }
        .work-card {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4/3;
          background: var(--grey-1);
        }
        .work-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 30%, rgba(5,5,5,0.9) 100%);
          z-index: 1;
        }
        .work-card-bg {
          position: absolute;
          inset: 0;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .work-card:hover .work-card-bg { transform: scale(1.06); }
        .work-card-bg-1 { background: linear-gradient(135deg, #1a1a1a 0%, #2e2e2e 100%); }
        .work-card-bg-2 { background: linear-gradient(135deg, #0d0d0d 0%, #222 100%); }
        .work-card-bg-3 { background: linear-gradient(135deg, #111 0%, #1f1f1f 100%); }
        .work-card-bg-4 { background: linear-gradient(135deg, #181818 0%, #2a2a2a 100%); }
        .work-card-pattern-1 {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 30px,
            rgba(245,243,239,0.02) 30px,
            rgba(245,243,239,0.02) 31px
          );
        }
        .work-card-pattern-2 {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 70% 30%, rgba(245,243,239,0.06) 0%, transparent 50%);
        }
        .work-info {
          position: absolute;
          bottom: 0;
          left: 0; right: 0;
          padding: 2rem;
          z-index: 2;
          transform: translateY(8px);
          transition: transform 0.4s ease;
        }
        .work-card:hover .work-info { transform: translateY(0); }
        .work-card-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--grey-3);
          margin-bottom: 0.5rem;
        }
        .work-card-title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          letter-spacing: 0.05em;
          color: var(--white);
          line-height: 1;
        }
        .work-card-sub {
          font-family: var(--font-serif);
          font-size: 0.85rem;
          color: var(--grey-3);
          margin-top: 0.3rem;
          font-weight: 300;
        }
        .work-card-year {
          position: absolute;
          top: 2rem;
          right: 2rem;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: var(--grey-3);
          z-index: 2;
        }

        /* CTA FOOTER */
        .cta-section {
          background: var(--white);
          color: var(--black);
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 6rem 3rem 3rem;
          overflow: hidden;
          position: relative;
        }
        .cta-section::before {
          content: 'MOH';
          position: absolute;
          bottom: -4rem;
          right: -2rem;
          font-family: var(--font-display);
          font-size: clamp(14rem, 28vw, 32rem);
          color: transparent;
          -webkit-text-stroke: 1px rgba(5,5,5,0.07);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }
        .cta-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--grey-3);
          margin-bottom: 3rem;
        }
        .cta-headline {
          font-family: var(--font-display);
          font-size: clamp(4rem, 10vw, 11rem);
          line-height: 0.88;
          letter-spacing: -0.01em;
          color: var(--black);
        }
        .cta-headline em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 300;
          font-size: 0.48em;
          display: block;
          color: var(--grey-3);
          line-height: 1.8;
          letter-spacing: 0.05em;
        }
        .cta-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-top: 5rem;
          position: relative;
          z-index: 1;
        }
        .cta-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .cta-info a {
          font-family: var(--font-serif);
          font-size: 1rem;
          color: var(--grey-3);
          text-decoration: none;
          font-weight: 300;
          transition: color 0.3s;
        }
        .cta-info a:hover { color: var(--black); }
        .btn-dark {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 1.1rem 3rem;
          background: var(--black);
          color: var(--white);
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .btn-dark:hover { transform: scale(1.03); background: #111; }

        /* MARQUEE */
        .marquee-wrap {
          overflow: hidden;
          border-top: 1px solid var(--grey-2);
          border-bottom: 1px solid var(--grey-2);
          padding: 1.2rem 0;
          background: var(--black);
        }
        .marquee-inner {
          display: flex;
          animation: marquee 28s linear infinite;
          width: max-content;
        }
        .marquee-item {
          font-family: var(--font-display);
          font-size: 0.9rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--grey-3);
          padding: 0 3rem;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 3rem;
        }
        .marquee-dot {
          width: 4px; height: 4px;
          background: var(--grey-3);
          border-radius: 50%;
          flex-shrink: 0;
          display: inline-block;
        }

        /* FOOTER */
        .footer-bottom {
          padding: 2rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--grey-2);
          background: var(--black);
        }
        .footer-copy {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: var(--grey-3);
          text-transform: uppercase;
        }
        .footer-social { display: flex; gap: 2rem; }
        .footer-social a {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--grey-3);
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-social a:hover { color: var(--white); }

        /* ANIMATIONS */
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* SCROLL REVEAL */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          nav { padding: 1.5rem; }
          .nav-links { display: none; }
          section { padding: 5rem 1.5rem; }
          .hero { padding: 2rem 1.5rem; }
          .hero-number { display: none; }
          .hero-bottom { flex-direction: column; gap: 2rem; }
          .hero-cta { align-items: flex-start; }
          .services-header { grid-template-columns: 1fr; gap: 2rem; margin-bottom: 3rem; }
          .service-item { grid-template-columns: 50px 1fr; gap: 1rem; }
          .service-desc { display: none; }
          .about-inner { grid-template-columns: 1fr; gap: 4rem; }
          .work-grid { grid-template-columns: 1fr; }
          .cta-bottom { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <span className="nav-logo">MOH</span>
        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-lines" />
        <div
          className="hero-number"
          style={{ transform: `translateY(calc(-50% + ${parallaxY * 0.3}px))`, top: "50%" }}
        >
          M
        </div>

        <div className="hero-tag">Media Operations House — Est. 2024</div>
        <div className="hero-headline">
          WE BUILD<br />
          EMPIRES
          <em>through media, attention &amp; architecture</em>
        </div>
        <div className="hero-bottom">
          <p className="hero-desc">
            MOH is a premium media operations company engineering market-defining brands, campaigns, and digital ecosystems for founders who play to win.
          </p>
          <div className="hero-cta">
            <a href="#contact" className="btn-primary">Begin a Project</a>
            <a href="#work" className="btn-ghost">View Our Work</a>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line" />
          <span className="scroll-label">Scroll</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-inner">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex" }}>
              {[
                "Attention Marketing",
                "Performance Growth",
                "Visual Engineering",
                "Founder Branding",
                "Digital Infrastructure",
                "Premium Positioning",
                "Cultural Authority",
              ].map((t, j) => (
                <div key={j} className="marquee-item">
                  {t} <span className="marquee-dot" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="services-section">
        <div className="section-label reveal">Services</div>
        <div className="services-header">
          <h2 className="section-title reveal">
            WHAT<br />WE DO
          </h2>
          <p className="section-subtitle reveal reveal-delay-2">
            Five disciplines. One philosophy: that every brand deserves to occupy its rightful position as the undisputed leader of its category.
          </p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div
              key={s.id}
              className={`service-item reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <span className="service-num">{s.id}</span>
              <span className="service-title">{s.title}</span>
              <p className="service-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="section-label reveal">About MOH</div>
        <div className="about-inner">
          <div className="about-left">
            <p className="about-quote reveal">
              We don&apos;t make content.<br />
              We make <em>cultural gravity</em> —<br />
              the kind that collapses distance between a brand and its destiny.
            </p>
            <p className="about-body reveal reveal-delay-2">
              MOH was built for the next generation of founders who understand that media is infrastructure — not a department. We operate at the intersection of strategy, design, and technology to engineer brands that pull markets toward them.
              <br /><br />
              Our clients don&apos;t hire agencies. They acquire competitive weapons.
            </p>
          </div>
          <div className="about-right reveal reveal-delay-3">
            <div className="about-stats">
              {[
                { num: "3×",  label: "Average Revenue Lift" },
                { num: "40+", label: "Brands Built" },
                { num: "12",  label: "Countries Active" },
                { num: "98%", label: "Client Retention" },
              ].map((s, i) => (
                <div key={i} className="stat-box">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="work-section">
        <div className="work-header">
          <div className="section-label reveal" style={{ marginBottom: 0 }}>Featured Work</div>
          <h2 className="section-title reveal" style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}>
            SELECTED<br />PROJECTS
          </h2>
        </div>
        <div className="work-grid">
          {works.map((w, i) => (
            <div key={i} className={`work-card reveal reveal-delay-${(i % 3) + 1}`}>
              <div className={`work-card-bg work-card-bg-${i + 1}`}>
                <div className="work-card-pattern-1" />
                <div className="work-card-pattern-2" />
              </div>
              <span className="work-card-year">{w.year}</span>
              <div className="work-info">
                <div className="work-card-label">{w.label}</div>
                <div className="work-card-title">{w.title}</div>
                <div className="work-card-sub">{w.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="cta-section">
        <div>
          <p className="cta-label">Ready to begin?</p>
          <h2 className="cta-headline">
            LET&apos;S BUILD
            <em>your empire, together</em>
          </h2>
        </div>
        <div className="cta-bottom">
          <div className="cta-info">
            <a href="mailto:studio@moh.co">studio@moh.co</a>
            <a href="#">New Business Inquiry</a>
          </div>
          <a href="mailto:studio@moh.co" className="btn-dark">
            Start the Conversation →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-bottom">
        <span className="footer-copy">
          © 2024 MOH — Media Operations House. All Rights Reserved.
        </span>
        <div className="footer-social">
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">Twitter / X</a>
        </div>
      </footer>

      <RevealObserver />
    </>
  );
}