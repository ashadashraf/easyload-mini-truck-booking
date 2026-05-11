import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { CustomerBookingView } from "@/components/CustomerBookingView";
import { driverConfig } from "@/lib/config";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function CustomerBookingPage({ params }: Props) {
  const { token } = await params;

  return (
    <main className="shell">
      <div className="container">
        <AppHeader />
        <CustomerBookingView driver={{ name: driverConfig.name, phone: driverConfig.phone }} token={token} />
        <AppFooter />
      </div>
    </main>
  );
}
