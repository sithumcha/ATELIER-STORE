import React from 'react';

export default function WishlistModal({ isOpen, onClose, wishlistItems, onAddToCart, onRemoveWishlist }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-primary/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-2xl flex flex-col justify-between p-space-xl overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-space-lg border-b border-surface-variant mb-space-lg">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[22px] ${wishlistItems.length > 0 ? 'text-red-600' : 'text-secondary'}`}>
                {wishlistItems.length > 0 ? 'favorite' : 'favorite_border'}
              </span>
              <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                Saved Wishlist ({wishlistItems.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] block mb-3 opacity-40">
                bookmark_border
              </span>
              <p className="font-subheading-md mb-1">Your wishlist is empty</p>
              <p className="font-body-sm text-xs">Bookmark your favorite numbered editions while browsing</p>
            </div>
          ) : (
            <div className="space-y-space-md">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-space-md p-space-xs rounded bg-surface-container-low border border-surface-variant"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded shrink-0 bg-surface-container"
                  />
                  <div className="flex-1">
                    <h4 className="font-subheading-md text-body-md text-on-surface mb-0.5">
                      {item.title}
                    </h4>
                    <span className="font-price-editorial text-price-editorial text-on-surface block mb-2 font-bold">
                      Rs. {Math.round(item.price).toLocaleString('en-LK')}
                    </span>

                    <button
                      onClick={() => {
                        onAddToCart(item);
                        onRemoveWishlist(item.id);
                      }}
                      className="px-3 py-1 rounded bg-primary text-on-primary font-label-caps text-[10px] uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer"
                    >
                      Move to Bag +
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveWishlist(item.id)}
                    className="p-1 text-on-surface-variant hover:text-error cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-space-lg border-t border-surface-variant mt-space-lg">
          <button
            onClick={onClose}
            className="w-full h-11 rounded border border-on-surface text-on-surface font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Continue Exploring
          </button>
        </div>
      </div>
    </div>
  );
}
