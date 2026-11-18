// Chambana Nav's service worker. It lets reminders show as system notifications (Chrome on Android
// shows them only through a service worker), shows push notifications sent by the server (the
// Cloudflare Worker, through Firebase Cloud Messaging) even when the app is closed, and brings the
// app forward when one is tapped. It doesn't cache anything, so the app loads exactly as it would
// without it.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// A push from the server: Firebase Cloud Messaging wraps the message's data as { data: {...} }.
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }
  const message = payload.data ?? payload;
  const title = typeof message.title === "string" && message.title ? message.title : "Chambana Nav";
  const body = typeof message.body === "string" ? message.body : "";
  event.waitUntil(
    self.registration.showNotification(title, { body, tag: typeof message.tag === "string" ? message.tag : undefined, icon: "./logo.svg" }),
  );
});

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
