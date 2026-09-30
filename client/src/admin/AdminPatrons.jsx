import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function AdminPatrons() {
  const [patrons, setPatrons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Database eken Patrons / Members fetch kireema
  useEffect(() => {
    fetchPatrons();
  }, []);

  const fetchPatrons = async () => {
    let combined = [];

    // 1. Fetch from LocalStorage registered users list & logged-in user
    try {
      const regList = JSON.parse(localStorage.getItem('atelierstore_registered_users') || '[]');
      if (Array.isArray(regList)) {
        combined = [...regList];
      }

      const currentUser = JSON.parse(localStorage.getItem('atelierstore_user') || 'null');
      if (currentUser && currentUser.email) {
        if (!combined.some((u) => u.email === currentUser.email)) {
          combined.unshift(currentUser);
        }
      }

      // Also check patrons who placed orders
      const userOrders = JSON.parse(localStorage.getItem('atelierstore_user_orders') || '[]');
      if (Array.isArray(userOrders)) {
        userOrders.forEach((ord) => {
          if (ord.patronEmail && !combined.some((u) => u.email === ord.patronEmail)) {
            combined.push({
              id: `u_${Date.now()}`,
              name: ord.patronName || 'Order Patron',
              email: ord.patronEmail,
              tier: 'Acquisition Patron',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(ord.patronName || 'P')}&background=1c1917&color=f5f5f4&bold=true`,
              address: { city: 'Colombo', country: 'Sri Lanka' },
            });
          }
        });
      }
    } catch (e) {}

    // 2. Fetch from Express Backend API (MongoDB)
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          data.forEach((dbU) => {
            const norm = {
              id: dbU._id || dbU.id,
              _id: dbU._id || dbU.id,
              name: dbU.name || 'Registered Patron',
              email: dbU.email,
              tier: dbU.tier || 'Verified Collector',
              avatar: dbU.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbU.name || 'P')}&background=1c1917&color=f5f5f4&bold=true`,
              address: dbU.address || { city: 'Colombo', country: 'Sri Lanka' },
            };

            const idx = combined.findIndex((c) => c.email === norm.email || String(c.id) === String(norm.id));
            if (idx === -1) {
              combined.unshift(norm);
            } else {
              combined[idx] = { ...combined[idx], ...norm };
            }
          });
        }
      }
    } catch (err) {
      console.log('Error fetching patrons from database:', err);
    } finally {
      setPatrons(combined);
      setLoading(false);
    }
  };

  const handleDeletePatron = (id, name) => {
    toast(`Delete patron "${name || id}" permanently?`, {
      description: 'This record will be removed from database.',
      action: {
        label: 'Confirm Delete',
        onClick: async () => {
          try {
            await fetch(`http://localhost:5001/api/users/${id}`, { method: 'DELETE' });
            toast.success(`Patron "${name || id}" deleted successfully`);
          } catch (err) {
            console.log('Delete patron error:', err);
            toast.error('Failed to delete patron');
          }
          setPatrons((prev) => prev.filter((p) => (p._id || p.id) !== id));
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
      duration: 8000,
    });
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-space-md sm:px-space-xl py-space-xl space-y-space-xl">
      <div className="flex items-center justify-between border-b border-surface-variant pb-space-md">
        <div>
          <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block">Patron Registry</span>
          <h1 className="font-headline-lg text-headline-lg text-primary">Collectors &amp; Members</h1>
        </div>
        <span className="px-3 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-xs font-bold">
          {patrons.length} Active Database Collectors
        </span>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
        {patrons.length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">group_off</span>
            <h3 className="font-headline-sm text-on-surface mb-1">No registered clients in database</h3>
            <p className="font-body-sm text-xs">New user registrations and authenticated patrons will automatically appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low font-label-caps text-[10px] uppercase text-outline border-b border-surface-variant">
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Membership Tier</th>
                <th className="py-3 px-4">Contact Email</th>
                <th className="py-3 px-4">Primary Destination</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-body-sm text-xs text-on-surface">
              {patrons.map((p) => {
                const patronId = p._id || p.id;
                return (
                  <tr key={patronId || p.email} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={p.name}
                          className="w-9 h-9 rounded-full object-cover border border-surface-variant"
                        />
                        <div>
                          <span className="font-subheading-md text-xs font-semibold text-primary block">{p.name}</span>
                          <span className="font-mono text-[10px] text-outline">{patronId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-[10px]">
                        {p.tier || 'Verified Collector'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-on-surface-variant">{p.email}</td>
                    <td className="py-4 px-4">
                      {p.address ? `${p.address.city || ''}, ${p.address.country || ''}` : 'Global Sanctuary'}
                    </td>
                    <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-caps text-[10px] font-bold">
                        ● Verified Patron
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeletePatron(patronId, p.name)}
                        className="p-1.5 rounded bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors cursor-pointer"
                        title="Delete Patron"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
