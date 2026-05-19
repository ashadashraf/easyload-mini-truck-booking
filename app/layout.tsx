import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PickUpDXB Mini Truck Booking",
  description: "Simple logistics booking and driver dashboard for UAE mini truck jobs."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
