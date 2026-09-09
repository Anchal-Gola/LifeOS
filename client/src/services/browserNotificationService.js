export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn(
      "Browser notifications are not supported."
    );
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission =
    await Notification.requestPermission();

  return permission === "granted";
};

export const showBrowserNotification = ({
  title,
  message,
  link = "/notifications",
}) => {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification(title, {
    body: message,
    icon: "/favicon.ico",

    // IMPORTANT:
    // Disable the browser's own notification sound.
    silent: true,

    // Keep the notification visible
    // until the user interacts with it.
    requireInteraction: true,
  });

  notification.onclick = () => {
    window.focus();

    if (link) {
      window.location.href = link;
    }

    notification.close();
  };

  notification.onerror = (error) => {
    console.error(
      "Browser notification error:",
      error
    );
  };
};