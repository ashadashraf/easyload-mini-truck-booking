"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CustomerBooking, BookingStatus } from "@/lib/bookings/types";
import { DriverContact } from "@/lib/driver";
import { formatDateTime } from "@/lib/format";
import { BookingForm } from "./BookingForm";

const STORAGE_KEY = "pickupdxb-recent-bookings-v1";
const MAX_RECENT_BOOKINGS = 10;
const INACTIVE_STATUSES: BookingStatus[] = ["completed", "rejected"];

type CachedBooking = {
  id: number;
  created_at: string;
  token: string;
  access_link: string;
};

type RecentBooking = CachedBooking & {
  booking: CustomerBooking | null;
  isLoading: boolean;
  error: string;
};

export function CustomerBookingExperience({
  driver,
  locationSuggestions
}: {
  driver: DriverContact;
  locationSuggestions: string[];
}) {
  const [cachedBookings, setCachedBookings] = useState<CachedBooking[]>([]);
  const [bookingDetails, setBookingDetails] = useState<Record<string, CustomerBooking>>({});
  const [loadingTokens, setLoadingTokens] = useState<Record<string, boolean>>({});
  const [loadErrors, setLoadErrors] = useState<Record<string, string>>({});
  const [hasLoadedCache, setHasLoadedCache] = useState(false);
  const inFlightTokensRef = useRef<Set<string>>(new Set());
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      inFlightTokensRef.current.clear();
    };
  }, []);

  useEffect(() => {
    setCachedBookings(readCachedBookings());
    setHasLoadedCache(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedCache) {
      return;
    }

    writeCachedBookings(cachedBookings);
  }, [cachedBookings, hasLoadedCache]);

  const refreshBookings = useCallback((items: CachedBooking[]) => {
    const itemsToRefresh = items.filter((item) => !inFlightTokensRef.current.has(item.token));

    if (!itemsToRefresh.length) {
      return;
    }

    itemsToRefresh.forEach((item) => {
      inFlightTokensRef.current.add(item.token);
      setLoadingTokens((current) => ({ ...current, [item.token]: true }));
      setLoadErrors((current) => {
        const next = { ...current };
        delete next[item.token];
        return next;
      });

      fetch(`/api/bookings/token/${encodeURIComponent(item.token)}`, { cache: "no-store" })
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Could not refresh booking.");
          }

          if (!isMountedRef.current) {
            return;
          }

          setBookingDetails((current) => ({ ...current, [item.token]: data.booking }));
        })
        .catch((caught) => {
          if (!isMountedRef.current) {
            return;
          }

          setLoadErrors((current) => ({
            ...current,
            [item.token]: caught instanceof Error ? caught.message : "Could not refresh booking."
          }));
        })
        .finally(() => {
          inFlightTokensRef.current.delete(item.token);

          if (!isMountedRef.current) {
            return;
          }

          setLoadingTokens((current) => {
            const next = { ...current };
            delete next[item.token];
            return next;
          });
        });
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedCache || !cachedBookings.length) {
      return;
    }

    refreshBookings(cachedBookings);
  }, [cachedBookings, hasLoadedCache, refreshBookings]);

  useEffect(() => {
    if (!hasLoadedCache || !cachedBookings.length) {
      return;
    }

    function refreshOnVisible() {
      if (document.visibilityState === "visible") {
        refreshBookings(cachedBookings);
      }
    }

    window.addEventListener("focus", refreshOnVisible);
    document.addEventListener("visibilitychange", refreshOnVisible);

    return () => {
      window.removeEventListener("focus", refreshOnVisible);
      document.removeEventListener("visibilitychange", refreshOnVisible);
    };
  }, [cachedBookings, hasLoadedCache, refreshBookings]);

  const recentBookings = useMemo<RecentBooking[]>(() => {
    return cachedBookings.map((item) => ({
      ...item,
      booking: bookingDetails[item.token] ?? null,
      isLoading: Boolean(loadingTokens[item.token]),
      error: loadErrors[item.token] ?? ""
    }));
  }, [bookingDetails, cachedBookings, loadErrors, loadingTokens]);

  const latestBooking = recentBookings[0] ?? null;
  const activeBooking = latestBooking && (latestBooking.isLoading || (latestBooking.booking && isActiveStatus(latestBooking.booking.status)))
    ? latestBooking
    : null;
  const historyBookings = activeBooking
    ? recentBookings.filter((item) => item.token !== activeBooking.token)
    : recentBookings;

  const handleBookingCreated = useCallback((booking: CustomerBooking, accessLink: string) => {
    const token = tokenFromAccessLink(accessLink);

    if (!token) {
      return;
    }

    const nextItem: CachedBooking = {
      id: booking.id,
      created_at: booking.created_at,
      token,
      access_link: accessLink || bookingUrlFromToken(token)
    };

    setBookingDetails((current) => ({ ...current, [token]: booking }));
    setCachedBookings((current) => limitCachedBookings([nextItem, ...current.filter((item) => item.token !== token)]));
  }, []);

  function clearRecentBookings() {
    if (!window.confirm("Clear recent bookings from this device?")) {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    setCachedBookings([]);
    setBookingDetails({});
    setLoadingTokens({});
    setLoadErrors({});
    inFlightTokensRef.current.clear();
  }

  return (
    <>
      {activeBooking ? <RecentBookingCard item={activeBooking} variant="active" /> : null}

      <BookingForm
        driver={driver}
        locationSuggestions={locationSuggestions}
        onBookingCreated={handleBookingCreated}
      />

      {hasLoadedCache && recentBookings.length > 0 ? (
        <section className="recent-bookings-section" aria-labelledby="recent-bookings-title">
          <div className="section-title recent-bookings-head">
            <div>
              <span className="eyebrow">Saved on this device</span>
              <h2 id="recent-bookings-title">Recent Bookings</h2>
              <p className="muted">Quickly reopen private booking links from this browser.</p>
            </div>
            <div className="recent-bookings-actions">
              <button className="refresh-recent-button" onClick={() => refreshBookings(cachedBookings)} type="button">
                Refresh Status
              </button>
              <button className="clear-recent-button" onClick={clearRecentBookings} type="button">
                Clear Recent Bookings
              </button>
            </div>
          </div>

          {historyBookings.length > 0 ? (
            <div className="recent-bookings-list">
              {historyBookings.map((item) => (
                <RecentBookingCard item={item} key={item.token} />
              ))}
            </div>
          ) : (
            <div className="empty">No completed recent bookings yet.</div>
          )}
        </section>
      ) : null}
    </>
  );
}

