import React, { useState } from 'react';

export default function CheckoutPage({ onBackToHome, onOrderComplete, cartItems = [], user, isDirectBuy = false }) {
  // Email & Contact
  const [email, setEmail] = useState(user?.email || 'clara.vanderbilt@atelier.co');
  
  // Address State
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : 'Clara',
    lastName: user?.name ? user.name.split(' ')[1] || '' : 'Vanderbilt',
    street: '142 Franklin St, Apt 4B',
    city: 'Colombo',
    state: 'Western Province',
    zip: '00300',
    phone: '+94 77 123 4567',
  });

  // Shipping Logistics Option State
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingLabel, setShippingLabel] = useState('Complimentary Carbon-Neutral Courier');

  // Payment Method State: 'card' | 'koko' | 'bank' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8819',
    exp: '09 / 27',
    cvc: '842',
    name: 'CLARA VANDERBILT',
  });

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Order Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitStepText, setSubmitStepText] = useState('');
  const [orderSecured, setOrderSecured] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  
  const [orderId] = useState(() => `ATL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [orderDate] = useState(() => new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));

  // Items List
  const displayItems = (cartItems && cartItems.length > 0) ? cartItems : [
    {
      id: 'p1',
      title: 'Solitude Raw Linen Kimono Duster',
      price: 42000,
      qty: 1,
      color: 'Undyed Ecru',
      size: 'II',
      img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  // Pricing math in LKR (Rs.)
  const itemsSubtotal = displayItems.reduce((acc, item) => {
    let p = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 10000;
    if (p > 0 && p < 1000) p = p * 100;
    const q = item.qty || item.quantity || 1;
    return acc + (p * q);
  }, 0);

  const discountAmount = promoApplied ? Math.round(itemsSubtotal * discountPercent) : 0;
  const activeSubtotal = Math.max(0, itemsSubtotal - discountAmount);
  const estimatedTax = Math.round(activeSubtotal * 0.08); // 8% estimated luxury VAT/Tax
  const totalSettlement = activeSubtotal + estimatedTax + shippingCost;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    // Load dynamic promo codes configured by Admin in localStorage
    let activeDiscounts = [
      { code: 'ATELIER10', percentage: 10, active: true },
      { code: 'LUXURY20', percentage: 20, active: true },
      { code: 'WELCOME15', percentage: 15, active: true },
      { code: 'SUMMER25', percentage: 25, active: true },
    ];

    try {
      const saved = localStorage.getItem('atelierstore_discount_codes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeDiscounts = parsed;
        }
      }
    } catch (e) {
      console.error('Error loading discount codes in Checkout:', e);
    }

    const matched = activeDiscounts.find(
      (d) => d.code.toUpperCase() === code && d.active !== false
    );

    if (matched) {
      const pctDecimal = (matched.percentage || 10) / 100;
      setPromoApplied(true);
      setDiscountPercent(pctDecimal);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setDiscountPercent(0);
      setPromoError(`Invalid or inactive promo code "${code}".`);
    }
  };

  const handleTriggerOrder = () => {
    setSubmitting(true);
    setSubmitStepText('Encrypting Vault Transaction...');

    const customerName = useNewAddress
      ? `${newAddress.firstName || ''} ${newAddress.lastName || ''}`.trim() || (user?.name || 'Clara Vanderbilt')
      : (user?.name || 'Clara Vanderbilt');

    const customerDestination = useNewAddress
      ? `${newAddress.street}, ${newAddress.city}, ${newAddress.state} ${newAddress.zip}`
      : '142 Franklin St, Apt 4B, Tribeca, New York, NY 10013';

    const orderPayload = {
      orderId: orderId,
      patronName: customerName,
      patronEmail: email,
      items: displayItems.map(item => {
        let p = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 10000;
        if (p > 0 && p < 1000) p = p * 100;
        return {
          id: item.id || 'p1',
          title: item.title,
          price: p,
          qty: item.qty || item.quantity || 1,
          img: item.img || item.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
          color: item.color || 'Default',
          size: item.size || 'M',
        };
      }),
      destination: customerDestination,
      total: totalSettlement,
      status: 'Awaiting Dispatch',
      date: orderDate,
      paymentMethod: paymentMethod === 'card' ? 'Credit Card (Vault)' : paymentMethod === 'koko' ? 'Koko / Mint Pay' : paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery',
    };

    // Stage 1: DB Save
    setTimeout(() => {
      setSubmitStepText('Generating Archival Invoice & Passport...');
      try {
        fetch('http://localhost:5001/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        }).catch((err) => console.error('DB Order log error:', err));
      } catch (e) {
        console.error('API call exception:', e);
      }

      try {
        const existingUserOrders = JSON.parse(localStorage.getItem('atelierstore_user_orders') || '[]');
        localStorage.setItem('atelierstore_user_orders', JSON.stringify([orderPayload, ...existingUserOrders]));
      } catch (e) {
        console.error('Error saving order to localStorage:', e);
      }
    }, 700);

    // Stage 2: Finalize
    setTimeout(() => {
      setSubmitting(false);
      setOrderSecured(true);
      setShowToast(true);
      setShowBillModal(true);

      if (onOrderComplete) onOrderComplete();
      setTimeout(() => setShowToast(false), 5000);
    }, 1600);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="w-full bg-surface min-h-screen text-on-surface selection:bg-surface-variant selection:text-on-surface">
      
      {/* Toast Overlay */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-6 py-4 rounded-full shadow-2xl transition-all duration-500 flex items-center gap-3 z-50 animate-bounce border border-secondary/30">
          <span className="material-symbols-outlined text-secondary text-2xl">check_circle</span>
          <span className="font-body-md text-sm font-medium">
            Order #{orderId} confirmed! Archival dispatch initialized.
          </span>
        </div>
      )}

      {/* Minimalist Professional Security Header */}
      <header className="w-full bg-surface-container-lowest border-b border-surface-variant/50 sticky top-0 z-40 backdrop-blur-md shadow-xs">
        <div className="max-w-[1360px] mx-auto px-margin-mobile sm:px-margin-tablet lg:px-margin-desktop h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-1.5 font-label-caps text-xs uppercase"
              title="Return to store"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span className="hidden sm:inline">Back to Store</span>
            </button>

            <div className="h-6 w-px bg-surface-variant/60 hidden sm:block"></div>

            <button onClick={onBackToHome} className="flex items-center gap-space-xs group cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 240 60"
                className="h-8 md:h-9 w-auto text-on-surface transition-transform duration-300 group-hover:scale-105"
                fill="none"
              >
                <text x="10" y="40" fontFamily="'Playfair Display', serif" fontSize="26" fontWeight="600" letterSpacing="0.18em" fill="currentColor">ATELIER</text>
                <text x="150" y="40" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="14" fontWeight="400" letterSpacing="0.3em" fill="#78716c">STORE</text>
                <circle cx="138" cy="32" r="2.5" fill="#c27803" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isDirectBuy ? (
              <span className="px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 font-label-caps text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">bolt</span>
                <span>Direct Item Checkout</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-label-caps text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">shopping_bag</span>
                <span>Shopping Bag Checkout ({displayItems.length})</span>
              </span>
            )}

            <div className="hidden md:flex items-center gap-1.5 bg-surface-container-low border border-surface-variant/60 px-3.5 py-1.5 rounded-full text-xs font-label-caps text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-base">lock</span>
              <span className="font-semibold tracking-wider">256-Bit SSL Encrypted Vault</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Checkout Workspace */}
      <div className="w-full max-w-[1360px] mx-auto px-margin-mobile sm:px-margin-tablet lg:px-margin-desktop py-space-2xl">
        
        {/* Step Navigation Bar */}
        <div className="mb-space-2xl bg-surface-container-low p-4 rounded-2xl border border-surface-variant/60 shadow-xs">
          <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-3xl mx-auto">
            
            <div
              onClick={() => scrollToSection('step-shipping')}
              className="flex flex-col items-center sm:items-start gap-1 p-2 rounded-xl cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-xs font-bold shadow-xs">1</span>
                <span className="font-label-caps text-xs text-on-surface font-bold tracking-widest hidden sm:inline">1. ADDRESS &amp; IDENTITY</span>
                <span className="font-label-caps text-[10px] text-on-surface font-bold sm:hidden">ADDRESS</span>
              </div>
              <div className="h-1 w-full bg-primary rounded-full mt-1" />
              <span className="font-body-sm text-[11px] text-on-surface-variant hidden sm:inline">Contact &amp; Atelier Destination</span>
            </div>

            <div
              onClick={() => scrollToSection('step-delivery')}
              className="flex flex-col items-center sm:items-start gap-1 p-2 rounded-xl cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-caps text-xs font-bold shadow-xs">2</span>
                <span className="font-label-caps text-xs text-secondary font-bold tracking-widest hidden sm:inline">2. LOGISTICS &amp; FULFILLMENT</span>
                <span className="font-label-caps text-[10px] text-secondary font-bold sm:hidden">DELIVERY</span>
              </div>
              <div className="h-1 w-full bg-secondary rounded-full mt-1" />
              <span className="font-body-sm text-[11px] text-on-surface-variant hidden sm:inline">Dispatch Pacing</span>
            </div>

            <div
              onClick={() => scrollToSection('step-payment')}
              className="flex flex-col items-center sm:items-start gap-1 p-2 rounded-xl cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-caps text-xs font-bold border border-surface-variant">3</span>
                <span className="font-label-caps text-xs text-on-surface font-bold tracking-widest hidden sm:inline">3. SETTLEMENT &amp; PAYMENT</span>
                <span className="font-label-caps text-[10px] text-on-surface font-bold sm:hidden">PAYMENT</span>
              </div>
              <div className="h-1 w-full bg-surface-variant rounded-full mt-1" />
              <span className="font-body-sm text-[11px] text-on-surface-variant hidden sm:inline">Secure Card or Koko</span>
            </div>

          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap- space-2xl lg:gap-space-3xl items-start">
          
          {/* Left Column: Form Steps */}
          <section className="lg:col-span-7 flex flex-col gap-space-2xl">
            
            {/* Frictionless Express Checkout Panel */}
            <div className="bg-surface-container-low p-space-xl rounded-2xl border border-surface-variant/80 shadow-xs space-y-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-xs tracking-widest text-on-surface-variant uppercase font-semibold">
                  ⚡ Express Frictionless Checkout
                </span>
                <span className="font-body-sm text-xs text-secondary flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-sm">verified_user</span> Instant Tokenized Auth
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <button
                  type="button"
                  onClick={handleTriggerOrder}
                  className="w-full h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center gap-2 hover:bg-secondary transition-all cursor-pointer font-bold shadow-xs"
                >
                  <span className="material-symbols-outlined text-lg">credit_card</span>
                  <span className="font-label-caps text-xs tracking-wider uppercase">Vault 1-Click Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('koko'); scrollToSection('step-payment'); }}
                  className="w-full h-12 bg-[#5A31F4] text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer font-bold shadow-xs"
                >
                  <span className="font-label-caps text-xs tracking-wider uppercase">koko Pay in 3</span>
                </button>
              </div>

              <div className="flex items-center gap-space-md my-space-xs">
                <div className="h-[1px] flex-1 bg-surface-variant/60" />
                <span className="font-label-caps text-[10px] text-on-surface-variant/80 tracking-widest uppercase">OR STANDARD ARCHIVAL CHECKOUT</span>
                <div className="h-[1px] flex-1 bg-surface-variant/60" />
              </div>
            </div>

            {/* STAGE 01: Contact & Shipping */}
            <div className="bg-surface-container-lowest p-space-xl rounded-2xl border border-surface-variant shadow-xs space-y-space-lg" id="step-shipping">
              <div className="flex items-start justify-between border-b border-surface-variant/50 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-label-caps text-xs text-secondary uppercase font-bold">Stage 01</span>
                    <span className="text-on-surface-variant">•</span>
                    <span className="font-label-caps text-xs text-on-surface-variant font-medium">Customer Identity</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Contact &amp; Delivery Destination</h2>
                </div>
                <span className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">person_pin</span>
                </span>
              </div>

              {/* Correspondence Email */}
              <div className="space-y-1.5">
                <label className="font-label-caps text-xs text-on-surface font-bold uppercase tracking-wider block" htmlFor="contact-email">
                  CORRESPONDENCE EMAIL ADDRESS
                </label>
                <div className="relative">
                  <input
                    className="w-full h-12 pl-10 pr-4 bg-surface-container-low text-on-surface font-body-md text-sm rounded-xl border border-surface-variant/60 focus:outline-none focus:border-secondary focus:bg-surface-container-lowest transition-all"
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@ateliereditions.com"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-lg">mail</span>
                </div>
                <span className="font-body-sm text-xs text-on-surface-variant block">
                  Archival invoice, live courier tracking link, and passport digital certificate will be dispatched here.
                </span>
              </div>

              {/* Saved Location vs New Location */}
              <div className="space-y-3 pt-2">
                <span className="font-label-caps text-xs text-on-surface font-bold uppercase tracking-wider block">DELIVERY LOCATION PRESET</span>
                
                <label className={`cursor-pointer flex items-start justify-between p-4 rounded-xl border transition-all ${!useNewAddress ? 'bg-surface-container-low border-secondary shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60 hover:bg-surface-container-low'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      checked={!useNewAddress}
                      onChange={() => setUseNewAddress(false)}
                      className="mt-1 accent-secondary h-4 w-4 cursor-pointer"
                      name="shipping-preset"
                      type="radio"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-subheading-md text-sm text-on-surface font-bold">{user?.name || 'Clara Vanderbilt'}</span>
                        <span className="bg-primary text-on-primary font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Primary Residence</span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant mt-1 font-medium">142 Franklin St, Apt 4B, Tribeca, New York, NY 10013</p>
                      <p className="font-body-sm text-xs text-on-surface-variant/80 mt-0.5">+1 (212) 555-0198</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-xs text-secondary font-bold">VERIFIED</span>
                </label>

                <label className={`cursor-pointer flex items-center gap-3 p-4 rounded-xl border transition-all ${useNewAddress ? 'bg-surface-container-low border-secondary shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60 hover:bg-surface-container-low'}`}>
                  <input
                    checked={useNewAddress}
                    onChange={() => setUseNewAddress(true)}
                    className="accent-secondary h-4 w-4 cursor-pointer"
                    name="shipping-preset"
                    type="radio"
                  />
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-lg text-secondary">add_location_alt</span>
                    <span className="font-subheading-md text-sm font-semibold">Deliver to an alternate residence or studio</span>
                  </div>
                </label>
              </div>

              {/* New Address Form */}
              {useNewAddress && (
                <div className="space-y-4 pt-3 border-t border-surface-variant/40 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-1">FIRST NAME</label>
                      <input
                        value={newAddress.firstName}
                        onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                        className="w-full h-11 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg border border-surface-variant/60 focus:outline-none focus:border-secondary"
                        placeholder="First Name"
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-1">LAST NAME</label>
                      <input
                        value={newAddress.lastName}
                        onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                        className="w-full h-11 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg border border-surface-variant/60 focus:outline-none focus:border-secondary"
                        placeholder="Last Name"
                        type="text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-1">STREET ADDRESS</label>
                    <input
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full h-11 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg border border-surface-variant/60 focus:outline-none focus:border-secondary"
                      placeholder="Street name, house/suite number"
                      type="text"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-1">CITY</label>
                      <input
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full h-11 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg border border-surface-variant/60 focus:outline-none focus:border-secondary"
                        placeholder="Colombo"
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-1">STATE / PROVINCE</label>
                      <input
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full h-11 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg border border-surface-variant/60 focus:outline-none focus:border-secondary"
                        placeholder="Western Province"
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-1">POSTAL CODE</label>
                      <input
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        className="w-full h-11 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg border border-surface-variant/60 focus:outline-none focus:border-secondary"
                        placeholder="00300"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STAGE 02: Logistics Options */}
            <div className="bg-surface-container-lowest p-space-xl rounded-2xl border border-surface-variant shadow-xs space-y-space-lg" id="step-delivery">
              <div className="flex items-start justify-between border-b border-surface-variant/50 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-label-caps text-xs text-secondary uppercase font-bold">Stage 02</span>
                    <span className="text-on-surface-variant">•</span>
                    <span className="font-label-caps text-xs text-on-surface-variant font-medium">Logistics &amp; Courier</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Select Fulfillment Pacing</h2>
                </div>
                <span className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">local_shipping</span>
                </span>
              </div>

              <div className="space-y-3">
                
                {/* Option 1: Free */}
                <label className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start justify-between ${shippingCost === 0 ? 'bg-surface-container-low border-secondary shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60 hover:bg-surface-container-low'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      checked={shippingCost === 0}
                      onChange={() => { setShippingCost(0); setShippingLabel('Complimentary Carbon-Neutral Courier'); }}
                      className="mt-1 accent-secondary h-4 w-4 cursor-pointer"
                      name="shipping-speed"
                      type="radio"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-subheading-md text-sm text-on-surface font-bold">Complimentary Carbon-Neutral Courier</span>
                        <span className="bg-primary/10 text-primary font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">100% Offset</span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant mt-1">Dispatched in insulated protective canvas garment sleeve within 2–3 business days.</p>
                      <p className="font-body-sm text-[11px] text-secondary font-semibold mt-0.5">Estimated Arrival: 2–3 Days</p>
                    </div>
                  </div>
                  <span className="font-price-editorial text-sm text-on-surface font-bold">Free</span>
                </label>

                {/* Option 2: Express */}
                <label className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start justify-between ${shippingCost === 1500 ? 'bg-surface-container-low border-secondary shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60 hover:bg-surface-container-low'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      checked={shippingCost === 1500}
                      onChange={() => { setShippingCost(1500); setShippingLabel('Express Air Dispatch'); }}
                      className="mt-1 accent-secondary h-4 w-4 cursor-pointer"
                      name="shipping-speed"
                      type="radio"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-subheading-md text-sm text-on-surface font-bold">Express Air Dispatch</span>
                        <span className="bg-secondary/15 text-secondary font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Priority Air</span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant mt-1">Priority dispatch from Kyoto or Stockholm depot within 24 hours.</p>
                      <p className="font-body-sm text-[11px] text-secondary font-semibold mt-0.5">Estimated Arrival: 1–2 Days</p>
                    </div>
                  </div>
                  <span className="font-price-editorial text-sm text-on-surface font-bold">Rs. 1,500</span>
                </label>

                {/* Option 3: Priority White Glove */}
                <label className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start justify-between ${shippingCost === 2500 ? 'bg-surface-container-low border-secondary shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60 hover:bg-surface-container-low'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      checked={shippingCost === 2500}
                      onChange={() => { setShippingCost(2500); setShippingLabel('Priority White Glove Concierge'); }}
                      className="mt-1 accent-secondary h-4 w-4 cursor-pointer"
                      name="shipping-speed"
                      type="radio"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-subheading-md text-sm text-on-surface font-bold">Priority White Glove Concierge Delivery</span>
                        <span className="bg-secondary text-on-secondary font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Same Day</span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant mt-1">Dispatched immediately. Direct personal courier hand-off by 5:00 PM.</p>
                      <p className="font-body-sm text-[11px] text-secondary font-semibold mt-0.5">Estimated Arrival: Next Day / Same Day</p>
                    </div>
                  </div>
                  <span className="font-price-editorial text-sm text-on-surface font-bold">Rs. 2,500</span>
                </label>

              </div>
            </div>

            {/* STAGE 03: Payment Methods */}
            <div className="bg-surface-container-lowest p-space-xl rounded-2xl border border-surface-variant shadow-xs space-y-space-lg" id="step-payment">
              <div className="flex items-start justify-between border-b border-surface-variant/50 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-label-caps text-xs text-secondary uppercase font-bold">Stage 03</span>
                    <span className="text-on-surface-variant">•</span>
                    <span className="font-label-caps text-xs text-on-surface-variant font-medium">Payment Settlement</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Select Vault Payment Gateway</h2>
                </div>
                <span className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </span>
              </div>

              <div className="space-y-3">
                
                {/* Method 1: Credit / Debit Card */}
                <div className={`p-4 rounded-xl border transition-all ${paymentMethod === 'card' ? 'bg-surface-container-low border-secondary shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-secondary h-4 w-4 cursor-pointer"
                        name="payment-method"
                        type="radio"
                      />
                      <span className="font-subheading-md text-sm text-on-surface font-bold">Credit or Debit Card</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-90">
                      <span className="font-label-caps text-[9px] bg-surface-container px-2 py-0.5 rounded text-on-surface font-bold border border-surface-variant">VISA</span>
                      <span className="font-label-caps text-[9px] bg-surface-container px-2 py-0.5 rounded text-on-surface font-bold border border-surface-variant">MC</span>
                      <span className="font-label-caps text-[9px] bg-surface-container px-2 py-0.5 rounded text-on-surface font-bold border border-surface-variant">AMEX</span>
                    </div>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="space-y-3 pt-4 mt-3 border-t border-surface-variant/40 animate-fade-in">
                      <div>
                        <label className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-1">CARD NUMBER</label>
                        <div className="relative">
                          <input
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            className="w-full h-11 pl-3 pr-10 bg-surface-container-lowest text-on-surface text-xs rounded-lg border border-surface-variant/60 focus:outline-none focus:border-secondary font-mono"
                            placeholder="4532 •••• •••• 8819"
                            type="text"
                          />
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-lg">credit_card</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-1">EXPIRATION DATE</label>
                          <input
                            value={cardDetails.exp}
                            onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value })}
                            className="w-full h-11 px-3 bg-surface-container-lowest text-on-surface text-xs rounded-lg border border-surface-variant/60 focus:outline-none focus:border-secondary font-mono"
                            placeholder="MM / YY"
                            type="text"
                          />
                        </div>
                        <div>
                          <label className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-1">SECURITY CVC</label>
                          <input
                            value={cardDetails.cvc}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                            className="w-full h-11 px-3 bg-surface-container-lowest text-on-surface text-xs rounded-lg border border-surface-variant/60 focus:outline-none focus:border-secondary font-mono"
                            placeholder="842"
                            type="password"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-1">CARDHOLDER NAME</label>
                        <input
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className="w-full h-11 px-3 bg-surface-container-lowest text-on-surface text-xs rounded-lg border border-surface-variant/60 focus:outline-none focus:border-secondary uppercase"
                          placeholder="CLARA VANDERBILT"
                          type="text"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Method 2: Koko Pay */}
                <div className={`p-4 rounded-xl border transition-all ${paymentMethod === 'koko' ? 'bg-surface-container-low border-secondary shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        checked={paymentMethod === 'koko'}
                        onChange={() => setPaymentMethod('koko')}
                        className="accent-secondary h-4 w-4 cursor-pointer"
                        name="payment-method"
                        type="radio"
                      />
                      <div>
                        <span className="font-subheading-md text-sm text-on-surface font-bold block">Koko / Mint Pay 3 Monthly Installments</span>
                        <span className="font-body-sm text-xs text-secondary font-medium block mt-0.5">
                          Pay 3 interest-free payments of Rs. {Math.round(totalSettlement / 3).toLocaleString('en-LK')}/mo
                        </span>
                      </div>
                    </div>
                    <span className="font-label-caps text-xs bg-[#5A31F4] text-white px-2.5 py-1 rounded-md font-bold uppercase">KOKO</span>
                  </label>
                </div>

                {/* Method 3: Bank Transfer */}
                <div className={`p-4 rounded-xl border transition-all ${paymentMethod === 'bank' ? 'bg-surface-container-low border-secondary shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="accent-secondary h-4 w-4 cursor-pointer"
                        name="payment-method"
                        type="radio"
                      />
                      <div>
                        <span className="font-subheading-md text-sm text-on-surface font-bold block">Direct Bank Transfer / Online Deposit</span>
                        <span className="font-body-sm text-xs text-on-surface-variant block mt-0.5">
                          Transfer directly to Atelier Commercial Bank / Sampath Bank account
                        </span>
                      </div>
                    </div>
                    <span className="font-label-caps text-xs text-secondary font-bold uppercase">BANK</span>
                  </label>

                  {paymentMethod === 'bank' && (
                    <div className="mt-3 p-3 bg-surface-container-lowest rounded-lg border border-surface-variant/40 space-y-1 text-xs text-on-surface font-mono">
                      <p><strong>Bank:</strong> Commercial Bank of Ceylon PLC</p>
                      <p><strong>Account Name:</strong> ATELIER EDITIONS (PVT) LTD</p>
                      <p><strong>Account Number:</strong> 1000 4829 9012</p>
                      <p><strong>Branch:</strong> Cinnamon Gardens Branch (Code: 014)</p>
                      <p className="text-[11px] text-secondary font-sans mt-1">Please use Order ID #{orderId} as payment reference.</p>
                    </div>
                  )}
                </div>

                {/* Method 4: Cash on Delivery */}
                <div className={`p-4 rounded-xl border transition-all ${paymentMethod === 'cod' ? 'bg-surface-container-low border-secondary shadow-xs' : 'bg-surface-container-lowest border-surface-variant/60'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-secondary h-4 w-4 cursor-pointer"
                        name="payment-method"
                        type="radio"
                      />
                      <div>
                        <span className="font-subheading-md text-sm text-on-surface font-bold block">Cash on Delivery (COD)</span>
                        <span className="font-body-sm text-xs text-on-surface-variant block mt-0.5">
                          Pay cash upon courier arrival at your address
                        </span>
                      </div>
                    </div>
                    <span className="font-label-caps text-xs text-on-surface font-bold uppercase">COD</span>
                  </label>
                </div>

              </div>

              {/* Complete Order Button */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleTriggerOrder}
                  disabled={submitting || orderSecured}
                  className={`w-full h-14 font-label-md text-sm tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer font-bold ${
                    orderSecured ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary hover:bg-secondary'
                  }`}
                  type="button"
                >
                  <span className={`material-symbols-outlined text-xl ${submitting ? 'animate-spin' : ''}`}>
                    {submitting ? 'sync' : orderSecured ? 'check_circle' : 'lock'}
                  </span>
                  <span>
                    {submitting
                      ? submitStepText
                      : orderSecured
                      ? `ORDER #${orderId} SECURED ✓`
                      : `AUTHORIZE & PLACE ORDER — Rs. ${Math.round(totalSettlement).toLocaleString('en-LK')}`}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-on-surface-variant font-label-caps">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">verified</span> Guaranteed Delivery
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">autorenew</span> 14-Day Free Returns
                  </span>
                </div>
              </div>

            </div>

          </section>

          {/* Right Column: Order Summary Sidebar */}
          <aside className="lg:col-span-5 w-full lg:sticky lg:top-24">
            <div className="bg-surface-container-low rounded-2xl p-space-xl border border-surface-variant/80 shadow-xs space-y-space-lg">
              
              <div className="flex items-center justify-between pb-3 border-b border-surface-variant/60">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Curated Order</h3>
                  <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-label-caps text-[10px] font-bold">
                    ({displayItems.length} {displayItems.length === 1 ? 'ITEM' : 'ITEMS'})
                  </span>
                </div>
                <button
                  onClick={onBackToHome}
                  className="font-label-caps text-xs text-secondary hover:underline uppercase font-bold cursor-pointer"
                >
                  Edit Items
                </button>
              </div>

              {/* Items List View */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {displayItems.map((item, idx) => {
                  let numPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 10000;
                  if (numPrice > 0 && numPrice < 1000) numPrice = numPrice * 100;
                  const qty = item.qty || item.quantity || 1;

                  return (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-lowest border border-surface-variant/50">
                      <img
                        src={item.img || item.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        className="w-14 h-16 object-cover rounded-lg bg-surface-container shrink-0"
                      />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-subheading-md text-xs text-on-surface font-bold truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-on-surface-variant mt-0.5 font-label-caps">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && <span>• Size: {item.size}</span>}
                        </div>
                        <span className="font-label-caps text-[11px] text-on-surface font-bold block mt-1">
                          Qty: {qty} × Rs. {Math.round(numPrice).toLocaleString('en-LK')}
                        </span>
                      </div>
                      <span className="font-price-editorial text-sm text-primary font-bold shrink-0">
                        Rs. {Math.round(numPrice * qty).toLocaleString('en-LK')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-surface-variant/50 space-y-2">
                <span className="font-label-caps text-[11px] text-on-surface font-bold uppercase tracking-wider block">PROMO CODE / PATRON VOUCHER</span>
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code (e.g. ATELIER10)"
                    className="flex-1 h-10 px-3 rounded-lg bg-surface-container-lowest border border-surface-variant/60 text-xs text-on-surface focus:outline-none focus:border-secondary uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 h-10 rounded-lg bg-primary text-on-primary font-label-caps text-xs uppercase font-bold hover:bg-secondary transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-label-caps text-[10px] text-on-surface-variant">Try:</span>
                  <button
                    type="button"
                    onClick={() => { setPromoCode('ATELIER10'); setPromoApplied(true); setDiscountPercent(0.10); setPromoError(''); }}
                    className="px-2 py-0.5 rounded bg-surface-container border border-surface-variant/60 font-label-caps text-[10px] font-bold hover:border-secondary cursor-pointer"
                  >
                    ATELIER10 (10% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPromoCode('LUXURY20'); setPromoApplied(true); setDiscountPercent(0.20); setPromoError(''); }}
                    className="px-2 py-0.5 rounded bg-surface-container border border-surface-variant/60 font-label-caps text-[10px] font-bold hover:border-secondary cursor-pointer"
                  >
                    LUXURY20 (20% OFF)
                  </button>
                </div>

                {promoApplied && (
                  <p className="text-xs text-secondary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span> Promo Code Applied! ({Math.round(discountPercent * 100)}% Discount)
                  </p>
                )}
                {promoError && (
                  <p className="text-xs text-error font-medium">{promoError}</p>
                )}
              </div>

              {/* Price Breakdown Math Table */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-variant/60 space-y-2 text-xs">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Items Subtotal</span>
                  <span className="text-on-surface font-semibold font-mono">Rs. {itemsSubtotal.toLocaleString('en-LK')}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between items-center text-secondary font-semibold">
                    <span>Member Discount (-{Math.round(discountPercent * 100)}%)</span>
                    <span className="font-mono">-Rs. {discountAmount.toLocaleString('en-LK')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Shipping Logistics ({shippingCost === 0 ? 'Complimentary' : shippingLabel})</span>
                  <span className="text-on-surface font-semibold font-mono">
                    {shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost.toLocaleString('en-LK')}`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Estimated Tax &amp; VAT (8%)</span>
                  <span className="text-on-surface font-semibold font-mono">Rs. {estimatedTax.toLocaleString('en-LK')}</span>
                </div>

                <div className="my-2 h-px bg-surface-variant/60" />

                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="font-subheading-md text-sm text-on-surface font-bold block">Total Settlement</span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant">INCLUDES ALL TAXES &amp; DUTIES</span>
                  </div>
                  <span className="font-price-editorial text-xl text-primary font-bold">
                    Rs. {Math.round(totalSettlement).toLocaleString('en-LK')}
                  </span>
                </div>
              </div>

              {/* Archival Security Trust Card */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-variant/50 space-y-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2 text-on-surface font-bold">
                  <span className="material-symbols-outlined text-secondary text-base">verified</span>
                  <span>Archival Lifetime Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every garment includes an individual linen passport seam code for lifetime sashiko repair and complimentary seasonal re-dyeing.
                </p>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* Printable Order Bill Invoice Modal */}
      {(showBillModal || orderSecured) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          {/* Printable Invoice Container */}
          <div
            id="printable-bill"
            className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-slate-200 relative my-8"
          >
            <style>{`
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #printable-bill, #printable-bill * {
                  visibility: visible !important;
                }
                #printable-bill {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 32px !important;
                  background: #ffffff !important;
                  color: #0f172a !important;
                  box-shadow: none !important;
                  border: none !important;
                  border-radius: 0 !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}</style>

            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold tracking-tight text-slate-900">ATELIER</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                  <span className="text-xs tracking-[0.25em] font-semibold text-slate-500 uppercase">STORE</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Haute Couture &amp; Fine Textiles</p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                  OFFICIAL TAX INVOICE &amp; RECEIPT
                </span>
                <p className="text-xs text-slate-500 mt-2 font-mono">Invoice #{orderId}</p>
                <p className="text-xs text-slate-500 font-mono">{orderDate}</p>
              </div>
            </div>

            {/* Billed To & Payment Meta */}
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl mb-6 text-xs text-slate-700">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">CUSTOMER DETAILS</span>
                <p className="font-semibold text-slate-900 text-sm">
                  {useNewAddress ? `${newAddress.firstName || 'Valued'} ${newAddress.lastName || 'Patron'}` : (user?.name || 'Clara Vanderbilt')}
                </p>
                <p className="text-slate-600 mt-0.5">
                  {useNewAddress ? `${newAddress.street}, ${newAddress.city}, ${newAddress.state} ${newAddress.zip}` : '142 Franklin St, Apt 4B, Tribeca, New York, NY 10013'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">PAYMENT LOGISTICS</span>
                <p className="font-semibold text-emerald-700 flex items-center justify-end gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> STATUS: AUTHORIZED &amp; PAID
                </p>
                <p className="text-slate-600 mt-0.5 uppercase">
                  Method: {paymentMethod === 'card' ? 'Visa / MasterCard Vault' : paymentMethod === 'koko' ? 'Koko / Mint Pay' : paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery'}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {displayItems.map((item, idx) => {
                    let price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 10000;
                    if (price > 0 && price < 1000) price = price * 100;
                    const qty = item.qty || item.quantity || 1;
                    return (
                      <tr key={idx} className="py-3">
                        <td className="py-2 font-medium">
                          {item.title}
                          {(item.color || item.size) && (
                            <span className="block text-[10px] text-slate-400">
                              {[item.color, item.size ? `Size ${item.size}` : ''].filter(Boolean).join(' • ')}
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-center font-semibold">{qty}</td>
                        <td className="py-2 text-right font-mono">Rs. {Math.round(price).toLocaleString('en-LK')}</td>
                        <td className="py-2 text-right font-mono font-bold text-slate-900">
                          Rs. {Math.round(price * qty).toLocaleString('en-LK')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bill Summary */}
            <div className="border-t border-slate-200 pt-4 flex flex-col gap-1.5 text-xs text-slate-600 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono text-slate-900 font-medium">Rs. {itemsSubtotal.toLocaleString('en-LK')}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Member Discount (-{Math.round(discountPercent * 100)}%)</span>
                  <span className="font-mono">-Rs. {discountAmount.toLocaleString('en-LK')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping &amp; Logistics</span>
                <span className="font-mono text-slate-900 font-medium">
                  {shippingCost === 0 ? 'COMPLIMENTARY' : `Rs. ${shippingCost.toLocaleString('en-LK')}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-slate-900 font-medium">Rs. {estimatedTax.toLocaleString('en-LK')}</span>
              </div>
              <div className="border-t-2 border-slate-900 my-1 pt-2 flex justify-between items-baseline font-bold text-slate-900 text-sm">
                <span>GRAND TOTAL PAID</span>
                <span className="font-mono text-base text-amber-700">Rs. {Math.round(totalSettlement).toLocaleString('en-LK')}</span>
              </div>
            </div>

            {/* Official Seal / Thank you */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <p>Thank you for your archival order with Atelier Store. Authentic certified luxury.</p>
              <span className="font-mono font-bold text-slate-800 border border-slate-300 px-2 py-0.5 rounded uppercase tracking-wider">
                SEALED &amp; VERIFIED
              </span>
            </div>

            {/* Action Buttons (Hidden when printing) */}
            <div className="no-print mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
              <button
                onClick={() => window.print()}
                className="h-11 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-md cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">print</span>
                Print Bill / Save PDF
              </button>
              <button
                onClick={() => {
                  setShowBillModal(false);
                  if (onBackToHome) onBackToHome();
                }}
                className="h-11 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer"
                type="button"
              >
                Return to Store
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
