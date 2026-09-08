self.addEventListener("push", function (event) {
  if (!event.data) {
    return;
  }

  const data = event.data.json();

  const title = data.title || "Fawaid";

  const options = {
    body: data.body || "Ada update terbaru di Fawaid.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url =
    event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then(function (clientList) {

      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }

    })
  );
});