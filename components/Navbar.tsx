import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import logo from '../assets/logo.png';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <nav className="fixed w-full z-50 bg-zinc-800 border-b border-zinc-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img src={logo} alt="GOHARDREPUBLIC" className="h-12 md:h-[150px] w-[150px] " />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-bold tracking-widest hover:text-[#D4AF37] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            {/* <div className="hidden sm:flex items-center relative">
              <input
                type="text"
                placeholder="Search collection..."
                className="bg-zinc-900 border border-zinc-700 rounded-none px-4 py-1.5 text-xs w-32 focus:w-48 transition-all focus:outline-none focus:border-[#D4AF37]"
              />
              <Search className="absolute right-3 w-4 h-4 text-zinc-500" />
            </div> */}
            <button onClick={() => setIsCartOpen(true)} className="relative group">
              <ShoppingBag className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
            <Link to="/dashboard">
              <User className="w-5 h-5 hover:text-[#D4AF37] transition-colors cursor-pointer" />
            </Link>

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-800 border-b border-zinc-700 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-8 space-y-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block text-lg font-black tracking-widest py-2 border-b border-zinc-900"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
