/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'localhost',
      'cms.truzz.online',
      'example.com',
      'res.cloudinary.com'
    ],
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_IMG_URL: process.env.NEXT_PUBLIC_IMG_URL,
  },
}

module.exports = nextConfig 