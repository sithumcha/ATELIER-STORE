import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import WishlistModal from './components/WishlistModal';

// Modular Page Views from src/pages/
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import AccountPage from './pages/AccountPage';
import CheckoutPage from './pages/CheckoutPage';
import ApparelPage from './pages/ApparelPage';
import LivingPage from './pages/LivingPage';



// Admin Console from src/admin/
import AdminDashboard from './admin/AdminDashboard';

// URL Path Routing Helpers
const getTabFromPath = (pathname) => {
  const cleanPath = pathname.toLowerCase().replace(/\/$/, '');
  if (!cleanPath || cleanPath === '') return { tab: 'home', prodId: 'p1' };
  if (cleanPath === '/shop') return { tab: 'shop', prodId: 'p1' };
  if (cleanPath === '/apparel') return { tab: 'apparel', prodId: 'p1' };
  if (cleanPath === '/living') return { tab: 'living', prodId: 'p1' };
  if (cleanPath === '/about') return { tab: 'about', prodId: 'p1' };
  if (cleanPath === '/account') return { tab: 'account', prodId: 'p1' };
  if (cleanPath === '/checkout') return { tab: 'checkout', prodId: 'p1' };
  if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) return { tab: 'admin', prodId: 'p1' };
  if (cleanPath.startsWith('/product/')) {
    const id = cleanPath.replace('/product/', '');
    return { tab: 'product-detail', prodId: id || 'p1' };
  }
  return { tab: 'home', prodId: 'p1' };
};

const getPathForTab = (tab, prodId) => {
  if (tab === 'home') return '/';
  if (tab === 'shop') return '/shop';
  if (tab === 'apparel') return '/apparel';
  if (tab === 'living') return '/living';
  if (tab === 'about') return '/about';
  if (tab === 'account') return '/account';
  if (tab === 'checkout') return '/checkout';
  if (tab === 'admin') return '/admin';
  if (tab === 'product-detail') return `/product/${prodId || 'p1'}`;
  return '/';
};

