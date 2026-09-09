import { useEffect, useMemo, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../api/eventApi";

import {
  getSchedules,
  updateSchedule,
  deleteSchedule,
} from "../api/scheduleApi";

import { createSchedule } from "../api/scheduleApi";

function Calendar() {
  const [events, setEvents] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState(10);

  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data.data || []);
    } catch (error) {
      console.error("Events error:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setReminderMinutes(10);
    setEditingEvent(null);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!title.trim() || !startTime) {
      return;
    }

    try {
      const eventResponse = await createEvent({
        title,
        description,
        startTime,
        endTime: endTime || undefined,
        location,
        reminderMinutes: Number(reminderMinutes),
      });

      const newEvent = eventResponse?.data;

      if (!newEvent?._id) {
        throw new Error(
          "Event was created but its ID was not returned."
        );
      }

      await createSchedule({
        sourceType: "calendar",
        sourceId: newEvent._id,
        title: newEvent.title,
        scheduledFor: newEvent.startTime,
        reminderMinutes: Number(reminderMinutes),
        repeat: "none",
        notificationEnabled:
          Number(reminderMinutes) > 0,
        soundEnabled: true,
        alarmEnabled: true,
        status: "scheduled",
      });

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error(
        "Create event/schedule error:",
        error
      );
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);

    setTitle(event.title);
    setDescription(event.description || "");
    setLocation(event.location || "");
    setReminderMinutes(
      event.reminderMinutes ?? 10
    );

    setStartTime(
      event.startTime
        ? new Date(event.startTime)
            .toISOString()
            .slice(0, 16)
        : ""
    );

    setEndTime(
      event.endTime
        ? new Date(event.endTime)
            .toISOString()
            .slice(0, 16)
        : ""
    );
  };

 const handleUpdateEvent = async (e) => {
  e.preventDefault();

  if (!editingEvent || !title.trim() || !startTime) {
    return;
  }

  try {
    await updateEvent(editingEvent._id, {
      title,
      description,
      startTime,
      endTime: endTime || undefined,
      location,
      reminderMinutes: Number(reminderMinutes),
    });

    const schedulesResponse = await getSchedules();
    const schedules = schedulesResponse?.data || [];

    const schedule = schedules.find(
      (item) =>
        item.sourceType === "calendar" &&
        item.sourceId === editingEvent._id
    );

    if (schedule?._id) {
      await updateSchedule(schedule._id, {
        title,
        scheduledFor: startTime,
        reminderMinutes: Number(reminderMinutes),
        notificationEnabled: Number(reminderMinutes) > 0,
        soundEnabled: true,
        alarmEnabled: true,
        status: "scheduled",
      });
    }

    resetForm();
    fetchEvents();
  } catch (error) {
    console.error("Update event/schedule error:", error);
  }
};

 const handleCompleteEvent = async (id) => {
  try {
    await updateEvent(id, {
      status: "completed",
    });

    const schedulesResponse = await getSchedules();
    const schedules = schedulesResponse?.data || [];

    const schedule = schedules.find(
      (item) =>
        item.sourceType === "calendar" &&
        item.sourceId === id
    );

    if (schedule?._id) {
      await updateSchedule(schedule._id, {
        status: "completed",
      });
    }

    fetchEvents();
  } catch (error) {
    console.error("Complete event error:", error);
  }
};

  const handleDeleteEvent = async (id) => {
  try {
    await deleteEvent(id);

    const schedulesResponse = await getSchedules();
    const schedules = schedulesResponse?.data || [];

    const schedule = schedules.find(
      (item) =>
        item.sourceType === "calendar" &&
        item.sourceId === id
    );

    if (schedule?._id) {
      await deleteSchedule(schedule._id);
    }

    fetchEvents();
  } catch (error) {
    console.error("Delete event error:", error);
  }
};

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const getDateString = (date) => {
    const value = new Date(date);

    return `${value.getFullYear()}-${String(
      value.getMonth() + 1
    ).padStart(2, "0")}-${String(
      value.getDate()
    ).padStart(2, "0")}`;
  };

  const todayString = getDateString(
    new Date()
  );

  const todayEvents = useMemo(() => {
    return events.filter(
      (event) =>
        getDateString(event.startTime) ===
        todayString
    );
  }, [events, todayString]);

  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter(
        (event) =>
          new Date(event.startTime) >= new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.startTime) -
          new Date(b.startTime)
      );
  }, [events]);

  const selectedEvents = useMemo(() => {
    if (!selectedDate) {
      return events;
    }

    return events.filter(
      (event) =>
        getDateString(event.startTime) ===
        selectedDate
    );
  }, [events, selectedDate]);

  const completedEvents = events.filter(
    (event) => event.status === "completed"
  ).length;

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/40 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-purple-600">
                Your time management space
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Calendar
              </h1>

              <p className="mt-2 text-slate-500">
                Organize events, meetings and important moments.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Today
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {todayEvents.length} event
                {todayEvents.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Events
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {events.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Today
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {todayEvents.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Upcoming
              </p>

              <p className="mt-2 text-2xl font-bold text-purple-600">
                {upcomingEvents.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {completedEvents}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* Form */}
            <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  {editingEvent
                    ? "✏️"
                    : "📅"}
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingEvent
                    ? "Edit Event"
                    : "Create Event"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingEvent
                    ? "Update your event details."
                    : "Schedule something important."}
                </p>
              </div>

              <form
                onSubmit={
                  editingEvent
                    ? handleUpdateEvent
                    : handleCreateEvent
                }
                className="space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Event title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Project meeting"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    placeholder="Add some details..."
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    rows="3"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Start time
                  </label>

                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) =>
                      setStartTime(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    End time
                  </label>

                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) =>
                      setEndTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. College / Google Meet"
                    value={location}
                    onChange={(e) =>
                      setLocation(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Reminder
                  </label>

                  <select
                    value={reminderMinutes}
                    onChange={(e) =>
                      setReminderMinutes(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  >
                    <option value={0}>
                      No reminder
                    </option>

                    <option value={5}>
                      5 minutes before
                    </option>

                    <option value={10}>
                      10 minutes before
                    </option>

                    <option value={15}>
                      15 minutes before
                    </option>

                    <option value={30}>
                      30 minutes before
                    </option>

                    <option value={60}>
                      1 hour before
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:shadow-md"
                >
                  {editingEvent
                    ? "Update Event"
                    : "Add Event"}
                </button>

                {editingEvent && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {/* Event List */}
            <div>

              {/* Date Filter */}
              <div className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Events
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedDate
                        ? "Events for selected date"
                        : "All scheduled events"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setSelectedDate("")
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                        selectedDate === ""
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      All
                    </button>

                    <button
                      onClick={() =>
                        setSelectedDate(
                          todayString
                        )
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                        selectedDate ===
                        todayString
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Today
                    </button>

                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) =>
                        setSelectedDate(
                          e.target.value
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {selectedEvents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                    📅
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    No events found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Create an event to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvents
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(
                          a.startTime
                        ) -
                        new Date(
                          b.startTime
                        )
                    )
                    .map((event) => (
                      <div
                        key={event._id}
                        className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex gap-4">
                          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-lg">
                            📅
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col justify-between gap-3 sm:flex-row">
                              <div>
                                <h3 className="font-semibold text-slate-900">
                                  {event.title}
                                </h3>

                                {event.description && (
                                  <p className="mt-1 text-sm text-slate-500">
                                    {
                                      event.description
                                    }
                                  </p>
                                )}
                              </div>

                              <div className="flex shrink-0 gap-2">
                                {event.status !==
                                  "completed" && (
                                  <button
                                    onClick={() =>
                                      handleCompleteEvent(
                                        event._id
                                      )
                                    }
                                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-green-600 transition hover:bg-green-50"
                                  >
                                    ✓ Complete
                                  </button>
                                )}

                                <button
                                  onClick={() =>
                                    handleEditEvent(
                                      event
                                    )
                                  }
                                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteEvent(
                                      event._id
                                    )
                                  }
                                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-600">
                                📅{" "}
                                {formatDate(
                                  event.startTime
                                )}
                              </span>

                              <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                                🕐{" "}
                                {formatTime(
                                  event.startTime
                                )}

                                {event.endTime &&
                                  ` - ${formatTime(
                                    event.endTime
                                  )}`}
                              </span>

                              {event.location && (
                                <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                                  📍{" "}
                                  {event.location}
                                </span>
                              )}

                              <span
                                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                                  event.status ===
                                  "completed"
                                    ? "border-green-100 bg-green-50 text-green-600"
                                    : event.status ===
                                      "missed"
                                    ? "border-red-100 bg-red-50 text-red-600"
                                    : "border-yellow-100 bg-yellow-50 text-yellow-600"
                                }`}
                              >
                                {event.status}
                              </span>
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
      </div>
    </MainLayout>
  );
}

export default Calendar;