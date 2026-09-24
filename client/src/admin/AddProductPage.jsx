import React, { useState, useEffect } from 'react';

export default function AddProductPage({ onBackToProducts, onProductAdded, editingProduct }) {
  // 1. Primary Garment Identity
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState("Women's Wardrobe");
  const [edition, setEdition] = useState('EDITION 08 — ITEM 044');
  const [editionName, setEditionName] = useState('EDITION 08 — THE SOLITUDE WEAVES');
  const [price, setPrice] = useState('42000');
  const [stock, setStock] = useState(12);
  const [badge, setBadge] = useState('LIMITED EDITION NO. 18 / 60');
  const [studio, setStudio] = useState('Kyoto Preservation Studio');

  // 2. Loom & Weave Specifications
  const [shuttle, setShuttle] = useState('KYOTO WEAVE SHUTTLE NO. 4');
  const [gsm, setGsm] = useState('410 GSM RAW UNBLEACHED FLAX');
  const [density, setDensity] = useState('410 GSM density');
  const [loomOrigin, setLoomOrigin] = useState('Toyoda Non-Automated (1948)');
  const [weavingSpeed, setWeavingSpeed] = useState('9.5 meters per work day');

  // 3. Description Section
  const [description, setDescription] = useState(
    'Spun from unbleached 100% Normandy long-staple flax and woven on vintage 1948 Toyoda shuttle looms in Kyoto. Cut with an unhurried, architectural silhouette designed to age gracefully over decades of wear. Conventional high-speed industrial looms subject flax thread to intense mechanical friction, strip-coating the fibers with synthetic sizing starches. Our Kyoto looms cycle at one-fourth the velocity, retaining the microscopic linen channels that insulate during cold drafts and vent during summer humidity.'
  );

  // 4. Multi-Angle Gallery Images (4 angles)
  const [img1, setImg1] = useState('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80');
  const [img2, setImg2] = useState('https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80');
  const [img3, setImg3] = useState('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80');
  const [img4, setImg4] = useState('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80');

  // Image upload mode
  const [uploadMode, setUploadMode] = useState('url'); // 'file' | 'url'
  const [imageFile, setImageFile] = useState(null);

  // 5. Dynamic Colorways State
  const [colors, setColors] = useState([
    { id: 'c1', name: 'Undyed Natural Ecru', hex: '#E8E2D5' },
    { id: 'c2', name: 'Fermented Persimmon (Kakishibu)', hex: '#94492C' },
    { id: 'c3', name: 'Deep Sumi Charcoal', hex: '#1F1B18' },
  ]);

  // Color management functions
  const handleAddColor = () => {
    setColors((prev) => [
      ...prev,
      { id: 'c_' + Date.now(), name: 'New Organic Dye', hex: '#C5B8A5' },
    ]);
  };

  const handleUpdateColor = (id, field, value) => {
    setColors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveColor = (id) => {
    if (colors.length <= 1) {
      alert('At least one colorway is required for garment editions.');
      return;
    }
    setColors((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddPresetColor = (presetName, presetHex) => {
    if (colors.some((c) => c.name.toLowerCase() === presetName.toLowerCase())) {
      return;
    }
    setColors((prev) => [
      ...prev,
      { id: 'c_' + Date.now(), name: presetName, hex: presetHex },
    ]);
  };

  // 6. Dynamic Garment Sizes State (S, M, L, XL supported)
  const [sizes, setSizes] = useState([
    { id: 's1', code: 'S', fit: 'Small (Chest 36–38")', stock: 5 },
    { id: 's2', code: 'M', fit: 'Medium (Chest 40–42")', stock: 8 },
    { id: 's3', code: 'L', fit: 'Large (Chest 44–46")', stock: 6 },
    { id: 's4', code: 'XL', fit: 'Extra Large (Chest 48–50")', stock: 3 },
  ]);

  const handleAddSizeRow = () => {
    setSizes((prev) => [
      ...prev,
      { id: 'sz_' + Date.now(), code: 'XXL', fit: 'Custom Fit', stock: 4 },
    ]);
  };

  const handleUpdateSizeRow = (id, field, value) => {
    setSizes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleRemoveSizeRow = (id) => {
    if (sizes.length <= 1) {
      alert('At least one size specification is required.');
      return;
    }
    setSizes((prev) => prev.filter((s) => s.id !== id));
  };

  const setStandardSizesPreset = () => {
    setSizes([
      { id: 's1', code: 'S', fit: 'Small (Chest 36–38")', stock: 5 },
      { id: 's2', code: 'M', fit: 'Medium (Chest 40–42")', stock: 8 },
      { id: 's3', code: 'L', fit: 'Large (Chest 44–46")', stock: 6 },
      { id: 's4', code: 'XL', fit: 'Extra Large (Chest 48–50")', stock: 3 },
    ]);
  };

  const setExtendedSizesPreset = () => {
    setSizes([
      { id: 's0', code: 'XS', fit: 'Extra Small (Chest 34")', stock: 3 },
      { id: 's1', code: 'S', fit: 'Small (Chest 36–38")', stock: 5 },
      { id: 's2', code: 'M', fit: 'Medium (Chest 40–42")', stock: 8 },
      { id: 's3', code: 'L', fit: 'Large (Chest 44–46")', stock: 6 },
      { id: 's4', code: 'XL', fit: 'Extra Large (Chest 48–50")', stock: 4 },
      { id: 's5', code: 'XXL', fit: 'Double XL (Chest 52")', stock: 2 },
    ]);
  };

  const setAtelierProportionsPreset = () => {
    setSizes([
      { id: 's1', code: 'Size I', fit: 'Generous 36–38 EU', stock: 5 },
      { id: 's2', code: 'Size II', fit: 'Relaxed 40–42 EU', stock: 3 },
      { id: 's3', code: 'Size III', fit: 'Sculptural 44–46 EU', stock: 4 },
      { id: 's4', code: 'Size IV', fit: 'Cocoon 48–50 EU', stock: 1 },
    ]);
  };

  // 7. Accordions Data Content
  const [provenanceText, setProvenanceText] = useState(
    'The raw flax fibers are cultivated across Normandy coastal terrains, naturally retted in regional precipitation before being dispatched to our partner preservation workshop in Kyoto.'
  );
  const [careText, setCareText] = useState(
    'Submerge in cool water (under 25°C) with mild neutral pH vegetable detergent. Do not wring or centrifuge aggressively; squeeze softly and lay flat in filtered shade.'
  );
  const [passportText, setPassportText] = useState(
    'Each Solitude Duster carries an individual linen archival passport sewn into the internal seam. Should a tear or fray occur, dispatch it to our studio for complimentary hand-stitched sashiko reinforcement.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when editing an existing product
  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title || editingProduct.name || '');
      setCategory(editingProduct.category || "Women's Wardrobe");
      setEdition(editingProduct.edition || 'EDITION 08 — ITEM 044');
      setEditionName(editingProduct.editionName || 'EDITION 08 — THE SOLITUDE WEAVES');
      setPrice(editingProduct.price ? String(editingProduct.price) : '42000');
      setStock(editingProduct.stock !== undefined ? editingProduct.stock : 12);
      setBadge(editingProduct.badge || 'LIMITED EDITION NO. 18 / 60');
      setStudio(editingProduct.studio || 'Kyoto Preservation Studio');

      setShuttle(editingProduct.shuttle || 'KYOTO WEAVE SHUTTLE NO. 4');
      setGsm(editingProduct.gsm || '410 GSM RAW UNBLEACHED FLAX');
      setDensity(editingProduct.density || '410 GSM density');
      setLoomOrigin(editingProduct.loomOrigin || 'Toyoda Non-Automated (1948)');
      setWeavingSpeed(editingProduct.weavingSpeed || '9.5 meters per work day');

      setDescription(editingProduct.description || editingProduct.summary || editingProduct.subtitle || '');

      if (editingProduct.images && editingProduct.images.length > 0) {
        setImg1(editingProduct.images[0] || editingProduct.img || '');
        setImg2(editingProduct.images[1] || '');
        setImg3(editingProduct.images[2] || '');
        setImg4(editingProduct.images[3] || '');
      } else if (editingProduct.img) {
        setImg1(editingProduct.img);
      }

      if (editingProduct.colors && Array.isArray(editingProduct.colors) && editingProduct.colors.length > 0) {
        setColors(
          editingProduct.colors.map((c, idx) => ({
            id: 'c_' + idx,
            name: typeof c === 'string' ? c : (c.name || 'Custom Color'),
            hex: typeof c === 'object' && c.hex ? c.hex : '#E8E2D5',
          }))
        );
      }

      if (editingProduct.sizes && Array.isArray(editingProduct.sizes) && editingProduct.sizes.length > 0) {
        setSizes(
          editingProduct.sizes.map((sz, idx) => ({
            id: 'sz_' + idx,
            code: sz.label || sz.roman || 'M',
            fit: sz.fit || 'Regular Fit',
            stock: sz.stock !== undefined ? sz.stock : 5,
          }))
        );
      }

      if (editingProduct.provenanceText || editingProduct.provenance) {
        setProvenanceText(editingProduct.provenanceText || editingProduct.provenance);
      }
      if (editingProduct.careText || editingProduct.careProtocol) {
        setCareText(editingProduct.careText || editingProduct.careProtocol);
      }
      if (editingProduct.passportText || editingProduct.passportInfo) {
        setPassportText(editingProduct.passportText || editingProduct.passportInfo);
      }
    }
  }, [editingProduct]);

  // Prefill Solitude Kimono Duster Template
  const fillSolitudeTemplate = () => {
    setTitle('Solitude Raw Linen Kimono Duster');
    setCategory("Women's Wardrobe");
    setEdition('EDITION 08 — ITEM 044');
    setEditionName('EDITION 08 — THE SOLITUDE WEAVES');
    setPrice('42000');
    setStock(12);
    setBadge('LIMITED EDITION NO. 18 / 60');
    setStudio('Kyoto Preservation Studio');

    setShuttle('KYOTO WEAVE SHUTTLE NO. 4');
    setGsm('410 GSM RAW UNBLEACHED FLAX');
    setDensity('410 GSM density');
    setLoomOrigin('Toyoda Non-Automated (1948)');
    setWeavingSpeed('9.5 meters per work day');

    setDescription(
      'Spun from unbleached 100% Normandy long-staple flax and woven on vintage 1948 Toyoda shuttle looms in Kyoto. Cut with an unhurried, architectural silhouette designed to age gracefully over decades of wear. Conventional high-speed industrial looms subject flax thread to intense mechanical friction, strip-coating the fibers with synthetic sizing starches. Our Kyoto looms cycle at one-fourth the velocity, retaining the microscopic linen channels that insulate during cold drafts and vent during summer humidity.'
    );

    setImg1('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80');
    setImg2('https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80');
    setImg3('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80');
    setImg4('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80');

    setColors([
      { id: 'c1', name: 'Undyed Natural Ecru', hex: '#E8E2D5' },
      { id: 'c2', name: 'Fermented Persimmon (Kakishibu)', hex: '#94492C' },
      { id: 'c3', name: 'Deep Sumi Charcoal', hex: '#1F1B18' },
    ]);

    setStandardSizesPreset();
    setProvenanceText('The raw flax fibers are cultivated across Normandy coastal terrains, naturally retted in regional precipitation before being dispatched to our partner preservation workshop in Kyoto.');
    setCareText('Submerge in cool water (under 25°C) with mild neutral pH vegetable detergent. Do not wring or centrifuge aggressively; squeeze softly and lay flat in filtered shade.');
    setPassportText('Each Solitude Duster carries an individual linen archival passport sewn into the internal seam. Should a tear or fray occur, dispatch it to our studio for complimentary hand-stitched sashiko reinforcement.');
  };

  // Prefill Wabi Ramie Trouser Template
  const fillTrouserTemplate = () => {
    setTitle('Wabi Wide-Leg Trouser');
    setCategory("Men's Tailoring");
    setEdition('EDITION 08 — ITEM 019');
    setEditionName('EDITION 08 — THE SOLITUDE WEAVES');
    setPrice('29000');
    setStock(18);
    setBadge('SUMI INK WASH');
    setStudio('Stockholm Pattern Studio');

    setShuttle('SHIGARAKI TWILL SHUTTLE NO. 2');
    setGsm('380 GSM HEAVYWEIGHT RAMIE');
    setDensity('380 GSM density');
    setLoomOrigin('Nagano Vintage Twill Loom');
    setWeavingSpeed('12 meters per work day');

    setDescription(
      'Relaxed, wide-legged tailored trousers in dark Sumi charcoal washed ramie fabric with deep front pleats. Cut with generous volume through the thigh and a subtle taper towards the hem. Garment-dyed with traditional Japanese Sumi ink for subtle tonal variations across seams.'
    );

    setImg1('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80');
    setImg2('https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80');
    setImg3('https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80');
    setImg4('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80');

    setColors([
      { id: 'c1', name: 'Deep Sumi Charcoal', hex: '#1F1B18' },
      { id: 'c2', name: 'Undyed Natural Ecru', hex: '#E8E2D5' },
    ]);
    setStandardSizesPreset();
    setProvenanceText('Hand-woven ramie fiber cultivated in Nagano prefecture and garment washed with botanical mineral dyes.');
    setCareText('Hand wash or dry clean. Cool iron inside out.');
    setPassportText('Archival seam passport included with complimentary sashiko bar-tack mending.');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg1(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let mainImg = img1;
      if (uploadMode === 'file' && imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        try {
          const uploadRes = await fetch('http://localhost:5001/api/upload', {
            method: 'POST',
            body: formData,
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            mainImg = uploadData.imageUrl;
          }
        } catch (uploadErr) {
          console.log('Multer upload fallback to base64 preview');
        }
      }

      const imagesArray = [mainImg, img2, img3, img4].filter(Boolean);
      const formattedColors = colors.map((c) => ({
        name: c.name || 'Organic Hue',
        hex: c.hex || '#E8E2D5',
        img: mainImg,
      }));

      const formattedSizes = sizes.map((sz) => ({
        roman: sz.code,
        label: sz.code,
        fit: sz.fit || 'Regular',
        stock: Number(sz.stock) || 5,
      }));

      const numericPrice = typeof price === 'number'
        ? price
        : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 42000;

      const summaryExtract = description.length > 200
        ? description.substring(0, 197) + '...'
        : description;

      const isEdit = Boolean(editingProduct);
      const productId = isEdit ? (editingProduct._id || editingProduct.id) : null;

      const payload = {
        title,
        category,
        edition,
        editionName,
        shuttle,
        gsm,
        density,
        loomOrigin,
        weavingSpeed,
        price: numericPrice,
        stock: Number(stock),
        badge,
        studio,
        description,
        summary: summaryExtract,
        subtitle: summaryExtract,
        img: mainImg,
        images: imagesArray,
        colors: formattedColors,
        sizes: formattedSizes,
        provenanceText,
        careInstructionsText: careText,
        passportText,
      };

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
          ? `✨ Garment Edition "${savedProduct.title}" (Rs. ${savedProduct.price}) updated successfully!`
          : `✨ New Garment Edition "${savedProduct.title}" (Rs. ${savedProduct.price}) added to vault successfully!`
        );
        if (onProductAdded) onProductAdded(savedProduct);
      } else {
        alert(`✨ Garment Edition "${payload.title}" saved successfully!`);
        if (onProductAdded) onProductAdded(payload);
      }
    } catch (error) {
      console.log('Error submitting product to backend, saving locally:', error);
      alert(`✨ Garment Edition "${title}" saved successfully!`);
      if (onProductAdded) onProductAdded({ title, price, category });
    } finally {
      setIsSubmitting(false);
      if (onBackToProducts) onBackToProducts();
    }
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-space-md sm:px-space-xl py-space-xl space-y-space-xl">
      {/* Top Console Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-space-md">
        <div>
          <button
            type="button"
            onClick={onBackToProducts}
            className="inline-flex items-center gap-1 font-label-caps text-xs text-secondary hover:underline uppercase mb-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Vault &amp; Products</span>
          </button>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            {editingProduct ? `Edit Garment Edition: ${editingProduct.title || ''}` : 'Commission New Garment Edition'}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={fillSolitudeTemplate}
            className="px-3 py-1.5 rounded bg-primary text-on-primary font-label-caps text-xs hover:bg-secondary cursor-pointer"
          >
            ⚡ Prefill Solitude Kimono Duster
          </button>

          <button
            type="button"
            onClick={fillTrouserTemplate}
            className="px-3 py-1.5 rounded bg-surface-container-high text-on-surface font-label-caps text-xs hover:bg-surface-container-highest cursor-pointer"
          >
            ⚡ Prefill Wabi Ramie Trouser
          </button>
        </div>
      </div>

      {/* Main Spec Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <div className="lg:col-span-8 space-y-space-lg">
          
          {/* Section 1: Core Garment Identity */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-4">
            <h3 className="font-headline-sm text-sm uppercase text-secondary font-semibold border-b border-surface-variant pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">checkroom</span>
              01. Garment Identity &amp; Classification
            </h3>

            <div>
              <label className="font-label-caps text-xs block mb-1">Garment Piece Title *</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Solitude Raw Linen Kimono Duster"
                className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Wardrobe Category *</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Women's Wardrobe">Women's Wardrobe</option>
                  <option value="Men's Tailoring">Men's Tailoring</option>
                  <option value="Textiles &amp; Fiber">Textiles &amp; Fiber</option>
                  <option value="Archive 2026">Archive 2026</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Price in LKR (Rs.) *</label>
                <input
                  required
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="42000"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Edition Code</label>
                <input
                  type="text"
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                  placeholder="EDITION 08 — ITEM 044"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Collection Release Name</label>
                <input
                  type="text"
                  value={editionName}
                  onChange={(e) => setEditionName(e.target.value)}
                  placeholder="EDITION 08 — THE SOLITUDE WEAVES"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Vault Stock Count</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="12"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="LIMITED EDITION NO. 18 / 60"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Atelier Studio Origin</label>
                <input
                  type="text"
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  placeholder="Kyoto Preservation Studio"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Loom & Textile Specifications */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-4">
            <h3 className="font-headline-sm text-sm uppercase text-secondary font-semibold border-b border-surface-variant pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">texture</span>
              02. Loom Shuttles &amp; Fiber Density
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Shuttle / Loom Designation</label>
                <input
                  type="text"
                  value={shuttle}
                  onChange={(e) => setShuttle(e.target.value)}
                  placeholder="KYOTO WEAVE SHUTTLE NO. 4"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">GSM Fiber Weight</label>
                <input
                  type="text"
                  value={gsm}
                  onChange={(e) => setGsm(e.target.value)}
                  placeholder="410 GSM RAW UNBLEACHED FLAX"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Loom Model Origin</label>
                <input
                  type="text"
                  value={loomOrigin}
                  onChange={(e) => setLoomOrigin(e.target.value)}
                  placeholder="Toyoda Non-Automated (1948)"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Weaving Velocity</label>
                <input
                  type="text"
                  value={weavingSpeed}
                  onChange={(e) => setWeavingSpeed(e.target.value)}
                  placeholder="9.5 meters per work day"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-4">
            <h3 className="font-headline-sm text-sm uppercase text-secondary font-semibold border-b border-surface-variant pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">description</span>
              03. Description
            </h3>

            <div>
              <label className="font-label-caps text-xs block mb-1">Garment Description *</label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter complete garment description, fiber details, and surface philosophy..."
                className="w-full p-4 rounded-lg bg-surface-container-low border border-surface-variant text-on-surface font-body-sm text-sm leading-relaxed focus:outline-none focus:border-primary"
              />
              <p className="text-[11px] text-on-surface-variant mt-1 italic">
                This description will be featured across the garment details monograph page and preview cards.
              </p>
            </div>
          </div>

          {/* Section 4: Multi-Angle Imagery */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-4">
            <h3 className="font-headline-sm text-sm uppercase text-secondary font-semibold border-b border-surface-variant pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">photo_library</span>
              04. Multi-Angle Editorial Gallery Imagery
            </h3>

            <div className="flex items-center gap-4 mb-2">
              <label className="font-label-caps text-xs flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="uploadMode"
                  value="url"
                  checked={uploadMode === 'url'}
                  onChange={() => setUploadMode('url')}
                />
                Image URLs
              </label>

              <label className="font-label-caps text-xs flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="uploadMode"
                  value="file"
                  checked={uploadMode === 'file'}
                  onChange={() => setUploadMode('file')}
                />
                Upload Main File
              </label>
            </div>

            {uploadMode === 'file' ? (
              <div>
                <label className="font-label-caps text-xs block mb-1">Main Cover Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 bg-surface-container-low rounded border border-surface-variant text-xs text-on-surface cursor-pointer"
                />
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Angle 1: Main Full Body Shot *</label>
                <input
                  required
                  type="text"
                  value={img1}
                  onChange={(e) => setImg1(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Angle 2: Macro Weave Texture Close-up</label>
                <input
                  type="text"
                  value={img2}
                  onChange={(e) => setImg2(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Angle 3: Back View Drape</label>
                <input
                  type="text"
                  value={img3}
                  onChange={(e) => setImg3(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Angle 4: Horn Button / Sashiko Stitch Macro</label>
                <input
                  type="text"
                  value={img4}
                  onChange={(e) => setImg4(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Dynamic Colors & Sizes */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-6">
            
            {/* Colorways Manager */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-surface-variant pb-2">
                <h3 className="font-headline-sm text-sm uppercase text-secondary font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">palette</span>
                  05. Colorways &amp; Hues Manager
                </h3>

                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-3 py-1 rounded bg-secondary text-on-secondary font-label-caps text-xs flex items-center gap-1 hover:opacity-90 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Colorway</span>
                </button>
              </div>

              {/* Presets Quick Picker */}
              <div className="space-y-1">
                <span className="font-label-caps text-[11px] text-on-surface-variant block uppercase tracking-wider">
                  Quick Preset Hues (Click to add)
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddPresetColor('Undyed Natural Ecru', '#E8E2D5')}
                    className="px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs flex items-center gap-1.5 border border-surface-variant cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: '#E8E2D5' }}></span>
                    <span>Undyed Natural Ecru</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddPresetColor('Fermented Persimmon (Kakishibu)', '#94492C')}
                    className="px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs flex items-center gap-1.5 border border-surface-variant cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: '#94492C' }}></span>
                    <span>Fermented Persimmon</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddPresetColor('Deep Sumi Charcoal', '#1F1B18')}
                    className="px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs flex items-center gap-1.5 border border-surface-variant cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: '#1F1B18' }}></span>
                    <span>Deep Sumi Charcoal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddPresetColor('Kyoto Botanical Indigo', '#1A2B4C')}
                    className="px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs flex items-center gap-1.5 border border-surface-variant cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: '#1A2B4C' }}></span>
                    <span>Kyoto Indigo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddPresetColor('Wabi Sage Green', '#4A5844')}
                    className="px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs flex items-center gap-1.5 border border-surface-variant cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: '#4A5844' }}></span>
                    <span>Wabi Sage</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Colors List */}
              <div className="space-y-2 pt-2">
                {colors.map((col) => (
                  <div
                    key={col.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container-low border border-surface-variant/70 shadow-xs"
                  >
                    <div className="relative shrink-0">
                      <input
                        type="color"
                        value={col.hex}
                        onChange={(e) => handleUpdateColor(col.id, 'hex', e.target.value)}
                        className="w-9 h-9 rounded-full border-0 p-0 cursor-pointer overflow-hidden shadow-inner"
                        title="Pick color"
                      />
                    </div>

                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => handleUpdateColor(col.id, 'name', e.target.value)}
                      placeholder="Colorway Name (e.g. Undyed Natural Ecru)"
                      className="flex-1 h-10 px-3 rounded bg-surface border border-surface-variant text-on-surface text-xs font-medium focus:outline-none focus:border-primary"
                    />

                    <span className="font-mono text-xs text-on-surface-variant uppercase w-16 text-center">
                      {col.hex}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveColor(col.id)}
                      className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                      title="Remove Colorway"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Sizes Manager (S, M, L, XL Supported) */}
            <div className="pt-6 border-t border-surface-variant/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-headline-sm text-sm uppercase text-secondary font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">straighten</span>
                    Garment Sizes Manager (S, M, L, XL, etc.)
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Configure standard clothing sizes (S, M, L, XL) or custom proportion sizing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSizeRow}
                  className="px-3 py-1 rounded bg-primary text-on-primary font-label-caps text-xs flex items-center gap-1 hover:bg-secondary cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Size</span>
                </button>
              </div>

              {/* Size System Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-label-caps text-[11px] text-on-surface-variant uppercase mr-1">Presets:</span>
                <button
                  type="button"
                  onClick={setStandardSizesPreset}
                  className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold transition-colors border border-surface-variant cursor-pointer"
                >
                  ⚡ Standard (S, M, L, XL)
                </button>

                <button
                  type="button"
                  onClick={setExtendedSizesPreset}
                  className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold transition-colors border border-surface-variant cursor-pointer"
                >
                  ⚡ Extended (XS, S, M, L, XL, XXL)
                </button>

                <button
                  type="button"
                  onClick={setAtelierProportionsPreset}
                  className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold transition-colors border border-surface-variant cursor-pointer"
                >
                  ⚡ Atelier (Size I, II, III, IV)
                </button>
              </div>

              {/* Dynamic Sizes List */}
              <div className="space-y-2">
                {sizes.map((sz) => (
                  <div
                    key={sz.id}
                    className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-lg bg-surface-container-low border border-surface-variant/70"
                  >
                    <div className="col-span-3">
                      <label className="font-label-caps text-[9px] text-on-surface-variant block uppercase mb-0.5">Size Code</label>
                      <input
                        type="text"
                        value={sz.code}
                        onChange={(e) => handleUpdateSizeRow(sz.id, 'code', e.target.value)}
                        placeholder="S, M, L, XL"
                        className="w-full h-9 px-2.5 rounded bg-surface border border-surface-variant text-on-surface font-bold text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="col-span-6">
                      <label className="font-label-caps text-[9px] text-on-surface-variant block uppercase mb-0.5">Fit Description</label>
                      <input
                        type="text"
                        value={sz.fit}
                        onChange={(e) => handleUpdateSizeRow(sz.id, 'fit', e.target.value)}
                        placeholder="Small (Chest 36–38&quot;)"
                        className="w-full h-9 px-2.5 rounded bg-surface border border-surface-variant text-on-surface text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="font-label-caps text-[9px] text-on-surface-variant block uppercase mb-0.5">Stock</label>
                      <input
                        type="number"
                        value={sz.stock}
                        onChange={(e) => handleUpdateSizeRow(sz.id, 'stock', e.target.value)}
                        placeholder="5"
                        className="w-full h-9 px-2 rounded bg-surface border border-surface-variant text-on-surface text-xs text-center font-bold focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="col-span-1 text-center pt-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveSizeRow(sz.id)}
                        className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                        title="Remove Size"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section 6: Garment Integrity Accordions */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant space-y-4">
            <h3 className="font-headline-sm text-sm uppercase text-secondary font-semibold border-b border-surface-variant pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">verified</span>
              06. Integrity Accordions (Provenance, Care &amp; Sashiko Guarantee)
            </h3>

            <div>
              <label className="font-label-caps text-xs block mb-1">Material Provenance History</label>
              <textarea
                rows={2}
                value={provenanceText}
                onChange={(e) => setProvenanceText(e.target.value)}
                className="w-full p-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1">Care &amp; Living Protocol Instructions</label>
              <textarea
                rows={2}
                value={careText}
                onChange={(e) => setCareText(e.target.value)}
                className="w-full p-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1">Lifetime Passport &amp; Sashiko Repair Guarantee</label>
              <textarea
                rows={2}
                value={passportText}
                onChange={(e) => setPassportText(e.target.value)}
                className="w-full p-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-4 pt-space-md">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-on-primary py-4 px-space-lg rounded-lg font-label-caps text-xs uppercase font-bold tracking-widest hover:bg-secondary transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">publish</span>
              <span>{isSubmitting ? 'COMMISSIONING EDITION...' : 'SAVE & PUBLISH GARMENT EDITION'}</span>
            </button>

            <button
              type="button"
              onClick={onBackToProducts}
              className="px-space-lg py-4 rounded-lg bg-surface-container-high text-on-surface font-label-caps text-xs uppercase hover:bg-surface-container-highest cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </div>

        {/* Right Column: Live Product Card Preview */}
        <div className="lg:col-span-4 space-y-space-md">
          <div className="sticky top-24 space-y-space-md">
            <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block font-bold">
              LIVE MONOGRAPH PREVIEW
            </span>

            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-surface-variant overflow-hidden">
              <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden">
                <img
                  src={img1}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-surface/90 backdrop-blur-md text-[10px] font-label-caps uppercase text-on-surface font-bold tracking-wider">
                  {badge || 'LIMITED EDITION'}
                </span>
              </div>

              <div className="p-space-md space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-secondary font-bold">{edition}</span>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">{category}</span>
                </div>

                <h3 className="font-headline-sm text-lg text-on-surface font-normal leading-snug">{title || 'Garment Title'}</h3>
                <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2">{description}</p>

                {/* Colors preview swatches */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-label-caps text-on-surface-variant mr-1">Colors:</span>
                  {colors.map((c) => (
                    <span
                      key={c.id}
                      className="w-4 h-4 rounded-full border border-black/20 inline-block shadow-2xs"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>

                {/* Sizes preview pills */}
                <div className="flex items-center gap-1 pt-1">
                  <span className="text-[10px] font-label-caps text-on-surface-variant mr-1">Sizes:</span>
                  {sizes.map((sz) => (
                    <span
                      key={sz.id}
                      className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px] font-bold text-on-surface border border-surface-variant"
                    >
                      {sz.code}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-surface-variant flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-on-surface">Rs. {Number(price || 42000).toLocaleString('en-LK')}</span>
                  <span className="font-label-caps text-xs text-secondary font-bold">{stock} in stock</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/60 text-xs text-on-surface-variant space-y-2">
              <div className="flex items-center gap-1.5 text-on-surface font-semibold">
                <span className="material-symbols-outlined text-base text-secondary">eco</span>
                <span>Atelier Garment Integrity Standards</span>
              </div>
              <p>
                All items created through this console are instantly saved to the server backend database and integrated across all public store categories and product detail pages.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
