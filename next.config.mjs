/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to support dynamic admin routes
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['njopysnuxuymxxpohfxs.supabase.co'],
  },
  // Skip building admin routes for static export
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
