import webPush from "web-push";
import type { Booking } from "@/lib/bookings/types";
import { ValidationError } from "@/lib/bookings/validation";
import {
  deleteDriverPushSubscription,
  listDriverPushSubscriptions,
  type StoredPushSubscription
} from "./push-subscriptions";

type PushPayload = {
  body: string;
  bookingId?: number;
  tag: string;
  title: string;
  url: string;
};

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;
let didConfigureWebPush = false;

export function hasWebPushConfig() {
  return Boolean(vapidPublicKey && vapidPrivateKey && vapidSubject);
}

export async function notifyDriversAboutNewBooking(booking: Booking, origin: string) {
  if (!configureWebPush()) {
    console.warn("Driver push notifications are not configured. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.");
    return;
  }

  const subscriptions = await listDriverPushSubscriptions();

  if (subscriptions.length === 0) {
    return;
  }

  await sendPushNotifications(subscriptions, {
    title: "New pickup booking",
    body: `${booking.pickup_location} to ${booking.drop_location}`,
    bookingId: booking.id,
    tag: `booking-${booking.id}`,
    url: `${origin}/driver?booking=${booking.id}`
  });
}

export async function notifyDriverWithTestAlert(driverEmail: string, origin: string) {
  if (!configureWebPush()) {
    throw new ValidationError("Driver push notifications are not configured.");
  }

  const subscriptions = await listDriverPushSubscriptions(driverEmail);

  if (subscriptions.length === 0) {
    throw new ValidationError("No push subscription is enabled for this driver.");
  }

  await sendPushNotifications(subscriptions, {
    title: "PickUp DXB alerts enabled",
    body: "New booking notifications will appear here.",
    tag: "driver-test-alert",
    url: `${origin}/driver`
  });
}

async function sendPushNotifications(subscriptions: StoredPushSubscription[], payload: PushPayload) {
  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.auth,
              p256dh: subscription.p256dh
            }
          },
          JSON.stringify(payload),
          {
            TTL: 60 * 60
          }
        );
      } catch (error) {
        if (isExpiredSubscription(error)) {
          await deleteDriverPushSubscription(subscription.endpoint);
          return;
        }

        throw error;
      }
    })
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Could not send driver push notification.", result.reason);
    }
  });
}

function configureWebPush() {
  if (!vapidSubject) {
    throw new ValidationError("VAPID_SUBJECT is required for driver push notifications.");
  }

  if (!hasWebPushConfig()) {
    return false;
  }

  if (!didConfigureWebPush) {
    webPush.setVapidDetails(vapidSubject, vapidPublicKey!, vapidPrivateKey!);
    didConfigureWebPush = true;
  }

  return true;
}

function isExpiredSubscription(error: unknown) {
  if (!error || typeof error !== "object" || !("statusCode" in error)) {
    return false;
  }

  const statusCode = (error as { statusCode?: unknown }).statusCode;
  return statusCode === 404 || statusCode === 410;
}
