import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

type AppHeaderProps = {
  onLogout?: () => void;
  userEmail?: string;
};

export function AppHeader({ onLogout, userEmail }: AppHeaderProps) {
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <div className="brand-container">
          <Image
            src="/logo-full.png"
            alt="PickUp DXB"
            width={160}
            height={40}
            priority
            className="brand-logo"
          />

          <p className="brand-tagline">
            OPERATING ACROSS UAE
          </p>
        </div>
      </Link>

      <nav className="nav" aria-label="Primary navigation">
        <Link href="/">Book</Link>

        <Link href="/driver">
          Driver
        </Link>

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
    </header>
  );
}