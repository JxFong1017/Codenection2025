/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    // This will prevent the ESLint error from stopping the build.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
