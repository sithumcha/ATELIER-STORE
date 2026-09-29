// Product Offer Utility Functions
export function getProductOffer(product) {
  if (!product) {
    return {
      hasActiveOffer: false,
      rawPrice: 0,
      discountedPrice: 0,
      offerPercentage: 0,
      offerTitle: '',
      timeRemainingStr: '',
      isExpired: true,
      expiresAt: null,
    };
  }

  const rawPrice = typeof product.price === 'number'
    ? product.price
    : parseFloat(String(product.price || 0).replace(/[^0-9.]/g, '')) || 0;

  const pct = Number(product.offerPercentage) || 0;
  const expiresAtStr = product.offerExpiresAt || null;
  const expiresAt = expiresAtStr ? new Date(expiresAtStr).getTime() : null;
  const now = Date.now();

  const isExpired = !expiresAt || expiresAt <= now;
  const hasActiveOffer = pct > 0 && !isExpired;

  if (!hasActiveOffer) {
    return {
      hasActiveOffer: false,
      rawPrice,
      discountedPrice: rawPrice,
      offerPercentage: 0,
      offerTitle: '',
      timeRemainingStr: '',
      isExpired: true,
      expiresAt: null,
    };
  }

  const discountAmount = Math.round((rawPrice * pct) / 100);
  const discountedPrice = Math.max(0, rawPrice - discountAmount);

  // Format remaining countdown time
  const diffMs = expiresAt - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHoursInDay = diffHours % 24;
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let timeRemainingStr = '';
  if (diffDays > 0) {
    timeRemainingStr = `${diffDays}d ${remainingHoursInDay}h left`;
  } else if (diffHours > 0) {
    timeRemainingStr = `${diffHours}h ${diffMins}m left`;
  } else {
    timeRemainingStr = `${diffMins}m left`;
  }

  return {
    hasActiveOffer: true,
    rawPrice,
    discountedPrice,
    offerPercentage: pct,
    offerTitle: product.offerTitle || `${pct}% OFF Special Offer`,
    timeRemainingStr,
    expiresAt,
    isExpired: false,
  };
}

// Helper to format currency Rs.
export function formatRsPrice(val) {
  if (val === undefined || val === null) return 'Rs. 0';
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  return `Rs. ${Math.round(num).toLocaleString('en-LK')}`;
}
