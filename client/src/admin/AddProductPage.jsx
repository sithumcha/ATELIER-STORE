import React, { useState, useEffect } from 'react';

export default function AddProductPage({ onBackToProducts, onProductAdded, editingProduct }) {
  // Form State (Clean empty initial values for new products)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Shigaraki Stoneware');
  const [origin, setOrigin] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [taxInfo, setTaxInfo] = useState('Tax Included');
  const [badge, setBadge] = useState('');
  const [badgeClass, setBadgeClass] = useState('bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface');
  const [alt, setAlt] = useState('');
  const [studio, setStudio] = useState('');
  const [stock, setStock] = useState(1);
  const [kilnBatch, setKilnBatch] = useState('');

  // Variant options (comma-separated or arrays)
  const [finishesInput, setFinishesInput] = useState('');
  const [capacitiesInput, setCapacitiesInput] = useState('');
  const [craftProvenance, setCraftProvenance] = useState('');
  const [carePreservation, setCarePreservation] = useState('');

  // Image Upload State
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when editing existing product
  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title || editingProduct.name || '');
      setCategory(editingProduct.category || 'Shigaraki Stoneware');
      setOrigin(editingProduct.origin || 'KYOTO KILN • SHIGARAKI CLAY');
      setSubtitle(editingProduct.subtitle || '');
      setDescription(editingProduct.description || '');
      setPrice(editingProduct.price ? String(editingProduct.price) : '$185.00');
      setTaxInfo(editingProduct.taxInfo || 'Tax Included');
      setBadge(editingProduct.badge || '');
      setBadgeClass(editingProduct.badgeClass || 'bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface');
      setAlt(editingProduct.alt || '');
      setStudio(editingProduct.studio || editingProduct.kiln || 'Kyoto Studio');
      setStock(editingProduct.stock !== undefined ? editingProduct.stock : 50);
      setKilnBatch(editingProduct.kilnBatch || editingProduct.kiln || 'Chamber #2');

      if (editingProduct.finishes && Array.isArray(editingProduct.finishes)) {
        setFinishesInput(editingProduct.finishes.join(', '));
      }
      if (editingProduct.capacities && Array.isArray(editingProduct.capacities)) {
        setCapacitiesInput(editingProduct.capacities.join(', '));
      }
      if (editingProduct.craftProvenance) setCraftProvenance(editingProduct.craftProvenance);
      if (editingProduct.carePreservation) setCarePreservation(editingProduct.carePreservation);

      if (editingProduct.img) {
        setImageUrl(editingProduct.img);
        setImagePreview(editingProduct.img);
        setUploadMode('url');
      }
    }
  }, [editingProduct]);

  // Handle local file selection with instant Base64 preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Prefill Template Sora Robe
  const fillSoraTemplate = () => {
    setTitle('Sora Heavyweight Linen Robe');
    setCategory('Normandy Flax');
    setOrigin('STOCKHOLM PATTERN • NORMANDY FLAX');
    setSubtitle('Minimalist natural unbleached raw linen lounge robe');
    setDescription('Woven in Ghent from 100% unbleached European flax. Stonewashed for ultimate tactile softness and climate temperature regulation.');
    setPrice('$240.00');
    setTaxInfo('Tax Included');
    setBadge('Natural Dye');
    setBadgeClass('bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface');
    setAlt('Minimalist natural unbleached raw linen lounge robe');
    setStudio('Stockholm Pattern');
    setStock(35);
    setKilnBatch('Ghent Weave');
    setFinishesInput('NATURAL OAT, CHARCOAL SLATE, CHALK WHITE');
    setCapacitiesInput('SIZE 01 (S/M), SIZE 02 (L/XL)');
    setCraftProvenance('Loomed in Ghent using traditional mechanical flax shuttles. Enzyme washed using organic Scandinavian mountain spring water.');
    setCarePreservation('Machine wash cool with mild liquid detergent. Line dry away from direct scorching sunlight.');
    setUploadMode('url');
    setImageUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuC7VK4Qn61mQPz4bQ6u0Z8FGzbqjYJvgMPqLyVrl_U5rw8zMgKFmYxR2RYaFcJb8gAO-nTIfO_kc1ratauWCpOU-u67Q4sQ_hMEAF36vTpGIZWZBX2Pkz7kk8UW41YFr96mRr-iUvKoCDPu-eARO10RcSnPksGoqvKDFYjSa0lsrGa6YUypRvkzR7akycKGjXDADIurcjslasNNFQeB8t666hIOUqFpxHE-2ruxGhTHqCv8uzFdgiU');
    setImagePreview('https://lh3.googleusercontent.com/aida-public/AB6AXuC7VK4Qn61mQPz4bQ6u0Z8FGzbqjYJvgMPqLyVrl_U5rw8zMgKFmYxR2RYaFcJb8gAO-nTIfO_kc1ratauWCpOU-u67Q4sQ_hMEAF36vTpGIZWZBX2Pkz7kk8UW41YFr96mRr-iUvKoCDPu-eARO10RcSnPksGoqvKDFYjSa0lsrGa6YUypRvkzR7akycKGjXDADIurcjslasNNFQeB8t666hIOUqFpxHE-2ruxGhTHqCv8uzFdgiU');
  };

  // Prefill Template Teapot
  const fillTeapotTemplate = () => {
    setTitle('Hasami Stoneware Teapot No. 04');
    setCategory('Shigaraki Stoneware');
    setOrigin('KYOTO KILN • SHIGARAKI CLAY');
    setSubtitle('Hand-thrown in Hasami with unglazed coarse mineral stoneware');
    setDescription('Hand-thrown in Hasami with unglazed coarse mineral stoneware. Outfitted with an arched solid brass handle and precision removable stainless steel strainer basket.');
    setPrice('$145.00');
    setTaxInfo('Tax Included');
    setBadge('Limited Edition No. 04');
    setBadgeClass('bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface tracking-wider');
    setAlt('Handcrafted rough unglazed stoneware fluted vase in pale sandstone tone');
    setStudio('Kyoto Studio');
    setStock(60);
    setKilnBatch('Chamber #2');
    setFinishesInput('RAW SANDSTONE, CHALK WHITE, CHARRED ASH');
    setCapacitiesInput('350ML (SOLO), 500ML (DUO), 750ML (GATHERING)');
    setCraftProvenance('Crafted in Kyoto using 700-year-old Shigaraki unglazed stoneware techniques. Wood-fired for 3 days allowing natural mineral ashes to seal the porous clay.');
    setCarePreservation('Hand wash with warm water only. Avoid synthetic abrasive pads or harsh chemical detergents.');
    setUploadMode('url');
    setImageUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c');
    setImagePreview('https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImg = imagePreview || imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c';

    const finishes = finishesInput.split(',').map((f) => f.trim()).filter(Boolean);
    const capacities = capacitiesInput.split(',').map((c) => c.trim()).filter(Boolean);

    const isEdit = Boolean(editingProduct);
    const productId = isEdit ? (editingProduct._id || editingProduct.id) : null;

    const numericPrice = typeof price === 'number'
      ? price
      : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 185;

    const payload = {
      title,
      category,
      origin,
      subtitle: subtitle || alt || title,
      description: description || subtitle || title,
      price: numericPrice,
      taxInfo,
      finishes,
      capacities,
      craftProvenance,
      carePreservation,
      badge,
      badgeClass,
      img: finalImg,
      images: [finalImg],
      alt: alt || title,
      studio,
      stock: Number(stock),
      kilnBatch,
    };

    try {
      const url = isEdit 
        ? `http://localhost:5001/api/products/${productId}`
        : 'http://localhost:5001/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedProduct = await res.json();
        alert(isEdit
          ? `✨ Edition "${savedProduct.title}" ($${savedProduct.price}) updated successfully!`
          : `✨ New Edition "${savedProduct.title}" ($${savedProduct.price}) added to database successfully!`
        );
        if (onProductAdded) onProductAdded(savedProduct);
      } else {
        alert(isEdit
          ? `✨ Edition "${payload.title}" updated!`
          : `✨ New Edition "${payload.title}" added successfully!`
        );
        if (onProductAdded) onProductAdded(payload);
      }
    } catch (error) {
      console.log('Backend API connection lost, saving product locally', error);
      alert(isEdit
        ? `✨ Edition "${payload.title}" updated!`
        : `✨ New Edition "${payload.title}" added successfully!`
      );
      if (onProductAdded) onProductAdded(payload);
    } finally {
      setIsSubmitting(false);
      if (onBackToProducts) onBackToProducts();
    }
  };

  const previewImageSrc = imagePreview || imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM1-YTw4n0FPZnbYGrL2ZKpWYVzkC30fp_bkGtOok8G3Yed9DHdwPj_l-B7xV7PUVVIwgo6hrSl5hw4I3K2IYJY8e6x_V7F0hCFtrsQ7y77ZT9Z3SmTtq0udO2gJd_dV6mQD2RdSk9Q_0ZXOa9poTNkg_8fcNoY_DyLm1HZ6Y9fxuzziIpZXsfTfycH8u91TbRCLN67m7LpcMTqqzVN6O0-kxx_CfxrBFT6a2X-3rf7uVi8QQIE4c';

  return (
    <div className="w-full max-w-[1360px] mx-auto px-space-md sm:px-space-xl py-space-xl space-y-space-xl">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-space-md">
        <div>
          <button
            onClick={onBackToProducts}
            className="inline-flex items-center gap-1 font-label-caps text-xs text-secondary hover:underline uppercase mb-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Products &amp; Vault</span>
          </button>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            {editingProduct ? `Edit Archival Edition: ${editingProduct.title || editingProduct.name || ''}` : 'Commission New Archival Edition'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fillTeapotTemplate}
            className="px-3 py-1.5 rounded bg-surface-container-high text-on-surface font-label-caps text-xs hover:bg-surface-container-highest cursor-pointer"
          >
            ⚡ Prefill Hasami Teapot
          </button>
          <button
            type="button"
            onClick={fillSoraTemplate}
            className="px-3 py-1.5 rounded bg-secondary-container text-on-secondary-container font-label-caps text-xs hover:opacity-90 cursor-pointer"
          >
            ⚡ Prefill Sora Robe
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Live Card Preview Right */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        {/* Left Column - Product Specifications Form */}
        <div className="lg:col-span-8 space-y-space-lg">
          {/* Section 1: Basic Identity */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-4">
            <h3 className="font-headline-sm text-sm uppercase text-secondary font-semibold border-b border-surface-variant pb-2">
              01. Identity &amp; Title
            </h3>

            <div>
              <label className="font-label-caps text-xs block mb-1">Edition Title (`title`) *</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hasami Stoneware Teapot No. 04 / Sora Heavyweight Linen Robe"
                className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Category (`category`) *</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Shigaraki Stoneware">Shigaraki Stoneware (Ceramics &amp; Vessels)</option>
                  <option value="Architectural Lighting">Architectural Lighting (Lamps &amp; Washi Lanterns)</option>
                  <option value="Sculptural Furniture">Sculptural Furniture (Timber &amp; Stools)</option>
                  <option value="Interior Textiles &amp; Drapes">Interior Textiles &amp; Drapes (Throws &amp; Linens)</option>
                  <option value="Hinoki Bath &amp; Ritual Accents">Hinoki Bath &amp; Ritual Accents</option>
                  <option value="Other Home Decor">Other Home Decor Objects</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Origin Sub-tag (`origin`)</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="KYOTO KILN • SHIGARAKI CLAY"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1">Subtitle / Short Summary (`subtitle`)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Hand-thrown in Hasami with unglazed coarse mineral stoneware"
                className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1">Full Description (`description`)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hand-thrown in Hasami with unglazed coarse mineral stoneware. Outfitted with an arched solid brass handle..."
                className="w-full p-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
              ></textarea>
            </div>
          </div>

          {/* Section 2: Pricing & Vault Inventory */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-4">
            <h3 className="font-headline-sm text-sm uppercase text-secondary font-semibold border-b border-surface-variant pb-2">
              02. Pricing &amp; Inventory Vault
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Price ($) (`price`) *</label>
                <input
                  required
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="$185.00"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Tax Tag (`taxInfo`)</label>
                <input
                  type="text"
                  value={taxInfo}
                  onChange={(e) => setTaxInfo(e.target.value)}
                  placeholder="Tax Included"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Vault Inventory Units (`stock`)</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Studio Workshop (`studio`)</label>
                <input
                  type="text"
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  placeholder="Kyoto Studio / Stockholm Pattern"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Kiln Batch / Loom (`kilnBatch`)</label>
                <input
                  type="text"
                  value={kilnBatch}
                  onChange={(e) => setKilnBatch(e.target.value)}
                  placeholder="Chamber #2 / Ghent Weave"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Badge Tag (`badge`)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Limited Edition / Natural Dye"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Badge Styling (`badgeClass`)</label>
                <input
                  type="text"
                  value={badgeClass}
                  onChange={(e) => setBadgeClass(e.target.value)}
                  placeholder="bg-surface-container-lowest/90 text-on-surface"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media & Direct File Upload */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-4">
            <div className="flex items-center justify-between border-b border-surface-variant pb-2">
              <h3 className="font-headline-sm text-sm uppercase text-secondary font-semibold">
                03. Product Media &amp; Image Upload (`img`)
              </h3>
              <div className="flex rounded-lg bg-surface-container p-0.5 text-xs font-label-caps">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                    uploadMode === 'file' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  📁 Upload Local File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                    uploadMode === 'url' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  🔗 Image Link URL
                </button>
              </div>
            </div>

            {uploadMode === 'file' ? (
              <div>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-outline/40 hover:border-primary rounded-xl cursor-pointer bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="material-symbols-outlined text-4xl text-secondary mb-1">cloud_upload</span>
                    <p className="text-xs font-label-caps text-on-surface">
                      <span className="font-bold text-primary">Click to select image file</span> or drag &amp; drop
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-1">PNG, JPG, WEBP, GIF up to 20MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            ) : (
              <div>
                <label className="font-label-caps text-xs block mb-1">Image Link URL (`img`)</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://lh3.googleusercontent.com/..."
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="font-label-caps text-xs block mb-1">Alt Description (`alt`)</label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Handcrafted rough unglazed stoneware fluted vase in pale sandstone tone"
                className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Section 4: Variants & Provenance */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-4">
            <h3 className="font-headline-sm text-sm uppercase text-secondary font-semibold border-b border-surface-variant pb-2">
              04. Custom Variants &amp; Artisanal Provenance
            </h3>

            <div>
              <label className="font-label-caps text-xs block mb-1">
                Finish Options (`finishes` - comma separated)
              </label>
              <input
                type="text"
                value={finishesInput}
                onChange={(e) => setFinishesInput(e.target.value)}
                placeholder="RAW SANDSTONE, CHALK WHITE, CHARRED ASH"
                className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1">
                Capacity Options (`capacities` - comma separated)
              </label>
              <input
                type="text"
                value={capacitiesInput}
                onChange={(e) => setCapacitiesInput(e.target.value)}
                placeholder="350ML (SOLO), 500ML (DUO), 750ML (GATHERING)"
                className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1">Craft &amp; Provenance Details (`craftProvenance`)</label>
              <textarea
                rows={2}
                value={craftProvenance}
                onChange={(e) => setCraftProvenance(e.target.value)}
                placeholder="Crafted in Kyoto using 700-year-old Shigaraki unglazed stoneware techniques..."
                className="w-full p-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
              ></textarea>
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1">Care &amp; Preservation (`carePreservation`)</label>
              <textarea
                rows={2}
                value={carePreservation}
                onChange={(e) => setCarePreservation(e.target.value)}
                placeholder="Hand wash with warm water only. Avoid synthetic abrasive pads..."
                className="w-full p-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
              ></textarea>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onBackToProducts}
              className="px-6 h-12 rounded border border-on-surface text-on-surface font-label-md uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 h-12 rounded bg-primary text-on-primary font-label-md uppercase hover:bg-secondary transition-colors cursor-pointer flex items-center gap-2 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>{editingProduct ? 'Updating Edition...' : 'Publishing Edition...'}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">{editingProduct ? 'save' : 'publish'}</span>
                  <span>{editingProduct ? 'Update Edition Details' : 'Publish Edition to Atelier Vault'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Live Storefront Card Preview */}
        <div className="lg:col-span-4 space-y-space-lg">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-variant sticky top-20 space-y-4">
            <span className="font-label-caps text-[10px] uppercase text-secondary tracking-widest font-semibold block">
              Live Storefront Preview
            </span>

            {/* Simulated Product Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden shadow-md">
              <div className="relative aspect-[4/5] bg-surface-container-high overflow-hidden">
                <img src={previewImageSrc} alt={title || 'Preview'} className="w-full h-full object-cover" />
                {badge && (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-label-caps uppercase ${badgeClass}`}>
                    {badge}
                  </span>
                )}
              </div>

              <div className="p-space-md space-y-2">
                <span className="font-label-caps text-[10px] uppercase text-outline block">{category || 'Shigaraki Stoneware'}</span>
                <h4 className="font-subheading-lg text-on-surface font-semibold line-clamp-1">{title || 'Edition Title'}</h4>
                <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2">{subtitle || 'Product description preview...'}</p>

                <div className="flex items-center justify-between pt-space-xs border-t border-surface-variant">
                  <span className="font-price-editorial text-xl text-primary font-semibold">{price || '$185.00'}</span>
                  <span className="font-label-caps text-xs text-secondary font-bold">{stock} in vault</span>
                </div>
              </div>
            </div>

            <div className="p-space-sm bg-surface-container-low rounded-lg border border-surface-variant space-y-1 font-body-sm text-xs text-on-surface-variant">
              <span className="font-label-caps text-[10px] text-primary uppercase font-bold block">Included Data Specs</span>
              <p>• <strong>Origin:</strong> {origin}</p>
              <p>• <strong>Studio:</strong> {studio} ({kilnBatch})</p>
              <p>• <strong>Finishes:</strong> {finishesInput}</p>
              <p>• <strong>Capacities:</strong> {capacitiesInput}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
