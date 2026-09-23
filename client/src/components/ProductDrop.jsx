import React, { useState, useEffect } from 'react';

export default function ProductDrop({ onAddToCart, onToggleWishlist, wishlistIds = [] }) {
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]);

  // Backend API (http://localhost:5001/api/products) eken seasonal products database eken ganeema
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((p) => ({
            id: p._id || p.id,
            title: p.title || p.name || 'Untitled Object',
            category: p.category || 'Home Decor',
            price: typeof p.price === 'number' ? `$${p.price.toFixed(2)}` : (String(p.price).startsWith('$') ? p.price : `$${p.price}`),
            badge: p.badge || 'Limited Edition',
            badgeClass: p.badgeClass || 'bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface',
            img: p.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c',
            alt: p.alt || p.subtitle || p.title,
          }));
          setProducts(formatted);
        }
      }
    } catch (err) {
      console.log('Error fetching product drops from database:', err);
    }
  };

  const handleQuickAdd = (product) => {
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    if (onAddToCart) onAddToCart(product);

    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);
  };

  return (
    <section className="w-full bg-surface-container-low py-space-4xl">
      <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-2xl">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-space-xxs">
              Seasonal Release
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Numbered Editions
            </h2>
          </div>
          <button
            onClick={() => window.location.hash = '#all-objects'}
            className="mt-space-sm sm:mt-0 font-label-md text-label-md uppercase tracking-wider text-on-surface hover:text-secondary flex items-center gap-space-xs transition-colors cursor-pointer"
          >
            View all seasonal objects
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* 4 Column Product Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {products.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden p-space-sm card-hover-lift border border-surface-variant/80"
            >
              <div className="relative w-full aspect-[3/4] rounded-lg bg-surface-container overflow-hidden mb-space-sm">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  src={p.img}
                  alt={p.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c';
                  }}
                />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full font-label-caps text-[10px] uppercase tracking-wider glass-panel shadow-sm ${p.badgeClass}`}
                >
                  {p.badge}
                </span>

                {/* Heart Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleWishlist) onToggleWishlist(p);
                  }}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full glass-panel flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer z-10 ${
                    wishlistIds.includes(p.id) ? 'text-error bg-surface-container-lowest scale-110' : 'text-on-surface hover:text-error hover:scale-110'
                  }`}
                  title={wishlistIds.includes(p.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {wishlistIds.includes(p.id) ? 'favorite' : 'favorite_border'}
                  </span>
                </button>

                {/* Quick Add Pill Reveal */}
                <button
                  onClick={() => handleQuickAdd(p)}
                  className="absolute bottom-3 inset-x-3 h-11 rounded-lg bg-primary text-on-primary font-label-md text-label-md tracking-wider uppercase backdrop-blur-md opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-secondary flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">
                    {addedItems[p.id] ? 'check_circle' : 'add_shopping_cart'}
                  </span>
                  <span>{addedItems[p.id] ? 'Added to Bag ✓' : 'Quick Add +'}</span>
                </button>
              </div>

              <div className="flex flex-col flex-1 justify-between px-1 py-1 space-y-1">
                <div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block">
                    {p.category}
                  </span>
                  <h3 className="font-subheading-md text-subheading-md text-on-surface group-hover:text-secondary transition-colors duration-300">
                    {p.title}
                  </h3>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-surface-variant/40">
                  <span className="font-price-editorial text-price-editorial text-primary font-medium">
                    {p.price}
                  </span>
                  <span className="font-label-caps text-[10px] text-secondary font-semibold group-hover:underline">
                    View Specs →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
