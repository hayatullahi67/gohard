import React from 'react';
import { Product } from '../types';
import { Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock_quantity !== undefined && product.stock_quantity <= 0;

  return (
    <div className="group relative">
      <div className="aspect-[4/5] overflow-hidden bg-zinc-900 relative">
        {product.tag && (
          <span className="absolute top-4 left-4 z-10 bg-[#D4AF37] text-black text-[10px] font-black px-2 py-1 tracking-tighter italic">
            {product.tag}
          </span>
        )}
        <img
          src={product.image_url || product.image}
          alt={product.name}
          className={`w-full h-full  transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black text-white text-[10px] font-black px-4 py-2 tracking-[0.4em] uppercase border border-zinc-800 italic">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className="bg-[#D4AF37] text-black font-black text-xs px-6 py-3 tracking-widest transition-all transform translate-y-4 group-hover:translate-y-0 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? 'Unavailable' : 'Quick Add'}
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-heading font-black text-sm tracking-tight uppercase leading-none group-hover:text-[#D4AF37] transition-colors">
            {product.name}
          </h3>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-500 font-black px-1.5 py-0.5 uppercase tracking-widest">
                {product.category}
              </span>
              {product.stock_quantity !== undefined && (
                <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 border ${product.stock_quantity > 0
                  ? 'border-zinc-800 text-white'
                  : 'border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]'
                  }`}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
                </span>
              )}
            </div>
            <p className="mt-1 font-bold text-sm italic tracking-tighter text-[#D4AF37]">₦{product.price.toLocaleString()}</p>
          </div>
        </div>
        <button
          disabled={isOutOfStock}
          onClick={() => addToCart(product, 1)}
          className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all group/btn disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;