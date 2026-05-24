import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export type DriverIdentity = {
  email: string | null;
  id: string;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const driverAuthEmails =
  process.env.DRIVER_AUTH_EMAIL
    ?.split(",")
    .map((email) => email.trim().toLowerCase()) || [];
const isProduction = process.env.NODE_ENV === "production";

export async function requireDriver(request: NextRequest) {
  const { error } = await getDriverIdentity(request);
  return error;
}

export async function getDriverIdentity(request: NextRequest): Promise<{
  driver: DriverIdentity | null;
  error: NextResponse | null;
}> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  if (!token || !supabaseUrl || !supabaseAnonKey) {
    return {
      driver: null,
      error: NextResponse.json({ error: "Driver login required." }, { status: 401 })
    };
  }

  if (isProduction && driverAuthEmails.length === 0) {
    return {
      driver: null,
      error: NextResponse.json({ error: "Driver access is not configured." }, { status: 500 })
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return {
      driver: null,
      error: NextResponse.json({ error: "Driver login required." }, { status: 401 })
    };
  }

  const userEmail = data.user.email?.toLowerCase();

  if (
    driverAuthEmails.length > 0 &&
    (!userEmail || !driverAuthEmails.includes(userEmail))
  ) {
    return {
      driver: null,
      error: NextResponse.json(
        { error: "This account is not allowed to access the driver dashboard." },
        { status: 403 }
      )
    };
  }

  return {
    driver: {
      email: data.user.email ?? null,
      id: data.user.id
    },
    error: null
  };
}
