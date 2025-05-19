/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(({ request, url }) => {
  if (request.mode !== 'navigate') return false;
  if (url.pathname.startsWith('/_')) return false;
  if (url.pathname.match(fileExtensionRegexp)) return false;
  return true;
}, createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'));

registerRoute(
  ({ url }) => url.pathname.endsWith('.png') || url.pathname.endsWith('.ico'),
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 35 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.endsWith('.json'),
  new CacheFirst({
    cacheName: 'json-files',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 35 * 24 * 60 * 60,
      }),
    ],
  })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
