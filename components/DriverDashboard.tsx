"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Booking, BookingStatus } from "@/lib/bookings/types";
import { getStatusOptions, isBackwardStatusChange, STATUS_LABELS } from "@/lib/bookings/status-flow";
import { DriverContact, phoneHref, whatsappHref } from "@/lib/driver";
import { formatDateTime, formatDistance, formatMoney } from "@/lib/format";

type Draft = {
  final_price: string;
  helper_charge: string;
  driver_notes: string;
};

export function DriverDashboard({
  driver,
  driverAccessToken
}: {
  driver: DriverContact;
  driverAccessToken: string;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [error, setError] = useState("");
  const [recordErrors, setRecordErrors] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<"en" | "ml">("en");
  const finalPriceRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const copy = useMemo(() => {
    const translations = {
      en: {
        driverWorkspace: "Driver workspace",
        driverDashboard: "Driver dashboard",
        driverSubtitle: "Contact the customer, save the agreed price, then update the booking status.",
        refreshLabel: "Refresh bookings",
        loading: "Loading bookings...",
        noBookings: "No booking requests yet.",
        searchLabel: "Search bookings",
        searchPlaceholder: "Booking ID or customer mobile number",
        noResults: "No bookings match your search.",
        pickupMeta: "Pickup:",
        dropMeta: "Drop:",
        customerMeta: "Customer:",
        estimatedPrice: "Estimated",
        expectedPrice: "Expected",
        finalPrice: "Final",
        helperNeeded: "Helper needed",
        helperCharge: "Helper charge",
        helperChargeHint: "Not included in ride final price. Confirm after checking with the helper.",
        distanceLabel: "Distance",
        estimateSource: "Estimate source",
        finalPriceLabel: "Final price",
        customerNotesLabel: "Customer notes",
        driverNotesLabel: "Driver notes",
        notSetLabel: "Not set",
        call: "Call",
        whatsapp: "WhatsApp",
        saveNotes: "Save price/notes",
        reject: "Reject",
        deleteBooking: "Delete",
        deletingBooking: "Deleting...",
        deleteConfirm: "Delete booking {id}? This will hide it from the driver dashboard but keep it safely archived.",
        setStatusPrefix: "Set",
        languageLabel: "Choose language",
        english: "English",
        malayalam: "മലയാളം"
      },
      ml: {
        driverWorkspace: "ഡ്രൈവർ പ്രവർത്തിനിടം",
        driverDashboard: "ഡ്രൈവർ ഡാഷ്ബോർഡ്",
        driverSubtitle: "ഉപഭോക്താവിനെ ബന്ധപ്പെടുക, സജ്ജീകരിച്ച വില സേവ് ചെയ്യുക, ശേഷം ബുക്കിംഗ് നില അപ്‌ഡേറ്റ് ചെയ്യുക.",
        refreshLabel: "ബുക്കിങ്ങുകൾ പുനഃലോഡ് ചെയ്യുക",
        loading: "ബുക്കിങ്ങുകൾ ലോഡ് ചെയ്യുന്നു...",
        noBookings: "ഇപ്പോൾ ബുക്കിംഗ് അഭ്യർത്ഥനകൾ ഇല്ല.",
        searchLabel: "ബുക്കിങ്ങുകൾ തിരയുക",
        searchPlaceholder: "ബുക്കിംഗ് ഐഡി അല്ലെങ്കിൽ ഉപഭോക്താവിന്റെ മൊബൈൽ നമ്പർ",
        noResults: "നിങ്ങളുടെ തിരച്ചിലിനുത്തരം ബുക്കിങ്ങുകൾ ലഭിച്ചില്ല.",
        pickupMeta: "പിക്കപ്പ്:",
        dropMeta: "ഡ്രോപ്പ്:",
        customerMeta: "ഉപഭോക്താവ്:",
        estimatedPrice: "അനുമാനിച്ച",
        expectedPrice: "പ്രതീക്ഷിച്ച",
        finalPrice: "അവസാന",
        helperNeeded: "Helper needed",
        helperCharge: "Helper charge",
        helperChargeHint: "Not included in ride final price. Confirm after checking with the helper.",
        distanceLabel: "ദൂരം",
        estimateSource: "അനുമാന ഉറവ",
        finalPriceLabel: "അവസാന വില",
        customerNotesLabel: "Customer notes",
        driverNotesLabel: "Driver notes",
        notSetLabel: "സജ്ജമാക്കിയിട്ടില്ല",
        call: "ഫോൺ ചെയ്യുക",
        whatsapp: "വാട്ട്‌സ്ആപ്പ്",
        saveNotes: "വില/കുറിപ്പുകൾ സേവ് ചെയ്യുക",
        reject: "നിരസിക്കുക",
        deleteBooking: "Delete",
        deletingBooking: "Deleting...",
        deleteConfirm: "Delete booking {id}? This will hide it from the driver dashboard but keep it safely archived.",
        setStatusPrefix: "സജ്ജമാക്കുക",
        languageLabel: "ഭാഷ തിരഞ്ഞെടുക്കുക",
        english: "English",
        malayalam: "മലയാളം"
      }
    };

    return translations[language];
  }, [language]);

  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return bookings;
    }

    const normalizedDigits = normalizedQuery.replace(/\D/g, "");
    return bookings.filter((booking) => {
      const idMatch = booking.id.toString().includes(normalizedQuery) || booking.id.toString().includes(normalizedDigits);
      const phone = booking.phone_number.toLowerCase();
      const phoneMatch = phone.includes(normalizedQuery);
      const phoneDigits = phone.replace(/\D/g, "");
      const digitsMatch = normalizedDigits ? phoneDigits.includes(normalizedDigits) : false;
      return idMatch || phoneMatch || digitsMatch;
    });
  }, [bookings, query]);

  useEffect(() => {
    loadBookings();
  }, [driverAccessToken]);

  async function loadBookings() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${driverAccessToken}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load bookings.");
      }

      setBookings(data.bookings);
      setDrafts(
        Object.fromEntries(
          data.bookings.map((booking: Booking) => [
            booking.id,
            {
              final_price: booking.final_price?.toString() ?? "",
              helper_charge: booking.helper_charge?.toString() ?? "",
              driver_notes: booking.driver_notes ?? ""
            }
          ])
        )
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load bookings.");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateBooking(booking: Booking, status?: BookingStatus) {
    const draft = drafts[booking.id] ?? { final_price: "", helper_charge: "", driver_notes: "" };
    const finalPrice = draft.final_price === "" ? null : Number(draft.final_price);
    const helperCharge = draft.helper_charge === "" ? null : Number(draft.helper_charge);

    if (status && isBackwardStatusChange(booking.status, status)) {
      const confirmed = window.confirm(
        `Are you sure you want to change this booking from ${STATUS_LABELS[booking.status]} back to ${STATUS_LABELS[status]}?`
      );

      if (!confirmed) {
        return;
      }
    }

    if (status === "booked" && finalPrice === null) {
      const finalPriceInput = finalPriceRefs.current[booking.id];
      setRecordErrors((current) => ({
        ...current,
        [booking.id]: "Final price is required before marking this booking as booked."
      }));
      finalPriceInput?.setCustomValidity("Final price is required before marking this booking as booked.");
      finalPriceInput?.reportValidity();
      finalPriceInput?.focus();
      return;
    }

    setSavingId(booking.id);
    setRecordErrors((current) => {
      const next = { ...current };
      delete next[booking.id];
      return next;
    });

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${driverAccessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status,
          final_price: finalPrice,
          helper_charge: helperCharge,
          driver_notes: draft.driver_notes || null
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update booking.");
      }

      setBookings((current) => current.map((item) => (item.id === booking.id ? data.booking : item)));
      setDrafts((current) => ({
        ...current,
        [booking.id]: {
          final_price: data.booking.final_price?.toString() ?? "",
          helper_charge: data.booking.helper_charge?.toString() ?? "",
          driver_notes: data.booking.driver_notes ?? ""
        }
      }));
    } catch (caught) {
      setRecordErrors((current) => ({
        ...current,
        [booking.id]: caught instanceof Error ? caught.message : "Could not update this booking."
      }));
    } finally {
      setSavingId(null);
    }
  }

  async function deleteBooking(booking: Booking) {
    const confirmed = window.confirm(copy.deleteConfirm.replace("{id}", booking.id.toString()));

    if (!confirmed) {
      return;
    }

    setDeletingId(booking.id);
    setRecordErrors((current) => {
      const next = { ...current };
      delete next[booking.id];
      return next;
    });

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${driverAccessToken}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete booking.");
      }

      setBookings((current) => current.filter((item) => item.id !== booking.id));
      setDrafts((current) => {
        const next = { ...current };
        delete next[booking.id];
        return next;
      });
      setRecordErrors((current) => {
        const next = { ...current };
        delete next[booking.id];
        return next;
      });
      delete finalPriceRefs.current[booking.id];
    } catch (caught) {
      setRecordErrors((current) => ({
        ...current,
        [booking.id]: caught instanceof Error ? caught.message : "Could not delete this booking."
      }));
    } finally {
      setDeletingId(null);
    }
  }

  function setDraft(id: number, patch: Partial<Draft>) {
    if (patch.final_price !== undefined) {
      finalPriceRefs.current[id]?.setCustomValidity("");
    }

    setDrafts((current) => ({
      ...current,
      [id]: {
        final_price: current[id]?.final_price ?? "",
        helper_charge: current[id]?.helper_charge ?? "",
        driver_notes: current[id]?.driver_notes ?? "",
        ...patch
      }
    }));
  }

  return (
    <section className="panel">
      <div className="dashboard-head">
        <div className="section-title">
          <span className="eyebrow">{copy.driverWorkspace}</span>
          <h2>{copy.driverDashboard}</h2>
          <p className="muted">{copy.driverSubtitle}</p>
        </div>
        <button onClick={loadBookings} type="button" className="refresh-icon" aria-label={copy.refreshLabel}>
          ⟳
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {isLoading ? <p className="muted">{copy.loading}</p> : null}
      {!isLoading && bookings.length === 0 ? <div className="empty">{copy.noBookings}</div> : null}
      {!isLoading && bookings.length > 0 ? (
        <div className="search-bar">
          <div className="field">
            <label htmlFor="driver-search">{copy.searchLabel}</label>
            <input
              autoComplete="off"
              id="driver-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              type="search"
              value={query}
            />
          </div>
        </div>
      ) : null}
      {!isLoading && bookings.length > 0 && filteredBookings.length === 0 ? (
        <div className="empty">{copy.noResults}</div>
      ) : null}

      <div className="cards">
        {filteredBookings.map((booking) => {
          const draft = drafts[booking.id] ?? { final_price: "", helper_charge: "", driver_notes: "" };
          const statusOptions = getStatusOptions(booking.status);
          const finalPriceIsRequired = booking.status === "booked" || statusOptions.includes("booked");
          const recordError = recordErrors[booking.id];
          const customerMessage = [
            `Hello, this is ${driver.name} about your mini truck booking.`,
            `Pickup: ${booking.pickup_location}`,
            `Drop: ${booking.drop_location}`,
            `Pickup time: ${formatDateTime(booking.pickup_time)}`,
            `Estimated price: ${formatMoney(booking.estimated_price)}`,
            booking.need_helper ? "Helper needed for loading/unloading: Yes" : null,
            booking.helper_charge ? `Helper charge: ${formatMoney(booking.helper_charge)} (not included in ride final price)` : null,
            booking.driver_notes ? `Driver notes: ${booking.driver_notes}` : null
          ].filter(Boolean).join("\n");

          return (
            <article className="booking-card" key={booking.id}>
              {recordError ? <p className="error record-error">{recordError}</p> : null}
              <div className="booking-head">
                <div className="status-header">
                  <span className={`status ${booking.status}`}>{booking.status}</span>
                  <div className="booking-id">
                    <span className="muted">Booking ID: {booking.id}</span>
                  </div>
                </div>
                <div className="route-section">
                  <div className="route-path">
                    <span className="route-location">{booking.pickup_location}</span>
                    <span className="route-arrow" aria-hidden="true">to</span>
                    <span className="route-location">{booking.drop_location}</span>
                  </div>
                  <div className="meta-row">
                    <div className="meta">
                      <span>{copy.pickupMeta} {formatDateTime(booking.pickup_time)}</span>
                      <span>{copy.dropMeta} {formatDateTime(booking.drop_time)}</span>
                      <span>{copy.customerMeta} {booking.phone_number}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prices">
                <div className="price-tile">
                  <span>{copy.estimatedPrice}</span>
                  {formatMoney(booking.estimated_price)}
                </div>
                <div className="price-tile">
                  <span>{copy.expectedPrice}</span>
                  {formatMoney(booking.expected_price)}
                </div>
                <div className="price-tile">
                  <span>{copy.finalPrice}</span>
                  {formatMoney(booking.final_price)}
                </div>
                <div className="price-tile">
                  <span>{copy.helperNeeded}</span>
                  {booking.need_helper ? "Yes" : "No"}
                </div>
                {booking.need_helper ? (
                  <div className="price-tile">
                    <span>{copy.helperCharge}</span>
                    {formatMoney(booking.helper_charge)}
                  </div>
                ) : null}
                <div className="price-tile">
                  <span>{copy.distanceLabel}</span>
                  {formatDistance(booking.estimated_distance_km)}
                </div>
                <div className="price-tile">
                  <span>{copy.estimateSource}</span>
                  {booking.estimate_source ? booking.estimate_source.replace("_", " ") : copy.notSetLabel}
                </div>
              </div>

              <div className="inline-edit">
                <div className="field">
                  <label htmlFor={`final-${booking.id}`}>{copy.finalPriceLabel}</label>
                  <input
                    id={`final-${booking.id}`}
                    min="0"
                    onChange={(event) => setDraft(booking.id, { final_price: event.target.value })}
                    onWheel={(event) => event.currentTarget.blur()}
                    ref={(element) => {
                      finalPriceRefs.current[booking.id] = element;
                    }}
                    required={finalPriceIsRequired}
                    step="0.01"
                    type="number"
                    value={draft.final_price}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`customer-notes-${booking.id}`}>{copy.customerNotesLabel}</label>
                  <input
                    id={`customer-notes-${booking.id}`}
                    readOnly
                    type="text"
                    value={booking.customer_notes ?? copy.notSetLabel}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`driver-notes-${booking.id}`}>{copy.driverNotesLabel}</label>
                  <input
                    id={`driver-notes-${booking.id}`}
                    onChange={(event) => setDraft(booking.id, { driver_notes: event.target.value })}
                    type="text"
                    value={draft.driver_notes}
                  />
                </div>
                {booking.need_helper ? (
                  <div className="field">
                    <label htmlFor={`helper-${booking.id}`}>{copy.helperCharge}</label>
                    <input
                      id={`helper-${booking.id}`}
                      min="0"
                      onChange={(event) => setDraft(booking.id, { helper_charge: event.target.value })}
                      onWheel={(event) => event.currentTarget.blur()}
                      placeholder={copy.helperChargeHint}
                      step="0.01"
                      type="number"
                      value={draft.helper_charge}
                    />
                  </div>
                ) : null}
              </div>

              <div className="actions">
                <a className="button primary" href={phoneHref(booking.phone_number)}>
                  {copy.call}
                </a>
                <a
                  className="button"
                  href={whatsappHref(booking.phone_number, customerMessage)}
                  rel="noreferrer"
                  target="_blank"
                >
                  {copy.whatsapp}
                </a>
                <button
                  disabled={savingId === booking.id || deletingId === booking.id}
                  onClick={() => updateBooking(booking)}
                  type="button"
                >
                  {copy.saveNotes}
                </button>
              </div>

              <div className="actions secondary-actions">
                {statusOptions.map((status) => (
                  <button
                    className={
                      status === "rejected"
                        ? "danger"
                        : isBackwardStatusChange(booking.status, status)
                          ? "backward"
                          : undefined
                    }
                    disabled={savingId === booking.id || deletingId === booking.id}
                    key={status}
                    onClick={() => updateBooking(booking, status)}
                    type="button"
                  >
                    {status === "rejected"
                      ? copy.reject
                      : status === "booked"
                        ? "Accept booking"
                        : status === "completed"
                          ? "Mark completed"
                          : `${copy.setStatusPrefix} ${STATUS_LABELS[status]}`}
                  </button>
                ))}
                <button
                  className="danger"
                  disabled={savingId === booking.id || deletingId === booking.id}
                  onClick={() => deleteBooking(booking)}
                  type="button"
                >
                  {deletingId === booking.id ? copy.deletingBooking : copy.deleteBooking}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="language-switcher">
        <p>{copy.languageLabel}</p>
        <div className="language-options">
          <button
            className={language === "en" ? "active" : undefined}
            onClick={() => setLanguage("en")}
            type="button"
          >
            {copy.english}
          </button>
          <button
            className={language === "ml" ? "active" : undefined}
            onClick={() => setLanguage("ml")}
            type="button"
          >
            {copy.malayalam}
          </button>
        </div>
      </div>
    </section>
  );
}
