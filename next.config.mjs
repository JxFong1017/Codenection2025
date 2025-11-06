/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: ["3000-firebase-codenection2025git-1758078224819.cluster-ancjwrkgr5dvux4qug5rbzyc2y.cloudworkstations.dev"],
  },
}

export default nextConfig
