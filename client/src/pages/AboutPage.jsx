import React, { useState } from 'react';

export default function AboutPage({ onExploreShop }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Bespoke Haute Couture Tailoring');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!email || !message) return;

    const payload = {
      id: `inq-${Date.now()}`,
      name: name.trim() || 'Anonymous Patron',
      email: email.trim(),
      subject: subject || 'Bespoke Haute Couture Tailoring',
      message: message.trim(),
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
    };

    // 1. Save to LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem('atelierstore_inquiries') || '[]');
      localStorage.setItem('atelierstore_inquiries', JSON.stringify([payload, ...existing]));
    } catch (err) {}

    // 2. Post to Express Backend MongoDB API
    try {
      await fetch('http://localhost:5001/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.log('Error posting inquiry to DB:', err);
    }

    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
    }, 4000);
  };

  return (
    <div className="w-full bg-surface">
      {/* Editorial Header Hero */}
      <section className="relative w-full py-space-5xl bg-surface-container-low border-b border-surface-variant overflow-hidden">
        <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="max-w-3xl">
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-space-xs">
              Monograph &amp; Atelier Provenance
            </span>
            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface leading-[1.05] mb-space-lg font-normal">
              Crafting Garments of <br />
              <span className="italic font-normal">Breath &amp; Architectural Drape</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed mb-space-xl">
              ATELIER ÉDITIONS was founded at the intersection of Kyoto’s ancient raw silk weaving traditions and Stockholm’s unadorned structural tailoring. We shape garments intended to honor natural human form and fiber.
            </p>
          </div>
        </div>
      </section>

      {/* Dual Atelier Story Section */}
      <section className="w-full py-space-4xl max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-2xl items-center mb-space-5xl">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-surface-container">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
              alt="Kyoto Weaving Studio"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pr-0 md:pr-space-xl">
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-1">
              Atelier 01 · Kyoto, Japan
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-space-md">
              Hand-Loomed Raw Silk &amp; Botanical Indigo
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
              Nestled in the historic textile quarters of Kyoto, master artisans hand-spin raw mulberry silk and dip unbleached fibers into organic indigo fermentation vats over seven consecutive cycles.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              No two bolts of silk leave the loom identical. Each reflects the subtle tension, humidity, and rhythm of the artisan weaver's hands.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-2xl items-center">
          <div className="order-2 md:order-1 pr-0 md:pr-space-xl">
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-1">
              Atelier 02 · Stockholm, Sweden
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-space-md">
              Unstructured Tailoring &amp; Organic Flax Linen
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
              In our Södermalm design parlour, Scandinavian master tailors construct soft-shouldered suits and sculptural dresses from heavy-grade Belgian flax linen and soft Japanese virgin wool.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Every seam is finished with french binding and organic cotton threading, ensuring fluid movement and lifetime structural integrity without stiff synthetic interlinings.
            </p>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-surface-container">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
              alt="Stockholm Tailoring Parlour"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sustainable Craft Pillars */}
      <section className="w-full bg-surface-container-high py-space-5xl border-y border-surface-variant">
        <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="text-center max-w-xl mx-auto mb-space-3xl">
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-space-xxs">
              Our Garment Protocol
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              The Art of Slow Fashion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary mb-space-md font-display-hero text-headline-sm">
                01
              </span>
              <h3 className="font-subheading-lg text-subheading-lg text-on-surface mb-2">
                Pure Natural Fibers
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                We utilize 100% natural, unblended organic fibers—Belgian flax linen, mulberry silk, and cruelty-free virgin wool—ensuring garments breathe naturally against your skin.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary mb-space-md font-display-hero text-headline-sm">
                02
              </span>
              <h3 className="font-subheading-lg text-subheading-lg text-on-surface mb-2">
                Zero-Waste Patterning
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Garments are cut using zero-waste geometric pattern drafts, minimizing textile scrap, while leftover offcuts are re-spun into handmade fiber paper tags.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary mb-space-md font-display-hero text-headline-sm">
                03
              </span>
              <h3 className="font-subheading-lg text-subheading-lg text-on-surface mb-2">
                Lifetime Fitting &amp; Mending
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                We offer complimentary seam alterations and sashiko hand-mending services at our Kyoto and Stockholm private showrooms for all client acquisitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atelier Direct Inquiry Section */}
      <section className="w-full py-space-5xl bg-surface-container-low border-b border-surface-variant">
        <div className="max-w-2xl mx-auto px-margin-mobile text-center">
          <span className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1">
            Private Atelier Correspondence
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-md">
            Bespoke Fitting &amp; Tailoring Inquiries
          </h2>
          <p className="font-body-md text-on-surface-variant mb-space-xl">
            Request a private showroom fitting or inquire about bespoke bridal and custom tailored outerwear.
          </p>

          <form onSubmit={handleSubmitInquiry} className="space-y-4 text-left bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-variant">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Patron Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                />
              </div>
              <div>
                <label className="font-label-caps text-xs block mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                />
              </div>
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1">Inquiry Type</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
              >
                <option>Bespoke Haute Couture Tailoring</option>
                <option>Private Showroom Fitting Reservation</option>
                <option>Fabric Swatch &amp; Fiber Order</option>
                <option>Garment Alteration &amp; Sashiko Mending</option>
              </select>
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1">Message Dispatch *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your sizing, fabric preferences, or showroom appointment window..."
                className="w-full p-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded bg-primary text-on-primary font-label-md uppercase hover:bg-secondary transition-colors cursor-pointer"
            >
              {sent ? 'Dispatch Received ✓' : 'Send Atelier Dispatch'}
            </button>
          </form>
        </div>
      </section>

      {/* Call to Explore Collection */}
      <section className="w-full py-space-5xl text-center">
        <div className="max-w-xl mx-auto px-margin-mobile">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-md">
            Explore the Garment Archive
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-xl">
            Acquire limited edition garments crafted from pure natural textiles.
          </p>
          <button
            onClick={onExploreShop}
            className="h-12 px-8 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer"
          >
            Browse Apparel Catalog
          </button>
        </div>
      </section>
    </div>
  );
}
