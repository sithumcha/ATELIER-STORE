// Product Offer Utility Functions
export function getProductOffer(product) {
  if (!product) {
    return {
      hasActiveOffer: false,
      rawPrice: 1500,
      discountedPrice: 1500,
      offerPercentage: 0,
      offerTitle: '',
      timeRemainingStr: '',
      isExpired: true,
      expiresAt: null,
    };
  }

  let rawPrice = 0;

  // 1. Try numeric fields first
  if (typeof product.numericPrice === 'number' && product.numericPrice > 0) {
    rawPrice = product.numericPrice;
  } else if (typeof product.price === 'number' && product.price > 0) {
    rawPrice = product.price;
  } else if (product.raw && typeof product.raw.price === 'number' && product.raw.price > 0) {
    rawPrice = product.raw.price;
  } else if (product.rawProduct && typeof product.rawProduct.price === 'number' && product.rawProduct.price > 0) {
    rawPrice = product.rawProduct.price;
  } else {
    // 2. Try parsing string price
    const strVal = String(product.price || product.raw?.price || product.rawProduct?.price || '');
    rawPrice = parseFloat(strVal.replace(/[^0-9.]/g, '')) || 0;
  }

  // Fallback to 1500 if price missing or 0
  if (!rawPrice || rawPrice <= 0) {
    rawPrice = 1500;
  }

  const pct = Number(product.offerPercentage || product.raw?.offerPercentage || product.rawProduct?.offerPercentage) || 0;
  const expiresAtStr = product.offerExpiresAt || product.raw?.offerExpiresAt || product.rawProduct?.offerExpiresAt || null;
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
    offerTitle: product.offerTitle || product.raw?.offerTitle || `${pct}% OFF Special Offer`,
    timeRemainingStr,
    expiresAt,
    isExpired: false,
  };
}

// Helper to format currency Rs.
export function formatRsPrice(val) {
  if (val === undefined || val === null) return 'Rs. 1,500';
  let num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  if (!num || num <= 0) num = 1500;
  return `Rs. ${Math.round(num).toLocaleString('en-LK')}`;
}

