import Task from "../models/Task.js";
import Goal from "../models/Goal.js";
import Event from "../models/Event.js";
import Habit from "../models/habit.js";
import Journal from "../models/Journal.js";
import Note from "../models/Note.js";
import Notification from "../models/Notification.js";
import Document from "../models/Document.js";
import Study from "../models/Study.js";
import StudyWorkspace from "../models/StudyWorkspace.js";
import Profile from "../models/Profile.js";
import Settings from "../models/Settings.js";
import User from "../models/User.js";

export const buildAIContext = async (userId, message = "") => {
  const [
    user,
    profile,
    settings,
    tasks,
    goals,
    events,
    habits,
    journals,
    notes,
    notifications,
    documents,
    studies,
    studyWorkspace,
  ] = await Promise.all([
    User.findById(userId)
      .select("name email createdAt")
      .lean(),

    Profile.findOne({ user: userId })
      .select("bio avatar phone location")
      .lean(),

    Settings.findOne({ user: userId })
      .select("theme notifications emailNotifications language")
      .lean(),

    Task.find({ user: userId })
      .sort({ dueDate: 1, priority: -1, createdAt: -1 })
      .lean(),

    Goal.find({ user: userId })
      .sort({ deadline: 1, createdAt: -1 })
      .lean(),

    Event.find({ user: userId })
      .sort({ startTime: 1 })
      .lean(),

    Habit.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean(),

    Journal.find({ user: userId })
      .sort({ date: -1 })
      .limit(20)
      .lean(),

    Note.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean(),

    Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean(),

    Document.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean(),

    Study.find({ user: userId })
      .sort({ date: -1 })
      .limit(30)
      .lean(),

    StudyWorkspace.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const context = {
    user: user
      ? {
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        }
      : null,

    profile: profile || null,

    settings: settings || null,

    tasks: tasks.map((task) => ({
  id: task._id,
  title: task.title,
  description: task.description || "",
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate || null,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
})),

    goals: goals.map((goal) => ({
      id: goal._id,
      title: goal.title,
      description: goal.description || "",
      startDate: goal.startDate || null,
      deadline: goal.deadline || null,
      status: goal.status,
      progress: goal.progress,
      completedDates: goal.completedDates || [],
      createdAt: goal.createdAt,
    })),

    events: events.map((event) => ({
      id: event._id,
      title: event.title,
      description: event.description || "",
      startTime: event.startTime,
      endTime: event.endTime || null,
      location: event.location || "",
      reminderMinutes: event.reminderMinutes,
      status: event.status,
    })),

    habits: habits.map((habit) => ({
      id: habit._id,
      name: habit.name,
      description: habit.description || "",
      frequency: habit.frequency,
      completedDates: habit.completedDates || [],
      createdAt: habit.createdAt,
    })),

    journals: journals.map((journal) => ({
      id: journal._id,
      title: journal.title,
      content: journal.content,
      mood: journal.mood,
      date: journal.date,
      createdAt: journal.createdAt,
    })),

    notes: notes.map((note) => ({
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })),

    notifications: notifications.map((notification) => ({
      id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      link: notification.link || "",
      createdAt: notification.createdAt,
    })),

    documents: documents.map((document) => ({
      id: document._id,
      name: document.name,
      fileName: document.fileName || "",
      fileType: document.fileType || "",
      sourceType: document.sourceType,
      category: document.category,
      createdAt: document.createdAt,
    })),

    studies: studies.map((study) => ({
      id: study._id,
      subject: study.subject,
      topic: study.topic || "",
      duration: study.duration,
      date: study.date,
      notes: study.notes || "",
      createdAt: study.createdAt,
    })),

    studyWorkspace: studyWorkspace.map((item) => ({
      id: item._id,
      subject: item.subject,
      topics: (item.topics || []).map((topic) => ({
        id: topic._id,
        title: topic.title,
        completed: topic.completed,
      })),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
  };

  return context;
};