// Catalog & Shop Page Component
import React, { useState, useEffect } from 'react';

// Price helper function for Sri Lankan Rupees (Rs.)
const formatRs = (val) => {
  if (val === undefined || val === null) return 'Rs. 0';
  let num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  if (num > 0 && num < 1000) {
    num = num * 100;
  }
  return `Rs. ${Math.round(num).toLocaleString('en-LK')}`;
};

const getRsNumber = (val) => {
  if (val === undefined || val === null) return 0;
  let num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  if (num > 0 && num < 1000) {
    num = num * 100;
  }
  return Math.round(num);
};

export default function ShopPage({ activeTab = 'shop', initialCategory, searchQuery = '', onClearSearch, onAddToCart, onSelectProduct, onToggleWishlist, wishlistIds = [] }) {
  const [sortOption, setSortOption] = useState('Curated Picks');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(150000);
  const [activePreset, setActivePreset] = useState('all');

  // Advanced Filters State
  const [selectedColorFilter, setSelectedColorFilter] = useState('all');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('all');
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  const [selectedDiscipline, setSelectedDiscipline] = useState(() => {
    if (initialCategory) return initialCategory;
    if (activeTab === 'apparel' || activeTab === 'womens-wardrobe') return 'Women\'s Apparel';
    if (activeTab === 'mens-tailoring') return 'Men\'s Tailoring';
    return 'All Objects';
  });

  const [products, setProducts] = useState([]);

  // Database eken products fetch kireema
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((p) => {
            const numPrice = getRsNumber(p.price);

            return {
              id: p._id || p.id,
              title: p.title || p.name || 'Untitled Garment',
              category: p.category || 'Apparel',
              subtitle: p.subtitle || p.description || '',
              price: formatRs(numPrice),
              numericPrice: numPrice,
              studio: p.studio || 'Kyoto Atelier',
              badge: p.badge || 'Limited Edition',
              img: p.img || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
            };
          });
          setProducts(formatted);
          return;
        }
      }
    } catch (err) {
      console.log('Database fetch error:', err);
    }

    setProducts([]);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedDiscipline(initialCategory);
    } else if (activeTab === 'apparel' || activeTab === 'womens-wardrobe') {
      setSelectedDiscipline("Women's Apparel");
    } else if (activeTab === 'mens-tailoring') {
      setSelectedDiscipline("Men's Tailoring");
    } else if (activeTab === 'shop') {
      setSelectedDiscipline('All Objects');
    }
  }, [initialCategory, activeTab]);

  const handleApplyPreset = (preset, minVal, maxVal) => {
    setActivePreset(preset);
    setPriceMin(minVal);
    setPriceMax(maxVal);
  };

  const clearAllFilters = () => {
    setSelectedDiscipline('All Objects');
    setPriceMin(0);
    setPriceMax(150000);
    setActivePreset('all');
    setSelectedColorFilter('all');
    setSelectedSizeFilter('all');
    setSelectedMaterialFilter('all');
    setInStockOnly(false);
    if (onClearSearch) onClearSearch();
  };

  const handleQuickAdd = (p) => {
    if (onAddToCart) {
      onAddToCart({
        id: p.id,
        title: p.title,
        price: p.numericPrice,
        img: p.img,
      });
    }
  };

  const handleProductClick = (id) => {
    if (onSelectProduct) {
      onSelectProduct(id);
    }
  };

  const matchesDiscipline = (p, discipline) => {
    if (discipline === 'All Objects' || discipline === 'All Disciplines') return true;
    const searchString = (p.category + ' ' + p.title + ' ' + p.subtitle).toLowerCase();

    if (discipline === "Women's Apparel") {
      return (
        searchString.includes('women') ||
        searchString.includes('dress') ||
        searchString.includes('tunic') ||
        searchString.includes('silk') ||
        searchString.includes('skirt') ||
        searchString.includes('blouse')
      );
    }
    if (discipline === "Men's Clothing" || discipline === "Men's Tailoring") {
      if (searchString.includes('women') || searchString.includes('dress') || searchString.includes('skirt') || searchString.includes('tunic')) {
        return false;
      }
      return (
        searchString.includes('men') ||
        searchString.includes('tailor') ||
        searchString.includes('blazer') ||
        searchString.includes('trench') ||
        searchString.includes('suit') ||
        searchString.includes('coat') ||
        searchString.includes('jacket')
      );
    }
    if (discipline === 'Textiles & Fiber') {
      return (
        searchString.includes('textile') ||
        searchString.includes('fiber') ||
        searchString.includes('flax') ||
        searchString.includes('scarf') ||
        searchString.includes('swatch') ||
        searchString.includes('loom')
      );
    }
    return searchString.includes(discipline.toLowerCase());
  };

  const categoriesList = [
    { id: 'all', name: 'All Objects', label: 'All Garments' },
    { id: 'womens', name: "Women's Apparel", label: "Women's Collection" },
    { id: 'mens', name: "Men's Clothing", label: "Men's Collection" },
    { id: 'textiles', name: 'Textiles & Fiber', label: 'Textiles & Swatches' },
  ];

  const pricePresets = [
    { id: 'all', label: 'All Prices', min: 0, max: 150000 },
    { id: 'under-15k', label: 'Under Rs. 15,000', min: 0, max: 15000 },
    { id: '15k-40k', label: 'Rs. 15,000 – 40,000', min: 15000, max: 40000 },
    { id: '40k-80k', label: 'Rs. 40,000 – 80,000', min: 40000, max: 80000 },
    { id: 'above-80k', label: 'Rs. 80,000+', min: 80000, max: 200000 },
  ];

  const colorPresets = [
    { id: 'all', label: 'All Hues', hex: null },
    { id: 'ecru', label: 'Undyed Ecru', hex: '#E8E2D5' },
    { id: 'charcoal', label: 'Sumi Charcoal', hex: '#1F1B18' },
    { id: 'sage', label: 'Wabi Sage Green', hex: '#4A5844' },
    { id: 'persimmon', label: 'Kakishibu Persimmon', hex: '#94492C' },
  ];

  const sizePresets = ['all', 'S', 'M', 'L', 'XL', 'II'];

  const materialPresets = [
    { id: 'all', label: 'All Materials' },
    { id: 'flax', label: 'Normandy Flax' },
    { id: 'silk', label: 'Organic Silk' },
    { id: 'wool', label: 'Structure Wool' },
    { id: 'cotton', label: 'Heavy Cotton' },
  ];

  const getCategoryCount = (discipline) => {
    return products.filter((p) => matchesDiscipline(p, discipline)).length;
  };

  const matchesSearch = (p) => {
    if (!searchQuery || !searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const haystack = `${p.title || ''} ${p.category || ''} ${p.subtitle || ''} ${p.studio || ''} ${p.badge || ''}`.toLowerCase();
    return haystack.includes(q);
  };

  const filteredProducts = products.filter((p) => {
    const matchesPrice = p.numericPrice >= priceMin && p.numericPrice <= priceMax;
    const matchesDisc = matchesDiscipline(p, selectedDiscipline);
    const matchesQuery = matchesSearch(p);

    let matchesColor = true;
    if (selectedColorFilter !== 'all') {
      const haystack = (JSON.stringify(p.colors || '') + ' ' + (p.title || '') + ' ' + (p.subtitle || '')).toLowerCase();
      matchesColor = haystack.includes(selectedColorFilter.toLowerCase());
    }

    let matchesSize = true;
    if (selectedSizeFilter !== 'all') {
      const haystack = (JSON.stringify(p.sizes || '') + ' ' + (p.title || '') + ' ' + (p.subtitle || '')).toLowerCase();
      matchesSize = haystack.includes(selectedSizeFilter.toLowerCase());
    }

    let matchesMaterial = true;
    if (selectedMaterialFilter !== 'all') {
      const haystack = ((p.category || '') + ' ' + (p.title || '') + ' ' + (p.subtitle || '')).toLowerCase();
      matchesMaterial = haystack.includes(selectedMaterialFilter.toLowerCase());
    }

    let matchesStock = true;
    if (inStockOnly) {
      matchesStock = (p.stock === undefined || p.stock === null) ? true : Number(p.stock) > 0;
    }

    return matchesPrice && matchesDisc && matchesQuery && matchesColor && matchesSize && matchesMaterial && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Price: Low to High') return a.numericPrice - b.numericPrice;
    if (sortOption === 'Price: High to Low') return b.numericPrice - a.numericPrice;
    return 0;
  });

  const isFiltered =
    selectedDiscipline !== 'All Objects' ||
    priceMin > 0 ||
    priceMax < 150000 ||
    activePreset !== 'all' ||
    selectedColorFilter !== 'all' ||
    selectedSizeFilter !== 'all' ||
    selectedMaterialFilter !== 'all' ||
    inStockOnly ||
    Boolean(searchQuery);

  return (
    <div className="w-full bg-surface">
      {/* Header Banner */}
      <section className="relative w-full py-space-3xl bg-surface-container-low border-b border-surface-variant overflow-hidden">
        <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-space-xxs">
                ATELIER ÉDITIONS GARMENT ARCHIVE
              </span>
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface leading-[1.05]">
                Apparel Catalog &amp; Custom Tailoring
              </h1>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Filter luxury garments by price range in Sri Lankan Rupees (Rs.), silk weaving weight, and tailoring discipline.
            </p>
          </div>
        </div>
      </section>

      {/* Main Filter & Product Grid Container */}
      <section className="w-full max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-2xl">
        
        {/* Top Horizontal Category Selector Pills Bar */}
        <div className="mb-space-2xl border-b border-surface-variant pb-space-lg">
          <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block mb-3 font-semibold">
            Select Apparel Category:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map((cat) => {
              const isSelected = selectedDiscipline === cat.name;
              const count = getCategoryCount(cat.name);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedDiscipline(cat.name)}
                  className={`px-4 py-2.5 rounded-lg font-label-caps text-xs uppercase cursor-pointer transition-all shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-primary text-on-primary font-bold shadow-md'
                      : 'bg-surface-container-low border border-surface-variant text-on-surface-variant hover:text-on-surface hover:border-outline'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-secondary text-on-secondary font-bold' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Bar & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-lg border-b border-surface-variant mb-space-2xl">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mr-1">
              Active Filters:
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-caps text-[11px] uppercase font-bold shadow-xs">
              <span>{selectedDiscipline}</span>
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-on-secondary font-label-caps text-[11px] uppercase font-bold shadow-xs">
                <span>Search: "{searchQuery}"</span>
                <button
                  onClick={onClearSearch}
                  className="hover:text-primary cursor-pointer ml-1"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}

            {(priceMin > 0 || priceMax < 150000) && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-[11px] uppercase font-bold shadow-xs">
                <span>Price: {formatRs(priceMin)} – {formatRs(priceMax)}</span>
                <button
                  onClick={() => {
                    setPriceMin(0);
                    setPriceMax(150000);
                    setActivePreset('all');
                  }}
                  className="hover:text-primary cursor-pointer ml-1"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}

            {isFiltered && (
              <button
                onClick={clearAllFilters}
                className="font-label-caps text-[11px] uppercase tracking-wider text-secondary hover:underline cursor-pointer ml-2"
              >
                Clear All Filters ({filteredProducts.length} Garments)
              </button>
            )}
          </div>

          <div className="flex items-center gap-space-md">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Sort By Price / Release:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-10 px-3 rounded bg-surface-container-low border border-surface-variant font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer"
            >
              <option>Curated Picks</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Atelier Releases</option>
            </select>
          </div>
        </div>

        {/* Catalog Body Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
          <aside className="lg:col-span-3 space-y-space-2xl bg-surface-container-low p-space-xl rounded-xl border border-surface-variant">
            
            {/* Category Index Sidebar */}
            <div>
              <h3 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface mb-space-md border-b border-surface-variant pb-2 font-semibold">
                Category Index
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                {categoriesList.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedDiscipline(cat.name)}
                      className={`w-full text-left py-1.5 flex items-center justify-between cursor-pointer transition-colors ${
                        selectedDiscipline === cat.name
                          ? 'text-secondary font-semibold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="font-mono text-[11px] text-outline">({getCategoryCount(cat.name)})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Price Filter Section */}
            <div>
              <div className="flex items-center justify-between mb-2 border-b border-surface-variant pb-2">
                <h3 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-secondary">tune</span>
                  <span>Price Filter (Rs.)</span>
                </h3>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-col gap-1.5 my-3">
                {pricePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id, preset.min, preset.max)}
                    className={`w-full text-left px-3 py-1.5 rounded text-[11px] font-label-caps uppercase transition-colors cursor-pointer flex items-center justify-between ${
                      activePreset === preset.id
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container-lowest border border-surface-variant/60 text-on-surface-variant hover:border-primary'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {activePreset === preset.id && <span>✓</span>}
                  </button>
                ))}
              </div>

              {/* Range Inputs / Slider Controls */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-on-surface font-medium mb-1">
                    <span>Min Price:</span>
                    <span className="font-semibold text-secondary">{formatRs(priceMin)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="5000"
                    value={priceMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= priceMax) {
                        setPriceMin(val);
                        setActivePreset('custom');
                      }
                    }}
                    className="w-full accent-secondary cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-on-surface font-medium mb-1">
                    <span>Max Price:</span>
                    <span className="font-semibold text-secondary">{formatRs(priceMax)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="5000"
                    value={priceMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= priceMin) {
                        setPriceMax(val);
                        setActivePreset('custom');
                      }
                    }}
                    className="w-full accent-secondary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-variant/40">
                  <span className="font-label-caps text-[10px] text-on-surface-variant">Range: Rs. 0 – Rs. 150,000+</span>
                  <button
                    onClick={() => {
                      setPriceMin(0);
                      setPriceMax(150000);
                      setActivePreset('all');
                    }}
                    className="font-label-caps text-[10px] text-secondary hover:underline cursor-pointer"
                  >
                    Reset Price
                  </button>
                </div>
              </div>
            </div>

            {/* Color Swatch Filter */}
            <div>
              <div className="flex items-center justify-between mb-2 border-b border-surface-variant pb-2">
                <h3 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-secondary">palette</span>
                  <span>Colorway Palette</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {colorPresets.map((col) => {
                  const isSel = selectedColorFilter === (col.id === 'all' ? 'all' : col.label);
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedColorFilter(col.id === 'all' ? 'all' : col.label)}
                      className={`px-2.5 py-1 rounded-full font-label-caps text-[10px] uppercase flex items-center gap-1.5 cursor-pointer border transition-all ${
                        isSel ? 'bg-primary text-on-primary border-primary font-bold shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60 text-on-surface-variant hover:border-secondary'
                      }`}
                    >
                      {col.hex && (
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: col.hex }} />
                      )}
                      <span>{col.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <div className="flex items-center justify-between mb-2 border-b border-surface-variant pb-2">
                <h3 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-secondary">straighten</span>
                  <span>Proportion / Size</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {sizePresets.map((sz) => {
                  const isSel = selectedSizeFilter === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSizeFilter(sz)}
                      className={`w-9 h-9 rounded-lg font-label-caps text-xs uppercase font-bold flex items-center justify-center cursor-pointer border transition-all ${
                        isSel ? 'bg-primary text-on-primary border-primary shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60 text-on-surface-variant hover:border-secondary'
                      }`}
                    >
                      {sz === 'all' ? 'ALL' : sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div>
              <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-surface-variant cursor-pointer">
                <span className="font-label-caps text-xs font-bold text-on-surface uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                  <span>In-Stock Pieces Only</span>
                </span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-secondary h-4 w-4 cursor-pointer"
                />
              </label>
            </div>

          </aside>

          <div className="lg:col-span-9">
            {sortedProducts.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant bg-surface-container-low rounded-xl border border-surface-variant p-8">
                <span className="material-symbols-outlined text-[48px] block mb-3 opacity-40">filter_alt_off</span>
                <h3 className="font-headline-sm text-on-surface mb-2">No garments match price range {formatRs(priceMin)} – {formatRs(priceMax)}</h3>
                <p className="font-body-sm text-xs mb-4">Try increasing your price slider or choosing another price preset.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 rounded bg-primary text-on-primary font-label-md text-xs uppercase cursor-pointer"
                >
                  Reset Price &amp; Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {sortedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="group relative flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden p-space-sm card-hover-lift border border-surface-variant/80"
                  >
                    <div
                      className="relative w-full aspect-[3/4] rounded-lg bg-surface-container overflow-hidden mb-space-sm cursor-pointer"
                      onClick={() => handleProductClick(p.id)}
                    >
                      <img
                        src={p.img}
                        alt={p.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full glass-panel font-label-caps text-[10px] uppercase text-on-surface tracking-wider shadow-sm">
                          {p.badge}
                        </span>
                      )}

                      {(() => {
                        const pIdStr = String(p.id || p._id || '');
                        const isFav = wishlistIds.some((id) => String(id) === pIdStr || String(id) === String(p._id));
                        return (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleWishlist) onToggleWishlist(p);
                            }}
                            className={`absolute top-3 right-3 w-9 h-9 rounded-full glass-panel flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer z-10 ${
                              isFav ? 'text-red-600 bg-surface-container-lowest scale-110 shadow-lg' : 'text-on-surface hover:text-red-600 hover:scale-110'
                            }`}
                            title={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {isFav ? 'favorite' : 'favorite_border'}
                            </span>
                          </button>
                        );
                      })()}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(p);
                        }}
                        className="absolute bottom-3 inset-x-3 h-11 rounded-lg bg-primary text-on-primary font-label-md text-label-md tracking-wider uppercase backdrop-blur-md opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-secondary flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                        <span>Quick Add +</span>
                      </button>
                    </div>

                    <div className="flex flex-col flex-1 justify-between px-1 py-1 space-y-1">
                      <div>
                        <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block">
                          {p.category}
                        </span>
                        <button
                          onClick={() => handleProductClick(p.id)}
                          className="font-subheading-md text-subheading-md text-on-surface group-hover:text-secondary transition-colors duration-300 mb-1 truncate text-left cursor-pointer font-medium block"
                        >
                          {p.title}
                        </button>
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-surface-variant/40">
                        <span className="font-price-editorial text-price-editorial text-primary font-bold">
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
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
