// Living Objects & Furnishings Page Component
import React, { useState, useEffect } from 'react';

export default function LivingPage({ onAddToCart, onSelectProduct, onExploreCatalog }) {
  const [addedItems, setAddedItems] = useState({});
  const [livingProducts, setLivingProducts] = useState([]);

  // Database eken living products fetch kireema
  useEffect(() => {
    fetchLivingProducts();
  }, []);

  const fetchLivingProducts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((p) => {
            const numPrice = typeof p.price === 'number'
              ? p.price
              : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 185;

            return {
              id: p._id || p.id,
              title: p.title || p.name || 'Untitled Object',
              category: p.category || 'Living Object',
              subtitle: p.subtitle || p.description || '',
              price: typeof p.price === 'number' ? `$${p.price.toFixed(2)}` : (String(p.price).startsWith('$') ? p.price : `$${p.price}`),
              numericPrice: numPrice,
              badge: p.badge || 'Limited Edition',
              badgeClass: p.badgeClass || 'bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface',
              img: p.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c',
            };
          });
          setLivingProducts(formatted);
        }
      }
    } catch (err) {
      console.log('Living products fetch error:', err);
    }
  };

  const handleQuickAdd = (p) => {
    setAddedItems((prev) => ({ ...prev, [p.id]: true }));
    if (onAddToCart) {
      onAddToCart({
        id: p.id,
        title: p.title,
        price: p.numericPrice || 185,
        img: p.img,
      });
    }
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [p.id]: false }));
    }, 1600);
  };

  return (
    <div className="w-full bg-surface text-on-surface">
      {/* Hero Showcase Section */}
      <section className="relative w-full py-space-5xl bg-surface-container-low border-b border-surface-variant overflow-hidden">
        <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
            <div className="lg:col-span-7 space-y-space-md">
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block">
                Atelier 01 &amp; 02 · Kyoto &amp; Stockholm Sanctuaries
              </span>
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface leading-[1.05] font-normal">
                Sculptural Furniture &amp; <br />
                <span className="italic font-normal">Tactile Living Objects</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                Objects shaped to slow down daily rituals. Hand-carved Hinoki timber furniture, unglazed Shigaraki stoneware vessels, tabletop washi paper lanterns, and tea ceremony equipment.
              </p>

              <div className="pt-space-md grid grid-cols-1 sm:grid-cols-3 gap-space-md font-label-caps text-xs text-on-surface border-t border-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>Unglazed Shigaraki Stoneware</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>Nagano Hinoki Joinery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>Gifu Washi &amp; Bronze</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg bg-surface-container border border-surface-variant">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c"
                alt="Hasami Stoneware Teapot"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md border border-surface-variant flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-[10px] text-secondary uppercase block font-bold">Featured Sanctuary Object</span>
                  <span className="font-subheading-md text-xs font-semibold text-primary">Hasami Stoneware Teapot</span>
                </div>
                <button
                  onClick={() => onSelectProduct('p1')}
                  className="px-3 py-1 rounded bg-primary text-on-primary font-label-caps text-[10px] uppercase cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Living Objects Collection Grid */}
      <section className="w-full max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-2xl border-b border-surface-variant pb-space-md">
          <div>
            <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block mb-1">
              Sanctuary Index
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Living Objects &amp; Furnishings
            </h2>
          </div>

          <button
            onClick={onExploreCatalog}
            className="px-4 py-2 rounded bg-surface-container-low border border-surface-variant text-on-surface font-label-caps text-xs uppercase hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Explore Full Catalog</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {livingProducts.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden p-space-sm transition-all duration-300 shadow-sm hover:shadow-md border border-surface-variant"
            >
              <div
                className="relative w-full aspect-[3/4] rounded-lg bg-surface-container overflow-hidden mb-space-sm cursor-pointer"
                onClick={() => onSelectProduct(p.id)}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c';
                  }}
                />
                {p.badge && (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full font-label-caps text-[10px] uppercase tracking-wider ${p.badgeClass}`}>
                    {p.badge}
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAdd(p);
                  }}
                  className="absolute bottom-3 inset-x-3 h-10 rounded-lg bg-primary/95 text-on-primary font-label-caps text-xs tracking-wider uppercase backdrop-blur-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-secondary flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  {addedItems[p.id] ? 'Added to Bag ✓' : 'Quick Add +'}
                </button>
              </div>

              <div className="flex flex-col flex-1 px-space-xs pb-space-xs space-y-1">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
                  {p.category}
                </span>
                <button
                  onClick={() => onSelectProduct(p.id)}
                  className="font-subheading-md text-sm text-on-surface group-hover:text-secondary transition-colors truncate text-left cursor-pointer font-semibold"
                >
                  {p.title}
                </button>
                <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {p.subtitle}
                </p>

                <div className="flex items-center justify-between pt-space-xs border-t border-surface-variant mt-auto">
                  <span className="font-price-editorial text-lg text-on-surface font-semibold">
                    {p.price}
                  </span>
                  <span className="font-label-caps text-[10px] text-secondary uppercase font-bold">
                    Vault Inventory
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Living Rituals & Craft Provenance Pillars */}
      <section className="w-full bg-surface-container-high py-space-5xl border-y border-surface-variant">
        <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="text-center max-w-xl mx-auto mb-space-3xl">
            <span className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1">
              Sanctuary Provenance
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Crafting Objects for Quiet Rituals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-3">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary font-headline-sm font-bold">
                01
              </span>
              <h3 className="font-subheading-lg text-on-surface font-semibold">3-Day Wood Kiln Firing</h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Wood-fired over 72 consecutive hours in Shigaraki pine kilns, allowing flying ashes to fuse with unglazed stoneware into natural glass glazes.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-3">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary font-headline-sm font-bold">
                02
              </span>
              <h3 className="font-subheading-lg text-on-surface font-semibold">Nail-Free Timber Joinery</h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Joined in Nagano using traditional Japanese Kanawa-tsugi mortise and tenon timber joinery without a single metal nail or synthetic glue.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-3">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary font-headline-sm font-bold">
                03
              </span>
              <h3 className="font-subheading-lg text-on-surface font-semibold">Diffuse Washi Ambient Glow</h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Hand-pulled Gifu washi paper lanterns paired with patinated bronze feet, casting a gentle, golden glow for evening meditation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
