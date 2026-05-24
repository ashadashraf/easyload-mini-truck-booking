import type { Metadata } from "next";
import { AppFooter } from "@/components/AppFooter";
import { DriverAuthGate } from "@/components/DriverAuthGate";
import { driverConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Driver Dashboard",
  robots: {
    index: false,
    follow: false
  }
};

export default function DriverPage() {
  return (
    <main className="shell">
      <div className="container">
        <DriverAuthGate driver={{ name: driverConfig.name, phone: driverConfig.phone }} />
        <AppFooter />
      </div>
    </main>
  );
}
