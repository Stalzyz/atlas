/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: "../../",
  experimental: {},
  webpack: (config) => config,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Use unoptimized to bypass Next.js image proxy — images are served directly
    // from the public API domain (atlasapi.grekam.in). This avoids "private IP" errors
    // when Next.js tries to proxy process.env.NEXT_PUBLIC_APP_URL:6005 images through itself.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