function RecentBookingCard({ item, variant = "normal" }: { item: RecentBooking; variant?: "active" | "normal" }) {
  const booking = item.booking;
  const createdAt = booking?.created_at ?? item.created_at;
  const status = booking?.status ?? "pending";

  return (
    <article className={`recent-booking-card ${variant === "active" ? "active" : ""}`}>
      <div className="recent-booking-topline">
        <div>
          <span className="eyebrow">{variant === "active" ? "Active booking" : "Recent booking"}</span>
          <h3>Booking ID: {booking?.id ?? item.id}</h3>
        </div>
        <span className={`status ${status}`}>{status}</span>
      </div>

      {item.isLoading ? <p className="muted">Refreshing booking status...</p> : null}
      {item.error ? <p className="error">{item.error}</p> : null}

      {booking ? (
        <div className="recent-route">
          <span>{booking.pickup_location}</span>
          <strong aria-hidden="true">to</strong>
          <span>{booking.drop_location}</span>
        </div>
      ) : null}

      <div className="recent-booking-meta">
        <span>{formatDateTime(createdAt)}</span>
        {booking?.pickup_time ? <span>Pickup: {formatDateTime(booking.pickup_time)}</span> : null}
      </div>

      <div className="private-link recent-booking-link">
        <strong>Booking detail URL</strong>
        <a href={item.access_link}>{item.access_link}</a>
      </div>
    </article>
  );
}

function readCachedBookings() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return limitCachedBookings(
      parsedValue
        .map(normalizeCachedBooking)
        .filter((item): item is CachedBooking => Boolean(item))
    );
  } catch {
    return [];
  }
}

function normalizeCachedBooking(value: unknown): CachedBooking | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Partial<CachedBooking>;
  const token = typeof item.token === "string" && item.token ? item.token : tokenFromAccessLink(item.access_link);
  const accessLink = typeof item.access_link === "string" && item.access_link ? item.access_link : bookingUrlFromToken(token);

  if (!token || typeof item.id !== "number" || typeof item.created_at !== "string") {
    return null;
  }

  return {
    id: item.id,
    created_at: item.created_at,
    token,
    access_link: accessLink
  };
}

function writeCachedBookings(bookings: CachedBooking[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(limitCachedBookings(bookings)));
}

function limitCachedBookings(bookings: CachedBooking[]) {
  return bookings
    .filter((item, index, source) => source.findIndex((match) => match.token === item.token) === index)
    .sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at))
    .slice(0, MAX_RECENT_BOOKINGS);
}

function isActiveStatus(status: BookingStatus) {
  return !INACTIVE_STATUSES.includes(status);
}

function tokenFromAccessLink(accessLink: string | undefined) {
  if (!accessLink) {
    return "";
  }

  try {
    const url = new URL(accessLink, window.location.origin);
    const parts = url.pathname.split("/").filter(Boolean);
    const bookingIndex = parts.indexOf("booking");
    return bookingIndex >= 0 ? parts[bookingIndex + 1] ?? "" : "";
  } catch {
    return accessLink.split("/").filter(Boolean).at(-1) ?? "";
  }
}

function bookingUrlFromToken(token: string) {
  if (!token || typeof window === "undefined") {
    return "";
  }

  return `${window.location.origin}/booking/${token}`;
}
