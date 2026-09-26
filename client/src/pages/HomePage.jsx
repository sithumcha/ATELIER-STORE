import React, { useState, useEffect } from 'react';

function TypewriterText({ text, speed = 12, delay = 0, className = '', cursor = false }) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && started && displayedText.length < text.length && (
        <span className="inline-block w-[2px] h-[0.9em] bg-secondary animate-pulse ml-0.5 align-middle"></span>
      )}
    </span>
  );
}

const HOMEPAGE_GARMENTS = [


  {
    id: 'a3',
    badge: 'STUDIO STAPLE',
    category: 'Belgian Crisp Flax • 320 GSM',
    title: 'Wabi Pleated Wide-Leg Trouser',
    color: 'Ash Charcoal',
    price: 29000,
    type: 'Trousers',
    sizes: ['28', '30', '32', '34'],
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=90',
  },
  {
    id: 'a4',
    badge: 'ARCHIVE EDITION 09',
    category: 'Raw Slub Mulberry Silk • 210 GSM',
    title: 'Fluid Mulberry Silk Cocoon Dress',
    color: 'Muted Alabaster',
    price: 48000,
    type: 'Dresses & Tunics',
    sizes: ['I', 'II', 'III'],
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=90',
  },
  {
    id: 'a5',
    badge: 'WARM SOLITUDE',
    category: 'Tibetan Mountain Yak • 520 GSM',
    title: 'Undyed Yak Wool Shawl Knit',
    color: 'Natural Oat',
    price: 39000,
    type: 'Knitwear',
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1600&q=90',
  },
  {
    id: 'a6',
    badge: 'LIMITED CUT 24/40',
    category: 'Boiled Småland Fleece • 680 GSM',
    title: 'Småland Tailored Overcoat',
    color: 'Moss Stone',
    price: 65000,
    type: 'Outerwear',
    sizes: ['II', 'III', 'IV'],
    img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=90',
  },
  {
    id: 'a7',
    badge: 'KAKISHIBU DYED',
    category: 'Fermented Persimmon Flax • 280 GSM',
    title: 'Kyoto Plant-Dyed Linen Tunic',
    color: 'Terra Cotta',
    price: 24000,
    type: 'Dresses & Tunics',
    sizes: ['I', 'II', 'III'],
    img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=90',
  },
  {
    id: 'a8',
    badge: 'ARTISANAL ACCESSORY',
    category: 'Wild Andean Fleece • 240 GSM',
    title: 'Hand-Spun Alpaca Fringe Wrap',
    color: 'Cloud Grey',
    price: 18000,
    type: 'Artisanal Accessories',
    sizes: ['One Size (220cm × 90cm)'],
    img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1600&q=90',
  },
];

const PATRON_TESTIMONIALS = [
  {
    id: 1,
    name: 'Elena Rostova',
    location: 'Zurich, Switzerland',
    verified: 'Verified Patron • Edition 07 Collector',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    quote: '“The weight of the raw Mulberry silk cocoon dress is unlike anything from commercial luxury houses. It drapes naturally, breathes beautifully in summer heat, and gains unmatched softness after every gentle cold wash.”',
    garment: 'Silk Cocoon Dress',
  },
  {
    id: 2,
    name: 'Marcus Vance',
    location: 'Kyoto, Japan',
    verified: 'Verified Patron • Bespoke Tailoring Client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    quote: '“Atelier Store’s unstructured Noragi jacket has become my daily staple for studio work. The hand-loomed texture is architectural, and knowing it has lifetime sashiko repair gives complete peace of mind.”',
    garment: 'Unstructured Noragi Duster',
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    location: 'Paris, France',
    verified: 'Verified Patron • Archival Linen Collector',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    quote: '“The plant-dyed linen tunic possesses a tactile richness you can feel immediately. No synthetic stiffeners, just raw organic flax woven with absolute mastery. Truly elevated craftsmanship.”',
    garment: 'Washed Linen Tunic',
  },
  {
    id: 4,
    name: 'David Chen',
    location: 'New York, USA',
    verified: 'Verified Patron • Tailored Overcoat Collector',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    quote: '“Ordered a custom-proportioned trench coat. The fit across the shoulders and arm drop is exact. The craftsmanship and botanical dyeing process set a new standard for sustainable luxury.”',
    garment: 'Architectural Trench Coat',
  },
  {
    id: 5,
    name: 'Amara Silva',
    location: 'Colombo, Sri Lanka',
    verified: 'Verified Patron • Handloom Silk Patron',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    quote: '“The attention to detail from the initial consultation to the final linen passport seam code is astonishing. The fabric stays cool and feels extraordinarily comfortable in tropical weather.”',
    garment: 'Organic Flax Robe',
  },
  {
    id: 6,
    name: 'Isabella Rossi',
    location: 'Milan, Italy',
    verified: 'Verified Patron • Haute Textiles Connoisseur',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    quote: '“The tactile experience of Atelier Store’s hand-spun alpaca fringe wrap is transcendent. In Milan, everyone asks about the weave provenance. It is rare to find such timeless, soulful luxury.”',
    garment: 'Alpaca Fringe Wrap',
  },
  {
    id: 7,
    name: 'Kenji Takahashi',
    location: 'Tokyo, Japan',
    verified: 'Verified Patron • Japanese Indigo Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    quote: '“The natural mud and botanical indigo dyeing gives each silhouette a subtle, living patina that gets better with every season. Truly an investment in slow, conscious fashion.”',
    garment: 'Botanical Indigo Noragi',
  },
];

