/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  allowedDevOrigins: ['http://192.168.0.110'],

  experimental: {
    turbo: true,
  },
};

module.exports = nextConfig;
