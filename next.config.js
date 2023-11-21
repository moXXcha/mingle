/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-58417be6f26148f38a912e907996fd3a.r2.dev',
      },
    ],
  },
};

module.exports = nextConfig;
