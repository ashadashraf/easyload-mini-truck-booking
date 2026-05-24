"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DriverPushNotifications } from "./DriverPushNotifications";
import { ThemeToggle } from "./ThemeToggle";

type AppHeaderProps = {
  brandHref?: string;
  driverAccessToken?: string;
  bookHref?: string;
  languageHref?: string;
  languageLabel?: string;
  labels?: Partial<{
    alerts: string;
    book: string;
    brandTagline: string;
    driver: string;
    mobileAlert: string;
    mobileTitle: string;
    signOut: string;
    support: string;
  }>;
  onLogout?: () => void;
  showDriverLink?: boolean;
  userEmail?: string;
};

const defaultLabels = {
  alerts: "Alerts",
  book: "Book",
  brandTagline: "OPERATING ACROSS UAE",
  driver: "Driver",
  mobileAlert: "Booking alerts",
  mobileTitle: "Book a Pickup Anywhere in UAE",
  signOut: "Sign out",
  support: "Support"
};

export function AppHeader({
  brandHref = "/",
  bookHref = "/",
  driverAccessToken,
  languageHref,
  languageLabel,
  labels,
  onLogout,
  showDriverLink = false,
  userEmail
}: AppHeaderProps) {
  const copy = { ...defaultLabels, ...labels };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDriverAlertMenuOpen, setIsDriverAlertMenuOpen] = useState(false);
  const driverAlertMenuRef = useRef<HTMLDetailsElement | null>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    if (!isMobileMenuOpen && !isDriverAlertMenuOpen) {
      return;
    }

    function closeOnOutsideClick(event: PointerEvent) {
      const target = event.target as Node;

      if (isMobileMenuOpen && !mobileMenuRef.current?.contains(target)) {
        setIsMobileMenuOpen(false);
      }

      if (isDriverAlertMenuOpen && !driverAlertMenuRef.current?.contains(target)) {
        setIsDriverAlertMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsDriverAlertMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isDriverAlertMenuOpen, isMobileMenuOpen]);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="topbar">
      <Link className="brand" href={brandHref}>
        <div className="brand-container">
          <Image
            src="/PickUpDxbLogo.png"
            alt=""
            width={96}
            height={64}
            priority
            className="brand-logo"
          />
          <div className="brand-copy">
            <span className="brand-name">PickUp DXB</span>
            <p className="brand-tagline">
              {copy.brandTagline}
            </p>
            <p className="mobile-header-title">{copy.mobileTitle}</p>
          </div>
        </div>
      </Link>

      <nav className="nav" aria-label="Primary navigation">
        <Link href={bookHref}>{copy.book}</Link>

        {showDriverLink ? (
          <Link href="/driver">
            {copy.driver}
          </Link>
        ) : null}

        <a href="#support">{copy.support}</a>
        {languageHref && languageLabel ? <Link href={languageHref}>{languageLabel}</Link> : null}

        <ThemeToggle />

        {driverAccessToken ? (
          <details
            className="driver-alert-menu"
            onToggle={(event) => setIsDriverAlertMenuOpen(event.currentTarget.open)}
            open={isDriverAlertMenuOpen}
            ref={driverAlertMenuRef}
          >
            <summary>{copy.alerts}</summary>
            <DriverPushNotifications driverAccessToken={driverAccessToken} />
          </details>
        ) : null}

        {userEmail && onLogout && (
          <button
            onClick={onLogout}
            type="button"
            className="logout-btn"
            title={`${copy.signOut} (${userEmail})`}
          >
            {copy.signOut}
          </button>
        )}
      </nav>

      <details
        className="mobile-menu"
        onToggle={(event) => setIsMobileMenuOpen(event.currentTarget.open)}
        open={isMobileMenuOpen}
        ref={mobileMenuRef}
      >
        <summary aria-label="Open navigation menu">
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </summary>
        <nav className="mobile-menu-panel" aria-label="Mobile navigation">
          <Link href={bookHref} onClick={closeMobileMenu}>{copy.book}</Link>
          {showDriverLink ? <Link href="/driver" onClick={closeMobileMenu}>{copy.driver}</Link> : null}
          <a href="#support" onClick={closeMobileMenu}>{copy.support}</a>
          {languageHref && languageLabel ? (
            <Link href={languageHref} onClick={closeMobileMenu}>{languageLabel}</Link>
          ) : null}
          <ThemeToggle />
          {driverAccessToken ? (
            <details className="mobile-alert-menu">
              <summary>{copy.mobileAlert}</summary>
              <DriverPushNotifications driverAccessToken={driverAccessToken} />
            </details>
          ) : null}
          {userEmail && onLogout && (
            <button
              onClick={() => {
                closeMobileMenu();
                onLogout();
              }}
              type="button"
              className="logout-btn"
              title={`${copy.signOut} (${userEmail})`}
            >
              {copy.signOut}
            </button>
          )}
        </nav>
      </details>
    </header>
  );
}
