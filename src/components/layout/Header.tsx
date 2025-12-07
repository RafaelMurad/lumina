'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LogOut, User, Settings, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const { user, isLoading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/learn"
              className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Learn
            </Link>
            <Link
              href="/sandbox"
              className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Sandbox
            </Link>
            <Link
              href="/docs"
              className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Docs
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-[var(--color-card)] animate-pulse" />
            ) : user ? (
              <div className="relative" ref={menuRef}>
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
                  <div className="absolute right-0 mt-2 w-56 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-xl py-2">
                    <div className="px-4 py-2 border-b border-[var(--color-border)]">
                      <p className="font-medium truncate">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-[var(--color-muted)] truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-card-hover)] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-card-hover)] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-[var(--color-card-hover)] transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
