import Task from "../models/Task.js";
import Note from "../models/Note.js";
import Goal from "../models/Goal.js";
import Habit from "../models/Habit.js";
import Journal from "../models/Journal.js";
import Study from "../models/Study.js";
import Document from "../models/Document.js";
import Event from "../models/Event.js";

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const globalSearchService = async (userId, searchTerm) => {
  const search = searchTerm.trim();

  if (!search) {
    return [];
  }

  const regex = new RegExp(escapeRegex(search), "i");

  const [
    tasks,
    notes,
    goals,
    habits,
    journals,
    studies,
    documents,
    events,
  ] = await Promise.all([
    Task.find({
      user: userId,
      $or: [
        { title: regex },
        { description: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10),

    Note.find({
      user: userId,
      $or: [
        { title: regex },
        { content: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10),

    Goal.find({
      user: userId,
      $or: [
        { title: regex },
        { description: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10),

    Habit.find({
      user: userId,
      $or: [
        { name: regex },
        { description: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10),

    Journal.find({
      user: userId,
      $or: [
        { title: regex },
        { content: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10),

    Study.find({
      user: userId,
      $or: [
        { subject: regex },
        { topic: regex },
        { notes: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10),

    Document.find({
      user: userId,
      $or: [
        { name: regex },
        { category: regex },
        { fileName: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10),

    Event.find({
      user: userId,
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  return [
    ...tasks.map((item) => ({
      type: "task",
      title: item.title,
      description: item.description || "",
      id: item._id,
      data: item,
    })),

    ...notes.map((item) => ({
      type: "note",
      title: item.title,
      description: item.content || "",
      id: item._id,
      data: item,
    })),

    ...goals.map((item) => ({
      type: "goal",
      title: item.title,
      description: item.description || "",
      id: item._id,
      data: item,
    })),

    ...habits.map((item) => ({
      type: "habit",
      title: item.name,
      description: item.description || "",
      id: item._id,
      data: item,
    })),

    ...journals.map((item) => ({
      type: "journal",
      title: item.title || "Journal Entry",
      description: item.content || "",
      id: item._id,
      data: item,
    })),

    ...studies.map((item) => ({
      type: "study",
      title: item.subject,
      description: item.topic || item.notes || "",
      id: item._id,
      data: item,
    })),

    ...documents.map((item) => ({
      type: "document",
      title: item.name,
      description: item.category || "",
      id: item._id,
      data: item,
    })),

    ...events.map((item) => ({
      type: "event",
      title: item.title,
      description: item.description || "",
      id: item._id,
      data: item,
    })),
  ];
};