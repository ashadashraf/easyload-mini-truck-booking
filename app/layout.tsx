import type { Metadata } from "next";
import type { Viewport } from "next";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "PickUpDXB Mini Truck Booking",
  description: "Simple logistics booking and driver dashboard for UAE mini truck jobs.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PickUp DXB"
  },
  icons: {
    icon: [{ url: "/PickUpDxbLogo.png", type: "image/png" }],
    apple: [{ url: "/PickUpDxbLogo.png", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
