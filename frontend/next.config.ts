import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // Backend sunucunuzun domain'i
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000', // Backend portunuz
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;