// Studio & Trade Inquiries Component
import React, { useState, useEffect } from 'react';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);

  // Database eken inquiries fetch kireema
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((inq) => ({
            id: inq._id || inq.id,
            name: inq.name || 'Anonymous Collector',
            email: inq.email || 'collector@atelier.co',
            subject: inq.subject || 'General Inquiry',
            message: inq.message || '',
            status: inq.status || 'Pending Review',
            createdAt: inq.createdAt || new Date().toISOString(),
          }));
          setInquiries(formatted);
        }
      }
    } catch (err) {
      console.log('Error fetching inquiries from database:', err);
    }
  };

  const handleMarkReplied = (id) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: 'Replied' } : inq))
    );
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-space-md sm:px-space-xl py-space-xl space-y-space-xl">
      <div className="flex items-center justify-between border-b border-surface-variant pb-space-md">
        <div>
          <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block">Atelier Correspondence</span>
          <h1 className="font-headline-lg text-headline-lg text-primary">Studio &amp; Trade Inquiries</h1>
        </div>
        <span className="px-3 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-xs">
          {inquiries.length} Dispatches Received
        </span>
      </div>

      <div className="grid grid-cols-1 gap-space-md">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-variant flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-outline">{inq.id}</span>
                <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px] uppercase font-bold">
                  {inq.subject}
                </span>
                <span className={`px-2 py-0.5 rounded font-label-caps text-[10px] ${inq.status === 'Replied' ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary text-on-primary'}`}>
                  {inq.status}
                </span>
              </div>
              <h3 className="font-subheading-lg text-on-surface font-semibold pt-1">{inq.name} ({inq.email})</h3>
              <p className="font-body-md text-xs text-on-surface-variant max-w-3xl leading-relaxed">{inq.message}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => handleMarkReplied(inq.id)}
                className="px-4 py-2 rounded bg-primary text-on-primary font-label-md text-xs uppercase hover:bg-secondary transition-colors cursor-pointer"
              >
                Mark Replied ✓
              </button>
              <button
                onClick={() => alert(`Opening email client for ${inq.email}...`)}
                className="px-4 py-2 rounded border border-surface-variant text-on-surface font-label-md text-xs uppercase hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Reply Email ✉️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
