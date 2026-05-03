import { driverConfig } from "@/lib/config";
import { phoneHref, whatsappHref } from "@/lib/driver";

export function AppFooter() {
  const message = `Hello ${driverConfig.name}, I want to ask about mini truck availability.`;

  return (
    <footer className="footer">
      <div>
        <strong>{driverConfig.name}</strong>
        <p>{driverConfig.vehicle} · {driverConfig.location}</p>
        <p>{driverConfig.hours}</p>
        <p>{driverConfig.whatsappNote}</p>
      </div>
      <div className="footer-actions">
        <a className="button primary" href={phoneHref(driverConfig.phone)}>
          Call
        </a>
        <a className="button" href={whatsappHref(driverConfig.phone, message)} rel="noreferrer" target="_blank">
          WhatsApp
        </a>
      </div>
    </footer>
  );
}
