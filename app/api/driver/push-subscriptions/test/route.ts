import { NextRequest, NextResponse } from "next/server";
import { getDriverIdentity } from "@/lib/auth/driver";
import { errorResponse } from "@/lib/http";
import { notifyDriverWithTestAlert } from "@/lib/notifications/web-push";
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
      keyPrefix: "driver-push-test",
      limit: 8,
      windowMs: 60 * 60 * 1000
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await notifyDriverWithTestAlert(driver.email.toLowerCase(), request.nextUrl.origin);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
