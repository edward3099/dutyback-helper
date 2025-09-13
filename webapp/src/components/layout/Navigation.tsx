'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PillNav from '@/components/ui/PillNav';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Navigation() {
  const { user, signIn, signUp, loading } = useAuth();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    full_name: '',
    company_name: '',
    phone: ''
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        const { data, error } = await signIn(authData.email, authData.password);
        if (error) throw new Error(error);
        setIsLoginOpen(false);
        if (pendingRoute) {
          router.push(pendingRoute);
          setPendingRoute(null);
        }
      } else {
        const { data, error } = await signUp(authData.email, authData.password, {
          full_name: authData.full_name,
          company_name: authData.company_name,
          phone: authData.phone
        });
        if (error) throw new Error(error);
        setIsRegisterOpen(false);
        if (pendingRoute) {
          router.push(pendingRoute);
          setPendingRoute(null);
        }
      }
      setAuthData({ email: '', password: '', full_name: '', company_name: '', phone: '' });
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Intercept navigation clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link) {
        const href = link.getAttribute('href');
        const protectedRoutes = ['/wizard', '/dashboard', '/stats'];
        
        if (href && protectedRoutes.includes(href)) {
          if (!user && !loading) {
            e.preventDefault();
            setPendingRoute(href);
            setAuthMode('login');
            setIsLoginOpen(true);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [user, loading]);

  const navItems = [
    { label: 'Home', href: '/', ariaLabel: 'Home' },
    { label: 'Wizard', href: '/wizard', ariaLabel: 'Start Claim Wizard' },
    { label: 'Courier Help', href: '/courier-playbooks', ariaLabel: 'Courier Playbooks' },
    { label: 'Dashboard', href: '/dashboard', ariaLabel: 'View Claims Dashboard' },
    { label: 'Stats', href: '/stats', ariaLabel: 'View Detailed Statistics' },
    { label: 'Support', href: '/support', ariaLabel: 'Support & Updates' },
  ];

  return (
    <>
      <PillNav
        logo="/logo.svg"
        logoAlt="Dutyback Helper Logo"
        items={navItems}
        activeHref="/"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
        initialLoadAnimation={true}
        onMobileMenuClick={() => {}}
      />

      {/* Authentication Dialogs */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                required
              />
            </div>
            {authError && (
              <div className="text-red-500 text-sm">{authError}</div>
            )}
            <Button type="submit" disabled={authLoading} className="w-full">
              {authLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => {
                setIsLoginOpen(false);
                setIsRegisterOpen(true);
                setAuthMode('register');
              }}
            >
              Sign up
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={authData.full_name}
                onChange={(e) => setAuthData({ ...authData, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={authData.company_name}
                onChange={(e) => setAuthData({ ...authData, company_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={authData.phone}
                onChange={(e) => setAuthData({ ...authData, phone: e.target.value })}
              />
            </div>
            {authError && (
              <div className="text-red-500 text-sm">{authError}</div>
            )}
            <Button type="submit" disabled={authLoading} className="w-full">
              {authLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => {
                setIsRegisterOpen(false);
                setIsLoginOpen(true);
                setAuthMode('login');
              }}
            >
              Sign in
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
