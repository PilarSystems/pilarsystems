import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  turbopack: {
    resolveAlias: {
      '@': './src',
      '@public': './public',
    },
  },
};

export default nextConfig;
