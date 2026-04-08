
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'
const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-800 pt-24 pb-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20">
          <div className="space-y-8">
            <div className="">
              <Link to="/" className="">
                <img
                  src={logo}
                  alt="GOHARDREPUBLIC"
                  className="h-[120px] w-[120px] object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </Link>
            </div>
            <p className="text-zinc-100 text-sm leading-relaxed max-w-xs font-medium italic">
              "GOHARDREPUBLIC — where we go hard or we don’t go at all. We wear our struggle like a badge, and our progress like a crown."
            </p>
            <div className="flex space-x-6">
              <a
                href="https://wa.me/2349155277239?text=Hello%21%20I%20would%20like%20to%20make%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact on WhatsApp"
                className="text-white hover:text-[#D4AF37] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M20.52 3.48A11.77 11.77 0 0 0 12.06 0C5.63 0 .4 5.2.4 11.6c0 2.05.54 4.05 1.56 5.8L0 24l6.8-1.78a11.67 11.67 0 0 0 5.27 1.28h.01c6.43 0 11.66-5.2 11.66-11.6a11.54 11.54 0 0 0-3.22-8.42Zm-8.46 18.1h-.01a9.62 9.62 0 0 1-4.91-1.34l-.35-.2-4.04 1.05 1.08-3.94-.23-.4a9.56 9.56 0 0 1-1.47-5.15C2.13 6.4 6.22 2.3 12.06 2.3c2.55 0 4.94 1 6.75 2.8a9.44 9.44 0 0 1 2.82 6.5c0 5.83-4.1 9.98-9.57 9.98Zm5.24-7.34c-.29-.14-1.7-.83-1.96-.92-.26-.1-.45-.14-.64.14-.19.29-.73.92-.9 1.1-.16.2-.32.22-.6.07-.29-.14-1.2-.44-2.29-1.4-.84-.75-1.41-1.67-1.58-1.95-.16-.28-.02-.43.12-.57.13-.13.29-.32.44-.48.15-.16.19-.28.28-.46.1-.2.05-.37-.02-.52-.07-.14-.64-1.54-.88-2.1-.23-.55-.47-.47-.64-.48h-.55c-.2 0-.52.07-.79.37-.27.29-1.03 1-.99 2.45.04 1.45 1.06 2.85 1.21 3.05.14.2 2.09 3.18 5.05 4.46.7.3 1.25.48 1.67.61.7.22 1.34.19 1.84.11.56-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.2-.54-.34Z"
                  />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@gohardrepublic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit TikTok"
                className="text-white hover:text-[#D4AF37] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 256 256" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M184 92a52.06 52.06 0 0 1-36-14.53V170a58 58 0 1 1-46-56.74V144a26 26 0 1 0 20 25.2V48h26.15A52 52 0 0 0 184 92Z"
                  />
                </svg>
              </a>
              <a
                href="https://snapchat.com/t/oKbuEh5Y"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Snapchat"
                className="text-white hover:text-[#D4AF37] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 256 256" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M128 24c-27.6 0-50 22.4-50 50v31.7c0 6.2-5.1 11.3-11.3 11.3H56a8 8 0 0 0-2.2 15.7c10.2 2.9 19.1 10.2 19.1 20.3 0 6.5-4.6 12.4-12.1 15.4l-12.2 4.9a8 8 0 0 0 1.6 15.2l13.8 2.7c7.3 1.4 13.3 6.3 16 13.2l3.5 9.1a8 8 0 0 0 7.5 5.1h10.2c7.2 0 14.2 2.6 19.6 7.4l6.8 6a8 8 0 0 0 10.6 0l6.8-6c5.4-4.8 12.4-7.4 19.6-7.4h10.2a8 8 0 0 0 7.5-5.1l3.5-9.1c2.7-6.9 8.7-11.8 16-13.2l13.8-2.7a8 8 0 0 0 1.6-15.2l-12.2-4.9c-7.5-3-12.1-8.9-12.1-15.4 0-10.1 8.9-17.4 19.1-20.3A8 8 0 0 0 200 117h-10.7c-6.2 0-11.3-5.1-11.3-11.3V74c0-27.6-22.4-50-50-50Z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-white">Navigation</h4>
            <ul className="space-y-4 text-zinc-100 text-sm font-bold tracking-widest uppercase">
              <li><Link to="/shop" className="hover:text-white transition-colors">The Collection</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">The Manifesto</Link></li>
              {/* <li><Link to="/dashboard" className="hover:text-white transition-colors">Brand Admin</Link></li> */}
              <li><a href="#" className="hover:text-white transition-colors">The Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-white">Support</h4>
            <ul className="space-y-4 text-zinc-100 text-sm font-bold tracking-widest uppercase">
              <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Charts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* <div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-zinc-300">Newsletter</h4>
            <div className="relative">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="w-full bg-zinc-950 border border-zinc-800 p-4 text-xs font-bold tracking-widest focus:outline-none focus:border-[#D4AF37] text-white"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2">
                <ArrowRight className="w-4 h-4 text-zinc-600 hover:text-[#D4AF37]" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-600 mt-4 uppercase tracking-widest font-black">STAY HUNGRY. JOIN THE REPUBLIC.</p>
          </div> */}
        </div>

        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-white font-black uppercase tracking-widest">© 2026 GOHARDREPUBLIC. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8 text-[10px] text-white font-black uppercase tracking-widest">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
