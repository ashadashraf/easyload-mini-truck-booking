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

const bookingCopy = {
  en: {
    steps: ["Location", "Details", "Confirm"],
    fastRequest: "Fast request",
    title: "Book your 1 ton pickup",
    subtitle: "Enter the route, timing, and items. We will save the booking and show your estimate.",
    vehicleTitle: "1 ton pickup",
    vehicleDescription: "Best for shifting, delivery, furniture, boxes, and shop items.",
    selected: "Selected",
    pickupLocation: "Pickup location",
    pickupPlaceholder: "Example: Dubai Marina",
    dropLocation: "Drop-off location",
    dropPlaceholder: "Example: Sharjah Industrial Area",
    pickupTime: "Pickup time",
    dropTime: "Drop-off time",
    contactNumber: "Contact number",
    phonePlaceholder: "Example: 971501234567",
    expectedPrice: "Expected price (optional)",
    expectedPlaceholder: "AED",
    helperLabel: "Need helper for loading/unloading",
    helperOn: "Helper charge is not included in the ride final price. It may vary based on hours and work intensity, and the helper will confirm the amount.",
    helperOff: "Turn this on if items are heavy, bulky, or need carrying upstairs.",
    notes: "Notes / items description",
    notesPlaceholder: "Example: 2 sofas, boxes, washing machine, lift available",
    saving: "Saving booking...",
    bookNow: "Book Now",
    microcopy: "Available across UAE. You will receive a private booking detail link after submitting.",
    priceView: "Price view",
    estimatedPrice: "Estimated price",
    to: "to",
    notSet: "Not set",
    expectedPriceLabel: "Expected price",
    helper: "Helper",
    helperSummary: "Needed for loading/unloading. Helper charge is not included in the ride final price.",
    distance: "Distance",
    around: "Around",
    min: "min",
    saved: "Request saved. Keep your private link to check status and final price later.",
    privateLink: "Private booking link",
    redirecting: "Auto-redirecting to WhatsApp in",
    seconds: "seconds",
    messagePreview: "Message preview:",
    cancelRedirect: "Cancel auto-redirect",
    callDriver: "Call Driver",
    whatsappDriver: "WhatsApp Driver",
    emptyEstimate: "Your estimate will appear here after submission.",
    emptySteps: ["1. Submit route", "2. Contact driver", "3. Agree final price"],
    whatsappIntro: "Hello {driver}, I need a mini truck booking.",
    whatsappPickup: "Pickup",
    whatsappDrop: "Drop",
    whatsappPickupTime: "Pickup time",
    whatsappDropTime: "Drop time",
    whatsappEstimated: "Estimated price",
    whatsappExpected: "Expected price",
    whatsappHelper: "Helper needed for loading/unloading: Yes",
    whatsappNotes: "Customer notes",
    whatsappLink: "Private booking link",
    futurePickupError: "Pickup time must be set to a future date.",
    validDropError: "Drop time must be a valid date.",
    futureDropError: "Drop time must be set to a future date.",
    dropBeforePickupError: "Drop time cannot be before pickup time.",
    createError: "Could not create booking."
  },
  ar: {
    steps: ["الموقع", "التفاصيل", "التأكيد"],
    fastRequest: "طلب سريع",
    title: "احجز بيك اب 1 طن",
    subtitle: "أدخل المسار والوقت والأغراض. سنحفظ الحجز ونعرض تقدير السعر.",
    vehicleTitle: "بيك اب 1 طن",
    vehicleDescription: "مناسب للنقل، التوصيل، الأثاث، الصناديق، وأغراض المتاجر.",
    selected: "محدد",
    pickupLocation: "موقع الاستلام",
    pickupPlaceholder: "مثال: دبي مارينا",
    dropLocation: "موقع التسليم",
    dropPlaceholder: "مثال: صناعية الشارقة",
    pickupTime: "وقت الاستلام",
    dropTime: "وقت التسليم",
    contactNumber: "رقم التواصل",
    phonePlaceholder: "مثال: 971501234567",
    expectedPrice: "السعر المتوقع (اختياري)",
    expectedPlaceholder: "درهم",
    helperLabel: "أحتاج مساعدا للتحميل والتنزيل",
    helperOn: "رسوم المساعد غير مشمولة في سعر الرحلة النهائي. قد تختلف حسب الوقت وطبيعة العمل، وسيؤكد المساعد المبلغ.",
    helperOff: "فعّل هذا الخيار إذا كانت الأغراض ثقيلة أو كبيرة أو تحتاج حملا للأعلى.",
    notes: "ملاحظات / وصف الأغراض",
    notesPlaceholder: "مثال: كنب عدد 2، صناديق، غسالة، يوجد مصعد",
    saving: "جاري حفظ الحجز...",
    bookNow: "احجز الآن",
    microcopy: "متوفر في جميع أنحاء الإمارات. ستحصل على رابط خاص لتفاصيل الحجز بعد الإرسال.",
    priceView: "عرض السعر",
    estimatedPrice: "السعر التقديري",
    to: "إلى",
    notSet: "غير محدد",
    expectedPriceLabel: "السعر المتوقع",
    helper: "مساعد",
    helperSummary: "مطلوب للتحميل والتنزيل. رسوم المساعد غير مشمولة في سعر الرحلة النهائي.",
    distance: "المسافة",
    around: "حوالي",
    min: "دقيقة",
    saved: "تم حفظ الطلب. احتفظ بالرابط الخاص لمتابعة الحالة والسعر النهائي لاحقا.",
    privateLink: "رابط الحجز الخاص",
    redirecting: "سيتم التحويل إلى واتساب خلال",
    seconds: "ثوان",
    messagePreview: "معاينة الرسالة:",
    cancelRedirect: "إلغاء التحويل التلقائي",
    callDriver: "اتصال بالسائق",
    whatsappDriver: "واتساب السائق",
    emptyEstimate: "سيظهر تقدير السعر هنا بعد الإرسال.",
    emptySteps: ["1. أرسل المسار", "2. تواصل مع السائق", "3. اتفق على السعر النهائي"],
    whatsappIntro: "مرحبا {driver}، أحتاج حجز بيك اب.",
    whatsappPickup: "الاستلام",
    whatsappDrop: "التسليم",
    whatsappPickupTime: "وقت الاستلام",
    whatsappDropTime: "وقت التسليم",
    whatsappEstimated: "السعر التقديري",
    whatsappExpected: "السعر المتوقع",
    whatsappHelper: "مطلوب مساعد للتحميل والتنزيل: نعم",
    whatsappNotes: "ملاحظات العميل",
    whatsappLink: "رابط الحجز الخاص",
    futurePickupError: "يجب أن يكون وقت الاستلام في المستقبل.",
    validDropError: "يجب أن يكون وقت التسليم صحيحا.",
    futureDropError: "يجب أن يكون وقت التسليم في المستقبل.",
    dropBeforePickupError: "لا يمكن أن يكون وقت التسليم قبل وقت الاستلام.",
    createError: "تعذر إنشاء الحجز."
  }
};

