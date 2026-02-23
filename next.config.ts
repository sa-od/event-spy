import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/sdk.js',
        destination: '/api/sdk',
      },
    ];
  },
};

export default nextConfig;