export default function App() {
  // Initialize state from browser URL location
  const initialRoute = getTabFromPath(window.location.pathname);
  const [activeTab, setActiveTabState] = useState(initialRoute.tab);
  const [selectedProductId, setSelectedProductId] = useState(initialRoute.prodId);

  // Router Navigator: updates state & pushes browser history URL
  const navigateTo = (tab, prodId = selectedProductId) => {
    setActiveTabState(tab);
    if (prodId) setSelectedProductId(prodId);
    const newPath = getPathForTab(tab, prodId);
    if (window.location.pathname !== newPath) {
      window.history.pushState({ tab, prodId }, '', newPath);
    }
  };

  // Sync state on Browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = getTabFromPath(window.location.pathname);
      setActiveTabState(route.tab);
      setSelectedProductId(route.prodId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // User Auth State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kura_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Cart Items State (Initial state empty array - data from database/user interactions)
  const [cartItems, setCartItems] = useState([]);

  // Wishlist Items State (Initial state empty array)
  const [wishlistItems, setWishlistItems] = useState([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync user state to localStorage
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('kura_user', JSON.stringify(userData));
    setToastMessage(`Welcome back, ${userData.name}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem('kura_user');
    setToastMessage('Signed out of Patron account');
    setTimeout(() => setToastMessage(null), 3000);
    navigateTo('home');
  };

  const handleUpdateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('kura_user', JSON.stringify(updatedUserData));
  };

  // Add product to cart handler
  const handleAddToCart = (product) => {
    const numericPrice =
      typeof product.price === 'number'
        ? product.price
        : parseInt(product.price.toString().replace('$', ''), 10) || 150;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: numericPrice,
          qty: 1,
          img: product.img,
        },
      ];
    });

    setToastMessage(`Added "${product.title}" to your Shopping Bag`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Remove cart item
  const handleRemoveCartItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update quantity
  const handleUpdateQty = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalCartPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Toggle item in Wishlist / Favorites
  const handleToggleWishlist = (product) => {
    const numericPrice =
      typeof product.price === 'number'
        ? product.price
        : parseInt((product.price || '150').toString().replace(/[^0-9.]/g, ''), 10) || 150;

    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id || item.title === product.title);
      if (exists) {
        setToastMessage(`Removed "${product.title}" from Wishlist`);
        setTimeout(() => setToastMessage(null), 2500);
        return prev.filter((item) => item.id !== product.id && item.title !== product.title);
      } else {
        setToastMessage(`Saved "${product.title}" to your Wishlist ❤️`);
        setTimeout(() => setToastMessage(null), 2500);
        return [
          ...prev,
          {
            id: product.id || 'wish_' + Date.now(),
            title: product.title,
            price: numericPrice,
            img: product.img,
          },
        ];
      }
    });
  };

  const wishlistIds = wishlistItems.map((item) => item.id);

  return (
    <div className="w-full bg-surface font-body-md text-on-surface antialiased selection:bg-surface-variant selection:text-on-surface">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-lg bg-primary text-on-primary font-label-md shadow-2xl flex items-center gap-3 animate-fade-in-up">
          <span className="material-symbols-outlined text-[20px] text-secondary">
            favorite
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Render Header except on Checkout & Admin pages */}
      {activeTab !== 'checkout' && activeTab !== 'admin' && (
        <Header
          cartCount={totalCartCount}
          wishlistCount={wishlistItems.length}
          activeTab={activeTab}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          setActiveTab={(tab) => {
            if (tab === 'wishlist') {
              setIsWishlistOpen(true);
            } else {
              navigateTo(tab);
            }
          }}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Main Page Content Switcher */}
      <main
        className={`w-full bg-surface ${
          activeTab !== 'checkout' && activeTab !== 'admin' ? 'pt-[116px]' : ''
        }`}
      >
        {activeTab === 'admin' ? (
          <AdminDashboard onGoToPublicStore={() => navigateTo('home')} />
        ) : activeTab === 'checkout' ? (
          <CheckoutPage
            user={user}
            onBackToHome={() => navigateTo('home')}
            onOrderComplete={() => {
              setCartItems([]);
            }}
          />
        ) : activeTab === 'apparel' ? (
          <ApparelPage
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onSelectProduct={(id) => {
              navigateTo('product-detail', id || 'p2');
            }}
            onExploreCatalog={() => navigateTo('shop')}
          />
        ) : activeTab === 'living' ? (
          <LivingPage
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onSelectProduct={(id) => {
              navigateTo('product-detail', id || 'p1');
            }}
            onExploreCatalog={() => navigateTo('shop')}
          />
        ) : activeTab === 'shop' ? (
          <ShopPage
            activeTab={activeTab}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onSelectProduct={(id) => {
              navigateTo('product-detail', id || 'p1');
            }}
          />


        ) : activeTab === 'product-detail' ? (
          <ProductDetailPage
            selectedProductId={selectedProductId}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onBackToHome={() => navigateTo('shop')}
          />
        ) : activeTab === 'about' ? (
          <AboutPage onExploreShop={() => navigateTo('shop')} />
        ) : activeTab === 'account' ? (
          <AccountPage
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogOut={handleLogOut}
            onUpdateUser={handleUpdateUser}
            onGoToShop={() => navigateTo('shop')}
          />
        ) : (
          /* Modular Home Page View */
          <HomePage
            onExploreShop={() => navigateTo('shop')}
            onReadAbout={() => navigateTo('about')}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}
      </main>

      {/* Render Footer except on Checkout & Admin pages */}
      {activeTab !== 'checkout' && activeTab !== 'admin' && <Footer />}

      {/* Shopping Bag Drawer Slide-over */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-primary/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-2xl flex flex-col justify-between p-space-xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-space-lg border-b border-surface-variant mb-space-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[22px]">
                    shopping_bag
                  </span>
                  <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                    Shopping Bag ({totalCartCount})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    close
                  </span>
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="mb-space-lg p-space-xs rounded bg-surface-container-low border border-surface-variant">
                <div className="flex justify-between font-label-caps text-xs text-on-surface mb-1.5">
                  <span>Insured Global Shipping Status</span>
                  <span className="text-secondary font-bold">
                    {totalCartPrice >= 350
                      ? 'Complimentary Shipping Qualified'
                      : `Add $${350 - totalCartPrice} for Free Shipping`}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (totalCartPrice / 350) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-16 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] block mb-3 opacity-40">
                    local_mall
                  </span>
                  <p className="font-subheading-md">Your bag is currently empty</p>
                </div>
              ) : (
                <div className="space-y-space-md">
                  {cartItems.map((item) => (
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
                        <span className="font-price-editorial text-price-editorial text-on-surface block">
                          ${item.price}
                        </span>

                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => handleUpdateQty(item.id, -1)}
                            className="w-6 h-6 rounded bg-surface-container flex items-center justify-center font-bold text-xs hover:bg-surface-variant cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-label-caps text-xs">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.id, 1)}
                            className="w-6 h-6 rounded bg-surface-container flex items-center justify-center font-bold text-xs hover:bg-surface-variant cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveCartItem(item.id)}
                        className="p-1 text-on-surface-variant hover:text-error cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="pt-space-lg border-t border-surface-variant mt-space-lg">
                <div className="flex items-center justify-between font-headline-sm mb-space-md">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-price-editorial text-on-surface">
                    ${totalCartPrice}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('checkout');
                  }}
                  className="w-full h-12 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer"
                >
                  Proceed to Checkout — ${totalCartPrice}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Drawer Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onAddToCart={handleAddToCart}
        onRemoveWishlist={(id) => {
          setWishlistItems((prev) => prev.filter((i) => i.id !== id));
        }}
      />

      {/* Auth Modal for Login / Registration */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
