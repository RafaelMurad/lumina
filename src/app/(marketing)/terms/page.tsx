import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - Lumina',
  description: 'Terms of Service for Lumina learning platform',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-[var(--color-muted)] mb-8">Last updated: December 2024</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              By accessing and using Lumina (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not
              use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Lumina is an interactive learning platform for WebGL, Three.js, and React Three
              Fiber. The Service provides educational content, code sandboxes, and gamified
              learning experiences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-4">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Subscriptions and Payments</h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-4">
              Some features require a paid subscription. By subscribing, you agree that:
            </p>
            <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2">
              <li>Subscriptions are billed in advance on a recurring basis</li>
              <li>You authorize us to charge your payment method automatically</li>
              <li>Prices are subject to change with 30 days notice</li>
              <li>Refunds are available within 14 days of initial purchase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Cancellation</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              You may cancel your subscription at any time through your account settings or by
              contacting support. Cancellation takes effect at the end of your current billing
              period. You will retain access to paid features until then.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              All content, including but not limited to lessons, code examples, graphics, and
              trademarks, is owned by Lumina or its licensors. You may use the content for
              personal, non-commercial learning purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. User Content</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              You retain ownership of any code or content you create using the Service. By
              sharing content publicly, you grant us a license to display and distribute it
              within the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Prohibited Uses</h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2">
              <li>Share your account credentials with others</li>
              <li>Redistribute or resell our content</li>
              <li>Attempt to bypass payment or access restrictions</li>
              <li>Use the Service for any illegal purpose</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              The Service is provided &quot;as is&quot; without warranties of any kind. We do not
              guarantee that the Service will be uninterrupted, error-free, or meet your
              specific requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              To the maximum extent permitted by law, Lumina shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use
              of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We may update these Terms from time to time. We will notify you of significant
              changes via email or through the Service. Continued use after changes constitutes
              acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@lumina.dev" className="text-[var(--color-primary)] hover:underline">
                legal@lumina.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
