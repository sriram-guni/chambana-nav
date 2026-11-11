// Illini Wayfinder's service worker. For now it only lets reminders show as system notifications
// (Chrome on Android shows them only through a service worker) and brings the app forward when one
// is tapped. It doesn't cache anything, so the app loads exactly as it would without it.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      if (windows.length > 0) return windows[0].focus();
      return self.clients.openWindow(self.registration.scope);
    })(),
  );
});
