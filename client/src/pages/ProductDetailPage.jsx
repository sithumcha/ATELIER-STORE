import React, { useState, useEffect } from 'react';
import { getProductOffer, formatRsPrice } from '../utils/offerUtils';

// Price helper function for Sri Lankan Rupees (Rs.)
const formatRs = (val) => {
  if (val === undefined || val === null) return 'Rs. 0';
  let num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  return `Rs. ${Math.round(num).toLocaleString('en-LK')}`;
};

export default function ProductDetailPage({ selectedProductId, onAddToCart, onBuyNow, onToggleWishlist, wishlistIds = [], onBackToHome, onSelectProduct, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('II');
  const [selectedColor, setSelectedColor] = useState('Undyed Natural Ecru');
  const [quantity, setQuantity] = useState(1);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);


  // Verified Patron Reviews State
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewBody, setNewReviewBody] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  
  // Order Verification State for Reviews
  const [hasPurchased, setHasPurchased] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  const loggedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('atelierstore_user') || 'null');
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    if (loggedUser?.name && !newReviewerName) {
      setNewReviewerName(loggedUser.name);
    }
  }, [loggedUser?.name]);

  // Check if current client has purchased this product
  useEffect(() => {
    let isMounted = true;
    const checkPurchaseEligibility = async () => {
      let currentUserOrders = [];

      // 1. Load orders placed in current browser session from localStorage
      try {
        const localOrds = JSON.parse(localStorage.getItem('atelierstore_user_orders') || '[]');
        if (Array.isArray(localOrds)) {
          currentUserOrders = [...localOrds];
        }
      } catch (e) {}

      // 2. Fetch orders from Express Backend API & filter ONLY for current user's email / name
      try {
        const res = await fetch('http://localhost:5001/api/orders');
        if (res.ok) {
          const dbOrds = await res.json();
          if (Array.isArray(dbOrds) && dbOrds.length > 0) {
            const userEmail = (loggedUser?.email || '').toLowerCase().trim();
            const userName = (loggedUser?.name || '').toLowerCase().trim();

            const userDbOrds = dbOrds.filter((dbO) => {
              const pEmail = (dbO.patronEmail || '').toLowerCase().trim();
              const pName = (dbO.patronName || '').toLowerCase().trim();

              const emailMatch = userEmail && pEmail && userEmail === pEmail;
              const nameMatch = userName && pName && userName === pName;

              return emailMatch || nameMatch;
            });

            userDbOrds.forEach((dbO) => {
              if (!currentUserOrders.some((o) => (o.orderId && o.orderId === dbO.orderId) || (o.id && o.id === dbO.id))) {
                currentUserOrders.push(dbO);
              }
            });
          }
        }
      } catch (e) {}

      if (!isMounted) return;
      setUserOrders(currentUserOrders);

      const targetId = String(selectedProductId || product?.id || product?._id || '');
      const targetTitle = (product?.title || '').toLowerCase().trim();

      // Strict check: Does current user's order list contain this specific item?
      const matched = currentUserOrders.some((ord) => {
        if (!ord.items || !Array.isArray(ord.items)) return false;
        return ord.items.some((item) => {
          const itemId = String(item.id || item.productId || item._id || '');
          const itemTitle = (item.title || '').toLowerCase().trim();

          const idMatch = itemId && targetId && (itemId === targetId || targetId === itemId);
          const titleMatch = itemTitle && targetTitle && itemTitle === targetTitle;

          return idMatch || titleMatch;
        });
      });

      setHasPurchased(matched);
    };

    checkPurchaseEligibility();
    return () => {
      isMounted = false;
    };
  }, [selectedProductId, product, loggedUser?.email, loggedUser?.name]);

  // Accordions State
  const [openAccordions, setOpenAccordions] = useState({
    provenance: true,
    measurements: false,
    care: false,
    passport: false,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchProductReviews = async () => {
      let combined = [];
      const currentId = String(selectedProductId || product?.id || product?._id || '');
      const currentTitle = (product?.title || '').toLowerCase().trim();

      // 1. Load product-specific reviews from localStorage
      try {
        const savedRev = localStorage.getItem(`atelierstore_reviews_${selectedProductId}`);
        if (savedRev) {
          const parsed = JSON.parse(savedRev);
          if (Array.isArray(parsed)) combined = [...parsed];
        }
      } catch (e) {}

      // 2. Load all user reviews from localStorage & filter by productId/productTitle
      try {
        const allUserRevs = JSON.parse(localStorage.getItem('atelierstore_all_user_reviews') || '[]');
        if (Array.isArray(allUserRevs)) {
          const matched = allUserRevs.filter((r) => {
            const rId = String(r.productId || r.id || '');
            const rTitle = (r.productTitle || '').toLowerCase().trim();
            const idMatch = currentId && rId && (rId === currentId || currentId.includes(rId) || rId.includes(currentId));
            const titleMatch = currentTitle && rTitle && (currentTitle.includes(rTitle) || rTitle.includes(currentTitle));
            return idMatch || titleMatch;
          });

          matched.forEach((m) => {
            if (!combined.some((c) => String(c.id) === String(m.id))) {
              combined.unshift(m);
            }
          });
        }
      } catch (e) {}

      // 3. Fetch reviews from Express Backend MongoDB API & filter strictly for this garment
      try {
        const res = await fetch('http://localhost:5001/api/reviews');
        if (res.ok) {
          const dbRevs = await res.json();
          if (Array.isArray(dbRevs)) {
            const matchedDb = dbRevs.filter((r) => {
              const rId = String(r.productId || '');
              const rTitle = (r.productTitle || '').toLowerCase().trim();
              const idMatch = currentId && rId && (rId === currentId || currentId.includes(rId) || rId.includes(currentId));
              const titleMatch = currentTitle && rTitle && (currentTitle.includes(rTitle) || rTitle.includes(currentTitle));
              return idMatch || titleMatch;
            });

            matchedDb.forEach((m) => {
              const normRev = {
                id: m._id || m.id || `rev-${Date.now()}`,
                rating: Number(m.rating) || 5,
                name: m.userName || m.name || 'Verified Patron',
                location: m.userLocation || m.location || 'Verified Patron',
                date: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : (m.date || 'Recently'),
                title: m.title || 'Patron Garment Evaluation',
                body: m.body || '',
                verified: true,
                avatar: m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.userName || 'P')}&background=1c1917&color=f5f5f4&bold=true`,
                productId: m.productId || currentId,
                productTitle: m.productTitle || product?.title || 'Archival Garment',
                approved: m.approved !== false
              };

              const existingIdx = combined.findIndex((c) => String(c.id) === String(normRev.id) || (c.body === normRev.body && c.name === normRev.name));
              if (existingIdx === -1) {
                combined.unshift(normRev);
              } else {
                combined[existingIdx] = { ...combined[existingIdx], ...normRev };
              }
            });
          }
        }
      } catch (e) {
        console.log('Error fetching DB reviews:', e);
      }

      if (isMounted) {
        setReviews(combined);
      }
    };

    fetchProductReviews();
    return () => {
      isMounted = false;
    };
  }, [selectedProductId, product]);

  const handleAddReview = (e) => {
    e.preventDefault();

    if (!newReviewerName.trim() || !newReviewBody.trim()) {
      alert('Please enter your name and review message.');
      return;
    }

    const currentProdId = String(selectedProductId || product?.id || product?._id || 'p1');
    const currentProdTitle = product?.title || 'Archival Garment';

    const clientAvatar = loggedUser?.avatar || (
      loggedUser?.name || newReviewerName.trim()
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(newReviewerName.trim())}&background=1c1917&color=f5f5f4&bold=true`
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    );

    const newRevObj = {
      id: `rev-${Date.now()}`,
      productId: currentProdId,
      productTitle: currentProdTitle,
      rating: Number(newRating) || 5,
      name: newReviewerName.trim(),
      userName: newReviewerName.trim(),
      location: loggedUser?.address?.city ? `${loggedUser.address.city}, ${loggedUser.address.country || 'Sri Lanka'}` : 'Verified Collector',
      userLocation: loggedUser?.address?.city ? `${loggedUser.address.city}, ${loggedUser.address.country || 'Sri Lanka'}` : 'Verified Collector',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: newReviewTitle.trim() || `Garment Evaluation for ${currentProdTitle}`,
      body: newReviewBody.trim(),
      verified: true,
      avatar: clientAvatar,
      status: 'Pending',
      approved: false,
    };

    const updated = [newRevObj, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(`atelierstore_reviews_${currentProdId}`, JSON.stringify(updated));
      const allUserRevs = JSON.parse(localStorage.getItem('atelierstore_all_user_reviews') || '[]');
      localStorage.setItem('atelierstore_all_user_reviews', JSON.stringify([newRevObj, ...allUserRevs]));
    } catch (err) {}

    try {
      fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRevObj),
      }).catch((e) => console.log('Backend review POST skip:', e));
    } catch (e) {}

    setNewReviewerName(loggedUser?.name || '');
    setNewReviewTitle('');
    setNewReviewBody('');
    setNewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4500);
  };

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    fetchGarmentDetail(selectedProductId);
    fetchDbRecommendations(selectedProductId);
  }, [selectedProductId]);

  const fetchDbRecommendations = async (currentId) => {
    try {
      const res = await fetch('http://localhost:5001/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const otherItems = data.filter((p) => String(p._id || p.id) !== String(currentId));
          if (otherItems.length > 0) {
            const formattedRecs = otherItems.slice(0, 3).map((p, idx) => {
              let numPrice = typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 28000;
              let displayImg = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80';
              if (p.images && Array.isArray(p.images) && p.images.length > 0 && p.images[0]) {
                displayImg = p.images[0];
              } else if (p.img) {
                displayImg = p.img;
              } else if (p.image) {
                displayImg = p.image;
              }
              return {
                id: p._id || p.id || `rec_db_${idx}`,
                title: p.title || p.name || 'Harmonious Garment',
                fabric: p.category || p.subtitle || p.gsm || 'Natural Fiber',
                price: formatRs(numPrice),
                numericPrice: numPrice,
                badge: p.badge || (p.category ? p.category.toUpperCase() : 'LIMITED EDITION'),
                img: displayImg,
              };
            });
            setRecommendedProducts(formattedRecs);
            return;
          }
        }
      }
    } catch (err) {
      console.log('Error fetching DB recommendations:', err);
    }
    setRecommendedProducts([]);
  };

  const fetchGarmentDetail = async (id) => {
    setLoading(true);
    try {
      if (id) {
        const res = await fetch(`http://localhost:5001/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && (data._id || data.id || data.title)) {
            formatAndSetGarment(data);
            return;
          }
        }
      }

      // Try fetching all products to find matching product
      const resAll = await fetch('http://localhost:5001/api/products');
      if (resAll.ok) {
        const allProds = await resAll.json();
        if (Array.isArray(allProds) && allProds.length > 0) {
          const match = allProds.find(p => String(p._id || p.id) === String(id)) || allProds[0];
          if (match) {
            formatAndSetGarment(match);
            return;
          }
        }
      }
    } catch (err) {
      console.log('Error fetching product monograph from API:', err);
    }
    setProduct(null);
    setLoading(false);
  };

  const formatAndSetGarment = (data) => {
    let rawPrice = data.price;
    let numericPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 28000;

    let imgs = [];
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      imgs = data.images.filter(Boolean);
    } else if (data.img) {
      imgs = [data.img];
    } else if (data.image) {
      imgs = [data.image];
    } else {
      imgs = ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80'];
    }

    imgs = imgs.map((u) => {
      if (!u || typeof u !== 'string') return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80';
      if (!u.startsWith('http') && !u.startsWith('data:')) {
        if (u.startsWith('/uploads/')) return `http://localhost:5001${u}`;
        if (u.startsWith('uploads/')) return `http://localhost:5001/${u}`;
      }
      return u;
    });

    const parsedSizes = Array.isArray(data.sizes) && data.sizes.length > 0
      ? data.sizes.map((s, idx) => typeof s === 'string' ? { id: `sz_${idx}`, roman: s, label: s, fit: 'Regular Fit', stock: 5 } : ({
          id: s._id || s.id || `sz_${idx}`,
          roman: s.roman || s.code || s.label || 'M',
          label: s.label || s.code || s.roman || 'Size M',
          fit: s.fit || 'Regular Fit',
          stock: Number(s.stock) || 0
        }))
      : [
          { id: 's1', roman: 'S', label: 'S', fit: 'Small (Chest 36–38")', stock: 5 },
          { id: 's2', roman: 'M', label: 'M', fit: 'Medium (Chest 40–42")', stock: 8 },
          { id: 's3', roman: 'L', label: 'L', fit: 'Large (Chest 44–46")', stock: 6 },
          { id: 's4', roman: 'XL', label: 'XL', fit: 'Extra Large (Chest 48–50")', stock: 3 },
        ];

    const computedTotalStock = parsedSizes.reduce((acc, s) => acc + (Number(s.stock) || 0), 0);
    const finalTotalStock = (data.stock !== undefined && data.stock !== null && Number(data.stock) > 0)
      ? Number(data.stock)
      : computedTotalStock;

    const formattedObj = {
      id: data._id || data.id || 'p_unknown',
      _id: data._id || data.id || 'p_unknown',
      title: data.title || data.name || 'Archival Garment',
      edition: data.edition || data.category || 'ATELIER COLLECTION',
      editionName: data.editionName || data.category || 'ATELIER COLLECTION',
      shuttle: data.shuttle || data.category || 'HAND-WOVEN LOOM',
      gsm: data.gsm || '380 GSM HEAVYWEIGHT',
      density: data.density || data.gsm || '380 GSM density',
      price: formatRs(numericPrice),
      numericPrice: numericPrice,
      offerPercentage: Number(data.offerPercentage) || 0,
      offerExpiresAt: data.offerExpiresAt || null,
      offerTitle: data.offerTitle || '',
      rawProduct: data,
      totalStock: finalTotalStock,
      stock: finalTotalStock,
      badge: data.badge || data.category || 'LIMITED EDITION',
      summary: data.description || data.summary || data.subtitle || 'Hand-crafted archival garment woven with patience.',
      colors: Array.isArray(data.colors) && data.colors.length > 0 ? data.colors.map((c, idx) => ({
        id: `c_${idx}`,
        name: typeof c === 'string' ? c : (c.name || 'Natural Hue'),
        hex: typeof c === 'object' && c.hex ? c.hex : '#1C1C18',
        img: imgs[0]
      })) : [{ id: 'c0', name: 'Natural Hue', hex: '#1C1C18', img: imgs[0] }],
      sizes: parsedSizes,
      img: imgs[0],
      images: imgs,
      provenanceText: data.provenanceText || data.provenance || 'The raw natural fibers are cultivated across pristine coastal terrains and hand-woven in our partner preservation workshops.',
      loomOrigin: data.loomOrigin || 'Vintage Non-Automated Shuttle Loom',
      weavingSpeed: data.weavingSpeed || '8.5 meters per day',
      careInstructions: Array.isArray(data.careInstructions) && data.careInstructions.length > 0
        ? data.careInstructions
        : [data.careText || data.careInstructionsText || data.careProtocol || 'Submerge in cool water (under 25°C) with mild neutral pH detergent.'],
      passportText: data.passportText || data.passportInfo || 'Each archival garment carries an individual linen passport seam code for lifetime sashiko repair guarantee.',
      measurementsTable: (data.measurementsTable && Array.isArray(data.measurementsTable) && data.measurementsTable.length > 0)
        ? data.measurementsTable
        : [
            { spec: 'Total Back Length', metric: '122 cm / 48.0"' },
            { spec: 'Chest Width (Pit to Pit)', metric: '66 cm / 26.0"' },
          ],
      recommendedLooks: [
        {
          id: 'p1',
          title: 'Solitude Raw Linen Kimono Duster',
          fabric: '410 GSM Raw Normandy Flax',
          price: 'Rs. 42,000',
          numericPrice: 42000,
          badge: 'BESTSELLER',
          img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
        },
        {
          id: 'w1',
          title: 'Kaze Organic Silk Trench',
          fabric: '320 GSM Hand-spun Raw Silk',
          price: 'Rs. 48,000',
          numericPrice: 48000,
          badge: 'NEW EDITION',
          img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        },
        {
          id: 'm1',
          title: 'Kyoto Woven Structure Blazer',
          fabric: '450 GSM Heavyweight Wool Flax',
          price: 'Rs. 52,000',
          numericPrice: 52000,
          badge: 'ARCHIVAL',
          img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
        },
      ]
    };

    setProduct(formattedObj);
    if (parsedSizes.length > 0) {
      setSelectedSize(parsedSizes[0].label || parsedSizes[0].roman || 'M');
    }
    if (formattedObj.colors.length > 0) {
      setSelectedColor(formattedObj.colors[0].name);
    }
    setSelectedImageIndex(0);
    setLoading(false);
  };

  const handleAcquireClick = () => {
    if (onAddToCart && product) {
      const offer = getProductOffer(product);
      const effectivePrice = offer.hasActiveOffer ? offer.discountedPrice : product.numericPrice;

      onAddToCart({
        id: product.id,
        _id: product.id,
        title: product.title,
        price: effectivePrice,
        img: product.images[selectedImageIndex] || product.img,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        rawProduct: product.rawProduct || product,
      });

      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  const handleBuyNowClick = () => {
    if (product) {
      const offer = getProductOffer(product);
      const effectivePrice = offer.hasActiveOffer ? offer.discountedPrice : product.numericPrice;

      const directItem = {
        id: product.id,
        _id: product.id,
        title: product.title,
        price: effectivePrice,
        img: (product.images && product.images[selectedImageIndex]) || product.img,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        qty: quantity,
        rawProduct: product.rawProduct || product,
      };

      if (onBuyNow) {
        onBuyNow(directItem);
      } else if (onNavigate) {
        onNavigate('checkout');
      }
    }
  };

  const handleQuickAddRecommended = (rec) => {
    if (onAddToCart) {
      onAddToCart({
        id: rec.id,
        title: rec.title,
        price: rec.numericPrice,
        img: rec.img,
      });
    }
  };

  if (loading || !product) {
    return (
      <div className="w-full py-32 text-center text-on-surface-variant bg-surface">
        <span className="material-symbols-outlined text-4xl animate-spin mb-3 block text-secondary">cyclone</span>
        <p className="font-label-caps text-xs uppercase tracking-widest font-semibold">Loading Garment Monograph...</p>
      </div>
    );
  }

  const isFavorited = wishlistIds.includes(product.id);
  const activeSizeObj = product.sizes.find((s) => s.label === selectedSize || s.roman === selectedSize || s.id === selectedSize) || product.sizes[0] || { label: selectedSize || 'M', fit: 'Standard', stock: 5 };


  return (
    <div className="w-full bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-surface-variant">
      
      {/* Lightbox Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-on-primary hover:text-secondary p-2 cursor-pointer z-50"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          <img
            src={product.images[selectedImageIndex] || product.img}
            alt={product.title}
            className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl"
          />
        </div>
      )}

      {/* Micro Breadcrumb & Metatag Header Strip */}
      <div className="w-full max-w-[1380px] mx-auto px-margin pt-space-md pb-space-sm flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-2 font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
          <button onClick={onBackToHome} className="hover:text-on-surface transition-colors cursor-pointer flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>GARMENT ARCHIVE</span>
          </button>
          <span>/</span>
          <span className="text-on-surface font-semibold">{product.edition}</span>
        </div>
        
        <div className="flex items-center gap-space-md">
          <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-[10px] tracking-wider uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            {product.shuttle}
          </span>
          <span className="hidden md:inline font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">
            {product.gsm}
          </span>
        </div>
      </div>

      {/* Primary Stage: Asymmetric Split Screen Presentation */}
      <div className="w-full max-w-[1380px] mx-auto px-margin pb-space-2xl pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          
          {/* LEFT COLUMN: Architectural Editorial Gallery (Col 7) */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-space-md relative">
            
            {/* Thumbnail Rail */}
            <div className="flex lg:flex-col gap-space-sm overflow-x-auto lg:overflow-visible shrink-0 pb-2 lg:pb-0 scrollbar-none" id="gallery-thumbs">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`thumb-btn relative w-20 h-28 lg:w-20 lg:h-28 rounded bg-surface-container-low overflow-hidden transition-all duration-300 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'ring-2 ring-primary opacity-100 shadow-md scale-102'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  type="button"
                >
                  <img className="w-full h-full object-cover" alt={`${product.title} angle ${idx + 1}`} src={imgUrl} />
                  <span className="absolute bottom-1 right-1 font-label-caps text-[9px] bg-surface/80 px-1 py-0.2 rounded text-on-surface font-mono">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Main Display Vessel */}
            <div className="relative w-full aspect-[3/4] bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-surface-variant group">
              <img
                id="main-product-img"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 cursor-zoom-in"
                alt={product.title}
                src={product.images[selectedImageIndex] || product.img}
                onClick={() => setIsZoomOpen(true)}
              />

              {/* Translucent Floating Spec Chip */}
              <div className="absolute top-space-md left-space-md bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 border border-surface-variant/40">
                <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
                <span className="font-label-caps text-[10px] uppercase text-on-surface tracking-widest font-semibold">
                  LIMITED EDITION NO. 18 / 60
                </span>
              </div>

              {/* Zoom Prompt Indicator */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-space-md right-space-md bg-surface/85 backdrop-blur-md px-3 py-1.5 rounded-full text-on-surface-variant flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">zoom_in</span>
                <span className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface font-semibold">
                  Hover to enlarge fiber detail
                </span>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Curated Specifications & Atelier Checkout (Col 5) */}
          <div className="lg:col-span-5 flex flex-col space-y-space-lg lg:pl-space-md">
            
            {/* Header Info */}
            <div className="space-y-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[11px] uppercase tracking-[0.2em] text-secondary font-bold">
                  {product.editionName}
                </span>
                <span className="font-label-caps text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">eco</span> Undyed Organic Origin
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl text-on-surface tracking-tight leading-[1.1] pt-1">
                {product.title}
              </h1>

              {(() => {
                const offer = getProductOffer(product);
                if (offer.hasActiveOffer) {
                  return (
                    <div className="space-y-2 border-b border-surface-variant pb-3 pt-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-headline-lg text-headline-lg text-rose-700 font-bold">
                          {formatRsPrice(offer.discountedPrice)}
                        </span>
                        <span className="line-through text-lg text-outline font-mono">
                          {formatRsPrice(offer.rawPrice)}
                        </span>
                        <span className="px-3 py-1 rounded bg-rose-600 text-white font-label-caps text-xs font-bold uppercase shadow-sm flex items-center gap-1 animate-pulse">
                          <span className="material-symbols-outlined text-sm">local_offer</span>
                          {offer.offerPercentage}% OFF
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 flex items-center justify-between text-xs font-label-caps shadow-xs">
                        <span className="font-bold flex items-center gap-1.5 text-rose-900">
                          <span className="material-symbols-outlined text-base text-rose-700">timer</span>
                          {offer.offerTitle}
                        </span>
                        <span className="bg-rose-700 text-white px-2.5 py-0.5 rounded font-mono font-bold shadow-xs">
                          ⏳ Ends in {offer.timeRemainingStr}
                        </span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="flex items-baseline gap-space-md pt-2 border-b border-surface-variant pb-3">
                    <span className="font-headline-lg text-headline-lg text-primary font-bold">
                      {product.price}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Tax inclusive · Insured Courier Dispatch
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Sensory Description Extract */}
            <div className="bg-surface-container-low p-space-md rounded-lg space-y-2 border border-surface-variant/70">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {product.summary}
              </p>
              <div className="flex items-center gap-space-md pt-space-xs font-body-sm text-body-sm text-on-surface">
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[15px] text-secondary">balance</span>
                  {product.density}
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[15px] text-secondary">water_drop</span>
                  Zero Chemical Finish
                </span>
              </div>
            </div>

            {/* Colorway Selector */}
            <div className="space-y-space-sm pt-space-xs">
              <div className="flex justify-between items-center">
                <span className="font-label-caps text-xs uppercase text-on-surface tracking-wider font-semibold">
                  HUE SELECTION
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  {selectedColor}
                </span>
              </div>

              <div className="flex items-center gap-space-md">
                {product.colors.map((col) => {
                  const isSelected = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      onClick={() => {
                        setSelectedColor(col.name);
                        if (col.img) {
                          const idx = product.images.indexOf(col.img);
                          if (idx !== -1) setSelectedImageIndex(idx);
                        }
                      }}
                      className={`color-swatch ring-offset-2 p-1 rounded-full transition-transform active:scale-95 cursor-pointer ${
                        isSelected ? 'ring-2 ring-primary ring-offset-surface scale-105' : 'ring-1 ring-outline-variant hover:ring-primary opacity-80'
                      }`}
                      title={col.name}
                      type="button"
                    >
                      <span
                        className="block w-7 h-7 rounded-full shadow-inner border border-black/10"
                        style={{ backgroundColor: col.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizing Architecture */}
            <div className="space-y-space-sm pt-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-xs uppercase text-on-surface tracking-wider font-semibold">
                  PROPORTION / SIZING
                </span>
                <button
                  onClick={() => setIsSizeModalOpen(true)}
                  className="font-body-sm text-body-sm text-secondary hover:underline transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">straighten</span>
                  Anatomical Size Guide
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2" id="size-selector">
                {product.sizes.map((sz) => {
                  const sizeKey = sz.label || sz.roman || sz.id;
                  const isSelected = selectedSize === sizeKey || (selectedSize === 'II' && sz.roman === 'II');
                  return (
                    <button
                      key={sizeKey}
                      onClick={() => setSelectedSize(sizeKey)}
                      className={`size-btn flex flex-col items-center justify-center p-3 rounded-lg transition-all text-center border cursor-pointer ${

                        isSelected
                          ? 'bg-primary text-on-primary border-primary shadow-sm active-size font-bold'
                          : 'bg-surface-container border-surface-variant hover:bg-surface-container-high text-on-surface'
                      }`}
                      type="button"
                    >
                      <span className={`font-title-md text-title-md ${isSelected ? 'text-on-primary' : 'text-on-surface'}`}>
                        {sz.label}
                      </span>
                      <span className={`font-body-sm text-[11px] ${isSelected ? 'text-surface-container-high' : 'text-on-surface-variant'}`}>
                        {sz.fit}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Stock & Provenance Metric */}
              <div className="flex items-center justify-between text-body-sm pt-1">
                <div className="flex items-center gap-2 text-secondary font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  <span>Total Stock: <strong className="text-on-surface">{product.totalStock}</strong> pieces ({activeSizeObj.stock || 0} in Size {activeSizeObj.label || activeSizeObj.roman})</span>
                </div>
                <span className="text-on-surface-variant font-label-caps text-[10px] uppercase font-semibold">
                  {product.totalStock > 0 ? 'In Vault Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons: Add to Cart, Buy Now & Wishlist */}
            <div className="pt-space-sm space-y-space-sm">
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAcquireClick}
                  className="flex-1 bg-surface-container-highest text-on-surface border border-surface-variant py-4 px-space-md rounded-lg hover:bg-primary hover:text-on-primary active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer font-bold"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span className="font-label-caps text-xs tracking-[0.14em] uppercase">
                    {addedNotice ? 'ADDED TO CART ✓' : 'ADD TO CART'}
                  </span>
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNowClick}
                  className="flex-1 bg-primary text-on-primary py-4 px-space-md rounded-lg hover:bg-secondary active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer font-bold"
                  type="button"
                >
                  <span className="font-label-caps text-xs tracking-[0.14em] uppercase">
                    BUY NOW
                  </span>
                  <span className="material-symbols-outlined text-[18px]">east</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist && onToggleWishlist(product)}
                  className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                    isFavorited
                      ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                      : 'bg-surface-container border-surface-variant hover:bg-surface-container-high hover:text-red-600 text-on-surface'
                  }`}
                  title={isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {isFavorited ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-space-md pt-1 font-body-sm text-body-sm text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">lock</span> Encrypted Vault Checkout
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">autorenew</span> 14-Day Free Exchange
                </span>
              </div>
            </div>

            {/* Garment Integrity Accordions */}
            <div className="pt-space-md space-y-2 border-t border-surface-variant">
              
              {/* Tab 1: Provenance */}
              <div className="bg-surface-container-low rounded-lg overflow-hidden border border-surface-variant/60">
                <button
                  onClick={() => toggleAccordion('provenance')}
                  className="w-full px-space-md py-space-sm flex items-center justify-between text-left group cursor-pointer"
                  type="button"
                >
                  <span className="font-title-md text-title-md text-on-surface flex items-center gap-2 font-semibold">
                    <span className="material-symbols-outlined text-[18px] text-secondary">source_notes</span>
                    Material Provenance &amp; Weave History
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface transition-transform duration-300">
                    {openAccordions.provenance ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {openAccordions.provenance && (
                  <div className="px-space-md pb-space-md pt-space-xs font-body-md text-body-md text-on-surface-variant space-y-2">
                    <p>{product.provenanceText}</p>
                    <div className="grid grid-cols-2 gap-space-sm bg-surface p-space-sm rounded mt-2 font-body-sm border border-surface-variant/40">
                      <div>
                        <span className="font-label-caps text-[10px] text-on-surface-variant block uppercase font-semibold">LOOM ORIGIN</span>
                        <span className="text-on-surface font-medium">{product.loomOrigin}</span>
                      </div>
                      <div>
                        <span className="font-label-caps text-[10px] text-on-surface-variant block uppercase font-semibold">WEAVING SPEED</span>
                        <span className="text-on-surface font-medium">{product.weavingSpeed}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tab 2: Measurements Table */}
              <div className="bg-surface-container-low rounded-lg overflow-hidden border border-surface-variant/60">
                <button
                  onClick={() => toggleAccordion('measurements')}
                  className="w-full px-space-md py-space-sm flex items-center justify-between text-left group cursor-pointer"
                  type="button"
                >
                  <span className="font-title-md text-title-md text-on-surface flex items-center gap-2 font-semibold">
                    <span className="material-symbols-outlined text-[18px] text-secondary">straighten</span>
                    Garment Measurements (Size {selectedSize} Spec)
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface transition-transform duration-300">
                    {openAccordions.measurements ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {openAccordions.measurements && (
                  <div className="px-space-md pb-space-md pt-space-xs font-body-sm text-body-sm text-on-surface-variant">
                    <table className="w-full text-left border-collapse">
                      <tbody className="space-y-1">
                        {product.measurementsTable.map((row, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-surface/50' : ''}>
                            <td className="py-1.5 px-2 text-on-surface font-medium">{row.spec}</td>
                            <td className="py-1.5 px-2 text-right font-mono text-on-surface font-bold">{row.metric}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="pt-2 text-[11px] text-on-surface-variant italic">Garment measured laying un-tensioned on flat cedar workshop tables.</p>
                  </div>
                )}
              </div>

              {/* Tab 3: Care Guide */}
              <div className="bg-surface-container-low rounded-lg overflow-hidden border border-surface-variant/60">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full px-space-md py-space-sm flex items-center justify-between text-left group cursor-pointer"
                  type="button"
                >
                  <span className="font-title-md text-title-md text-on-surface flex items-center gap-2 font-semibold">
                    <span className="material-symbols-outlined text-[18px] text-secondary">spa</span>
                    Care &amp; Living Protocol
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface transition-transform duration-300">
                    {openAccordions.care ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {openAccordions.care && (
                  <div className="px-space-md pb-space-md pt-space-xs font-body-md text-body-md text-on-surface-variant space-y-2">
                    <p>Linen is an active organism. It holds memory and softens exponentially with water contact and natural body movement.</p>
                    <ul className="list-disc pl-5 space-y-1 font-body-sm text-body-sm">
                      {product.careInstructions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tab 4: Passport & Sashiko Guarantee */}
              <div className="bg-surface-container-low rounded-lg overflow-hidden border border-surface-variant/60">
                <button
                  onClick={() => toggleAccordion('passport')}
                  className="w-full px-space-md py-space-sm flex items-center justify-between text-left group cursor-pointer"
                  type="button"
                >
                  <span className="font-title-md text-title-md text-on-surface flex items-center gap-2 font-semibold">
                    <span className="material-symbols-outlined text-[18px] text-secondary">handyman</span>
                    Lifetime Passport &amp; Sashiko Repair
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface transition-transform duration-300">
                    {openAccordions.passport ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {openAccordions.passport && (
                  <div className="px-space-md pb-space-md pt-space-xs font-body-md text-body-md text-on-surface-variant space-y-2">
                    <p>{product.passportText}</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Editorial Textile Focus & Wabi-Sabi Immersion Break */}
      <section className="w-full bg-surface-container-low py-space-2xl my-space-lg border-y border-surface-variant/80">
        <div className="max-w-[1380px] mx-auto px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            <div className="lg:col-span-5 space-y-space-md">
              <span className="font-label-caps text-label-caps text-secondary tracking-widest block font-bold">
                PHILOSOPHY OF SURFACE
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl text-on-surface leading-tight font-normal">
                "Woven slowly, so the linen remembers how to breathe."
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Conventional high-speed industrial looms subject flax thread to intense mechanical friction, strip-coating the fibers with synthetic sizing starches. Our Kyoto looms cycle at one-fourth the velocity, retaining the microscopic linen channels that insulate during cold drafts and vent during summer humidity.
              </p>

              <div className="pt-2 flex items-center gap-space-xl">
                <div>
                  <p className="font-serif text-3xl text-on-surface font-bold">60</p>
                  <p className="font-label-caps text-[11px] text-on-surface-variant uppercase font-semibold">Archived Pieces Total</p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-on-surface font-bold">1948</p>
                  <p className="font-label-caps text-[11px] text-on-surface-variant uppercase font-semibold">Toyoda Shuttle Loom</p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-on-surface font-bold">0%</p>
                  <p className="font-label-caps text-[11px] text-on-surface-variant uppercase font-semibold">Micro-plastics or Bleach</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-space-md">
              <div className="aspect-[4/5] rounded-xl bg-surface-container overflow-hidden shadow-sm border border-surface-variant">
                <img
                  className="w-full h-full object-cover"
                  alt="Kyoto shuttle loom weaving flax thread"
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
                />
              </div>
              <div className="aspect-[4/5] rounded-xl bg-surface-container overflow-hidden shadow-sm -mt-8 border border-surface-variant">
                <img
                  className="w-full h-full object-cover"
                  alt="Artisan sashiko hand stitching on linen coat seam"
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Patron Reviews Section */}
      <section className="w-full max-w-[1380px] mx-auto px-margin py-space-2xl border-b border-surface-variant">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm border-b border-surface-variant pb-space-md">
          <div>
            <span className="font-label-caps text-label-caps text-secondary tracking-widest block font-bold">
              VERIFIED PATRON EVALUATIONS
            </span>
            <h3 className="font-serif text-3xl text-on-surface font-normal mt-1">
              Patron Monograph Reviews &amp; Ratings
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-500 text-xl font-bold">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              <span className="text-on-surface font-headline-sm text-lg ml-2">
                {reviews.length > 0
                  ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
                  : '0.0'} / 5.0
              </span>
            </div>
            <span className="font-label-caps text-xs text-on-surface-variant">
              ({reviews.length} {reviews.length === 1 ? 'Verified Evaluation' : 'Verified Evaluations'})
            </span>
          </div>
        </div>

        <div className="w-full">
          {/* Reviews List */}
          <div className="w-full space-y-space-md">
            {reviewSuccess && (
              <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 font-label-caps text-xs font-bold flex items-center gap-2 border border-emerald-300 animate-fade-in">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Thank you! Your verified patron review has been recorded.</span>
              </div>
            )}

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rev.avatar && (
                          <img src={rev.avatar} alt={rev.name} className="w-6 h-6 rounded-full object-cover border border-surface-variant" />
                        )}
                        <span className="font-subheading-md text-sm text-on-surface font-bold">{rev.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-label-caps text-[10px] font-bold uppercase">
                          ✓ Verified Patron
                        </span>
                      </div>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                      {Array.from({ length: Number(rev.rating) || 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                      <span className="font-subheading-md text-xs text-on-surface font-bold ml-2">{rev.title}</span>
                    </div>

                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                      "{rev.body}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-space-xl rounded-xl bg-surface-container-low border border-surface-variant/70 text-center space-y-3 py-12">
                <div className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">rate_review</span>
                </div>
                <div>
                  <h5 className="font-headline-sm text-base text-on-surface font-bold">No Evaluations for This Piece Yet</h5>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                    There are no reviews recorded for <strong>{product?.title || 'this garment'}</strong> yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Complete The Look: Architectural Ensemble Recommendation */}
      <section className="w-full max-w-[1380px] mx-auto px-margin py-space-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
          <div className="space-y-space-xs">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest block font-bold">
              HARMONIOUS LAYERING
            </span>
            <h3 className="font-serif text-3xl text-on-surface font-normal">Complete the Look</h3>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Designed to sit together with balanced volumes, muted mineral pigments, and shared tactile weight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {(recommendedProducts && recommendedProducts.length > 0 ? recommendedProducts : (product?.recommendedLooks || [])).map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectProduct && onSelectProduct(rec.id)}
              className="group flex flex-col bg-surface-container-lowest rounded-xl p-space-sm shadow-sm hover:shadow-md transition-all border border-surface-variant/80 cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-lg bg-surface-container-low overflow-hidden mb-space-sm">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={rec.title}
                  src={rec.img}
                />
                <span className="absolute top-2 left-2 bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-full font-label-caps text-[10px] text-on-surface tracking-wider uppercase font-semibold">
                  {rec.badge}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAddRecommended(rec);
                  }}
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center transition-all duration-300 shadow-md hover:bg-secondary hover:scale-110 cursor-pointer z-10"
                  title="Quick Add Piece"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                </button>
              </div>

              <div className="flex items-start justify-between p-1">
                <div>
                  <h4 className="font-subheading-md text-subheading-md text-on-surface group-hover:text-secondary transition-colors font-medium">
                    {rec.title}
                  </h4>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">{rec.fabric}</p>
                </div>
                <span className="font-price-editorial text-price-editorial text-primary font-bold">{rec.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anatomical Size Guide Modal Dialog */}
      {isSizeModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-2xl rounded-xl p-space-lg shadow-2xl relative max-h-[90vh] overflow-y-auto border border-surface-variant">
            <button
              className="absolute top-space-md right-space-md p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
              onClick={() => setIsSizeModalOpen(false)}
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <span className="font-label-caps text-label-caps text-secondary tracking-widest block mb-1 font-bold">
              PROPORTIONAL ARCHITECTURE
            </span>
            <h3 className="font-serif text-2xl text-on-surface mb-2 font-normal">Anatomical Fit Specification</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
              Our dusters are cut deliberately oversized to celebrate the natural weight and drape of 410 GSM linen. Choose based on your height preference and desired spatial presence.
            </p>

            <div className="bg-surface-container-low rounded-lg overflow-hidden mb-space-md border border-surface-variant/60">
              <table className="w-full text-left font-body-sm text-xs">
                <thead className="bg-surface-container font-label-caps text-[10px] text-on-surface uppercase border-b border-surface-variant">
                  <tr>
                    <th className="py-2.5 px-3">Atelier Size</th>
                    <th className="py-2.5 px-3">Chest Circumference</th>
                    <th className="py-2.5 px-3">Garment Length</th>
                    <th className="py-2.5 px-3">Recommended Height</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant/40">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-on-surface">Size I</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">120 cm / 47.2"</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">116 cm / 45.6"</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">158 – 168 cm</td>
                  </tr>
                  <tr className="bg-primary/10">
                    <td className="py-2.5 px-3 font-bold text-on-surface">Size II (Selected)</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">132 cm / 51.9"</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">122 cm / 48.0"</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">168 – 178 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-on-surface">Size III</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">144 cm / 56.6"</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">126 cm / 49.6"</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">178 – 188 cm</td>
                  </tr>
                  <tr className="bg-surface/60">
                    <td className="py-2.5 px-3 font-bold text-on-surface">Size IV</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">156 cm / 61.4"</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">130 cm / 51.1"</td>
                    <td className="py-2.5 px-3 text-on-surface-variant">185+ cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end">
              <button
                className="bg-primary text-on-primary px-space-md py-2.5 rounded-lg font-label-caps text-xs uppercase font-bold tracking-wider hover:bg-secondary transition-colors cursor-pointer"
                onClick={() => setIsSizeModalOpen(false)}
                type="button"
              >
                RETURN TO PIECE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


