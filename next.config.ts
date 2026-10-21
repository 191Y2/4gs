import type { NextConfig } from "next";

// 100% static export for GitHub Pages (username.github.io or /repo subpath).
// For a project site (username.github.io/repo-name) build with:
//   NEXT_PUBLIC_BASE_PATH=/repo-name npm run build
// Output lands in ./out — upload that directory to GitHub Pages.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
