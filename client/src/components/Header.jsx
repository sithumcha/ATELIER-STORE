import React, { useState } from 'react';

export default function Header({ cartCount, wishlistCount, activeTab, setActiveTab, onOpenCart, user, onOpenAuth }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      {/* Top Banner Bar */}
      <div className="w-full bg-surface-container-low">
        <div className="max-w-max-width-editorial mx-auto px-margin-desktop h-9 flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant uppercase">
          <div className="flex items-center gap-space-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">public</span>
            <span>Global Store · USD ($)</span>
          </div>
          <div className="hidden md:block tracking-widest text-on-surface-variant">
            Complimentary global insured dispatch on acquisitions above $350
          </div>
          <div className="flex items-center gap-space-lg">
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-secondary text-primary font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">space_dashboard</span>
              <span>Admin Console</span>
            </button>
            <a className="hover:text-on-surface transition-colors" href="#concierge">Client Concierge</a>
            <a className="hover:text-on-surface transition-colors" href="#stockists">Stockists</a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 max-w-max-width-editorial mx-auto px-margin-desktop flex items-center justify-between">
        {/* Brand Vector Logo */}
        <div className="flex items-center gap-space-lg">
          <a
            className="flex items-center group cursor-pointer"
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 240 60"
              className="h-10 w-auto text-on-surface transition-transform duration-300 group-hover:scale-105"
              fill="none"
            >
              <text x="10" y="40" fontFamily="'Playfair Display', serif" fontSize="26" fontWeight="600" letterSpacing="0.18em" fill="currentColor">ATELIER</text>
              <text x="150" y="40" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="14" fontWeight="400" letterSpacing="0.3em" fill="#78716c">STORE</text>
              <circle cx="138" cy="32" r="2.5" fill="#c27803" />
            </svg>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-space-md">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'text-on-surface font-semibold border-b-2 border-primary pb-1'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            New Arrivals
          </button>
          <button
            onClick={() => setActiveTab('womens-wardrobe')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'womens-wardrobe'
                ? 'text-on-surface font-semibold border-b-2 border-primary pb-1'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Women's Wardrobe
          </button>
          <button
            onClick={() => setActiveTab('mens-tailoring')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'mens-tailoring'
                ? 'text-on-surface font-semibold border-b-2 border-primary pb-1'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Men's Clothing
          </button>

          <button
            onClick={() => setActiveTab('textiles')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'textiles'
                ? 'text-on-surface font-semibold border-b-2 border-primary pb-1'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Textiles &amp; Fiber
          </button>
          <button
            onClick={() => setActiveTab('lookbook')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'lookbook'
                ? 'text-on-surface font-semibold border-b-2 border-primary pb-1'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Lookbook &amp; Journal
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'shop'
                ? 'text-on-surface font-semibold border-b-2 border-primary pb-1'
                : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Catalog
          </button>
        </nav>

        {/* Right Actions: Search, Wishlist, Bag, Profile */}
        <div className="flex items-center gap-space-lg">
          <div className="relative hidden xl:flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none text-[18px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 h-10 pl-9 pr-3 rounded bg-surface-container text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest transition-colors"
              placeholder="Search natural fiber garments..."
              type="search"
            />
          </div>

          <button
            aria-label="Search Archive"
            className="xl:hidden p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            aria-label="Wishlist"
            className="relative p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">bookmark_border</span>
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-surface-container-highest text-on-surface font-label-caps text-[10px] leading-none">
              {wishlistCount}
            </span>
          </button>

          <button
            onClick={onOpenCart}
            aria-label="Shopping Bag"
            className="relative p-1 text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-space-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            <span className="flex h-5 px-1.5 items-center justify-center rounded-full bg-primary text-on-primary font-label-caps text-[10px] leading-none font-medium">
              {cartCount}
            </span>
          </button>

          <button
            onClick={() => {
              if (user) {
                setActiveTab('account');
              } else {
                onOpenAuth();
              }
            }}
            aria-label="Account"
            className="flex items-center ml-space-xs cursor-pointer"
            type="button"
          >
            {user ? (
              <img
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-secondary"
                src={user.avatar}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
            )}
          </button>

          <button
            className="lg:hidden p-1 text-on-surface-variant cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-low border-b border-surface-variant px-margin-mobile py-4 space-y-3">
          {[
            { id: 'home', label: 'New Arrivals' },
            { id: 'womens-wardrobe', label: "Women's Wardrobe" },
            { id: 'mens-tailoring', label: "Men's Clothing" },
            { id: 'textiles', label: 'Textiles & Fiber' },
            { id: 'lookbook', label: 'Lookbook & Journal' },
            { id: 'shop', label: 'Catalog' },
            { id: 'about', label: 'About Us' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              className={`block w-full text-left font-label-md capitalize py-1.5 cursor-pointer ${
                activeTab === item.id ? 'text-on-surface font-bold' : 'text-on-surface-variant'
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
