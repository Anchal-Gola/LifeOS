
import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
import { AuthContext } from "./context/AuthContext";
import { getSchedules } from "./api/scheduleApi";
import Analytics from "./pages/Analytics";

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

import { subscribeToPushNotifications } from "./services/pushSubscriptionService";
import { sendPresenceHeartbeat } from "./api/presenceApi";

function App() {
  const [reminder, setReminder] = useState(null);
  const { user, loading } = useContext(AuthContext);

  // Subscribe the logged-in user to Web Push
  useEffect(() => {
    if (loading || !user) {
      return;
    }

    subscribeToPushNotifications().catch((error) => {
      console.error(
        "Unable to subscribe to push notifications:",
        error
      );
    });
  }, [user, loading]);

  // Tell the backend that LifeOS is currently open
  useEffect(() => {
    if (loading || !user) {
      return;
    }

    const sendHeartbeat = () => {
      sendPresenceHeartbeat().catch((error) => {
        console.error("Presence heartbeat failed:", error);
      });
    };

    sendHeartbeat();

    const heartbeatInterval = setInterval(sendHeartbeat, 10000);

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [user, loading]);

  // Existing schedule reminder system
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

        setReminder(reminderData);
        showBrowserNotification(reminderData);

        if (schedule.soundEnabled) {
          await playNotificationSound();
        }

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

        setReminder(alarmData);
        showBrowserNotification(alarmData);

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
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route path="/tasks" element={<Tasks />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/study" element={<Study />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route
          path="/study-workspace"
          element={<StudyWorkspace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;