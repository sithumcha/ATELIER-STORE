import React, { useState } from 'react';

export default function LookbookJournalPage({ onSelectProduct }) {
  const [activeEdition, setActiveEdition] = useState('09');
  const [emailInput, setEmailInput] = useState('');
  const [enrolled, setEnrolled] = useState(false);
  const [galleryOffset, setGalleryOffset] = useState(0);

  const handleEnroll = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEnrolled(true);
    }
  };

  return (
    <div className="w-full bg-surface font-body-md text-body-md text-on-surface antialiased">
      {/* Volume & Chronology Ribbon */}
      <section className="w-full bg-surface-container-low py-space-sm px-margin border-b border-outline-variant/30">
        <div className="max-w-[1380px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-uppercase text-label-uppercase">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="tracking-widest">MONOGRAPH REGISTER</span>
            <span className="text-outline-variant mx-1">/</span>
            <span className="text-on-surface font-semibold">FOLIO MMXXVI</span>
          </div>
          {/* Volume Selector Nav */}
          <nav aria-label="Monograph Editions" className="flex items-center overflow-x-auto no-scrollbar gap-space-xs py-1">
            <button
              onClick={() => setActiveEdition('09')}
              className={`px-space-md py-1.5 rounded-full font-label-uppercase text-label-uppercase transition-all shrink-0 cursor-pointer ${
                activeEdition === '09'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Edition 09 — Autumnal Solitude
            </button>
            <button
              onClick={() => setActiveEdition('08')}
              className={`px-space-md py-1.5 rounded-full font-label-uppercase text-label-uppercase transition-all shrink-0 cursor-pointer ${
                activeEdition === '08'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Edition 08 — Vernal Stillness
            </button>
            <button
              onClick={() => setActiveEdition('07')}
              className={`px-space-md py-1.5 rounded-full font-label-uppercase text-label-uppercase transition-all shrink-0 cursor-pointer ${
                activeEdition === '07'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Edition 07 — Kyoto Winter Architecture
            </button>
          </nav>
        </div>
      </section>

      {/* Editorial Monograph Headline Section */}
      <section className="max-w-[1380px] mx-auto w-full px-margin pt-space-xl pb-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end">
          <div className="lg:col-span-8 space-y-space-xs">
            <span className="font-label-uppercase text-label-uppercase tracking-[0.25em] text-secondary block uppercase">
              Vol. IX Monograph · Autumnal Solitude
            </span>
            <h1 className="font-display-lg text-display-lg text-on-surface leading-tight tracking-tight">
              The Architecture of Drape in Kyoto &amp; Stockholm
            </h1>
          </div>
          <div className="lg:col-span-4 pb-2">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              An ongoing photographic inquiry examining how natural unbleached bast fibers settle against weathered granite, cedar lattices, and Nordic cast-concrete volumes.
            </p>
            <div className="flex items-center gap-space-md mt-space-sm pt-space-xs text-on-surface-variant font-label-uppercase text-label-uppercase border-t border-surface-container-high">
              <span>CURATION: ATELIER ARCHIVE</span>
              <span>•</span>
              <span>PLATES 01–14</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Photo Monograph Layout (Bento & Asymmetrical Spans) */}
      <section className="max-w-[1380px] mx-auto w-full px-margin pb-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Primary Large Hero Visual */}
          <div className="lg:col-span-8 relative group overflow-hidden rounded-xl bg-surface-container shadow-sm">
            <div className="aspect-[4/5] md:aspect-[16/11] w-full overflow-hidden">
              <img
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                alt="Solitude Raw Linen Duster in Natural Flax"
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col justify-end p-space-lg text-on-primary">
              <div className="flex items-center justify-between w-full">
                <div>
                  <span className="font-label-uppercase text-label-uppercase tracking-widest text-secondary-fixed">
                    PLATE 01 — GION SANCTUARY
                  </span>
                  <p className="font-headline-sm text-headline-sm text-on-primary mt-1 font-normal">
                    Solitude Raw Linen Duster in Natural Flax
                  </p>
                </div>
                <button
                  onClick={() => onSelectProduct && onSelectProduct('a1')}
                  className="hidden sm:inline-flex items-center gap-2 bg-surface/90 hover:bg-surface text-on-surface px-space-md py-2 rounded text-label-uppercase font-label-uppercase shadow-md backdrop-blur transition-all cursor-pointer"
                >
                  EXPLORE CUT <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Stacked Visuals (Architectural Contrast) */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            {/* Card 1: Stockholm Studio */}
            <div className="relative group overflow-hidden rounded-xl bg-surface-container flex-1 shadow-sm">
              <div className="aspect-[4/3] lg:aspect-auto h-full w-full overflow-hidden min-h-[260px]">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  alt="Stockholm Studio Noragi"
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex flex-col justify-end p-space-md text-on-primary">
                <span className="font-label-uppercase text-label-uppercase text-secondary-fixed tracking-widest">
                  PLATE 02 — ÖSTERMALM STUDIO
                </span>
                <p className="font-title-md text-title-md text-on-primary mt-0.5 font-medium">
                  Heavy Raw-Selvedge Noragi in Shadow Indigo
                </p>
              </div>
            </div>

            {/* Quote Block / Monograph Manifesto */}
            <div className="p-space-lg bg-surface-container-high rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="space-y-space-xs">
                <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block uppercase">
                  CHOREOGRAPHY OF GRAIN
                </span>
                <p className="font-quote-display text-quote-display text-on-surface italic leading-snug">
                  “The cloth does not mimic the room; it yields to gravity until the room discovers itself within the seam.”
                </p>
              </div>
              <div className="pt-space-md flex items-center justify-between text-on-surface-variant font-label-uppercase text-label-uppercase border-t border-surface-container-highest">
                <span>KENJI SATO &amp; ELSA LINDQVIST</span>
                <span>KYOTO · 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Diptych Monograph Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md mt-space-md">
          {/* Detail 1: Weave Macro */}
          <div className="md:col-span-5 relative group overflow-hidden rounded-xl bg-surface-container shadow-sm">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                alt="Weave Specification Macro"
                src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80"
              />
            </div>
            <div className="p-space-md bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant/20">
              <div>
                <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                  SPECIFICATION
                </span>
                <p className="font-title-md text-title-md text-on-surface font-medium">
                  Slub Warp &amp; Weft Tension — Handloom No. 3
                </p>
              </div>
              <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">
                410 GSM
              </span>
            </div>
          </div>

          {/* Detail 2: Stockholm Column */}
          <div className="md:col-span-7 relative group overflow-hidden rounded-xl bg-surface-container shadow-sm">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                alt="Solitude Drape Study"
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
              />
            </div>
            <div className="p-space-md bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant/20">
              <div>
                <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                  SERIES ARCHIVE
                </span>
                <p className="font-title-md text-title-md text-on-surface font-medium">
                  Solitude Drape Study III: Harbor Concrete &amp; Natural Fiber
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">photo_camera</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Fiber & Climate Metric Ribbon */}
      <section className="w-full bg-surface-container-highest py-space-xl px-margin mb-space-2xl border-y border-outline-variant/30">
        <div className="max-w-[1380px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-space-lg text-center md:text-left">
          <div className="space-y-1">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block uppercase">
              HARVEST INTERVAL
            </span>
            <p className="font-headline-md text-headline-md text-on-surface font-normal">184 Days</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Flax retting in Normandy riverbed waters</p>
          </div>
          <div className="space-y-1">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block uppercase">
              MUD &amp; ASH VATS
            </span>
            <p className="font-headline-md text-headline-md text-on-surface font-normal">32 Ferments</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Living Sukumo microbial cultures active</p>
          </div>
          <div className="space-y-1">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block uppercase">
              FINISH METHOD
            </span>
            <p className="font-headline-md text-headline-md text-on-surface font-normal">Kinuta</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Wooden mallet hand-beaten cold softening</p>
          </div>
          <div className="space-y-1">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block uppercase">
              ANNUAL EDITION
            </span>
            <p className="font-headline-md text-headline-md text-on-surface font-normal">120 Pieces</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Numbered and hand-stamped with persimmon ink</p>
          </div>
        </div>
      </section>

      {/* Journal Essays Grid Header */}
      <section className="max-w-[1380px] mx-auto w-full px-margin pb-space-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
          <div>
            <span className="font-label-uppercase text-label-uppercase tracking-[0.2em] text-secondary uppercase block">
              THE LIVING DISPATCHES
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Longform Journal &amp; Material Treatises
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Field studies on agricultural fermentation, garment morphology, and the quiet tactile physics of slow wearing.
          </p>
        </div>
      </section>

      {/* Grid of Journal Essays */}
      <section className="max-w-[1380px] mx-auto w-full px-margin pb-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {/* Essay 1: Noragi Morphology */}
          <article className="group bg-surface-container-low rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
            <div>
              <div className="aspect-[16/10] w-full overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Noragi Morphology Treatise"
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
                />
              </div>
              <div className="p-space-lg space-y-space-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-uppercase text-label-uppercase">
                  <span className="text-secondary font-semibold">TREATISE NO. 14</span>
                  <span>8 MIN READ · ESSAY</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors cursor-pointer">
                  Garment Morphology: The Noragi from Farmer's Field to Architectural Atelier
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 leading-relaxed">
                  Tracing how an unceremonious rural work coat evolved into a masterwork of zero-waste geometric pattern cutting. Why overlapping lapels and drop-shoulder silhouettes offer uncompromised freedom for drafting tables and studio rituals.
                </p>
              </div>
            </div>
            <div className="px-space-lg pb-space-lg pt-space-xs flex items-center justify-between border-t border-surface-container-high/60">
              <div className="flex items-center gap-space-xs">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px] font-bold">TK</div>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">Taro Kuramoto</span>
              </div>
              <span className="inline-flex items-center gap-1 font-label-uppercase text-label-uppercase text-on-surface group-hover:text-secondary transition-colors cursor-pointer">
                READ MONOGRAPH <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </span>
            </div>
          </article>

          {/* Essay 2: Sukumo Indigo Vats */}
          <article className="group bg-surface-container-low rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
            <div>
              <div className="aspect-[16/10] w-full overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Living Ferment Vats"
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
                />
              </div>
              <div className="p-space-lg space-y-space-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-uppercase text-label-uppercase">
                  <span className="text-secondary font-semibold">FERMENT JOURNAL</span>
                  <span>6 MIN READ · MICROBIOLOGY</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors cursor-pointer">
                  Living Ferment Vats: Why Real Sukumo Indigo Smells of Rain and Earth
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 leading-relaxed">
                  Unlike industrial synthetic indigo, an authentic anaerobic Sukumo vat is alive with bacteria sustained on wood ash lye and sake lees. We spend five mornings inside Tokushima's quietest vat cellar to document the smell of living reduction.
                </p>
              </div>
            </div>
            <div className="px-space-lg pb-space-lg pt-space-xs flex items-center justify-between border-t border-surface-container-high/60">
              <div className="flex items-center gap-space-xs">
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface text-[10px] font-bold">MR</div>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">Margaux Rousseau</span>
              </div>
              <span className="inline-flex items-center gap-1 font-label-uppercase text-label-uppercase text-on-surface group-hover:text-secondary transition-colors cursor-pointer">
                READ MONOGRAPH <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </span>
            </div>
          </article>

          {/* Essay 3: In Praise of Shadow & Seam */}
          <article className="group bg-surface-container-low rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
            <div>
              <div className="aspect-[16/10] w-full overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="In Praise of Shadow and Seam"
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
                />
              </div>
              <div className="p-space-lg space-y-space-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-uppercase text-label-uppercase">
                  <span className="text-secondary font-semibold">PHILOSOPHICAL NOTE</span>
                  <span>5 MIN READ · ERGONOMICS</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors cursor-pointer">
                  In Praise of Shadow &amp; Seam: Designing Pockets for Contemplative Hands
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 leading-relaxed">
                  Pockets are not merely utilitarian repositories; they are physical resting places for posture during thought. An examination of Junichiro Tanizaki's aesthetic applied to concealed tailor seam allowances and inner bag construction.
                </p>
              </div>
            </div>
            <div className="px-space-lg pb-space-lg pt-space-xs flex items-center justify-between border-t border-surface-container-high/60">
              <div className="flex items-center gap-space-xs">
                <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px] font-bold">HA</div>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">Henrik Åkesson</span>
              </div>
              <span className="inline-flex items-center gap-1 font-label-uppercase text-label-uppercase text-on-surface group-hover:text-secondary transition-colors cursor-pointer">
                READ MONOGRAPH <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </span>
            </div>
          </article>

          {/* Essay 4: Undyed Yak Wool */}
          <article className="group bg-surface-container-low rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
            <div>
              <div className="aspect-[16/10] w-full overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Thermal Equilibrium Yak Wool"
                  src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80"
                />
              </div>
              <div className="p-space-lg space-y-space-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-uppercase text-label-uppercase">
                  <span className="text-secondary font-semibold">FIBER METABOLISM</span>
                  <span>10 MIN READ · THERMAL METRICS</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors cursor-pointer">
                  Thermal Equilibrium: How Undyed Yak Wool Breathes with Body Temperature
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 leading-relaxed">
                  Hollow-core proteins developed over millennia at 4,500 meters altitude create an organic microclimate around the human torso. Why chemical bleaching destroys fiber memory, and why our raw palette remains unchanged by dyes.
                </p>
              </div>
            </div>
            <div className="px-space-lg pb-space-lg pt-space-xs flex items-center justify-between border-t border-surface-container-high/60">
              <div className="flex items-center gap-space-xs">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px] font-bold">SN</div>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">Sayaka Natsume</span>
              </div>
              <span className="inline-flex items-center gap-1 font-label-uppercase text-label-uppercase text-on-surface group-hover:text-secondary transition-colors cursor-pointer">
                READ MONOGRAPH <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* Photographic Interlude & Gallery Strip */}
      <section className="w-full bg-surface-container py-space-xl px-margin">
        <div className="max-w-[1380px] mx-auto space-y-space-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
            <div>
              <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block">
                PHOTOGRAPHIC PROOF PLATES
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                The Kyoto-Stockholm Dialogue in Stillness
              </h3>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => setGalleryOffset((prev) => Math.max(0, prev - 1))}
                aria-label="Previous plate"
                className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-sm hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">west</span>
              </button>
              <button
                onClick={() => setGalleryOffset((prev) => Math.min(2, prev + 1))}
                aria-label="Next plate"
                className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-sm hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">east</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Gallery Tile 1 */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Kyoto Temple Residence"
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
                />
              </div>
              <div className="p-space-sm bg-surface-container-lowest">
                <span className="font-label-uppercase text-[10px] text-on-surface-variant block uppercase">
                  KYOTO · TEMPLE RESIDENCE
                </span>
                <p className="font-title-md text-title-md text-on-surface font-medium">Hakama Linen Trouser</p>
              </div>
            </div>

            {/* Gallery Tile 2 */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Stockholm Civic Vault"
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
                />
              </div>
              <div className="p-space-sm bg-surface-container-lowest">
                <span className="font-label-uppercase text-[10px] text-on-surface-variant block uppercase">
                  STOCKHOLM · CIVIC VAULT
                </span>
                <p className="font-title-md text-title-md text-on-surface font-medium">Undyed Yak Wrap Tunic</p>
              </div>
            </div>

            {/* Gallery Tile 3 */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Material Still Kyoto"
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
                />
              </div>
              <div className="p-space-sm bg-surface-container-lowest">
                <span className="font-label-uppercase text-[10px] text-on-surface-variant block uppercase">
                  MATERIAL STILL · KYOTO
                </span>
                <p className="font-title-md text-title-md text-on-surface font-medium">Hemp Selvedge Swatch</p>
              </div>
            </div>

            {/* Gallery Tile 4 */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/20">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Archipelago Djurgården"
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
                />
              </div>
              <div className="p-space-sm bg-surface-container-lowest">
                <span className="font-label-uppercase text-[10px] text-on-surface-variant block uppercase">
                  ARCHIPELAGO · DJURGÅRDEN
                </span>
                <p className="font-title-md text-title-md text-on-surface font-medium">Boiled Wool Cocoon Mantle</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Dispatch Newsletter & Printed Monograph Request Box */}
      <section className="max-w-[1380px] mx-auto w-full px-margin my-space-2xl">
        <div className="relative bg-surface-container-low rounded-2xl p-space-lg md:p-space-2xl overflow-hidden shadow-sm border border-outline-variant/30">
          {/* Decorative background accent circle */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-space-md">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block uppercase">
              POSTAL &amp; DIGITAL CORRESPONDENCE
            </span>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">
              Receive The Printed Solitude Monograph
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Twice per year, our studio prints a limited edition 64-page lithographic journal on uncoated Japanese washi paper. Subscribers receive field dispatches and first access to seasonal edition releases.
            </p>
            <form onSubmit={handleEnroll} className="space-y-space-sm pt-space-xs">
              <div className="flex flex-col sm:flex-row gap-space-xs">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 bg-surface-container-lowest px-space-md py-space-sm rounded font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-outline-variant/40"
                  placeholder="Your archival email address..."
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-surface-variant text-on-primary hover:text-on-surface px-space-lg py-space-sm rounded font-label-uppercase text-label-uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>ENROLL IN DISPATCHES</span>
                  <span className="material-symbols-outlined text-[16px]">done</span>
                </button>
              </div>
              <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <span>Include international print dispatch notification</span>
                </label>
              </div>
              {enrolled && (
                <div className="p-space-sm bg-surface-container-highest rounded-lg text-on-surface font-body-sm text-body-sm flex items-center gap-2 animate-fade-in">
                  <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                  <span>Your address has been inscribed into the Edition 09 physical registry.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
