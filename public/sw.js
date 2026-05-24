const CACHE_VERSION = "pickupdxb-v2";
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const APP_SHELL_URLS = ["/", "/driver", "/manifest.webmanifest", "/pwa-icon.svg", "/pwa-maskable.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![APP_SHELL_CACHE, STATIC_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/public/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".webmanifest")
  ) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

self.addEventListener("push", (event) => {
  const data = getPushData(event);

  event.waitUntil(
    self.registration.showNotification(data.title || "New PickUp DXB booking", {
      badge: "/pwa-icon.svg",
      body: data.body || "A new customer booking is waiting.",
      data: {
        url: sanitizeNotificationUrl(data.url)
      },
      icon: "/pwa-icon.svg",
      renotify: true,
      requireInteraction: true,
      tag: data.tag || (data.bookingId ? `booking-${data.bookingId}` : "new-booking")
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = sanitizeNotificationUrl(event.notification.data?.url);

  event.waitUntil(
    clients.matchAll({ includeUncontrolled: true, type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if ("navigate" in client && "focus" in client) {
          return client.navigate(targetUrl).then((focusedClient) => {
            if (focusedClient) {
              return focusedClient.focus();
            }

            return client.focus();
          });
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});

async function networkFirst(request) {
  const cache = await caches.open(APP_SHELL_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cachedResponse = await cache.match(request);
    return cachedResponse || cache.match("/driver") || cache.match("/");
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

function getPushData(event) {
  if (!event.data) {
    return {};
  }

  try {
    return event.data.json();
  } catch {
    return {
      body: event.data.text()
    };
  }
}

function sanitizeNotificationUrl(url) {
  try {
    const targetUrl = new URL(url || "/driver", self.location.origin);

    if (targetUrl.origin !== self.location.origin) {
      return `${self.location.origin}/driver`;
    }

    return targetUrl.href;
  } catch {
    return `${self.location.origin}/driver`;
  }
}
