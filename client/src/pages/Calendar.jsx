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
  createSchedule,
} from "../api/scheduleApi";

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
          notificationEnabled:
            Number(reminderMinutes) > 0,
          soundEnabled: true,
          alarmEnabled: true,
          status: "scheduled",
        });
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error(
        "Update event/schedule error:",
        error
      );
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
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getDateString = (date) => {
    const value = new Date(date);

    return `${value.getFullYear()}-${String(
      value.getMonth() + 1
    ).padStart(2, "0")}-${String(
      value.getDate()
    ).padStart(2, "0")}`;
  };

  const todayString = getDateString(new Date());

  const todayEvents = useMemo(() => {
    return events.filter(
      (event) =>
        getDateString(event.startTime) === todayString
    );
  }, [events, todayString]);

  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter((event) => event.status !== "Completed")
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
    (event) =>
      event.status === "Completed"
        ? "bg-indigo-100 text-indigo-700"
        : event.status === "Missed"
        ? "bg-red-100 text-red-700"
        : event.status === "In Progress"
        ? "bg-blue-100 text-blue-700"
        : "bg-amber-100 text-amber-700"
  ).length;

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-5 py-8 text-slate-900 transition-colors duration-300 dark:from-[#0a1020] dark:via-[#0d1426] dark:to-indigo-950/20 dark:text-white sm:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Your time management space
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Calendar
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Organize meetings, events and important
                moments in one place.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-indigo-100 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Today
              </p>

              <p className="mt-1 text-lg font-bold text-indigo-600 dark:text-indigo-300">
                {todayEvents.length} event
                {todayEvents.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#111827]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Events
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
                  📅
                </span>
              </div>

              <p className="text-3xl font-bold">
                {events.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                All scheduled events
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#111827]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Today
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  ✦
                </span>
              </div>

              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                {todayEvents.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Happening today
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#111827]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Upcoming
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-300">
                  →
                </span>
              </div>

              <p className="text-3xl font-bold text-pink-600 dark:text-pink-300">
                {upcomingEvents.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Coming next
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#111827]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Completed
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                  ✓
                </span>
              </div>

              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">
                {completedEvents}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Finished events
              </p>
            </div>

          </div>

          {/* Main Workspace */}
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* Form */}
            <div className="h-fit overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">

              <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-6 dark:border-slate-800 dark:from-indigo-950/30 dark:via-[#111827] dark:to-violet-950/30">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg text-white shadow-sm">
                    {editingEvent ? "✏️" : "📅"}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      {editingEvent
                        ? "Edit Event"
                        : "Create Event"}
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {editingEvent
                        ? "Update your event details."
                        : "Schedule something important."}
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={
                  editingEvent
                    ? handleUpdateEvent
                    : handleCreateEvent
                }
                className="space-y-4 p-6"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Event title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Project meeting"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-[#0b1220] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#0b1220] dark:focus:ring-indigo-950/40"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Description
                  </label>

                  <textarea
                    placeholder="Add some details..."
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    rows="3"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-[#0b1220] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#0b1220] dark:focus:ring-indigo-950/40"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Start time
                  </label>

                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) =>
                      setStartTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-[#0b1220] dark:text-white dark:focus:border-indigo-500 dark:focus:bg-[#0b1220] dark:focus:ring-indigo-950/40"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    End time
                  </label>

                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) =>
                      setEndTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-[#0b1220] dark:text-white dark:focus:border-indigo-500 dark:focus:bg-[#0b1220] dark:focus:ring-indigo-950/40"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. College / Google Meet"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-[#0b1220] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-[#0b1220] dark:focus:ring-indigo-950/40"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Reminder
                  </label>

                  <select
                    value={reminderMinutes}
                    onChange={(e) =>
                      setReminderMinutes(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-[#0b1220] dark:text-white dark:focus:border-indigo-500 dark:focus:bg-[#0b1220] dark:focus:ring-indigo-950/40"
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
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {editingEvent
                    ? "Update Event"
                    : "Add Event"}
                </button>

                {editingEvent && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel Editing
                  </button>
                )}
              </form>
            </div>

            {/* Events */}
            <div className="min-w-0">

              {/* Toolbar */}
              <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                  <div>
                    <h2 className="text-xl font-bold">
                      Events
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {selectedDate
                        ? "Events for the selected date"
                        : "All scheduled events"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        setSelectedDate("")
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        selectedDate === ""
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      All
                    </button>

                    <button
                      onClick={() =>
                        setSelectedDate(todayString)
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        selectedDate === todayString
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
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
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-[#0b1220] dark:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Empty State */}
              {selectedEvents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm dark:border-slate-700 dark:bg-[#111827]">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-2xl dark:from-indigo-950/50 dark:to-violet-950/40">
                    📅
                  </div>

                  <h3 className="text-lg font-bold">
                    No events found
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Create an event or choose another
                    date to see your schedule.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedEvents
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(a.startTime) -
                        new Date(b.startTime)
                    )
                    .map((event) => (
                      <div
                        key={event._id}
                        className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-[#111827] dark:hover:border-indigo-900"
                      >
                        <div className="flex gap-4">

                          {/* Event Icon */}
                          <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-lg text-indigo-600 dark:from-indigo-950/50 dark:to-violet-950/40 dark:text-indigo-300">
                            📅
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-col justify-between gap-4 xl:flex-row">

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-base font-bold">
                                    {event.title}
                                  </h3>

                                  {event.status === "completed" && (
                                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                                      Completed
                                    </span>
                                  )}
                                </div>

                                {event.description && (
                                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {event.description}
                                  </p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex shrink-0 flex-wrap gap-2">
                                {event.status !==
                                  "completed" && (
                                  <button
                                    onClick={() =>
                                      handleCompleteEvent(
                                        event._id
                                      )
                                    }
                                    className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/70"
                                  >
                                    ✓ Complete
                                  </button>
                                )}

                                <button
                                  onClick={() =>
                                    handleEditEvent(event)
                                  }
                                  className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteEvent(
                                      event._id
                                    )
                                  }
                                  className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                                📅 {formatDate(
                                  event.startTime
                                )}
                              </span>

                              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                                🕐 {formatTime(
                                  event.startTime
                                )}
                                {event.endTime &&
                                  ` - ${formatTime(
                                    event.endTime
                                  )}`}
                              </span>

                              {event.location && (
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  📍 {event.location}
                                </span>
                              )}

                              <span
                                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                  event.status ===
                                  "completed"
                                    ? "border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300"
                                    : event.status ===
                                      "missed"
                                    ? "border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
                                    : "border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
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