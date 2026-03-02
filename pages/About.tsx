import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Shield, Users, Zap, ArrowRight, Trophy, Target } from 'lucide-react';
import image2 from '../assets/image2.jpeg';
import image3 from '../assets/gohard2.png';
import image4 from '../assets/image4.jpeg';
import { useEffect, useState } from 'react';

const About: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="bg-[#09090b] min-h-screen pt-20">
      {/* Manifesto Hero Section - Left-Aligned Elite Edition */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@1,900&display=swap');

        .font-bebas  { font-family: 'Bebas Neue', sans-serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }

        /* Gold vertical bar */
        .gold-bar {
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s;
        }
        .hero-loaded .gold-bar { transform: scaleY(1); }

        /* Staggered reveals */
        .r1 { opacity:0; transform:translateY(36px); transition:opacity .9s cubic-bezier(.16,1,.3,1) .4s,transform .9s cubic-bezier(.16,1,.3,1) .4s; }
        .r2 { opacity:0; transform:translateY(36px); transition:opacity .9s cubic-bezier(.16,1,.3,1) .58s,transform .9s cubic-bezier(.16,1,.3,1) .58s; }
        .r3 { opacity:0; transform:translateX(-16px); transition:opacity .8s cubic-bezier(.16,1,.3,1) .78s,transform .8s cubic-bezier(.16,1,.3,1) .78s; }
        .r4 { opacity:0; transform:translateY(16px); transition:opacity .8s cubic-bezier(.16,1,.3,1) .96s,transform .8s cubic-bezier(.16,1,.3,1) .96s; }
        .r5 { opacity:0; transform:translateX(28px); transition:opacity 1s cubic-bezier(.16,1,.3,1) .7s,transform 1s cubic-bezier(.16,1,.3,1) .7s; }
        .r6 { opacity:0; transition:opacity .8s 1.4s; }
        .r7 { opacity:0; transition:opacity .8s 1.2s; }

        .hero-loaded .r1,
        .hero-loaded .r2,
        .hero-loaded .r3,
        .hero-loaded .r4,
        .hero-loaded .r5,
        .hero-loaded .r6,
        .hero-loaded .r7 {
          opacity:1 !important;
          transform:none !important;
        }

        /* Pulse animation for scroll dot */
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.3; transform:scale(.5); }
        }
        .pulse { animation: pulse-dot 2s infinite; }
      `}</style>

      <section
        className={`relative min-h-screen flex items-center overflow-hidden bg-[#080808] ${loaded ? "hero-loaded" : ""}`}
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={image3}
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-[0.2] grayscale scale-105"
          />
        </div>

        {/* Animated left gold bar */}
        <div className="gold-bar absolute left-0 top-0 bottom-0 w-[2px] z-10"
          style={{ background: "linear-gradient(to bottom, transparent, #C9A84C 30%, #C9A84C 70%, transparent)" }} />

        {/* Corner accent bracket */}
        <div className="r7 absolute top-7 right-7 w-14 h-14 border-t border-r border-[#C9A84C]/30 z-10" />

        {/* ── Main grid ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT column */}
          <div className="space-y-10">

            {/* Eyebrow line + label */}
            <div className="r1 flex items-center gap-4">
              <div className="w-12 h-px bg-[#C9A84C] flex-shrink-0" />
              <span className="text-[#C9A84C] text-[10px] font-medium tracking-[0.4em] uppercase">
                Established in Grit
              </span>
            </div>

            {/* Headline */}
            <div>
              <span className="r1 font-bebas block text-[clamp(5rem,13vw,10rem)] leading-[0.85] tracking-tight text-white">
                GOHARD
              </span>
              <span className="r2 font-playfair block text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] italic font-black text-[#C9A84C]">
                Republic
              </span>
            </div>

            {/* Quote */}
            <div className="r3 border-l-2 border-[#C9A84C] pl-6 max-w-md">
              <p className="font-playfair italic text-[#888] text-sm md:text-base leading-[1.9] tracking-wide">
                "Excellence is not an act, but a habit.<br />
                Hone your discipline.<br />
                Own the result."
              </p>
            </div>

            {/* Stats */}
            <div className="r4 flex items-center gap-8">
              <div>
                <p className="text-[#C9A84C] text-[9px] font-medium tracking-[0.3em] uppercase mb-1">Timeline</p>
                <p className="font-bebas text-white text-xl tracking-wide">EST. 2026</p>
              </div>
              <div className="w-px h-10 bg-[#1f1f1f]" />
              <div>
                <p className="text-[#C9A84C] text-[9px] font-medium tracking-[0.3em] uppercase mb-1">Sector</p>
                <p className="font-bebas text-white text-xl tracking-wide">LAGOS / NGA</p>
              </div>
            </div>
          </div>

          {/* RIGHT column — decorative only */}
          <div className="r5 hidden lg:flex justify-end items-center">
            <div className="flex flex-col items-end gap-6">
              {/* Ghost big text */}
              <span
                className="font-bebas leading-none select-none pointer-events-none text-right"
                style={{ fontSize: "clamp(5rem,11vw,10rem)", color: "rgba(255,255,255,0.03)" }}
              >
                NOIRE<br />ELITE
              </span>

              {/* Small badge card */}
              <div
                className="px-8 py-5 text-right backdrop-blur-sm border"
                style={{
                  background: "rgba(201,168,76,0.05)",
                  borderColor: "rgba(201,168,76,0.12)"
                }}
              >
                <p className="text-[#C9A84C] text-[9px] font-medium tracking-[0.3em] uppercase mb-2">The Standard</p>
                <p className="font-playfair italic text-white text-2xl font-black">No compromise.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          role="button"
          tabIndex={0}
          className="r6 absolute bottom-10 left-6 md:left-12 flex items-center gap-3 cursor-pointer group z-10"
          onClick={() => document.getElementById("manifesto")?.scrollIntoView({ behavior: "smooth" })}
          onKeyDown={e => e.key === "Enter" && document.getElementById("manifesto")?.scrollIntoView({ behavior: "smooth" })}
        >
          <div className="pulse w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
          <div className="w-12 h-px bg-[#C9A84C]/40 group-hover:w-20 group-hover:bg-[#C9A84C] transition-all duration-500" />
          <span className="text-[8px] font-medium text-[#C9A84C]/70 tracking-[0.5em] uppercase group-hover:text-[#C9A84C] transition-colors">
            Scroll to Manifesto
          </span>
        </div>

        {/* Watermark */}
        <p className="absolute bottom-10 right-6 md:right-12 text-[8px] tracking-[0.3em] uppercase text-[#252525] z-10 select-none">
          GoHard Republic © 2026
        </p>
      </section>

      {/* The Grind Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <h2 className="text-4xl md:text-7xl font-heading font-black tracking-tighter uppercase leading-none">
              BORN FROM <br /><span className="text-[#D4AF37] italic">THE GRIND.</span>
            </h2>
            <div className="space-y-6 text-zinc-400 text-lg md:text-xl leading-relaxed font-medium">
              <p>
                The name <span className="text-white font-black italic">Gohard</span> came from the grind — from days when nothing came easy, but giving up was never an option.
              </p>
              <p>
                It’s more than a word; <span className="text-white italic">it’s a lifestyle.</span> It’s the mindset of those who wake up hungry, who chase greatness with everything they’ve got, who go hard for what they believe in.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/5] bg-zinc-900 overflow-hidden border border-zinc-800 relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
              <img
                src={image2}
                alt="The Grind"
                className="w-full h-full object-cover grayscale brightness-75 contrast-125"
              />
              <div className="absolute inset-0 bg-[#D4AF37]/5 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Energy & Community Section */}
      <section className="py-40 bg-zinc-950 border-y border-zinc-900 overflow-hidden relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <h2 className="text-[20rem] font-black uppercase leading-none italic select-none text-[#D4AF37]">ENERGY</h2>
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center space-y-16 relative z-10">
          <div className="space-y-8">
            <Flame className="w-12 h-12 text-[#D4AF37] mx-auto animate-pulse" />
            <h2 className="text-3xl md:text-6xl font-heading font-black uppercase tracking-tighter leading-tight italic">
              "GOHARDREPUBLIC was born out of that same energy — a community for the bold, the real, and the relentless."
            </h2>
          </div>

          <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed font-medium">
            It’s where passion meets purpose, and where <span className="text-[#D4AF37] font-black uppercase tracking-[0.2em]">hustle turns into legacy.</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 text-center">
            <div className="p-10 border border-[#D4AF37]/20 bg-black/40 backdrop-blur-sm group hover:border-[#D4AF37] transition-colors duration-500">
              <span className="text-[#D4AF37] font-black text-xs tracking-widest block mb-4">01</span>
              <h4 className="font-heading font-black text-xl uppercase tracking-tighter">THE BOLD</h4>
            </div>
            <div className="p-10 border border-[#D4AF37]/20 bg-black/40 backdrop-blur-sm group hover:border-[#D4AF37] transition-colors duration-500">
              <span className="text-[#D4AF37] font-black text-xs tracking-widest block mb-4">02</span>
              <h4 className="font-heading font-black text-xl uppercase tracking-tighter">THE REAL</h4>
            </div>
            <div className="p-10 border border-[#D4AF37]/20 bg-black/40 backdrop-blur-sm group hover:border-[#D4AF37] transition-colors duration-500">
              <span className="text-[#D4AF37] font-black text-xs tracking-widest block mb-4">03</span>
              <h4 className="font-heading font-black text-xl uppercase tracking-tighter text-nowrap">THE RELENTLESS</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Representation Section */}
      <section className="py-32 px-4 bg-black text-white relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-8xl font-heading font-black uppercase tracking-tighter leading-[0.85]">
              WEAR THE <br /><span className="text-[#D4AF37] italic">STRUGGLE.</span><br />
              OWN THE <span className="italic text-[#D4AF37]">PROGRESS.</span>
            </h2>
          </div>

          <div className="space-y-10">
            <p className="text-2xl md:text-4xl font-black italic leading-tight tracking-tighter uppercase text-zinc-100 border-l-4 border-[#D4AF37] pl-8">
              "This brand represents everyone who’s ever been doubted, counted out, or told they couldn’t make it — yet kept pushing anyway."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <Shield className="w-12 h-12 text-[#D4AF37]" />
                  <span className="font-black text-sm uppercase tracking-widest">THE BADGE</span>
                </div>
                <p className="text-zinc-400 font-bold text-sm tracking-wide leading-relaxed">We wear our struggle like a badge.</p>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <Trophy className="w-12 h-12 text-[#D4AF37]" />
                  <span className="font-black text-sm uppercase tracking-widest">THE CROWN</span>
                </div>
                <p className="text-zinc-400 font-bold text-sm tracking-wide leading-relaxed">and our progress like a crown.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Manifesto Section */}
      <section className="py-40 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-20">
          <div className="space-y-10">
            <div className="flex justify-center items-center space-x-4">
              <div className="h-px w-12 bg-zinc-800"></div>
              <Users className="w-8 h-8 text-zinc-600" />
              <div className="h-px w-12 bg-zinc-800"></div>
            </div>
            <h2 className="text-4xl md:text-8xl font-heading font-black uppercase tracking-tighter leading-none">
              NOT JUST <br /><span className="text-transparent outline-text-gold font-black italic">A BRAND.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center items-start">
            <div className="space-y-4">
              <span className="text-[#D4AF37] font-black text-[10px] tracking-[0.4em] uppercase block mb-2">01</span>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tighter">IT’S A FAMILY.</h3>
            </div>
            <div className="space-y-4">
              <span className="text-[#D4AF37] font-black text-[10px] tracking-[0.4em] uppercase block mb-2">02</span>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tighter text-nowrap">IT’S A STATEMENT.</h3>
            </div>
            <div className="space-y-4">
              <span className="text-[#D4AF37] font-black text-[10px] tracking-[0.4em] uppercase block mb-2">03</span>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tighter italic text-nowrap">IT’S GOHARDREPUBLIC.</h3>
            </div>
          </div>

          <div className="pt-20">
            <div className="bg-zinc-950 border border-[#D4AF37]/20 p-12 md:p-24 relative overflow-hidden group rounded-sm shadow-3xl">
              <div className="absolute inset-0 bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/10 transition-colors duration-500"></div>
              <h4 className="text-3xl md:text-6xl font-heading font-black uppercase tracking-tighter leading-none mb-12 relative z-10">
                WHERE WE GO HARD <br />
                <span className="text-[#D4AF37] italic">OR WE DON’T</span> <br />
                GO AT ALL.
              </h4>
              <Link to="/shop" className="inline-flex items-center space-x-4 bg-[#D4AF37] text-black font-black px-12 py-6 text-xs tracking-[0.5em] uppercase hover:bg-[#C9A84C] transition-all transform hover:-translate-y-2 shadow-[0_20px_40px_rgba(212,175,55,0.3)] relative z-10">
                <span>SHOP THE MOVEMENT</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.2);
          color: transparent;
        }
        .outline-text-gold {
          -webkit-text-stroke: 1px #D4AF37;
          color: transparent;
        }
        .bg-radial-vignette {
          background: radial-gradient(circle, transparent 0%, rgba(0,0,0,0.85) 100%);
        }
        @keyframes slow-zoom {
          0% { transform: scale(1.1); }
          100% { transform: scale(1.25); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default About;