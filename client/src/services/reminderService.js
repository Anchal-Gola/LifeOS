const CHECK_INTERVAL = 5000;

const triggeredReminders = new Set();

const getServiceState = () => {
  if (!window.__lifeosReminderService) {
    window.__lifeosReminderService = {
      interval: null,
      checkRunning: false,
    };
  }

  return window.__lifeosReminderService;
};

export const startReminderService = ({
  getEvents,
  onReminder,
}) => {
  const service = getServiceState();

  if (service.interval) {
    return;
  }

  const checkReminders = async () => {
    if (service.checkRunning) {
      return;
    }

    service.checkRunning = true;

    try {
      const response = await getEvents();
      const events = response?.data || [];
      const now = Date.now();

      for (const event of events) {
        if (!event.startTime) continue;
        if (event.status === "completed") continue;
        if (event.reminderMinutes == null) continue;

        const eventTime = new Date(
          event.startTime
        ).getTime();

        if (Number.isNaN(eventTime)) continue;

        const reminderTime =
          eventTime -
          Number(event.reminderMinutes) * 60 * 1000;

        if (now >= eventTime) {
          continue;
        }

        const reminderId =
          `${event._id}-${reminderTime}`;

        if (triggeredReminders.has(reminderId)) {
          continue;
        }

        if (now >= reminderTime) {
          triggeredReminders.add(reminderId);

          await onReminder(event);
        }
      }
    } catch (error) {
      console.error(
        "Reminder service error:",
        error
      );
    } finally {
      service.checkRunning = false;
    }
  };

  checkReminders();

  service.interval = setInterval(
    checkReminders,
    CHECK_INTERVAL
  );
};

export const stopReminderService = () => {
  const service = getServiceState();

  if (service.interval) {
    clearInterval(service.interval);
    service.interval = null;
  }

  service.checkRunning = false;
};