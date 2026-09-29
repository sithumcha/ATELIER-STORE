import React, { useState, useEffect } from 'react';
import { getProductOffer, formatRsPrice } from '../utils/offerUtils';

export default function AdminProducts({ onOpenNewEdition, onEditProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedOfferProduct, setSelectedOfferProduct] = useState(null); // null means BULK (All Products)
  const [offerPercentage, setOfferPercentage] = useState(20);
  const [durationHours, setDurationHours] = useState(24); // 24, 48, 120, 168
  const [offerTitle, setOfferTitle] = useState('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  // Backend API eken products serama fetch karala ganeema
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((p) => ({
            id: p._id || p.id,
            name: p.title || p.name || 'Untitled Object',
            category: p.category || "Women's Wardrobe",
            price: formatRsPrice(p.price),
            stock: p.stock !== undefined && p.stock !== null ? p.stock : (Array.isArray(p.sizes) ? p.sizes.reduce((sum, s) => sum + (Number(s.stock) || 0), 0) : 0),
            kiln: p.studio || 'Kyoto Studio',
            badge: p.badge || 'Limited Edition',
            badgeClass: p.badgeClass || 'bg-surface-container-lowest/90 text-on-surface',
            img: p.img || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
            alt: p.alt || p.subtitle || p.title,
            offerPercentage: p.offerPercentage || 0,
            offerExpiresAt: p.offerExpiresAt || null,
            offerTitle: p.offerTitle || '',
            rawProduct: p,
          }));
          setProducts(formatted);
          return;
        }
      }
    } catch (err) {
      console.log('Backend API connection lost, using fallback products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product edition from vault inventory?')) return;
    try {
      await fetch(`http://localhost:5001/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.log('API Delete error:', err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Quick stock updater
  const handleQuickStockUpdate = async (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, Number(p.stock) + delta);
          fetch(`http://localhost:5001/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: newStock }),
          }).catch((err) => console.log('Stock update error:', err));
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Open Offer Modal for Single Product or Bulk
  const openOfferModal = (prod = null) => {
    setSelectedOfferProduct(prod);
    if (prod) {
      const offerInfo = getProductOffer(prod);
      setOfferPercentage(offerInfo.hasActiveOffer ? offerInfo.offerPercentage : 20);
      setOfferTitle(prod.offerTitle || `${offerInfo.hasActiveOffer ? offerInfo.offerPercentage : 20}% OFF Special Offer`);
    } else {
      setOfferPercentage(20);
      setOfferTitle('20% OFF Global Store Sale');
    }
    setDurationHours(24);
    setIsOfferModalOpen(true);
  };

  // Apply Offer (Single or Bulk)
  const handleApplyOffer = async (e) => {
    e.preventDefault();
    setIsSubmittingOffer(true);

    const isBulk = !selectedOfferProduct;
    const targetUrl = isBulk
      ? 'http://localhost:5001/api/products/offer/bulk'
      : `http://localhost:5001/api/products/${selectedOfferProduct.id}/offer`;
    const targetMethod = isBulk ? 'POST' : 'PUT';

    const payload = {
      offerPercentage: Number(offerPercentage),
      durationHours: Number(durationHours),
      offerTitle: offerTitle.trim() || `${offerPercentage}% OFF Offer`,
    };

    try {
      const res = await fetch(targetUrl, {
        method: targetMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchProducts(); // Refresh state
        setIsOfferModalOpen(false);
        alert(`✨ ${isBulk ? 'Bulk Offer applied to ALL items' : `Offer applied to ${selectedOfferProduct.name}`} for ${durationHours} hours!`);
      } else {
        alert('Failed to update offer. Please check backend API.');
      }
    } catch (err) {
      console.error('Error applying offer:', err);
      alert('Network error while applying offer.');
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  // Remove Offer (Single or Bulk)
  const handleRemoveOffer = async () => {
    if (!window.confirm(`Are you sure you want to remove the offer from ${selectedOfferProduct ? selectedOfferProduct.name : 'ALL products'}?`)) return;

    setIsSubmittingOffer(true);
    const isBulk = !selectedOfferProduct;
    const targetUrl = isBulk
      ? 'http://localhost:5001/api/products/offer/bulk'
      : `http://localhost:5001/api/products/${selectedOfferProduct.id}/offer`;

    try {
      const res = await fetch(targetUrl, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
        setIsOfferModalOpen(false);
        alert(`✓ Offer removed successfully.`);
      }
    } catch (err) {
      console.error('Error clearing offer:', err);
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const lowStockProducts = products.filter((p) => Number(p.stock) <= 5);
  const outOfStockCount = products.filter((p) => Number(p.stock) === 0).length;
  const activeOfferCount = products.filter((p) => getProductOffer(p).hasActiveOffer).length;

  return (
    <div className="w-full max-w-[1360px] mx-auto px-space-md sm:px-space-xl py-space-xl space-y-space-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-surface-variant pb-space-md gap-4">
        <div>
          <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block">Atelier Vault Telemetry</span>
          <h1 className="font-headline-lg text-headline-lg text-primary">Product Editions &amp; Inventory</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Active Offers Indicator */}
          <div className="flex items-center gap-2 bg-amber-50 text-amber-950 px-3.5 py-1.5 rounded-lg text-xs font-label-caps border border-amber-300">
            <span className="material-symbols-outlined text-amber-600 text-base">local_offer</span>
            <span>Active Offers: <strong>{activeOfferCount} Items</strong></span>
          </div>

          {/* Bulk Offer Button */}
          <button
            onClick={() => openOfferModal(null)}
            className="px-3.5 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-xs uppercase hover:bg-secondary/90 transition-colors cursor-pointer flex items-center gap-1.5 font-bold shadow-xs"
            title="Set a discount offer to all items at once"
          >
            <span className="material-symbols-outlined text-base">local_offer</span>
            <span>🔥 Set Offer to ALL Items</span>
          </button>

          {/* Commission New Edition Button */}
          <button
            onClick={onOpenNewEdition}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-xs uppercase hover:bg-secondary transition-colors cursor-pointer flex items-center gap-2 font-bold shadow-xs"
          >
            <span className="material-symbols-outlined text-base">add_photo_alternate</span>
            <span>New Edition</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="p-space-md rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-700 text-2xl animate-pulse">warning</span>
            <div>
              <h4 className="font-subheading-md text-xs font-bold uppercase tracking-wider text-amber-900">
                Low Inventory Telemetry Warning ({lowStockProducts.length} Editions Under Stock Threshold)
              </h4>
              <p className="font-body-sm text-xs text-amber-800">
                {outOfStockCount > 0 ? `${outOfStockCount} editions are completely out of stock.` : 'Several editions are approaching zero stock.'} Click `+5 Restock` to replenish inventory instantly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg">
        {products.map((p) => {
          const numStock = Number(p.stock) || 0;
          const isOut = numStock === 0;
          const isLow = numStock > 0 && numStock <= 5;
          const offer = getProductOffer(p);

          return (
            <div key={p.id} className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden flex flex-col justify-between group relative">
              <div className="relative aspect-[4/5] bg-surface-container-high overflow-hidden">
                <img
                  src={p.img}
                  alt={p.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                
                {/* Active Offer Badge Banner */}
                {offer.hasActiveOffer ? (
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                    <span className="px-2.5 py-1 rounded bg-rose-600 text-white text-[11px] font-label-caps uppercase font-bold shadow-md flex items-center gap-1 animate-pulse">
                      <span className="material-symbols-outlined text-xs">local_offer</span>
                      {offer.offerPercentage}% OFF
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/80 text-amber-300 text-[9px] font-mono shadow-sm">
                      ⏳ {offer.timeRemainingStr}
                    </span>
                  </div>
                ) : (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-label-caps uppercase shadow-sm ${p.badgeClass}`}>
                    {p.badge}
                  </span>
                )}

                {/* Stock Warning Badge Overlay */}
                <span className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-label-caps uppercase font-bold shadow-md ${
                  isOut
                    ? 'bg-rose-600 text-white border border-rose-700'
                    : isLow
                    ? 'bg-amber-500 text-white border border-amber-600 animate-pulse'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {isOut ? '● Out of Stock' : isLow ? `⚠️ Low Stock (${numStock} left)` : `✓ In Stock (${numStock})`}
                </span>

                {/* Action Buttons: Edit, Offer, Delete */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openOfferModal(p);
                    }}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer shadow-sm ${
                      offer.hasActiveOffer
                        ? 'bg-rose-600 text-white hover:bg-rose-700 ring-2 ring-rose-300'
                        : 'bg-surface-container-lowest/90 hover:bg-secondary hover:text-on-secondary text-on-surface'
                    }`}
                    title="Manage Item Offer / Discount"
                  >
                    <span className="material-symbols-outlined text-base">local_offer</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEditProduct) {
                        onEditProduct(p.rawProduct || p);
                      }
                    }}
                    className="p-1.5 rounded-full bg-surface-container-lowest/90 hover:bg-primary hover:text-on-primary text-on-surface transition-colors cursor-pointer shadow-sm"
                    title="Edit Product Edition"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.id);
                    }}
                    className="p-1.5 rounded-full bg-surface-container-lowest/90 hover:bg-error hover:text-on-error text-on-surface transition-colors cursor-pointer shadow-sm"
                    title="Remove Edition"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>

              <div className="p-space-md flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-[11px] text-outline">{p.id}</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-label-caps text-[10px] uppercase text-on-surface">
                      {p.kiln}
                    </span>
                  </div>
                  <h3 className="font-subheading-lg text-on-surface font-semibold line-clamp-1">{p.name}</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant line-clamp-1">{p.category}</p>
                </div>

                <div className="flex items-center justify-between pt-space-xs border-t border-surface-variant">
                  {offer.hasActiveOffer ? (
                    <div className="flex flex-col">
                      <span className="font-price-editorial text-price-editorial text-rose-700 font-bold">
                        {formatRsPrice(offer.discountedPrice)}
                      </span>
                      <span className="line-through text-[11px] text-outline font-mono">
                        {formatRsPrice(offer.rawPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-price-editorial text-price-editorial text-primary font-semibold">
                      {p.price}
                    </span>
                  )}
                  
                  {/* Quick Restock Controls & Single Offer Button */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openOfferModal(p)}
                      className="px-2 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white font-label-caps text-[10px] font-bold transition-colors cursor-pointer"
                      title="Set offer duration (24h, 2d, 5d, 7d)"
                    >
                      {offer.hasActiveOffer ? `${offer.offerPercentage}% OFF` : '+ Offer'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Offer Configuration Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-surface-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600 text-2xl">local_offer</span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  {selectedOfferProduct ? `Set Offer: ${selectedOfferProduct.name}` : '🔥 Apply Offer to ALL Items (Bulk)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleApplyOffer} className="space-y-4">
              {/* Discount Percentage Preset Buttons */}
              <div>
                <label className="font-label-caps text-xs font-bold text-on-surface uppercase block mb-1">
                  Discount Percentage (%) *
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[10, 15, 20, 25, 30, 40, 50, 70].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setOfferPercentage(pct);
                        if (!offerTitle || offerTitle.includes('% OFF')) {
                          setOfferTitle(`${pct}% OFF ${selectedOfferProduct ? 'Special Offer' : 'Storewide Sale'}`);
                        }
                      }}
                      className={`py-2 rounded-lg font-label-caps text-xs font-bold border transition-colors cursor-pointer ${
                        Number(offerPercentage) === pct
                          ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                          : 'bg-surface-container-low text-on-surface border-surface-variant hover:bg-surface-variant'
                      }`}
                    >
                      {pct}% OFF
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="90"
                    value={offerPercentage}
                    onChange={(e) => setOfferPercentage(Number(e.target.value))}
                    className="flex-1 accent-rose-600 cursor-pointer"
                  />
                  <span className="font-headline-sm text-rose-700 font-bold text-lg min-w-[55px] text-right">
                    {offerPercentage}%
                  </span>
                </div>
              </div>

              {/* Offer Duration Picker: 24h, 2 days, 5 days, 7 days */}
              <div>
                <label className="font-label-caps text-xs font-bold text-on-surface uppercase block mb-1">
                  Offer Duration / Expiry Time *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { hours: 24, label: '24 Hours (1 Day)' },
                    { hours: 48, label: '2 Days (48h)' },
                    { hours: 120, label: '5 Days' },
                    { hours: 168, label: '7 Days' },
                  ].map((d) => (
                    <button
                      key={d.hours}
                      type="button"
                      onClick={() => setDurationHours(d.hours)}
                      className={`p-2.5 rounded-lg border text-center font-label-caps text-xs font-bold transition-all cursor-pointer ${
                        Number(durationHours) === d.hours
                          ? 'bg-primary text-on-primary border-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface border-surface-variant hover:bg-surface-variant'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offer Campaign Title Input */}
              <div>
                <label className="font-label-caps text-xs font-bold text-on-surface uppercase block mb-1">
                  Offer Badge Title / Promo Tagline
                </label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="e.g. 24h Flash Sale or 20% OFF Limited Privilege"
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-variant text-on-surface text-xs focus:outline-none focus:border-rose-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isSubmittingOffer}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-label-caps text-xs uppercase font-bold transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">bolt</span>
                  <span>{isSubmittingOffer ? 'Saving Offer...' : selectedOfferProduct ? 'Apply Item Offer' : 'Apply Offer to ALL Items'}</span>
                </button>

                {(selectedOfferProduct?.offerPercentage > 0 || (!selectedOfferProduct && activeOfferCount > 0)) && (
                  <button
                    type="button"
                    onClick={handleRemoveOffer}
                    disabled={isSubmittingOffer}
                    className="py-3 px-4 rounded-xl bg-surface-container-high hover:bg-error hover:text-on-error text-on-surface font-label-caps text-xs uppercase font-bold transition-colors cursor-pointer border border-surface-variant"
                  >
                    Clear Offer
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
