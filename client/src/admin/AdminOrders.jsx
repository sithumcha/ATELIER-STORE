// Orders & Global Dispatch Management Component
import React, { useState, useEffect } from 'react';

export default function AdminOrders() {
  const [filter, setFilter] = useState('All');
  const [selectedWaybill, setSelectedWaybill] = useState(null);
  const [orders, setOrders] = useState([]);

  // Database eken orders fetch kireema
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((o) => ({
            id: o.orderId || o._id,
            patron: o.patronName || 'Archival Collector',
            email: o.patronEmail || 'patron@atelier.co',
            tier: o.tier || 'Verified Collector',
            items: Array.isArray(o.items) ? o.items.map((i) => i.title || i).join(', ') : (o.items || 'Archival Items'),
            destination: o.destination || 'Global Dispatch',
            total: typeof o.total === 'number' ? `$${o.total.toFixed(2)}` : (String(o.total).startsWith('$') ? o.total : `$${o.total}`),
            status: o.status || 'Awaiting Dispatch',
            courier: o.courier || 'DHL Express Insured',
            trackingNo: o.trackingNo || '7849-2048-1920',
            origin: o.origin || 'Kyoto Workshop Kiln #2',
            rawOrder: o,
          }));
          setOrders(formatted);
          return;
        }
      }
    } catch (err) {
      console.log('Error fetching orders from database:', err);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:5001/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.log('Status update API error:', err);
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedWaybill && selectedWaybill.id === orderId) {
      setSelectedWaybill((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete Order "${orderId}" permanently from dispatch database?`)) return;
    try {
      await fetch(`http://localhost:5001/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.log('Delete order API error:', err);
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedWaybill && selectedWaybill.id === orderId) {
      setSelectedWaybill(null);
    }
  };

  const handleProcessOrder = (orderId) => {
    handleUpdateStatus(orderId, 'Dispatched');
    alert(`✨ Order ${orderId} has been updated to Dispatched!`);
  };

  const filteredOrders = orders.filter((ord) => {
    if (filter === 'Awaiting Dispatch') return ord.status.includes('Awaiting');
    if (filter === 'In Transit') return ord.status.includes('Transit');
    if (filter === 'Fulfilled') return ord.status.includes('Delivered') || ord.status.includes('Dispatched');
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Patron Name', 'Patron Email', 'Patron Tier', 'Artifact Items', 'Destination', 'Settlement Total', 'Dispatch Status', 'Tracking No', 'Export Date'];
    
    const rows = filteredOrders.map((ord) => [
      `"${(ord.id || '').replace(/"/g, '""')}"`,
      `"${(ord.patron || '').replace(/"/g, '""')}"`,
      `"${(ord.email || '').replace(/"/g, '""')}"`,
      `"${(ord.tier || '').replace(/"/g, '""')}"`,
      `"${(ord.items || '').replace(/"/g, '""')}"`,
      `"${(ord.destination || '').replace(/"/g, '""')}"`,
      `"${(ord.total || '').replace(/"/g, '""')}"`,
      `"${(ord.status || '').replace(/"/g, '""')}"`,
      `"${(ord.trackingNo || '').replace(/"/g, '""')}"`,
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

  const getStatusStyle = (status) => {
    if (status.includes('Awaiting')) return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
    if (status.includes('Transit')) return 'bg-sky-100 text-sky-900 border-sky-300 font-semibold';
    if (status.includes('Preparing')) return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
    if (status.includes('Cancelled')) return 'bg-rose-100 text-rose-900 border-rose-300 font-semibold';
    return 'bg-slate-100 text-slate-900 border-slate-300 font-semibold';
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-space-md sm:px-space-xl py-space-xl space-y-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-space-md">
        <div>
          <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block">Dispatch Queue</span>
          <h1 className="font-headline-lg text-headline-lg text-primary">Orders &amp; Global Dispatch</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-surface-variant">
            {['All', 'Awaiting Dispatch', 'In Transit', 'Fulfilled'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded font-label-md text-xs uppercase cursor-pointer transition-colors ${
                  filter === t ? 'bg-primary text-on-primary font-bold' : 'bg-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-secondary-container text-on-secondary-container font-label-md text-xs uppercase hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            title="Export filtered dispatch queue as CSV file"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">local_shipping</span>
            <p className="font-subheading-md text-sm">No orders currently in {filter} queue</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low font-label-caps text-[10px] uppercase text-outline border-b border-surface-variant">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Artifact Items</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status (Click to Change)</th>
                <th className="py-3 px-4 text-right">Actions</th>
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
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className={`appearance-none cursor-pointer pl-3 pr-7 py-1 rounded-full font-label-caps text-[10px] uppercase focus:outline-none transition-all shadow-xs border ${getStatusStyle(ord.status)}`}
                        title="Click to update order status"
                      >
                        <option value="Awaiting Dispatch" className="bg-surface-container-lowest text-on-surface">● Awaiting Dispatch</option>
                        <option value="Preparing Package" className="bg-surface-container-lowest text-on-surface">● Preparing Package</option>
                        <option value="In Transit" className="bg-surface-container-lowest text-on-surface">● In Transit</option>
                        <option value="Dispatched" className="bg-surface-container-lowest text-on-surface">● Dispatched</option>
                        <option value="Delivered" className="bg-surface-container-lowest text-on-surface">● Delivered</option>
                        <option value="Cancelled" className="bg-surface-container-lowest text-on-surface">● Cancelled</option>
                      </select>
                      <span className="material-symbols-outlined text-xs absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70">
                        expand_more
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                    {ord.status.includes('Awaiting') ? (
                      <button
                        onClick={() => handleProcessOrder(ord.id)}
                        className="px-3 py-1.5 rounded bg-primary text-on-primary font-label-md text-xs uppercase cursor-pointer hover:bg-secondary transition-colors"
                      >
                        Process Dispatch
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedWaybill(ord)}
                        className="px-3 py-1.5 rounded bg-surface-container-high text-primary font-label-md text-xs uppercase cursor-pointer hover:bg-surface-container-highest inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">receipt</span>
                        <span>Waybill</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteOrder(ord.id)}
                      className="p-1.5 rounded bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors cursor-pointer"
                      title="Delete Order Permanently"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Waybill Modal */}
      {selectedWaybill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl p-space-xl border border-surface-variant max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-surface-variant pb-4">
              <div>
                <span className="font-label-caps text-[10px] uppercase text-secondary tracking-widest block">
                  ATELIERSTORE • Consignment Certificate
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  Official Waybill &amp; Airway Docket
                </h3>
              </div>
              <button
                onClick={() => setSelectedWaybill(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant space-y-3 font-body-sm text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-surface-variant">
                <span className="font-mono text-xs text-secondary font-bold">Consignment ID: {selectedWaybill.id}</span>
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-[10px] text-outline uppercase font-semibold">Update Status:</span>
                  <select
                    value={selectedWaybill.status}
                    onChange={(e) => handleUpdateStatus(selectedWaybill.id, e.target.value)}
                    className={`px-3 py-1 rounded-full font-label-caps text-[10px] uppercase cursor-pointer border shadow-xs ${getStatusStyle(selectedWaybill.status)}`}
                  >
                    <option value="Awaiting Dispatch" className="bg-surface-container-lowest text-on-surface">● Awaiting Dispatch</option>
                    <option value="Preparing Package" className="bg-surface-container-lowest text-on-surface">● Preparing Package</option>
                    <option value="In Transit" className="bg-surface-container-lowest text-on-surface">● In Transit</option>
                    <option value="Dispatched" className="bg-surface-container-lowest text-on-surface">● Dispatched</option>
                    <option value="Delivered" className="bg-surface-container-lowest text-on-surface">● Delivered</option>
                    <option value="Cancelled" className="bg-surface-container-lowest text-on-surface">● Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-label-caps text-[10px] text-outline block">Patron / Consignee</span>
                  <p className="font-semibold text-primary">{selectedWaybill.patron}</p>
                  <p className="text-on-surface-variant text-[11px]">{selectedWaybill.email}</p>
                  <p className="text-secondary text-[10px] font-label-caps mt-0.5">{selectedWaybill.tier}</p>
                </div>
                <div>
                  <span className="font-label-caps text-[10px] text-outline block">Destination &amp; Freight</span>
                  <p className="font-semibold text-primary">{selectedWaybill.destination}</p>
                  <p className="text-on-surface-variant text-[11px]">{selectedWaybill.courier}</p>
                  <p className="font-mono text-[10px] text-outline mt-0.5">AWB: {selectedWaybill.trackingNo}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider">
                Consignment Manifest &amp; Insured Items
              </h4>
              <div className="border border-surface-variant rounded-lg overflow-hidden">
                <table className="w-full text-left font-body-sm text-xs">
                  <thead className="bg-surface-container-low font-label-caps text-[10px] text-outline">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-right">Declared Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    <tr>
                      <td className="p-3 font-medium text-primary">{selectedWaybill.items}</td>
                      <td className="p-3 text-right font-price-editorial font-semibold text-primary">{selectedWaybill.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-high border border-surface-variant flex items-center justify-between text-[11px] text-on-surface-variant">
              <div>
                <p>• <strong>Origin Kiln / Studio:</strong> {selectedWaybill.origin}</p>
                <p>• <strong>Customs Duties:</strong> Prepaid DDP (Delivered Duty Paid)</p>
              </div>
              <span className="material-symbols-outlined text-3xl text-secondary opacity-60">verified_user</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-surface-variant">
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedWaybill.id)}
                className="px-4 h-10 rounded bg-error-container text-on-error-container hover:bg-error hover:text-on-error font-label-md text-xs uppercase cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                <span>Delete Order</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 h-10 rounded border border-on-surface text-on-surface font-label-md text-xs uppercase cursor-pointer flex items-center gap-1.5 hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  <span>Print Waybill</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWaybill(null)}
                  className="px-5 h-10 rounded bg-primary text-on-primary font-label-md text-xs uppercase cursor-pointer hover:bg-secondary transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
