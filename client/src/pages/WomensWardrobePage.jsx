import React, { useState, useEffect } from 'react';

// Price helper function for Sri Lankan Rupees (Rs.)
const formatRs = (val) => {
  if (val === undefined || val === null) return 'Rs. 0';
  let num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  if (num > 0 && num < 1000) num = num * 100;
  return `Rs. ${Math.round(num).toLocaleString('en-LK')}`;
};

const DEFAULT_WOMENS_GARMENTS = [
  {
    id: 'w1',
    badge: 'LIMITED · 28 PIECES',
    spec: '145 GSM · KYOTO SHUTTLE LOOM',
    category: 'dresses',
    title: 'Fluid Mulberry Silk Cocoon Dress',
    subtitle: 'Wild Tussar Silk • Hand-Draped Back Pleating',
    description: 'Unrefined wild silk with natural irregular slub texture. Cut with an exaggerated cocoon back pleat that shifts fluidly with body movement.',
    numericPrice: 48000,
    price: formatRs(48000),
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Alabaster Silk', hex: '#F4F0E8' },
      { name: 'Deep Sumi Charcoal', hex: '#1C1C18' },
    ],
    img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
    hoverImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'w2',
    badge: 'CORE WARDROBE',
    spec: '260 GSM · NORMANDY FLAX',
    category: 'robes',
    title: 'Solitude Raw Linen Kimono Duster',
    subtitle: 'Undyed European Flax • French Bound Seams',
    description: 'Drop-shoulder sweeping silhouette with generous kimono sleeves. Finished with French seams and raw selvedge edge lapels.',
    numericPrice: 42000,
    price: formatRs(42000),
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Undyed Natural Ecru', hex: '#E8E2D5' },
      { name: 'Kakishibu Persimmon', hex: '#94492C' },
    ],
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
    hoverImg: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'w3',
    badge: 'KAKISHIBU AGED',
    spec: '180 GSM · BOTANICAL KAKISHIBU',
    category: 'tunics',
    title: 'Kyoto Plant-Dyed Linen Tunic',
    subtitle: '45-Day Mountain Sunlight Cured',
    description: 'Immersed in three-year-aged unripened persimmon juice and cured under mountain sunlight for 45 days. Patinas gracefully over wear.',
    numericPrice: 24000,
    price: formatRs(24000),
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Fermented Persimmon', hex: '#94492C' },
    ],
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    hoverImg: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'w4',
    badge: 'TRADITIONAL PLEAT',
    spec: '320 GSM · HEAVY NORMANDY FLAX',
    category: 'culottes',
    title: 'Higashiyama Pleated Hakama Pant',
    description: 'Inspired by historical Kyoto archer trousers. Double deep origami pleating anchored at a high waistband with internal tie adjustments.',
    numericPrice: 31000,
    price: formatRs(31000),
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ash Charcoal', hex: '#1C1C18' },
      { name: 'Chalk White', hex: '#E8E2D8' },
    ],
    img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80',
    hoverImg: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'w5',
    badge: 'UNDYED WILD FIBER',
    spec: '220 GSM · HIGHLAND ANDEAN FLEECE',
    category: 'robes',
    title: 'Hand-Spun Alpaca Fringe Wrap',
    description: 'Sheared from free-roaming herds at 3,800m altitude. Completely undyed and unbleached, retaining the hollow thermoregulating fiber core.',
    numericPrice: 18000,
    price: formatRs(18000),
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Fawn Grey', hex: '#D7CFC2' },
    ],
    img: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1000&q=80',
    hoverImg: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'w6',
    badge: 'TAILORED CUT',
    spec: '290 GSM · BELGIAN CRISP FLAX',
    category: 'culottes',
    title: 'Wabi Pleated Wide-Leg Linen Trouser',
    description: 'Engineered with an architectural wide leg and a soft curved inner seam. Washed in Swedish spring water for an immediate broken-in drape.',
    numericPrice: 29000,
    price: formatRs(29000),
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sumi Black', hex: '#1C1C18' },
      { name: 'Oat Sand', hex: '#EAE3D5' },
    ],
    img: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
    hoverImg: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function WomensWardrobePage({ onAddToCart, onSelectProduct, onToggleWishlist, wishlistIds = [] }) {
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

  // Fetch Women's Wardrobe products from MongoDB Backend API
  useEffect(() => {
    fetchWomensProducts();
  }, []);

  const fetchWomensProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const womensItems = data.filter((p) => {
            const cat = (p.category || '').toLowerCase();
            const title = (p.title || p.name || '').toLowerCase();
            const sub = (p.subtitle || '').toLowerCase();
            const combined = `${cat} ${title} ${sub}`;

            if ((combined.includes('men') && !combined.includes('women')) || combined.includes('men\'s tailoring')) {
              return false;
            }
            return combined.includes('women') || combined.includes('wardrobe') || combined.includes('dress') || combined.includes('skirt') || combined.includes('tunic') || combined.includes('apparel');
          });

          const targetItems = womensItems.length > 0 ? womensItems : DEFAULT_WOMENS_GARMENTS;

          const formatted = targetItems.map((p, idx) => {
            let rawP = p.price;
            let numPrice = typeof rawP === 'number' ? rawP : parseFloat(String(rawP).replace(/[^0-9.]/g, '')) || 34000;
            if (numPrice > 0 && numPrice < 1000) numPrice = numPrice * 100;

            let displayImg = DEFAULT_WOMENS_GARMENTS[idx % DEFAULT_WOMENS_GARMENTS.length].img;
            if (p.images && Array.isArray(p.images) && p.images.length > 0 && p.images[0]) {
              displayImg = p.images[0];
            } else if (p.img) {
              displayImg = p.img;
            }

            return {
              id: p._id || p.id || `w_backend_${idx}`,
              title: p.title || p.name || 'Women\'s Garment',
              subtitle: p.subtitle || p.editionName || 'Pure Organic Fiber',
              badge: p.badge || 'LIMITED EDITION',
              category: p.category?.toLowerCase().includes('dress') ? 'dresses' : p.category?.toLowerCase().includes('tunic') ? 'tunics' : p.category?.toLowerCase().includes('culotte') || p.category?.toLowerCase().includes('trouser') ? 'culottes' : 'robes',
              spec: p.gsm || p.shuttle || 'NATURAL ORGANIC SILK & FLAX',
              description: p.description || p.summary || 'Architectural women\'s garment crafted with patience.',
              numericPrice: numPrice,
              price: formatRs(numPrice),
              sizes: p.sizes ? p.sizes.map((s) => typeof s === 'string' ? s : s.label || s.roman) : ['S', 'M', 'L', 'XL'],
              colors: p.colors || [{ name: 'Ecru', hex: '#E8E2D5' }],
              img: displayImg,
              hoverImg: (p.images && p.images[1]) || DEFAULT_WOMENS_GARMENTS[idx % DEFAULT_WOMENS_GARMENTS.length].hoverImg,
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
  };

  const handleSelectSize = (id, sz) => {
    setSelectedSizes((prev) => ({ ...prev, [id]: sz }));
  };

  const handleAddToCartClick = (e, garment) => {
    if (e) e.stopPropagation();
    const chosenSize = selectedSizes[garment.id] || 'M';
    if (onAddToCart) {
      onAddToCart({
        id: garment.id,
        title: `${garment.title} (Size: ${chosenSize})`,
        price: garment.numericPrice,
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
                  <span className="font-label-caps text-xs text-on-surface-variant">Tax Incl. • Insured Shipping</span>
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
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-[1380px] mx-auto relative z-10 space-y-space-xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-xl">
            
            <div className="max-w-3xl space-y-space-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 border border-surface-variant backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-caps text-[11px] text-secondary uppercase font-bold tracking-widest">
                  Édition Femme • Spring / Summer Solstice
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight font-normal leading-[1.08]">
                Women's Wardrobe Collection
              </h1>

              <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl leading-relaxed font-light">
                Poetic silhouettes sculpted from unbleached Normandy flax, hand-dyed Kyoto wild silk, and mountain-cured persimmon. Designed for architectural grace, tactile warmth, and timeless presence.
              </p>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-space-md text-xs font-label-caps text-on-surface-variant">
                <span className="flex items-center gap-1"><span class="material-symbols-outlined text-secondary text-sm">eco</span> 100% Normandy Bast Flax</span>
                <span>•</span>
                <span className="flex items-center gap-1"><span class="material-symbols-outlined text-secondary text-sm">water_drop</span> Zero Chemical Finish</span>
                <span>•</span>
                <span className="flex items-center gap-1"><span class="material-symbols-outlined text-secondary text-sm">handyman</span> Free Sashiko Mending</span>
              </div>
            </div>

            {/* Metric Accent Capsule */}
            <div className="hidden lg:flex items-center gap-space-lg bg-surface-container-lowest/80 backdrop-blur-md px-space-xl py-space-lg rounded-2xl shadow-md border border-surface-variant">
              <div>
                <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">AVAILABLE SILHOUETTES</span>
                <span className="font-serif text-2xl font-bold text-on-surface">{sortedProducts.length} Éditions</span>
              </div>
              <div className="w-px h-10 bg-surface-variant"></div>
              <div>
                <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">HARVEST RANGE</span>
                <span className="font-serif text-2xl font-bold text-secondary">Rs. 18,000 – 48,000</span>
              </div>
            </div>

          </div>

          {/* Interactive Category Filter Pills & Search */}
          <div className="pt-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md border-t border-surface-variant/60">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Women\'s Apparel' },
                { id: 'dresses', label: 'Cocoon Dresses & Gowns' },
                { id: 'tunics', label: 'Linen Tunics & Blouses' },
                { id: 'robes', label: 'Kimono Dusters & Robes' },
                { id: 'culottes', label: 'Pleated Culottes & Pants' },
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
                  placeholder="Search women's apparel..."
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
            <span>Showing <strong className="text-on-surface font-bold">{sortedProducts.length}</strong> apparel pieces</span>
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
                min="15000"
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
            <h3 className="font-serif text-xl text-on-surface">No women's garments match your current search parameters.</h3>
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

              return (
                <div
                  key={g.id}
                  onClick={() => onSelectProduct && onSelectProduct(g.id)}
                  className="group flex flex-col bg-surface-container-lowest rounded-2xl shadow-xs hover:shadow-2xl transition-all duration-500 border border-surface-variant/70 overflow-hidden cursor-pointer relative"
                >
                  {/* Image Presentation */}
                  <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden">
                    <img
                      src={g.img}
                      alt={g.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />

                    {/* Secondary Hover Image Swap if available */}
                    {g.hoverImg && (
                      <img
                        src={g.hoverImg}
                        alt={`${g.title} detail`}
                        className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                      />
                    )}

                    {/* Floating Badge */}
                    <span className="absolute top-3 left-3 bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-label-caps font-bold tracking-wider text-on-surface uppercase shadow-xs">
                      {g.badge}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleWishlist) onToggleWishlist(g);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface/80 backdrop-blur-md hover:bg-surface flex items-center justify-center text-on-surface transition-transform active:scale-95 cursor-pointer shadow-xs z-10"
                      title="Save to Wishlist"
                    >
                      <span className={`material-symbols-outlined text-lg ${isFav ? 'text-secondary font-fill' : ''}`}>
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
                        <span className="font-serif text-lg font-bold text-primary">
                          {g.price}
                        </span>

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
              <span className="material-symbols-outlined text-secondary text-3xl">eco</span>
              <h4 className="font-serif text-lg text-on-surface font-normal">Normandy Coastal Bast Flax</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Retted under dew and rain precipitation in Normandy, preserving natural hollow fiber structures for climate thermoregulation.
              </p>
            </div>

            <div className="p-space-md space-y-2">
              <span className="material-symbols-outlined text-secondary text-3xl">local_laundry_service</span>
              <h4 className="font-serif text-lg text-on-surface font-normal">Botanical Persimmon &amp; Sumi Ink</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Dyed in fermented kakishibu and pine-soot Sumi ink, then cured in mountain sunlight for 45 days. Patinas richly over time.
              </p>
            </div>

            <div className="p-space-md space-y-2">
              <span className="material-symbols-outlined text-secondary text-3xl">handyman</span>
              <h4 className="font-serif text-lg text-on-surface font-normal">Lifetime Sashiko Mending</h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Every Women's garment carries a sewn-in linen passport. Return anytime for complimentary hand-stitched sashiko reinforcement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
