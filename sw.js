/* LightOn Academy — service worker
 * - The app shell (screens, icons) is cached so the app opens instantly and works offline.
 * - Pages are fetched fresh when online (network first), falling back to the cached copy offline.
 * - Requests to the server (Apps Script) are never cached here; the app keeps its own "last saved" copy.
 * Bump VERSION whenever you upload new files so phones pick up the update.
 */
var VERSION = 'lighton-v6.1.1';
var SHELL = ['./', 'index.html', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (e) { if (e.data === 'skipWaiting') self.skipWaiting(); });

function networkFirst(req, fallbackUrl) {
  return fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(fallbackUrl || req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(fallbackUrl || req, { ignoreSearch: true }).then(function (r) { return r || caches.match('index.html'); });
  });
}

function staleWhileRevalidate(req) {
  return caches.open(VERSION).then(function (c) {
    return c.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(function () { return hit; });
      return hit || net;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;                                  // server calls (POST) go straight to the network
  var url = new URL(req.url);
  if (url.hostname.indexOf('google.com') >= 0 || url.hostname.indexOf('googleusercontent.com') >= 0) return;
  if (req.mode === 'navigate') { e.respondWith(networkFirst(req, 'index.html')); return; }
  if (url.origin === location.origin) {
    if (/config\.js$/.test(url.pathname)) {   // always the latest config (never an old saved copy)
      e.respondWith(fetch(new Request(req.url, { cache: 'no-store' })).then(function (res) {
        if (res && res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put('config.js', copy); }); }
        return res;
      }).catch(function () { return caches.match('config.js', { ignoreSearch: true }); }));
      return;
    }
    e.respondWith(caches.match(req).then(function (r) { return r || networkFirst(req); }));
    return;
  }

});
