"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, hasSupabaseBrowserConfig } from "@/lib/supabase/browser";
import { AppHeader } from "./AppHeader";
import { DriverDashboard } from "./DriverDashboard";

export function DriverAuthGate() {
  const hasConfig = hasSupabaseBrowserConfig();
  const supabase = useMemo(() => (hasConfig ? getSupabaseBrowserClient() : null), [hasConfig]);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setError("Supabase Auth is not configured.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError(signInError.message);
    }

    setIsSubmitting(false);
  }

  async function logout() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  }

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <section className="panel"><p className="muted">Checking driver session...</p></section>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <AppHeader />
        <section className="panel auth-panel">
          <div className="section-title">
            <span className="eyebrow">Driver login</span>
            <h2>Sign in to dashboard</h2>
            <p className="muted">Only the driver can view bookings and update final prices.</p>
          </div>
          {!hasConfig ? (
            <p className="error">
              Supabase Auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.
            </p>
          ) : null}
          <form onSubmit={login}>
            <div className="form-grid single">
              <div className="field">
                <label htmlFor="driver-email">Email</label>
                <input
                  autoComplete="email"
                  id="driver-email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  value={email}
                />
              </div>
              <div className="field">
                <label htmlFor="driver-password">Password</label>
                <input
                  autoComplete="current-password"
                  id="driver-password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </div>
            </div>
            {error ? <p className="error">{error}</p> : null}
            <div className="actions">
              <button className="primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </section>
      </>
    );
  }

  return (
    <>
      <AppHeader onLogout={logout} userEmail={session.user.email} />
      <DriverDashboard driverAccessToken={session.access_token} />
    </>
  );
}
