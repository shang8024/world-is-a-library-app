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
  }
};

export default nextConfig;
