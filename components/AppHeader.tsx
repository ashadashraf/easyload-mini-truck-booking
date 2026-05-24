"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

type AppHeaderProps = {
  brandHref?: string;
  onLogout?: () => void;
  showDriverLink?: boolean;
  userEmail?: string;
};

export function AppHeader({ brandHref = "/", onLogout, showDriverLink = false, userEmail }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    function closeOnOutsideClick(event: PointerEvent) {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobileMenuOpen]);

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
              OPERATING ACROSS UAE
            </p>
            <p className="mobile-header-title">Book a Pickup Anywhere in UAE</p>
          </div>
        </div>
      </Link>

      <nav className="nav" aria-label="Primary navigation">
        <Link href="/">Book</Link>

        {showDriverLink ? (
          <Link href="/driver">
            Driver
          </Link>
        ) : null}

        <a href="#support">Support</a>

        <ThemeToggle />

        {userEmail && onLogout && (
          <button
            onClick={onLogout}
            type="button"
            className="logout-btn"
            title={`Sign out (${userEmail})`}
          >
            Sign out
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
          <Link href="/" onClick={closeMobileMenu}>Book</Link>
          {showDriverLink ? <Link href="/driver" onClick={closeMobileMenu}>Driver</Link> : null}
          <a href="#support" onClick={closeMobileMenu}>Support</a>
          <ThemeToggle />
          {userEmail && onLogout && (
            <button
              onClick={() => {
                closeMobileMenu();
                onLogout();
              }}
              type="button"
              className="logout-btn"
              title={`Sign out (${userEmail})`}
            >
              Sign out
            </button>
          )}
        </nav>
      </details>
    </header>
  );
}
