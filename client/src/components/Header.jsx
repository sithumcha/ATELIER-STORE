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

  // Filter live products for suggestions
  const matchingLiveProducts = internalQuery.trim()
    ? liveProducts
        .filter((p) => {
          const q = internalQuery.toLowerCase().trim();
          const haystack = `${p.title || ''} ${p.category || ''} ${p.subtitle || ''} ${p.description || ''}`.toLowerCase();
          return haystack.includes(q);
        })
        .slice(0, 5)
    : [];

  const popularTags = ['Dresses', 'Linen', 'Tunics', 'Blazer', 'Robes', 'Culottes', 'Silk'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-surface-variant/40 shadow-xs">
      {/* Top Banner Bar */}
      <div className="w-full bg-surface-container-low border-b border-surface-variant/30">
        <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-desktop h-9 flex items-center justify-between font-label-caps text-xs text-on-surface-variant uppercase">
          <div className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">public</span>
            <span>Global Store · USD ($)</span>
          </div>
          <div className="hidden md:block tracking-widest text-[11px] text-on-surface-variant/90">
            Complimentary global insured dispatch on acquisitions above $350
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-secondary text-primary font-bold flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
            >
              <span className="material-symbols-outlined text-[14px]">space_dashboard</span>
              <span>Admin Console</span>
            </button>
            <a className="hover:text-on-surface transition-colors hidden sm:inline" href="#concierge">
              Client Concierge
            </a>
            <a className="hover:text-on-surface transition-colors hidden sm:inline" href="#stockists">
              Stockists
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between gap-4">
        {/* Brand Vector Logo */}
        <div className="flex items-center shrink-0">
          <a
            className="flex items-center group cursor-pointer"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 240 60"
              className="h-9 md:h-10 w-auto text-on-surface transition-transform duration-300 group-hover:scale-105"
              fill="none"
            >
              <text x="10" y="40" fontFamily="'Playfair Display', serif" fontSize="26" fontWeight="600" letterSpacing="0.18em" fill="currentColor">
                ATELIER
              </text>
              <text x="150" y="40" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="14" fontWeight="400" letterSpacing="0.3em" fill="#78716c">
                STORE
              </text>
              <circle cx="138" cy="32" r="2.5" fill="#c27803" />
            </svg>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
          <button
            onClick={() => setActiveTab('womens-wardrobe')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'womens-wardrobe'
                ? 'text-on-surface font-semibold border-b-2 border-primary'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Women's Wardrobe
          </button>
          <button
            onClick={() => setActiveTab('mens-tailoring')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'mens-tailoring'
                ? 'text-on-surface font-semibold border-b-2 border-primary'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Men's Clothing
          </button>
          <button
            onClick={() => setActiveTab('textiles')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'textiles'
                ? 'text-on-surface font-semibold border-b-2 border-primary'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Textiles &amp; Fiber
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'about'
                ? 'text-on-surface font-semibold border-b-2 border-primary'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'shop'
                ? 'text-on-surface font-semibold border-b-2 border-primary'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Catalog
          </button>
        </nav>

        {/* Right Actions: Search Box, Wishlist, Cart, Profile */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0" ref={searchRef}>
          {/* Desktop Search Input with Form Submit */}
          <div className="relative hidden md:block w-48 xl:w-64">
            <form onSubmit={handleFormSubmit} className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/80 text-[18px] pointer-events-none">
                search
              </span>
              <input
                value={internalQuery}
                onChange={handleInputChange}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full h-10 pl-9 pr-8 rounded-lg bg-surface-container-low border border-surface-variant/60 text-on-surface text-xs placeholder:text-on-surface-variant/70 focus:outline-none focus:border-secondary focus:bg-surface-container-lowest transition-all duration-200 shadow-xs"
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
                  className="absolute right-2.5 p-0.5 text-on-surface-variant hover:text-on-surface cursor-pointer rounded-full hover:bg-surface-container-high"
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
            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => setActiveTab('wishlist')}
            aria-label="Wishlist"
            className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
            type="button"
          >
            <span className={`material-symbols-outlined text-[22px] transition-colors ${wishlistCount > 0 ? 'text-red-600' : ''}`}>
              {wishlistCount > 0 ? 'favorite' : 'favorite_border'}
            </span>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-red-600 text-white font-label-caps text-[10px] leading-none font-bold shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Icon */}
          <button
            onClick={onOpenCart}
            aria-label="Shopping Bag"
            className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            <span className="flex h-5 px-1.5 items-center justify-center rounded-full bg-primary text-on-primary font-label-caps text-[10px] leading-none font-bold">
              {cartCount}
            </span>
          </button>

          {/* Account Profile Icon */}
          <button
            onClick={() => {
              if (user) {
                setActiveTab('account');
              } else {
                onOpenAuth();
              }
            }}
            aria-label="Account"
            className="flex items-center cursor-pointer ml-0.5"
            type="button"
          >
            {user ? (
              <img
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-secondary shadow-xs"
                src={user.avatar}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-container-low border border-surface-variant flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
            )}
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-surface-variant p-3 shadow-md">
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              value={internalQuery}
              onChange={handleInputChange}
              autoFocus
              className="w-full h-10 pl-9 pr-9 rounded-lg bg-surface-container-low border border-surface-variant text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none focus:border-secondary"
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
        <div className="absolute top-full left-0 right-0 bg-surface-container-lowest border-b border-surface-variant shadow-2xl z-50 animate-fade-in">
          <div className="max-w-max-width-editorial mx-auto p-4 md:p-6">
            {/* Quick Popular Searches Tags */}
            <div className="mb-4 pb-3 border-b border-surface-variant/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="font-label-caps text-[11px] text-secondary uppercase font-semibold shrink-0">
                Popular Searches:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-primary hover:text-on-primary border border-surface-variant/60 font-label-caps text-[11px] uppercase transition-colors cursor-pointer shrink-0"
                >
                  {tag}
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
                    className="font-label-caps text-xs text-secondary hover:underline uppercase font-bold cursor-pointer flex items-center gap-1"
                  >
                    <span>View all results for "{internalQuery}"</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

                {matchingLiveProducts.length === 0 ? (
                  <div className="py-6 text-center text-on-surface-variant">
                    <p className="font-body-sm text-sm">No garments found matching "{internalQuery}".</p>
                    <button
                      onClick={handleFormSubmit}
                      className="mt-2 text-xs font-label-caps text-secondary underline uppercase font-semibold cursor-pointer"
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
                      if (numPrice > 0 && numPrice < 1000) numPrice = numPrice * 100;

                      return (
                        <div
                          key={pId}
                          onClick={() => handleProductSelect(pId)}
                          className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-surface-variant/50 cursor-pointer transition-all group"
                        >
                          <img
                            src={displayImg}
                            alt={p.title || p.name}
                            className="w-12 h-14 object-cover rounded bg-surface-container shrink-0"
                          />
                          <div className="overflow-hidden">
                            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block truncate">
                              {p.category || 'Apparel'}
                            </span>
                            <h4 className="font-subheading-md text-xs text-on-surface group-hover:text-secondary truncate font-medium">
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
        <div className="lg:hidden bg-surface-container-low border-b border-surface-variant px-margin-mobile py-4 space-y-3 shadow-lg">
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
              className={`block w-full text-left font-label-md capitalize py-1.5 cursor-pointer ${
                activeTab === item.id ? 'text-on-surface font-bold border-l-2 border-primary pl-2' : 'text-on-surface-variant pl-2'
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

