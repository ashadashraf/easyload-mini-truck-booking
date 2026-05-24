"use client";

import { useEffect, useState } from "react";

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const SERVICE_WORKER_READY_TIMEOUT_MS = 5000;

export function DriverPushNotifications({ driverAccessToken }: { driverAccessToken: string }) {
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isInstalledPwa, setIsInstalledPwa] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [message, setMessage] = useState("");
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriptionState() {
      if (!supportsPushNotifications()) {
        if (isMounted) {
          setIsSupported(false);
          setIsReady(true);
        }
        return;
      }

      if (isMounted) {
        setPermission(Notification.permission);
        setIsInstalledPwa(isRunningAsInstalledPwa());
      }

      try {
        const registration = await getReadyServiceWorkerRegistration();
        const subscription = await registration.pushManager.getSubscription();

        if (isMounted) {
          setIsSubscribed(Boolean(subscription));
        }
      } catch {
        if (isMounted) {
          setError("Booking alerts are available when the PWA service worker is running.");
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    loadSubscriptionState();

    return () => {
      isMounted = false;
    };
  }, []);

  async function enableAlerts() {
    setError("");
    setMessage("");
    setIsBusy(true);

    try {
      if (!supportsPushNotifications()) {
        throw new Error("This browser does not support PWA push notifications.");
      }

      if (!PUBLIC_VAPID_KEY) {
        throw new Error("Push notifications are not configured. Add NEXT_PUBLIC_VAPID_PUBLIC_KEY.");
      }

      const nextPermission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        throw new Error("Notification permission was not allowed for this device.");
      }

      const registration = await getReadyServiceWorkerRegistration();
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ||
        await registration.pushManager.subscribe({
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
          userVisibleOnly: true
        });

      const response = await fetch("/api/driver/push-subscriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${driverAccessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(subscription.toJSON())
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not enable booking alerts.");
      }

      setIsSubscribed(true);
      setMessage("Booking alerts are enabled for this device.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not enable booking alerts.");
    } finally {
      setIsBusy(false);
    }
  }

  async function disableAlerts() {
    setError("");
    setMessage("");
    setIsBusy(true);

    try {
      const registration = await getReadyServiceWorkerRegistration();
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const response = await fetch("/api/driver/push-subscriptions", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${driverAccessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || "Could not disable booking alerts.");
        }

        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      setMessage("Booking alerts are disabled on this device.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not disable booking alerts.");
    } finally {
      setIsBusy(false);
    }
  }

  async function sendTestAlert() {
    setError("");
    setMessage("");
    setIsBusy(true);

    try {
      const response = await fetch("/api/driver/push-subscriptions/test", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${driverAccessToken}`
        }
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not send a test alert.");
      }

      setMessage("Test alert sent.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send a test alert.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="driver-alerts">
      <div>
        <span className={`alert-status ${isSubscribed ? "enabled" : "disabled"}`}>
          {isSubscribed ? "Alerts on" : "Alerts off"}
        </span>
        <h3>New booking alerts</h3>
        <p>Get a PWA notification on this device whenever a customer creates a booking.</p>
      </div>

      {!isSupported ? (
        <p className="error">This browser does not support PWA push notifications.</p>
      ) : null}
      {permission === "denied" ? (
        <p className="error">Notifications are blocked. Allow notifications from browser settings to enable alerts.</p>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="success">{message}</p> : null}
      {!isInstalledPwa ? (
        <p className="driver-alert-hint">
          For closed-app alerts on mobile, install PickUp DXB and open it from the home screen.
        </p>
      ) : null}

      <div className="driver-alert-actions">
        {isSubscribed ? (
          <button disabled={isBusy || !isReady} onClick={disableAlerts} type="button">
            Disable alerts
          </button>
        ) : (
          <button className="primary" disabled={isBusy || !isReady || !isSupported} onClick={enableAlerts} type="button">
            Enable alerts
          </button>
        )}
        <button disabled={isBusy || !isSubscribed} onClick={sendTestAlert} type="button">
          Send test
        </button>
      </div>
    </div>
  );
}

function supportsPushNotifications() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "PushManager" in window &&
    "serviceWorker" in navigator
  );
}

async function getReadyServiceWorkerRegistration() {
  await ensureServiceWorkerRegistration();

  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<ServiceWorkerRegistration>((_resolve, reject) => {
      window.setTimeout(() => {
        reject(new Error("Service worker is not ready."));
      }, SERVICE_WORKER_READY_TIMEOUT_MS);
    })
  ]);
}

async function ensureServiceWorkerRegistration() {
  const existingRegistration = await navigator.serviceWorker.getRegistration("/");

  if (existingRegistration) {
    await existingRegistration.update().catch(() => undefined);
    return existingRegistration;
  }

  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

function isRunningAsInstalledPwa() {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}
