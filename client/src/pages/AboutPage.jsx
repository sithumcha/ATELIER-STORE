import React, { useState } from 'react';

export default function AboutPage({ onExploreShop }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Bespoke Architectural Commission');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!email || !message) return;

    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
    }, 3500);
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
              Crafting Objects for <br />
              <span className="italic font-normal">Unhurried Living</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed mb-space-xl">
              KURA Studio was founded at the intersection of Kyoto’s ancient wabi-sabi ceramic traditions and Sweden’s unadorned Scandinavian functionalism. We shape objects intended to slow down daily rituals.
            </p>
          </div>
        </div>
      </section>

      {/* Dual Atelier Story Section */}
      <section className="w-full py-space-4xl max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-2xl items-center mb-space-5xl">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-surface-container">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQjJaZbuuh0cdPj9n7SLQozd5AqsEn9oism6vFpYa6i5UcfNjUFoBIbLBSOHGXGZUmNCCURBNl8tHnOdzbZMfrM6-ji5DJpy0Zep5MF7g_fJ1wgN75o8i1bEoHj9oj7Lzp8TJbhMauesMa7aPMGXjgZZJV6VQ4CxarOFv-LmVSX_U9Vpq0Bs241lLwWMQFWgNnoiSgCTkDeiK-3ceL77auCIaZlEQybff-Vsx0cO1MVA3k9W_jqI8"
              alt="Kyoto Kiln Workshop"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pr-0 md:pr-space-xl">
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-1">
              Atelier 01 · Kyoto, Japan
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-space-md">
              Shigaraki Clay &amp; Wood Kiln Fire
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
              Nestled in the hills of Shigaraki, our master ceramic artisans continue a 700-year legacy of unglazed stoneware. Kilns are fired with pine wood over three consecutive days, allowing flying ash to form natural mineral glazes unique to every vessel.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              No two pieces leave the kiln identical. Each reflects the temperature, weather, and atmosphere of the moment it was born.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-2xl items-center">
          <div className="order-2 md:order-1 pr-0 md:pr-space-xl">
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-1">
              Atelier 02 · Stockholm, Sweden
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-space-md">
              Honest Timber Joinery &amp; Loomed Flax
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
              In our Södermalm workshop, Scandinavian woodworkers turn sustainably felled Swedish oak and Kiso hinoki cypress into minimalist, low-profile furniture held together purely by traditional Japanese wood joinery—without single nails or synthetic adhesives.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Our textiles are woven on vintage shuttle looms from unbleached European flax, finished with organic plant dyes that age into soft, tactile textures over decades.
            </p>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-surface-container">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlQAz7BQ9_Bm3auw-jbIhPV--EEbfdNX4NN7O5xJChZI3NsaEWcxew_howubHslS3o0ZgipMFcDKZeKSdUw-NSbxXak9-qLmrv3gksOqsCDfZsX8jNhm17tkaM-rjvCss-gZl8CJ1uVkpH3pXJP6oRDCb54ktCYq9BJnZS7EQIyYIMJeGLyDB_o22AbQltPGojlUREJiNLoiWEtAQDFJ6b79WM1vUrXW2fhUvfBIVJ_a0IqHdEYoU"
              alt="Stockholm Joinery Studio"
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
              Our Commitments
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              The Protocol of Slow Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary mb-space-md font-display-hero text-headline-sm">
                01
              </span>
              <h3 className="font-subheading-lg text-subheading-lg text-on-surface mb-2">
                Generational Heritage
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                We partner exclusively with independent artisan families operating continuously across Japan and Scandinavia, guaranteeing fair wage stability and preservation of dying master skills.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary mb-space-md font-display-hero text-headline-sm">
                02
              </span>
              <h3 className="font-subheading-lg text-subheading-lg text-on-surface mb-2">
                Zero Synthetic Additives
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                From raw unglazed clay to pure organic oils and beeswax wood finishes, our products are 100% natural, biodegradable, and free from plastic polyurethanes.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
              <span className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-secondary mb-space-md font-display-hero text-headline-sm">
                03
              </span>
              <h3 className="font-subheading-lg text-subheading-lg text-on-surface mb-2">
                Lifetime Circular Repair
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                We offer traditional Kintsugi (gold lacquer repair) for ceramic acquisitions and complimentary timber re-oiling service at our Kyoto and Stockholm sanctuaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atelier Direct Inquiry Section (POST /api/inquiries) */}
      <section className="w-full py-space-5xl bg-surface-container-low border-b border-surface-variant">
        <div className="max-w-2xl mx-auto px-margin-mobile text-center">
          <span className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1">
            Direct Atelier Correspondence
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb- space-md">
            Commission &amp; Trade Inquiries
          </h2>
          <p className="font-body-md text-on-surface-variant mb-space-xl">
            Have a custom architectural commission or trade request? Send a direct dispatch to our Kyoto &amp; Stockholm curatorial team.
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
                  placeholder="e.g. Marcus Lindqvist"
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
                <option>Bespoke Architectural Commission</option>
                <option>Trade &amp; Hospitality Division</option>
                <option>Kintsugi Repair Service</option>
                <option>General Curatorial Inquiry</option>
              </select>
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1">Message Dispatch *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your vision or inquiry specifications..."
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
            Explore the Archive
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-xl">
            Acquire numbered editions crafted in limited batches for deliberate living.
          </p>
          <button
            onClick={onExploreShop}
            className="h-12 px-8 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer"
          >
            Browse Catalog / Shop
          </button>
        </div>
      </section>
    </div>
  );
}
