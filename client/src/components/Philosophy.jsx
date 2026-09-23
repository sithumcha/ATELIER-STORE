import React from 'react';

export default function Philosophy() {
  return (
    <section className="relative w-full bg-surface-container-high py-space-5xl overflow-hidden">
      {/* Subtle architectural background accent */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none" />

      <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
          {/* Left: Editorial Quote */}
          <div className="lg:col-span-7 pr-0 lg:pr-space-xl">
            <div className="inline-flex items-center gap-space-xs mb-space-md">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
                Philosophy &amp; Provenance
              </span>
            </div>
            <blockquote className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-normal leading-snug mb-space-lg">
              “We honor the quiet beauty of materials left unadorned—where human patience, honest imperfection, and utility gather in silence.”
            </blockquote>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-space-xl">
              Every object in the KURA Studio archive is formed across generations-old workshops in Kyoto, Gifu, and the Swedish archipelago. We reject rapid novelty in search of artifacts that mellow and deepen with every year of quiet touch.
            </p>
            <a
              className="font-label-md text-label-md uppercase tracking-widest text-on-surface hover:text-secondary inline-flex items-center gap-space-xs transition-colors border-b border-on-surface hover:border-secondary pb-0.5"
              href="#artisan-guild"
            >
              Explore the Artisan Guild Monograph
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>

          {/* Right: Tactile Metrics & Origin Card */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-xl">
            <div className="flex items-start gap-space-lg">
              <div className="w-12 h-12 rounded bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">spa</span>
              </div>
              <div>
                <span className="font-display-hero text-headline-md text-on-surface block leading-none mb-1">
                  100%
                </span>
                <h4 className="font-subheading-md text-subheading-md text-on-surface mb-0.5">
                  Traceable Raw Materials
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Unadulterated wild clays, unbleached organic European linen, and salvaged ancient cypress timber.
                </p>
              </div>
            </div>

            <div className="w-full h-[1px] bg-surface-container" />

            <div className="flex items-start gap-space-lg">
              <div className="w-12 h-12 rounded bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">nature</span>
              </div>
              <div>
                <span className="font-display-hero text-headline-md text-on-surface block leading-none mb-1">
                  0.00
                </span>
                <h4 className="font-subheading-md text-subheading-md text-on-surface mb-0.5">
                  Net Operational Carbon
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Small batch kiln runs powered by renewable thermal recapture with sea-freight low impact shipping.
                </p>
              </div>
            </div>

            <div className="w-full h-[1px] bg-surface-container" />

            <div className="flex items-start gap-space-lg">
              <div className="w-12 h-12 rounded bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">handshake</span>
              </div>
              <div>
                <span className="font-display-hero text-headline-md text-on-surface block leading-none mb-1">
                  14
                </span>
                <h4 className="font-subheading-md text-subheading-md text-on-surface mb-0.5">
                  Generational Atelier Partners
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Independent master artisans operating continuously across Honshu and Scandinavia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
