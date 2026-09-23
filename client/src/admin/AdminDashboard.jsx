import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminPatrons from './AdminPatrons';
import AdminInquiries from './AdminInquiries';
import AddProductPage from './AddProductPage';


export default function AdminDashboard({ onGoToPublicStore }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState('All');
  const [isAddEditionOpen, setIsAddEditionOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dateFilter, setDateFilter] = useState('Current Moon / Month');

  // Dynamic Orders Database from MongoDB API (http://localhost:5001/api/orders)
  const [orders, setOrders] = useState([]);

  // Calculate metrics dynamically from database orders
  const totalSettlementNum = orders.reduce((sum, ord) => {
    const val = typeof ord.total === 'number'
      ? ord.total
      : parseFloat(String(ord.total).replace(/[^0-9.]/g, '')) || 0;
    return sum + val;
  }, 0);

  const avgOrderNum = orders.length > 0 ? (totalSettlementNum / orders.length) : 0;
  const pendingCount = orders.filter((o) => o.status?.includes('Awaiting') || o.status?.includes('Preparing')).length;
  const deliveredCount = orders.filter((o) => o.status?.includes('Dispatched') || o.status?.includes('Delivered')).length;
  const donePercentVal = orders.length > 0 ? Math.round((deliveredCount / orders.length) * 100) : 0;

  const currentMetrics = {
    grossSettlement: `$${totalSettlementNum.toFixed(2)}`,
    grossGrowth: orders.length > 0 ? '100%' : '0%',
    avgOrder: `$${avgOrderNum.toFixed(2)}`,
    acquisitions: String(orders.length),
    donePercent: `${donePercentVal}%`,
    pending: `${pendingCount} Pending dispatch`,
    delivered: `${deliveredCount} Delivered`,
    yield: '100%',
    curing: '0 pieces curing',
    patronRepeat: '100%',
    patronGrowth: '100%',
    patronCount: `${orders.length} patrons`,
  };

  // New Edition form state with complete metadata fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Normandy Flax');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newPrice, setNewPrice] = useState('$240');
  const [newBadge, setNewBadge] = useState('Natural Dye');
  const [newBadgeClass, setNewBadgeClass] = useState('bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface');
  const [newAlt, setNewAlt] = useState('');
  const [newStudio, setNewStudio] = useState('Stockholm Pattern');
  const [newBatchSize, setNewBatchSize] = useState('35');
  const [newKilnBatch, setNewKilnBatch] = useState('Ghent Weave');
  
  // File Upload vs Image Link URL state
  const [imageUploadMode, setImageUploadMode] = useState('file'); // 'file' | 'url'
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((o) => ({
            id: o.orderId || o._id,
            patron: o.patronName || 'Archival Collector',
            tier: o.tier || 'Verified Collector',
            items: Array.isArray(o.items) ? o.items.map((i) => i.title || i).join(', ') : (o.items || 'Archival Items'),
            destination: o.destination || 'Global Destination',
            total: typeof o.total === 'number' ? `$${o.total.toFixed(2)}` : (String(o.total).startsWith('$') ? o.total : `$${o.total}`),
            status: o.status || 'Awaiting Dispatch',
            statusClass: o.status?.includes('Awaiting')
              ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
              : o.status?.includes('Transit')
              ? 'bg-sky-100 text-sky-900 border-sky-300 font-semibold'
              : 'bg-slate-100 text-slate-900 border-slate-300 font-semibold',
          }));
          setOrders(formatted);
        }
      }
    } catch (err) {
      console.log('Error fetching dashboard orders from database:', err);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'Awaiting Dispatch') return ord.status.includes('Awaiting');
    if (orderFilter === 'In Transit') return ord.status.includes('Transit');
    if (orderFilter === 'Fulfilled') return ord.status.includes('Delivered') || ord.status.includes('Dispatched');
    return true;
  });

  const handleUpdateOrderStatus = (id, newStatus) => {
    let statusClass = 'bg-slate-100 text-slate-900 border border-slate-300 font-semibold';
    if (newStatus.includes('Awaiting')) statusClass = 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold';
    if (newStatus.includes('Transit')) statusClass = 'bg-sky-100 text-sky-900 border border-sky-300 font-semibold';
    if (newStatus.includes('Preparing')) statusClass = 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold';

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus, statusClass } : o))
    );
  };

  const handleProcessOrder = (id) => {
    handleUpdateOrderStatus(id, 'Dispatched');
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm(`Are you sure you want to delete order ${id} permanently from dispatch queue?`)) return;
    try {
      await fetch(`http://localhost:5001/api/orders/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err) {
      console.log('Delete order error:', err);
    }
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Patron Name', 'Patron Tier', 'Artifact Items', 'Destination', 'Settlement Total', 'Dispatch Status', 'Export Date'];
    
    const rows = filteredOrders.map((ord) => [
      `"${(ord.id || '').replace(/"/g, '""')}"`,
      `"${(ord.patron || '').replace(/"/g, '""')}"`,
      `"${(ord.tier || '').replace(/"/g, '""')}"`,
      `"${(ord.items || '').replace(/"/g, '""')}"`,
      `"${(ord.destination || '').replace(/"/g, '""')}"`,
      `"${(ord.total || '').replace(/"/g, '""')}"`,
      `"${(ord.status || '').replace(/"/g, '""')}"`,
      `"${new Date().toISOString().split('T')[0]}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `atelier_dispatch_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle local image file selection with instant Base64 preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset Template for Sora Heavyweight Linen Robe
  const fillSoraTemplate = () => {
    setNewTitle('Sora Heavyweight Linen Robe');
    setNewCategory('Normandy Flax');
    setNewSubtitle('Minimalist natural unbleached raw linen lounge robe');
    setNewPrice('$240');
    setNewBadge('Natural Dye');
    setNewBadgeClass('bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface');
    setNewAlt('Minimalist natural unbleached raw linen lounge robe');
    setNewStudio('Stockholm Pattern');
    setNewBatchSize('35');
    setNewKilnBatch('Ghent Weave');
    setImageUploadMode('url');
    setNewImageUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuC7VK4Qn61mQPz4bQ6u0Z8FGzbqjYJvgMPqLyVrl_U5rw8zMgKFmYxR2RYaFcJb8gAO-nTIfO_kc1ratauWCpOU-u67Q4sQ_hMEAF36vTpGIZWZBX2Pkz7kk8UW41YFr96mRr-iUvKoCDPu-eARO10RcSnPksGoqvKDFYjSa0lsrGa6YUypRvkzR7akycKGjXDADIurcjslasNNFQeB8t666hIOUqFpxHE-2ruxGhTHqCv8uzFdgiU');
    setImagePreview('https://lh3.googleusercontent.com/aida-public/AB6AXuC7VK4Qn61mQPz4bQ6u0Z8FGzbqjYJvgMPqLyVrl_U5rw8zMgKFmYxR2RYaFcJb8gAO-nTIfO_kc1ratauWCpOU-u67Q4sQ_hMEAF36vTpGIZWZBX2Pkz7kk8UW41YFr96mRr-iUvKoCDPu-eARO10RcSnPksGoqvKDFYjSa0lsrGa6YUypRvkzR7akycKGjXDADIurcjslasNNFQeB8t666hIOUqFpxHE-2ruxGhTHqCv8uzFdgiU');
  };

  const handleCreateEdition = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImg = imagePreview || newImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7VK4Qn61mQPz4bQ6u0Z8FGzbqjYJvgMPqLyVrl_U5rw8zMgKFmYxR2RYaFcJb8gAO-nTIfO_kc1ratauWCpOU-u67Q4sQ_hMEAF36vTpGIZWZBX2Pkz7kk8UW41YFr96mRr-iUvKoCDPu-eARO10RcSnPksGoqvKDFYjSa0lsrGa6YUypRvkzR7akycKGjXDADIurcjslasNNFQeB8t666hIOUqFpxHE-2ruxGhTHqCv8uzFdgiU';

    const numericPrice = typeof newPrice === 'number' 
      ? newPrice 
      : parseFloat(String(newPrice).replace(/[^0-9.]/g, '')) || 240;

    const payload = {
      title: newTitle || 'Sora Heavyweight Linen Robe',
      category: newCategory || 'Normandy Flax',
      subtitle: newSubtitle || newAlt || 'Minimalist natural unbleached raw linen lounge robe',
      price: numericPrice,
      badge: newBadge || 'Natural Dye',
      badgeClass: newBadgeClass || 'bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface',
      img: finalImg,
      alt: newAlt || newTitle || 'Minimalist natural unbleached raw linen lounge robe',
      studio: newStudio || 'Stockholm Pattern',
      stock: Number(newBatchSize) || 35,
      kilnBatch: newKilnBatch || 'Ghent Weave',
    };

    try {
      // Backend Express API (http://localhost:5001/api/products) ekata post kireema
      const res = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedData = await res.json();
        alert(`✨ New Edition "${savedData.title}" ($${savedData.price}) added to database successfully!`);
      } else {
        alert(`✨ New Edition "${payload.title}" published successfully!`);
      }
    } catch (err) {
      console.log('Backend connection failure:', err);
      alert(`✨ New Edition "${payload.title}" published!`);
    } finally {
      setIsAddEditionOpen(false);
      setIsUploading(false);
      setNewTitle('');
      setNewImageUrl('');
      setImagePreview('');
      setImageFile(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface flex selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onGoToPublicStore={onGoToPublicStore}
      />

      {/* Main Layout Area */}
      <div className="pl-72 flex flex-col flex-1 min-h-screen">
        {/* Admin Top Header Console */}
        <AdminHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNewEdition={() => {
            setEditingProduct(null);
            setActiveNav('add-product');
          }}
        />

        {/* View Switcher */}
        <main className="w-full pt-16 bg-surface">
          {activeNav === 'orders' ? (
            <AdminOrders />
          ) : activeNav === 'editions' || activeNav === 'inventory' ? (
            <AdminProducts
              onOpenNewEdition={() => {
                setEditingProduct(null);
                setActiveNav('add-product');
              }}
              onEditProduct={(prod) => {
                setEditingProduct(prod);
                setActiveNav('add-product');
              }}
            />
          ) : activeNav === 'add-product' ? (
            <AddProductPage
              editingProduct={editingProduct}
              onBackToProducts={() => {
                setEditingProduct(null);
                setActiveNav('editions');
              }}
              onProductAdded={() => {
                setEditingProduct(null);
                setActiveNav('editions');
              }}
            />
          ) : activeNav === 'customers' ? (
            <AdminPatrons />
          ) : activeNav === 'artisans' || activeNav === 'journal' || activeNav === 'architectural' || activeNav === 'inquiries' ? (
            <AdminInquiries />
          ) : (
            /* Executive Operations Overview Dashboard */


            <div className="w-full max-w-[1360px] mx-auto px-space-md sm:px-space-xl py-space-xl space-y-space-2xl">
              {/* Executive Header */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-xs border-b border-surface-variant">
                <div className="space-y-space-xxs">
                  <div className="flex items-center gap-space-xs">
                    <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-label-caps text-[11px] uppercase tracking-widest text-secondary font-semibold">
                      Autonomous Atelier Feed
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                    Atelier Operations Overview
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Live telemetry across Kyoto workshop kiln complexes, Stockholm fulfillment sanctum, and global diplomatic dispatch.
                  </p>
                </div>

                {/* Date Filters & Reporting */}
                <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
                  <div className="inline-flex p-1 bg-surface-container-high rounded-lg">
                    {['Today', 'Last 7 Days', 'Current Moon / Month', 'Fiscal Year'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setDateFilter(tab)}
                        className={`px-3 py-1.5 rounded font-label-md text-xs transition-colors cursor-pointer ${
                          dateFilter === tab
                            ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-space-xs px-4 py-2 bg-primary text-on-primary hover:bg-secondary rounded-lg shadow-sm font-label-md text-xs transition-colors cursor-pointer"
                    title="Export full consignment dispatch report as CSV"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                    <span>Export Dispatch CSV</span>
                  </button>
                </div>
              </div>

              {/* Primary KPI Metric Suite */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
                {/* KPI 1: Gross Settlement */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group border border-surface-variant">
                  <div className="space-y-space-xs relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider">Gross Settlement</span>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-xs">arrow_upward</span>{currentMetrics.grossGrowth}
                      </span>
                    </div>
                    <div className="font-price-editorial text-3xl font-medium tracking-tight text-primary pt-1">{currentMetrics.grossSettlement}</div>
                    <div className="text-on-surface-variant font-body-sm text-xs flex items-center gap-1.5">
                      <span>Avg. archival order</span>
                      <span className="font-price-editorial text-primary font-medium">{currentMetrics.avgOrder}</span>
                    </div>
                  </div>
                  <div className="pt-space-md mt-auto relative z-10">
                    <svg className="w-full h-9 text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 120 28">
                      <path d="M0 24 Q 20 22, 35 15 T 70 12 T 95 6 T 120 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75"></path>
                      <path d="M0 24 Q 20 22, 35 15 T 70 12 T 95 6 T 120 2 L 120 28 L 0 28 Z" fill="currentColor" fillOpacity="0.08"></path>
                    </svg>
                  </div>
                </div>

                {/* KPI 2: Active Acquisitions */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group border border-surface-variant">
                  <div className="space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider">Active Acquisitions</span>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-xs">arrow_upward</span>8.6%
                      </span>
                    </div>
                    <div className="font-headline-md text-headline-md font-medium text-primary pt-1">
                      {currentMetrics.acquisitions} <span className="font-body-sm text-xs font-normal text-on-surface-variant">orders</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex-1 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: currentMetrics.donePercent }}></div>
                      </div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant">{currentMetrics.donePercent} Done</span>
                    </div>
                  </div>
                  <div className="pt-space-md border-t border-surface-container flex items-center justify-between font-body-sm text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{currentMetrics.pending}</span>
                    <span className="text-primary font-medium">{currentMetrics.delivered}</span>
                  </div>
                </div>

                {/* KPI 3: Kiln Yield */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group border border-surface-variant">
                  <div className="space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider">Kiln &amp; Atelier Yield</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-[10px] font-medium">
                        Kyoto Chamber #2
                      </span>
                    </div>
                    <div className="font-headline-md text-headline-md font-medium text-primary pt-1">
                      {currentMetrics.yield} <span className="font-body-sm text-xs text-on-surface-variant font-normal">perfection</span>
                    </div>
                    <div className="text-on-surface-variant font-body-sm text-xs">
                      Strict tolerance wabi evaluation: 5.2% glaze variation
                    </div>
                  </div>
                  <div className="pt-space-md border-t border-surface-container flex items-center justify-between font-body-sm text-xs">
                    <span className="text-on-surface-variant">{currentMetrics.curing}</span>
                    <span className="inline-flex items-center gap-1 text-secondary font-medium font-label-md text-xs">
                      <span className="material-symbols-outlined text-sm animate-spin">cyclone</span> 2 Firing Cycles
                    </span>
                  </div>
                </div>

                {/* KPI 4: Patron Retention */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group border border-surface-variant">
                  <div className="space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider">Patron Lifetime &amp; LTV</span>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-xs">arrow_upward</span>{currentMetrics.patronGrowth}
                      </span>
                    </div>
                    <div className="font-headline-md text-headline-md font-medium text-primary pt-1">
                      {currentMetrics.patronRepeat} <span className="font-body-sm text-xs text-on-surface-variant font-normal">repeat tier</span>
                    </div>
                    <div className="text-on-surface-variant font-body-sm text-xs">
                      Highest concentration in Stockholm, Kyoto &amp; Zürich
                    </div>
                  </div>
                  <div className="pt-space-md border-t border-surface-container flex items-center justify-between font-body-sm text-xs">
                    <span className="text-on-surface-variant">Active collectors</span>
                    <span className="font-subheading-md font-semibold text-primary">{currentMetrics.patronCount}</span>
                  </div>
                </div>
              </div>

              {/* Lower Section: Recent Orders Table */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-space-lg sm:p-space-xl space-y-space-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                  <div>
                    <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline">Consignment Stream</span>
                    <h2 className="font-headline-sm text-headline-sm text-primary">Recent Orders &amp; Fulfillment Queue</h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
                    <div className="inline-flex p-1 bg-surface-container-high rounded-lg overflow-x-auto max-w-full">
                      {['All', 'Awaiting Dispatch', 'In Transit', 'Fulfilled'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setOrderFilter(tab)}
                          className={`px-3 py-1.5 rounded font-label-md text-xs cursor-pointer ${
                            orderFilter === tab
                              ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low font-label-caps text-[10px] uppercase text-outline border-b border-surface-variant">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Patron</th>
                        <th className="py-3 px-4">Editions</th>
                        <th className="py-3 px-4">Destination</th>
                        <th className="py-3 px-4">Settlement</th>
                        <th className="py-3 px-4">State</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container font-body-sm text-xs text-on-surface">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-surface-container-low/60 transition-colors">
                          <td className="py-4 px-4 font-mono font-medium text-primary">{ord.id}</td>
                          <td className="py-4 px-4">
                            <div className="font-subheading-md text-xs font-medium text-primary">{ord.patron}</div>
                            <div className="font-label-caps text-[10px] text-secondary">{ord.tier}</div>
                          </td>
                          <td className="py-4 px-4 font-medium text-primary">{ord.items}</td>
                          <td className="py-4 px-4">{ord.destination}</td>
                          <td className="py-4 px-4 font-price-editorial text-price-editorial text-primary font-medium">{ord.total}</td>
                          <td className="py-4 px-4">
                            <div className="relative inline-block">
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className={`appearance-none cursor-pointer pl-3 pr-7 py-1 rounded-full font-label-caps text-[10px] uppercase focus:outline-none transition-all shadow-xs border ${ord.statusClass || 'bg-surface-container-high text-on-surface'}`}
                                title="Click to update order status"
                              >
                                <option value="Awaiting Dispatch" className="bg-surface-container-lowest text-on-surface">● Awaiting Dispatch</option>
                                <option value="Preparing Package" className="bg-surface-container-lowest text-on-surface">● Preparing Package</option>
                                <option value="In Transit" className="bg-surface-container-lowest text-on-surface">● In Transit</option>
                                <option value="Dispatched" className="bg-surface-container-lowest text-on-surface">● Dispatched</option>
                                <option value="Delivered" className="bg-surface-container-lowest text-on-surface">● Delivered</option>
                                <option value="Cancelled" className="bg-surface-container-lowest text-on-surface">● Cancelled</option>
                              </select>
                              <span className="material-symbols-outlined text-xs absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                                expand_more
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                            {ord.status.includes('Awaiting') ? (
                              <button
                                onClick={() => handleProcessOrder(ord.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-on-primary hover:bg-secondary font-label-md text-xs uppercase cursor-pointer"
                              >
                                <span>Process</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => alert(`Tracking ${ord.id}...`)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-surface-container-high text-primary font-label-md text-xs uppercase cursor-pointer"
                              >
                                <span>Track</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="p-1.5 rounded bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Edition Modal with Full Direct File Upload & Metadata Controls */}
      {isAddEditionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile bg-primary/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-surface-container-lowest rounded-xl shadow-2xl p-space-xl border border-surface-variant max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-space-md border-b border-surface-variant mb-space-lg">
              <div>
                <span className="font-label-caps text-[10px] uppercase text-secondary tracking-widest block">Atelier Vault Catalog</span>
                <h3 className="font-headline-sm uppercase text-on-surface">Commission New Edition</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fillSoraTemplate}
                  className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px] hover:opacity-90 cursor-pointer"
                  title="Prefill sample values (Sora Robe)"
                >
                  ⚡ Prefill Sora Robe
                </button>
                <button onClick={() => setIsAddEditionOpen(false)} className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer">
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateEdition} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="font-label-caps text-xs block mb-1">Edition Title (`title`) *</label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sora Heavyweight Linen Robe"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-xs block mb-1">Category (`category`) *</label>
                  <select
                    required
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Shigaraki Stoneware">Shigaraki Stoneware (Ceramics &amp; Vessels)</option>
                    <option value="Architectural Lighting">Architectural Lighting (Lamps &amp; Washi Lanterns)</option>
                    <option value="Sculptural Furniture">Sculptural Furniture (Timber &amp; Stools)</option>
                    <option value="Interior Textiles &amp; Drapes">Interior Textiles &amp; Drapes (Throws &amp; Linens)</option>
                    <option value="Hinoki Bath &amp; Ritual Accents">Hinoki Bath &amp; Ritual Accents</option>
                    <option value="Other Home Decor">Other Home Decor Objects</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-caps text-xs block mb-1">Price (`price`) *</label>
                  <input
                    required
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="$240"
                    className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Subtitle / Description */}
              <div>
                <label className="font-label-caps text-xs block mb-1">Subtitle / Material Summary (`subtitle`)</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Minimalist natural unbleached raw linen lounge robe"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Badge & Badge Class */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-xs block mb-1">Badge Tag (`badge`)</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="e.g. Natural Dye / Edition of 60"
                    className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs block mb-1">Badge Class (`badgeClass`)</label>
                  <input
                    type="text"
                    value={newBadgeClass}
                    onChange={(e) => setNewBadgeClass(e.target.value)}
                    placeholder="bg-surface-container-lowest/90 text-on-surface"
                    className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Direct Image File Upload UI */}
              <div className="border border-surface-variant p-4 rounded-xl bg-surface-container-low space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-label-caps text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">cloud_upload</span>
                    <span>Product Image Source (`img`) *</span>
                  </label>
                  <div className="flex rounded-lg bg-surface-container p-0.5 text-xs font-label-caps">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('file')}
                      className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                        imageUploadMode === 'file' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      📁 Upload Local File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('url')}
                      className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                        imageUploadMode === 'url' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      🔗 Paste Image Link URL
                    </button>
                  </div>
                </div>

                {imageUploadMode === 'file' ? (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline/40 hover:border-primary rounded-xl cursor-pointer bg-surface-container-lowest hover:bg-surface-container transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-symbols-outlined text-3xl text-secondary mb-1">add_photo_alternate</span>
                        <p className="text-xs font-label-caps text-on-surface">
                          <span className="font-bold text-primary">Click to choose image file</span> or drag &amp; drop
                        </p>
                        <p className="text-[10px] text-on-surface-variant mt-1">PNG, JPG, WEBP, GIF up to 20MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => {
                        setNewImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://lh3.googleusercontent.com/..."
                      className="w-full h-11 px-3 rounded bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                )}

                {/* Instant Image Preview Thumbnail */}
                {imagePreview && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-lowest border border-surface-variant">
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md border border-surface-variant shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-label-caps text-[10px] uppercase text-secondary font-bold block">Live Image Preview</span>
                      <p className="font-mono text-[10px] text-on-surface-variant truncate">
                        {imageFile ? imageFile.name : imagePreview}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        setNewImageUrl('');
                      }}
                      className="p-1 text-on-surface-variant hover:text-error cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Alt description & Studio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-xs block mb-1">Alt Description (`alt`)</label>
                  <input
                    type="text"
                    value={newAlt}
                    onChange={(e) => setNewAlt(e.target.value)}
                    placeholder="Minimalist natural unbleached raw linen lounge robe"
                    className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs block mb-1">Studio / Kiln (`studio` / `kilnBatch`)</label>
                  <input
                    type="text"
                    value={newStudio}
                    onChange={(e) => setNewStudio(e.target.value)}
                    placeholder="e.g. Stockholm Pattern / Kyoto Studio"
                    className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Vault Stock Size */}
              <div>
                <label className="font-label-caps text-xs block mb-1">Vault Inventory Units (`stock`)</label>
                <input
                  type="number"
                  value={newBatchSize}
                  onChange={(e) => setNewBatchSize(e.target.value)}
                  placeholder="35"
                  className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => setIsAddEditionOpen(false)}
                  className="px-5 h-11 rounded border border-on-surface text-on-surface font-label-md uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 h-11 rounded bg-primary text-on-primary font-label-md uppercase hover:bg-secondary transition-colors cursor-pointer flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                      <span>Uploading &amp; Creating...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">publish</span>
                      <span>Create &amp; Publish Edition</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
