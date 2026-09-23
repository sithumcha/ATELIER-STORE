import React from 'react';

export default function AdminHeader({ searchQuery, setSearchQuery, onOpenNewEdition }) {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-xl border-b border-surface-variant">
      <div className="flex items-center gap-space-lg flex-1 max-w-xl">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-[0_1px_8px_rgba(0,0,0,0.02)] transition-all"
            placeholder="Search SKU, Batch, Patron, Order..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-space-xs">
          <button
            onClick={onOpenNewEdition}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-xs uppercase hover:bg-secondary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>New Edition</span>
          </button>
          <button
            onClick={() => alert('Exporting atelier dispatch report as CSV...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-md text-xs uppercase hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            <span>Export CSV</span>
          </button>
        </div>

        <div className="h-5 w-px bg-surface-variant"></div>

        <button className="relative p-1.5 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary"></span>
        </button>

        <div className="flex items-center gap-space-xs pl-space-xs">
          <img
            alt="Head Curator"
            className="w-8 h-8 rounded-full object-cover border border-secondary"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVc9DU0FPf5cvkDbLsmajjIhrqxVzcprYSiMVl52H84IrGx-8KX7sAFTfDcCp_Jkh7ui-wjuxF_GCOTmZMC6FFSQ_1xmC1ln7j7_ag4eIyYD3NThID8SC7gXukjhUq_IQNeR0hA7sSSmKgP9OEScujERw4GKLr2iNdYSKBZt0gB_e3seq4o9Q31KXBbs09WpqRULVK9xwvPXKZ0tkFsNYyEjbYKTOi_uwg-44pt2XJPSoz8Q5QI2E"
          />
          <div className="hidden xl:flex flex-col text-left">
            <span className="font-label-md text-xs text-on-surface leading-tight font-semibold">Klara M.</span>
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">Head Curator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
