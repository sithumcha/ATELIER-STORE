import React, { useState, useEffect } from 'react';

export default function ProductDetailPage({ selectedProductId, onAddToCart, onBackToHome }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Database API (http://localhost:5001/api/products/:id) eken product details ganeema
  useEffect(() => {
    if (selectedProductId) {
      fetchProductDetail(selectedProductId);
    } else {
      fetchAllAndPickFirst();
    }
  }, [selectedProductId]);

  const fetchProductDetail = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5001/api/products/${id}`);
      if (res.ok) {
        const p = await res.json();
        formatAndSetProduct(p);
      } else {
        fetchAllAndPickFirst();
      }
    } catch (err) {
      fetchAllAndPickFirst();
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAndPickFirst = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/products');
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          const match = list.find((item) => (item._id === selectedProductId || item.id === selectedProductId)) || list[0];
          formatAndSetProduct(match);
        }
      }
    } catch (err) {
      console.log('Error fetching product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAndSetProduct = (p) => {
    const numPrice = typeof p.price === 'number'
      ? p.price
      : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 145;

    setProduct({
      id: p._id || p.id,
      title: p.title || p.name || 'Untitled Object',
      category: p.category || 'Home Decor',
      origin: p.origin || 'KYOTO KILN • SHIGARAKI CLAY',
      subtitle: p.subtitle || '',
      description: p.description || p.subtitle || p.title,
      price: typeof p.price === 'number' ? `$${p.price.toFixed(2)}` : (String(p.price).startsWith('$') ? p.price : `$${p.price}`),
      numericPrice: numPrice,
      taxInfo: p.taxInfo || '• Tax Included',
      finishes: p.finishes && p.finishes.length > 0 ? p.finishes : ['RAW SANDSTONE', 'CHALK WHITE', 'CHARRED ASH'],
      capacities: p.capacities && p.capacities.length > 0 ? p.capacities : ['350ML (SOLO)', '500ML (DUO)', '750ML (GATHERING)'],
      craftProvenance: p.craftProvenance || 'Crafted in Kyoto using 700-year-old Shigaraki unglazed stoneware techniques.',
      carePreservation: p.carePreservation || 'Hand wash with warm water only.',
      badge: p.badge || 'Limited Edition',
      badgeClass: p.badgeClass || 'bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface tracking-wider',
      img: p.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c',
      images: p.images && p.images.length > 0 ? p.images : [p.img],
    });
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('craft'); // 'craft' | 'care' | ''
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);



  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart({
        id: product.id,
        title: product.title,
        price: product.numericPrice || 145,
        img: product.img,
        finish: selectedFinish,
        capacity: selectedCapacity,
        quantity,
      });
    }
  };

  if (loading || !product) {
    return (
      <div className="w-full py-24 text-center text-on-surface-variant bg-surface">
        <span className="material-symbols-outlined text-4xl animate-spin mb-2 block">cyclone</span>
        <p className="font-label-caps text-xs uppercase">Loading Archival Edition Details...</p>
      </div>
    );
  }

  const currentPriceNum = product.numericPrice || 145;
  const totalPriceFormatted = `$${(currentPriceNum * quantity).toFixed(2)}`;

  return (
    <div className="w-full bg-surface text-on-surface">
      {/* Product Main Showcase Grid */}
      <section className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-xl md:py-space-3xl">
        {/* Back Button */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-space-xs font-label-md text-xs uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors mb-space-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Vault Catalog</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl lg:gap-space-3xl items-start">
          {/* Left: Product Images Showcase */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-space-md">
            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex md:flex-col gap-space-sm shrink-0">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? 'border-primary opacity-100 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.title} view ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Display */}
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-high shadow-sm border border-surface-variant group">
              <img
                src={product.images && product.images[selectedImageIndex] ? product.images[selectedImageIndex] : product.img}
                alt={product.alt || product.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-zoom-in"
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full font-label-caps text-[10px] uppercase ${product.badgeClass}`}>
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right: Product Specification & Order Form */}
          <div className="lg:col-span-5 flex flex-col space-y-space-lg">
            {/* Header: Origin & Title */}
            <div>
              <span className="font-label-caps text-[11px] uppercase tracking-widest text-outline block mb-1">
                {product.origin || 'KYOTO KILN • SHIGARAKI CLAY'}
              </span>
              <h1 className="font-editorial text-3xl md:text-4xl text-on-surface mb-2 font-normal leading-tight tracking-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 pt-1">
                <span className="font-editorial text-3xl font-medium text-on-surface">{product.price}</span>
                <span className="text-on-surface-variant font-body-sm text-xs">• {product.taxInfo || 'Tax Included'}</span>
              </div>
            </div>

            {/* Main Description */}
            <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
              {product.description}
            </p>

            {/* Finish & Clay Mineral Selection */}
            <div>
              <label className="font-label-caps text-xs uppercase tracking-wider text-on-surface font-semibold block mb-2">
                FINISH &amp; CLAY MINERAL: <span className="font-bold text-primary">{selectedFinish || (product.finishes && product.finishes[0])}</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {product.finishes &&
                  product.finishes.map((finish) => {
                    const isSelected = selectedFinish === finish || (!selectedFinish && finish === product.finishes[0]);
                    return (
                      <button
                        key={finish}
                        onClick={() => setSelectedFinish(finish)}
                        className={`px-4 py-2.5 rounded font-label-caps text-[11px] uppercase cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary text-on-primary font-bold shadow-xs'
                            : 'bg-surface-container-low border border-surface-variant text-on-surface-variant hover:text-on-surface hover:border-outline'
                        }`}
                      >
                        {finish}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Capacity Selection & Volumetric Guide */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-label-caps text-xs uppercase tracking-wider text-on-surface font-semibold">
                  CAPACITY: <span className="font-bold text-primary">{selectedCapacity || (product.capacities && product.capacities[1])}</span>
                </label>
                <button
                  onClick={() => setIsSizeModalOpen(true)}
                  className="font-label-caps text-[10px] uppercase text-secondary hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>VOLUMETRIC GUIDE</span>
                  <span className="text-xs">📏</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {product.capacities &&
                  product.capacities.map((cap) => {
                    const isSelected = selectedCapacity === cap || (!selectedCapacity && cap === product.capacities[1]);
                    return (
                      <button
                        key={cap}
                        onClick={() => setSelectedCapacity(cap)}
                        className={`px-4 py-2.5 rounded font-label-caps text-[11px] uppercase cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-surface-container-high border-2 border-primary text-primary font-bold'
                            : 'bg-surface-container-low border border-surface-variant text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {cap}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Quantity Selector & Add to Bag */}
            <div className="flex items-center gap-3 pt-space-sm">
              <div className="flex items-center border border-surface-variant rounded-lg h-12 bg-surface-container-low px-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-full flex items-center justify-center font-bold text-on-surface hover:text-primary cursor-pointer text-lg"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-full flex items-center justify-center font-bold text-on-surface hover:text-primary cursor-pointer text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 h-12 rounded-lg bg-primary text-on-primary font-label-caps text-xs uppercase tracking-widest hover:bg-secondary transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>ADD TO BAG — {totalPriceFormatted}</span>
              </button>
            </div>

            {/* Detailed Accordions: Craft & Provenance, Care & Preservation */}
            <div className="border-t border-surface-variant pt-space-md space-y-space-xs">
              {/* Craft & Provenance */}
              <div className="border-b border-surface-variant pb-space-xs">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'craft' ? '' : 'craft')}
                  className="w-full py-3 flex items-center justify-between font-subheading-md text-sm font-medium text-on-surface cursor-pointer text-left"
                >
                  <span className="font-semibold">Craft &amp; Provenance</span>
                  <span className="material-symbols-outlined text-base">
                    {activeAccordion === 'craft' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                  </span>
                </button>
                {activeAccordion === 'craft' && (
                  <p className="font-body-sm text-xs text-on-surface-variant pb-3 leading-relaxed">
                    {product.craftProvenance ||
                      'Crafted in Kyoto using 700-year-old Shigaraki unglazed stoneware techniques. Wood-fired for 3 days allowing natural mineral ashes to seal the porous clay.'}
                  </p>
                )}
              </div>

              {/* Care & Preservation */}
              <div className="border-b border-surface-variant pb-space-xs">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'care' ? '' : 'care')}
                  className="w-full py-3 flex items-center justify-between font-subheading-md text-sm font-medium text-on-surface cursor-pointer text-left"
                >
                  <span className="font-semibold">Care &amp; Preservation</span>
                  <span className="material-symbols-outlined text-base">
                    {activeAccordion === 'care' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                  </span>
                </button>
                {activeAccordion === 'care' && (
                  <p className="font-body-sm text-xs text-on-surface-variant pb-3 leading-relaxed">
                    {product.carePreservation ||
                      'Hand wash with warm water only. Avoid synthetic abrasive pads or harsh chemical detergents.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volumetric Size Guide Modal */}
      {isSizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile bg-primary/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-space-xl shadow-2xl border border-surface-variant">
            <div className="flex items-center justify-between pb-space-md border-b border-surface-variant mb-space-md">
              <h3 className="font-headline-sm uppercase text-on-surface">Volumetric Size Guide</h3>
              <button onClick={() => setIsSizeModalOpen(false)} className="p-1 text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            <div className="space-y-3 font-body-sm text-xs text-on-surface-variant">
              <p>• <strong>350ml (SOLO)</strong>: Perfect for 1-2 cups of quiet morning tea ritual.</p>
              <p>• <strong>500ml (DUO)</strong>: Ideal for 3-4 cups during afternoon tea sessions.</p>
              <p>• <strong>750ml (GATHERING)</strong>: Serves 5-6 guests during intimate gatherings.</p>
            </div>
            <button
              onClick={() => setIsSizeModalOpen(false)}
              className="w-full h-10 mt-space-lg rounded bg-primary text-on-primary font-label-md uppercase cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
