import type { NextConfig } from "next";
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  manifest: '/assets/site.webmanifest',
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/logout',
        destination: '/',
        permanent: false,
      },
    ];
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  reactStrictMode: true,
  images: {
    domains: ['*.lsanalab.xyz', 'localhost'],
  },
};

export default withPWA(nextConfig);
