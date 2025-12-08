'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const CONSENT_KEY = 'lumina_cookie_consent';

interface ConsentState {
  necessary: boolean;  // Always true - required for functionality
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: '',
  });

  useEffect(() => {
    // Check if consent has been given
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    if (!storedConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (newConsent: Partial<ConsentState>) => {
    const finalConsent: ConsentState = {
      necessary: true,
      analytics: newConsent.analytics ?? consent.analytics,
      marketing: newConsent.marketing ?? consent.marketing,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(finalConsent));
    setShowBanner(false);

    // Emit event for analytics systems to pick up
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: finalConsent }));
    }
  };

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
  };

  const acceptNecessary = () => {
    saveConsent({ analytics: false, marketing: false });
  };

  const savePreferences = () => {
    saveConsent(consent);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[var(--color-background)]/95 backdrop-blur-xl border-t border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto">
        {showDetails ? (
          // Detailed preferences view
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                Cookie Preferences
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-[var(--color-surface)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Necessary cookies */}
              <label className="flex items-start gap-3 p-3 bg-[var(--color-surface)] rounded-lg">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 w-4 h-4 rounded border-[var(--color-border)]"
                />
                <div className="flex-1">
                  <div className="font-medium">Necessary Cookies</div>
                  <p className="text-sm text-[var(--color-muted)]">
                    Required for authentication, security, and basic functionality. Cannot be disabled.
                  </p>
                </div>
              </label>

              {/* Analytics cookies */}
              <label className="flex items-start gap-3 p-3 bg-[var(--color-surface)] rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) => setConsent(c => ({ ...c, analytics: e.target.checked }))}
                  className="mt-1 w-4 h-4 rounded border-[var(--color-border)]"
                />
                <div className="flex-1">
                  <div className="font-medium">Analytics Cookies</div>
                  <p className="text-sm text-[var(--color-muted)]">
                    Help us understand how you use Lumina to improve the learning experience.
                  </p>
                </div>
              </label>

              {/* Marketing cookies */}
              <label className="flex items-start gap-3 p-3 bg-[var(--color-surface)] rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent.marketing}
                  onChange={(e) => setConsent(c => ({ ...c, marketing: e.target.checked }))}
                  className="mt-1 w-4 h-4 rounded border-[var(--color-border)]"
                />
                <div className="flex-1">
                  <div className="font-medium">Marketing Cookies</div>
                  <p className="text-sm text-[var(--color-muted)]">
                    Allow personalized content and relevant advertisements.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex flex-wrap gap-3 justify-end pt-2">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                Privacy Policy
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={savePreferences}
                className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        ) : (
          // Simple banner view
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm">
                We use cookies to enhance your learning experience and analyze usage.
                By continuing, you agree to our{' '}
                <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
              >
                Customize
              </button>
              <button
                onClick={acceptNecessary}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
              >
                Necessary Only
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook to check consent status
export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      setConsent(JSON.parse(stored));
    }

    const handleUpdate = (e: CustomEvent<ConsentState>) => {
      setConsent(e.detail);
    };

    window.addEventListener('cookieConsentUpdated', handleUpdate as EventListener);
    return () => window.removeEventListener('cookieConsentUpdated', handleUpdate as EventListener);
  }, []);

  return {
    hasConsent: consent !== null,
    analytics: consent?.analytics ?? false,
    marketing: consent?.marketing ?? false,
  };
}
