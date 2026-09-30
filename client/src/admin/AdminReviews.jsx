import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusNotice, setStatusNotice] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    let allRevs = [];

    // 1. Load local reviews
    try {
      const localRevs = JSON.parse(localStorage.getItem('atelierstore_all_user_reviews') || '[]');
      allRevs = [...localRevs];
    } catch (e) {
      console.error('Error loading local reviews:', e);
    }

    // 2. Fetch DB reviews
    try {
      const res = await fetch('http://localhost:5001/api/reviews');
      if (res.ok) {
        const dbRevs = await res.json();
        if (Array.isArray(dbRevs) && dbRevs.length > 0) {
          // Merge dbRevs and localRevs by id/orderId/title
          const mergedMap = new Map();
          [...allRevs, ...dbRevs].forEach((r) => {
            const key = r._id || r.id || `${r.orderId}_${r.productId}`;
            mergedMap.set(key, { ...r, id: r._id || r.id || key });
          });
          allRevs = Array.from(mergedMap.values());
        }
      }
    } catch (err) {
      console.log('Backend server unreachable, using local storage reviews:', err);
    }

    // Sort newest first
    allRevs.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
    setReviews(allRevs);
    setLoading(false);
  };

  const updateReviewStatus = async (review, newStatus) => {
    const isApproved = newStatus === 'Approved';
    const reviewId = review._id || review.id;

    // 1. Update state
    const updatedReviews = reviews.map((r) => {
      const rId = r._id || r.id;
      if (rId === reviewId) {
        return { ...r, status: newStatus, approved: isApproved };
      }
      return r;
    });
    setReviews(updatedReviews);

    // 2. Update localStorage
    try {
      localStorage.setItem('atelierstore_all_user_reviews', JSON.stringify(updatedReviews));
      if (review.productId) {
        const pRevs = JSON.parse(localStorage.getItem(`atelierstore_reviews_${review.productId}`) || '[]');
        const updatedPRevs = pRevs.map((pr) => {
          if ((pr.id && pr.id === reviewId) || (pr.title === review.title && pr.userName === review.userName)) {
            return { ...pr, status: newStatus, approved: isApproved };
          }
          return pr;
        });
        localStorage.setItem(`atelierstore_reviews_${review.productId}`, JSON.stringify(updatedPRevs));
      }
    } catch (e) {
      console.error('Error updating local storage review:', e);
    }

    // 3. Sync to API backend
    try {
      const endpoint = newStatus === 'Approved' ? 'approve' : 'reject';
      if (review._id || (review.id && review.id.length > 15)) {
        await fetch(`http://localhost:5001/api/reviews/${reviewId}/${endpoint}`, { method: 'PUT' });
      } else {
        // Post new to DB then update status
        await fetch('http://localhost:5001/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...review, status: newStatus, approved: isApproved }),
        });
      }
    } catch (err) {
      console.log('Error syncing status update to server:', err);
    }

    showNotice(`Review ${newStatus.toLowerCase()} successfully!`);
  };

  const handleDeleteReview = (reviewId) => {
    toast('Delete this patron review?', {
      description: 'This evaluation will be removed permanently.',
      action: {
        label: 'Confirm Delete',
        onClick: async () => {
          const updatedReviews = reviews.filter((r) => (r._id || r.id) !== reviewId);
          setReviews(updatedReviews);

          try {
            localStorage.setItem('atelierstore_all_user_reviews', JSON.stringify(updatedReviews));
            await fetch(`http://localhost:5001/api/reviews/${reviewId}`, { method: 'DELETE' });
            showNotice('Review deleted from records.');
          } catch (err) {
            console.log('Error deleting review:', err);
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
      duration: 8000,
    });
  };

  const showNotice = (msg) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(''), 3000);
  };

  // Metrics
  const pendingCount = reviews.filter((r) => r.status === 'Pending' || (!r.approved && r.status !== 'Rejected')).length;
  const approvedCount = reviews.filter((r) => r.status === 'Approved' || r.approved).length;
  const rejectedCount = reviews.filter((r) => r.status === 'Rejected').length;

  const filteredReviews = reviews.filter((r) => {
    const isApproved = r.approved || r.status === 'Approved';
    const isRejected = r.status === 'Rejected';
    const isPending = !isApproved && !isRejected;

    if (activeFilter === 'Pending' && !isPending) return false;
    if (activeFilter === 'Approved' && !isApproved) return false;
    if (activeFilter === 'Rejected' && !isRejected) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (r.userName || '').toLowerCase().includes(q);
      const matchProduct = (r.productTitle || '').toLowerCase().includes(q);
      const matchBody = (r.body || '').toLowerCase().includes(q);
      const matchTitle = (r.title || '').toLowerCase().includes(q);
      return matchName || matchProduct || matchBody || matchTitle;
    }

    return true;
  });

  return (
    <div className="space-y-space-lg animate-fade-in pb-space-2xl">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-space-lg rounded-xl border border-surface-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">rate_review</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Patron Reviews &amp; Testimonials</h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Review, approve, or reject patron garment evaluations. Approved reviews will appear in the Public Storefront Testimonials carousel.
          </p>
        </div>

        {statusNotice && (
          <div className="px-space-md py-space-xs bg-secondary/15 text-secondary rounded-lg font-label-caps text-xs flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{statusNotice}</span>
          </div>
        )}
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-variant shadow-xs">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider">Total Submitted</span>
          <div className="font-headline-lg text-headline-lg text-on-surface mt-1">{reviews.length}</div>
          <span className="font-body-sm text-xs text-on-surface-variant">Evaluations in Database</span>
        </div>

        <div className="bg-amber-500/10 p-space-md rounded-xl border border-amber-500/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[11px] text-amber-800 uppercase tracking-wider font-semibold">Pending Approval</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          </div>
          <div className="font-headline-lg text-headline-lg text-amber-900 mt-1">{pendingCount}</div>
          <span className="font-body-sm text-xs text-amber-800">Awaiting Admin Action</span>
        </div>

        <div className="bg-emerald-500/10 p-space-md rounded-xl border border-emerald-500/30 shadow-xs">
          <span className="font-label-caps text-[11px] text-emerald-800 uppercase tracking-wider font-semibold">Approved (Public)</span>
          <div className="font-headline-lg text-headline-lg text-emerald-900 mt-1">{approvedCount}</div>
          <span className="font-body-sm text-xs text-emerald-800">Live on Storefront</span>
        </div>

        <div className="bg-rose-500/10 p-space-md rounded-xl border border-rose-500/30 shadow-xs">
          <span className="font-label-caps text-[11px] text-rose-800 uppercase tracking-wider font-semibold">Rejected</span>
          <div className="font-headline-lg text-headline-lg text-rose-900 mt-1">{rejectedCount}</div>
          <span className="font-body-sm text-xs text-rose-800">Hidden from Public</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest p-space-md rounded-xl border border-surface-variant shadow-xs">
        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg w-full sm:w-auto">
          {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-space-md py-1.5 rounded-md font-label-caps text-xs transition-all cursor-pointer ${
                activeFilter === tab
                  ? 'bg-surface text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab} {tab === 'Pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input
            type="text"
            placeholder="Search by patron, garment, text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg font-body-sm text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Reviews List Grid */}
      {loading ? (
        <div className="p-space-2xl text-center text-on-surface-variant animate-pulse">
          <span className="material-symbols-outlined text-4xl animate-spin">cyclone</span>
          <p className="font-label-caps text-xs tracking-widest mt-2 uppercase">Fetching Patron Evaluations...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-space-2xl text-center bg-surface-container-lowest rounded-xl border border-dashed border-surface-variant">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-2">rate_review</span>
          <h4 className="font-headline-sm text-headline-sm text-on-surface">No Reviews Found</h4>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            {searchQuery ? `No evaluations match "${searchQuery}"` : `No reviews under the "${activeFilter}" filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-space-md">
          {filteredReviews.map((rev) => {
            const isApproved = rev.approved || rev.status === 'Approved';
            const isRejected = rev.status === 'Rejected';
            const isPending = !isApproved && !isRejected;

            return (
              <div
                key={rev._id || rev.id}
                className={`p-space-lg rounded-xl border transition-all bg-surface-container-lowest shadow-xs hover:shadow-md ${
                  isApproved
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : isRejected
                    ? 'border-rose-500/30 bg-rose-500/5 opacity-75'
                    : 'border-amber-500/40 bg-amber-500/5'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-space-md border-b border-surface-variant/40">
                  {/* Patron Info & Star Rating */}
                  <div className="flex items-start gap-3">
                    <img
                      src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={rev.userName}
                      className="w-11 h-11 rounded-full object-cover border border-surface-variant shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-title-md text-base text-on-surface font-bold">{rev.userName || 'Patron'}</h4>
                        <span className="font-body-sm text-xs text-on-surface-variant">• {rev.userLocation || 'Kyoto'}</span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary font-label-caps text-[9px] rounded uppercase font-semibold">
                          ★ Verified Acquisition
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-sm ${
                              i < (rev.rating || 5) ? 'fill-current' : 'opacity-30'
                            }`}
                          >
                            star
                          </span>
                        ))}
                        <span className="font-label-caps text-xs text-on-surface font-semibold ml-1">
                          {rev.rating || 5}.0 Rating
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge & Product details */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="font-label-caps text-[10px] text-outline uppercase block">Garment Item</span>
                      <span className="font-subheading-md text-xs text-on-surface font-semibold">{rev.productTitle}</span>
                    </div>

                    {isApproved && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-label-caps text-xs font-semibold rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        Approved for Storefront
                      </span>
                    )}

                    {isRejected && (
                      <span className="px-3 py-1 bg-rose-100 text-rose-900 border border-rose-300 font-label-caps text-xs font-semibold rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">block</span>
                        Rejected / Hidden
                      </span>
                    )}

                    {isPending && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-label-caps text-xs font-semibold rounded-full flex items-center gap-1 animate-pulse">
                        <span className="material-symbols-outlined text-sm">pending</span>
                        Awaiting Admin Approval
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Title & Body */}
                <div className="py-space-md space-y-1">
                  <h5 className="font-headline-sm text-sm font-semibold text-on-surface">"{rev.title || 'Garment Evaluation'}"</h5>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed italic">
                    "{rev.body}"
                  </p>
                </div>

                {/* Footer Meta & Action Controls */}
                <div className="pt-space-sm border-t border-surface-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-3">
                    {rev.orderId && <span>Order #: <strong>{rev.orderId}</strong></span>}
                    <span>Date: {rev.date || 'Recently'}</span>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {!isApproved && (
                      <button
                        onClick={() => updateReviewStatus(rev, 'Approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-label-caps text-xs rounded transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Approve &amp; Show on Storefront
                      </button>
                    )}

                    {!isRejected && (
                      <button
                        onClick={() => updateReviewStatus(rev, 'Rejected')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-label-caps text-xs rounded transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">do_not_disturb_on</span>
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteReview(rev._id || rev.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
