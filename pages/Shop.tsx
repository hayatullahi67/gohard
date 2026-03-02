
import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';
import { Category, Product } from '../types';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ChevronDown, Grid, List, Zap, Flame } from 'lucide-react';

const Shop: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState('Newest First');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch failed, using mocks:', error.message);
        setProducts(MOCK_PRODUCTS);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  // Derive dynamic categories from products
  const dynamicCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return ['All', ...Array.from(categories).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const categoryMatch = activeCategory === 'All' || product.category === activeCategory;
      return categoryMatch;
    });

    // Apply sorting
    switch (sortBy) {
      case 'Price: Low-High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High-Low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Newest First':
      default:
        // Already sorted by created_at desc in fetch
        break;
    }

    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <div className="bg-black min-h-screen pt-20">
      {/* Shop Header Banner */}
      <section className="bg-zinc-950 border-b border-zinc-900 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase mb-4">THE COLLECTION</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-xs">Equipping the Bold & The Relentless</p>
          </div>
          <div className="hidden lg:flex items-center space-x-6 border-l border-zinc-800 pl-8">
            <Flame className="w-8 h-8 text-[#D4AF37]" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400 max-w-[200px]">
              PASSION MEETS PURPOSE. HUSTLE TURNS INTO LEGACY.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-10">
            <div>
              <div className="pt-8 border-t border-zinc-900">
                <h3 className="font-heading font-black text-xs uppercase tracking-[0.3em] flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  <span>Filters</span>
                </h3>
              </div>
              <div className="space-y-3">
                {dynamicCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`block w-full text-left py-2 px-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat
                      ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                      : 'text-zinc-500 hover:text-white border border-zinc-900 hover:border-zinc-700'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>


            <div className="bg-zinc-900/50 p-6 border border-zinc-800 rounded-sm">
              <Zap className="w-5 h-5 text-[#D4AF37] mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed italic text-zinc-400">
                "We wear our struggle like a badge, and our progress like a crown."
              </p>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-10 border-b border-zinc-900 pb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'text-[#D4AF37]' : 'text-zinc-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'text-[#D4AF37]' : 'text-zinc-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">
                  Showing {filteredProducts.length} Results
                </span>
              </div>

              {/* <div className="relative group">
                <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest border border-zinc-800 px-4 py-2 hover:border-white transition-all">
                  <span>Sort By: {sortBy}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  {['Newest First', 'Price: Low-High', 'Price: High-Low', 'Popularity'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSortBy(opt)}
                      className="block w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-colors border-b border-zinc-800 last:border-0"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div> */}
            </div>

            {loading ? (
              <div className="py-40 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37] mx-auto"></div>
                <p className="mt-4 text-zinc-500 uppercase font-black text-[10px] tracking-widest">Loading Collection...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-x-8 gap-y-12`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-40 text-center space-y-4">
                <Zap className="w-12 h-12 text-zinc-800 mx-auto" />
                <h3 className="text-xl font-heading font-black uppercase tracking-tighter text-zinc-600">No products found in this range</h3>
                <button
                  onClick={() => { setActiveCategory('All'); }}
                  className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] hover:underline"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
