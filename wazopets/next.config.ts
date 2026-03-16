/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "https",
        hostname: "rugged-dachshund-671.convex.cloud",
        pathname: "/api/storage/**",
      },

      {
        protocol: "https",
        hostname: "formal-cheetah-262.convex.cloud",
        pathname: "/api/storage/**",
      },
    ],
  },

};

export default nextConfig;
