"use client";

import { useEffect, useState } from "react";
import { Booking } from "@/lib/bookings/types";
import { DRIVER_PHONE, phoneHref, whatsappHref } from "@/lib/driver";
import { formatDateTime, formatDistance, formatMoney } from "@/lib/format";

export function CustomerBookingView({ token }: { token: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      try {
        const response = await fetch(`/api/bookings/token/${token}`, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load booking.");
        }

        setBooking(data.booking);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not load booking.");
      } finally {
        setIsLoading(false);
      }
    }

    loadBooking();
  }, [token]);

  if (isLoading) {
    return <section className="panel"><p className="muted">Loading booking...</p></section>;
  }

  if (error || !booking) {
    return <section className="panel"><p className="error">{error || "Booking not found."}</p></section>;
  }

  const message = [
    "Hello, I am checking my mini truck booking.",
    `Pickup: ${booking.pickup_location}`,
    `Drop: ${booking.drop_location}`,
    `Pickup time: ${formatDateTime(booking.pickup_time)}`,
    `Status: ${booking.status}`
  ].join("\n");

  return (
    <section className="panel">
      <div className="section-title">
        <span className="eyebrow">Booking status</span>
        <h2>Your mini truck booking</h2>
        <p className="muted">Use this private link to check status and agreed price.</p>
      </div>

      <div className="booking-status-card">
        <div className="status-header">
          <span className={`status ${booking.status}`}>{booking.status}</span>
          <div className="booking-id">
            <span className="muted">Booking ID: {booking.id}</span>
          </div>
        </div>

        <div className="route-display">
          <div className="route-path">
            <span className="route-location">{booking.pickup_location}</span>
            <span className="route-arrow" aria-hidden="true">→</span>
            <span className="route-location">{booking.drop_location}</span>
          </div>
          <div className="route-details">
            <div className="route-times">
              <span>
                <strong>Pickup time </strong>
                {formatDateTime(booking.pickup_time)}
              </span>
              {booking.drop_time && (
                <span>
                  <strong>Drop time</strong>
                  {formatDateTime(booking.drop_time)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pricing-grid">
          <div className="price-item">
            <span className="price-label">Estimated</span>
            <span className="price-value">{formatMoney(booking.estimated_price)}</span>
          </div>
          {booking.expected_price && (
            <div className="price-item">
              <span className="price-label">Expected</span>
              <span className="price-value">{formatMoney(booking.expected_price)}</span>
            </div>
          )}
          {booking.final_price && (
            <div className="price-item final">
              <span className="price-label">Final Price</span>
              <span className="price-value">{formatMoney(booking.final_price)}</span>
            </div>
          )}
        </div>

        <div className="booking-meta">
          <span className="meta-item">
            Distance: {formatDistance(booking.estimated_distance_km)}
            {booking.estimated_duration_minutes && ` · ~${booking.estimated_duration_minutes} min`}
          </span>
          <span className="meta-item">
            Created: {formatDateTime(booking.created_at)}
          </span>
        </div>

        <div className="contact-actions">
          <div className="action-buttons">
            <a className="button primary" href={phoneHref(DRIVER_PHONE)}>
              📞 Call Driver
            </a>
            <a className="button" href={whatsappHref(DRIVER_PHONE, message)} rel="noreferrer" target="_blank">
              💬 WhatsApp Driver
            </a>
          </div>
          <div className="driver-info">
            <span className="muted">Driver: {booking.phone_number}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
