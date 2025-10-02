import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production
  reactStrictMode: true,
  poweredByHeader: false,
  // produce a standalone build (useful for containerized deployments)
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: [],
    remotePatterns: [
      // allow Supabase storage public URLs (replace with your supabase project domain if needed)
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Enable compression
  compress: true,
  
  // Configure headers for security
  async headers() {
    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      // Opt-in to modern browser features and protection
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
      { key: 'Permissions-Policy', value: "geolocation=(), microphone=(), camera=()" },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      // Content Security Policy (adjust for your external origins as needed)
      {
        key: 'Content-Security-Policy',
        value:
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; frame-ancestors 'none'; base-uri 'self';",
      },
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
