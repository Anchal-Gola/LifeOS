import Task from "../models/Task.js";

const syncTaskStatuses = async (userId) => {
  const now = new Date();

  // Tasks whose end time has passed become Missed
  await Task.updateMany(
    {
      user: userId,
      status: { $in: ["Todo", "In Progress"] },
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

  // Tasks whose start time has arrived become In Progress
  await Task.updateMany(
    {
      user: userId,
      status: "Todo",
      startTime: {
        $exists: true,
        $ne: null,
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

export const createTask = async (taskData) => {
  return await Task.create(taskData);
};

export const getTasksByUser = async (userId) => {
  await syncTaskStatuses(userId);

  return await Task.find({ user: userId });
};

export const getTaskById = async (taskId, userId) => {
  await syncTaskStatuses(userId);

  return await Task.findOne({
    _id: taskId,
    user: userId,
  });
};

export const updateTask = async (taskId, userId, data) => {
  return await Task.findOneAndUpdate(
    {
      _id: taskId,
      user: userId,
    },
    data,
    {
      returnDocument: "after",
    }
  );
};

export const deleteTask = async (taskId, userId) => {
  return await Task.findOneAndDelete({
    _id: taskId,
    user: userId,
  });
};

export const getCompletedTasksThisWeek = async (
  userId,
  weekStart,
  now
) => {
  return await Task.find({
    user: userId,
    status: { $in: ["Completed", "completed"] },
    updatedAt: {
      $gte: weekStart,
      $lte: now,
    },
  }).sort({ updatedAt: -1 });
};