import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Google Auth Prompt Modal state (for dev fallback or custom Google account selection)
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  // Initialize official Google Identity Services SDK if VITE_GOOGLE_CLIENT_ID is provided
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (isOpen && googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            if (response.credential) {
              try {
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                );
                const gData = JSON.parse(jsonPayload);
                handleGoogleSignIn(gData.email, gData.name, gData.picture);
              } catch (e) {
                console.error('Error parsing Google credential token:', e);
              }
            }
          },
        });
      } catch (err) {
        console.log('Google Identity Services init skip:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerGoogleOAuthPopup = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
        return;
      } catch (e) {}
    }
    setShowGoogleModal(true);
  };

  const handleGoogleSignIn = async (gEmail, gName, gAvatar) => {
    setError(null);
    setLoading(true);

    const targetEmail = (gEmail || googleEmailInput || email || 'collector@gmail.com').trim();
    const targetName = (gName || googleNameInput || name || targetEmail.split('@')[0] || 'Google Patron').trim();
    const targetAvatar = gAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetName)}&background=1c1917&color=f5f5f4&bold=true`;

    const googlePayload = {
      name: targetName,
      email: targetEmail,
      avatar: targetAvatar,
      googleId: `google_${Date.now()}`,
    };

    let loggedUser = null;

    // 1. Post to Express Backend API (MongoDB /api/users/google-login)
    try {
      const res = await fetch('http://localhost:5001/api/users/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googlePayload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          loggedUser = data.user;
        }
      }
    } catch (err) {
      console.log('Backend Google Auth API connection warning:', err);
    }

    // Fallback: If DB server is offline or local registry sync
    if (!loggedUser) {
      loggedUser = {
        id: 'u_g_' + Date.now(),
        name: googlePayload.name,
        email: googlePayload.email,
        avatar: googlePayload.avatar,
        tier: 'Verified Patron',
        address: {},
      };
    }

    // 2. Save user in local registered users registry
    try {
      const regList = JSON.parse(localStorage.getItem('atelierstore_registered_users') || '[]');
      const updatedRegList = [loggedUser, ...regList.filter((u) => u.email !== loggedUser.email)];
      localStorage.setItem('atelierstore_registered_users', JSON.stringify(updatedRegList));
    } catch (err) {}

    setLoading(false);
    setShowGoogleModal(false);
    toast.success(`Welcome back, ${loggedUser.name}! Signed in via Google Auth.`);
    onAuthSuccess(loggedUser);
    onClose();
  };

  const handleQuickGoogleChoose = (choiceEmail, choiceName, choiceAvatar) => {
    handleGoogleSignIn(choiceEmail, choiceName, choiceAvatar);
  };

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

        toast.success(`Signed in as ${loggedUser.name || loggedUser.email}`);
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

        toast.success(`Patron account created for ${userPayload.name}`);
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
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      tier: 'Patron Tier II',
      address: {
        street: 'Åsögatan 142, Apt 4B',
        city: 'Stockholm',
        country: 'Sweden',
        postalCode: '116 24',
        phone: '+46 8 123 4567',
      },
    };
    toast.success('Signed in as Demo Patron Elin Lindqvist');
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

        {/* Official Google Auth Button */}
        <div className="mb-space-md">
          <button
            type="button"
            onClick={triggerGoogleOAuthPopup}
            disabled={loading}
            className="w-full h-12 rounded-lg bg-surface-container-lowest border border-surface-variant hover:bg-surface-container-low text-on-surface font-label-md text-xs font-semibold flex items-center justify-center gap-3 shadow-2xs cursor-pointer transition-all hover:border-secondary/40 active:scale-98"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-surface-variant"></div>
            <span className="px-3 font-label-caps text-[10px] uppercase text-on-surface-variant font-bold">
              or continue with email
            </span>
            <div className="flex-1 border-t border-surface-variant"></div>
          </div>
        </div>

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

      {/* Google Sign-In Selector Popup Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl p-6 border border-surface-variant space-y-5">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-low border border-surface-variant shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <h4 className="font-headline-sm text-lg font-bold text-primary">Sign in with Google</h4>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Choose a Google account to continue to <strong>ATELIERSTORE</strong>
              </p>
            </div>

            {/* Quick Google Account Options */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  handleQuickGoogleChoose(
                    'alexandra.vanderbilt@gmail.com',
                    'Alexandra Vanderbilt',
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
                  )
                }
                className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-variant flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                    alt="Google Account Avatar"
                    className="w-9 h-9 rounded-full object-cover border border-surface-variant shrink-0"
                  />
                  <div>
                    <div className="font-subheading-md text-xs font-bold text-primary group-hover:text-secondary">
                      Alexandra Vanderbilt
                    </div>
                    <div className="font-body-sm text-[11px] text-on-surface-variant">
                      alexandra.vanderbilt@gmail.com
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-base text-outline group-hover:text-secondary">
                  chevron_right
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickGoogleChoose(
                    'sithum.chanuka@gmail.com',
                    'Sithum Chanuka',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                  )
                }
                className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-variant flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    alt="Google Account Avatar"
                    className="w-9 h-9 rounded-full object-cover border border-surface-variant shrink-0"
                  />
                  <div>
                    <div className="font-subheading-md text-xs font-bold text-primary group-hover:text-secondary">
                      Sithum Chanuka
                    </div>
                    <div className="font-body-sm text-[11px] text-on-surface-variant">
                      sithum.chanuka@gmail.com
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-base text-outline group-hover:text-secondary">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Custom Google Email Input Form */}
            <div className="pt-2 border-t border-surface-variant/70 space-y-2">
              <label className="font-label-caps text-[10px] uppercase font-bold text-outline block">
                Or enter custom Google account:
              </label>
              <input
                type="email"
                placeholder="your.name@gmail.com"
                value={googleEmailInput}
                onChange={(e) => setGoogleEmailInput(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-variant text-xs text-primary focus:outline-none focus:border-secondary font-mono"
              />
              <button
                type="button"
                onClick={() => handleGoogleSignIn()}
                disabled={loading}
                className="w-full h-10 rounded-lg bg-primary text-on-primary font-label-caps text-xs uppercase font-bold hover:bg-secondary cursor-pointer transition-colors"
              >
                {loading ? 'Authenticating...' : 'Sign In with Custom Google Email'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="w-full text-center font-label-caps text-[11px] uppercase text-on-surface-variant hover:text-on-surface cursor-pointer pt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

