import { ValidationError } from "@/lib/bookings/validation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type PushSubscriptionInput = {
  endpoint?: unknown;
  expirationTime?: unknown;
  keys?: {
    auth?: unknown;
    p256dh?: unknown;
  };
};

export type StoredPushSubscription = {
  auth: string;
  driver_email: string;
  endpoint: string;
  id: string;
  p256dh: string;
  user_agent: string | null;
};

type PushSubscriptionRow = StoredPushSubscription & {
  created_at: string;
  updated_at: string;
};

const PUSH_SUBSCRIPTION_COLUMNS = `
  id,
  driver_email,
  endpoint,
  p256dh,
  auth,
  user_agent,
  created_at,
  updated_at
`;

export function parsePushSubscriptionInput(input: PushSubscriptionInput) {
  const endpoint = parsePushEndpoint(input.endpoint);
  const p256dh = toBoundedString(input.keys?.p256dh, 512);
  const auth = toBoundedString(input.keys?.auth, 256);

  if (!endpoint || !p256dh || !auth) {
    throw new ValidationError("A valid push subscription is required.");
  }

  return {
    endpoint,
    p256dh,
    auth
  };
}

export function parsePushEndpoint(value: unknown) {
  const endpoint = toBoundedString(value, 2048);

  if (!endpoint) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(endpoint);
  } catch {
    throw new ValidationError("Push subscription endpoint is invalid.");
  }

  if (url.protocol !== "https:") {
    throw new ValidationError("Push subscription endpoint must use HTTPS.");
  }

  return endpoint;
}

export async function upsertDriverPushSubscription({
  auth,
  driverEmail,
  endpoint,
  p256dh,
  userAgent
}: {
  auth: string;
  driverEmail: string;
  endpoint: string;
  p256dh: string;
  userAgent: string | null;
}) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("driver_push_subscriptions")
    .upsert(
      {
        auth,
        driver_email: driverEmail,
        endpoint,
        p256dh,
        user_agent: userAgent,
        updated_at: new Date().toISOString()
      },
      { onConflict: "endpoint" }
    )
    .select(PUSH_SUBSCRIPTION_COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PushSubscriptionRow;
}

export async function deleteDriverPushSubscription(endpoint: string, driverEmail?: string) {
  const supabase = getSupabaseServerClient();
  let query = supabase.from("driver_push_subscriptions").delete().eq("endpoint", endpoint);

  if (driverEmail) {
    query = query.eq("driver_email", driverEmail);
  }

  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }
}

export async function listDriverPushSubscriptions(driverEmail?: string): Promise<StoredPushSubscription[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("driver_push_subscriptions")
    .select(PUSH_SUBSCRIPTION_COLUMNS)
    .order("updated_at", { ascending: false });

  if (driverEmail) {
    query = query.eq("driver_email", driverEmail);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StoredPushSubscription[];
}

function toBoundedString(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
}
