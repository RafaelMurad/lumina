'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSubscription } from '@/hooks/useSubscription';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LogOut, User, Settings, Sparkles, Crown, CreditCard, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const navLinks = [
  { href: '/learn', label: 'Learn' },
  { href: '/sandbox', label: 'Sandbox' },
  { href: '/lobby', label: 'Lobby' },
];

export function Header() {
  const pathname = usePathname();
  const { user, isGuest, isLoading, signOut } = useAuth();
  const { isPro } = useSubscription();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Lumina
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href || pathname?.startsWith(link.href + '/')
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Pro Badge or Upgrade CTA */}
            {!isLoading && (user || isGuest) && (
              isPro ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-purple-500/20 border border-[var(--color-primary)]/30">
                  <Crown className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-sm font-medium text-[var(--color-primary)]">Pro</span>
                </div>
              ) : (
                <Link
                  href="/pricing"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Upgrade
                </Link>
              )
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* User menu */}
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-[var(--color-card)] animate-pulse" />
            ) : user ? (
              <div className="relative hidden md:block" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--color-card)] transition-colors"
                >
                  <Avatar
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.full_name || 'User'}
                    size="md"
                  />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-xl py-2">
                    <div className="px-4 py-3 border-b border-[var(--color-border)]">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        {isPro && (
                          <span className="flex items-center gap-1 text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-0.5 rounded-full">
                            <Crown className="w-3 h-3" />
                            Pro
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-muted)] truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--color-card-hover)] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--color-card-hover)] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    {!isPro && (
                      <Link
                        href="/pricing"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-card-hover)] transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <CreditCard className="w-4 h-4" />
                        Upgrade to Pro
                      </Link>
                    )}

                    <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[var(--color-card-hover)] transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : isGuest ? (
              <Link href="/auth/login" className="hidden md:block">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login" className="hidden md:block">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-background)]">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href || pathname?.startsWith(link.href + '/')
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-[var(--color-border)] pt-4 mt-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
                  >
                    Settings
                  </Link>
                  {!isPro && (
                    <Link
                      href="/pricing"
                      className="block px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-surface)]"
                    >
                      Upgrade to Pro
                    </Link>
                  )}
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-[var(--color-surface)]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block px-4 py-3 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white text-center"
                >
                  Get Started
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
