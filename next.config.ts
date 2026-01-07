import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mode statique pour la production
  // Note: Les API routes ne fonctionnent pas avec output: 'export'
  // Pour le rebuild, on utilisera Vercel Deploy Hooks directement
  output: 'export',
  outputFileTracingRoot: process.cwd(),
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      // ⚠️ Mettez à jour avec votre nouveau domaine Supabase (ex: xxxxxxxxxxxxx.supabase.co)
      { protocol: "https", hostname: "*.supabase.co" } // Pattern générique pour tous les projets Supabase
    ]
  },
  trailingSlash: true,
};

export default nextConfig;





