import { AppFooter } from "@/components/AppFooter";
import { DriverAuthGate } from "@/components/DriverAuthGate";
import { driverConfig } from "@/lib/config";

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
