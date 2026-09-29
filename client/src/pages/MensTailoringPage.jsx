import React, { useState, useEffect } from 'react';
import { getProductOffer, formatRsPrice } from '../utils/offerUtils';

// Price helper function for Sri Lankan Rupees (Rs.)
const formatRs = (val) => {
  if (val === undefined || val === null) return 'Rs. 0';
  let num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  return `Rs. ${Math.round(num).toLocaleString('en-LK')}`;
};

const DEFAULT_MENS_CLOTHING = [];

export default function MensTailoringPage({ onAddToCart, onSelectProduct, onToggleWishlist, wishlistIds = [] }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState(80000);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sortOption, setSortOption] = useState('default');
  const [addedNotice, setAddedNotice] = useState({});
  const [viewLayout, setViewLayout] = useState('grid'); // 'grid' | 'lookbook'
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Fetch Men's Clothing from Backend API
  useEffect(() => {
    fetchMensProducts();
  }, []);

  const fetchMensProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mensItems = data.filter((p) => {
            const cat = (p.category || '').toLowerCase();
            const title = (p.title || p.name || '').toLowerCase();
            const sub = (p.subtitle || '').toLowerCase();
            const combined = `${cat} ${title} ${sub}`;

            if (combined.includes('women') || combined.includes('dress') || combined.includes('skirt') || combined.includes('tunic')) {
              return false;
            }
            return (
              cat.includes('men') ||
              cat.includes('tailor') ||
              cat.includes('jacket') ||
              cat.includes('trouser') ||
              cat.includes('suit') ||
              cat.includes('coat') ||
              cat.includes('shirt') ||
              title.includes('men') ||
              !combined.includes('women')
            );
          });

          const formatted = mensItems.map((p, idx) => {
            let rawP = p.price;
            let numPrice = typeof rawP === 'number' ? rawP : parseFloat(String(rawP).replace(/[^0-9.]/g, '')) || 32000;

            let displayImg = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80';
            if (p.images && Array.isArray(p.images) && p.images.length > 0 && p.images[0]) {
              displayImg = p.images[0];
            } else if (p.img) {
              displayImg = p.img;
            }

            let hoverImg = (p.images && Array.isArray(p.images) && p.images[1]) ? p.images[1] : displayImg;

            return {
              id: p._id || p.id || `m_backend_${idx}`,
              title: p.title || p.name || 'Men\'s Garment',
              subtitle: p.subtitle || p.editionName || 'Pure Organic Fiber',
              category: (p.category?.toLowerCase().includes('blazer') || p.category?.toLowerCase().includes('suit'))
                ? 'blazers'
                : (p.category?.toLowerCase().includes('overcoat') || p.category?.toLowerCase().includes('trench') || p.category?.toLowerCase().includes('coat'))
                ? 'coats'
                : (p.category?.toLowerCase().includes('trouser') || p.category?.toLowerCase().includes('pant'))
                ? 'trousers'
                : (p.category?.toLowerCase().includes('noragi') || p.category?.toLowerCase().includes('jacket'))
                ? 'jackets'
                : 'coats',
              description: p.description || p.summary || 'Architectural menswear garment crafted with patience.',
              numericPrice: numPrice,
              price: formatRs(numPrice),
              offerPercentage: p.offerPercentage || 0,
              offerExpiresAt: p.offerExpiresAt || null,
              offerTitle: p.offerTitle || '',
              sizes: p.sizes ? p.sizes.map((s) => typeof s === 'string' ? s : s.label || s.roman) : ['S', 'M', 'L', 'XL'],
              colors: p.colors || [{ name: 'Sumi', hex: '#1F1B18' }],
              img: displayImg,
              hoverImg: hoverImg,
              rawProduct: p,
            };
          });
          setProducts(formatted);
          return;
        }
      }
    } catch (err) {
      console.log('Database fetch error:', err);
    } finally {
      setLoading(false);
    }
    setProducts([]);
  };

  const handleSelectSize = (id, sz) => {
    setSelectedSizes((prev) => ({ ...prev, [id]: sz }));
  };

  const handleAddToCartClick = (e, garment) => {
    if (e) e.stopPropagation();
    const chosenSize = selectedSizes[garment.id] || 'M';
    if (onAddToCart) {
      const offer = getProductOffer(garment);
      const effectivePrice = offer.hasActiveOffer ? offer.discountedPrice : garment.numericPrice;

      onAddToCart({
        id: garment.id,
        title: `${garment.title} (Size: ${chosenSize})`,
        price: effectivePrice,
        img: garment.img,
      });
    }

    setAddedNotice((prev) => ({ ...prev, [garment.id]: true }));
    setTimeout(() => {
      setAddedNotice((prev) => ({ ...prev, [garment.id]: false }));
    }, 1800);
  };

  // Filter and sort products
  const filteredProducts = products.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (searchQuery.trim() && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (p.numericPrice > maxPriceFilter) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.numericPrice - b.numericPrice;
    if (sortOption === 'price-high') return b.numericPrice - a.numericPrice;
    return 0;
  });

  return (
    <div className="w-full bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen selection:bg-secondary-container selection:text-on-secondary-container">
      
      {/* Quick View Lightbox Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-surface w-full max-w-3xl rounded-2xl p-space-lg shadow-2xl relative border border-surface-variant overflow-hidden animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg items-center">
              <div className="aspect-[3/4] bg-surface-container-low rounded-xl overflow-hidden shadow-inner">
                <img
                  src={quickViewProduct.img}
                  alt={quickViewProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="font-label-caps text-xs text-secondary font-bold tracking-widest uppercase">
                  {quickViewProduct.badge}
                </span>

                <h3 className="font-serif text-2xl text-on-surface font-normal leading-snug">
                  {quickViewProduct.title}
                </h3>

                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  {quickViewProduct.description}
                </p>

                <div className="pt-2 border-t border-surface-variant flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-primary">{quickViewProduct.price}</span>
                  <span className="font-label-caps text-xs text-on-surface-variant">Tax Incl. • Insured Dispatch</span>
                </div>

                {/* Size Pills */}
                <div className="space-y-1.5 pt-2">
                  <span className="font-label-caps text-xs text-on-surface uppercase font-semibold">Select Size:</span>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSelectSize(quickViewProduct.id, sz)}
                        className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer border ${
                          (selectedSizes[quickViewProduct.id] || 'M') === sz
                            ? 'bg-primary text-on-primary border-primary shadow-sm scale-105'
                            : 'bg-surface-container border-surface-variant text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCartClick(null, quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-primary text-on-primary py-3.5 px-space-md rounded-xl font-label-caps text-xs uppercase font-bold tracking-wider hover:bg-secondary transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">shopping_bag</span>
                    <span>ADD TO BAG — {quickViewProduct.price}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setQuickViewProduct(null);
                      if (onSelectProduct) onSelectProduct(quickViewProduct.id);
                    }}
                    className="px-4 py-3.5 rounded-xl bg-surface-container text-on-surface font-label-caps text-xs uppercase font-bold hover:bg-surface-container-high cursor-pointer"
                  >
                    Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Luxury Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-surface-container-low via-surface to-surface px-margin py-space-2xl border-b border-surface-variant overflow-hidden">
        {/* Background Ambient Blur Accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-[1380px] mx-auto relative z-10 space-y-space-xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-xl">
            
            <div className="max-w-3xl space-y-space-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 border border-surface-variant backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-caps text-[11px] text-secondary uppercase font-bold tracking-widest">
                  Édition Homme • Autumn / Winter Solstice
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight font-normal leading-[1.08]">
                Men's Clothing Collection
              </h1>

              <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl leading-relaxed font-light">
                Unstructured noragi jackets, kimono lapel blazers, relaxed hakama trousers, and coarse yak wool shawl knits. Woven on vintage shuttle looms from Tokushima indigo and Småland boiled wool.
              </p>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-space-md text-xs font-label-caps text-on-surface-variant">
                <span className="flex items-center gap-1"><span class="material-symbols-outlined text-secondary text-sm">history_edu</span> 1948 Toyoda Shuttle Loom</span>
                <span>•</span>
                <span className="flex items-center gap-1"><span class="material-symbols-outlined text-secondary text-sm">palette</span> 14-Dip Tokushima Indigo</span>
                <span>•</span>
                <span className="flex items-center gap-1"><span class="material-symbols-outlined text-secondary text-sm">handyman</span> Lifetime Sashiko Repair</span>
              </div>
            </div>

            {/* Metric Accent Capsule */}
            <div className="hidden lg:flex items-center gap-space-lg bg-surface-container-lowest/80 backdrop-blur-md px-space-xl py-space-lg rounded-2xl shadow-md border border-surface-variant">
              <div>
                <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">AVAILABLE GARMENTS</span>
                <span className="font-serif text-2xl font-bold text-on-surface">{sortedProducts.length} Éditions</span>
              </div>
              <div className="w-px h-10 bg-surface-variant"></div>
              <div>
                <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">HARVEST RANGE</span>
                <span className="font-serif text-2xl font-bold text-secondary">Rs. 28,000 – 65,000</span>
              </div>
            </div>

          </div>

          {/* Interactive Category Filter Pills & Search */}
          <div className="pt-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md border-t border-surface-variant/60">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Men\'s Apparel' },
                { id: 'jackets', label: 'Noragi & Jackets' },
                { id: 'coats', label: 'Overcoats & Outerwear' },
                { id: 'trousers', label: 'Pleated Trousers' },
                { id: 'knits', label: 'Shawl Knits' },
                { id: 'shirts', label: 'Linen Shirts' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl font-label-caps text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-primary text-on-primary font-bold shadow-md scale-105'
                      : 'bg-surface-container border border-surface-variant text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Layout Switcher (Grid vs Lookbook) */}
              <div className="flex items-center bg-surface-container p-1 rounded-xl border border-surface-variant">
                <button
                  type="button"
                  onClick={() => setViewLayout('grid')}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${viewLayout === 'grid' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
                  title="Grid Layout View"
                >
                  <span className="material-symbols-outlined text-lg">grid_view</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewLayout('lookbook')}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${viewLayout === 'lookbook' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
                  title="Editorial Lookbook View"
                >
                  <span className="material-symbols-outlined text-lg">view_agenda</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search men's garments..."
                  className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface border border-surface-variant text-xs text-on-surface focus:outline-none focus:border-primary shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Shop Grid */}
      <div className="w-full max-w-[1380px] mx-auto px-margin py-space-xl">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-space-lg pb-space-xs border-b border-surface-variant">
          <div className="flex items-center gap-4 text-xs font-label-caps text-on-surface-variant">
            <span>Showing <strong className="text-on-surface font-bold">{sortedProducts.length}</strong> menswear pieces</span>
            {activeCategory !== 'all' && (
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary font-bold uppercase tracking-wider">
                Filter: {activeCategory}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-space-md">
            {/* Price Slider */}
            <div className="flex items-center gap-2 text-xs font-label-caps">
              <span className="text-on-surface-variant">Max Price:</span>
              <span className="font-bold text-on-surface">Rs. {maxPriceFilter.toLocaleString('en-LK')}</span>
              <input
                type="range"
                min="25000"
                max="80000"
                step="5000"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-28 accent-primary cursor-pointer"
              />
            </div>

            {/* Sort Selector */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-10 px-3 rounded-xl bg-surface border border-surface-variant text-xs text-on-surface focus:outline-none cursor-pointer font-medium"
            >
              <option value="default">Featured Sort</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4 bg-surface-container-low rounded-2xl border border-surface-variant max-w-xl mx-auto shadow-xs">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant">checkroom</span>
            <h3 className="font-serif text-xl text-on-surface">No men's garments match your current search parameters.</h3>
            <button
              type="button"
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); setMaxPriceFilter(80000); }}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-caps text-xs uppercase font-bold tracking-wider cursor-pointer hover:bg-secondary transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-space-lg ${viewLayout === 'lookbook' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {sortedProducts.map((g) => {
              const gIdStr = String(g.id || g._id || '');
              const isFav = wishlistIds.some((id) => String(id) === gIdStr || String(id) === String(g._id));
              const selectedSz = selectedSizes[g.id] || 'M';
              const offer = getProductOffer(g);

              return (
                <div
                  key={g.id}
                  onClick={() => onSelectProduct && onSelectProduct(g.id)}
                  className="group flex flex-col bg-surface-container-lowest rounded-2xl shadow-xs hover:shadow-2xl transition-all duration-500 border border-surface-variant/70 overflow-hidden cursor-pointer relative"
                >
                    {/* Image Presentation with Smooth Hover Angle Swap Animation */}
                    <div className="relative aspect-[3/4] w-full bg-surface-container-low overflow-hidden">
                      <img
                        src={g.img}
                        alt={g.title}
                        className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-108"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />

                      {/* Secondary Hover Image Swap Angle */}
                      <img
                        src={g.hoverImg || 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80'}
                        alt={`${g.title} detail angle`}
                        className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105 pointer-events-none"
                      />

                      {/* Floating Badge */}
                      {offer.hasActiveOffer ? (
                        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                          <span className="px-2.5 py-0.5 bg-rose-600 text-white font-label-caps font-bold text-[10px] tracking-wider rounded-full shadow-md flex items-center gap-1 animate-pulse">
                            <span className="material-symbols-outlined text-xs">local_offer</span>
                            {offer.offerPercentage}% OFF
                          </span>
                          <span className="px-2 py-0.5 bg-black/80 text-amber-300 text-[9px] font-mono rounded shadow-xs">
                            ⏳ {offer.timeRemainingStr}
                          </span>
                        </div>
                      ) : (
                        <span className="absolute top-3 left-3 bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-label-caps font-bold tracking-wider text-on-surface uppercase shadow-xs z-10 transition-transform duration-300 group-hover:scale-105">
                          {g.badge || 'LIMITED EDITION'}
                        </span>
                      )}

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleWishlist) onToggleWishlist(g);
                      }}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-surface/80 backdrop-blur-md hover:bg-surface flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs z-10 ${
                        isFav ? 'text-red-600 bg-surface scale-110 shadow-md' : 'text-on-surface hover:text-red-600'
                      }`}
                      title="Save to Wishlist"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isFav ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>

                    {/* Quick View Hover Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(g);
                      }}
                      className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md text-on-surface px-4 py-2 rounded-full font-label-caps text-[11px] uppercase tracking-wider shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-on-primary cursor-pointer font-bold"
                    >
                      Quick View 👁
                    </button>

                    {/* Quick Add Overlay Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAddToCartClick(e, g)}
                      className="absolute bottom-3 right-3 px-3.5 py-2 rounded-xl bg-primary text-on-primary font-label-caps text-xs uppercase flex items-center gap-1.5 opacity-90 group-hover:opacity-100 hover:bg-secondary transition-all shadow-md cursor-pointer font-bold"
                    >
                      <span className="material-symbols-outlined text-base">shopping_bag</span>
                      <span>{addedNotice[g.id] ? 'Added!' : '+ Add'}</span>
                    </button>
                  </div>

                  {/* Card Body Information */}
                  <div className="p-space-md flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="font-label-caps text-[10px] text-secondary font-bold uppercase tracking-widest block">
                        {g.spec}
                      </span>

                      <h3 className="font-serif text-lg text-on-surface font-medium group-hover:text-secondary transition-colors line-clamp-1">
                        {g.title}
                      </h3>

                      <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 leading-relaxed font-light">
                        {g.description}
                      </p>
                    </div>

                    {/* Color Swatch Indicators & Sizes */}
                    <div className="space-y-2 pt-2 border-t border-surface-variant/60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {g.colors && g.colors.map((c, idx) => (
                            <span
                              key={idx}
                              className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs inline-block"
                              style={{ backgroundColor: c.hex || c }}
                              title={c.name || 'Color'}
                            />
                          ))}
                        </div>

                        {/* Sizes Selector */}
                        <div className="flex items-center gap-1">
                          {g.sizes.map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectSize(g.id, sz);
                              }}
                              className={`w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                                selectedSz === sz
                                  ? 'bg-primary text-on-primary shadow-2xs scale-105'
                                  : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price & View Detail Action */}
                      <div className="flex items-center justify-between pt-1">
                        {offer.hasActiveOffer ? (
                          <div className="flex flex-col">
                            <span className="font-serif text-lg font-bold text-rose-700">
                              {formatRsPrice(offer.discountedPrice)}
                            </span>
                            <span className="line-through text-[11px] text-outline font-mono">
                              {formatRsPrice(offer.rawPrice)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-serif text-lg font-bold text-primary">
                            {g.price}
                          </span>
                        )}

                        <span className="font-label-caps text-[11px] text-secondary font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                          Add to Cart <span className="material-symbols-outlined text-xs">east</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Creative Bottom Craftsmanship Immersion Banner */}
      <section className="w-full bg-surface-container-low py-space-2xl border-t border-surface-variant my-space-xl">
        <div className="max-w-[1380px] mx-auto px-margin">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg text-center">
            <div className="p-space-md space-y-2">
              <span className="material-symbols-outlined text-secondary text-3xl">history_edu</span>
              <h4 className="font-serif text-lg text-on-surface font-normal">Toyoda Non-Automated Loom</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Woven at one-fourth the velocity of industrial machines, retaining high fiber insulation and natural ventilation.
              </p>
            </div>

            <div className="p-space-md space-y-2">
              <span className="material-symbols-outlined text-secondary text-3xl">water_drop</span>
              <h4 className="font-serif text-lg text-on-surface font-normal">Tokushima Botanical Aizome</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                14-times dip-dyed in authentic Japanese natural indigo vats for rich, dimensional blue patina that deepens with age.
              </p>
            </div>

            <div className="p-space-md space-y-2">
              <span className="material-symbols-outlined text-secondary text-3xl">handyman</span>
              <h4 className="font-serif text-lg text-on-surface font-normal">Lifetime Sashiko Mending</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Every Men's garment includes an archival seam passport. Dispatch anytime for complimentary hand-stitched sashiko reinforcement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
