import React, { useState, useEffect, useRef } from 'react';

export default function Header({
  cartCount,
  wishlistCount,
  activeTab,
  setActiveTab,
  onOpenCart,
  user,
  onOpenAuth,
  searchQuery = '',
  setSearchQuery,
  onSearchSubmit,
  onSelectProduct,
}) {
  const [internalQuery, setInternalQuery] = useState(searchQuery);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveProducts, setLiveProducts] = useState([]);
  const searchRef = useRef(null);

  // Sync internal search query if parent prop changes
  useEffect(() => {
    setInternalQuery(searchQuery);
  }, [searchQuery]);

  // Fetch products for live search suggestions
  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setLiveProducts(data);
        }
      })
      .catch((err) => console.log('Live search product fetch error:', err));
  }, []);

  // Close search overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInternalQuery(val);
    if (setSearchQuery) {
      setSearchQuery(val);
    }
  };

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSearchFocused(false);
    setIsSearchOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(internalQuery);
    }
  };

  const handleQuickTagClick = (tag) => {
    setInternalQuery(tag);
    if (setSearchQuery) setSearchQuery(tag);
    setIsSearchFocused(false);
    setIsSearchOpen(false);
    if (onSearchSubmit) onSearchSubmit(tag);
  };

  const handleProductSelect = (id) => {
    setIsSearchFocused(false);
    setIsSearchOpen(false);
    if (onSelectProduct) {
      onSelectProduct(id);
    } else if (setActiveTab) {
      setActiveTab('shop');
    }
  };

  const [selectedSearchCategory, setSelectedSearchCategory] = useState('All');

  // Filter live products for suggestions with optional Category filter
  const matchingLiveProducts = internalQuery.trim()
    ? liveProducts
        .filter((p) => {
          const q = internalQuery.toLowerCase().trim();
          const haystack = `${p.title || ''} ${p.category || ''} ${p.subtitle || ''} ${p.description || ''}`.toLowerCase();
          const matchesText = haystack.includes(q);
          if (selectedSearchCategory === 'All') return matchesText;
          return matchesText && String(p.category || '').toLowerCase().includes(selectedSearchCategory.toLowerCase());
        })
        .slice(0, 6)
    : [];

  const popularTags = ['Dresses', 'Linen', 'Tunics', 'Blazer', 'Robes', 'Culottes', 'Silk', 'Stoneware'];
  const categoryFilters = ['All', 'Flax', 'Linen', 'Tailoring', 'Textiles', 'Ceramics'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-surface-variant/40 shadow-xs transition-all duration-300">
      {/* Creative Shimmer Accent Line on Top */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-amber-700 via-amber-400 via-primary to-amber-700 animate-shimmer-bar" />

      {/* Top Banner Bar */}
      <div className="w-full bg-surface-container-low/90 border-b border-surface-variant/30 backdrop-blur-sm">
        <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-desktop h-9 flex items-center justify-between font-label-caps text-xs text-on-surface-variant uppercase tracking-wider">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-on-surface-variant/80">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>✦ Free Express Delivery on Luxury Apparel Orders Over Rs. 15,000</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-secondary text-primary font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer text-[11px] group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="material-symbols-outlined text-[15px] group-hover:rotate-45 transition-transform duration-300">space_dashboard</span>
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between gap-4">
        {/* Brand Vector Logo with Micro Shimmer */}
        <div className="flex items-center shrink-0">
          <a
            className="flex items-center group cursor-pointer relative"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 240 60"
              className="h-9 md:h-10 w-auto text-on-surface transition-transform duration-300 group-hover:scale-[1.03]"
              fill="none"
            >
              <text x="10" y="40" fontFamily="'Playfair Display', serif" fontSize="26" fontWeight="600" letterSpacing="0.18em" fill="currentColor">
                ATELIER
              </text>
              <text x="150" y="40" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="14" fontWeight="400" letterSpacing="0.3em" fill="#78716c">
                STORE
              </text>
              <circle cx="138" cy="32" r="3" fill="#c27803" className="animate-pulse" />
            </svg>
          </a>
        </div>

        {/* Desktop Nav Links with Animated Underline & Micro-Indicators */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
          <button
            onClick={() => setActiveTab('womens-wardrobe')}
            className={`nav-link-anim cursor-pointer font-label-md text-label-md ${
              activeTab === 'womens-wardrobe'
                ? 'active text-on-surface font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Women's Wardrobe</span>
          </button>
          <button
            onClick={() => setActiveTab('mens-tailoring')}
            className={`nav-link-anim cursor-pointer font-label-md text-label-md ${
              activeTab === 'mens-tailoring'
                ? 'active text-on-surface font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Men's Clothing</span>
          </button>
          <button
            onClick={() => setActiveTab('textiles')}
            className={`nav-link-anim cursor-pointer font-label-md text-label-md ${
              activeTab === 'textiles'
                ? 'active text-on-surface font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Textiles &amp; Fiber</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`nav-link-anim cursor-pointer font-label-md text-label-md ${
              activeTab === 'about'
                ? 'active text-on-surface font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>About Us</span>
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`nav-link-anim cursor-pointer font-label-md text-label-md ${
              activeTab === 'shop'
                ? 'active text-on-surface font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Catalog</span>
          </button>
        </nav>

        {/* Right Actions: Search Box, Wishlist, Cart, Profile */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0" ref={searchRef}>
          {/* Desktop Search Input with Smooth Expansion & Glow */}
          <div className="relative hidden md:block group">
            <form onSubmit={handleFormSubmit} className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/80 text-[18px] pointer-events-none group-focus-within:text-amber-600 transition-colors duration-200">
                search
              </span>
              <input
                value={internalQuery}
                onChange={handleInputChange}
                onFocus={() => setIsSearchFocused(true)}
                className="w-48 xl:w-56 focus:w-64 xl:focus:w-76 h-10 pl-9 pr-8 rounded-full bg-surface-container-low border border-surface-variant/60 text-on-surface text-xs placeholder:text-on-surface-variant/70 focus:outline-none focus:border-amber-600/70 focus:ring-2 focus:ring-amber-500/20 focus:bg-surface-container-lowest transition-all duration-300 ease-out shadow-xs"
                placeholder="Search natural fiber garments..."
                type="text"
              />
              {internalQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setInternalQuery('');
                    if (setSearchQuery) setSearchQuery('');
                  }}
                  className="absolute right-2.5 p-0.5 text-on-surface-variant hover:text-on-surface cursor-pointer rounded-full hover:bg-surface-container-high transition-transform duration-200 hover:rotate-90"
                >
                  <span className="material-symbols-outlined text-[16px] block">close</span>
                </button>
              ) : null}
            </form>
          </div>

          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setIsSearchFocused(true);
            }}
            aria-label="Toggle Search"
            className="md:hidden p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Wishlist Icon with Heart Animation */}
          <button
            onClick={() => setActiveTab('wishlist')}
            aria-label="Wishlist"
            className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 cursor-pointer group"
            type="button"
          >
            <span className={`material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:scale-125 ${wishlistCount > 0 ? 'text-red-600 animate-heart-pop' : ''}`}>
              {wishlistCount > 0 ? 'favorite' : 'favorite_border'}
            </span>
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-red-600 text-white font-label-caps text-[10px] leading-none font-bold shadow-sm animate-badge-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Icon with Bounce Effect */}
          <button
            onClick={onOpenCart}
            aria-label="Shopping Bag"
            className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 flex items-center gap-1.5 cursor-pointer group"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-6">
              shopping_bag
            </span>
            <span className="flex h-5 px-1.5 items-center justify-center rounded-full bg-primary text-on-primary font-label-caps text-[10px] leading-none font-bold shadow-xs transition-transform duration-200 group-hover:scale-110">
              {cartCount}
            </span>
          </button>

          {/* Account Profile Icon with Golden Ring Halo */}
          <button
            onClick={() => {
              if (user) {
                setActiveTab('account');
              } else {
                onOpenAuth();
              }
            }}
            aria-label="Account"
            className="flex items-center cursor-pointer ml-0.5 group"
            type="button"
          >
            {user ? (
              <img
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/50 hover:ring-amber-500 shadow-xs transition-all duration-300 group-hover:scale-105"
                src={user.avatar}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-container-low border border-surface-variant flex items-center justify-center text-on-surface-variant group-hover:text-on-surface group-hover:border-amber-600/70 group-hover:bg-amber-50/10 transition-all duration-300 group-hover:scale-105 shadow-xs">
                <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110">person</span>
              </div>
            )}
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer transition-transform duration-200 active:scale-90"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[24px] transition-transform duration-300">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-surface-variant p-3 shadow-md animate-slide-down-fade">
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              value={internalQuery}
              onChange={handleInputChange}
              autoFocus
              className="w-full h-10 pl-9 pr-9 rounded-full bg-surface-container-low border border-surface-variant text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none focus:border-secondary"
              placeholder="Search natural fiber garments..."
              type="text"
            />
            {internalQuery && (
              <button
                type="button"
                onClick={() => {
                  setInternalQuery('');
                  if (setSearchQuery) setSearchQuery('');
                }}
                className="absolute right-3 p-1 text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </form>
        </div>
      )}

      {/* Live Auto-Complete Search Suggestions Dropdown Panel */}
      {(isSearchFocused || isSearchOpen) && (
        <div className="absolute top-full left-0 right-0 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-surface-variant/60 shadow-2xl z-50 animate-slide-down-fade">
          <div className="max-w-max-width-editorial mx-auto p-4 md:p-6">
            {/* Quick Popular Searches Tags */}
            <div className="mb-4 pb-3 border-b border-surface-variant/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="font-label-caps text-[11px] text-amber-700 uppercase font-semibold shrink-0">
                Popular Searches:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-3.5 py-1 rounded-full bg-surface-container-low hover:bg-amber-600 hover:text-white border border-surface-variant/60 font-label-caps text-[11px] uppercase transition-all duration-200 cursor-pointer shrink-0 hover:scale-105 shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Live Category Filter Chips */}
            <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="font-label-caps text-[10px] text-outline uppercase font-semibold shrink-0 mr-1">
                Filter Category:
              </span>
              {categoryFilters.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedSearchCategory(cat)}
                  className={`px-2.5 py-0.5 rounded-full font-label-caps text-[10px] uppercase transition-colors cursor-pointer shrink-0 ${
                    selectedSearchCategory === cat
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Live Search Matching Products */}
            {internalQuery.trim() ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    Matching Garments ({matchingLiveProducts.length})
                  </span>
                  <button
                    onClick={handleFormSubmit}
                    className="font-label-caps text-xs text-amber-700 hover:underline uppercase font-bold cursor-pointer flex items-center gap-1 group"
                  >
                    <span>View all results for "{internalQuery}"</span>
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                </div>

                {matchingLiveProducts.length === 0 ? (
                  <div className="py-6 text-center text-on-surface-variant">
                    <p className="font-body-sm text-sm">No garments found matching "{internalQuery}".</p>
                    <button
                      onClick={handleFormSubmit}
                      className="mt-2 text-xs font-label-caps text-amber-700 underline uppercase font-semibold cursor-pointer"
                    >
                      Search catalog anyway
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {matchingLiveProducts.map((p) => {
                      const displayImg = p.images?.[0] || p.img || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80';
                      const pId = p._id || p.id;
                      let numPrice = typeof p.price === 'number' ? p.price : parseFloat(String(p.price || '24500').replace(/[^0-9.]/g, '')) || 24500;

                      return (
                        <div
                          key={pId}
                          onClick={() => handleProductSelect(pId)}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-variant/50 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group"
                        >
                          <img
                            src={displayImg}
                            alt={p.title || p.name}
                            className="w-12 h-14 object-cover rounded-lg bg-surface-container shrink-0 group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="overflow-hidden">
                            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block truncate">
                              {p.category || 'Apparel'}
                            </span>
                            <h4 className="font-subheading-md text-xs text-on-surface group-hover:text-amber-700 truncate font-medium transition-colors">
                              {p.title || p.name}
                            </h4>
                            <span className="font-price-editorial text-xs text-primary font-bold block mt-0.5">
                              Rs. {Math.round(numPrice).toLocaleString('en-LK')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-2 text-on-surface-variant text-xs">
                <span>Type any term above to see instant garment matches or choose a popular tag.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-low/95 backdrop-blur-md border-b border-surface-variant px-margin-mobile py-4 space-y-3 shadow-xl animate-slide-down-fade">
          {[
            { id: 'womens-wardrobe', label: "Women's Wardrobe" },
            { id: 'mens-tailoring', label: "Men's Clothing" },
            { id: 'textiles', label: 'Textiles & Fiber' },
            { id: 'about', label: 'About Us' },
            { id: 'shop', label: 'Catalog' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left font-label-md capitalize py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === item.id ? 'text-amber-800 font-bold bg-amber-50/50 border-l-4 border-amber-600 pl-3' : 'text-on-surface-variant hover:text-on-surface pl-3'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

