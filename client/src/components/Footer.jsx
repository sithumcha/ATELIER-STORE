import React, { useState } from 'react';
import { toast } from 'sonner';

export default function Footer({ onNavigate, onOpenAuth }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setSubscribed(true);
    toast.success('Thank you for subscribing to Atelier Journal!', {
      description: 'Exclusive lookbook dispatches and private sale invitations will be sent to ' + email,
    });

    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const handleNavClick = (e, tab) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <footer className="w-full bg-surface-container-lowest mt-space-5xl border-t border-surface-variant/60 relative font-body-md text-on-surface">
      {/* Top Gold Shimmer Border Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-amber-700/20 via-amber-500 via-primary to-amber-700/20" />

      {/* Main Footer Container */}
      <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-desktop pt-space-4xl pb-space-3xl">
        
        {/* Top Section: Brand Identity & Newsletter Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop pb-space-3xl border-b border-surface-variant/40">
          
          {/* Brand Intro & Provenance */}
          <div className="lg:col-span-6 pr-0 lg:pr-space-2xl space-y-space-md">
            <div className="flex items-center gap-3">
              <a
                href="#"
                onClick={(e) => handleNavClick(e, 'home')}
                className="flex items-center group cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 240 60"
                  className="h-9 w-auto text-on-surface transition-transform duration-300 group-hover:scale-[1.02]"
                  fill="none"
                >
                  <text x="10" y="40" fontFamily="'Playfair Display', serif" fontSize="26" fontWeight="600" letterSpacing="0.18em" fill="currentColor">
                    ATELIER
                  </text>
                  <text x="150" y="40" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="14" fontWeight="400" letterSpacing="0.3em" fill="#78716c">
                    STORE
                  </text>
                  <circle cx="138" cy="32" r="3" fill="#c27803" />
                </svg>
              </a>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-label-caps text-[10px] font-bold uppercase tracking-wider">
                Certified Haute Couture
              </span>
            </div>

            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed max-w-lg">
              An architectural high-fashion atelier crafting minimalist, organic garments from pure silk, raw Belgian flax linen, and Japanese virgin wool. Designed in Kyoto, Stockholm &amp; Colombo.
            </p>

            {/* Quick Atelier Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-base">eco</span>
                <span className="font-medium">100% Organic Fibers</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-base">local_shipping</span>
                <span className="font-medium">Carbon-Neutral Courier</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-base">verified</span>
                <span className="font-medium">Lifetime Sashiko Repair</span>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription Box */}
          <div className="lg:col-span-6 bg-surface-container-low p-space-xl rounded-2xl border border-surface-variant/60 flex flex-col justify-between space-y-space-md">
            <div>
              <span className="font-label-caps text-xs text-secondary font-bold uppercase tracking-widest block mb-1">
                ✦ Private Correspondences
              </span>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface font-serif">
                Join the Atelier Journal &amp; Edition Dispatches
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                Subscribe to receive private seasonal lookbooks, invitation-only sample releases, and textile provenance notes.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <div className="relative w-full flex-1">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-xs placeholder:text-on-surface-variant/70 focus:outline-none border border-surface-variant/60 focus:border-secondary transition-all"
                  placeholder="patron@atelierstore.com"
                  type="email"
                  required
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-lg">
                  mail
                </span>
              </div>
              <button
                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-primary text-on-primary font-label-caps text-xs uppercase font-bold tracking-wider hover:bg-secondary transition-all cursor-pointer shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                type="submit"
              >
                <span>{subscribed ? 'Subscribed ✓' : 'Subscribe Now'}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </form>
          </div>

        </div>

        {/* Middle Section: Navigation Columns & Showrooms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop py-space-3xl">
          
          {/* Column 1: Apparel Collections */}
          <div className="lg:col-span-3 space-y-space-md">
            <h4 className="font-label-caps text-xs uppercase text-on-surface font-bold tracking-wider border-b border-surface-variant/40 pb-2">
              Apparel Collections
            </h4>
            <ul className="space-y-2.5 font-body-sm text-xs">
              <li>
                <a
                  href="/womens-wardrobe"
                  onClick={(e) => handleNavClick(e, 'womens-wardrobe')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Women's Wardrobe
                </a>
              </li>
              <li>
                <a
                  href="/mens-tailoring"
                  onClick={(e) => handleNavClick(e, 'mens-tailoring')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Men's Clothing &amp; Tailoring
                </a>
              </li>
              <li>
                <a
                  href="/textiles-and-fiber"
                  onClick={(e) => handleNavClick(e, 'textiles')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Raw Linen &amp; Organic Textiles
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleNavClick(e, 'shop')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Full Store Catalog (All Objects)
                </a>
              </li>
              <li>
                <a
                  href="/lookbook-and-journal"
                  onClick={(e) => handleNavClick(e, 'lookbook')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Lookbook Edition 09 Journal
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Atelier Provenance */}
          <div className="lg:col-span-3 space-y-space-md">
            <h4 className="font-label-caps text-xs uppercase text-on-surface font-bold tracking-wider border-b border-surface-variant/40 pb-2">
              Atelier Provenance
            </h4>
            <ul className="space-y-2.5 font-body-sm text-xs">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Fiber Traceability &amp; Craft
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Master Tailors &amp; Artisans
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Zero-Waste Loom Weaving
                </a>
              </li>
              <li>
                <a
                  href="/textiles-and-fiber"
                  onClick={(e) => handleNavClick(e, 'textiles')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Fabric Swatch Ordering
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Our Brand Philosophy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Services & Admin */}
          <div className="lg:col-span-3 space-y-space-md">
            <h4 className="font-label-caps text-xs uppercase text-on-surface font-bold tracking-wider border-b border-surface-variant/40 pb-2">
              Client Services
            </h4>
            <ul className="space-y-2.5 font-body-sm text-xs">
              <li>
                <a
                  href="/account"
                  onClick={(e) => handleNavClick(e, 'account')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Track Order &amp; Courier Timeline
                </a>
              </li>
              <li>
                <a
                  href="/account"
                  onClick={(e) => handleNavClick(e, 'account')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Patron Account Profile &amp; Addresses
                </a>
              </li>
              <li>
                <a
                  href="/account"
                  onClick={(e) => handleNavClick(e, 'account')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Support Inquiry &amp; Concierge
                </a>
              </li>
              <li>
                <a
                  href="/checkout"
                  onClick={(e) => handleNavClick(e, 'checkout')}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px]">▸</span> Express Checkout Vault
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  onClick={(e) => handleNavClick(e, 'admin')}
                  className="text-secondary font-bold hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-xs">space_dashboard</span> Admin Console
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Flagship Showrooms */}
          <div className="lg:col-span-3 space-y-space-md">
            <h4 className="font-label-caps text-xs uppercase text-on-surface font-bold tracking-wider border-b border-surface-variant/40 pb-2">
              Flagship Showrooms
            </h4>
            <div className="space-y-3 font-body-sm text-xs text-on-surface-variant">
              <div>
                <strong className="text-on-surface font-semibold flex items-center gap-1 text-xs">
                  <span className="material-symbols-outlined text-secondary text-sm">location_on</span>
                  Colombo Atelier:
                </strong>
                <p className="pl-5 text-[11px] text-on-surface-variant/90 leading-normal">
                  Cinnamon Gardens, Colombo 07, Sri Lanka<br />
                  <span className="text-[10px] text-secondary font-medium">Mon – Sat: 9:00 AM – 7:00 PM</span>
                </p>
              </div>

              <div>
                <strong className="text-on-surface font-semibold flex items-center gap-1 text-xs">
                  <span className="material-symbols-outlined text-secondary text-sm">storefront</span>
                  Kyoto Parlour:
                </strong>
                <p className="pl-5 text-[11px] text-on-surface-variant/90 leading-normal">
                  Minami-ku, High Fashion District, Japan<br />
                  <span className="text-[10px] text-secondary font-medium">Wed – Sun: 11:00 AM – 6:00 PM</span>
                </p>
              </div>

              <div>
                <strong className="text-on-surface font-semibold flex items-center gap-1 text-xs">
                  <span className="material-symbols-outlined text-secondary text-sm">domain</span>
                  Stockholm Depot:
                </strong>
                <p className="pl-5 text-[11px] text-on-surface-variant/90 leading-normal">
                  Södermalm, Design Quarter, Sweden<br />
                  <span className="text-[10px] text-secondary font-medium">Tue – Sat: 10:00 AM – 5:00 PM</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Vault Payment Badges Bar */}
        <div className="py-4 border-t border-surface-variant/40 flex flex-wrap items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-base">lock</span>
            <span className="font-label-caps text-[11px] font-bold text-on-surface uppercase tracking-wider">
              256-Bit SSL Vault Security Authorized
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-surface-container font-mono text-[10px] font-bold text-on-surface border border-surface-variant/60">VISA</span>
            <span className="px-2.5 py-1 rounded bg-surface-container font-mono text-[10px] font-bold text-on-surface border border-surface-variant/60">MASTERCARD</span>
            <span className="px-2.5 py-1 rounded bg-surface-container font-mono text-[10px] font-bold text-on-surface border border-surface-variant/60">AMEX</span>
            <span className="px-2.5 py-1 rounded bg-[#5A31F4] font-mono text-[10px] font-bold text-white shadow-xs">KOKO PAY</span>
            <span className="px-2.5 py-1 rounded bg-surface-container font-mono text-[10px] font-bold text-secondary border border-secondary/30">COMMERCIAL BANK</span>
            <span className="px-2.5 py-1 rounded bg-surface-container font-mono text-[10px] font-bold text-secondary border border-secondary/30">SAMPATH BANK</span>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md font-label-caps text-[11px] text-on-surface-variant uppercase border-t border-surface-variant/60">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-space-lg">
            <p>© 2026 ATELIER STORE (PVT) LTD. All Rights Reserved.</p>
            <span className="hidden sm:inline">•</span>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Atelier Store Privacy Policy: All patron data is encrypted with 256-Bit SSL.'); }}
              className="hover:text-secondary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Atelier Store Terms: Authentic organic garments with 14-day returns.'); }}
              className="hover:text-secondary transition-colors"
            >
              Terms of Service
            </a>
          </div>

          <div className="flex items-center gap-space-lg">
            <a
              className="hover:text-secondary transition-colors flex items-center gap-1"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              <span>Instagram</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
            <a
              className="hover:text-secondary transition-colors flex items-center gap-1"
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
            >
              <span>Pinterest</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
            <a
              className="hover:text-secondary transition-colors flex items-center gap-1"
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavClick(e, 'lookbook'); }}
            >
              <span>Journal RSS</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
