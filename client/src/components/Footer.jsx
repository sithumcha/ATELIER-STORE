import React, { useState } from 'react';
import { toast } from 'sonner';

export default function Footer({ onNavigate }) {
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
      description: `Dispatches & lookbook releases will be sent to ${email}`,
    });

    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3500);
  };

  const handleNavClick = (e, tab) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <footer className="w-full bg-surface-container-low font-body-md text-on-surface">
      <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-desktop pt-space-4xl pb-space-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop pb-space-4xl">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-6 pr-0 lg:pr-space-2xl space-y-space-md">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, 'home')}
              className="inline-block group cursor-pointer"
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

            <p className="font-body-md text-sm text-on-surface-variant max-w-md leading-relaxed">
              An architectural high-fashion atelier crafting minimalist, organic garments from pure silk, raw Belgian flax linen, and Japanese virgin wool.
            </p>

            <div className="flex flex-col gap-space-xs pt-2">
              <span className="font-label-caps text-xs text-on-surface uppercase tracking-wider font-bold">
                Garment Dispatches &amp; Newsletter
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center gap-space-xs max-w-md">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 px-4 rounded-xl bg-surface-container-lowest font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant/70 flex-1 focus:outline-none border border-outline-variant/40 focus:border-primary transition-all"
                  placeholder="Enter your email address"
                  type="email"
                  required
                />
                <button
                  className="h-11 px-5 rounded-xl bg-primary text-on-primary font-label-caps text-xs uppercase tracking-wider font-bold hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer shrink-0"
                  type="submit"
                >
                  {subscribed ? 'Joined ✓' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Active Store Collections */}
          <div className="lg:col-span-3">
            <h4 className="font-label-caps text-xs uppercase text-on-surface tracking-wider mb-space-lg font-bold">
              Store Collections
            </h4>
            <ul className="space-y-space-sm font-body-sm text-xs">
              <li>
                <a
                  href="/womens-wardrobe"
                  onClick={(e) => handleNavClick(e, 'womens-wardrobe')}
                  className="text-on-surface-variant hover:text-on-surface hover:underline transition-colors"
                >
                  Women's Wardrobe
                </a>
              </li>
              <li>
                <a
                  href="/mens-tailoring"
                  onClick={(e) => handleNavClick(e, 'mens-tailoring')}
                  className="text-on-surface-variant hover:text-on-surface hover:underline transition-colors"
                >
                  Men's Clothing &amp; Tailoring
                </a>
              </li>
              <li>
                <a
                  href="/textiles-and-fiber"
                  onClick={(e) => handleNavClick(e, 'textiles')}
                  className="text-on-surface-variant hover:text-on-surface hover:underline transition-colors"
                >
                  Textiles &amp; Raw Fiber
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleNavClick(e, 'shop')}
                  className="text-on-surface-variant hover:text-on-surface hover:underline transition-colors"
                >
                  Shop Catalog (All Objects)
                </a>
              </li>
              <li>
                <a
                  href="/lookbook-and-journal"
                  onClick={(e) => handleNavClick(e, 'lookbook')}
                  className="text-on-surface-variant hover:text-on-surface hover:underline transition-colors"
                >
                  Lookbook &amp; Journal
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Patron & Client Services */}
          <div className="lg:col-span-3">
            <h4 className="font-label-caps text-xs uppercase text-on-surface tracking-wider mb-space-lg font-bold">
              Client Services
            </h4>
            <ul className="space-y-space-sm font-body-sm text-xs">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="text-on-surface-variant hover:text-on-surface hover:underline transition-colors"
                >
                  About Atelier &amp; Craftsmanship
                </a>
              </li>
              <li>
                <a
                  href="/account"
                  onClick={(e) => handleNavClick(e, 'account')}
                  className="text-on-surface-variant hover:text-on-surface hover:underline transition-colors"
                >
                  My Account &amp; Order Tracking
                </a>
              </li>
              <li>
                <a
                  href="/checkout"
                  onClick={(e) => handleNavClick(e, 'checkout')}
                  className="text-on-surface-variant hover:text-on-surface hover:underline transition-colors"
                >
                  Express Checkout Vault
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  onClick={(e) => handleNavClick(e, 'admin')}
                  className="text-secondary font-semibold hover:underline transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">space_dashboard</span>
                  <span>Admin Console</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md font-label-caps text-xs text-on-surface-variant uppercase border-t border-surface-variant/60">
          <div className="flex flex-wrap items-center gap-space-lg">
            <p>© 2026 ATELIER STORE. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-space-lg">
            <a
              className="hover:text-on-surface transition-colors"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              className="hover:text-on-surface transition-colors"
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
            >
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
