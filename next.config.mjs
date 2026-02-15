/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/posts/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig