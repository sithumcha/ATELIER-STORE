import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "“The Akari lantern transformed the cadence of our evenings. The light does not pierce; it rests softly like twilight on paper.”",
      author: "Elin Lindqvist",
      title: "Architect, Stockholm",
      initials: "EL",
    },
    {
      quote: "“Weight and balance are exceptional. Holding the Kuro vessel feels like anchoring oneself to the mineral bedrock of Japan.”",
      author: "Kenji Takahashi",
      title: "Ceramic Collector, Kyoto",
      initials: "KT",
    },
    {
      quote: "“The heavy flax robe has softened with every wash into an heirloom garment. It brings calm intentionality to my early mornings.”",
      author: "Maren Rossi",
      title: "Interior Stylist, Zurich",
      initials: "MR",
    },
  ];

  return (
    <section className="w-full py-space-4xl bg-surface">
      <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="text-center max-w-xl mx-auto mb-space-3xl">
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-space-xxs">
            Reflections &amp; Inhabitation
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Echoes from Daily Rituals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
          {reviews.map((rev, index) => (
            <div key={index} className="bg-surface-container-low rounded-xl p-space-xl flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-1 text-secondary mb-space-md">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface italic font-normal mb-space-lg leading-relaxed">
                  {rev.quote}
                </p>
              </div>
              <div className="flex items-center gap-space-sm pt-space-md border-t border-surface-variant">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center font-label-caps text-on-surface">
                  {rev.initials}
                </div>
                <div>
                  <span className="font-label-md text-label-md text-on-surface block font-semibold">
                    {rev.author}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {rev.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
