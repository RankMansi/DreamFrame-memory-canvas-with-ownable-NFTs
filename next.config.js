/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_REPLICATE_API_KEY_CHECK: process.env.REPLICATE_API_TOKEN ? 'CONFIGURED' : 'MISSING',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.lexica.art',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image-generation-api-vf66.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.replicate.delivery',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig; 