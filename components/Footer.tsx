
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png'
const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-800 pt-24 pb-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20">
          <div className="space-y-8">
            <div className="">
              <Link to="/" className="">
                <img src={logo} alt="GOHARDREPUBLIC" className="h-12 md:h-[150px] w-[150px] " />
              </Link>
            </div>
            <p className="text-zinc-100 text-sm leading-relaxed max-w-xs font-medium italic">
              "GOHARDREPUBLIC — where we go hard or we don’t go at all. We wear our struggle like a badge, and our progress like a crown."
            </p>
            <div className="flex space-x-6">
              <Instagram className="w-5 h-5 text-white hover:text-[#D4AF37] transition-colors cursor-pointer" />
              <Twitter className="w-5 h-5 text-white hover:text-[#D4AF37] transition-colors cursor-pointer" />
              <Facebook className="w-5 h-5 text-white hover:text-[#D4AF37] transition-colors cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-white">Navigation</h4>
            <ul className="space-y-4 text-zinc-100 text-sm font-bold tracking-widest uppercase">
              <li><Link to="/shop" className="hover:text-white transition-colors">The Collection</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">The Manifesto</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Brand Admin</Link></li>
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
          <p className="text-[10px] text-white font-black uppercase tracking-widest">© 2024 GOHARDREPUBLIC. ALL RIGHTS RESERVED.</p>
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
