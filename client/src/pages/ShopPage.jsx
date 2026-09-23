// Catalog & Shop Page Component
import React, { useState, useEffect } from 'react';

export default function ShopPage({ activeTab = 'shop', onAddToCart, onSelectProduct, onToggleWishlist, wishlistIds = [] }) {
  const [sortOption, setSortOption] = useState('Curated Picks');
  const [priceMax, setPriceMax] = useState(800);
  const [selectedDiscipline, setSelectedDiscipline] = useState(() => {
    if (activeTab === 'apparel') return 'Loomed Linen & Apparel';
    if (activeTab === 'living') return 'Sculptural Furniture';
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
            const numPrice = typeof p.price === 'number'
              ? p.price
              : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 150;

            return {
              id: p._id || p.id,
              title: p.title || p.name || 'Untitled Object',
              category: p.category || 'Home Decor',
              subtitle: p.subtitle || p.description || '',
              price: typeof p.price === 'number' ? `$${p.price.toFixed(2)}` : (String(p.price).startsWith('$') ? p.price : `$${p.price}`),
              numericPrice: numPrice,
              studio: p.studio || 'Kyoto Studio',
              badge: p.badge || 'Limited Edition',
              img: p.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c',
            };
          });
          setProducts(formatted);
        }
      }
    } catch (err) {
      console.log('Database fetch error:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'apparel') {
      setSelectedDiscipline('Loomed Linen & Apparel');
    } else if (activeTab === 'living') {
      setSelectedDiscipline('Sculptural Furniture');
    } else if (activeTab === 'shop') {
      setSelectedDiscipline('All Objects');
    }
  }, [activeTab]);

  const clearAllFilters = () => {
    setSelectedDiscipline('All Objects');
    setPriceMax(800);
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
    
    if (discipline === 'Loomed Linen & Apparel') {
      return (
        searchString.includes('linen') ||
        searchString.includes('flax') ||
        searchString.includes('apparel') ||
        searchString.includes('garment') ||
        searchString.includes('robe') ||
        searchString.includes('haori') ||
        searchString.includes('duvet') ||
        searchString.includes('drape')
      );
    }
    if (discipline === 'Ceramics & Vessels') {
      return (
        searchString.includes('ceramic') ||
        searchString.includes('vessel') ||
        searchString.includes('stoneware') ||
        searchString.includes('clay') ||
        searchString.includes('raku') ||
        searchString.includes('teapot') ||
        searchString.includes('chawan')
      );
    }
    if (discipline === 'Architectural Lighting') {
      return (
        searchString.includes('lighting') ||
        searchString.includes('lantern') ||
        searchString.includes('pendant') ||
        searchString.includes('lamp') ||
        searchString.includes('washi')
      );
    }
    if (discipline === 'Sculptural Furniture') {
      return (
        searchString.includes('furniture') ||
        searchString.includes('timber') ||
        searchString.includes('hinoki') ||
        searchString.includes('stool') ||
        searchString.includes('bench') ||
        searchString.includes('table')
      );
    }
    if (discipline === 'Hinoki Bath & Ritual') {
      return (
        searchString.includes('bath') ||
        searchString.includes('hinoki') ||
        searchString.includes('onsen') ||
        searchString.includes('mist') ||
        searchString.includes('ritual')
      );
    }
    return searchString.includes(discipline.toLowerCase());
  };

  const categoriesList = [
    { id: 'all', name: 'All Objects', label: 'All Objects' },
    { id: 'ceramics', name: 'Ceramics & Vessels', label: 'Ceramics & Vessels' },
    { id: 'apparel', name: 'Loomed Linen & Apparel', label: 'Linen & Apparel' },
    { id: 'lighting', name: 'Architectural Lighting', label: 'Lighting Sculptures' },
    { id: 'furniture', name: 'Sculptural Furniture', label: 'Sculptural Furniture' },
    { id: 'bath', name: 'Hinoki Bath & Ritual', label: 'Hinoki Bath & Ritual' },
  ];

  const getCategoryCount = (discipline) => {
    return products.filter((p) => matchesDiscipline(p, discipline)).length;
  };

  const filteredProducts = products.filter((p) => {
    const matchesPrice = p.numericPrice <= priceMax;
    const matchesDisc = matchesDiscipline(p, selectedDiscipline);
    return matchesPrice && matchesDisc;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Price: Low to High') return a.numericPrice - b.numericPrice;
    if (sortOption === 'Price: High to Low') return b.numericPrice - a.numericPrice;
    return 0;
  });

  const isFiltered = selectedDiscipline !== 'All Objects' || priceMax < 800;

  return (
    <div className="w-full bg-surface">
      {/* Header Banner */}
      <section className="relative w-full py-space-3xl bg-surface-container-low border-b border-surface-variant overflow-hidden">
        <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-space-xxs">
                {activeTab === 'apparel' ? 'Loomed Linen & Garments Archive' : 'Complete Archival Inventory'}
              </span>
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface leading-[1.05]">
                {activeTab === 'apparel' ? 'Raw Linen & Apparel' : 'Catalog & Numbered Editions'}
              </h1>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              {activeTab === 'apparel'
                ? 'Woven on vintage shuttle looms from unbleached European flax, finished with organic plant dyes for deliberate lounge rituals.'
                : 'Tactile objects categorized by material disciplines: unglazed stoneware, Belgian flax, cast bronze, and charred timber.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Filter & Product Grid Container */}
      <section className="w-full max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-2xl">
        
        {/* Top Horizontal Category Selector Pills Bar */}
        <div className="mb-space-2xl border-b border-surface-variant pb-space-lg">
          <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block mb-3 font-semibold">
            Select Material Category Discipline:
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
              Active Category:
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-caps text-[11px] uppercase font-bold shadow-xs">
              <span>{selectedDiscipline}</span>
            </span>

            {priceMax < 800 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-[11px] uppercase">
                <span>Under ${priceMax}</span>
                <button
                  onClick={() => setPriceMax(800)}
                  className="hover:text-secondary cursor-pointer"
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
                Clear Filters ({products.length} Objects)
              </button>
            )}
          </div>

          <div className="flex items-center gap-space-md">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-10 px-3 rounded bg-surface-container-low border border-surface-variant font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer"
            >
              <option>Curated Picks</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Kiln Editions</option>
            </select>
          </div>
        </div>

        {/* Catalog Body Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
          <aside className="lg:col-span-3 space-y-space-2xl bg-surface-container-low p-space-xl rounded-xl border border-surface-variant">
            <div>
              <h3 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface mb-space-md border-b border-surface-variant pb-2">
                Material Index
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface">
                  Price Limit
                </h3>
                <span className="font-price-editorial text-price-editorial text-on-surface font-semibold">
                  ${priceMax}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
              <div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant mt-1">
                <span>$100</span>
                <span>$800</span>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            {sortedProducts.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant bg-surface-container-low rounded-xl border border-surface-variant p-8">
                <span className="material-symbols-outlined text-[48px] block mb-3 opacity-40">strikethrough_s</span>
                <h3 className="font-headline-sm text-on-surface mb-2">No items found in {selectedDiscipline}</h3>
                <p className="font-body-sm text-xs mb-4">Try clearing your price filter or selecting another discipline.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded bg-primary text-on-primary font-label-md text-xs uppercase cursor-pointer"
                >
                  Show All Archival Objects
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
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7VK4Qn61mQPz4bQ6u0Z8FGzbqjYJvgMPqLyVrl_U5rw8zMgKFmYxR2RYaFcJb8gAO-nTIfO_kc1ratauWCpOU-u67Q4sQ_hMEAF36vTpGIZWZBX2Pkz7kk8UW41YFr96mRr-iUvKoCDPu-eARO10RcSnPksGoqvKDFYjSa0lsrGa6YUypRvkzR7akycKGjXDADIurcjslasNNFQeB8t666hIOUqFpxHE-2ruxGhTHqCv8uzFdgiU';
                        }}
                      />
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full glass-panel font-label-caps text-[10px] uppercase text-on-surface tracking-wider shadow-sm">
                          {p.badge}
                        </span>
                      )}

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
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
