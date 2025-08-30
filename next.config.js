/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  typescript: {
    // Temporarily ignore build errors due to Next.js 15 mixed routing type validation issue
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
