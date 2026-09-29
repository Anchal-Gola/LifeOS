import {
  getVapidPublicKey,
  savePushSubscription,
} from "../api/pushSubscriptionApi";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  );

  const base64 = (
    base64String +
    padding
  )
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) =>
      char.charCodeAt(0)
    )
  );
};

export const subscribeToPushNotifications =
  async () => {
    try {
      if (!("serviceWorker" in navigator)) {
        throw new Error(
          "Service Worker is not supported."
        );
      }

      if (!("PushManager" in window)) {
        throw new Error(
          "Push notifications are not supported."
        );
      }

      const registration =
        await navigator.serviceWorker.ready;

      const response =
        await getVapidPublicKey();

      const publicKey =
        response?.data?.publicKey;

      if (!publicKey) {
        throw new Error(
          "VAPID public key was not received."
        );
      }

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription =
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              urlBase64ToUint8Array(publicKey),
          });
      }

      await savePushSubscription(
        subscription.toJSON()
      );

      return subscription;
    } catch (error) {
      console.error(
        "Push subscription error:",
        error
      );

      throw error;
    }
  };