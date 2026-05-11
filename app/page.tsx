import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { BookingForm } from "@/components/BookingForm";
import { driverConfig, locationSuggestions } from "@/lib/config";

export default function HomePage() {
  return (
    <main className="shell">
      <div className="container">
        <AppHeader />
        <BookingForm driver={{ name: driverConfig.name, phone: driverConfig.phone }} locationSuggestions={locationSuggestions} />
        <AppFooter />
      </div>
    </main>
  );
}
