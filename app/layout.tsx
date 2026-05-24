import type { Metadata } from "next";
import type { Viewport } from "next";
import Script from "next/script";
import { PwaRegister } from "@/components/PwaRegister";
import { buildBaseMetadata } from "@/lib/seo/metadata";
import "./globals.css";

export const metadata: Metadata = {
  ...buildBaseMetadata(),
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

const themeInitScript = `
(() => {
  try {
    const saved = window.localStorage.getItem("pickupdxb-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = saved === "dark" || saved === "light" ? saved : preferred;
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
          id="theme-init"
          strategy="beforeInteractive"
        />
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
