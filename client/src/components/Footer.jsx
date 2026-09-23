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
    <footer className="w-full bg-surface-container-low mt-space-5xl">
      <div className="max-w-max-width-editorial mx-auto px-margin-desktop pt-space-4xl pb-space-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop pb-space-4xl">
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-4 pr-0 lg:pr-space-xl">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight uppercase block mb-space-sm">
              KURA Studio
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg max-w-sm">
              A convergence of tactile Japanese wabi-sabi simplicity and unhurried Scandinavian warmth. Designed for deliberate living.
            </p>
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                Dispatches &amp; Monograph
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center gap-space-xs mt-space-xxs">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-4 rounded bg-surface-container-lowest font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant flex-1 focus:outline-none"
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
              Curated Collections
            </h4>
            <ul className="space-y-space-sm font-body-sm text-body-sm">
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#vessels">Honed Ceramic Vessels</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#garments">Raw Linen Garments</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#lighting">Architectural Lighting</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#bath">Hinoki Timber Bath</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#archive">Archive Edition Releases</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Philosophy & Craft */}
          <div className="lg:col-span-2">
            <h4 className="font-label-caps text-label-caps uppercase text-on-surface tracking-wider mb-space-lg">
              Philosophy &amp; Craft
            </h4>
            <ul className="space-y-space-sm font-body-sm text-body-sm">
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#provenance">Material Provenance</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#artisans">Atelier &amp; Artisans</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#sustainability">Sustainability Protocol</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#restoration">Circular Restoration</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#journal">The Annual Journal</a>
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
                <a href="#status">Order Status &amp; Tracking</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#bespoke">Bespoke Architectural Inquiries</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#returns">Returns &amp; Fragile Exchanges</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#care">Care Guides &amp; Preservation</a>
              </li>
              <li className="text-on-surface-variant hover:text-on-surface transition-colors">
                <a href="#trade">Trade &amp; Hospitality Division</a>
              </li>
            </ul>
          </div>

          {/* Column 5: Sanctuaries */}
          <div className="lg:col-span-2">
            <h4 className="font-label-caps text-label-caps uppercase text-on-surface tracking-wider mb-space-lg">
              Sanctuaries
            </h4>
            <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <p className="leading-relaxed">
                <strong className="text-on-surface font-medium block">Kyoto Gallery:</strong>
                Minami-ku, Higashikujo<br />
                Wednesday – Sunday, 11 – 18
              </p>
              <p className="leading-relaxed">
                <strong className="text-on-surface font-medium block">Stockholm Studio:</strong>
                Södermalm, Åsögatan<br />
                Tuesday – Saturday, 10 – 17
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md font-label-caps text-label-caps text-on-surface-variant uppercase border-t border-surface-variant/60">
          <div className="flex flex-wrap items-center gap-space-lg">
            <p>© 2026 KURA Studio Inc. All rights preserved.</p>
            <a className="hover:text-on-surface transition-colors" href="#privacy">Privacy Policy</a>
            <a className="hover:text-on-surface transition-colors" href="#terms">Terms of Quiet Living</a>
            <a className="hover:text-on-surface transition-colors" href="#accessibility">Accessibility</a>
          </div>
          <div className="flex items-center gap-space-lg">
            <a className="hover:text-on-surface transition-colors" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a className="hover:text-on-surface transition-colors" href="#rss">Journal RSS</a>
            <a className="hover:text-on-surface transition-colors" href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
