/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/nasabah',
        destination: `${backendUrl}/api/nasabah`
      },
      {
        source: '/api/nasabah/:path*',
        destination: `${backendUrl}/api/nasabah/:path*`
      },
      {
        source: '/api/transactions',
        destination: `${backendUrl}/api/transactions`
      },
      {
        source: '/api/transactions/:path*',
        destination: `${backendUrl}/api/transactions/:path*`
      },
      {
        source: '/api/upload',
        destination: `${backendUrl}/api/upload`
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },
}

module.exports = nextConfig
