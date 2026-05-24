import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PickUp DXB",
    short_name: "PickUp DXB",
    description: "Driver-first mini truck booking dashboard and customer booking app for UAE transport jobs.",
    start_url: "/driver",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#2563eb",
    orientation: "portrait",
    categories: ["business", "productivity", "travel"],
    icons: [
      {
        src: "/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/pwa-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: "/PickUpDxbLogo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ],
    shortcuts: [
      {
        name: "Driver Dashboard",
        short_name: "Driver",
        description: "Open the PickUp DXB driver dashboard.",
        url: "/driver",
        icons: [{ src: "/pwa-icon.svg", sizes: "any", type: "image/svg+xml" }]
      },
      {
        name: "Book Pickup",
        short_name: "Book",
        description: "Create a customer mini truck booking.",
        url: "/",
        icons: [{ src: "/pwa-icon.svg", sizes: "any", type: "image/svg+xml" }]
      }
    ]
  };
}