export default function HomePage({ onAddToCart, onSelectProduct, onToggleWishlist, wishlistIds = [], onExploreShop }) {
  const [activeFilter, setActiveFilter] = useState('All Silhouettes');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedNotice, setAddedNotice] = useState({});
  const [isFittingModalOpen, setIsFittingModalOpen] = useState(false);
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('atelierstore_db_products_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return [];
  });
  const [loadingDb, setLoadingDb] = useState(() => products.length === 0);

  // Testimonials Circular Rotating Carousel State
  const [testimonialsList, setTestimonialsList] = useState(PATRON_TESTIMONIALS);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const fetchApprovedReviews = async () => {
    let approvedRevs = [];
    try {
      const localRevs = JSON.parse(localStorage.getItem('atelierstore_all_user_reviews') || '[]');
      approvedRevs = localRevs.filter((r) => r.approved || r.status === 'Approved');
    } catch (e) {}

    try {
      const res = await fetch('http://localhost:5001/api/reviews/approved');
      if (res.ok) {
        const dbApproved = await res.json();
        if (Array.isArray(dbApproved) && dbApproved.length > 0) {
          const mergedMap = new Map();
          [...approvedRevs, ...dbApproved].forEach((r) => {
            const key = r._id || r.id;
            mergedMap.set(key, r);
          });
          approvedRevs = Array.from(mergedMap.values());
        }
      }
    } catch (err) {}

    if (approvedRevs.length > 0) {
      const userTestimonials = approvedRevs.map((rev) => ({
        id: rev._id || rev.id || 'rev_' + Math.random(),
        name: rev.userName || rev.name || 'Patron Collector',
        location: rev.userLocation || rev.location || 'Kyoto / Global',
        verified: '★ Approved Patron Evaluation',
        avatar: rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        quote: rev.body?.startsWith('“') ? rev.body : `“${rev.body}”`,
        garment: rev.productTitle || 'Archival Garment',
      }));

      setTestimonialsList([...userTestimonials, ...PATRON_TESTIMONIALS]);
    }
  };

  // Auto-rotate testimonials circularly every 4 seconds
  useEffect(() => {
    if (isTestimonialHovered) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonialsList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isTestimonialHovered, testimonialsList]);

  // Scroll reveal IntersectionObserver for smooth scroll-down animations
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-font-on-scroll, .reveal-scale-on-scroll');

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.88) {
        el.classList.add('revealed');
      }
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [products, activeFilter]);

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonialsList.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  useEffect(() => {
    fetchDbProducts();
  }, []);

  const fetchDbProducts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((p, idx) => {
            let numPrice = typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 42000;
            if (numPrice > 0 && numPrice < 1000) numPrice = numPrice * 100;

            let displayImg = null;
            if (p.images && Array.isArray(p.images) && p.images.length > 0 && p.images[0]) {
              displayImg = p.images[0];
            } else if (p.img) {
              displayImg = p.img;
            } else if (p.image) {
              displayImg = p.image;
            } else {
              displayImg = HOMEPAGE_GARMENTS[idx % HOMEPAGE_GARMENTS.length].img;
            }

            return {
              id: p._id || p.id,
              badge: p.badge || 'LIMITED EDITION',
              category: p.category || p.gsm || '100% Normandy Flax',
              title: p.title || p.name || 'Solitude Garment',
              color: p.studio || p.color || 'Kyoto Preservation Studio',
              studio: p.studio || 'Kyoto Atelier • Loomed 2026',
              price: numPrice,
              numericPrice: numPrice,
              type: p.category?.includes('Outerwear') ? 'Outerwear' : p.category?.includes('Dress') ? 'Dresses & Tunics' : p.category?.includes('Trouser') ? 'Trousers' : p.category?.includes('Knit') ? 'Knitwear' : 'Outerwear',
              sizes: p.sizes ? p.sizes.map((s) => typeof s === 'string' ? s : s.label || s.roman) : ['S', 'M', 'L', 'XL'],
              img: displayImg,
              raw: p,
            };
          });
          setProducts(formatted);
          try {
            localStorage.setItem('atelierstore_db_products_cache', JSON.stringify(formatted));
          } catch (err) { }
        }
      }
    } catch (err) {
      console.log('Database fetch fallback to homepage garments:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  const handleSelectSize = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddGarmentToCart = (p) => {
    const chosenSize = selectedSizes[p.id] || (p.sizes && p.sizes[0]) || 'M';
    if (onAddToCart) {
      onAddToCart({
        id: p.id,
        title: `${p.title} (Size: ${chosenSize})`,
        price: p.price,
        img: p.img,
      });
    }

    setAddedNotice((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedNotice((prev) => ({ ...prev, [p.id]: false }));
    }, 1600);
  };

  const getCategoryCount = (key) => {
    if (!products || products.length === 0) return 0;
    if (key === 'All Silhouettes') return products.length;
    return products.filter((p) => {
      const catLower = (p.category || '').toLowerCase() + ' ' + (p.type || '').toLowerCase() + ' ' + (p.title || '').toLowerCase();
      if (key === 'Outerwear') return p.type === 'Outerwear' || catLower.includes('outerwear') || catLower.includes('jacket') || catLower.includes('coat') || catLower.includes('duster') || catLower.includes('blazer');
      if (key === 'Dresses & Tunics') return p.type === 'Dresses & Tunics' || catLower.includes('dress') || catLower.includes('tunic') || catLower.includes('haori');
      if (key === 'Trousers') return p.type === 'Trousers' || catLower.includes('trouser') || catLower.includes('pant') || catLower.includes('hakama') || catLower.includes('culottes');
      if (key === 'Knitwear') return p.type === 'Knitwear' || catLower.includes('knit') || catLower.includes('sweater') || catLower.includes('cardigan') || catLower.includes('wool');
      if (key === 'Artisanal Accessories') return p.type === 'Artisanal Accessories' || catLower.includes('accessories') || catLower.includes('wrap') || catLower.includes('scarf') || catLower.includes('fringe');
      return false;
    }).length;
  };

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'All Silhouettes') return true;
    const catLower = (p.category || '').toLowerCase() + ' ' + (p.type || '').toLowerCase() + ' ' + (p.title || '').toLowerCase();
    if (activeFilter === 'Outerwear' || activeFilter.includes('Outerwear')) return p.type === 'Outerwear' || catLower.includes('outerwear') || catLower.includes('jacket') || catLower.includes('coat') || catLower.includes('duster') || catLower.includes('blazer');
    if (activeFilter === 'Dresses & Tunics' || activeFilter.includes('Dresses')) return p.type === 'Dresses & Tunics' || catLower.includes('dress') || catLower.includes('tunic') || catLower.includes('haori');
    if (activeFilter === 'Trousers' || activeFilter.includes('Trousers')) return p.type === 'Trousers' || catLower.includes('trouser') || catLower.includes('pant') || catLower.includes('hakama') || catLower.includes('culottes');
    if (activeFilter === 'Knitwear' || activeFilter.includes('Knitwear')) return p.type === 'Knitwear' || catLower.includes('knit') || catLower.includes('sweater') || catLower.includes('cardigan') || catLower.includes('wool');
    if (activeFilter === 'Artisanal Accessories' || activeFilter.includes('Accessories')) return p.type === 'Artisanal Accessories' || catLower.includes('accessories') || catLower.includes('wrap') || catLower.includes('scarf') || catLower.includes('fringe');
    return true;
  });


  return (
    <div className="w-full bg-surface font-body-md text-body-md text-on-surface antialiased">
      {/* Top Notification Accent Bar */}
      <section className="w-full bg-surface-container-high py-space-xs text-center border-b border-outline-variant/30 reveal-on-scroll">
        <div className="max-w-[1380px] mx-auto px-margin flex items-center justify-center gap-space-md animate-top-banner-text">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary top-accent-pulse"></span>
          <p className="font-label-uppercase text-label-uppercase tracking-[0.2em] text-on-surface font-semibold">
            EDITION 09 / SPRING EQUINOX — THE SILENT DRAPERY COLLECTION NOW UNVEILED
          </p>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary top-accent-pulse"></span>
        </div>
      </section>

      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-surface pt-space-xl pb-space-2xl">
        <div className="max-w-[1380px] mx-auto px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Narrative Left */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-space-md pr-0 lg:pr-space-lg">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container rounded self-start reveal-on-scroll">
                <span className="material-symbols-outlined text-[14px] text-secondary animate-pulse">eco</span>
                <span className="font-label-uppercase text-label-uppercase text-on-surface tracking-widest font-semibold">
                  <TypewriterText text="EDITION 09 • SPRING EQUINOX COLLECTION" speed={25} delay={100} cursor={true} />
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg lg:text-[48px] lg:leading-[56px] tracking-tight font-normal reveal-font-on-scroll hero-title-anim animate-hero-font-shimmer min-h-[110px] lg:min-h-[120px]">
                <TypewriterText text="Garments of Breath & Fiber — Handcrafted Raiment for Still Living." speed={30} delay={400} cursor={true} />
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed reveal-on-scroll min-h-[70px]">
                <TypewriterText text="Tactile garments crafted from slow-loomed raw linen, unbleached mulberry silk, and botanical indigo. Designed for timeless form, relaxed silhouette, and poetic ease across seasons." speed={18} delay={1200} cursor={false} />
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-sm reveal-on-scroll">
                <a
                  className="inline-flex items-center gap-space-xs px-space-lg py-space-md bg-primary text-on-primary font-label-uppercase text-label-uppercase rounded transition-all hover:bg-on-surface-variant shadow-sm hover:translate-x-0.5 cursor-pointer"
                  href="#editions-grid"
                >
                  <span><TypewriterText text="Explore Garments & Collections" speed={20} delay={2200} cursor={false} /></span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
                <a
                  className="inline-flex items-center gap-space-xs px-space-lg py-space-md bg-surface-container text-on-surface font-label-uppercase text-label-uppercase rounded transition-all hover:bg-surface-container-high cursor-pointer"
                  href="#atelier-philosophy"
                >
                  <span><TypewriterText text="The Weavers' Provenance" speed={20} delay={2500} cursor={false} /></span>
                  <span className="material-symbols-outlined text-[16px]">north_east</span>
                </a>
              </div>
              {/* Micro Metatag Strip */}
              <div className="pt-space-md flex flex-wrap items-center gap-space-md text-on-surface-variant text-body-sm font-body-sm">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">history_edu</span>
                  <span><TypewriterText text="18-60 Cut Limited Batches" speed={20} delay={2800} cursor={false} /></span>
                </div>
                <span className="text-outline-variant">•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">palette</span>
                  <span><TypewriterText text="100% Plant & Mud Dyed" speed={20} delay={3100} cursor={false} /></span>
                </div>
                <span className="text-outline-variant">•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">handyman</span>
                  <span><TypewriterText text="Free Lifetime Sashiko Repair" speed={20} delay={3400} cursor={false} /></span>
                </div>
              </div>
            </div>

            {/* Hero Featured Card Right */}
            {(() => {
              if (loadingDb && (!products || products.length === 0)) {
                return (
                  <div className="lg:col-span-5 relative mt-space-lg lg:mt-0 reveal-scale-on-scroll">
                    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md border border-surface-variant animate-pulse">
                      <div className="aspect-[3/4] w-full bg-surface-container-high rounded-lg flex items-center justify-center relative overflow-hidden">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 animate-spin">
                          cyclone
                        </span>
                        <span className="absolute bottom-4 font-label-uppercase text-[10px] text-on-surface-variant tracking-widest uppercase font-semibold">
                          Fetching Archival Garment...
                        </span>
                      </div>
                      <div className="mt-space-sm pt-space-xs flex items-center justify-between">
                        <div className="h-4 bg-surface-container-high rounded w-1/2"></div>
                        <div className="h-4 bg-surface-container-high rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                );
              }

              const heroGarment = (products && products.length > 0) ? products[0] : null;
              if (!heroGarment) return null;

              const heroIdStr = String(heroGarment.id || heroGarment._id || '');
              const isHeroFav = wishlistIds.some((id) => String(id) === heroIdStr || String(id) === String(heroGarment._id));
              const numPrice = typeof heroGarment.price === 'number' ? heroGarment.price : (heroGarment.numericPrice || 48000);

              return (
                <div className="lg:col-span-5 relative mt-space-lg lg:mt-0 reveal-scale-on-scroll">
                  <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md transition-all hover:shadow-xl relative group card-shimmer">
                    {/* Badge overlay */}
                    <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
                      <span className="px-space-sm py-0.5 bg-surface/90 backdrop-blur text-on-surface font-label-uppercase text-[10px] tracking-widest rounded shadow-sm">
                        {heroGarment.badge || 'HAND-NUMBERED CUT 18/60'}
                      </span>
                      <span className="px-space-sm py-0.5 bg-secondary text-on-secondary font-label-uppercase text-[9px] tracking-wider rounded self-start">
                        EDITION PREVIEW
                      </span>
                    </div>
                    {/* Wishlist quick toggle */}
                    <button
                      aria-label="Save to wishlist"
                      onClick={() => onToggleWishlist && onToggleWishlist(heroGarment)}
                      className={`absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-surface/85 backdrop-blur flex items-center justify-center transition-all shadow-sm wishlist-btn cursor-pointer ${isHeroFav ? 'text-red-600 bg-surface scale-110 shadow-md' : 'text-on-surface hover:text-red-600'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isHeroFav ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                    {/* Image with Aspect Ratio */}
                    <div
                      className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface-container relative cursor-pointer"
                      onClick={() => onSelectProduct && onSelectProduct(heroGarment.id)}
                    >
                      <img
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        alt={heroGarment.title}
                        src={heroGarment.img}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                      <div className="absolute bottom-3 left-3 right-3 bg-surface/90 backdrop-blur-md px-space-md py-space-sm rounded flex items-center justify-between">
                        <div>
                          <p className="font-label-uppercase text-[10px] text-secondary tracking-widest uppercase">
                            {heroGarment.studio || heroGarment.color || 'Kyoto Atelier • Loomed 2026'}
                          </p>
                          <p className="font-headline-sm text-[16px] text-on-surface font-medium leading-tight">
                            {heroGarment.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-title-md text-title-md text-on-surface font-bold">
                            Rs. {Math.round(numPrice).toLocaleString('en-LK')}
                          </span>
                          <span className="block font-body-sm text-[10px] text-on-surface-variant">
                            Tax &amp; Duty Incl.
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Detail Strip Below Image */}
                    <div className="mt-space-sm pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span>{heroGarment.category || 'Pure Normandy Heavy Flax • 410 GSM'}</span>
                      <button
                        type="button"
                        onClick={() => onSelectProduct && onSelectProduct(heroGarment.id)}
                        className="font-label-uppercase text-label-uppercase text-secondary flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none p-0"
                      >
                        View Specs <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Hero Trust Pillars Strip */}
          <div className="mt-space-2xl grid grid-cols-2 lg:grid-cols-4 gap-space-md pt-space-lg bg-surface-container-low rounded-xl p-space-lg">
            <div className="flex items-start gap-space-sm reveal-on-scroll stagger-1">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 pillar-icon-float">
                <span className="material-symbols-outlined text-secondary text-[20px]">filter_vintage</span>
              </div>
              <div>
                <h4 className="font-title-md text-[14px] text-on-surface font-medium uppercase tracking-wider">
                  Fiber Discipline
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  100% unbleached flax, wild tussar silk, and Tibetan yak wool.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-space-sm reveal-on-scroll stagger-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 pillar-icon-float">
                <span className="material-symbols-outlined text-secondary text-[20px]">opacity</span>
              </div>
              <div>
                <h4 className="font-title-md text-[14px] text-on-surface font-medium uppercase tracking-wider">
                  Plant Pigments
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Living indigo vats, fermented persimmon kakishibu, and walnut husk.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-space-sm reveal-on-scroll stagger-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 pillar-icon-float">
                <span className="material-symbols-outlined text-secondary text-[20px]">precision_manufacturing</span>
              </div>
              <div>
                <h4 className="font-title-md text-[14px] text-on-surface font-medium uppercase tracking-wider">
                  Slow Atelier
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Individually tailored in Kyoto &amp; Stockholm in batches of 20 to 60.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-space-sm reveal-on-scroll stagger-4">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 pillar-icon-float">
                <span className="material-symbols-outlined text-secondary text-[20px]">auto_fix_high</span>
              </div>
              <div>
                <h4 className="font-title-md text-[14px] text-on-surface font-medium uppercase tracking-wider">
                  Lifetime Garment Passport
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Free sashiko re-stitching and seasonal botanical re-dyeing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WARDROBE DISCIPLINES (Bento Grid) */}
      <section className="w-full bg-surface-container-lowest py-space-2xl">
        <div className="max-w-[1380px] mx-auto px-margin">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
            <div className="reveal-font-on-scroll">
              <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block">
                CURATED ARCHITECTURE
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-normal mt-1">
                Wardrobe Disciplines
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md reveal-on-scroll">
              Archetypal silhouettes constructed from foundational fibers. Form created to drape freely without stiffness or synthetic tension.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-md">
            <div
              onClick={() => setActiveFilter('Outerwear')}
              className="lg:col-span-7 relative group overflow-hidden rounded-xl bg-surface-container aspect-[16/10] flex flex-col justify-end p-space-lg shadow-sm cursor-pointer reveal-scale-on-scroll stagger-1"
            >
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Unstructured Tailoring & Outerwear"
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent"></div>
              <div className="relative z-10 flex items-end justify-between text-on-primary">
                <div>
                  <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary-fixed block mb-1">
                    DISCIPLINE 01 • {getCategoryCount('Outerwear')} PIECES
                  </span>
                  <h3 className="font-headline-md text-headline-md font-normal leading-tight">
                    Unstructured Tailoring &amp; Outerwear
                  </h3>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim mt-1 max-w-sm">
                    Duster coats, noragi wrap jackets, haori blazers, and washed linen kimono coats.
                  </p>
                </div>
                <span className="w-11 h-11 rounded-full bg-surface text-on-surface flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </span>
              </div>
            </div>

            <div
              onClick={() => setActiveFilter('Dresses & Tunics')}
              className="lg:col-span-5 relative group overflow-hidden rounded-xl bg-surface-container aspect-[16/10] md:aspect-auto flex flex-col justify-end p-space-lg shadow-sm cursor-pointer reveal-scale-on-scroll stagger-2"
            >
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Draped Dresses & Silk Tunics"
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent"></div>
              <div className="relative z-10 flex items-end justify-between text-on-primary">
                <div>
                  <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary-fixed block mb-1">
                    DISCIPLINE 02 • {getCategoryCount('Dresses & Tunics')} PIECES
                  </span>
                  <h3 className="font-headline-md text-headline-md font-normal leading-tight">
                    Draped Dresses &amp; Silk Tunics
                  </h3>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim mt-1 max-w-xs">
                    Fluid mulberry silk gowns, tiered raw linen smocks, and slip garments.
                  </p>
                </div>
                <span className="w-11 h-11 rounded-full bg-surface text-on-surface flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </span>
              </div>
            </div>

            <div
              onClick={() => setActiveFilter('Knitwear')}
              className="lg:col-span-5 relative group overflow-hidden rounded-xl bg-surface-container aspect-[16/10] md:aspect-auto flex flex-col justify-end p-space-lg shadow-sm cursor-pointer reveal-scale-on-scroll stagger-3"
            >
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Knitwear & Undyed Fibers"
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1600&q=90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent"></div>
              <div className="relative z-10 flex items-end justify-between text-on-primary">
                <div>
                  <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary-fixed block mb-1">
                    DISCIPLINE 03 • {getCategoryCount('Knitwear')} PIECES
                  </span>
                  <h3 className="font-headline-md text-headline-md font-normal leading-tight">
                    Knitwear &amp; Undyed Fibers
                  </h3>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim mt-1 max-w-xs">
                    High-plateau yak wool cardigans, wild alpaca crewnecks, and organic waffle knitwear.
                  </p>
                </div>
                <span className="w-11 h-11 rounded-full bg-surface text-on-surface flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </span>
              </div>
            </div>

            <div
              onClick={() => setActiveFilter('Trousers')}
              className="lg:col-span-7 relative group overflow-hidden rounded-xl bg-surface-container aspect-[16/10] flex flex-col justify-end p-space-lg shadow-sm cursor-pointer reveal-scale-on-scroll stagger-4"
            >
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Relaxed Trousers & Culottes"
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent"></div>
              <div className="relative z-10 flex items-end justify-between text-on-primary">
                <div>
                  <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary-fixed block mb-1">
                    DISCIPLINE 04 • {getCategoryCount('Trousers')} PIECES
                  </span>
                  <h3 className="font-headline-md text-headline-md font-normal leading-tight">
                    Relaxed Trousers &amp; Culottes
                  </h3>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim mt-1 max-w-sm">
                    Wide-leg pleated linen hakama pants, elasticated drawstring culottes, and shuttle-loom denim.
                  </p>
                </div>
                <span className="w-11 h-11 rounded-full bg-surface text-on-surface flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NUMBERED EDITIONS — CLOTHING PRODUCT GRID */}
      <section className="w-full bg-surface py-space-2xl" id="editions-grid">
        <div className="max-w-[1380px] mx-auto px-margin">
          <div className="flex flex-col space-y-space-md mb-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
              <div className="reveal-font-on-scroll">
                <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
                  CATALOGUE RAISONNÉ
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-normal">
                  Numbered Editions / Ready for Fitting
                </h2>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant reveal-on-scroll">
                Showing {filteredProducts.length} Selected Archetypes • Kyoto &amp; Stockholm Repositories
              </span>
            </div>
            <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs pt-space-xs scrollbar-none reveal-on-scroll">
              {[
                { key: 'All Silhouettes', label: `All Silhouettes (${products.length})` },
                { key: 'Outerwear', label: `Outerwear (${getCategoryCount('Outerwear')})` },
                { key: 'Dresses & Tunics', label: `Dresses & Tunics (${getCategoryCount('Dresses & Tunics')})` },
                { key: 'Trousers', label: `Trousers (${getCategoryCount('Trousers')})` },
                { key: 'Knitwear', label: `Knitwear (${getCategoryCount('Knitwear')})` },
                { key: 'Artisanal Accessories', label: `Artisanal Accessories (${getCategoryCount('Artisanal Accessories')})` },
              ].map((fObj) => (
                <button
                  key={fObj.key}
                  onClick={() => setActiveFilter(fObj.key)}
                  className={`px-space-md py-space-xs rounded-full font-label-uppercase text-label-uppercase shrink-0 transition-colors cursor-pointer ${activeFilter === fObj.key || activeFilter.includes(fObj.key)
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                >
                  {fObj.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((p, idx) => {
              const pIdStr = String(p.id || p._id || '');
              const isFavorited = wishlistIds.some((id) => String(id) === pIdStr || String(id) === String(p._id));
              const isAdded = addedNotice[p.id];
              const staggerClass = `stagger-${(idx % 4) + 1}`;
              return (
                <div
                  key={p.id}
                  className={`group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all card-shimmer reveal-on-scroll ${staggerClass}`}
                >
                  <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden">
                    <span className="absolute top-3 left-3 z-10 px-space-xs py-0.5 bg-surface/90 backdrop-blur font-label-uppercase text-[10px] text-on-surface tracking-wider rounded">
                      {p.badge}
                    </span>
                    <button
                      aria-label="Add to wishlist"
                      onClick={() => onToggleWishlist && onToggleWishlist(p)}
                      className={`wishlist-btn absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center transition-all cursor-pointer ${isFavorited ? 'text-red-600 bg-surface scale-110 shadow-md' : 'text-on-surface hover:text-red-600'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isFavorited ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                    <img
                      onClick={() => onSelectProduct && onSelectProduct(p.id)}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      alt={p.title}
                      src={p.img}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-surface/95 backdrop-blur p-space-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between">
                      <div className="flex items-center gap-1 font-label-uppercase text-[10px] text-on-surface">
                        {p.sizes.map((sz) => (
                          <span
                            key={sz}
                            onClick={() => handleSelectSize(p.id, sz)}
                            className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${(selectedSizes[p.id] || p.sizes[0]) === sz
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container hover:bg-primary hover:text-on-primary'
                              }`}
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleAddGarmentToCart(p)}
                        className="font-label-uppercase text-[10px] text-secondary font-semibold hover:underline cursor-pointer"
                      >
                        Quick Add +
                      </button>
                    </div>
                  </div>
                  <div className="p-space-md flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-label-uppercase text-on-surface-variant tracking-wider">
                        <span>{p.category}</span>
                      </div>
                      <h3
                        onClick={() => onSelectProduct && onSelectProduct(p.id)}
                        className="font-headline-sm text-[18px] text-on-surface font-normal mt-1 leading-snug cursor-pointer group-hover:text-secondary transition-colors"
                      >
                        {p.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Color: {p.color}
                      </p>
                    </div>
                    <div className="pt-space-md flex items-center justify-between">
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        Rs. {Math.round(p.price).toLocaleString('en-LK')}
                      </span>
                      <button
                        onClick={() => handleAddGarmentToCart(p)}
                        className={`px-space-sm py-1 rounded font-label-uppercase text-[10px] transition-colors cursor-pointer ${isAdded
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary'
                          }`}
                      >
                        {isAdded ? 'Added ✓' : 'Select Size & Bag'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. BRAND PHILOSOPHY & CIRCULAR ATELIER MANIFESTO */}
      <section className="w-full bg-surface-container-low py-space-2xl" id="atelier-philosophy">
        <div className="max-w-[1380px] mx-auto px-margin">
          <div className="max-w-3xl mx-auto text-center space-y-space-md mb-space-2xl">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase reveal-on-scroll">
              THE SLOW WEAVING MANIFESTO
            </span>
            <blockquote className="font-quote-display text-quote-display md:text-[32px] md:leading-[44px] text-on-surface italic font-normal reveal-font-on-scroll">
              “We reject the disposable rush of fashion. A garment should age alongside you, softening with every wash and deepening in character.”
            </blockquote>
            <div className="flex items-center justify-center gap-space-sm reveal-on-scroll">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-uppercase text-[11px]">
                AE
              </div>
              <span className="font-body-md text-body-md text-on-surface font-medium">
                Kenzo Tanaka &amp; Astrid Lindqvist
              </span>
              <span className="text-on-surface-variant">• Atelier Directors</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-surface-container-lowest p-space-xl rounded-xl flex flex-col justify-between shadow-sm reveal-scale-on-scroll stagger-1">
              <div className="space-y-space-sm">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary pillar-icon-float">
                  <span className="material-symbols-outlined text-[24px]">compost</span>
                </div>
                <span className="font-label-uppercase text-label-uppercase tracking-wider text-secondary block">
                  PILLAR I • ZERO HEAVY METALS
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  100% Non-Toxic Botanical Dyeing
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Our colorways originate exclusively in natural indigo fermentation pits, aged persimmon vats, and simmered walnut husks. Gentle on human skin and circular for the soil.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md bg-surface-container-low/50 p-space-sm rounded flex items-center justify-between">
                <span className="font-body-sm text-[12px] text-on-surface-variant">Indigo Potency Cycle</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-uppercase text-[11px] font-semibold text-on-surface">Day 140 Ferment</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-xl flex flex-col justify-between shadow-sm reveal-scale-on-scroll stagger-2">
              <div className="space-y-space-sm">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary pillar-icon-float">
                  <span className="material-symbols-outlined text-[24px]">straighten</span>
                </div>
                <span className="font-label-uppercase text-label-uppercase tracking-wider text-secondary block">
                  PILLAR II • BESPOKE DRAPE
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Bespoke Pattern Proportion Service
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  We accommodate individual bodily postures and heights. Every jacket cut may be ordered with custom sleeve drops, lapel ease, and altered torso room at zero surplus cost.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md bg-surface-container-low/50 p-space-sm rounded flex items-center justify-between">
                <span className="font-body-sm text-[12px] text-on-surface-variant">Pattern Precision</span>
                <span className="font-label-uppercase text-[11px] font-semibold text-on-surface">Hand-Drafted Muslins</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-xl flex flex-col justify-between shadow-sm reveal-scale-on-scroll stagger-3">
              <div className="space-y-space-sm">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary pillar-icon-float">
                  <span className="material-symbols-outlined text-[24px]">change_circle</span>
                </div>
                <span className="font-label-uppercase text-label-uppercase tracking-wider text-secondary block">
                  PILLAR III • GENERATIONAL CARE
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  The Lifetime Garment Passport
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Every piece carries an archival NFC cloth label. When wear or fraying occurs, dispatch your garment to Kyoto or Stockholm for complimentary Sashiko reinforcement or re-dyeing.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md bg-surface-container-low/50 p-space-sm rounded flex items-center justify-between">
                <span className="font-body-sm text-[12px] text-on-surface-variant">Archival Mending Record</span>
                <span className="font-label-uppercase text-[11px] font-semibold text-on-surface">Complimentary For Life</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 CIRCULAR ROTATING PATRON TESTIMONIALS CAROUSEL */}
      <section className="w-full bg-surface-container-low/70 py-space-2xl border-t border-b border-surface-variant/40 overflow-hidden relative">
        <div className="max-w-[1380px] mx-auto px-margin">

          <div className="text-center max-w-2xl mx-auto mb-space-xl reveal-font-on-scroll">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-label-caps text-[11px] uppercase tracking-widest mb-3">
              <span className="material-symbols-outlined text-sm">stars</span>
              <span>PATRON DISCOURSES &amp; REVIEWS</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-normal">
              Words From Our Global Patrons
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Reflections on tactile luxury, organic drape, and generational sashiko mending.
            </p>
          </div>

          {/* Interactive Rotating Carousel Container */}
          <div
            className="max-w-4xl mx-auto relative bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-xl border border-surface-variant/80 overflow-hidden group reveal-scale-on-scroll"
            onMouseEnter={() => setIsTestimonialHovered(true)}
            onMouseLeave={() => setIsTestimonialHovered(false)}
          >
            {/* Background Ambient Glow Circles */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

            {/* Quotation Watermark */}
            <span className="material-symbols-outlined absolute top-4 right-6 text-[120px] text-surface-container-high/40 select-none pointer-events-none">
              format_quote
            </span>

            {/* Active Testimonial Card Content with Animated Transition */}
            {(() => {
              const currentT = testimonialsList[testimonialIndex] || testimonialsList[0];

              return (
                <div key={currentT.id} className="relative z-10 flex flex-col md:flex-row items-center gap-8 animate-fade-in">

                  {/* Patron Avatar with Circular Orbit Frame */}
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-secondary via-primary to-secondary shadow-lg">
                      <img
                        src={currentT.avatar}
                        alt={currentT.name}
                        className="w-full h-full rounded-full object-cover border-2 border-surface-container-lowest shadow-inner"
                      />
                    </div>
                    {/* Badge Pill */}
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-label-caps text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                      ★ 5.0 Rating
                    </span>
                  </div>

                  {/* Testimonial Quote & Information */}
                  <div className="flex-1 text-center md:text-left space-y-4">
                    {/* Stars */}
                    <div className="flex items-center justify-center md:justify-start gap-1 text-secondary">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[18px] fill-current">
                          star
                        </span>
                      ))}
                      <span className="font-label-caps text-xs text-on-surface-variant ml-2 uppercase font-semibold">
                        {currentT.verified}
                      </span>
                    </div>

                    {/* Quote Text */}
                    <blockquote className="font-serif text-lg md:text-xl text-on-surface leading-relaxed italic">
                      {currentT.quote}
                    </blockquote>

                    {/* Author & City */}
                    <div className="pt-2 border-t border-surface-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-title-md text-base text-on-surface font-bold">
                          {currentT.name}
                        </h4>
                        <span className="font-body-sm text-xs text-on-surface-variant">
                          {currentT.location}
                        </span>
                      </div>

                      <span className="px-3 py-1 rounded-lg bg-surface-container-low border border-surface-variant text-secondary font-label-caps text-xs font-semibold self-center sm:self-auto">
                        Garment: {currentT.garment}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* Circular Carousel Controls & Indicators */}
            <div className="mt-8 pt-6 border-t border-surface-variant/50 flex items-center justify-between">

              {/* Left Previous Button */}
              <button
                type="button"
                onClick={handlePrevTestimonial}
                aria-label="Previous Testimonial"
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-primary hover:text-on-primary border border-surface-variant flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>

              {/* Circular Dots & Index Indicator */}
              <div className="flex items-center gap-2">
                {testimonialsList.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTestimonialIndex(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${testimonialIndex === idx
                      ? 'w-8 bg-secondary shadow-xs'
                      : 'w-2.5 bg-surface-container-high hover:bg-outline'
                      }`}
                  />
                ))}
              </div>

              {/* Right Next Button */}
              <button
                type="button"
                onClick={handleNextTestimonial}
                aria-label="Next Testimonial"
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-primary hover:text-on-primary border border-surface-variant flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>

            </div>

            {/* Auto-rotation status badge */}
            <div className="text-center mt-3">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
                {isTestimonialHovered ? '⏸ Auto-rotation Paused on Hover' : '🔄 Rotating Continuously Every 4 Seconds'}
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 5. VIP FITTING & CONCIERGE BANNER */}
      <section className="w-full bg-primary-container text-on-primary py-space-2xl reveal-scale-on-scroll">
        <div className="max-w-[1380px] mx-auto px-margin">
          <div className="bg-surface-container-highest/10 rounded-2xl p-space-xl lg:p-space-2xl backdrop-blur relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary/15 blur-3xl pointer-events-none"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              <div className="lg:col-span-8 space-y-space-md">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 bg-on-primary/10 rounded reveal-on-scroll">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
                  <span className="font-label-uppercase text-[10px] tracking-widest text-on-primary-fixed uppercase">
                    By Personal Appointment Only
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg font-normal tracking-tight text-on-primary reveal-font-on-scroll">
                  Reserve a Private Fitting Consultation — Kyoto, Stockholm, or Le Marais.
                </h2>
                <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl leading-relaxed reveal-on-scroll">
                  Experience the drape of unbleached fabrics firsthand. Meet with our resident pattern master for personalized bodily measurements, or book an immersive 1-on-1 Virtual Fabric Concierge session dispatched directly to your home.
                </p>
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs reveal-on-scroll">
                  <button
                    onClick={() => setIsFittingModalOpen(true)}
                    className="px-space-lg py-space-md bg-surface text-on-surface font-label-uppercase text-label-uppercase rounded transition-all hover:bg-surface-container shadow hover:translate-x-0.5 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Book In-Studio Fitting</span>
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  </button>
                  <button
                    onClick={() => setIsFittingModalOpen(true)}
                    className="px-space-lg py-space-md bg-transparent text-on-primary border border-on-primary/20 font-label-uppercase text-label-uppercase rounded transition-colors hover:bg-on-primary/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Request Textile Swatch Folio</span>
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                  </button>
                </div>
              </div>
              <div className="lg:col-span-4 bg-surface-container-high/10 rounded-xl p-space-lg border border-on-primary/10 space-y-space-md mt-space-lg lg:mt-0 reveal-on-scroll stagger-2">
                <h4 className="font-label-uppercase text-label-uppercase tracking-wider text-secondary-fixed">
                  Atelier Availability
                </h4>
                <div className="space-y-space-sm text-body-sm font-body-sm text-on-primary-container">
                  <div className="flex items-center justify-between pb-space-xs border-b border-on-primary/10">
                    <span className="text-on-primary">Kyoto Gion Suite</span>
                    <span className="text-secondary-fixed font-medium">3 Slots Open This Week</span>
                  </div>
                  <div className="flex items-center justify-between pb-space-xs border-b border-on-primary/10">
                    <span className="text-on-primary">Stockholm Östermalm</span>
                    <span className="text-secondary-fixed font-medium">Available Thursday</span>
                  </div>
                  <div className="flex items-center justify-between pb-space-xs border-b border-on-primary/10">
                    <span className="text-on-primary">Paris Le Marais</span>
                    <span className="text-secondary-fixed font-medium">Fully Booked • Waitlist</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-primary">Virtual Digital Concierge</span>
                    <span className="text-secondary-fixed font-medium">Worldwide Daily</span>
                  </div>
                </div>
                <div className="pt-space-xs flex items-center gap-2 text-[11px] text-on-primary-container/80">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  <span>All in-studio consultations include Japanese ceremonial green tea service.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitting Appointment Booking Modal */}
      {isFittingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-primary/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-xl shadow-2xl relative border border-outline-variant/30">
            <button
              onClick={() => setIsFittingModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <div className="space-y-space-md">
              <div>
                <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
                  ATELIER RESERVATION
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                  Book Your Private Atelier Fitting
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Select your preferred showroom location and date for a 1-on-1 bespoke measurement session.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you. Your private fitting consultation has been requested. Our Atelier Concierge will contact you shortly.');
                  setIsFittingModalOpen(false);
                }}
                className="space-y-space-sm"
              >
                <div>
                  <label className="block font-label-uppercase text-[11px] text-on-surface mb-1">Showroom Location</label>
                  <select className="w-full bg-surface-container-low border border-outline-variant/40 rounded p-space-sm font-body-sm text-on-surface focus:outline-none">
                    <option>Kyoto Flagship Suite (Gion Minami-gawa)</option>
                    <option>Stockholm Atelier (Östermalm)</option>
                    <option>Paris Archive (Le Marais)</option>
                    <option>Virtual 1-on-1 Swatch Concierge (Worldwide)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-uppercase text-[11px] text-on-surface mb-1">Your Full Name</label>
                  <input required type="text" placeholder="e.g. Astrid Lindqvist" className="w-full bg-surface-container-low border border-outline-variant/40 rounded p-space-sm font-body-sm text-on-surface focus:outline-none" />
                </div>
                <div>
                  <label className="block font-label-uppercase text-[11px] text-on-surface mb-1">Email Correspondence</label>
                  <input required type="email" placeholder="patron@ateliereditions.com" className="w-full bg-surface-container-low border border-outline-variant/40 rounded p-space-sm font-body-sm text-on-surface focus:outline-none" />
                </div>
                <div>
                  <label className="block font-label-uppercase text-[11px] text-on-surface mb-1">Preferred Fitting Date</label>
                  <input required type="date" className="w-full bg-surface-container-low border border-outline-variant/40 rounded p-space-sm font-body-sm text-on-surface focus:outline-none" />
                </div>

                <div className="pt-space-md flex items-center justify-end gap-space-sm">
                  <button
                    type="button"
                    onClick={() => setIsFittingModalOpen(false)}
                    className="px-space-md py-2 rounded text-on-surface-variant hover:bg-surface-container font-label-uppercase text-[11px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-space-lg py-2 rounded bg-primary text-on-primary hover:bg-on-surface-variant font-label-uppercase text-[11px] shadow-sm cursor-pointer"
                  >
                    Confirm Appointment Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
