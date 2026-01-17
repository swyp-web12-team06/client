import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // source: a pattern to match against incoming requests
        source: "/api/:path*",
        // destination: the URL to proxy the request to
        destination: "http://localhost:8080/:path*",
      },
    ];
  },
};

export default nextConfig;
