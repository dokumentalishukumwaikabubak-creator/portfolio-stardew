/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['njopysnuxuymxxpohfxs.supabase.co'],
  },
  // Skip building admin routes for static export
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
};

export default nextConfig;
