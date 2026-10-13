/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  // GitHub Pages serves this project under /psycho, not the domain root.
  basePath: isProduction ? "/psycho" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
