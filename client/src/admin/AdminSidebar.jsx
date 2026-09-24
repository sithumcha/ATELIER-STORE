import React from 'react';

export default function AdminSidebar({ activeNav, setActiveNav, onGoToPublicStore }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between overflow-y-auto shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-variant">
      <div className="flex flex-col">
        {/* Logo Header */}
        <div className="h-16 flex items-center px-space-lg gap-space-sm bg-surface-container-low border-b border-surface-variant">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 240 60"
            className="h-8 w-auto text-primary"
            fill="none"
          >
            <text x="10" y="40" fontFamily="'Playfair Display', serif" fontSize="26" fontWeight="600" letterSpacing="0.18em" fill="currentColor">ATELIER</text>
            <text x="150" y="40" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="14" fontWeight="400" letterSpacing="0.3em" fill="#78716c">STORE</text>
            <circle cx="138" cy="32" r="2.5" fill="#c27803" />
          </svg>
          <div className="flex flex-col ml-1">
            <span className="font-headline-sm text-headline-sm leading-none text-primary tracking-tight">ATELIERSTORE</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">Admin Console</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col px-space-sm pt-space-md space-y-space-md">
          {/* Overview */}
          <div className="space-y-space-xxs">
            <div className="px-space-sm py-space-xxs font-label-caps text-[10px] text-outline uppercase tracking-wider">Overview</div>
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-colors cursor-pointer ${
                activeNav === 'dashboard'
                  ? 'bg-primary-container text-on-primary font-subheading-md'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-lg leading-none">space_dashboard</span>
              <span>Dashboard</span>
            </button>
          </div>

          {/* E-Commerce Management */}
          <div className="space-y-space-xxs">
            <div className="px-space-sm py-space-xxs font-label-caps text-[10px] text-outline uppercase tracking-wider">Store Management</div>
            {[
              { id: 'orders', label: 'Orders & Dispatch', icon: 'local_shipping' },
              { id: 'editions', label: 'Product Editions', icon: 'category' },
              { id: 'add-product', label: '+ Add New Edition', icon: 'add_circle' },
              { id: 'customers', label: 'Customers & Patrons', icon: 'group' },
              { id: 'inquiries', label: 'Dispatches & Inquiries', icon: 'mail' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-colors font-body-sm text-body-sm cursor-pointer ${
                  activeNav === item.id
                    ? 'bg-primary-container text-on-primary font-subheading-md'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Footer Live Telemetry */}
      <div className="p-space-md space-y-space-sm bg-surface-container-low border-t border-surface-variant">
        <div className="p-space-sm rounded-lg bg-surface-container-highest flex items-center gap-space-xs">
          <span className="w-2 h-2 rounded-full bg-secondary shrink-0 animate-pulse"></span>
          <span className="font-label-caps text-[10px] text-on-surface-variant">
            Kyoto &amp; Stockholm Live Sync • Operational
          </span>
        </div>
        <button
          onClick={onGoToPublicStore}
          className="w-full flex items-center justify-between px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-label-md text-xs uppercase cursor-pointer"
        >
          <span className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-base">open_in_new</span>
            View Public Storefront
          </span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </aside>
  );
}
