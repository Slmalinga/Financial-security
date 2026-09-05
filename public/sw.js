// Minimal service worker for FinSight.
// A registered service worker is required for the app to qualify as an
// installable PWA (a prerequisite for wrapping it as a Trusted Web Activity).
// It uses a network-first strategy so users always get the latest deploy,
// with a cached fallback so the shell still opens offline.

const CACHE = 'finsight-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Never cache API calls (e.g. /api/advice) — always hit the network.
  if (request.method !== 'GET' || new URL(request.url).pathname.startsWith('/api/')) {
    return;
  }
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
  );
});
