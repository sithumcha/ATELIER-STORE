import React, { useState } from 'react';

export default function TextilesFiberPage({ onAddToCart }) {
  const [activeFiberTab, setActiveFiberTab] = useState(0);
  const [deckOrdered, setDeckOrdered] = useState(false);

  const handleOrderDeck = () => {
    if (onAddToCart) {
      onAddToCart({
        id: 'swatch-deck',
        title: 'Atelier Archival Swatch Deck (12 Specimens)',
        price: 25,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDviMUbeX63ZRLy-76YDZTGBxAN4Ah9HTTYy-m6DT6dw7sBlkTFUuIIJclEpi8ZPJKPhxlPhrwEoK3S7VKVKL-6OXOlJTHk0urp7fHiSgf6l16yZV7f4JAhMrOBoIuOF0E2JPS73RUnwDUbv9mUxozOMv0G4i-zOVV6Ox0iQeIdttHBSCfFZw2rA-BN2Nt5yhKjqAV0lJzVburpaRw-qXPIPF_Vv5WaX6RS6IJkUOXRq1ewNrQwb_vH3A',
      });
    }
    setDeckOrdered(true);
  };

  return (
    <div className="w-full bg-surface font-body-md text-body-md text-on-surface antialiased">
      {/* Archival Breadcrumb & Header Ribbon */}
      <section className="w-full bg-surface-container-low px-margin py-space-md border-b border-outline-variant/30">
        <div className="max-w-[1380px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-xs text-on-surface-variant font-label-uppercase text-label-uppercase">
          <div className="flex items-center gap-2">
            <span>ARCHIVE VOL. IV</span>
            <span className="text-outline">/</span>
            <span>SPECIFICATION REGISTER</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-semibold">DOCUMENT NO. ATEL-884</span>
          </div>
          <div className="flex items-center gap-space-md">
            <span>ATMOSPHERIC MOISTURE: 54%</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-secondary font-medium">ZERO PETROCHEMICAL SIZING APPLIED</span>
          </div>
        </div>
      </section>

      {/* Editorial Monograph Introduction */}
      <section className="w-full px-margin py-space-2xl">
        <div className="max-w-[1380px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-baseline">
          <div className="lg:col-span-8 space-y-space-lg">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-[0.25em] block">
              ATELIER ARCHIVES • FIBER SYSTEM STUDY
            </span>
            <h1 className="font-display-lg text-display-lg text-on-surface leading-[1.08] tracking-tight">
              Textiles &amp; Fiber — An Archival Study of Ancient Raiment Materials
            </h1>
            <blockquote className="font-quote-display text-quote-display text-on-surface-variant italic max-w-3xl border-l-2 border-secondary/40 pl-space-md">
              “When a plant or animal filament is left unbleached, unstraightened, and woven at low rotational tension, the fabric retains its cellular memory — regulating heat, perspiration, and wear through quiet biological physics.”
            </blockquote>
          </div>
          <div className="lg:col-span-4 bg-surface-container p-space-lg rounded-lg shadow-sm space-y-space-md self-start">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <span className="font-label-uppercase text-label-uppercase text-on-surface tracking-wider">
                HARVEST DISPATCH
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              We reject chemical sizing, microplastic binders, and hot calendering. Our fiber library preserves raw protein sheaths, dew-retted bast structures, and fermented earthen dyes that patinate gracefully over three decades of diurnal wearing.
            </p>
            <div className="pt-space-xs flex items-center justify-between font-label-uppercase text-label-uppercase text-on-surface border-t border-surface-container-high">
              <span>CURATED SPECIES: 04</span>
              <span>ESTABLISHED 2018</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Fiber Showcase Section */}
      <section className="w-full px-margin py-space-xl bg-surface-container-low" id="fiber-exhibition">
        <div className="max-w-[1380px] mx-auto space-y-space-xl">
          {/* Section Indicator & Tab Navigation */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block">
                CATALOGUE CLASSIFICATIONS
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                The Four Primary Species
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFiberTab(0)}
                className={`px-space-md py-space-xs rounded font-label-uppercase text-label-uppercase transition-all cursor-pointer ${
                  activeFiberTab === 0
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                01 / Normandy Flax
              </button>
              <button
                onClick={() => setActiveFiberTab(1)}
                className={`px-space-md py-space-xs rounded font-label-uppercase text-label-uppercase transition-all cursor-pointer ${
                  activeFiberTab === 1
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                02 / Kyoto Mulberry Silk
              </button>
              <button
                onClick={() => setActiveFiberTab(2)}
                className={`px-space-md py-space-xs rounded font-label-uppercase text-label-uppercase transition-all cursor-pointer ${
                  activeFiberTab === 2
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                03 / Mountain Yak &amp; Alpaca
              </button>
              <button
                onClick={() => setActiveFiberTab(3)}
                className={`px-space-md py-space-xs rounded font-label-uppercase text-label-uppercase transition-all cursor-pointer ${
                  activeFiberTab === 3
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                04 / Pigment Laboratory
              </button>
            </div>
          </div>

          {/* Fiber Panels Container */}
          <div className="relative w-full">
            {/* Panel 1: Normandy Flax */}
            {activeFiberTab === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg animate-fade-in">
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low">
                      <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">
                        SPECIES NO. 01 • LINUM USITATISSIMUM
                      </span>
                      <span className="font-label-uppercase text-label-uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface">
                        COASTAL RETTED
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mt-3">
                      Normandy Dew-Retted Unbleached Flax
                    </h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm leading-relaxed">
                      Grown on the misted maritime plains of Seine-Maritime without irrigation or artificial fertilizer. Following harvest, stems remain flat on open fields for four to six weeks while dew and natural soil fungi dissolve cellular pectin.
                    </p>
                  </div>
                  {/* Macro Detail Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md mt-space-lg pt-space-md bg-surface-container-low p-space-md rounded-lg">
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        WEIGHT CLASSIFICATION
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface mt-1 block">
                        320 – 450 GSM
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Dense overcoat &amp; chore drape
                      </span>
                    </div>
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        CELLULAR STRUCTURE
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface mt-1 block">
                        Polygonal Bast
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        High crystalline cellulose
                      </span>
                    </div>
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        WET TENACITY
                      </span>
                      <span className="font-headline-sm text-headline-sm text-secondary mt-1 block font-semibold">
                        +20% Stronger
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Gains stability with wash
                      </span>
                    </div>
                  </div>
                  <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-sm pt-space-sm border-t border-surface-container-low text-on-surface-variant font-body-sm text-body-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">flare</span> Rain-fed agriculture only
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">grass</span> Natural silvery-sand tint
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">sync</span> 100% Biodegradable in 6 weeks
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-space-md">
                  <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-sm">
                    <img
                      className="w-full h-full object-cover"
                      alt="Normandy Flax Macro Texture"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbvAUSabMPKExAGBFHYTOVrs8trmVd4SmrPQ2i9TJ4liVOv_Bf06y_wEXA7X9wCsceYLU2DPIFEMcF0sqtsXMEdGznsU5ljbTpN3AXDgbDWO8ZUDKALpLuLhd-QAo7BObFMpahsISWvEQ_Zj2ZLcYEc7pVKr7tPxwInl7fzyaWqkIPQNVxdVhwpSnr0SgFLFaOFa0Epy6XjE4f2j0238G9xfOBQCcSy5fRvoPkQ07aNLEO4NayEYQyPw"
                    />
                    <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur px-2.5 py-1 rounded text-on-surface font-label-uppercase text-label-uppercase">
                      MICRO-SLUB TOPOGRAPHY • 400x ZOOM
                    </div>
                  </div>
                  <div className="bg-surface-container-high rounded-xl p-space-md flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                        LOOM PARITY
                      </span>
                      <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                        Toyoda G3 Shuttle Looms
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Operating at only 92 picks per minute for gentle selvage retention.
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-3xl">precision_manufacturing</span>
                  </div>
                </div>
              </div>
            )}

            {/* Panel 2: Kyoto Mulberry Silk */}
            {activeFiberTab === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg animate-fade-in">
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low">
                      <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">
                        SPECIES NO. 02 • BOMBYX MORI
                      </span>
                      <span className="font-label-uppercase text-label-uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface">
                        TANGO PENINSULA
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mt-3">
                      Kyoto Sericulture Slub Mulberry Silk
                    </h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm leading-relaxed">
                      Spun from native Bombyx mori silkworms nourished solely on organic Kyoto mulberry leaves. Rather than stripping the fiber into synthetic hyper-shine, we retain uneven fibroin proteins to produce a dull chalky luster, resilient breathability, and dry paper touch.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md mt-space-lg pt-space-md bg-surface-container-low p-space-md rounded-lg">
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        FINISH CHARACTER
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface mt-1 block">
                        Low-Sheen Mat
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Zero petro-softener wash
                      </span>
                    </div>
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        THERMOREGULATION
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface mt-1 block">
                        Bi-Phasic
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Warms winter / breathes summer
                      </span>
                    </div>
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        TEXTURE MARK
                      </span>
                      <span className="font-headline-sm text-headline-sm text-secondary mt-1 block font-semibold">
                        Chirimen Slub
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Left/Right high-twist weft
                      </span>
                    </div>
                  </div>
                  <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-sm pt-space-sm border-t border-surface-container-low text-on-surface-variant font-body-sm text-body-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">spa</span> Sericin protein natural conditioning
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">opacity</span> Natural vapor absorption: 30%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">shield</span> UV scattering natural barrier
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-space-md">
                  <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-sm">
                    <img
                      className="w-full h-full object-cover"
                      alt="Kyoto Silk Skeins"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcJl1YrYHvj2yfaS1ZVLSp9OU8Q56KPu2LgSfzsJV5juaglUTPs_bAkc4GuUwJ7NoRIHUQ52SqVYdlccVqmqcMr3Nq_uDm7VZOHyHQGkanWTOJ_j26FmbdVp28eNSxlroM-5Mjy67EPVdhu-ajRWz4x38ghmptt3fLMD9QTp_72dqlVBy0ZMdJfDQmNE9_7C_lbzzvyu1-RgTPzqgAMem5jKa2FuI3CAlp8wZEi12TBzuoV-Zdwt-01w"
                    />
                    <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur px-2.5 py-1 rounded text-on-surface font-label-uppercase text-label-uppercase">
                      REELED FILAMENT GRAIN • UNDYED
                    </div>
                  </div>
                  <div className="bg-surface-container-high rounded-xl p-space-md flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                        KYOTO ATELIER
                      </span>
                      <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                        Tango Chirimen Weaving Guild
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Continuously active since 1720 using timber-frame tensioners.
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-3xl">dry_cleaning</span>
                  </div>
                </div>
              </div>
            )}

            {/* Panel 3: Mountain Yak & Alpaca */}
            {activeFiberTab === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg animate-fade-in">
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low">
                      <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">
                        SPECIES NO. 03 • BOS GRUNNIENS &amp; VICUGNA PACOS
                      </span>
                      <span className="font-label-uppercase text-label-uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface">
                        HIGH ALTITUDE PASTORAL
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mt-3">
                      Tibetan Mountain Yak &amp; Andean Suri Alpaca
                    </h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm leading-relaxed">
                      Collected exclusively through gentle spring combing — zero blades, zero mechanical shearing stress. These plateau animals produce microscopic hollow-core guard fibers that capture air pockets without density, yielding superior thermal efficiency to sheep merino at half the net weight.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md mt-space-lg pt-space-md bg-surface-container-low p-space-md rounded-lg">
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        MICRON PROFILE
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface mt-1 block">
                        18.5 – 19.8 μm
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Skin-contact comfort index
                      </span>
                    </div>
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        THERMAL EFFICIENCY
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface mt-1 block">
                        +40% vs Wool
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Cellular vacuum insulation
                      </span>
                    </div>
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        NATURAL PIGMENTS
                      </span>
                      <span className="font-headline-sm text-headline-sm text-secondary mt-1 block font-semibold">
                        7 Undyed Hues
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        From silver taupe to jet peat
                      </span>
                    </div>
                  </div>
                  <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-sm pt-space-sm border-t border-surface-container-low text-on-surface-variant font-body-sm text-body-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">pets</span> Nomadic combing certification
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">landscape</span> 4,200m Tibetan plateau elevation
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">not_interested</span> Zero chemical de-greasing baths
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-space-md">
                  <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-sm">
                    <img
                      className="w-full h-full object-cover"
                      alt="Yak Fleece Tufts"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnoXD6xPVZlHvFhEldjd9KFscEAJek2crGBTYPVfiwvLcGPjECBd3Mk2e1wsMfYFk4nhCtaceEESUnMpgMoQrub_S_Lgdb6CmUX9MtDtqDVdDdLnRSYkAnzu_tMhwFGDBqhxbrIZlpiI2lVG9PNtRuzXsJiiKQXAsg_aYS6g-QVi0k0RMJFR9POwNWRtHfNsBbHE5QY20haR_-vW19zvTeom-vPUMhoIJAv3wvULyW4HEqGJwFzB4TfQ"
                    />
                    <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur px-2.5 py-1 rounded text-on-surface font-label-uppercase text-label-uppercase">
                      RAW COMBED UNDERCOAT • GRADED
                    </div>
                  </div>
                  <div className="bg-surface-container-high rounded-xl p-space-md flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                        ETHICAL ORIGIN
                      </span>
                      <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                        Nomad Cooperatives • Qinghai
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Direct fair trade purchase ensuring pastoral seasonal migration.
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-3xl">terrain</span>
                  </div>
                </div>
              </div>
            )}

            {/* Panel 4: Botanical Pigment Laboratory */}
            {activeFiberTab === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg animate-fade-in">
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low">
                      <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">
                        SPECIES NO. 04 • ORGANIC MORDANTS &amp; RESINS
                      </span>
                      <span className="font-label-uppercase text-label-uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface">
                        LIVING POT FERMENTATION
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mt-3">
                      The Earthen Pigment &amp; Tannin Laboratory
                    </h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm leading-relaxed">
                      Color at Atelier Éditions is a live microbiological process. We steep fibers in aerobic indigo vats nourished with sake lees and wood ash, unripe green persimmon tannins (Kakishibu), hand-crushed green walnut husks, and chestnut-wood baths precipitated with natural iron-rich spring waters.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md mt-space-lg pt-space-md bg-surface-container-low p-space-md rounded-lg">
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        SUKUMO INDIGO
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface mt-1 block">
                        Awa Tokushima
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Composted Polygonum leaves
                      </span>
                    </div>
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        KAKISHIBU AGING
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface mt-1 block">
                        3 Years Aged
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Sun-activated tannin oxidation
                      </span>
                    </div>
                    <div>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">
                        CHESTNUT MORDANT
                      </span>
                      <span className="font-headline-sm text-headline-sm text-secondary mt-1 block font-semibold">
                        Spring Iron Wash
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Smoky charcoal-slate depth
                      </span>
                    </div>
                  </div>
                  <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-sm pt-space-sm border-t border-surface-container-low text-on-surface-variant font-body-sm text-body-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">water_drop</span> Zero heavy-metal synthetic fixing
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">sunny</span> Deepens in hue under sunlight
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">science</span> pH neutralized with mountain spring
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-space-md">
                  <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-sm">
                    <img
                      className="w-full h-full object-cover"
                      alt="Botanical Dye Vat Studio"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI5CrY63MPA2fuvMf_Xjm91vJvQ7LeNiykg689yLQIDArmdAutVjVd1SrZuUoEY69K66Lu0NGkY8dh5AURg_HSfbuk1mtLL-0tJlkVocsw8EVgOJFD0yGo73aZQVnXp4tv9guqnp_TxQnVpNrQtgtjnXtdYb_Zetj1b9blL5beTOmOhwgX72PDrgsA_pM3gX78Xa0O6mIJFbqiFBWuFdUaQe8fzlTX06qjvL1VAiGB2fkEjBFAaQo4Pw"
                    />
                    <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur px-2.5 py-1 rounded text-on-surface font-label-uppercase text-label-uppercase">
                      SUKUMO FERMENTATION • VAT NO. 09
                    </div>
                  </div>
                  <div className="bg-surface-container-high rounded-xl p-space-md flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                        DYE ATELIER
                      </span>
                      <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                        Takao Mountain Herbarium
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Hand-stirred twice daily following lunar cycle rhythms.
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-3xl">compost</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Technical Fiber Micro-Comparison Grid & Metrics */}
      <section className="w-full px-margin py-space-2xl">
        <div className="max-w-[1380px] mx-auto space-y-space-xl">
          <div className="max-w-2xl space-y-space-xs">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block">
              EMPIRICAL TESTING DATA
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Material Matrix &amp; Longevity Index
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Independent laboratory metrics evaluated under ISO 13934 tensile protocols and Ellen MacArthur circularity benchmarks. All materials undergo zero micro-plastic resin stabilization.
            </p>
          </div>
          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px] bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-surface-container-high px-space-md py-space-sm font-label-uppercase text-label-uppercase text-on-surface tracking-wider">
                <div className="col-span-3">FIBER SYSTEM</div>
                <div className="col-span-2 text-center">BREATHABILITY (mbar)</div>
                <div className="col-span-2 text-center">TENSILE TENACITY (cN/tex)</div>
                <div className="col-span-2 text-center">EST. SERVICE LIFE</div>
                <div className="col-span-3 text-right">CIRCULARITY SCORE</div>
              </div>
              {/* Row 1 */}
              <div className="grid grid-cols-12 px-space-md py-space-md items-center border-b border-surface-container-high hover:bg-surface-container-low transition-colors">
                <div className="col-span-3 flex items-center gap-space-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <div>
                    <p className="font-title-md text-title-md text-on-surface font-medium">Normandy Dew-Retted Flax</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">380 GSM Heavy Twill</p>
                  </div>
                </div>
                <div className="col-span-2 text-center font-headline-sm text-headline-sm text-on-surface">
                  98 <span className="font-body-sm text-body-sm text-on-surface-variant">/ 100</span>
                </div>
                <div className="col-span-2 text-center font-headline-sm text-headline-sm text-on-surface">
                  64.2 <span class="font-body-sm text-body-sm text-on-surface-variant">wet</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="font-title-md text-title-md text-on-surface">35+ Years</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">Mendable bast</span>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-space-sm">
                  <div className="w-32 bg-surface-container rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full w-full"></div>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">100<span className="text-xs font-normal text-on-surface-variant">/100</span></span>
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-12 px-space-md py-space-md items-center border-b border-surface-container-high bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                <div className="col-span-3 flex items-center gap-space-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container"></span>
                  <div>
                    <p className="font-title-md text-title-md text-on-surface font-medium">Kyoto Chirimen Silk</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">140 GSM Slub Weft</p>
                  </div>
                </div>
                <div className="col-span-2 text-center font-headline-sm text-headline-sm text-on-surface">
                  92 <span className="font-body-sm text-body-sm text-on-surface-variant">/ 100</span>
                </div>
                <div className="col-span-2 text-center font-headline-sm text-headline-sm text-on-surface">
                  42.8 <span className="font-body-sm text-body-sm text-on-surface-variant">dry</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="font-title-md text-title-md text-on-surface">25+ Years</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">Protein filament</span>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-space-sm">
                  <div className="w-32 bg-surface-container rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full w-[96%]"></div>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">96<span className="text-xs font-normal text-on-surface-variant">/100</span></span>
                </div>
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-12 px-space-md py-space-md items-center border-b border-surface-container-high hover:bg-surface-container-low transition-colors">
                <div className="col-span-3 flex items-center gap-space-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-on-surface-variant"></span>
                  <div>
                    <p className="font-title-md text-title-md text-on-surface font-medium">Tibetan Yak Underdown</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">420 GSM Bouclé Knit</p>
                  </div>
                </div>
                <div className="col-span-2 text-center font-headline-sm text-headline-sm text-on-surface">
                  95 <span className="font-body-sm text-body-sm text-on-surface-variant">/ 100</span>
                </div>
                <div className="col-span-2 text-center font-headline-sm text-headline-sm text-on-surface">
                  34.5 <span className="font-body-sm text-body-sm text-on-surface-variant">dry</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="font-title-md text-title-md text-on-surface">30+ Years</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">Hollow-fiber core</span>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-space-sm">
                  <div className="w-32 bg-surface-container rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full w-full"></div>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">100<span className="text-xs font-normal text-on-surface-variant">/100</span></span>
                </div>
              </div>
              {/* Row 4 */}
              <div className="grid grid-cols-12 px-space-md py-space-md items-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                <div className="col-span-3 flex items-center gap-space-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                  <div>
                    <p className="font-title-md text-title-md text-on-surface font-medium">Natural Kakishibu Cotton-Linen</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">280 GSM Sun-Oxidized</p>
                  </div>
                </div>
                <div className="col-span-2 text-center font-headline-sm text-headline-sm text-on-surface">
                  89 <span className="font-body-sm text-body-sm text-on-surface-variant">/ 100</span>
                </div>
                <div className="col-span-2 text-center font-headline-sm text-headline-sm text-on-surface">
                  51.0 <span className="font-body-sm text-body-sm text-on-surface-variant">wet</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="font-title-md text-title-md text-on-surface">28+ Years</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">Tannin-reinforced</span>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-space-sm">
                  <div className="w-32 bg-surface-container rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full w-full"></div>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">100<span className="text-xs font-normal text-on-surface-variant">/100</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loom Directory Geographic Showcase */}
      <section className="w-full px-margin py-space-2xl bg-surface-container">
        <div className="max-w-[1380px] mx-auto space-y-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block">
                WEAVING GEOGRAPHY
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                Loom Mills &amp; Milling Cooperatives
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
              Four dedicated historic weaving centers engineered solely to preserve antique shuttle mechanics, unforced low-speed tensioning, and chemical-free artisan finishing.
            </p>
          </div>
          {/* Map & Mill Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
            {/* Interactive Cartography Display */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="relative w-full h-[360px] rounded-lg overflow-hidden bg-surface-container-high">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1200&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 text-on-primary">
                  <span className="font-label-uppercase text-label-uppercase text-primary-fixed block tracking-widest">
                    CURRENT MONITORED LOCATION
                  </span>
                  <p className="font-headline-sm text-headline-sm font-normal">
                    Tango Peninsula &amp; Nishijin District, Kyoto
                  </p>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim">
                    35.0392° N, 135.7901° E • Altitude 42m
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-md">
                <div className="bg-surface-container-low p-space-sm rounded">
                  <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">ACTIVE LOOMS</span>
                  <span className="font-title-md text-title-md text-on-surface block mt-0.5">14 Timber Shuttles</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded">
                  <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">SPEED</span>
                  <span className="font-title-md text-title-md text-on-surface block mt-0.5">85 ppm Maximum</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded">
                  <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">OPERATOR CARE</span>
                  <span className="font-title-md text-title-md text-on-surface block mt-0.5">1 Weaver / 2 Looms</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded">
                  <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block">DAILY OUTPUT</span>
                  <span className="font-title-md text-title-md text-on-surface block mt-0.5">18 Meters Max</span>
                </div>
              </div>
            </div>
            {/* Mill Directory List */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-space-sm">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">JAPAN • REGION 01</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Est. 1892</span>
                </div>
                <h4 className="font-title-md text-title-md text-on-surface mt-1 font-semibold">Kyoto Tango Chirimen Guild</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Specialized in extreme weft-twist crepe silk and textured filament weaving under coastal atmospheric humidity.</p>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">JAPAN • REGION 02</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Est. 1924</span>
                </div>
                <h4 className="font-title-md text-title-md text-on-surface mt-1 font-semibold">Gifu River Basin Heritage Mills</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Restored vintage Toyoda G3 shuttle looms converting pure organic flax into dense multi-ply canvas without synthetic yarn sizing.</p>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">SWEDEN • SCANDINAVIAN WEAVE</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Est. 1951</span>
                </div>
                <h4 className="font-title-md text-title-md text-on-surface mt-1 font-semibold">Småland Linen Weaving Laboratory</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Nordic domestic tradition of loose-reed weaving, delivering blankets and heavy tunics with porous air permeability.</p>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">FRANCE • NORMANDY BAST</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Est. 1874</span>
                </div>
                <h4 className="font-title-md text-title-md text-on-surface mt-1 font-semibold">Seine-Maritime Flax Cooperative</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Centuries-old scutching and combing mills yielding long-line combed flax fibers retaining high natural wax content.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Swatch Deck Order CTA & Artifact Showcase */}
      <section className="w-full px-margin py-space-2xl">
        <div className="max-w-[1380px] mx-auto bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative h-96 lg:h-full min-h-[440px]">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                alt="Swatch Deck Box"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDviMUbeX63ZRLy-76YDZTGBxAN4Ah9HTTYy-m6DT6dw7sBlkTFUuIIJclEpi8ZPJKPhxlPhrwEoK3S7VKVKL-6OXOlJTHk0urp7fHiSgf6l16yZV7f4JAhMrOBoIuOF0E2JPS73RUnwDUbv9mUxozOMv0G4i-zOVV6Ox0iQeIdttHBSCfFZw2rA-BN2Nt5yhKjqAV0lJzVburpaRw-qXPIPF_Vv5WaX6RS6IJkUOXRq1ewNrQwb_vH3A"
              />
              <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur px-3 py-1 rounded shadow-sm">
                <span className="font-label-uppercase text-label-uppercase text-on-surface tracking-wider">
                  LIMITED ARCHIVAL EDITION • 2026/01
                </span>
              </div>
            </div>
            {/* Purchasing Action Column */}
            <div className="lg:col-span-7 p-space-xl lg:p-space-2xl space-y-space-lg">
              <div className="space-y-space-xs">
                <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block">
                  TACTILE VERIFICATION DECK
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  The Atelier Archival Swatch Deck
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Experience the weight, tensile resistance, and natural dry drape before ordering custom bespoke tailoring or yardage. The kit comprises twelve 15×15 cm numbered fabric panels accompanied by micro-analysis dossiers and origin certificates.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md py-space-xs">
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-secondary">layers</span>
                  <p className="font-title-md text-title-md text-on-surface font-semibold">12 Raw Swatches</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Linen, silk, yak, alpaca, persimmon.</p>
                </div>
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-secondary">menu_book</span>
                  <p className="font-title-md text-title-md text-on-surface font-semibold">Fiber Register</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Full GSM &amp; loom provenance dossier.</p>
                </div>
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-secondary">redeem</span>
                  <p className="font-title-md text-title-md text-on-surface font-semibold">Fully Credited</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Rs. 2,500 refunded on first wardrobe order.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-space-md pt-space-sm">
                <button
                  onClick={handleOrderDeck}
                  disabled={deckOrdered}
                  className={`w-full sm:w-auto px-space-xl py-space-sm rounded font-label-uppercase text-label-uppercase flex items-center justify-center gap-space-xs shadow-md transition-colors cursor-pointer ${
                    deckOrdered
                      ? 'bg-secondary text-on-secondary cursor-default'
                      : 'bg-primary hover:bg-on-surface-variant text-on-primary'
                  }`}
                >
                  <span>{deckOrdered ? 'SPECIMEN RESERVED (Rs. 2,500) ✓' : 'ORDER SWATCH DECK — Rs. 2,500'}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Complimentary climate-neutral dispatch worldwide.
                </span>
              </div>
              {deckOrdered && (
                <div className="p-space-sm rounded bg-surface-container text-on-surface font-body-sm text-body-sm flex items-center gap-2 animate-fade-in">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                  <span>Archive Swatch Deck added to your requisition bag. Re-crediting token issued.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
