import React, { useState, useEffect } from 'react';

export default function AccountPage({ user, onOpenAuth, onLogOut, onUpdateUser, onGoToShop }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit form fields
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [editStreet, setEditStreet] = useState(user?.address?.street || '');
  const [editCity, setEditCity] = useState(user?.address?.city || '');
  const [editCountry, setEditCountry] = useState(user?.address?.country || '');
  const [editPostal, setEditPostal] = useState(user?.address?.postalCode || '');
  const [editPhone, setEditPhone] = useState(user?.address?.phone || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Address form
  const [newLabel, setNewLabel] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');

  // Delivered Item Review State
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewNotice, setReviewNotice] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('atelierstore_submitted_order_reviews') || '{}');
    } catch (e) {
      return {};
    }
  });

  const handleOpenReviewModal = (order, item) => {
    setReviewModalItem({
      orderId: order.id,
      item: item,
      title: item.title,
      id: item.id || item.title,
    });
    setReviewRating(5);
    setReviewTitle('');
    setReviewBody('');
  };

  const handleSubmitOrderReview = (e) => {
    e.preventDefault();
    if (!reviewModalItem || !reviewBody.trim()) {
      alert('Please enter your review message.');
      return;
    }

    const itemObj = reviewModalItem.item;
    const targetId = itemObj.id || reviewModalItem.id;
    const reviewKey = `${reviewModalItem.orderId}_${targetId}`;

    const userLoc = [user?.address?.city, user?.address?.country].filter(Boolean).join(', ') || 'Customer Location';

    const clientAvatar = user?.avatar || editAvatar || (
      user?.name
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1c1917&color=f5f5f4&bold=true`
        : ''
    );

    const newRev = {
      id: `rev-${Date.now()}`,
      rating: Number(reviewRating) || 5,
      name: user?.name || 'Verified Customer',
      userName: user?.name || 'Verified Customer',
      location: userLoc,
      userLocation: userLoc,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: reviewTitle.trim() || 'Product Evaluation',
      body: reviewBody.trim(),
      verified: true,
      productId: targetId,
      productTitle: itemObj.title || 'Product',
      orderId: String(reviewModalItem.orderId || ''),
      status: 'Pending',
      approved: false,
      avatar: clientAvatar
    };

    try {
      const existing = JSON.parse(localStorage.getItem(`atelierstore_reviews_${targetId}`) || '[]');
      localStorage.setItem(`atelierstore_reviews_${targetId}`, JSON.stringify([newRev, ...existing]));
    } catch (err) {}

    try {
      const allUserRevs = JSON.parse(localStorage.getItem('atelierstore_all_user_reviews') || '[]');
      localStorage.setItem('atelierstore_all_user_reviews', JSON.stringify([newRev, ...allUserRevs]));
    } catch (err) {}

    // Async POST to Express MongoDB API
    try {
      fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRev),
      }).catch((e) => console.log('Backend review sync skipped:', e));
    } catch (e) {}

    const updatedSubmitted = { ...submittedReviews, [reviewKey]: true };
    setSubmittedReviews(updatedSubmitted);
    try {
      localStorage.setItem('atelierstore_submitted_order_reviews', JSON.stringify(updatedSubmitted));
    } catch (err) {}

    setReviewNotice(`✓ Review for "${itemObj.title}" submitted to Admin for Approval! Once approved, it will be published in public testimonials.`);
    setReviewModalItem(null);
    setTimeout(() => setReviewNotice(''), 4500);
  };

  // Extra Addresses database (Dynamically loaded from user profile)
  const [addresses, setAddresses] = useState(() => {
    if (user?.address && (user?.address?.street || user?.address?.city)) {
      return [
        {
          id: 'addr-1',
          label: 'Primary Address',
          isPrimary: true,
          street: user.address.street || '',
          city: user.address.city || '',
          country: user.address.country || '',
          postal: user.address.postalCode || '',
          phone: user.address.phone || '',
        },
      ];
    }
    return [];
  });

  useEffect(() => {
    fetchUserOrders(true);
    const interval = setInterval(() => {
      fetchUserOrders(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [user, activeTab]);

  const fetchUserOrders = async (showSpinner = false) => {
    if (showSpinner) setLoadingOrders(true);
    let localOrds = [];
    try {
      localOrds = JSON.parse(localStorage.getItem('atelierstore_user_orders') || '[]');
    } catch (e) {}

    const userEmail = user?.email?.toLowerCase()?.trim();
    const userName = user?.name?.toLowerCase()?.trim();

    if (!userEmail && !userName) {
      setPlacedOrders([]);
      setLoadingOrders(false);
      return;
    }

    const matchesUser = (item) => {
      if (userEmail === 'admin@atelierstore.com') return true;
      if (item.patronEmail && item.patronEmail.toLowerCase().trim() === userEmail) return true;
      if (userName && item.patronName && item.patronName.toLowerCase().trim() === userName) return true;
      return false;
    };

    const filteredLocal = localOrds.filter(matchesUser);

    try {
      const res = await fetch('http://localhost:5001/api/orders');
      if (res.ok) {
        const dbOrders = await res.json();
        if (Array.isArray(dbOrders)) {
          const filteredDb = dbOrders.filter(matchesUser);
          const map = new Map();
          
          // DB Orders take precedence for live admin updates
          filteredDb.forEach(item => {
            const id = item.orderId || item.id || item._id;
            if (id) {
              let formattedPrice = 'Rs. 0';
              if (typeof item.total === 'number') {
                formattedPrice = `Rs. ${Math.round(item.total).toLocaleString('en-LK')}`;
              } else if (typeof item.total === 'string') {
                formattedPrice = item.total.includes('Rs') ? item.total : `Rs. ${item.total}`;
              }

              map.set(id, {
                id: id,
                date: item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Order'),
                total: formattedPrice,
                status: item.status || 'Awaiting Dispatch',
                courier: item.courier || 'Insured Courier',
                estimatedDelivery: item.estimatedDelivery || '3-5 Business Days',
                items: Array.isArray(item.items) && item.items.length > 0 ? item.items.map(it => {
                  let itPrice = typeof it.price === 'number' ? it.price : parseFloat(String(it.price).replace(/[^0-9.]/g, '')) || 0;
                  if (itPrice > 0 && itPrice < 1000) itPrice = itPrice * 100;
                  return {
                    title: it.title || 'Garment Item',
                    qty: it.qty || 1,
                    price: itPrice > 0 ? `Rs. ${Math.round(itPrice).toLocaleString('en-LK')}` : (typeof it.price === 'string' ? it.price : 'Rs. 0'),
                    img: it.img || it.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80'
                  };
                }) : []
              });
            }
          });

          // Add any local-only items for this user not yet in DB
          filteredLocal.forEach(item => {
            const id = item.orderId || item.id;
            if (id && !map.has(id)) {
              let formattedPrice = typeof item.total === 'number' ? `Rs. ${Math.round(item.total).toLocaleString('en-LK')}` : item.total;
              map.set(id, {
                id: id,
                date: item.date || 'Recent Order',
                total: formattedPrice,
                status: item.status || 'Awaiting Dispatch',
                courier: 'Insured Courier',
                estimatedDelivery: '3-5 Business Days',
                items: Array.isArray(item.items) ? item.items.map(it => ({
                  title: it.title,
                  qty: it.qty || 1,
                  price: typeof it.price === 'number' ? `Rs. ${Math.round(it.price).toLocaleString('en-LK')}` : it.price,
                  img: it.img || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80'
                })) : []
              });
            }
          });

          setPlacedOrders(Array.from(map.values()));
          setLoadingOrders(false);
          return;
        }
      }
    } catch (err) {
      console.log('Error fetching user orders from DB:', err);
    }

    if (filteredLocal.length > 0) {
      setPlacedOrders(filteredLocal.map(item => ({
        id: item.orderId || item.id,
        date: item.date || 'Recent Order',
        total: typeof item.total === 'number' ? `Rs. ${Math.round(item.total).toLocaleString('en-LK')}` : item.total,
        status: item.status || 'Awaiting Dispatch',
        courier: 'Insured Courier',
        estimatedDelivery: '3-5 Business Days',
        items: Array.isArray(item.items) ? item.items.map(it => ({
          title: it.title,
          qty: it.qty || 1,
          price: typeof it.price === 'number' ? `Rs. ${Math.round(it.price).toLocaleString('en-LK')}` : it.price,
          img: it.img || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80'
        })) : []
      })));
    } else {
      setPlacedOrders([]);
    }
    setLoadingOrders(false);
  };

  const getOrderStepIndex = (statusStr = '') => {
    const s = String(statusStr).toLowerCase();
    if (s.includes('deliver')) return 4;
    if (s.includes('dispatch') || s.includes('transit') || s.includes('courier')) return 3;
    if (s.includes('prepare') || s.includes('looming') || s.includes('crafting') || s.includes('dyeing')) return 2;
    return 1;
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = (order.items || []).map((item, idx) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e7e5e4; font-weight: 500;">
          <div style="font-size: 14px; color: #1c1917;">${item.title}</div>
          <div style="font-size: 11px; color: #78716c; margin-top: 2px;">Item SKU: ATL-${String(order.id).slice(-4)}-${idx + 1}</div>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e7e5e4; text-align: center; font-size: 13px;">${item.qty || 1}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e7e5e4; text-align: right; font-weight: 600; font-size: 14px;">${item.price}</td>
      </tr>
    `).join('');

    const userLoc = [user?.address?.city, user?.address?.country].filter(Boolean).join(', ');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ATELIER STORE — Official Invoice #${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
            body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #1c1917; background: #fff; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1c1917; padding-bottom: 20px; }
            .title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; letter-spacing: 0.15em; color: #1c1917; }
            .badge { background: #c27803; color: white; padding: 5px 14px; border-radius: 9999px; font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { text-align: left; background: #f5f5f4; padding: 12px 16px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #78716c; }
            .total-box { margin-top: 30px; padding: 20px; background: #fafaf9; border-radius: 8px; border: 1px solid #e7e5e4; text-align: right; }
            .footer { margin-top: 50px; font-size: 11px; color: #78716c; text-align: center; border-top: 1px solid #e7e5e4; padding-top: 20px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">ATELIER STORE</div>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #78716c; letter-spacing: 0.05em;">Official Customer Receipt</p>
            </div>
            <div style="text-align: right;">
              <span class="badge">OFFICIAL INVOICE</span>
              <p style="margin: 10px 0 0 0; font-weight: 700; font-size: 16px;">Order #${order.id}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #78716c;">Issued: ${order.date}</p>
            </div>
          </div>

          <div style="margin-top: 30px; display: flex; justify-content: space-between; gap: 20px;">
            <div>
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #78716c; margin-bottom: 6px;">Billed Customer Account:</p>
              <p style="font-weight: 700; font-size: 15px; margin: 0;">${user?.name || ''}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #44403c;">${user?.email || ''}</p>
              ${userLoc ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: #78716c;">${userLoc}</p>` : ''}
            </div>
            <div style="text-align: right;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #78716c; margin-bottom: 6px;">Fulfillment & Logistics:</p>
              <p style="font-weight: 700; font-size: 14px; margin: 0; color: #c27803;">${order.courier || 'Insured Courier'}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #44403c;">Status: <strong>${order.status}</strong></p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #78716c;">Estimated Delivery: ${order.estimatedDelivery || '3-5 Business Days'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total-box">
            <p style="margin: 0; font-size: 12px; color: #78716c;">Subtotal + Shipping Included</p>
            <p style="margin: 6px 0 0 0; font-size: 22px; font-weight: 700; color: #1c1917;">Total: ${order.total}</p>
          </div>

          <div class="footer">
            <p style="margin-bottom: 6px; font-weight: 600;">🔒 Encrypted Transaction • Official Customer Receipt</p>
            <p style="margin: 0;">Atelier Store</p>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditAvatar(user.avatar || '');
      setEditStreet(user.address?.street || '');
      setEditCity(user.address?.city || '');
      setEditCountry(user.address?.country || '');
      setEditPostal(user.address?.postalCode || '');
      setEditPhone(user.address?.phone || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      id: user?.id || user?._id,
      name: editName,
      email: editEmail,
      avatar: editAvatar,
      address: {
        street: editStreet,
        city: editCity,
        country: editCountry,
        postalCode: editPostal,
        phone: editPhone,
      },
    };

    // 1. Immediately update local state & localStorage
    if (onUpdateUser) onUpdateUser(updatedUser);

    // 2. Async API PUT to Express MongoDB database
    try {
      const res = await fetch('http://localhost:5001/api/users/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const finalUser = {
            ...updatedUser,
            ...data.user,
            id: data.user.id || data.user._id || updatedUser.id,
          };
          if (onUpdateUser) onUpdateUser(finalUser);
        }
      }
    } catch (err) {
      console.error('Failed to sync profile update to MongoDB database:', err);
    }

    // 3. Update registered users list in localStorage
    try {
      const regList = JSON.parse(localStorage.getItem('atelierstore_registered_users') || '[]');
      const updatedRegList = regList.map(u => (u.email === user?.email || u.id === user?.id) ? { ...u, ...updatedUser } : u);
      if (!updatedRegList.some(u => u.email === updatedUser.email)) {
        updatedRegList.push(updatedUser);
      }
      localStorage.setItem('atelierstore_registered_users', JSON.stringify(updatedRegList));
    } catch (err) {}

    setIsEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    setAddresses((prev) => [
      ...prev,
      {
        id: 'addr-' + Date.now(),
        label: newLabel || 'Secondary Address',
        isPrimary: false,
        street: newStreet,
        city: newCity,
        country: newCountry,
        postal: '00000',
        phone: editPhone,
      },
    ]);
    setIsAddingAddress(false);
    setNewLabel('');
    setNewStreet('');
    setNewCity('');
    setNewCountry('');
  };

  // If user is logged out, show Login/Register CTA
  if (!user) {
    return (
      <div className="w-full bg-surface py-space-5xl text-center">
        <div className="max-w-md mx-auto px-margin-mobile bg-surface-container-low p-space-2xl rounded-xl border border-surface-variant shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-secondary block mb-3">
            account_circle
          </span>
          <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block mb-1">
            Account Access
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">
            Sign In or Register Account
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-xl">
            Access your order tracking timeline, saved addresses, and personal concierge services.
          </p>
          <div className="flex flex-col gap-space-sm">
            <button
              onClick={onOpenAuth}
              className="h-12 w-full rounded bg-primary text-on-primary font-label-md uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer"
            >
              Sign In / Register Account
            </button>
            <button
              onClick={onGoToShop}
              className="h-12 w-full rounded border border-on-surface text-on-surface font-label-md uppercase tracking-wider hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Explore Catalog / Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userLocationString = [user.address?.city, user.address?.country].filter(Boolean).join(', ');

  return (
    <div className="w-full bg-surface py-space-4xl">
      <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        {/* User Profile Header Card */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-space-xl border-b border-surface-variant mb-space-2xl gap-space-lg bg-surface-container-low p-space-xl rounded-xl border">
          <div className="flex items-center gap-space-lg">
            <img
              src={user?.avatar || editAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1c1917&color=f5f5f4&bold=true`}
              alt={user?.name || 'User Profile'}
              className="w-20 h-20 rounded-full object-cover border-2 border-secondary shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-caps text-[10px] uppercase font-semibold">
                  {user.tier || 'Member'}
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-md text-on-surface font-normal">
                {user.name}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {user.email}{userLocationString ? ` · ${userLocationString}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="h-10 px-4 rounded border border-on-surface text-on-surface font-label-md text-xs uppercase tracking-wider hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Edit Profile</span>
            </button>
            <button
              onClick={onLogOut}
              className="h-10 px-4 rounded bg-error/10 text-error font-label-md text-xs uppercase tracking-wider hover:bg-error hover:text-on-error transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-space-lg p-4 rounded bg-surface-container-low border border-secondary text-secondary font-label-md text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Account Nav Tabs */}
        <div className="flex items-center gap-space-xl border-b border-surface-variant mb-space-2xl overflow-x-auto">
          {[
            { id: 'orders', label: 'My Orders & Tracking', icon: 'package_2' },
            { id: 'profile', label: 'Profile Settings', icon: 'person' },
            { id: 'addresses', label: 'Saved Addresses', icon: 'home' },
            { id: 'concierge', label: 'Support & Concierge', icon: 'support_agent' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-space-sm font-label-md text-xs uppercase tracking-wider cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-secondary text-on-surface font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: Orders & Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-space-xl">
            {reviewNotice && (
              <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-label-caps text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>{reviewNotice}</span>
              </div>
            )}

            {loadingOrders ? (
              <div className="py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[36px] animate-spin block mb-2 opacity-50">sync</span>
                <p className="font-body-sm text-xs">Loading orders...</p>
              </div>
            ) : placedOrders.length === 0 ? (
              <div className="bg-surface-container-low rounded-xl p-12 text-center border border-surface-variant shadow-sm">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant block mb-3 opacity-40">
                  package_2
                </span>
                <h3 className="font-headline-sm text-lg text-on-surface font-semibold mb-1">
                  No Orders Placed Yet
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
                  Your placed orders will be tracked here in real-time as soon as you place an order.
                </p>
                <button
                  type="button"
                  onClick={onGoToShop}
                  className="px-6 py-2.5 rounded bg-primary text-on-primary font-label-caps text-xs uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer font-bold shadow-sm"
                >
                  Explore Collection & Shop
                </button>
              </div>
            ) : (
              placedOrders.map((order) => {
                const isDelivered = (order.status || '').toLowerCase().includes('deliver');
                return (
                  <div
                    key={order.id}
                    className={`bg-surface-container-low rounded-xl p-space-xl border shadow-sm ${
                      isDelivered ? 'border-emerald-300/80 bg-emerald-50/10' : 'border-surface-variant'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-space-md border-b border-surface-variant gap-2 mb-space-md">
                      <div>
                        <span className="font-label-caps text-xs text-on-surface-variant uppercase block">
                          Order #{order.id}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">
                          {order.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePrintInvoice(order)}
                          className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-surface-variant rounded font-label-caps text-[10px] uppercase font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          title="Print official receipt"
                        >
                          <span className="material-symbols-outlined text-sm">print</span>
                          Print Invoice PDF
                        </button>
                        <span
                          className={`px-3 py-1 rounded-full font-label-caps text-[10px] uppercase tracking-wider ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                              : order.status === 'In Transit' || order.status?.includes('Dispatched')
                              ? 'bg-sky-100 text-sky-900 border border-sky-300 font-semibold'
                              : 'bg-surface-container-high text-on-surface-variant font-semibold'
                          }`}
                        >
                          ● {order.status}
                        </span>
                        <span className="font-price-editorial text-price-editorial text-on-surface font-bold">
                          {order.total}
                        </span>
                      </div>
                    </div>

                    {/* Live Order Status Stepper Timeline */}
                    {(() => {
                      const currentStep = getOrderStepIndex(order.status);
                      const steps = [
                        { title: 'Order Placed', desc: 'Confirmed', icon: 'receipt_long' },
                        { title: 'Processing', desc: 'Preparing Item', icon: 'palette' },
                        { title: 'Dispatched', desc: 'In Transit', icon: 'local_shipping' },
                        { title: 'Delivered', desc: 'Completed', icon: 'task_alt' },
                      ];

                      return (
                        <div className="mb-space-lg p-3 bg-surface-container-lowest rounded-xl border border-surface-variant/50">
                          <div className="flex items-center justify-between mb-3 px-1">
                            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                              Order Fulfillment Timeline
                            </span>
                            <span className="font-label-caps text-[10px] text-secondary font-bold">
                              Step {currentStep} of 4 · {order.status}
                            </span>
                          </div>

                          <div className="relative flex items-center justify-between px-2 py-1">
                            <div className="absolute top-1/2 left-4 right-4 h-1 bg-surface-container-high -translate-y-1/2 z-0 rounded-full"></div>
                            <div
                              className="absolute top-1/2 left-4 h-1 bg-secondary -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `calc(${((currentStep - 1) / 3) * 100}% - 2rem)` }}
                            ></div>

                            {steps.map((st, i) => {
                              const stepNum = i + 1;
                              const isDone = stepNum <= currentStep;
                              const isCurrent = stepNum === currentStep;

                              return (
                                <div key={i} className="relative z-10 flex flex-col items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs ${
                                      isCurrent
                                        ? 'bg-secondary text-on-secondary ring-4 ring-secondary/20 scale-110 font-bold'
                                        : isDone
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-surface-container-high text-outline-variant border border-surface-variant'
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-sm">{st.icon}</span>
                                  </div>
                                  <span
                                    className={`font-label-caps text-[9px] mt-1.5 text-center whitespace-nowrap ${
                                      isCurrent ? 'text-secondary font-bold' : isDone ? 'text-on-surface font-semibold' : 'text-outline-variant'
                                    }`}
                                  >
                                    {st.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {isDelivered && (
                      <div className="mb-space-md p-3 rounded-lg bg-emerald-500/10 border border-emerald-300/60 text-emerald-900 font-label-caps text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-700 text-base">verified</span>
                          <span className="font-bold">Order Delivered! You can now write reviews for your items below.</span>
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-emerald-800">Verified Review Unlocked</span>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-space-md mb-space-lg">
                      {order.items.map((item, idx) => {
                        const targetId = item.id || item.title;
                        const reviewKey = `${order.id}_${targetId}`;
                        const isAlreadyReviewed = submittedReviews[reviewKey];

                        return (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md p-3 bg-surface-container-lowest rounded-lg border border-surface-variant/40">
                            <div className="flex items-center gap-space-md">
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-14 h-16 object-cover rounded bg-surface-container border"
                              />
                              <div>
                                <h4 className="font-subheading-md text-on-surface font-medium">{item.title}</h4>
                                <p className="font-body-sm text-xs text-on-surface-variant">
                                  Qty: {item.qty} · {item.price}
                                </p>
                              </div>
                            </div>

                            {isDelivered && (
                              <div className="shrink-0 pt-2 sm:pt-0">
                                {isAlreadyReviewed ? (
                                  <span className="px-3.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 font-label-caps text-[11px] font-bold inline-flex items-center gap-1 border border-emerald-300">
                                    <span className="material-symbols-outlined text-sm text-emerald-700">verified</span>
                                    <span>Reviewed ✓</span>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReviewModal(order, item)}
                                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-label-caps text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-102"
                                  >
                                    <span className="material-symbols-outlined text-sm">star</span>
                                    <span>Write Review</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Courier Progress Meter */}
                    <div className="bg-surface-container-lowest p-space-md rounded-lg border border-surface-variant">
                      <div className="flex items-center justify-between font-label-caps text-xs text-on-surface mb-2">
                        <span>Courier: {order.courier}</span>
                        <span>Est. Arrival: {order.estimatedDelivery}</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-secondary rounded-full transition-all duration-500 ${
                            isDelivered ? 'w-full bg-emerald-600' : order.status === 'In Transit' ? 'w-2/3' : 'w-1/3'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between items-center font-label-caps text-[10px] text-on-surface-variant mt-2">
                        <span>Dispatched</span>
                        <span className="font-bold text-secondary">In Transit</span>
                        <span className={isDelivered ? 'font-bold text-emerald-700' : ''}>Delivered</span>
                      </div>
                    </div>

                    {/* Print / Download Invoice Action */}
                    <div className="pt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handlePrintInvoice(order)}
                        className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-label-caps text-xs uppercase font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-surface-variant shadow-xs"
                      >
                        <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                        <span>Download / Print Invoice</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-surface-container-low p-space-2xl rounded-xl border border-surface-variant max-w-2xl shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-md">
              User Profile &amp; Preferences
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y- space-md">
              <div className="space-y-4">
                <div>
                  <label className="font-label-caps text-xs uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-11 px-3 rounded bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs uppercase block mb-1">Correspondence Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full h-11 px-3 rounded bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs uppercase block mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className="w-full h-11 px-3 rounded bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs uppercase block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full h-11 px-3 rounded bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="h-11 px-6 rounded bg-primary text-on-primary font-label-md uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer mt-space-lg"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-space-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Saved Addresses</h3>
              <button
                onClick={() => setIsAddingAddress(true)}
                className="h-10 px-4 rounded bg-primary text-on-primary font-label-md text-xs uppercase hover:bg-secondary transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Address</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="p-8 rounded-xl border border-surface-variant bg-surface-container-low text-center shadow-sm">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-2 opacity-40">
                  home_pin
                </span>
                <p className="font-headline-sm text-sm font-semibold text-on-surface mb-1">
                  No Saved Address Destinations
                </p>
                <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mx-auto mb-4">
                  Save your delivery addresses for quick checkout.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="px-4 py-2 rounded bg-primary text-on-primary font-label-caps text-xs uppercase hover:bg-secondary transition-colors cursor-pointer font-bold shadow-xs"
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-space-xl rounded-xl border shadow-sm relative bg-surface-container-low ${
                      addr.isPrimary ? 'border-secondary' : 'border-surface-variant'
                    }`}
                  >
                    {addr.isPrimary && (
                      <span className="absolute top-4 right-4 font-label-caps text-[10px] uppercase bg-secondary text-on-secondary px-2.5 py-0.5 rounded-full font-semibold">
                        Primary
                      </span>
                    )}
                    <h3 className="font-subheading-lg text-on-surface mb-2 font-semibold">{addr.label}</h3>
                    <p className="font-body-sm text-on-surface-variant leading-relaxed mb-4">
                      {user?.name || editName}<br />
                      {addr.street}<br />
                      {addr.postal ? `${addr.postal} ` : ''}{addr.city}{addr.city && addr.country ? ', ' : ''}{addr.country}<br />
                      {addr.phone}
                    </p>
                    <button className="font-label-md text-xs uppercase text-secondary underline cursor-pointer font-bold">
                      Edit Address
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Support */}
        {activeTab === 'concierge' && (
          <div className="bg-surface-container-low p-space-2xl rounded-xl border border-surface-variant max-w-2xl shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-2">Customer Concierge &amp; Support</h3>
            <p className="font-body-md text-on-surface-variant mb-space-lg">
              Have a question regarding your order status, custom sizing, or product details? Send a message directly to our support team.
            </p>
            <div className="space-y-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Subject</label>
                <select className="w-full h-11 px-3 rounded bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm">
                  <option>Order Status Inquiry</option>
                  <option>Custom Sizing Assistance</option>
                  <option>General Support Inquiry</option>
                </select>
              </div>
              <div>
                <label className="font-label-caps text-xs block mb-1">Message Detail</label>
                <textarea
                  rows={4}
                  className="w-full p-3 rounded bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm"
                  placeholder="Describe your request..."
                />
              </div>
              <button className="h-11 px-6 rounded bg-primary text-on-primary font-label-md uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer">
                Submit Support Inquiry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile bg-primary/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl p-space-xl border border-surface-variant">
            <div className="flex items-center justify-between pb-space-md border-b border-surface-variant mb-space-lg">
              <h3 className="font-headline-sm uppercase text-on-surface">Edit Profile Details</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Profile Avatar / Photo URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Street Address</label>
                <input
                  type="text"
                  value={editStreet}
                  onChange={(e) => setEditStreet(e.target.value)}
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-xs block mb-1">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs block mb-1">Country</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-5 h-11 rounded border border-on-surface text-on-surface font-label-md uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 h-11 rounded bg-primary text-on-primary font-label-md uppercase hover:bg-secondary transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile bg-primary/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl p-space-xl border border-surface-variant">
            <div className="flex items-center justify-between pb-space-md border-b border-surface-variant mb-space-lg">
              <h3 className="font-headline-sm uppercase text-on-surface">Add Address Location</h3>
              <button
                onClick={() => setIsAddingAddress(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Location Label (e.g. Home / Villa)</label>
                <input
                  required
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Home Residence"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-1">Street Address</label>
                <input
                  required
                  type="text"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Street Address"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-xs block mb-1">City</label>
                  <input
                    required
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="City Name"
                    className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs block mb-1">Country</label>
                  <input
                    required
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-5 h-11 rounded border border-on-surface text-on-surface font-label-md uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 h-11 rounded bg-primary text-on-primary font-label-md uppercase hover:bg-secondary transition-colors cursor-pointer"
                >
                  Add Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delivered Item Review Modal */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile bg-primary/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-xl shadow-2xl relative border border-outline-variant/30">
            <button
              onClick={() => setReviewModalItem(null)}
              className="absolute top-4 right-4 p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <div className="space-y-space-md">
              <div>
                <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase font-bold">
                  VERIFIED CUSTOMER EVALUATION
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-bold">
                  Review Delivered Item
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Order #{reviewModalItem.orderId} • <span className="text-on-surface font-semibold">{reviewModalItem.item.title}</span>
                </p>
              </div>

              <form onSubmit={handleSubmitOrderReview} className="space-y-space-sm">
                <div>
                  <label className="block font-label-uppercase text-[11px] text-on-surface mb-1 font-bold">Overall Star Rating *</label>
                  <div className="flex items-center gap-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`px-3.5 py-1.5 rounded-lg font-label-caps text-xs font-bold cursor-pointer transition-all ${
                          reviewRating === star ? 'bg-amber-500 text-white font-bold scale-105 shadow-xs' : 'bg-surface-container border border-surface-variant text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {star} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-label-uppercase text-[11px] text-on-surface mb-1 font-bold">Review Title</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Exceptional quality and fit"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded p-space-sm font-body-sm text-on-surface focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-label-uppercase text-[11px] text-on-surface mb-1 font-bold">Written Review / Experience *</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Share your experience regarding texture, fit, drape, and packaging..."
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded p-space-sm font-body-sm text-on-surface focus:outline-none"
                  />
                </div>

                <div className="pt-space-md flex items-center justify-end gap-space-sm">
                  <button
                    type="button"
                    onClick={() => setReviewModalItem(null)}
                    className="px-space-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container font-label-uppercase text-[11px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-space-lg py-2.5 rounded bg-primary text-on-primary hover:bg-secondary font-label-uppercase text-[11px] font-bold shadow-sm cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
