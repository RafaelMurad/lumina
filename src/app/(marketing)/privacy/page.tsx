import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Lumina',
  description: 'Privacy Policy for Lumina learning platform',
};

export default function PrivacyPage() {
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

        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-[var(--color-muted)] mb-8">Last updated: December 2024</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Lumina (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to
              protecting your personal data. This Privacy Policy explains how we collect, use,
              and protect your information when you use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-4">
              We collect the following types of information:
            </p>

            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2 mb-4">
              <li>Email address</li>
              <li>Name (if provided via OAuth)</li>
              <li>Profile picture (if provided via OAuth)</li>
              <li>Authentication provider information</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">Usage Information</h3>
            <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2 mb-4">
              <li>Lesson progress and completion data</li>
              <li>Achievement and XP data</li>
              <li>Code created in the sandbox</li>
              <li>Time spent on lessons</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">Technical Information</h3>
            <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2">
              <li>Device type and browser information</li>
              <li>IP address</li>
              <li>GPU capabilities (for rendering optimization)</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2">
              <li>Provide and improve the Service</li>
              <li>Track your learning progress and achievements</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important updates and notifications</li>
              <li>Analyze usage patterns to improve content</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-4">
              We do not sell your personal data. We may share information with:
            </p>
            <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2">
              <li>
                <strong>Service Providers:</strong> Third parties that help us operate the
                Service (e.g., payment processors, hosting providers)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our
                rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition,
                or sale of assets
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2">
              <li>
                <strong>Supabase:</strong> Authentication and database
              </li>
              <li>
                <strong>Stripe:</strong> Payment processing
              </li>
              <li>
                <strong>Vercel:</strong> Hosting and analytics
              </li>
            </ul>
            <p className="text-[var(--color-muted)] leading-relaxed mt-4">
              Each service has its own privacy policy governing their use of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We implement industry-standard security measures to protect your data, including
              encryption in transit and at rest, secure authentication, and regular security
              audits. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide
              the Service. You can request deletion of your data at any time through your
              account settings or by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Export your data in a portable format</li>
              <li>Object to certain processing</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="text-[var(--color-muted)] leading-relaxed mt-4">
              To exercise these rights, visit your account settings or contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Cookies</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We use essential cookies for authentication and preferences. We do not use
              third-party advertising cookies. You can manage cookie preferences in your
              browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              The Service is not intended for children under 13. We do not knowingly collect
              personal information from children under 13. If you believe we have collected
              such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. International Transfers</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Your data may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Policy</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of
              significant changes via email or through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              For questions about this Privacy Policy or your data, contact us at{' '}
              <a href="mailto:privacy@lumina.dev" className="text-[var(--color-primary)] hover:underline">
                privacy@lumina.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
