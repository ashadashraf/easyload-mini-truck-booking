"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CustomerBooking } from "@/lib/bookings/types";
import { DriverContact, phoneHref, whatsappHref } from "@/lib/driver";
import { formatDateTime, formatDistance, formatMoney, parseUaeDateTime, uaeDateTimeToIso, uaeInputDateTime } from "@/lib/format";

type FormState = {
  pickup_location: string;
  drop_location: string;
  pickup_time: string;
  drop_time: string;
  phone_number: string;
  expected_price: string;
  need_helper: boolean;
  customer_notes: string;
};

const initialForm: FormState = {
  pickup_location: "",
  drop_location: "",
  pickup_time: "",
  drop_time: "",
  phone_number: "",
  expected_price: "",
  need_helper: false,
  customer_notes: ""
};

function getMinDateTime() {
  return uaeInputDateTime(new Date());
}

export function BookingForm({
  driver,
  locationSuggestions,
  onBookingCreated
}: {
  driver: DriverContact;
  locationSuggestions: string[];
  onBookingCreated?: (booking: CustomerBooking, accessLink: string) => void;
}) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
  const [accessLink, setAccessLink] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<number | null>(null);
  const estimateRef = useRef<HTMLDivElement | null>(null);
  const minDateTime = useMemo(() => getMinDateTime(), []);
  const dropMinDateTime = useMemo(() => form.pickup_time || minDateTime, [form.pickup_time, minDateTime]);

  useEffect(() => {
    if (!form.pickup_time || !form.drop_time) {
      return;
    }

    const pickupDate = parseUaeDateTime(form.pickup_time);
    const dropDate = parseUaeDateTime(form.drop_time);

    if (pickupDate && dropDate && dropDate < pickupDate) {
      setForm((current) => ({ ...current, drop_time: "" }));
    }
  }, [form.pickup_time, form.drop_time]);

  const whatsappMessage = useMemo(() => {
    if (!booking) {
      return "";
    }

    return [
      `Hello ${driver.name}, I need a mini truck booking.`,
      `Pickup: ${booking.pickup_location}`,
      `Drop: ${booking.drop_location}`,
      `Pickup time: ${formatDateTime(booking.pickup_time)}`,
      booking.drop_time ? `Drop time: ${formatDateTime(booking.drop_time)}` : null,
      `Estimated price: ${formatMoney(booking.estimated_price)}`,
      booking.expected_price ? `Expected price: ${formatMoney(booking.expected_price)}` : null,
      booking.need_helper ? "Helper needed for loading/unloading: Yes" : null,
      booking.customer_notes ? `Customer notes: ${booking.customer_notes}` : null,
      accessLink ? `Private booking link: ${accessLink}` : null
    ]
      .filter(Boolean)
      .join("\n");
  }, [accessLink, booking, driver.name]);

  useEffect(() => {
    if (!booking || !estimateRef.current) {
      return;
    }

    estimateRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    estimateRef.current.focus({ preventScroll: true });
  }, [booking]);

  useEffect(() => {
    if (redirectTimer === null || redirectTimer <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setRedirectTimer((prev) => {
        if (prev === null || prev <= 1) {
          // Auto-redirect to WhatsApp
          window.open(whatsappHref(driver.phone, whatsappMessage), "_blank");
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [driver.phone, redirectTimer, whatsappMessage]);

  function cancelRedirect() {
    setRedirectTimer(null);
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const now = new Date();
      const pickupDate = parseUaeDateTime(form.pickup_time);

      // Allow pickup times that are not more than 5 minutes in the past (for timing differences)
      if (!pickupDate || pickupDate.getTime() < now.getTime() - 300000) {
        throw new Error("Pickup time must be set to a future date.");
      }

      if (form.drop_time) {
        const dropDate = parseUaeDateTime(form.drop_time);

        if (!dropDate) {
          throw new Error("Drop time must be a valid date.");
        }

        if (dropDate.getTime() < now.getTime() - 300000) {
          throw new Error("Drop time must be set to a future date.");
        }

        if (dropDate < pickupDate) {
          throw new Error("Drop time cannot be before pickup time.");
        }
      }

      const payload = {
        pickup_location: form.pickup_location,
        drop_location: form.drop_location,
        pickup_time: uaeDateTimeToIso(form.pickup_time),
        drop_time: form.drop_time ? uaeDateTimeToIso(form.drop_time) : null,
        phone_number: form.phone_number,
        expected_price: form.expected_price || null,
        need_helper: form.need_helper,
        customer_notes: form.customer_notes || null
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create booking.");
      }

      setBooking(data.booking);
      setAccessLink(data.access_link || "");
      onBookingCreated?.(data.booking, data.access_link || "");
      setForm(initialForm);
      // Start auto-redirect timer (5 seconds)
      setRedirectTimer(10);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create booking.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid">
      <section className="panel booking-panel">
        <div className="booking-steps" aria-label="Booking steps">
          <span className="active">Location</span>
          <span>Details</span>
          <span>Confirm</span>
        </div>
        <div className="section-title">
          <span className="eyebrow">Fast request</span>
          <h2>Book your 1 ton pickup</h2>
          <p className="muted">Enter the route, timing, and items. We will save the booking and show your estimate.</p>
        </div>
        <div className="vehicle-option-card" aria-label="Selected vehicle">
          <div className="vehicle-visual" aria-hidden="true">1T</div>
          <div>
            <strong>1 ton pickup</strong>
            <span>Best for shifting, delivery, furniture, boxes, and shop items.</span>
          </div>
          <span className="selected-pill">Selected</span>
        </div>
        <form onSubmit={submitBooking}>
          <datalist id="uae-location-suggestions">
            {locationSuggestions.map((location) => (
              <option key={location} value={location} />
            ))}
          </datalist>
          <div className="form-grid">
            <Field
              list="uae-location-suggestions"
              label="Pickup location"
              name="pickup_location"
              placeholder="Example: Dubai Marina"
              value={form.pickup_location}
              onChange={(value) => setForm({ ...form, pickup_location: value })}
            />
            <Field
              list="uae-location-suggestions"
              label="Drop-off location"
              name="drop_location"
              placeholder="Example: Sharjah Industrial Area"
              value={form.drop_location}
              onChange={(value) => setForm({ ...form, drop_location: value })}
            />
            <Field
              label="Pickup time"
              name="pickup_time"
              type="datetime-local"
              min={minDateTime}
              value={form.pickup_time}
              onChange={(value) => setForm({ ...form, pickup_time: value })}
            />
            <Field
              label="Drop-off time"
              name="drop_time"
              type="datetime-local"
              min={dropMinDateTime}
              required={false}
              value={form.drop_time}
              onChange={(value) => setForm({ ...form, drop_time: value })}
            />
            <Field
              label="Contact number"
              name="phone_number"
              placeholder="Example: 971501234567"
              type="tel"
              value={form.phone_number}
              onChange={(value) => setForm({ ...form, phone_number: value })}
            />
            <Field
              label="Expected price (optional)"
              name="expected_price"
              placeholder="AED"
              inputMode="decimal"
              required={false}
              value={form.expected_price}
              onChange={(value) => setForm({ ...form, expected_price: cleanMoneyInput(value) })}
            />
            <div className="field check-field">
              <label htmlFor="need_helper">
                <input
                  checked={form.need_helper}
                  id="need_helper"
                  name="need_helper"
                  onChange={(event) => setForm({ ...form, need_helper: event.target.checked })}
                  type="checkbox"
                />
                Need helper for loading/unloading
              </label>
              {form.need_helper ? (
                <p className="helper-note">
                  Helper charge is not included in the ride final price. It may vary based on hours and work intensity,
                  and the helper will confirm the amount.
                </p>
              ) : (
                <p className="helper-note">Turn this on if items are heavy, bulky, or need carrying upstairs.</p>
              )}
            </div>
            <TextArea
              label="Notes / items description"
              name="customer_notes"
              placeholder="Example: 2 sofas, boxes, washing machine, lift available"
              required={false}
              value={form.customer_notes}
              onChange={(value) => setForm({ ...form, customer_notes: value })}
            />
          </div>
          {error ? <p className="error">{error}</p> : null}
          <div className="actions">
            <button className="primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving booking..." : "Book Now"}
            </button>
            <p className="form-microcopy">Available across UAE. You will receive a private booking detail link after submitting.</p>
          </div>
        </form>
      </section>

      <aside className="panel estimate-panel" ref={estimateRef} tabIndex={-1}>
        <div className="section-title compact">
          <span className="eyebrow">Price view</span>
          <h3>Estimated price</h3>
        </div>
        {booking ? (
          <>
            <div className="estimate-amount">
              <span className="price-label">Estimated price</span>
              <span className="price">{formatMoney(booking.estimated_price)}</span>
            </div>
          <div className="estimate-box">
            <div className="confirmation-route">
              <div className="route-path">
                <span className="route-location">{booking.pickup_location}</span>
                <span className="route-arrow" aria-hidden="true">to</span>
                <span className="route-location">{booking.drop_location}</span>
              </div>
              <div className="route-times">
                <span>
                  <strong>Pickup time</strong>
                  {formatDateTime(booking.pickup_time)}
                </span>
                <span>
                  <strong>Drop time</strong>
                  {booking.drop_time ? formatDateTime(booking.drop_time) : "Not set"}
                </span>
              </div>
              {booking.expected_price ? (
                <span className="price-row">
                  <strong>Expected price</strong>
                  {formatMoney(booking.expected_price)}
                </span>
              ) : null}
              {booking.need_helper ? (
                <span className="price-row">
                  <strong>Helper</strong>
                  Needed for loading/unloading. Helper charge is not included in the ride final price.
                </span>
              ) : null}
            </div>
            <span className="muted">
              Distance: {formatDistance(booking.estimated_distance_km)}
              {booking.estimated_duration_minutes ? ` - Around ${booking.estimated_duration_minutes} min` : ""}
            </span>
            <span className={`status ${booking.status}`}>{booking.status}</span>
            <p className="muted">
              Request saved. Keep your private link to check status and final price later.
            </p>
            {accessLink ? (
              <div className="private-link">
                <strong>Private booking link</strong>
                <a href={accessLink}>{accessLink}</a>
              </div>
            ) : null}
            {redirectTimer !== null && (
              <div className="redirect-notice">
                <div className="redirect-header">
                  <span className="redirect-icon" aria-hidden="true">WA</span>
                  <span className="redirect-text">
                    Auto-redirecting to WhatsApp in <strong>{redirectTimer}</strong> seconds
                  </span>
                </div>
                <div className="redirect-message">
                  <strong>Message preview:</strong>
                  <pre className="message-preview">{whatsappMessage}</pre>
                </div>
                <button onClick={cancelRedirect} type="button" className="cancel-redirect">
                  Cancel auto-redirect
                </button>
              </div>
            )}
            <div className="actions">
              <a className="button primary" href={phoneHref(driver.phone)}>
                Call Driver
              </a>
              <a className="button" href={whatsappHref(driver.phone, whatsappMessage)} rel="noreferrer" target="_blank">
                WhatsApp Driver
              </a>
            </div>
          </div>
          </>
        ) : (
          <div className="estimate-box soft">
            <p className="muted">Your estimate will appear here after submission.</p>
            <div className="step-list">
              <span>1. Submit route</span>
              <span>2. Contact driver</span>
              <span>3. Agree final price</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder,
  list,
  min,
  inputMode
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  list?: string;
  min?: string;
  inputMode?: "decimal" | "numeric" | "tel" | "text";
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        inputMode={inputMode}
        list={list}
        min={type === "number" ? "0" : min}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        onWheel={type === "number" ? (event) => event.currentTarget.blur() : undefined}
        placeholder={placeholder}
        required={required}
        step={type === "number" ? "0.01" : undefined}
        type={type}
        value={value}
      />
    </div>
  );
}

function cleanMoneyInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole, ...decimals] = cleaned.split(".");
  return decimals.length ? `${whole}.${decimals.join("").slice(0, 2)}` : whole;
}

function TextArea({
  label,
  name,
  value,
  onChange,
  required = true,
  placeholder
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="field full-span">
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
    </div>
  );
}
