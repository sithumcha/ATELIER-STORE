import React, { useState } from 'react';

export default function CheckoutPage({ onBackToHome, onOrderComplete }) {
  // Address State
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  // Shipping Speed State
  const [shippingCost, setShippingCost] = useState(0.00);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Order Submission State
  const [submitting, setSubmitting] = useState(false);
  const [orderSecured, setOrderSecured] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Pricing math in LKR (Rs.)
  const itemsSubtotal = 39500;
  const activeSubtotal = itemsSubtotal - discountAmount;
  const estimatedTax = 3450;
  const totalSettlement = activeSubtotal + estimatedTax + shippingCost;

  const handleApplyPromo = () => {
    if (promoCode.trim().length > 0) {
      setPromoApplied(true);
      setDiscountAmount(3950); // 10% discount
    }
  };

  const handleTriggerOrder = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOrderSecured(true);
      setShowToast(true);
      if (onOrderComplete) onOrderComplete();
      setTimeout(() => setShowToast(false), 4000);
    }, 1400);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="w-full bg-surface min-h-screen text-on-surface">
      {/* Toast Overlay */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-space-xl py-space-md rounded-full shadow-2xl transition-all duration-500 flex items-center gap-space-md z-50 animate-bounce">
          <span className="material-symbols-outlined text-secondary text-subheading-lg">check_circle</span>
          <span className="font-body-md text-body-md">
            Order KR-80291 confirmed. Dispatch preparation initialized for Clara Vanderbilt.
          </span>
        </div>
      )}

      {/* Minimalist Security Header */}
      <header className="w-full bg-surface-container-low/70 backdrop-blur-md px-margin-mobile sm:px-margin-tablet lg:px-margin-desktop py-space-lg">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between">
          <button onClick={onBackToHome} className="flex items-center gap-space-xs group cursor-pointer">
            <span className="font-headline-md text-headline-md tracking-tight text-on-surface">ATELIER</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary -mt-1" />
            <span className="font-label-caps text-label-caps tracking-[0.24em] text-on-surface-variant font-semibold pl-1">STORE</span>
          </button>
          <div className="flex items-center gap-space-sm bg-surface-container px-space-md py-space-xs rounded-full">
            <span className="material-symbols-outlined text-secondary text-subheading-md" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock
            </span>
            <span className="font-label-caps text-label-caps tracking-wider text-on-surface-variant">
              256-BIT ENCRYPTED VAULT
            </span>
          </div>
        </div>
      </header>

      {/* Main Checkout Workspace */}
      <div className="w-full max-w-[1360px] mx-auto px-margin-mobile sm:px-margin-tablet lg:px-margin-desktop py-space-2xl lg:py-space-3xl">
        
        {/* Progress Stepper */}
        <div className="mb-space-3xl">
          <div className="grid grid-cols-3 gap-space-md max-w-2xl relative">
            <div className="flex flex-col gap-space-xs relative group cursor-pointer" onClick={() => scrollToSection('step-shipping')}>
              <div className="flex items-center gap-space-xs">
                <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-[10px]">1</span>
                <span className="font-label-caps text-label-caps text-on-surface font-semibold tracking-widest">SHIPPING</span>
              </div>
              <div className="h-0.5 w-full bg-primary rounded-full mt-space-xs" />
              <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Franklin St, NY</span>
            </div>

            <div className="flex flex-col gap-space-xs relative group cursor-pointer" onClick={() => scrollToSection('step-delivery')}>
              <div className="flex items-center gap-space-xs">
                <span className="w-5 h-5 rounded-full bg-secondary text-on-primary flex items-center justify-center font-label-caps text-[10px]">2</span>
                <span className="font-label-caps text-label-caps text-secondary font-semibold tracking-widest">DELIVERY</span>
              </div>
              <div className="h-0.5 w-full bg-secondary rounded-full mt-space-xs" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">Carbon-Neutral</span>
            </div>

            <div className="flex flex-col gap-space-xs relative group cursor-pointer" onClick={() => scrollToSection('step-payment')}>
              <div className="flex items-center gap-space-xs">
                <span className="w-5 h-5 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-label-caps text-[10px]">3</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">PAYMENT</span>
              </div>
              <div className="h-0.5 w-full bg-surface-variant rounded-full mt-space-xs" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">Vault Verified</span>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-3xl items-start">
          
          {/* Checkout Left Section */}
          <section className="lg:col-span-7 flex flex-col gap-space-3xl">
            
            {/* Express 1-Click Checkout */}
            <div className="bg-surface-container-low p-space-xl rounded-xl flex flex-col gap-space-md shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps tracking-widest text-on-surface-variant uppercase">
                  Express Frictionless Checkout
                </span>
                <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-sm">bolt</span> Instant Tokenization
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <button className="w-full h-12 bg-primary text-on-primary rounded flex items-center justify-center gap-2 hover:bg-secondary transition-colors duration-200 cursor-pointer" type="button">
                  <span className="font-subheading-md text-subheading-md font-medium tracking-tight"> Pay</span>
                </button>
                <button className="w-full h-12 bg-[#5A31F4] text-white rounded flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer" type="button">
                  <span className="font-subheading-md text-subheading-md font-semibold tracking-wide">shop<span className="opacity-80">Pay</span></span>
                </button>
              </div>
              <div className="flex items-center gap-space-md my-space-xs">
                <div className="h-[1px] flex-1 bg-surface-variant" />
                <span className="font-label-caps text-label-caps text-on-surface-variant/80">OR TRADITIONAL ARCHIVAL ORDER</span>
                <div className="h-[1px] flex-1 bg-surface-variant" />
              </div>
            </div>

            {/* STAGE 01: Contact & Shipping */}
            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col gap-space-xl" id="step-shipping">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-space-xs mb-1">
                    <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Stage 01</span>
                    <span className="text-on-surface-variant">•</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Identity</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Contact &amp; Delivery Destination</h2>
                </div>
                <span className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-caps text-xs">
                  <span className="material-symbols-outlined text-base">check</span>
                </span>
              </div>

              <div className="flex flex-col gap-space-xxs">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="contact-email">
                  CORRESPONDENCE EMAIL
                </label>
                <input
                  className="w-full h-12 px-space-md bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all"
                  id="contact-email"
                  type="email"
                  defaultValue="clara.vanderbilt@atelier.co"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Order confirmation, artisan dispatch log, and invoice are delivered here.
                </span>
              </div>

              {/* Saved vs New Location */}
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant">SAVED LOCATIONS</span>
                <label className="cursor-pointer flex items-start justify-between p-space-md rounded bg-surface-container-low hover:bg-surface-container transition-all">
                  <div className="flex items-start gap-space-md">
                    <input
                      checked={!useNewAddress}
                      onChange={() => setUseNewAddress(false)}
                      className="mt-1 accent-primary h-4 w-4"
                      name="shipping-preset"
                      type="radio"
                    />
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-subheading-md text-subheading-md text-on-surface font-semibold">Clara Vanderbilt</span>
                        <span className="bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase">Primary Atelier</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">142 Franklin St, Apt 4B, Tribeca, New York, NY 10013</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">+1 (212) 555-0198</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps text-secondary font-medium">VERIFIED</span>
                </label>

                <label className="cursor-pointer flex items-center gap-space-md p-space-md rounded bg-surface-container-lowest hover:bg-surface-container-low transition-all">
                  <input
                    checked={useNewAddress}
                    onChange={() => setUseNewAddress(true)}
                    className="accent-primary h-4 w-4"
                    name="shipping-preset"
                    type="radio"
                  />
                  <div className="flex items-center gap-space-xs text-on-surface">
                    <span className="material-symbols-outlined text-subheading-md">add_location_alt</span>
                    <span className="font-subheading-md text-subheading-md">Deliver to an alternate residence or studio</span>
                  </div>
                </label>
              </div>

              {/* New Address Fields */}
              {useNewAddress && (
                <div className="flex flex-col gap-space-md pt-space-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">FIRST NAME</label>
                      <input
                        value={newAddress.firstName}
                        onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                        className="h-12 px-space-md bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Maya"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">LAST NAME</label>
                      <input
                        value={newAddress.lastName}
                        onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                        className="h-12 px-space-md bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Lin"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">STREET ADDRESS</label>
                    <input
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="h-12 px-space-md bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                      placeholder="Street name and house number"
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">CITY</label>
                      <input
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="h-12 px-space-md bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                        placeholder="New York"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">STATE / REGION</label>
                      <input
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="h-12 px-space-md bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                        placeholder="NY"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">POSTAL CODE</label>
                      <input
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        className="h-12 px-space-md bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                        placeholder="10013"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STAGE 02: Delivery Logistics */}
            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col gap-space-xl" id="step-delivery">
              <div>
                <div className="flex items-center gap-space-xs mb-1">
                  <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Stage 02</span>
                  <span className="text-on-surface-variant">•</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Fulfillment</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Select Logistics &amp; Pacing</h2>
              </div>

              <div className="flex flex-col gap-space-md">
                <label className="cursor-pointer relative p-space-lg rounded bg-surface-container-low hover:bg-surface-container transition-all flex items-start justify-between">
                  <div className="flex items-start gap-space-md">
                    <input
                      checked={shippingCost === 0}
                      onChange={() => setShippingCost(0)}
                      className="mt-1 accent-primary h-4 w-4"
                      name="shipping-speed"
                      type="radio"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-subheading-md text-subheading-md text-on-surface font-medium">Complimentary Carbon-Neutral Courier</span>
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase">100% Offset</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1">Delivered via zero-emission fleet partners within 2–3 business days.</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Estimated window: Friday, Oct 27 – Monday, Oct 30</p>
                    </div>
                  </div>
                  <span className="font-price-editorial text-price-editorial text-on-surface font-semibold">Free</span>
                </label>

                <label className="cursor-pointer relative p-space-lg rounded bg-surface-container-lowest hover:bg-surface-container-low transition-all flex items-start justify-between">
                  <div className="flex items-start gap-space-md">
                    <input
                      checked={shippingCost === 2500}
                      onChange={() => setShippingCost(2500)}
                      className="mt-1 accent-primary h-4 w-4"
                      name="shipping-speed"
                      type="radio"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-subheading-md text-subheading-md text-on-surface font-medium">Priority White Glove Courier</span>
                        <span className="bg-secondary-fixed text-on-secondary-fixed font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase">Fast Track</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1">Dispatched within 4 hours. Direct courier hand-off in 1 business day.</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Estimated window: Tomorrow by 5:00 PM</p>
                    </div>
                  </div>
                  <span className="font-price-editorial text-price-editorial text-on-surface font-semibold">Rs. 2,500</span>
                </label>
              </div>
            </div>

            {/* STAGE 03: Payment Settlement */}
            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col gap-space-xl" id="step-payment">
              <div>
                <div className="flex items-center gap-space-xs mb-1">
                  <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Stage 03</span>
                  <span className="text-on-surface-variant">•</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Settlement</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Payment Method</h2>
              </div>

              <div className="flex flex-col gap-space-md">
                <div className="bg-surface-container-low rounded p-space-lg flex flex-col gap-space-md">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-space-md">
                      <input
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-primary h-4 w-4"
                        name="payment-method"
                        type="radio"
                      />
                      <span className="font-subheading-md text-subheading-md text-on-surface font-medium">Credit or Debit Card</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-80">
                      <span className="font-label-caps text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface">VISA</span>
                      <span className="font-label-caps text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface">MC</span>
                      <span className="font-label-caps text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface">AMEX</span>
                    </div>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="flex flex-col gap-space-md pt-space-xs">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-caps text-label-caps text-on-surface-variant">CARD NUMBER</label>
                        <div className="relative">
                          <input
                            className="w-full h-12 pl-space-md pr-12 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="•••• •••• •••• 4242"
                            type="text"
                            defaultValue="4532 •••• •••• 8819"
                          />
                          <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant text-xl">credit_card</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-space-md">
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant">EXPIRATION</label>
                          <input
                            className="h-12 px-space-md bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="MM / YY"
                            type="text"
                            defaultValue="09 / 27"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <label className="font-label-caps text-label-caps text-on-surface-variant">SECURITY CODE</label>
                            <span className="font-body-sm text-[11px] text-secondary cursor-pointer">What is CVC?</span>
                          </div>
                          <input
                            className="h-12 px-space-md bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="CVC"
                            type="password"
                            defaultValue="842"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-caps text-label-caps text-on-surface-variant">NAME ON CARD</label>
                        <input
                          className="h-12 px-space-md bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                          type="text"
                          defaultValue="CLARA VANDERBILT"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <label className="flex items-center justify-between p-space-md rounded bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer">
                  <div className="flex items-center gap-space-md">
                    <input
                      checked={paymentMethod === 'klarna'}
                      onChange={() => setPaymentMethod('klarna')}
                      className="accent-primary h-4 w-4"
                      name="payment-method"
                      type="radio"
                    />
                    <div>
                      <span className="font-subheading-md text-subheading-md text-on-surface font-medium">Koko / Mint Pay 3 Installments</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">3 interest-free installments of Rs. {Math.round(totalSettlement / 3).toLocaleString('en-LK')}</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps bg-surface-container px-2 py-1 rounded text-on-surface font-semibold">KOKO</span>
                </label>

                <label className="flex items-center justify-between p-space-md rounded bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer">
                  <div className="flex items-center gap-space-md">
                    <input
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="accent-primary h-4 w-4"
                      name="payment-method"
                      type="radio"
                    />
                    <span className="font-subheading-md text-subheading-md text-on-surface font-medium">Bank Transfer / Online Portal</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-secondary font-semibold">ONLINE</span>
                </label>
              </div>

              <div className="pt-space-xs">
                <label className="flex items-center gap-space-sm cursor-pointer">
                  <input defaultChecked className="accent-primary h-4 w-4 rounded" type="checkbox" />
                  <span className="font-body-md text-body-md text-on-surface">Billing address is identical to shipping atelier</span>
                </label>
              </div>

              <div className="flex flex-col gap-space-md pt-space-md">
                <button
                  onClick={handleTriggerOrder}
                  disabled={submitting || orderSecured}
                  className={`w-full h-14 font-label-md text-label-md tracking-wider uppercase rounded transition-all duration-300 flex items-center justify-center gap-space-sm shadow-md cursor-pointer ${
                    orderSecured ? 'bg-secondary text-on-primary' : 'bg-primary text-on-primary hover:bg-secondary'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">
                    {submitting ? 'sync' : orderSecured ? 'done' : 'lock'}
                  </span>
                  <span>
                    {submitting
                      ? 'AUTHORIZING VAULT TRANSACTION...'
                      : orderSecured
                      ? 'ORDER #KR-80291 SECURED'
                      : `COMPLETE ORDER — Rs. ${Math.round(totalSettlement).toLocaleString('en-LK')}`}
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Right Summary Sidebar */}
          <aside className="lg:col-span-5 w-full sticky top-8">
            <div className="bg-surface-container-low rounded-xl p-space-xl shadow-sm flex flex-col gap-space-xl">
              <div className="flex items-center justify-between pb-space-md border-b-0">
                <div className="flex items-baseline gap-space-xs">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Curated Order</h3>
                  <span className="font-label-caps text-label-caps text-secondary font-semibold">(3 OBJECTS)</span>
                </div>
                <button onClick={onBackToHome} className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary underline underline-offset-4 transition-colors cursor-pointer">
                  EDIT BASKET
                </button>
              </div>

              <div className="bg-surface-container p-space-md rounded flex flex-col gap-space-xs">
                <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                  <span>Items Subtotal</span>
                  <span className="text-on-surface font-medium">Rs. {itemsSubtotal.toLocaleString('en-LK')}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between items-center text-body-sm font-body-sm text-secondary">
                    <span>Member Discount (-10%)</span>
                    <span className="font-medium">-Rs. {discountAmount.toLocaleString('en-LK')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                  <span>Logistics</span>
                  <span className="text-on-surface font-medium">
                    {shippingCost === 0 ? 'Free' : `Rs. ${shippingCost.toLocaleString('en-LK')}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                  <span>Estimated Tax</span>
                  <span className="text-on-surface font-medium">Rs. {estimatedTax.toLocaleString('en-LK')}</span>
                </div>
                <div className="my-space-xs h-[1px] bg-surface-variant" />
                <div className="flex justify-between items-baseline">
                  <span className="font-subheading-md text-subheading-md text-on-surface font-semibold">Total Settlement</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">
                    Rs. {Math.round(totalSettlement).toLocaleString('en-LK')}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
