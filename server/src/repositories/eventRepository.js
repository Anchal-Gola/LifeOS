import Event from "../models/Event.js";

const syncEventStatuses = async (userId) => {
  const now = new Date();

  // Events whose end time has passed become Missed
  await Event.updateMany(
    {
      user: userId,
      status: { $in: ["Upcoming", "In Progress", "upcoming"] },
      endTime: {
        $exists: true,
        $ne: null,
        $lte: now,
      },
    },
    {
      $set: {
        status: "Missed",
      },
    }
  );

  // Events whose start time has arrived become In Progress
  await Event.updateMany(
    {
      user: userId,
      status: { $in: ["Upcoming", "upcoming"] },
      startTime: {
        $lte: now,
      },
      $or: [
        {
          endTime: {
            $exists: false,
          },
        },
        {
          endTime: null,
        },
        {
          endTime: {
            $gt: now,
          },
        },
      ],
    },
    {
      $set: {
        status: "In Progress",
      },
    }
  );
};

export const createEvent = async (eventData) => {
  return await Event.create(eventData);
};

export const getEventsByUser = async (userId) => {
  await syncEventStatuses(userId);

  return await Event.find({ user: userId }).sort({
    startTime: 1,
  });
};

export const updateEvent = async (eventId, userId, data) => {
  return await Event.findOneAndUpdate(
    {
      _id: eventId,
      user: userId,
    },
    data,
    {
      new: true,
    }
  );
};

export const deleteEvent = async (eventId, userId) => {
  return await Event.findOneAndDelete({
    _id: eventId,
    user: userId,
  });
};

export const getCompletedEventsThisWeek = async (
  userId,
  weekStart,
  now
) => {
  return await Event.find({
    user: userId,
    status: {
      $in: ["Completed", "completed"],
    },
    startTime: {
      $gte: weekStart,
      $lte: now,
    },
  }).sort({
    startTime: -1,
  });
};