import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="w-full bg-surface-container-low mt-space-5xl border-t border-outline-variant/30">
      <div className="max-w-max-width-editorial mx-auto px-margin-desktop pt-space-4xl pb-space-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop pb-space-4xl">
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-4 pr-0 lg:pr-space-xl">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight uppercase block mb-space-sm font-serif">
              ATELIER ÉDITIONS
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg max-w-sm">
              An architectural high-fashion atelier crafting minimalist, organic garments from pure silk, raw Belgian flax linen, and Japanese virgin wool.
            </p>
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                Garment Dispatches &amp; Lookbook Release
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center gap-space-xs mt-space-xxs">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-4 rounded bg-surface-container-lowest font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant flex-1 focus:outline-none border border-outline-variant/40 focus:border-primary"
                  placeholder="Enter your correspondence email"
                  type="email"
                  required
                />
                <button
                  className="h-12 px-6 rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer"
                  type="submit"
                >
                  {subscribed ? 'Joined ✓' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Curated Collections */}
          <div className="lg:col-span-2">
            <h4 className="font-label-caps text-label-caps uppercase text-on-surface tracking-wider mb-space-lg">
              Apparel Collections
            </h4>
            <ul className="space-y-space-sm font-body-sm text-body-sm">
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#womens">Women's Wardrobe</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#mens">Men's Tailoring</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#textiles">Raw Linen &amp; Silk</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#outerwear">Structured Outerwear</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#lookbook">Edition 09 Journal</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Philosophy & Craft */}
          <div className="lg:col-span-2">
            <h4 className="font-label-caps text-label-caps uppercase text-on-surface tracking-wider mb-space-lg">
              Atelier Provenance
            </h4>
            <ul className="space-y-space-sm font-body-sm text-body-sm">
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#textiles">Fiber Traceability</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#artisans">Master Tailors</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#sustainability">Zero-Waste Weaving</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#swatches">Fabric Swatch Orders</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#journal">Architectural Lookbook</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Client Services */}
          <div className="lg:col-span-2">
            <h4 className="font-label-caps text-label-caps uppercase text-on-surface tracking-wider mb-space-lg">
              Client Services
            </h4>
            <ul className="space-y-space-sm font-body-sm text-body-sm">
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#fitting">Private Fitting Reservation</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#status">Track Garment Order</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#returns">Returns &amp; Alterations</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#care">Garment Care Guides</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#trade">Private Atelier Clientelism</a>
              </li>
            </ul>
          </div>

          {/* Column 5: Showrooms */}
          <div className="lg:col-span-2">
            <h4 className="font-label-caps text-label-caps uppercase text-on-surface tracking-wider mb-space-lg">
              Private Showrooms
            </h4>
            <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <p className="leading-relaxed">
                <strong className="text-on-surface font-medium block">Kyoto Atelier:</strong>
                Minami-ku, High Fashion District<br />
                Wednesday – Sunday, 11 – 18
              </p>
              <p className="leading-relaxed">
                <strong className="text-on-surface font-medium block">Stockholm Parlour:</strong>
                Södermalm, Design Quarter<br />
                Tuesday – Saturday, 10 – 17
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md font-label-caps text-label-caps text-on-surface-variant uppercase border-t border-surface-variant/60">
          <div className="flex flex-wrap items-center gap-space-lg">
            <p>© 2026 ATELIER ÉDITIONS Inc. All rights reserved.</p>
            <a className="hover:text-on-surface transition-colors" href="#privacy">Privacy Policy</a>
            <a className="hover:text-on-surface transition-colors" href="#terms">Terms of Service</a>
            <a className="hover:text-on-surface transition-colors" href="#accessibility">Accessibility</a>
          </div>
          <div className="flex items-center gap-space-lg">
            <a className="hover:text-on-surface transition-colors" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a className="hover:text-on-surface transition-colors" href="#rss">Lookbook RSS</a>
            <a className="hover:text-on-surface transition-colors" href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
