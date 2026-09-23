// Apparel & Lounge Garments Page Component
import React, { useState, useEffect } from 'react';

export default function ApparelPage({ onAddToCart, onSelectProduct, onExploreCatalog }) {
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('All');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedItems, setAddedItems] = useState({});

  const [apparelProducts, setApparelProducts] = useState([]);

  // Database eken apparel products fetch kireema
  useEffect(() => {
    fetchApparelProducts();
  }, []);

  const fetchApparelProducts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const apparelOnly = data.filter((p) => {
            const cat = (p.category || '').toLowerCase();
            const tit = (p.title || '').toLowerCase();
            return (
              cat.includes('textile') ||
              cat.includes('apparel') ||
              cat.includes('flax') ||
              tit.includes('robe') ||
              tit.includes('linen') ||
              tit.includes('drape') ||
              tit.includes('throw') ||
              tit.includes('haori')
            );
          });

          const targetList = apparelOnly.length > 0 ? apparelOnly : data;

          const formatted = targetList.map((p) => {
            const numPrice = typeof p.price === 'number'
              ? p.price
              : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 240;

            return {
              id: p._id || p.id,
              title: p.title || p.name || 'Untitled Garment',
              category: p.category || 'Loomed Linen',
              subtitle: p.subtitle || p.description || '',
              price: typeof p.price === 'number' ? `$${p.price.toFixed(2)}` : (String(p.price).startsWith('$') ? p.price : `$${p.price}`),
              numericPrice: numPrice,
              badge: p.badge || 'Natural Dye',
              badgeClass: p.badgeClass || 'bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface',
              img: p.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7VK4Qn61mQPz4bQ6u0Z8FGzbqjYJvgMPqLyVrl_U5rw8zMgKFmYxR2RYaFcJb8gAO-nTIfO_kc1ratauWCpOU-u67Q4sQ_hMEAF36vTpGIZWZBX2Pkz7kk8UW41YFr96mRr-iUvKoCDPu-eARO10RcSnPksGoqvKDFYjSa0lsrGa6YUypRvkzR7akycKGjXDADIurcjslasNNFQeB8t666hIOUqFpxHE-2ruxGhTHqCv8uzFdgiU',
            };
          });
          setApparelProducts(formatted);
        }
      }
    } catch (err) {
      console.log('Apparel fetch error:', err);
    }
  };

  const handleQuickAdd = (p) => {
    setAddedItems((prev) => ({ ...prev, [p.id]: true }));
    if (onAddToCart) {
      onAddToCart({
        id: p.id,
        title: p.title,
        price: p.numericPrice || 240,
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
                Atelier 02 · Stockholm Pattern &amp; Normandy Flax
              </span>
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface leading-[1.05] font-normal">
                Raw Linen &amp; <br />
                <span className="italic font-normal">Lounge Garments</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                Woven on vintage shuttle looms from unbleached European flax, finished with organic plant dyes for deliberate lounge rituals and climate temperature regulation.
              </p>

              <div className="pt-space-md grid grid-cols-1 sm:grid-cols-3 gap-space-md font-label-caps text-xs text-on-surface border-t border-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>100% Normandy Flax</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>Plant-Based Dyes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>Stonewashed Softness</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg bg-surface-container border border-surface-variant">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7VK4Qn61mQPz4bQ6u0Z8FGzbqjYJvgMPqLyVrl_U5rw8zMgKFmYxR2RYaFcJb8gAO-nTIfO_kc1ratauWCpOU-u67Q4sQ_hMEAF36vTpGIZWZBX2Pkz7kk8UW41YFr96mRr-iUvKoCDPu-eARO10RcSnPksGoqvKDFYjSa0lsrGa6YUypRvkzR7akycKGjXDADIurcjslasNNFQeB8t666hIOUqFpxHE-2ruxGhTHqCv8uzFdgiU"
                alt="Sora Heavyweight Linen Robe"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md border border-surface-variant flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-[10px] text-secondary uppercase block font-bold">Featured Edition</span>
                  <span className="font-subheading-md text-xs font-semibold text-primary">Sora Heavyweight Robe</span>
                </div>
                <button
                  onClick={() => onSelectProduct('p2')}
                  className="px-3 py-1 rounded bg-primary text-on-primary font-label-caps text-[10px] uppercase cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apparel Collection Grid */}
      <section className="w-full max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-2xl border-b border-surface-variant pb-space-md">
          <div>
            <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block mb-1">
              Curated Garment Archive
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Numbered Linen Editions
            </h2>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="px-4 py-2 rounded bg-surface-container-low border border-surface-variant text-on-surface font-label-caps text-xs uppercase hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Size &amp; Fit Guide</span>
              <span className="text-sm">📏</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {apparelProducts.map((p) => (
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
                    e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7VK4Qn61mQPz4bQ6u0Z8FGzbqjYJvgMPqLyVrl_U5rw8zMgKFmYxR2RYaFcJb8gAO-nTIfO_kc1ratauWCpOU-u67Q4sQ_hMEAF36vTpGIZWZBX2Pkz7kk8UW41YFr96mRr-iUvKoCDPu-eARO10RcSnPksGoqvKDFYjSa0lsrGa6YUypRvkzR7akycKGjXDADIurcjslasNNFQeB8t666hIOUqFpxHE-2ruxGhTHqCv8uzFdgiU';
                  }}
                />
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full font-label-caps text-[10px] uppercase tracking-wider ${p.badgeClass}`}>
                  {p.badge}
                </span>

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
                    In Stock
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fabric Science & Provenance Pillars */}
      <section className="w-full bg-surface-container-high py-space-5xl border-y border-surface-variant">
        <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="text-center max-w-xl mx-auto mb-space-3xl">
            <span className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1">
              Fabric Provenance
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              The Science of Normandy Flax
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-3">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary font-headline-sm font-bold">
                01
              </span>
              <h3 className="font-subheading-lg text-on-surface font-semibold">Mechanical Shuttle Looms</h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Loomed in Ghent using vintage mechanical shuttles that weave raw flax without stretching fibers, preserving thermal cellular structure.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-3">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary font-headline-sm font-bold">
                02
              </span>
              <h3 className="font-subheading-lg text-on-surface font-semibold">Botanical Dye Baths</h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Dyed in organic plant baths using roasted tea leaves, mineral clay ash, and wild indigo. Colors patina softly with every wash.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-3">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary font-headline-sm font-bold">
                03
              </span>
              <h3 className="font-subheading-lg text-on-surface font-semibold">Natural Climate Regulation</h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Hollow flax fibers naturally absorb moisture while allowing air circulation, offering warmth in winter and coolness in summer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Garment Sizing & Fit Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile bg-primary/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl p-space-xl shadow-2xl border border-surface-variant">
            <div className="flex items-center justify-between pb-space-md border-b border-surface-variant mb-space-md">
              <div>
                <span className="font-label-caps text-[10px] uppercase text-secondary block">Atelier Sizing Guide</span>
                <h3 className="font-headline-sm uppercase text-on-surface">Garment Fit &amp; Measurements</h3>
              </div>
              <button onClick={() => setIsSizeGuideOpen(false)} className="p-1 text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="space-y-4 font-body-sm text-xs text-on-surface-variant">
              <p>All KURA Studio lounge garments feature relaxed, drop-shoulder silhouettes designed for unhurried comfort.</p>
              
              <table className="w-full text-left border-collapse border border-surface-variant">
                <thead>
                  <tr className="bg-surface-container-low font-label-caps text-[10px] uppercase text-primary border-b border-surface-variant">
                    <th className="p-2">Size Tier</th>
                    <th className="p-2">Chest Width</th>
                    <th className="p-2">Robe Length</th>
                    <th className="p-2">Sleeve Span</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-on-surface font-body-sm">
                  <tr>
                    <td className="p-2 font-bold">Size 01 (S/M)</td>
                    <td className="p-2">58 cm (22.8")</td>
                    <td className="p-2">122 cm (48.0")</td>
                    <td className="p-2">76 cm (29.9")</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Size 02 (L/XL)</td>
                    <td className="p-2">66 cm (26.0")</td>
                    <td className="p-2">130 cm (51.2")</td>
                    <td className="p-2">82 cm (32.3")</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-surface-container-low rounded-lg border border-surface-variant">
                <span className="font-label-caps text-[10px] text-primary uppercase font-bold block mb-1">Garment Care Instructions:</span>
                <p>• Machine wash on gentle cool cycle with mild liquid soap.</p>
                <p>• Line dry away from direct scorching sun to preserve plant dye vibrancy.</p>
              </div>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full h-11 mt-space-lg rounded bg-primary text-on-primary font-label-md uppercase cursor-pointer"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
