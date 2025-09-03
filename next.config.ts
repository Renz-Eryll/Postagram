import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "your-image-host.com"], // Add your image domains
  },
};

export default nextConfig;
