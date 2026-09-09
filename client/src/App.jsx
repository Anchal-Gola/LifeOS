import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";
import Calendar from "./pages/Calendar";
import Journal from "./pages/Journal";
import Notes from "./pages/Notes";
import Study from "./pages/Study";
import Documents from "./pages/Documents";
import Notifications from "./pages/Notifications";
import AIAssistant from "./pages/AIAssistant";
import StudyWorkspace from "./pages/StudyWorkspace";

import ReminderPopup from "./components/ReminderPopup";

import { getSchedules } from "./api/scheduleApi";

import {
  startScheduleReminderService,
  stopScheduleReminderService,
} from "./services/scheduleReminderService";

import { createNotification } from "./api/notificationApi";
import { showBrowserNotification } from "./services/browserNotificationService";

import {
  playNotificationSound,
  startAlarm,
  stopAlarm,
} from "./services/soundService";

function App() {
  const [reminder, setReminder] = useState(null);

  useEffect(() => {
    startScheduleReminderService({
      getSchedules,

      onReminder: async (schedule) => {
        const reminderData = {
          title: schedule.title,
          message: `Your scheduled activity starts in ${schedule.reminderMinutes} minutes.`,
          type: schedule.sourceType,
          link:
            schedule.sourceType === "calendar"
              ? "/calendar"
              : "/dashboard",
        };

        // Show the reminder immediately
        setReminder(reminderData);

        // Native browser notification
        showBrowserNotification(reminderData);

        // Play custom notification sound immediately
        if (schedule.soundEnabled) {
          await playNotificationSound();
        }

        // Save notification history separately
        try {
          await createNotification(reminderData);
        } catch (error) {
          console.error(
            "Create schedule notification error:",
            error
          );
        }
      },

      onAlarm: async (schedule) => {
        const alarmData = {
          title: `⏰ ${schedule.title}`,
          message: "It's time to start now.",
          type: schedule.sourceType,
          link:
            schedule.sourceType === "calendar"
              ? "/calendar"
              : "/dashboard",
        };

        // Show exact-time reminder
        setReminder(alarmData);

        // Native browser notification
        showBrowserNotification(alarmData);

        // Start repeating alarm
        if (schedule.alarmEnabled) {
          await startAlarm();
        }
      },

      onScheduleRemoved: () => {
        stopAlarm();
        setReminder(null);
      },
    });

    return () => {
      stopScheduleReminderService();
      stopAlarm();
    };
  }, []);

  return (
    <BrowserRouter>
      <ReminderPopup
        reminder={reminder}
        onClose={() => {
          stopAlarm();
          setReminder(null);
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/study" element={<Study />} />
        <Route path="/documents" element={<Documents />} />
        <Route
          path="/notifications"
          element={<Notifications />}
        />
        <Route
          path="/ai-assistant"
          element={<AIAssistant />}
        />
        <Route
          path="/study-workspace"
          element={<StudyWorkspace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;