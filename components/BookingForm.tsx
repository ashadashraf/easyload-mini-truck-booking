"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Booking } from "@/lib/bookings/types";
import { DRIVER_NAME, DRIVER_PHONE, phoneHref, whatsappHref } from "@/lib/driver";
import { formatDateTime, formatDistance, formatMoney, localInputDateTime } from "@/lib/format";

type FormState = {
  pickup_location: string;
  drop_location: string;
  pickup_time: string;
  drop_time: string;
  phone_number: string;
  expected_price: string;
};

const initialForm: FormState = {
  pickup_location: "",
  drop_location: "",
  pickup_time: "",
  drop_time: "",
  phone_number: "",
  expected_price: ""
};

function getMinDateTime() {
  return localInputDateTime(new Date().toISOString());
}

export function BookingForm({ locationSuggestions }: { locationSuggestions: string[] }) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [booking, setBooking] = useState<Booking | null>(null);
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

    const pickupDate = new Date(form.pickup_time);
    const dropDate = new Date(form.drop_time);

    if (!Number.isNaN(pickupDate.getTime()) && !Number.isNaN(dropDate.getTime()) && dropDate < pickupDate) {
      setForm((current) => ({ ...current, drop_time: "" }));
    }
  }, [form.pickup_time, form.drop_time]);

  const whatsappMessage = useMemo(() => {
    if (!booking) {
      return "";
    }

    return [
      `Hello ${DRIVER_NAME}, I need a mini truck booking.`,
      `Pickup: ${booking.pickup_location}`,
      `Drop: ${booking.drop_location}`,
      `Pickup time: ${formatDateTime(booking.pickup_time)}`,
      `Estimated price: ${formatMoney(booking.estimated_price)}`,
      booking.expected_price ? `Expected price: ${formatMoney(booking.expected_price)}` : null,
      accessLink ? `Private booking link: ${accessLink}` : null
    ]
      .filter(Boolean)
      .join("\n");
  }, [accessLink, booking]);

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
          window.open(whatsappHref(DRIVER_PHONE, whatsappMessage), "_blank");
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectTimer, whatsappMessage]);

  function cancelRedirect() {
    setRedirectTimer(null);
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const now = new Date();
    const pickupDate = new Date(form.pickup_time);

    // Allow pickup times that are not more than 5 minutes in the past (for timing differences)
    if (!form.pickup_time || Number.isNaN(pickupDate.getTime()) || pickupDate.getTime() < now.getTime() - 300000) {
      throw new Error("Pickup time must be set to a future date.");
    }

    if (form.drop_time) {
      const dropDate = new Date(form.drop_time);

      if (Number.isNaN(dropDate.getTime())) {
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
      pickup_time: form.pickup_time,
      drop_time: form.drop_time || null,
      phone_number: form.phone_number,
      expected_price: form.expected_price || null
    };

    try {
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
      <section className="panel">
        <div className="section-title">
          <span className="eyebrow">Fast request</span>
          <h2>Book a mini truck</h2>
          <p className="muted">Share the route and preferred time. You will get an estimate, then confirm directly with the driver.</p>
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
              label="Drop location"
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
              label="Drop time"
              name="drop_time"
              type="datetime-local"
              min={dropMinDateTime}
              required={false}
              value={form.drop_time}
              onChange={(value) => setForm({ ...form, drop_time: value })}
            />
            <Field
              label="Phone number"
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
              type="number"
              required={false}
              value={form.expected_price}
              onChange={(value) => setForm({ ...form, expected_price: value })}
            />
          </div>
          {error ? <p className="error">{error}</p> : null}
          <div className="actions">
            <button className="primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Submit booking"}
            </button>
          </div>
        </form>
      </section>

      <aside className="panel" ref={estimateRef} tabIndex={-1}>
        <div className="section-title compact">
          <span className="eyebrow">Price view</span>
          <h3>Estimated fare</h3>
        </div>
        {booking ? (
          <div className="estimate-box">
            <span className="price">{formatMoney(booking.estimated_price)}</span>
            <div className="confirmation-route">
              <div className="route-path">
                <span className="route-location">{booking.pickup_location}</span>
                <span className="route-arrow" aria-hidden="true">→</span>
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
            </div>
            <span className="muted">
              Distance: {formatDistance(booking.estimated_distance_km)}
              {booking.estimated_duration_minutes ? ` · Around ${booking.estimated_duration_minutes} min` : ""}
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
                  <span className="redirect-icon">📱</span>
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
              <a className="button primary" href={phoneHref(DRIVER_PHONE)}>
                Call Driver
              </a>
              <a className="button" href={whatsappHref(DRIVER_PHONE, whatsappMessage)} rel="noreferrer" target="_blank">
                WhatsApp Driver
              </a>
            </div>
          </div>
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
  min
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
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        list={list}
        min={type === "number" ? "0" : min}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        step={type === "number" ? "0.01" : undefined}
        type={type}
        value={value}
      />
    </div>
  );
}
