import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // Transpile Three.js packages for better compatibility
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    '@react-three/rapier',
  ],

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Enable XSS protection (legacy browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy (disable unnecessary features)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self, inline (needed for Next.js), eval (needed for Three.js/Sandpack)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              // Styles: self, inline (needed for Tailwind/CSS-in-JS)
              "style-src 'self' 'unsafe-inline'",
              // Images: self, data URIs, Supabase, GitHub, Google
              "img-src 'self' data: blob: https://*.supabase.co https://avatars.githubusercontent.com https://lh3.googleusercontent.com",
              // Fonts: self, data URIs
              "font-src 'self' data:",
              // Connect: self, Supabase, Stripe
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://codesandbox.io https://*.codesandbox.io",
              // Frames: Stripe, Sandpack
              "frame-src https://js.stripe.com https://hooks.stripe.com https://*.codesandbox.io https://codesandbox.io",
              // Workers: self, blob (needed for Three.js)
              "worker-src 'self' blob:",
              // Object: none
              "object-src 'none'",
              // Base URI: self
              "base-uri 'self'",
              // Form action: self
              "form-action 'self'",
              // Frame ancestors: none (prevent embedding)
              "frame-ancestors 'none'",
            ].join('; '),
          },
          // Strict Transport Security (HTTPS only)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
