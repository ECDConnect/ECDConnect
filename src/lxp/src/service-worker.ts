/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkOnly, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { PrecacheEntry } from 'workbox-precaching/_types';

declare const self: ServiceWorkerGlobalScope;

const log = (msg: string) => {
  console.log(`[SW] ${msg}`);
};

log('Installing');

clientsClaim();

const wb_manifest = [
  // {
  //   revision: null as any as string,
  //   url: '/settings.json',
  // } as PrecacheEntry,
  {
    revision: null as any as string,
    url: '/manifest.json',
  } as PrecacheEntry,
  ...self.__WB_MANIFEST,
];
precacheAndRoute(wb_manifest);

// Theme (and any other blob) JSON: online -> fresh from network (auto-cached),
// offline -> served from the 'json-files' cache. Registered BEFORE the
// NetworkOnly / images routes so it wins the match for blob .json requests.
registerRoute(
  ({ url }) =>
    url.hostname.includes('blob.core.windows.net') &&
    url.pathname.endsWith('.json'),
  new NetworkFirst({
    cacheName: 'json-files',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// NetworkOnly only for this specific asset. Blob assets are intentionally NOT
// matched here so they fall through to the caching routes below (images /
// json-files) and remain available offline.
registerRoute(
  ({ url }) => url.href.includes('ecdconnect_logo_long.png'),
  new NetworkOnly() // or new StaleWhileRevalidate() if you want light caching
);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(({ request, url }) => {
  if (request.mode !== 'navigate') return false;
  if (url.pathname.startsWith('/_')) return false;
  if (url.pathname.match(fileExtensionRegexp)) return false;
  return true;
}, createHandlerBoundToURL(import.meta.env.BASE_URL + 'index.html'));

registerRoute(
  ({ url, request }) => {
    // Cross-origin CORS requests (fetch, cache.addAll, <img crossorigin>) must
    // not get the opaque no-cors response below: the browser rejects it as a
    // network error. Let them go to the network; blob storage allows CORS.
    if (request.mode === 'cors' && url.origin !== self.location.origin) {
      return false;
    }
    return (
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.ico') ||
      url.pathname.endsWith('.svg') ||
      url.hostname.includes('blob.core.windows.net')
    );
  },
  new CacheFirst({
    cacheName: 'images',
    fetchOptions: {
      mode: 'no-cors', // lets <img> loads of blobs be cached offline
    },
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 35 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      {
        cacheWillUpdate: async ({ response }) => {
          if (response.status === 200 || response.status === 0) {
            return response;
          }
          return null;
        },
      },
    ],
  })
);

registerRoute(
  ({ url, request }) => {
    const cache = url.pathname.endsWith('.json');
    // log(
    //   `[ServiceWorker] Checking json: ${url.href}, cache: ${
    //     cache ? 'Y' : 'N'
    //   }, destination: ${request.destination}, mode: ${request.mode}`
    // );
    return cache;
  },
  new CacheFirst({
    cacheName: 'json-files',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 35 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      {
        cacheWillUpdate: async ({ response }) => {
          // log(
          //   `[ServiceWorker] Cache update for ${response.url}, status: ${response.status}, type: ${response.type}`
          // );
          if (response.status === 200 || response.status === 0) {
            return response;
          }
          return null;
        },
      },
    ],
  })
);

// Optional: Cache fonts
registerRoute(
  ({ url, request }) => {
    const isFont =
      url.pathname.endsWith('.woff2') ||
      url.href.startsWith('https://fonts.googleapis.com/css2');
    // log(
    //   `[ServiceWorker] Checking font: ${url.href}, isFont: ${isFont}, destination: ${request.destination}, mode: ${request.mode}`
    // );
    return isFont;
  },
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 35 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      {
        cacheWillUpdate: async ({ response }) => {
          // log(
          //   `[ServiceWorker] Cache update for ${response.url}, status: ${response.status}, type: ${response.type}`
          // );
          if (response.status === 200 || response.status === 0) {
            return response;
          }
          return null;
        },
      },
    ],
  })
);

/*
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('ecdconnect_logo_long.png')) {
    log(`[ServiceWorker] Fetch intercepted for ${event.request.url}, destination: ${event.request.destination}, mode: ${event.request.mode}`);
    event.respondWith(
      caches.open('images').then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            log(`[ServiceWorker] Serving ${event.request.url} from cache`);
            return cachedResponse;
          }
          log(`[ServiceWorker] Fetching ${event.request.url} from network`);
          return fetch(event.request).then((networkResponse) => {
            log(`[ServiceWorker] Caching ${event.request.url}, status: ${networkResponse.status}`);
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch((error) => {
            console.error(`[ServiceWorker] Fetch failed for ${event.request.url}:`, error);
            throw error;
          });
        });
      })
    );
  }
});
*/

const broadcastOnlineStatus = async (isOnline: boolean) => {
  const allClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });
  allClients.forEach((client) => {
    client.postMessage({ type: 'SW_ONLINE_STATUS', isOnline });
  });
};

self.addEventListener('online', () => {
  log('online');
  broadcastOnlineStatus(true);
});

self.addEventListener('offline', () => {
  log('offline');
  broadcastOnlineStatus(false);
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'GET_ONLINE_STATUS' && event.source) {
    const client = event.source as Client;
    const probeUrl = (event.data?.pollUrl as string) || '/favicon.ico';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    // fetch() from within the SW bypasses its own routing — goes to real network
    fetch(probeUrl, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(() => {
        clearTimeout(timeoutId);
        client.postMessage({ type: 'SW_ONLINE_STATUS', isOnline: true });
      })
      .catch(() => {
        clearTimeout(timeoutId);
        client.postMessage({ type: 'SW_ONLINE_STATUS', isOnline: false });
      });
  }
});

self.addEventListener('install', (event) => {
  // Force the new service worker to activate immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  // Take control of all open clients (tabs / PWA windows) immediately
  event.waitUntil(self.clients.claim());
});

log('Installed');
