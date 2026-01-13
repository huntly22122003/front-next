import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites(){
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://luana-unpenetrative-fumiko.ngrok-free.dev";
  return [
    {
      source: "/backend/:path*",
      destination: `${apiUrl}/:path*`,
    },
    ];
  },
};

export default nextConfig;
