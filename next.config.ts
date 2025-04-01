import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // swcMinify: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        dns: false,
        net: false,
        tls: false
      };
    }

    return config;
  },
  // api: {
  //   bodyParser: {
  //     sizeLimit: "3mb",  // Limit request body size to 3MB
  //   },
  // },
};

export default nextConfig;
