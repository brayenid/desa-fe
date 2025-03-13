import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'mamahakulu-strapi.knkdesa.my.id',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cms.memahakulu.id',
        pathname: '/**'
      }
    ]
  },
  output: 'standalone'
}

export default nextConfig
