import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Zap, Shield, Trophy, Flame } from 'lucide-react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { supabase } from '../lib/supabase';
import image1 from '../assets/image1.jpeg';
import image2 from '../assets/image2.jpeg';
import image3 from '../assets/image3.jpeg';
import image4 from '../assets/image4.jpeg';
import image5 from '../assets/image5.jpeg';
import image6 from '../assets/image6.jpeg';

const Home: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState(MOCK_PRODUCTS.slice(0, 4));
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    const fetchLatestArrivals = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        if (data && data.length > 0) {
          setNewArrivals(data);
        }
      } catch (err) {
        console.error('Error fetching latest arrivals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArrivals();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-[#09090b]">
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
        .r100 { opacity:0; transform:translateY(16px); transition:opacity .8s cubic-bezier(.16,1,.3,1) .96s,transform .8s cubic-bezier(.16,1,.3,1) .96s; }
        .r5 { opacity:0; transform:translateX(28px); transition:opacity 1s cubic-bezier(.16,1,.3,1) .7s,transform 1s cubic-bezier(.16,1,.3,1) .7s; }
        .r7 { opacity:0; transition:opacity .8s 1.2s; }

        .hero-loaded .r1,
        .hero-loaded .r2,
        .hero-loaded .r3,
        .hero-loaded .r100,
        .hero-loaded .r5,
        .hero-loaded .r7 {
          opacity:1 !important;
          transform:none !important;
        }

        .outline-text {
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.4);
          color: transparent;
        }
      `}</style>

      {/* Hero Section */}
      <section className={`relative min-h-[85vh] py-[20px] lg:min-h-screen flex items-center overflow-hidden bg-[#080808] ${loaded ? "hero-loaded" : ""}`}>
        <div className="absolute inset-0 z-0">
          <Carousel
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={false}
            swipeable={false}
            emulateTouch={false}
            transitionTime={1500}
            className="h-full w-full"
          >
            {[image1, image3, image4, image2, image5, image6].map((img, index) => (
              <div key={index} className="h-full w-full">
                <img
                  src={img}
                  alt={`Hero Background ${index + 1}`}
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
            ))}
          </Carousel>
          {/* Enhanced Gradient for Professional Look & Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
        </div>

        {/* Animated left gold bar */}
        <div className="gold-bar absolute left-0 top-0 bottom-0 w-[2px] z-20"
          style={{ background: "linear-gradient(to bottom, transparent, #D4AF37 30%, #D4AF37 70%, transparent)" }} />

        {/* Corner accent bracket */}
        <div className="r7 absolute top-10 right-10 w-20 h-20 border-t border-r border-[#D4AF37]/30 z-20" />

        {/* ── Main grid ── */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">

          {/* LEFT column */}
          <div className="space-y-10">
            {/* Eyebrow line + label */}
            <div className="r1 flex items-center gap-4">
              <div className="w-12 h-px bg-[#D4AF37] flex-shrink-0" />
              <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase">
                GOHARDREPUBLIC — THE MOVEMENT
              </span>
            </div>

            {/* Headline */}
            <div>
              <span className="r1 font-bebas block text-[clamp(4.5rem,12vw,9rem)] leading-[0.85] tracking-tight text-white uppercase">
                BORN FROM
              </span>
              <span className="r2 font-playfair block text-[clamp(3rem,9vw,7rem)] leading-[0.9] italic font-black text-[#D4AF37]">
                The Grind.
              </span>
              <span className="r1 font-bebas block text-[clamp(3.5rem,10vw,8rem)] leading-[0.85] tracking-tight text-white mt-2 uppercase">
                CHASE <span className="outline-text">GREATNESS.</span>
              </span>
            </div>

            {/* Description Quote style */}
            <div className="r3 border-l-2 border-[#D4AF37] pl-8 max-w-xl">
              <p className="font-playfair italic text-zinc-300 text-sm md:text-base leading-[1.8] tracking-wide">
                "The name Gohard came from the grind — from days when nothing came easy, but giving up was never an option. It’s more than a word; it’s a lifestyle."
              </p>
            </div>

            {/* Actions */}
            <div className="r100 flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Link to="/shop" className="bg-[#D4AF37] hover:bg-[#C9A84C] text-black font-black px-12 py-5 tracking-[0.4em] text-[10px] w-full sm:w-auto transition-all transform hover:scale-105 uppercase text-center shadow-2xl shadow-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20">
                Shop Collection
              </Link>
              <Link to="/about" className="bg-zinc-900/50 backdrop-blur-md border border-zinc-700 hover:border-[#D4AF37] text-white font-black px-12 py-5 tracking-[0.4em] text-[10px] w-full sm:w-auto transition-all uppercase text-center hover:bg-zinc-800">
                Our Manifesto
              </Link>
            </div>
          </div>

          {/* RIGHT column — decorative */}
          <div className="r5 hidden lg:flex justify-end items-center">
            <div className="flex flex-col items-end gap-6">
              <span
                className="font-bebas leading-none select-none pointer-events-none text-right opacity-10"
                style={{ fontSize: "clamp(5rem,11vw,10rem)", color: "#D4AF37" }}
              >
                ELITE<br />ACTIVE
              </span>
              <div
                className="px-10 py-6 text-right backdrop-blur-md border"
                style={{
                  background: "rgba(212,175,55,0.05)",
                  borderColor: "rgba(212,175,55,0.15)"
                }}
              >
                <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase mb-2 italic">Standard Edition</p>
                <p className="font-playfair italic text-white text-3xl font-black">No compromise.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="bg-[#D4AF37] py-4 overflow-hidden whitespace-nowrap border-y border-black">
        <div className="inline-block animate-marquee uppercase font-black text-[10px] tracking-[0.4em] space-x-12 px-12 text-black">
          <span>GO HARD OR DON'T GO AT ALL</span>
          <span className="opacity-50 italic">★</span>
          <span>WEAR STRUGGLE LIKE A BADGE</span>
          <span className="opacity-50 italic">★</span>
          <span>HUSTLE TURNS INTO LEGACY</span>
          <span className="opacity-50 italic">★</span>
          <span>PASSION MEETS PURPOSE</span>
          <span className="opacity-50 italic">★</span>
          <span>BORN FROM THE GRIND</span>
          <span className="opacity-50 italic">★</span>
          <span>PROGRESS LIKE A CROWN</span>
          <span className="opacity-50 italic">★</span>
          <span>GO HARD OR DON'T GO AT ALL</span>
        </div>
      </div>

      {/* New Arrivals */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#D4AF37] font-bold tracking-[0.4em] text-[10px] uppercase mb-2 block">LATEST DROPS</span>
            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase text-white">New Arrivals</h2>
          </div>
          <Link to="/shop" className="group flex items-center space-x-3 text-[10px] font-black tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors">
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Narrative Section: The Family */}
      <section className="py-32 bg-zinc-950 border-y border-zinc-900 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-10 relative z-10">
          <Flame className="w-12 h-12 text-[#D4AF37] mx-auto animate-pulse" />
          <h2 className="text-4xl md:text-7xl font-heading font-black uppercase tracking-tighter leading-none italic text-white">
            "THIS ISN'T JUST A BRAND. <br />
            IT'S A FAMILY. <br />
            IT'S A <span className="text-[#D4AF37]">STATEMENT.</span>"
          </h2>
          <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">IT'S GOHARDREPUBLIC — WHERE WE GO HARD OR WE DON'T GO AT ALL</p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 bg-[#09090b] px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-8xl font-heading font-black tracking-tighter uppercase leading-[0.85] text-white">
              PASSION<br />
              MEETS <br />
              <span className="text-[#D4AF37]">PURPOSE.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#D4AF37] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-black text-xl uppercase tracking-tighter text-white">The Lifestyle</h4>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">It’s the mindset of those who wake up hungry and chase greatness with everything they’ve got.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/30">
                  <Trophy className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h4 className="font-black text-xl uppercase tracking-tighter text-white">The Progress</h4>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">We wear our struggle like a badge, and our progress like a crown. Keep pushing anyway.</p>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/about" className="inline-flex items-center space-x-4 bg-[#D4AF37] text-black font-black px-10 py-5 text-xs tracking-[0.3em] uppercase hover:bg-[#C9A84C] transition-all">
                <span>Join The Movement</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="aspect-[3/4] overflow-hidden border border-zinc-800 bg-zinc-900">
              <img
                src={image4}
                alt="Brand Narrative"
                className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#D4AF37] p-10 md:p-14 border-4 border-black shadow-2xl">
              <span className="font-heading font-black text-6xl md:text-8xl italic tracking-tighter text-black leading-none uppercase">GRIND</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .carousel-root, .carousel, .slider-wrapper, .slider {
          height: 100% !important;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .outline-text {
          -webkit-text-stroke: 2.5px rgba(255,255,255,0.6);
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Home;