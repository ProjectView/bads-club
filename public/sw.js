/**
 * Service Worker — Bad's Club PWA.
 *
 * Responsabilités :
 *   1. Cache "stale-while-revalidate" sur les pages et assets statiques
 *      → l'app reste consultable hors-ligne (consulter ses réservations, naviguer).
 *   2. Réception des messages Web Push (FCM en prod) et affichage de notifs natives.
 *   3. Routing du clic notif vers le bon deep link.
 */

const CACHE_NAME = "bads-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.svg",
  "/icon-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Skip API routes and Next.js internals
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/data/")) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(req);
      const fetchPromise = fetch(req)
        .then((res) => {
          // On ne met en cache que les réponses OK pour éviter les 5xx empoisonnés.
          if (res && res.status === 200 && res.type === "basic") {
            cache.put(req, res.clone());
          }
          return res;
        })
        .catch(() => cached); // offline : on retombe sur le cache
      return cached || fetchPromise;
    })
  );
});

// -----------------------------------------------------------------------------
// Web Push (FCM) — câblé en PROD via Firebase Cloud Functions
// -----------------------------------------------------------------------------
// Ce handler reste prêt pour la prod. En maquette, on n'envoie pas de push OS :
// les notifications sont affichées via le composant ToastHost in-app.

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); } catch { return; }
  if (!payload?.title) return;

  event.waitUntil(self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: "/icon-192.svg",
    badge: "/icon-192.svg",
    tag: payload.tag || "bads-notif",
    data: { url: payload.url || "/" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(self.location.origin));
      if (existing) { existing.focus(); return existing.navigate(url); }
      return self.clients.openWindow(url);
    })
  );
});
