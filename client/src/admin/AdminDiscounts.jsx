import React, { useState, useEffect } from 'react';

const INITIAL_DISCOUNTS = [
  { id: 'disc-1', code: 'ATELIER10', percentage: 10, title: '10% Welcome Patron Discount', active: true, createdAt: '2026-09-01' },
  { id: 'disc-2', code: 'LUXURY20', percentage: 20, title: '20% VIP Archival Privilege', active: true, createdAt: '2026-09-10' },
  { id: 'disc-3', code: 'SUMMER25', percentage: 25, title: '25% Solstice Special Edition', active: true, createdAt: '2026-09-15' },
  { id: 'disc-4', code: 'WELCOME15', percentage: 15, title: '15% First Order Courtesy', active: true, createdAt: '2026-09-20' },
];

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState(() => {
    try {
      const saved = localStorage.getItem('atelierstore_discount_codes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading discount codes from localStorage:', e);
    }
    return INITIAL_DISCOUNTS;
  });

  // New Code Form State
  const [newCode, setNewCode] = useState('');
  const [newPercentage, setNewPercentage] = useState(15);
  const [newTitle, setNewTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  // Persist discounts on state change
  useEffect(() => {
    try {
      localStorage.setItem('atelierstore_discount_codes', JSON.stringify(discounts));
    } catch (e) {
      console.error('Failed to save discount codes:', e);
    }
  }, [discounts]);

  const handleCreateDiscount = (e) => {
    e.preventDefault();
    const formattedCode = newCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!formattedCode) {
      alert('Please enter a valid discount promo code.');
      return;
    }

    const pct = Math.min(100, Math.max(1, Number(newPercentage) || 10));

    // Check if code already exists
    if (discounts.some((d) => d.code === formattedCode)) {
      alert(`Promo code "${formattedCode}" already exists! Please use a unique code name.`);
      return;
    }

    const newDiscountObj = {
      id: `disc-${Date.now()}`,
      code: formattedCode,
      percentage: pct,
      title: newTitle.trim() || `${pct}% Discount Code`,
      active: isActive,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setDiscounts([newDiscountObj, ...discounts]);
    setNewCode('');
    setNewPercentage(15);
    setNewTitle('');
    setIsActive(true);
    alert(`✨ Discount code "${formattedCode}" (${pct}% OFF) created successfully!`);
  };

  const handleToggleStatus = (id) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const handleDeleteDiscount = (id, codeName) => {
    if (!window.confirm(`Are you sure you want to delete discount code "${codeName}"?`)) return;
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const activeCount = discounts.filter((d) => d.active).length;
  const maxDiscountPct = discounts.length > 0 ? Math.max(...discounts.map((d) => d.percentage)) : 0;

  return (
    <div className="w-full max-w-[1360px] mx-auto px-space-md sm:px-space-xl py-space-xl space-y-space-2xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-xs border-b border-surface-variant">
        <div className="space-y-space-xxs">
          <div className="flex items-center gap-space-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-[11px] uppercase tracking-widest text-secondary font-semibold">
              Store Marketing &amp; Promotions
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Discount &amp; Promo Code Vault
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Create custom promo codes with configurable percentage discounts. Patron discounts apply dynamically during order checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-container-high px-4 py-2 rounded-xl text-xs font-label-caps text-on-surface flex items-center gap-2 border border-surface-variant">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Active Codes: <strong>{activeCount}</strong> / {discounts.length}</span>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-surface-variant flex items-center justify-between">
          <div>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider block">Active Promo Offers</span>
            <span className="font-headline-md text-headline-md text-primary font-bold mt-1 block">{activeCount} Promo Codes</span>
            <span className="font-body-sm text-xs text-on-surface-variant">Ready for public checkout application</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">local_offer</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-surface-variant flex items-center justify-between">
          <div>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider block">Maximum Tier Discount</span>
            <span className="font-headline-md text-headline-md text-secondary font-bold mt-1 block">{maxDiscountPct}% OFF</span>
            <span className="font-body-sm text-xs text-on-surface-variant">Highest active discount percentage</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">percent</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-surface-variant flex items-center justify-between">
          <div>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider block">Live Store Integration</span>
            <span className="font-headline-md text-headline-md text-emerald-700 font-bold mt-1 block">100% Synced</span>
            <span className="font-body-sm text-xs text-on-surface-variant">Checkout page validates codes in real-time</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">sync_saved_loc</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Add Form + Code List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
        {/* Form Column */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-space-xl rounded-xl border border-surface-variant shadow-xs space-y-space-md">
          <div className="border-b border-surface-variant pb-3">
            <span className="font-label-caps text-[10px] uppercase text-secondary font-bold tracking-wider">Admin Control</span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">+ Create New Discount Code</h2>
          </div>

          <form onSubmit={handleCreateDiscount} className="space-y-4">
            <div>
              <label className="font-label-caps text-xs block mb-1 font-bold text-on-surface uppercase">
                Promo Code Name (`Code`) *
              </label>
              <input
                required
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="e.g. ROYAL30 or FESTIVE15"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-surface-variant text-on-surface font-mono text-sm uppercase font-bold focus:outline-none focus:border-secondary"
              />
              <span className="font-body-sm text-[11px] text-on-surface-variant mt-1 block">
                Customers enter this code at checkout (e.g. ROYAL30).
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-label-caps text-xs font-bold text-on-surface uppercase">
                  Discount Percentage (%) *
                </label>
                <span className="font-headline-sm text-secondary font-bold text-base">{newPercentage}% OFF</span>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                step="1"
                value={newPercentage}
                onChange={(e) => setNewPercentage(Number(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
              <div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant mt-1">
                <span>1%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>90%</span>
              </div>
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1 font-bold text-on-surface uppercase">
                Promo Title / Campaign Description
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 30% Royal Tier Patron Privilege"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-surface-variant text-on-surface font-body-sm text-xs focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-surface-variant">
              <div>
                <span className="font-label-caps text-xs font-bold text-on-surface block">Active Status</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant">
                  {isActive ? 'Available for use at checkout' : 'Disabled / Inactive'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isActive ? 'bg-secondary' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-primary text-on-primary hover:bg-secondary font-label-caps text-xs uppercase font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Publish Discount Code</span>
            </button>
          </form>
        </div>

        {/* Discounts List Column */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-space-xl rounded-xl border border-surface-variant shadow-xs space-y-space-md">
          <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
            <div>
              <span className="font-label-caps text-[10px] uppercase text-outline font-bold tracking-wider">Vault Registry</span>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Existing Promo Codes ({discounts.length})</h2>
            </div>
            {copiedCode && (
              <span className="font-label-caps text-xs text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full font-bold animate-fade-in">
                ✓ Code "{copiedCode}" Copied to Clipboard
              </span>
            )}
          </div>

          <div className="space-y-3">
            {discounts.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">local_offer</span>
                <p className="font-subheading-md text-sm">No discount codes created yet.</p>
                <p className="font-body-sm text-xs mt-1">Use the form on the left to add your first promo code.</p>
              </div>
            ) : (
              discounts.map((disc) => (
                <div
                  key={disc.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    disc.active
                      ? 'bg-surface-container-lowest border-surface-variant hover:border-secondary/60 shadow-xs'
                      : 'bg-surface-container-low/60 border-surface-variant/40 opacity-70'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Badge % */}
                    <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold ${
                      disc.active ? 'bg-secondary/15 text-secondary border border-secondary/30' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      <span className="font-price-editorial text-xl font-bold leading-none">{disc.percentage}%</span>
                      <span className="font-label-caps text-[9px] uppercase tracking-wider mt-0.5">OFF</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-primary tracking-wider bg-surface-container-high px-2.5 py-0.5 rounded border border-surface-variant">
                          {disc.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(disc.code)}
                          className="p-1 text-on-surface-variant hover:text-secondary cursor-pointer"
                          title="Copy promo code"
                        >
                          <span className="material-symbols-outlined text-base">content_copy</span>
                        </button>

                        <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-[10px] font-bold uppercase ${
                          disc.active ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {disc.active ? '● Active' : 'Disabled'}
                        </span>
                      </div>

                      <p className="font-subheading-md text-xs text-on-surface font-semibold">{disc.title}</p>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">
                        Created on {disc.createdAt || '2026-09-25'} • Applies {disc.percentage}% discount to cart subtotal
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(disc.id)}
                      className={`px-3 py-1.5 rounded-lg font-label-caps text-xs font-bold cursor-pointer transition-colors ${
                        disc.active
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                      }`}
                    >
                      {disc.active ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDiscount(disc.id, disc.code)}
                      className="p-1.5 rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors cursor-pointer"
                      title="Delete code"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
