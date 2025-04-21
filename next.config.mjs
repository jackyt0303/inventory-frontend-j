/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', 'http://192.168.13.150','192.168.13.150'],
}


export default nextConfig
