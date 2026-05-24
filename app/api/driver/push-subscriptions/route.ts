import { NextRequest, NextResponse } from "next/server";
import { getDriverIdentity } from "@/lib/auth/driver";
import { errorResponse } from "@/lib/http";
import { parsePushEndpoint, parsePushSubscriptionInput, upsertDriverPushSubscription, deleteDriverPushSubscription } from "@/lib/notifications/push-subscriptions";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { driver, error } = await getDriverIdentity(request);

    if (error) {
      return error;
    }

    if (!driver?.email) {
      return NextResponse.json({ error: "Driver account email is required." }, { status: 400 });
    }

    const rateLimitResponse = rateLimit(request, {
      keyPrefix: "driver-push-subscription",
      limit: 20,
      windowMs: 60 * 60 * 1000
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const contentLength = Number(request.headers.get("content-length") || 0);

    if (contentLength > 5_000) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    }

    const body = await request.json();
    const subscription = parsePushSubscriptionInput(body);
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) || null;

    await upsertDriverPushSubscription({
      ...subscription,
      driverEmail: driver.email.toLowerCase(),
      userAgent
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { driver, error } = await getDriverIdentity(request);

    if (error) {
      return error;
    }

    if (!driver?.email) {
      return NextResponse.json({ error: "Driver account email is required." }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const endpoint = parsePushEndpoint(body?.endpoint);

    if (!endpoint) {
      return NextResponse.json({ error: "Push subscription endpoint is required." }, { status: 400 });
    }

    await deleteDriverPushSubscription(endpoint, driver.email.toLowerCase());

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
