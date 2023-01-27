/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['nft-cdn.alchemy.com', 'localhost'], // <== Domain name
  },
};

module.exports = nextConfig;
