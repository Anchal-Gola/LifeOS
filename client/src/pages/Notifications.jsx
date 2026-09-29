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
import { sendTestPushNotification } from "../api/pushSubscriptionApi";

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
      console.error("Mark notification read error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();

    if (granted) {
      alert("Notifications enabled.");
    } else {
      alert("Notification permission was not granted.");
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

  const handleTestPush = async () => {
    try {
      const response = await sendTestPushNotification();
      console.log("Test push response:", response);
    } catch (error) {
      console.error("Test push failed:", error);
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

  const getNotificationStyle = () => {
    return "bg-gradient-to-br from-violet-50 to-pink-50 text-purple-600 dark:from-purple-500/10 dark:to-pink-500/10 dark:text-purple-300";
  };

  const getTypeLabel = (type) => {
    if (type === "task") return "Task";
    if (type === "habit") return "Habit";
    if (type === "goal") return "Goal";
    if (type === "calendar") return "Calendar";
    if (type === "study") return "Study";
    return "LifeOS";
  };

  return (
    <MainLayout>
      <div className="relative min-h-full overflow-hidden bg-[#f8f7ff] px-4 py-6 text-slate-900 transition-colors dark:bg-[#100d18] dark:text-white sm:px-6 lg:px-8">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-600/10" />
        <div className="pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-pink-300/15 blur-3xl dark:bg-pink-600/10" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-300/10 blur-3xl dark:bg-fuchsia-600/10" />

        <div className="relative mx-auto max-w-6xl">

          {/* Header */}
          <div className="relative mb-8 overflow-hidden rounded-[30px] border border-purple-100 bg-white/90 shadow-[0_20px_60px_rgba(124,58,237,0.10)] backdrop-blur-xl dark:border-purple-500/15 dark:bg-[#17121f]/90 dark:shadow-[0_20px_60px_rgba(168,85,247,0.08)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />

            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-purple-400/15 blur-3xl dark:bg-purple-500/10" />
            <div className="pointer-events-none absolute bottom-[-80px] right-32 h-44 w-44 rounded-full bg-pink-400/10 blur-3xl dark:bg-pink-500/10" />

            <div className="relative flex flex-col gap-6 px-6 py-7 sm:px-8 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_9px_rgba(168,85,247,0.9)]" />
                  Notification Center
                </div>

                <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl dark:text-white">
                  Stay in the loop
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                  Keep track of important updates, reminders and activity
                  across your LifeOS.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-purple-100 bg-purple-50/80 px-5 py-3 shadow-sm dark:border-purple-500/15 dark:bg-purple-500/[0.08]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Unread
                  </p>

                  <p className="mt-1 text-xl font-bold text-purple-700 dark:text-purple-300">
                    {unreadCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-purple-50 px-5 py-3 shadow-sm dark:border-pink-500/15 dark:from-pink-500/[0.08] dark:to-purple-500/[0.08]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                    Total
                  </p>

                  <p className="mt-1 text-xl font-bold text-pink-700 dark:text-pink-300">
                    {notifications.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">

            <button
              onClick={handleEnableNotifications}
              className="group relative overflow-hidden rounded-[22px] border border-purple-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/10 dark:border-purple-500/10 dark:bg-[#17121f] dark:hover:border-purple-500/20"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-purple-200/20 blur-2xl dark:bg-purple-500/10" />

              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-xl text-white shadow-md shadow-purple-500/20">
                  🔔
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Browser Notifications
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  Receive LifeOS alerts directly in your browser.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Enable →
                </span>
              </div>
            </button>

            <button
              onClick={handleEnableSound}
              className="group relative overflow-hidden rounded-[22px] border border-pink-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-500/10 dark:border-pink-500/10 dark:bg-[#17121f] dark:hover:border-pink-500/20"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-pink-200/20 blur-2xl dark:bg-pink-500/10" />

              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-xl text-white shadow-md shadow-pink-500/20">
                  🔊
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Notification Sound
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  Enable sound alerts for important LifeOS events.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-pink-600 dark:text-pink-400">
                  Enable →
                </span>
              </div>
            </button>

            <button
              onClick={handleTestPush}
              className="group relative overflow-hidden rounded-[22px] border border-fuchsia-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-200 hover:shadow-lg hover:shadow-fuchsia-500/10 dark:border-fuchsia-500/10 dark:bg-[#17121f] dark:hover:border-fuchsia-500/20"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-fuchsia-200/20 blur-2xl dark:bg-fuchsia-500/10" />

              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-pink-500 text-xl text-white shadow-md shadow-fuchsia-500/20">
                  ⚡
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Test Push
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  Send a test push notification to verify your setup.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-400">
                  Send test →
                </span>
              </div>
            </button>
          </div>

          {/* Notifications */}
          <div className="relative overflow-hidden rounded-[26px] border border-purple-100 bg-white p-4 shadow-sm dark:border-white/[0.07] dark:bg-[#17121f] sm:p-6">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-purple-200/10 blur-3xl dark:bg-purple-500/[0.06]" />

            <div className="relative mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recent activity
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your latest LifeOS notifications
                </p>
              </div>

              {unreadCount > 0 && (
                <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50 px-6 py-16 text-center dark:border-purple-500/[0.15] dark:from-purple-500/[0.04] dark:to-pink-500/[0.03]">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 text-2xl text-white shadow-lg shadow-purple-500/20">
                  🔔
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  You're all caught up
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  New task, habit, goal and study updates will appear here.
                </p>
              </div>
            ) : (
              <div className="relative space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`group relative overflow-hidden rounded-2xl border p-4 transition sm:p-5 ${
                      notification.isRead
                        ? "border-slate-100 bg-white hover:border-purple-100 hover:shadow-sm dark:border-white/[0.06] dark:bg-white/[0.015] dark:hover:border-purple-500/15"
                        : "border-purple-100 bg-gradient-to-r from-purple-50/70 via-white to-pink-50/40 shadow-sm shadow-purple-500/5 hover:border-purple-200 dark:border-purple-500/20 dark:from-purple-500/[0.07] dark:via-white/[0.02] dark:to-pink-500/[0.05]"
                    }`}
                  >
                    {!notification.isRead && (
                      <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-violet-600 via-purple-500 to-pink-500" />
                    )}

                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg shadow-sm ${getNotificationStyle(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {notification.title}
                              </h3>

                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_7px_rgba(168,85,247,0.8)]" />
                              )}

                              <span className="rounded-full border border-purple-100 bg-purple-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-purple-500 dark:border-purple-500/15 dark:bg-purple-500/10 dark:text-purple-300">
                                {getTypeLabel(notification.type)}
                              </span>
                            </div>

                            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                              {notification.message}
                            </p>

                            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {!notification.isRead && (
                              <button
                                onClick={() =>
                                  handleMarkRead(notification._id)
                                }
                                className="rounded-xl border border-purple-100 px-3 py-2 text-xs font-semibold text-purple-600 transition hover:bg-purple-50 dark:border-purple-500/20 dark:text-purple-400 dark:hover:bg-purple-500/10"
                              >
                                Mark read
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleDelete(notification._id)
                              }
                              className="rounded-xl border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
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
      </div>
    </MainLayout>
  );
}

export default Notifications;