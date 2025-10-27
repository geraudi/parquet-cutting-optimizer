/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],

  // Enable experimental features for better performance
  experimental: {
    // Enable optimized package imports for better tree shaking
    optimizePackageImports: [
      "lucide-react",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
    ],
  },

  // Image optimization settings for Next.js 16
  images: {
    // Enable modern image formats
    formats: ["image/webp", "image/avif"],

    // Optimize for better performance with SVG files
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
