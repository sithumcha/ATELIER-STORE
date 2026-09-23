import React, { useState } from 'react';

export default function AccountPage({ user, onOpenAuth, onLogOut, onUpdateUser, onGoToShop }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Edit form fields
  const [editName, setEditName] = useState(user?.name || 'Elin Lindqvist');
  const [editEmail, setEditEmail] = useState(user?.email || 'elin@kurastudio.com');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVc9DU0FPf5cvkDbLsmajjIhrqxVzcprYSiMVl52H84IrGx-8KX7sAFTfDcCp_Jkh7ui-wjuxF_GCOTmZMC6FFSQ_1xmC1ln7j7_ag4eIyYD3NThID8SC7gXukjhUq_IQNeR0hA7sSSmKgP9OEScujERw4GKLr2iNdYSKBZt0gB_e3seq4o9Q31KXBbs09WpqRULVK9xwvPXKZ0tkFsNYyEjbYKTOi_uwg-44pt2XJPSoz8Q5QI2E');
  const [editStreet, setEditStreet] = useState(user?.address?.street || 'Åsögatan 142, Apt 4B');
  const [editCity, setEditCity] = useState(user?.address?.city || 'Stockholm');
  const [editCountry, setEditCountry] = useState(user?.address?.country || 'Sweden');
  const [editPostal, setEditPostal] = useState(user?.address?.postalCode || '116 24');
  const [editPhone, setEditPhone] = useState(user?.address?.phone || '+46 8 123 4567');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Address form
  const [newLabel, setNewLabel] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');

  // Extra Addresses database
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      label: 'Primary Residence',
      isPrimary: true,
      street: user?.address?.street || 'Åsögatan 142, Apt 4B',
      city: user?.address?.city || 'Stockholm',
      country: user?.address?.country || 'Sweden',
      postal: user?.address?.postalCode || '116 24',
      phone: user?.address?.phone || '+46 8 123 4567',
    },
    {
      id: 'addr-2',
      label: 'Kyoto Studio Sanctuary',
      isPrimary: false,
      street: 'Minami-ku, Higashikujo 12-4',
      city: 'Kyoto',
      country: 'Japan',
      postal: '601-8014',
      phone: '+81 75 987 6543',
    },
  ]);

  const orders = [
    {
      id: 'KS-8904',
      date: 'September 04, 2026',
      total: '$505.00',
      status: 'In Transit',
      courier: 'DHL Express Insured · 7849204819',
      estimatedDelivery: 'Sep 12, 2026',
      items: [
        {
          title: 'Hasami Stoneware Teapot No. 04',
          qty: 1,
          price: '$145',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb6hR_9c17ClnOTO_xM8-6RYiy1Y2Ee4ccZrvX-54Ah0-hREfQBVbWEVHcH5k6rtnBgDAx1Q8gPnSKGqENDhGz4g7xCLNHJzliSmVk3W93AaxZyFoiD345VxI_Or1Srg2lRYUtJJrzUw_OA10lnSejpvC087W-FnL1DqxJoCTN4VYp48XT1ZjrpCW-kamWHOxwYeYZvEsAZTzwleP5eW672eobhPfmbWLrSYCs-1ywVbc4bez3FyA',
        },
        {
          title: 'Akari Lantern No. 04',
          qty: 1,
          price: '$360',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy7h1IJVWgA9dCauR6iHvd1c-lHOTrBH1Jt2hZkhI3zGZlb3MQajFs5fqzqDZMiZTGJMhGZforyQ47kRy1mPXFUlLxVQcmZeQw2ovM4PYrrvP0bMclA_hcTYsOaZNN8MDdUEe94HfjCTgvPtvo7xD2UHhNl5Bp2svOygWziZURhEAGnj0MTkHwKgfMrfJjzeqcF7w16SrTfqgS5yv5b0illcqQ7Wc4_UhM4UhvZa1yO4E6d7BAXnQ',
        },
      ],
    },
    {
      id: 'KS-7812',
      date: 'August 18, 2026',
      total: '$240.00',
      status: 'Delivered',
      courier: 'FedEx Carbon Neutral',
      estimatedDelivery: 'Aug 22, 2026',
      items: [
        {
          title: 'Sora Heavyweight Linen Robe',
          qty: 1,
          price: '$240',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7VK4Qn61mQPz4bQ6u0Z8FGzbqjYJvgMPqLyVrl_U5rw8zMgKFmYxR2RYaFcJb8gAO-nTIfO_kc1ratauWCpOU-u67Q4sQ_hMEAF36vTpGIZWZBX2Pkz7kk8UW41YFr96mRr-iUvKoCDPu-eARO10RcSnPksGoqvKDFYjSa0lsrGa6YUypRvkzR7akycKGjXDADIurcjslasNNFQeB8t666hIOUqFpxHE-2ruxGhTHqCv8uzFdgiU',
        },
      ],
    },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
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
    if (onUpdateUser) onUpdateUser(updatedUser);
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
        label: newLabel || 'Secondary Studio',
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
            Patron Sanctuary Access
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

  return (
    <div className="w-full bg-surface py-space-4xl">
      <div className="max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        {/* User Profile Header Card */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-space-xl border-b border-surface-variant mb-space-2xl gap-space-lg bg-surface-container-low p-space-xl rounded-xl border">
          <div className="flex items-center gap-space-lg">
            <img
              src={user.avatar || editAvatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-secondary shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-caps text-[10px] uppercase font-semibold">
                  {user.tier || 'Patron Tier II'}
                </span>
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  Member since 2025
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-md text-on-surface font-normal">
                {user.name}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {user.email} · {user.address?.city || 'Stockholm'}, {user.address?.country || 'Sweden'}
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
            { id: 'orders', label: 'Acquisitions & Tracking', icon: 'package_2' },
            { id: 'profile', label: 'Profile Settings', icon: 'person' },
            { id: 'addresses', label: 'Saved Sanctuaries', icon: 'home' },
            { id: 'concierge', label: 'Client Concierge & Kintsugi', icon: 'support_agent' },
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
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface-container-low rounded-xl p-space-xl border border-surface-variant shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-space-md border-b border-surface-variant gap-2 mb-space-lg">
                  <div>
                    <span className="font-label-caps text-xs text-on-surface-variant uppercase block">
                      Acquisition #{order.id}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">
                      {order.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-md">
                    <span
                      className={`px-3 py-1 rounded-full font-label-caps text-[10px] uppercase tracking-wider ${
                        order.status === 'In Transit'
                          ? 'bg-secondary/20 text-secondary font-semibold'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      ● {order.status}
                    </span>
                    <span className="font-price-editorial text-price-editorial text-on-surface">
                      {order.total}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-space-md mb-space-lg">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-space-md">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-14 h-16 object-cover rounded bg-surface-container border"
                      />
                      <div className="flex-1">
                        <h4 className="font-subheading-md text-on-surface">{item.title}</h4>
                        <p className="font-body-sm text-xs text-on-surface-variant">
                          Qty: {item.qty} · {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Courier Progress Meter */}
                {order.status === 'In Transit' && (
                  <div className="bg-surface-container-lowest p-space-md rounded-lg border border-surface-variant">
                    <div className="flex items-center justify-between font-label-caps text-xs text-on-surface mb-2">
                      <span>Courier: {order.courier}</span>
                      <span>Est. Arrival: {order.estimatedDelivery}</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-secondary rounded-full"></div>
                    </div>
                    <div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant mt-2">
                      <span>Kyoto Dispatch</span>
                      <span className="font-bold text-secondary">Customs Cleared</span>
                      <span>Delivery</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-surface-container-low p-space-2xl rounded-xl border border-surface-variant max-w-2xl shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-md">
              Patron Profile &amp; Preferences
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

        {/* TAB 3: Saved Sanctuaries (Addresses) */}
        {activeTab === 'addresses' && (
          <div className="space-y-space-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Saved Sanctuary Locations</h3>
              <button
                onClick={() => setIsAddingAddress(true)}
                className="h-10 px-4 rounded bg-primary text-on-primary font-label-md text-xs uppercase hover:bg-secondary transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Sanctuary Address</span>
              </button>
            </div>

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
                    {user.name}<br />
                    {addr.street}<br />
                    {addr.postal} {addr.city}, {addr.country}<br />
                    {addr.phone}
                  </p>
                  <button className="font-label-md text-xs uppercase text-secondary underline cursor-pointer">
                    Edit Address
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Concierge */}
        {activeTab === 'concierge' && (
          <div className="bg-surface-container-low p-space-2xl rounded-xl border border-surface-variant max-w-2xl shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-2">Personal Client Concierge</h3>
            <p className="font-body-md text-on-surface-variant mb-space-lg">
              Have a question regarding custom Japanese joinery, bespoke sizes, or Kintsugi ceramic restoration? Send a direct message to your assigned atelier representative.
            </p>
            <div className="space-y-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Subject Matter</label>
                <select className="w-full h-11 px-3 rounded bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm">
                  <option>Kintsugi Ceramic Repair Request</option>
                  <option>Bespoke Furniture Dimensions</option>
                  <option>Gift Box &amp; Calligraphy Inscription</option>
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
                Submit Inquiry to Atelier Concierge
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
              <h3 className="font-headline-sm uppercase text-on-surface">Add Sanctuary Location</h3>
              <button
                onClick={() => setIsAddingAddress(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div>
                <label className="font-label-caps text-xs block mb-1">Location Label (e.g. Vacation Home)</label>
                <input
                  required
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Kyoto Summer Villa"
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
                  placeholder="12 Gion Alley"
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
                    placeholder="Kyoto"
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
                    placeholder="Japan"
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
    </div>
  );
}
