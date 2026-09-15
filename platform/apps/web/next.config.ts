import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@gefi/schemas"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
