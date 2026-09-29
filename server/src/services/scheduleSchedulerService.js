import {
  getSchedulesForScheduler,
  markReminderTriggered,
  markAlarmTriggered,
} from "../repositories/scheduleRepository.js";

import {
  sendPushToUserService,
} from "./pushNotificationService.js";

import {
  isUserActive,
} from "./userPresenceService.js";

const CHECK_INTERVAL = 10000;
const LOOK_AHEAD_MINUTES = 15;

let schedulerInterval = null;
let schedulerRunning = false;

const processSchedules = async () => {
  try {
    const now = new Date();

    const schedules =
      await getSchedulesForScheduler(
        now,
        LOOK_AHEAD_MINUTES
      );

    for (const schedule of schedules) {
      const userId =
        schedule.user.toString();

      const scheduledTime = new Date(
        schedule.scheduledFor
      );

      const reminderMinutes = Number(
        schedule.reminderMinutes || 0
      );

      const reminderTime = new Date(
        scheduledTime.getTime() -
          reminderMinutes * 60 * 1000
      );

      const userIsActive =
        isUserActive(userId);

      // =========================
      // REMINDER
      // =========================

      if (
        schedule.notificationEnabled &&
        reminderMinutes > 0 &&
        now >= reminderTime &&
        now < scheduledTime &&
        !schedule.reminderTriggered
      ) {
        // When LifeOS is open, the frontend
        // handles the reminder.
        if (userIsActive) {
          console.log(
            `🔔 User active, waiting for frontend reminder: ${schedule.title}`
          );

          continue;
        }

        // User is offline, so claim the reminder
        // and send the Web Push notification.
        const claimedSchedule =
          await markReminderTriggered(
            schedule._id
          );

        if (!claimedSchedule) {
          continue;
        }

        await sendPushToUserService(
          userId,
          {
            title: schedule.title,

            message:
              `Your scheduled activity starts in ${reminderMinutes} minutes.`,

            link:
              schedule.sourceType ===
              "calendar"
                ? "/calendar"
                : "/dashboard",
          }
        );

        console.log(
          `🔔 Offline reminder push sent: ${schedule.title}`
        );
      }

      // =========================
      // EXACT-TIME ALARM
      // =========================

      if (
        schedule.alarmEnabled &&
        now >= scheduledTime &&
        !schedule.alarmTriggered
      ) {
        // When LifeOS is open, the frontend
        // handles the alarm.
        if (userIsActive) {
          console.log(
            `⏰ User active, waiting for frontend alarm: ${schedule.title}`
          );

          continue;
        }

        // User is offline, so claim the alarm
        // and send the Web Push notification.
        const claimedSchedule =
          await markAlarmTriggered(
            schedule._id
          );

        if (!claimedSchedule) {
          continue;
        }

        await sendPushToUserService(
          userId,
          {
            title:
              `⏰ ${schedule.title}`,

            message:
              "It's time to start now.",

            link:
              schedule.sourceType ===
              "calendar"
                ? "/calendar"
                : "/dashboard",
          }
        );

        console.log(
          `⏰ Offline alarm push sent: ${schedule.title}`
        );
      }
    }
  } catch (error) {
    console.error(
      "Schedule scheduler error:",
      error
    );
  }
};

export const startScheduleScheduler = () => {
  if (schedulerRunning) {
    return;
  }

  schedulerRunning = true;

  console.log(
    "🕐 LifeOS schedule scheduler started"
  );

  processSchedules();

  schedulerInterval = setInterval(
    processSchedules,
    CHECK_INTERVAL
  );
};

export const stopScheduleScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }

  schedulerRunning = false;

  console.log(
    "🛑 LifeOS schedule scheduler stopped"
  );
};