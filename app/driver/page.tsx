import { AppFooter } from "@/components/AppFooter";
import { DriverAuthGate } from "@/components/DriverAuthGate";

export default function DriverPage() {
  return (
    <main className="shell">
      <div className="container">
        <DriverAuthGate />
        <AppFooter />
      </div>
    </main>
  );
}
