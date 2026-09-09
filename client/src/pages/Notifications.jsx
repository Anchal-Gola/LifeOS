import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../api/notificationApi";

import {
  requestNotificationPermission,
} from "../services/browserNotificationService";

import { enableSound } from "../services/soundService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.data || []);
    } catch (error) {
      console.error("Notifications error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );
    }
  };

  const handleEnableNotifications = async () => {
    const granted =
      await requestNotificationPermission();

    if (granted) {
      alert("Notifications enabled.");
    } else {
      alert(
        "Notification permission was not granted."
      );
    }
  };

  const handleEnableSound = async () => {
    const enabled = await enableSound();

    if (enabled) {
      alert("Sound enabled.");
    } else {
      alert("Sound could not be enabled.");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const getNotificationIcon = (type) => {
    if (type === "task") return "✓";
    if (type === "habit") return "🔥";
    if (type === "goal") return "🎯";
    if (type === "calendar") return "📅";
    if (type === "study") return "📚";

    return "🔔";
  };

  const getNotificationStyle = (type) => {
    if (type === "task") {
      return "bg-blue-50 text-blue-600";
    }

    if (type === "habit") {
      return "bg-orange-50 text-orange-600";
    }

    if (type === "goal") {
      return "bg-purple-50 text-purple-600";
    }

    if (type === "calendar") {
      return "bg-pink-50 text-pink-600";
    }

    if (type === "study") {
      return "bg-green-50 text-green-600";
    }

    return "bg-slate-50 text-slate-600";
  };

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/40 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-purple-600">
                Stay up to date
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-2 text-slate-500">
                Keep track of important updates from your LifeOS.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleEnableNotifications}
                className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
              >
                Enable Notifications
              </button>

              <button
                onClick={handleEnableSound}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
              >
                Enable Sound
              </button>

              <div className="rounded-2xl border border-purple-100 bg-white px-5 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Unread
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {unreadCount} notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          {notifications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                🔔
              </div>

              <h3 className="font-semibold text-slate-900">
                No notifications
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                You're all caught up.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                    notification.isRead
                      ? "border-slate-100"
                      : "border-purple-100 bg-purple-50/20"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${getNotificationStyle(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">
                              {notification.title}
                            </h3>

                            {!notification.isRead && (
                              <span className="h-2 w-2 rounded-full bg-purple-500" />
                            )}
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {notification.message}
                          </p>

                          <p className="mt-2 text-xs text-slate-400">
                            {new Date(
                              notification.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() =>
                                handleMarkRead(
                                  notification._id
                                )
                              }
                              className="rounded-lg px-3 py-1.5 text-sm font-medium text-purple-600 transition hover:bg-purple-50"
                            >
                              Mark read
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleDelete(
                                notification._id
                              )
                            }
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Notifications;