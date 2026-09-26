import React, { useState, useEffect } from 'react';

const formatRs = (val) => {
  if (val === undefined || val === null) return 'Rs. 0';
  let num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  if (num > 0 && num < 1000) num = num * 100;
  return `Rs. ${Math.round(num).toLocaleString('en-LK')}`;
};

export default function AdminProducts({ onOpenNewEdition, onEditProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
            price: formatRs(p.price),
            stock: p.stock !== undefined && p.stock !== null ? p.stock : (Array.isArray(p.sizes) ? p.sizes.reduce((sum, s) => sum + (Number(s.stock) || 0), 0) : 0),
            kiln: p.studio || 'Kyoto Studio',
            badge: p.badge || 'Limited Edition',
            badgeClass: p.badgeClass || 'bg-surface-container-lowest/90 text-on-surface',
            img: p.img || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
            alt: p.alt || p.subtitle || p.title,
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

  // Product eka database eken saha state eken delete kireema
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product edition from vault inventory?')) return;
    try {
      await fetch(`http://localhost:5001/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.log('API Delete error:', err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Instant stock updater API call
  const handleQuickStockUpdate = async (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, Number(p.stock) + delta);
          // Async sync to backend
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

  const lowStockProducts = products.filter((p) => Number(p.stock) <= 5);
  const outOfStockCount = products.filter((p) => Number(p.stock) === 0).length;

  return (
    <div className="w-full max-w-[1360px] mx-auto px-space-md sm:px-space-xl py-space-xl space-y-space-xl">
      <div className="flex items-center justify-between border-b border-surface-variant pb-space-md">
        <div>
          <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block">Atelier Vault Telemetry</span>
          <h1 className="font-headline-lg text-headline-lg text-primary">Product Editions &amp; Inventory</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-surface-container-high px-3.5 py-1.5 rounded-lg text-xs font-label-caps text-on-surface border border-surface-variant">
            <span>Low Stock Alerts:</span>
            <span className={`px-2 py-0.5 rounded-full font-bold ${lowStockProducts.length > 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900'}`}>
              {lowStockProducts.length} Editions
            </span>
          </div>

          <button
            onClick={onOpenNewEdition}
            className="px-4 py-2 rounded bg-primary text-on-primary font-label-md text-xs uppercase hover:bg-secondary transition-colors cursor-pointer flex items-center gap-2 font-bold shadow-xs"
          >
            <span className="material-symbols-outlined text-base">add_photo_alternate</span>
            <span>Commission New Edition</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg">
        {products.map((p) => {
          const numStock = Number(p.stock) || 0;
          const isOut = numStock === 0;
          const isLow = numStock > 0 && numStock <= 5;

          return (
            <div key={p.id} className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden flex flex-col justify-between group">
              <div className="relative aspect-[4/5] bg-surface-container-high overflow-hidden">
                <img
                  src={p.img}
                  alt={p.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c';
                  }}
                />
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-label-caps uppercase shadow-sm ${p.badgeClass}`}>
                  {p.badge}
                </span>

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

                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
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
                  <span className="font-price-editorial text-price-editorial text-primary font-semibold">{p.price}</span>
                  
                  {/* Quick Restock Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickStockUpdate(p.id, -1)}
                      className="w-6 h-6 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface flex items-center justify-center font-bold text-xs cursor-pointer"
                      title="Decrease stock by 1"
                    >
                      -
                    </button>
                    <span className="font-label-caps text-xs font-bold px-1">{numStock}</span>
                    <button
                      type="button"
                      onClick={() => handleQuickStockUpdate(p.id, 5)}
                      className="px-2 h-6 rounded bg-secondary/15 text-secondary border border-secondary/30 hover:bg-secondary hover:text-on-secondary font-label-caps text-[10px] font-bold cursor-pointer transition-colors"
                      title="Restock +5 units"
                    >
                      +5 Restock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
