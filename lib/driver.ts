import { driverConfig } from "./config";

export const DRIVER_NAME = driverConfig.name;
export const DRIVER_PHONE = driverConfig.phone;

export function phoneHref(phoneNumber: string) {
  return `tel:+${phoneNumber.replace(/\D/g, "")}`;
}

export function whatsappHref(phoneNumber: string, message: string) {
  const normalized = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
