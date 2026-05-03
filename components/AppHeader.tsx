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
        <span className="brand-mark">EL</span>
        <span>
          <h1>EasyLoad</h1>
          <p>UAE</p>
        </span>
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/">Book</Link>
        <Link href="/driver">Driver</Link>
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