export function BookingForm({
  driver,
  locale = "en",
  locationSuggestions,
  onBookingCreated
}: {
  driver: DriverContact;
  locale?: "ar" | "en";
  locationSuggestions: string[];
  onBookingCreated?: (booking: CustomerBooking, accessLink: string) => void;
}) {
  const copy = bookingCopy[locale];
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
      copy.whatsappIntro.replace("{driver}", driver.name),
      `${copy.whatsappPickup}: ${booking.pickup_location}`,
      `${copy.whatsappDrop}: ${booking.drop_location}`,
      `${copy.whatsappPickupTime}: ${formatDateTime(booking.pickup_time)}`,
      booking.drop_time ? `${copy.whatsappDropTime}: ${formatDateTime(booking.drop_time)}` : null,
      `${copy.whatsappEstimated}: ${formatMoney(booking.estimated_price)}`,
      booking.expected_price ? `${copy.whatsappExpected}: ${formatMoney(booking.expected_price)}` : null,
      booking.need_helper ? copy.whatsappHelper : null,
      booking.customer_notes ? `${copy.whatsappNotes}: ${booking.customer_notes}` : null,
      accessLink ? `${copy.whatsappLink}: ${accessLink}` : null
    ]
      .filter(Boolean)
      .join("\n");
  }, [accessLink, booking, copy, driver.name]);

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
        throw new Error(copy.futurePickupError);
      }

      if (form.drop_time) {
        const dropDate = parseUaeDateTime(form.drop_time);

        if (!dropDate) {
          throw new Error(copy.validDropError);
        }

        if (dropDate.getTime() < now.getTime() - 300000) {
          throw new Error(copy.futureDropError);
        }

        if (dropDate < pickupDate) {
          throw new Error(copy.dropBeforePickupError);
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
        throw new Error(data.error || copy.createError);
      }

      setBooking(data.booking);
      setAccessLink(data.access_link || "");
      onBookingCreated?.(data.booking, data.access_link || "");
      setForm(initialForm);
      // Start auto-redirect timer (5 seconds)
      setRedirectTimer(10);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.createError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid">
      <section className="panel booking-panel">
        <div className="booking-steps" aria-label="Booking steps">
          <span className="active">{copy.steps[0]}</span>
          <span>{copy.steps[1]}</span>
          <span>{copy.steps[2]}</span>
        </div>
        <div className="section-title">
          <span className="eyebrow">{copy.fastRequest}</span>
          <h2>{copy.title}</h2>
          <p className="muted">{copy.subtitle}</p>
        </div>
        <div className="vehicle-option-card" aria-label="Selected vehicle">
          <div className="vehicle-visual" aria-hidden="true">1T</div>
          <div>
            <strong>{copy.vehicleTitle}</strong>
            <span>{copy.vehicleDescription}</span>
          </div>
          <span className="selected-pill">{copy.selected}</span>
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
              label={copy.pickupLocation}
              name="pickup_location"
              placeholder={copy.pickupPlaceholder}
              value={form.pickup_location}
              onChange={(value) => setForm({ ...form, pickup_location: value })}
            />
            <Field
              list="uae-location-suggestions"
              label={copy.dropLocation}
              name="drop_location"
              placeholder={copy.dropPlaceholder}
              value={form.drop_location}
              onChange={(value) => setForm({ ...form, drop_location: value })}
            />
            <Field
              label={copy.pickupTime}
              name="pickup_time"
              type="datetime-local"
              min={minDateTime}
              value={form.pickup_time}
              onChange={(value) => setForm({ ...form, pickup_time: value })}
            />
            <Field
              label={copy.dropTime}
              name="drop_time"
              type="datetime-local"
              min={dropMinDateTime}
              required={false}
              value={form.drop_time}
              onChange={(value) => setForm({ ...form, drop_time: value })}
            />
            <Field
              label={copy.contactNumber}
              name="phone_number"
              placeholder={copy.phonePlaceholder}
              type="tel"
              value={form.phone_number}
              onChange={(value) => setForm({ ...form, phone_number: value })}
            />
            <Field
              label={copy.expectedPrice}
              name="expected_price"
              placeholder={copy.expectedPlaceholder}
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
                {copy.helperLabel}
              </label>
              {form.need_helper ? (
                <p className="helper-note">
                  {copy.helperOn}
                </p>
              ) : (
                <p className="helper-note">{copy.helperOff}</p>
              )}
            </div>
            <TextArea
              label={copy.notes}
              name="customer_notes"
              placeholder={copy.notesPlaceholder}
              required={false}
              value={form.customer_notes}
              onChange={(value) => setForm({ ...form, customer_notes: value })}
            />
          </div>
          {error ? <p className="error">{error}</p> : null}
          <div className="actions">
            <button className="primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? copy.saving : copy.bookNow}
            </button>
            <p className="form-microcopy">{copy.microcopy}</p>
          </div>
        </form>
      </section>

      <aside className="panel estimate-panel" ref={estimateRef} tabIndex={-1}>
        <div className="section-title compact">
          <span className="eyebrow">{copy.priceView}</span>
          <h3>{copy.estimatedPrice}</h3>
        </div>
        {booking ? (
          <>
            <div className="estimate-amount">
              <span className="price-label">{copy.estimatedPrice}</span>
              <span className="price">{formatMoney(booking.estimated_price)}</span>
            </div>
          <div className="estimate-box">
            <div className="confirmation-route">
              <div className="route-path">
                <span className="route-location">{booking.pickup_location}</span>
                <span className="route-arrow" aria-hidden="true">{copy.to}</span>
                <span className="route-location">{booking.drop_location}</span>
              </div>
              <div className="route-times">
                <span>
                  <strong>{copy.pickupTime}</strong>
                  {formatDateTime(booking.pickup_time)}
                </span>
                <span>
                  <strong>{copy.dropTime}</strong>
                  {booking.drop_time ? formatDateTime(booking.drop_time) : copy.notSet}
                </span>
              </div>
              {booking.expected_price ? (
                <span className="price-row">
                  <strong>{copy.expectedPriceLabel}</strong>
                  {formatMoney(booking.expected_price)}
                </span>
              ) : null}
              {booking.need_helper ? (
                <span className="price-row">
                  <strong>{copy.helper}</strong>
                  {copy.helperSummary}
                </span>
              ) : null}
            </div>
            <span className="muted">
              {copy.distance}: {formatDistance(booking.estimated_distance_km)}
              {booking.estimated_duration_minutes ? ` - ${copy.around} ${booking.estimated_duration_minutes} ${copy.min}` : ""}
            </span>
            <span className={`status ${booking.status}`}>{booking.status}</span>
            <p className="muted">
              {copy.saved}
            </p>
            {accessLink ? (
              <div className="private-link">
                <strong>{copy.privateLink}</strong>
                <a href={accessLink}>{accessLink}</a>
              </div>
            ) : null}
            {redirectTimer !== null && (
              <div className="redirect-notice">
                <div className="redirect-header">
                  <span className="redirect-icon" aria-hidden="true">WA</span>
                  <span className="redirect-text">
                    {copy.redirecting} <strong>{redirectTimer}</strong> {copy.seconds}
                  </span>
                </div>
                <div className="redirect-message">
                  <strong>{copy.messagePreview}</strong>
                  <pre className="message-preview">{whatsappMessage}</pre>
                </div>
                <button onClick={cancelRedirect} type="button" className="cancel-redirect">
                  {copy.cancelRedirect}
                </button>
              </div>
            )}
            <div className="actions">
              <a className="button primary" href={phoneHref(driver.phone)}>
                {copy.callDriver}
              </a>
              <a className="button" href={whatsappHref(driver.phone, whatsappMessage)} rel="noreferrer" target="_blank">
                {copy.whatsappDriver}
              </a>
            </div>
          </div>
          </>
        ) : (
          <div className="estimate-box soft">
            <p className="muted">{copy.emptyEstimate}</p>
            <div className="step-list">
              {copy.emptySteps.map((step) => (
                <span key={step}>{step}</span>
              ))}
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
