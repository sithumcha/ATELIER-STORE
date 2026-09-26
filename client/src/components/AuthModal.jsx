import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        let loggedUser = null;
        try {
          const res = await fetch('http://localhost:5001/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), password }),
          });
          if (res.ok) {
            const data = await res.json();
            loggedUser = data.user;
          }
        } catch (err) {}

        // Fallback: Check local registered users list so custom avatar/profile is preserved
        if (!loggedUser) {
          const regList = JSON.parse(localStorage.getItem('atelierstore_registered_users') || '[]');
          const foundLocal = regList.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
          if (foundLocal) {
            loggedUser = foundLocal;
          } else {
            const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(email ? email.split('@')[0] : 'User')}&background=1c1917&color=f5f5f4&bold=true`;
            loggedUser = {
              id: 'u_' + Date.now(),
              name: email ? email.split('@')[0] : 'User',
              email: email.trim(),
              avatar: defaultAvatar,
              tier: 'Member',
              address: {},
            };
          }
        }

        onAuthSuccess(loggedUser);
        onClose();
      } else {
        // Register Mode
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim() || 'User')}&background=1c1917&color=f5f5f4&bold=true`;
        const userPayload = {
          id: 'u_' + Date.now(),
          name: name.trim() || 'New User',
          email: email.trim(),
          password: password || '123456',
          avatar: defaultAvatar,
          tier: 'Member',
          address: {},
        };

        // 1. Post to Express Backend API (MongoDB)
        try {
          const res = await fetch('http://localhost:5001/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: userPayload.name,
              email: userPayload.email,
              password: userPayload.password,
              avatar: userPayload.avatar,
              address: userPayload.address,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              userPayload.id = data.user.id || data.user._id || userPayload.id;
              if (data.user.avatar) userPayload.avatar = data.user.avatar;
            }
          }
        } catch (err) {
          console.log('Backend user register API error:', err);
        }

        // 2. Save to LocalStorage registry of registered users
        try {
          const regList = JSON.parse(localStorage.getItem('atelierstore_registered_users') || '[]');
          const updatedRegList = [userPayload, ...regList.filter((u) => u.email !== userPayload.email)];
          localStorage.setItem('atelierstore_registered_users', JSON.stringify(updatedRegList));
        } catch (err) {}

        onAuthSuccess(userPayload);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setEmail('elin@atelierstore.com');
    setPassword('password123');
    const mockUser = {
      id: 'u1',
      name: 'Elin Lindqvist',
      email: 'elin@atelierstore.com',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBVc9DU0FPf5cvkDbLsmajjIhrqxVzcprYSiMVl52H84IrGx-8KX7sAFTfDcCp_Jkh7ui-wjuxF_GCOTmZMC6FFSQ_1xmC1ln7j7_ag4eIyYD3NThID8SC7gXukjhUq_IQNeR0hA7sSSmKgP9OEScujERw4GKLr2iNdYSKBZt0gB_e3seq4o9Q31KXBbs09WpqRULVK9xwvPXKZ0tkFsNYyEjbYKTOi_uwg-44pt2XJPSoz8Q5QI2E',
      tier: 'Patron Tier II',
      address: {
        street: 'Åsögatan 142, Apt 4B',
        city: 'Stockholm',
        country: 'Sweden',
        postalCode: '116 24',
        phone: '+46 8 123 4567',
      },
    };
    onAuthSuccess(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile bg-primary/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl p-space-xl border border-surface-variant relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-space-md border-b border-surface-variant mb-space-lg">
          <div>
            <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block mb-0.5">
              Patron Portal
            </span>
            <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
              {mode === 'login' ? 'Sign In' : 'Register Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-surface-variant mb-space-lg">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 pb-2 font-label-md text-xs uppercase tracking-wider cursor-pointer border-b-2 ${
              mode === 'login'
                ? 'border-secondary text-on-surface font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 pb-2 font-label-md text-xs uppercase tracking-wider cursor-pointer border-b-2 ${
              mode === 'register'
                ? 'border-secondary text-on-surface font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Register Account
          </button>
        </div>

        {error && (
          <div className="mb-space-md p-3 rounded bg-error-container text-on-error-container font-body-sm text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-space-md">
          {mode === 'register' && (
            <div>
              <label className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider block mb-1">
                Full Name *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elin Lindqvist"
                className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:bg-surface-container-lowest transition-colors"
              />
            </div>
          )}

          <div>
            <label className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider block mb-1">
              Correspondence Email *
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patron@example.com"
              className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:bg-surface-container-lowest transition-colors"
            />
          </div>

          <div>
            <label className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider block mb-1">
              Password *
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-11 px-3 rounded bg-surface-container-low border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:bg-surface-container-lowest transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer flex items-center justify-center gap-2 mt-space-lg"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'login' ? (
              <span>Sign In to Account</span>
            ) : (
              <span>Create Patron Account</span>
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-space-lg pt-space-md border-t border-surface-variant text-center">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
            Instant Demo Access
          </span>
          <button
            onClick={handleDemoSignIn}
            className="w-full py-2 px-3 rounded bg-surface-container-high text-on-surface font-label-caps text-[11px] uppercase hover:bg-surface-variant transition-colors cursor-pointer"
          >
            ⚡ Quick Sign In as Elin Lindqvist
          </button>
        </div>
      </div>
    </div>
  );
}
