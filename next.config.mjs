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
  }
};

export default nextConfig;
