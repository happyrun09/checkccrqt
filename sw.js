/* CheckCCRQT v0.4.0 — Offline-First PWA Service Worker */
const CACHE_NAME = "checkccrqt-v040-shell-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/logo_kiemlam.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
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

  // Never intercept AI API POSTs or third-party auth endpoints
  const url = new URL(req.url);
  if (url.hostname.includes("googleapis.com") && url.pathname.includes("generateContent")) return;
  if (url.hostname.includes("api.deepseek.com") || url.hostname.includes("api.openai.com")) return;

  // Network-first for HTML/JS/CSS, fallback to cache when offline in the forest
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && (url.origin === self.location.origin || url.hostname.includes("unpkg.com") || url.hostname.includes("jsdelivr.net") || url.hostname.includes("cdnjs.cloudflare.com"))) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
  );
});
