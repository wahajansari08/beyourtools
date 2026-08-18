import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BeYourTools",
    short_name: "BeYourTools",
    description: "Free online tools for developers - JSON, Image Converter, PDF tools and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0d13",
    theme_color: "#f2b84b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
