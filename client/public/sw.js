self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener("push", (event) => {
  let data = {
    title: "LifeOS",
    message: "You have a LifeOS notification.",
    link: "/notifications",
  };

  try {
    if (event.data) {
      const text = event.data.text();

      try {
        data = JSON.parse(text);
      } catch {
        data.message = text;
      }
    }
  } catch (error) {
    console.error(
      "Push message parsing error:",
      error
    );
  }

  const title = data.title || "LifeOS";

  const options = {
    body:
      data.message ||
      "You have a LifeOS notification.",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: {
      link:
        data.link ||
        "/notifications",
    },
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );
});

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const link =
      event.notification.data?.link ||
      "/notifications";

    event.waitUntil(
      self.clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (const client of clientList) {
            if ("focus" in client) {
              client.navigate(link);
              return client.focus();
            }
          }

          if (self.clients.openWindow) {
            return self.clients.openWindow(link);
          }
        })
    );
  }
);