import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output:'standalone',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["*.world-is-a-library.com","world-is-a-library.com","*.localhost"],
  outputFileTracingIncludes: {
    "/*": ["./src/components/**/*"],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://www.world-is-a-library.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};

export default nextConfig;
