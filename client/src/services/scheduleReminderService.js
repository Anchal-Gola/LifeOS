let serviceStarted = false;

const reminderTimers = new Map();
const alarmTimers = new Map();

let syncInterval = null;
let knownSchedules = new Map();

const clearScheduleTimers = () => {
  reminderTimers.forEach((timer) => clearTimeout(timer));
  alarmTimers.forEach((timer) => clearTimeout(timer));

  reminderTimers.clear();
  alarmTimers.clear();
};

const scheduleTimersForSchedules = ({
  schedules,
  onReminder,
  onAlarm,
}) => {
  const now = Date.now();

  schedules.forEach((schedule) => {
    if (!schedule.scheduledFor) return;
    if (schedule.status !== "scheduled") return;

    const scheduledTime = new Date(
      schedule.scheduledFor
    ).getTime();

    if (Number.isNaN(scheduledTime)) return;

    const scheduleId = schedule._id;

    knownSchedules.set(scheduleId, schedule);

    const reminderMinutes = Number(
      schedule.reminderMinutes || 0
    );

    if (
      schedule.notificationEnabled &&
      reminderMinutes > 0
    ) {
      const reminderTime =
        scheduledTime -
        reminderMinutes * 60 * 1000;

      if (
        reminderTime > now &&
        !reminderTimers.has(scheduleId)
      ) {
        const reminderTimer = setTimeout(() => {
          onReminder(schedule);
          reminderTimers.delete(scheduleId);
        }, reminderTime - now);

        reminderTimers.set(
          scheduleId,
          reminderTimer
        );
      }
    }

    if (
      schedule.alarmEnabled &&
      scheduledTime > now &&
      !alarmTimers.has(scheduleId)
    ) {
      const alarmTimer = setTimeout(() => {
        onAlarm(schedule);
        alarmTimers.delete(scheduleId);
      }, scheduledTime - now);

      alarmTimers.set(
        scheduleId,
        alarmTimer
      );
    }
  });
};

export const startScheduleReminderService = async ({
  getSchedules,
  onReminder,
  onAlarm,
  onScheduleRemoved,
}) => {
  if (serviceStarted) {
    return;
  }

  serviceStarted = true;

  const syncSchedules = async () => {
    try {
      const response = await getSchedules();

      const schedules = response?.data || [];

      const currentScheduleIds = new Set(
        schedules
          .filter(
            (schedule) =>
              schedule.status === "scheduled"
          )
          .map((schedule) => schedule._id)
      );

      // Detect deleted/completed/cancelled schedules
      knownSchedules.forEach(
        (schedule, scheduleId) => {
          if (!currentScheduleIds.has(scheduleId)) {
            const reminderTimer =
              reminderTimers.get(scheduleId);

            if (reminderTimer) {
              clearTimeout(reminderTimer);
              reminderTimers.delete(
                scheduleId
              );
            }

            const alarmTimer =
              alarmTimers.get(scheduleId);

            if (alarmTimer) {
              clearTimeout(alarmTimer);
              alarmTimers.delete(scheduleId);
            }

            if (onScheduleRemoved) {
              onScheduleRemoved(schedule);
            }

            knownSchedules.delete(
              scheduleId
            );
          }
        }
      );

      scheduleTimersForSchedules({
        schedules,
        onReminder,
        onAlarm,
      });
    } catch (error) {
      console.error(
        "Schedule sync error:",
        error
      );
    }
  };

  await syncSchedules();

  syncInterval = setInterval(() => {
    syncSchedules();
  }, 10000);
};

export const stopScheduleReminderService = () => {
  clearScheduleTimers();

  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }

  knownSchedules.clear();
  serviceStarted = false;
};