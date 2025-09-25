/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/auth/signin',
        destination: '/',
      },
      {
        source: '/api/generate-quote',
        destination: 'http://localhost:3000/generate-quote', // Proxy to Express backend
      },
    ]
  },
};

export default nextConfig;
