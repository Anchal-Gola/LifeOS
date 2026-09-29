import { runAIAction } from "../AI/actionRunner.js";
import { askAI } from "../services/aiService.js";
import { buildAIContext } from "../services/aiContextService.js";

import {
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from "../services/taskService.js";

import {
  createGoalService,
  updateGoalService,
  deleteGoalService,
  completeGoalTodayService,
} from "../services/goalService.js";
import {
  addTopicService,
} from "../services/studyWorkspaceService.js";

import Conversation from "../models/conversation.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const lowerMessage = message.toLowerCase().trim();

    const context = await buildAIContext(userId, message);

    /*
     * =========================
     * HELPER: NORMALIZE TEXT
     * =========================
     */

    const normalizeText = (text) => {
      return String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
    };

    /*
     * =========================
     * HELPER: SAVE CONVERSATION
     * =========================
     */

    const saveConversation = async (reply) => {
      let conversation;

      if (conversationId) {
        conversation = await Conversation.findOne({
          _id: conversationId,
          user: userId,
        });

        if (!conversation) {
          return null;
        }
      } else {
        conversation = await Conversation.create({
          user: userId,
          title: message.trim().slice(0, 50),
          messages: [],
        });
      }

      conversation.messages.push({
        role: "user",
        content: message.trim(),
      });

      conversation.messages.push({
        role: "assistant",
        content: reply,
      });

      await conversation.save();

      return conversation;
    };

    /*
     * =========================
     * HELPER: FIND TASK
     * =========================
     */

    const findTask = () => {
      const normalizedMessage = normalizeText(message);

      const titleMatch = context.tasks.find((task) => {
        const normalizedTitle = normalizeText(task.title);

        return (
          normalizedTitle &&
          normalizedMessage.includes(normalizedTitle)
        );
      });

      if (titleMatch) {
        return titleMatch;
      }

      const currentTaskRequest =
        lowerMessage.includes("current task") ||
        lowerMessage.includes("my current task") ||
        lowerMessage.includes("my task") ||
        lowerMessage.includes("the task") ||
        lowerMessage.includes("my todo") ||
        lowerMessage.includes("my to-do");

      const taskActionRequest =
        lowerMessage.includes("complete") ||
        lowerMessage.includes("completed") ||
        lowerMessage.includes("finish") ||
        lowerMessage.includes("done") ||
        lowerMessage.includes("delete") ||
        lowerMessage.includes("remove") ||
        lowerMessage.includes("mark");

      if (
        (currentTaskRequest || taskActionRequest) &&
        context.tasks.length > 0
      ) {
        const activeTask = context.tasks.find(
          (task) =>
            task.status !== "Completed" &&
            task.status !== "completed"
        );

        return activeTask || context.tasks[0];
      }

      return null;
    };

    /*
     * =========================
     * HELPER: FIND GOAL
     * =========================
     */

    const findGoal = () => {
      const normalizedMessage = normalizeText(message);

      const titleMatch = context.goals.find((goal) => {
        const normalizedTitle = normalizeText(goal.title);

        return (
          normalizedTitle &&
          normalizedMessage.includes(normalizedTitle)
        );
      });

      if (titleMatch) {
        return titleMatch;
      }

      return context.goals.find((goal) => {
        const titleWords = goal.title
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word.length >= 2)
          .map((word) => normalizeText(word))
          .filter(Boolean);

        const matchedWords = titleWords.filter((word) =>
          normalizedMessage.includes(word)
        );

        return (
          titleWords.length > 0 &&
          matchedWords.length >=
            Math.ceil(titleWords.length * 0.6)
        );
      });
    };
    /*
 * =========================
 * HELPER: FIND HABIT
 * =========================
 */

/*
 * =========================
 * HELPER: FIND HABIT
 * =========================
 */

const findHabit = () => {
  const normalizedMessage = normalizeText(message);

  const explicitHabitRequest =
    lowerMessage.includes("habit") ||
    lowerMessage.includes("habits");

  const habitMatch = (context.habits || []).find((habit) => {
    const normalizedName = normalizeText(habit.name);

    return (
      normalizedName &&
      normalizedMessage.includes(normalizedName)
    );
  });

  if (habitMatch) {
    return habitMatch;
  }

  return null;
};
   const task = findTask();
const goal = findGoal();
const habit = findHabit();

const findEvent = () => {
  const normalizedMessage = normalizeText(message);

  const eventMatch = (context.events || []).find((event) => {
    const normalizedTitle = normalizeText(event.title);

    if (!normalizedTitle) {
      return false;
    }

    // Exact/full title match
    if (normalizedMessage.includes(normalizedTitle)) {
      return true;
    }

    // Partial title match using individual words
    const titleWords = String(event.title || "")
      .toLowerCase()
      .split(/\s+/)
      .map((word) => normalizeText(word))
      .filter((word) => word.length >= 2);

    const matchedWords = titleWords.filter((word) =>
      normalizedMessage.includes(word)
    );

    return (
      titleWords.length > 0 &&
      matchedWords.length >=
        Math.ceil(titleWords.length * 0.5)
    );
  });

  return eventMatch || null;
};

const event = findEvent();

console.log(
  "AI EVENT TITLES:",
  (context.events || []).map((item) => item.title)
);

console.log("AI EVENT MATCH:", event);
    /*
     * =========================
     * CREATE TASK
     * =========================
     *
     * Examples:
     * Add task Buy groceries
     * Create task Complete DSA
     * Make a task Finish React project
     */

    const createTaskMatch = lowerMessage.match(
      /^(?:add|create|make)\s+(?:a\s+)?task\s+(.+)$/i
    );

    if (createTaskMatch) {
      const title = message
        .replace(
          /^(add|create|make)\s+(a\s+)?task\s+/i,
          ""
        )
        .trim();

      if (!title) {
        const reply = "Please provide a title for the task.";

        const conversation = await saveConversation(reply);

        if (!conversation) {
          return res.status(404).json({
            success: false,
            message: "Conversation not found",
          });
        }

        return res.status(200).json({
          success: true,
          reply,
          conversationId: conversation._id,
        });
      }

      const newTask = await runAIAction({
  action: "create_task",
  userId,
  data: {
    title,
    description: "",
    priority: "Medium",
    status: "Todo",
  },
});

      const reply = `Done! I created a new task **${newTask.title}**.`;

      const conversation = await saveConversation(reply);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        reply,
        conversationId: conversation._id,
      });
    }
    /*
 * =========================
 * CREATE GOAL
 * =========================
 *
 * Examples:
 * Add goal Learn React
 * Create goal Complete DSA
 * Make a goal Build my portfolio
 */

const createGoalMatch = lowerMessage.match(
  /^(?:add|create|make)\s+(?:a\s+)?goal(?:\s+(?:called|named))?\s+(.+)$/i
);

if (createGoalMatch) {
 const title = message
  .replace(
    /^(add|create|make)\s+(a\s+)?goal(?:\s+(called|named))?\s+/i,
    ""
  )
  .trim();

  if (!title) {
    const reply = "Please provide a title for the goal.";

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const newGoal = await runAIAction({
  action: "create_goal",
  userId,
  data: {
    title,
    description: "",
    deadline: null,
    progress: 0,
  },
});

  const reply = `Done! I created a new goal **${newGoal.title}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
/*
 * =========================
 * CREATE CALENDAR EVENT
 * =========================
 *
 * Examples:
 * Create event Meeting tomorrow at 10 AM
 * Create an event called Team Meeting on September 10 at 10:00 AM
 * Create an event called Team Meeting on September 10 at 10:00 AM,
 * ending on September 15 at 5:00 PM, with a reminder 10 minutes before it starts
 */

const createEventMatch = lowerMessage.match(
  /^(add|create|make)\s+(?:a|an)?\s*(?:calendar\s+)?event\b\s*(?:called|named)?\s*(.+)$/i
);
console.log("AI MESSAGE:", message);
console.log("AI LOWER MESSAGE:", lowerMessage);
console.log("CREATE EVENT MATCH:", createEventMatch);

if (createEventMatch) {
  let eventText = message
  .replace(
    /^(add|create|make)\s+(?:a|an)?\s*(?:calendar\s+)?event\s*(?:called|named)?\s+/i,
    ""
  )
  .trim();

  // Extract reminder
  let reminderMinutes = 10;

  const reminderMatch = eventText.match(
    /,\s*with\s+a\s+reminder\s+(\d+)\s+minutes?\s+before\s+it\s+starts?\.?$/i
  );

  if (reminderMatch) {
    reminderMinutes = Number(reminderMatch[1]);

    eventText = eventText
      .replace(reminderMatch[0], "")
      .trim();
  }

  // Extract end time
  let endTime = null;

  const endMatch = eventText.match(
    /,\s*ending\s+(?:on\s+)?(.+)$/i
  );

  if (endMatch) {
    const endText = endMatch[1].trim();
    const currentYear = new Date().getFullYear();

    const normalizedEndText = endText
      .replace(/,/g, "")
      .replace(/\s+at\s+/i, " ");

    const endWithYear = /\b\d{4}\b/.test(normalizedEndText)
      ? normalizedEndText
      : `${normalizedEndText} ${currentYear}`;

    const parsedEnd = new Date(endWithYear);

    if (!Number.isNaN(parsedEnd.getTime())) {
      endTime = parsedEnd;
    }

    eventText = eventText
      .replace(endMatch[0], "")
      .trim();
  }

  // Extract start date/time
  let startTime = new Date();

  const startMatch = eventText.match(
    /\s+on\s+(.+)$/i
  );

  if (startMatch) {
    const startText = startMatch[1].trim();
    const currentYear = new Date().getFullYear();

    const normalizedStartText = startText
      .replace(/,/g, "")
      .replace(/\s+at\s+/i, " ");

    const startWithYear = /\b\d{4}\b/.test(normalizedStartText)
      ? normalizedStartText
      : `${normalizedStartText} ${currentYear}`;

    const parsedStart = new Date(startWithYear);

    if (!Number.isNaN(parsedStart.getTime())) {
      startTime = parsedStart;
    }

    eventText = eventText
      .slice(0, startMatch.index)
      .trim();
  }

  const title = eventText.trim();

  if (!title) {
    const reply = "Please provide a title for the event.";

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const newEvent = await runAIAction({
    action: "create_event",
    userId,
    data: {
      title,
      description: "",
      startTime,
      endTime,
      location: "",
      reminderMinutes,
     status: "Upcoming",
    },
  })

  const reply = `Done! I created the calendar event **${newEvent.title}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
    /*
     * =========================
     * ADD STUDY TOPIC
     * =========================
     *
     * Examples:
     * Add JavaScript to Web Technology
     * Add React to Web Development
     * Create Python in Programming
     */

    const addTopicMatch = lowerMessage.match(
      /^(?:add|create)\s+(.+?)\s+(?:to|in|into)\s+(.+)$/i
    );

    if (
      addTopicMatch &&
      (lowerMessage.includes("topic") ||
        context.studyWorkspace?.some((item) =>
          normalizeText(lowerMessage).includes(
            normalizeText(item.subject)
          )
        ))
    ) {
      const topicTitle = addTopicMatch[1].trim();

      const subjectName = addTopicMatch[2]
        .replace(/\bsubject\b/gi, "")
        .replace(/\btopic\b/gi, "")
        .trim();

      const workspace = context.studyWorkspace || [];

      const targetSubject = workspace.find(
        (item) =>
          normalizeText(item.subject) ===
          normalizeText(subjectName)
      );

      if (!targetSubject) {
        const reply = `I couldn't find a Study Workspace subject named **${subjectName}**.`;

        const conversation = await saveConversation(reply);

        if (!conversation) {
          return res.status(404).json({
            success: false,
            message: "Conversation not found",
          });
        }

        return res.status(200).json({
          success: true,
          reply,
          conversationId: conversation._id,
        });
      }

      const updatedWorkspace = await addTopicService(
        targetSubject.id,
        userId,
        topicTitle
      );

      if (!updatedWorkspace) {
        const reply = "Unable to add the topic.";

        const conversation = await saveConversation(reply);

        if (!conversation) {
          return res.status(404).json({
            success: false,
            message: "Conversation not found",
          });
        }

        return res.status(200).json({
          success: true,
          reply,
          conversationId: conversation._id,
        });
      }

      const reply = `Done! I added **${topicTitle}** to **${targetSubject.subject}**.`;

      const conversation = await saveConversation(reply);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        reply,
        conversationId: conversation._id,
      });
    }

    /*
     * =========================
     * DELETE ALL TASKS
     * =========================
     */

    const isDeleteAllTasksRequest =
      (lowerMessage.includes("delete") ||
        lowerMessage.includes("remove")) &&
      /\ball\s+(my\s+)?tasks?\b/i.test(lowerMessage);

    if (isDeleteAllTasksRequest) {
      if (context.tasks.length === 0) {
        const reply = "You don't have any tasks to delete.";

        const conversation = await saveConversation(reply);

        if (!conversation) {
          return res.status(404).json({
            success: false,
            message: "Conversation not found",
          });
        }

        return res.status(200).json({
          success: true,
          reply,
          conversationId: conversation._id,
        });
      }

      await Promise.all(
        context.tasks.map((task) =>
          deleteTaskService(task.id, userId)
        )
      );

      const reply = `Done! I deleted all ${context.tasks.length} tasks.`;

      const conversation = await saveConversation(reply);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        reply,
        conversationId: conversation._id,
      });
    }

    

    /*
     * =========================
     * DELETE ALL GOALS
     * =========================
     */

    const isDeleteAllGoalsRequest =
      (lowerMessage.includes("delete") ||
        lowerMessage.includes("remove")) &&
      /\ball\s+(my\s+)?goals?\b/i.test(lowerMessage);

    if (isDeleteAllGoalsRequest) {
      const goalsToDelete = context.goals || [];

      if (goalsToDelete.length === 0) {
        const reply = "You don't have any goals to delete.";

        const conversation = await saveConversation(reply);

        if (!conversation) {
          return res.status(404).json({
            success: false,
            message: "Conversation not found",
          });
        }

        return res.status(200).json({
          success: true,
          reply,
          conversationId: conversation._id,
        });
      }

      await Promise.all(
        goalsToDelete.map((goal) =>
          deleteGoalService(
            goal.id || goal._id,
            userId
          )
        )
      );

      const reply = `Done! I deleted all ${goalsToDelete.length} goals.`;

      const conversation = await saveConversation(reply);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        reply,
        conversationId: conversation._id,
      });
    }

    /*
     * =========================
     * DELETE INDIVIDUAL TASK
     * =========================
     */

    const isDeleteRequest =
      lowerMessage.includes("delete") ||
      lowerMessage.includes("remove");

  if (
  isDeleteRequest &&
  task &&
  !habit &&
  !lowerMessage.includes("event") &&
  !lowerMessage.includes("calendar") &&
  !lowerMessage.includes("meeting")
) {
      await deleteTaskService(task.id, userId);

      const reply = `Done! I deleted **${task.title}** from your tasks.`;

      const conversation = await saveConversation(reply);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        reply,
        conversationId: conversation._id,
      });
    }
    /*
 * =========================
 * DELETE CALENDAR EVENT
 * =========================
 */

const isDeleteEventRequest =
  lowerMessage.includes("delete") ||
  lowerMessage.includes("remove");

if (isDeleteEventRequest && event) {
  const deletedEvent = await runAIAction({
    action: "delete_event",
    userId,
    data: {
      id: event.id || event._id,
    },
  });

  if (!deletedEvent) {
    const reply = `I couldn't delete **${event.title}**.`;

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const reply = `Done! I deleted **${event.title}** from your calendar.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
  /*
 * =========================
 * EVENT STATUS QUERY
 * =========================
 */

const isEventActionRequest =
  lowerMessage.includes("mark") ||
  lowerMessage.includes("complete") ||
  lowerMessage.includes("finish") ||
  lowerMessage.includes("done");

const isEventStatusQuery =
  event &&
  !isEventActionRequest &&
  (
    lowerMessage.includes("is") ||
    lowerMessage.includes("status") ||
    lowerMessage.includes("completed")
  );

if (isEventStatusQuery) {
  const reply = `**${event.title}** is currently **${event.status}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
 /*
 * =========================
 * COMPLETE CALENDAR EVENT
 * =========================
 */

const isCompleteEventRequest =
  event &&
  (lowerMessage.includes("complete") ||
   lowerMessage.includes("completed") ||
   lowerMessage.includes("finish") ||
   lowerMessage.includes("finished") ||
   lowerMessage.includes("done") ||
   lowerMessage.includes("mark"));

if (isCompleteEventRequest) {
  const updatedEvent = await runAIAction({
    action: "complete_event",
    userId,
    data: {
      id: event.id || event._id,
    },
  });

  if (!updatedEvent) {
    const reply = `I couldn't mark **${event.title}** as completed.`;

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const reply = `Done! I marked **${updatedEvent.title}** as completed.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
/*
 * =========================
 * UPDATE CALENDAR EVENT
 * =========================
 */

const eventRenameMatch = lowerMessage.match(
  /^(?:rename|change)\s+(?:event\s+)?(.+?)\s+(?:to|as)\s+(.+)$/i
);

if (event && eventRenameMatch) {
  const newTitle = eventRenameMatch[2].trim();

  const updatedEvent = await runAIAction({
    action: "update_event",
    userId,
    data: {
      id: event.id || event._id,
      updates: {
        title: newTitle,
      },
    },
  });

  const reply = `Done! I renamed the event to **${updatedEvent.title}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

    /*
     * =========================
     * DELETE INDIVIDUAL GOAL
     * =========================
     */

    if (isDeleteRequest && goal) {
      await deleteGoalService(
        goal.id || goal._id,
        userId
      );

      const reply = `Done! I deleted **${goal.title}** from your goals.`;

      const conversation = await saveConversation(reply);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        reply,
        conversationId: conversation._id,
      });
    }

    /*
     * =========================
     * TASK STATUS ACTION
     * =========================
     */

    const statusRequest =
      lowerMessage.includes("mark") ||
      lowerMessage.includes("change") ||
      lowerMessage.includes("set");

    let requestedStatus = null;

    if (statusRequest) {
      if (
        lowerMessage.includes("completed") ||
        lowerMessage.includes("complete") ||
        lowerMessage.includes("finished") ||
        lowerMessage.includes("finish") ||
        lowerMessage.includes("done")
      ) {
        requestedStatus = "Completed";
      } else if (
        lowerMessage.includes("in progress") ||
        lowerMessage.includes("in-progress")
      ) {
        requestedStatus = "In Progress";
      } else if (
        lowerMessage.includes("todo") ||
        lowerMessage.includes("to do")
      ) {
        requestedStatus = "Todo";
      }
    }

 if (requestedStatus && task && !habit && !event) {
     const updatedTask = await runAIAction({
  action: "update_task",
  userId,
  data: {
    id: task.id,
    updates: {
      status: requestedStatus,
    },
  },
});

      const reply = `Done! I marked **${updatedTask.title}** as ${requestedStatus}.`;

      const conversation = await saveConversation(reply);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        reply,
        conversationId: conversation._id,
      });
    }

    /*
     * =========================
     * GOAL COMPLETE TODAY
     * =========================
     */

    const isGoalCompleteRequest =
      goal &&
      (lowerMessage.includes("complete") ||
        lowerMessage.includes("completed") ||
        lowerMessage.includes("finish") ||
        lowerMessage.includes("finished") ||
        lowerMessage.includes("done today"));

    if (isGoalCompleteRequest) {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const updatedGoal =
        await completeGoalTodayService(
          goal.id || goal._id,
          userId,
          today
        );

      const reply = `Done! I marked **${updatedGoal.title}** as completed for today.`;

      const conversation = await saveConversation(reply);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        reply,
        conversationId: conversation._id,
      });
    }

    /*
     * =========================
     * GOAL PROGRESS ACTION
     * =========================
     */

    const progressMatch = lowerMessage.match(
      /(?:progress|set progress|change progress).*?(\d{1,3})\s*%/
    );

    if (progressMatch && goal) {
      const progress = Math.min(
        100,
        Math.max(0, Number(progressMatch[1]))
      );

      const updatedGoal =
        await updateGoalService(
          goal.id || goal._id,
          userId,
          {
            progress,
          }
        );

      const reply = `Done! I updated **${updatedGoal.title}** progress to **${progress}%**.`;

      const conversation = await saveConversation(reply);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        reply,
        conversationId: conversation._id,
      });
    }
   
    /*
 * =========================
 * HABIT ACTIONS
 * =========================
 */

/*
 * CREATE HABIT
 *
 * Examples:
 * Add habit Exercise
 * Create habit Read
 * Make a habit Meditate
 */

const createHabitMatch = lowerMessage.match(
  /^(?:add|create|make)\s+(?:a\s+)?(?:(daily|weekly)\s+)?habit(?:\s+called)?\s+(.+?)(?:\s+with\s+(daily|weekly)\s+frequency)?$/i
);

if (createHabitMatch) {
 const frequency =
  createHabitMatch[1] ||
  createHabitMatch[3] ||
  "daily";

const name = createHabitMatch[2].trim();

  if (!name) {
    const reply = "Please provide a name for the habit.";
    return await saveConversation(reply);
  }

  const newHabit = await runAIAction({
    action: "create_habit",
    userId,
    data: {
      name,
      description: "",
      frequency,
    },
  });

  const frequencyText =
    frequency === "weekly" ? "weekly" : "daily";

  const reply = `Done! I created a new habit **${newHabit.name}** with **${frequencyText}** frequency.`;

  return await saveConversation(reply);
}

/*
 * DELETE HABIT
 */

const isDeleteHabitRequest =
  (lowerMessage.includes("delete") ||
    lowerMessage.includes("remove")) &&
  lowerMessage.includes("habit");

if (isDeleteHabitRequest && habit) {
  const deletedHabit = await runAIAction({
    action: "delete_habit",
    userId,
    data: {
      id: habit.id || habit._id,
    },
  });

  if (!deletedHabit) {
    const reply = `I couldn't delete **${habit.name}**.`;

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const reply = `Done! I deleted **${habit.name}** from your habits.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

/*
 * COMPLETE HABIT
 *
 * Marks the habit completed for today.
 */

const isHabitStatusQuery =
  habit &&
  (lowerMessage.includes("is ") ||
    lowerMessage.includes("has ") ||
    lowerMessage.includes("completed today") ||
    lowerMessage.includes("complete today") ||
    lowerMessage.includes("did i complete"));

const isCompleteHabitRequest =
  habit &&
  !isHabitStatusQuery &&
  (lowerMessage.includes("complete") ||
    lowerMessage.includes("completed") ||
    lowerMessage.includes("finish") ||
    lowerMessage.includes("finished") ||
    lowerMessage.includes("done") ||
    lowerMessage.includes("mark"));

if (isCompleteHabitRequest) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const updatedHabit = await runAIAction({
    action: "complete_habit",
    userId,
    data: {
      id: habit.id || habit._id,
      date: today,
    },
  });

  const reply = `Done! I marked **${updatedHabit.name}** as completed for today.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
  
/*
 * =========================
 * UPDATE HABIT
 * =========================
 *
 * Examples:
 * Change Exercise frequency to weekly
 * Update Reading habit frequency to daily
 */

const habitFrequencyMatch = lowerMessage.match(
  /(?:change|update|set).*?(?:frequency\s+)?(?:to\s+)?(daily|weekly)/i
);

if (habit && habitFrequencyMatch) {
  const frequency = habitFrequencyMatch[1].toLowerCase();

  const updatedHabit = await runAIAction({
    action: "update_habit",
    userId,
    data: {
      id: habit.id || habit._id,
      updates: {
        frequency,
      },
    },
  });

  const reply = `Done! I updated **${updatedHabit.name}** frequency to **${frequency}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
 
/*
 * =========================
 * UPDATE HABIT NAME
 * =========================
 *
 * Example:
 * Rename habit dance to dancing
 */

const habitRenameMatch = lowerMessage.match(
  /^(?:rename|change)\s+habit\s+(.+?)\s+(?:to|as)\s+(.+)$/i
);

if (habit && habitRenameMatch) {
  const newName = habitRenameMatch[2].trim();

  const updatedHabit = await runAIAction({
    action: "update_habit",
    userId,
    data: {
      id: habit.id || habit._id,
      updates: {
        name: newName,
      },
    },
  });

  const reply = `Done! I renamed the habit to **${updatedHabit.name}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

/*
 * =========================
 * UPDATE HABIT DESCRIPTION
 * =========================
 *
 * Example:
 * Update habit Exercise description to Morning workout
 */

const habitDescriptionMatch = lowerMessage.match(
  /^(?:update|edit|change)\s+(?:habit\s+)?(.+?)\s+description\s+(?:to|as)\s+(.+)$/i
);

if (habit && habitDescriptionMatch) {
  const newDescription = habitDescriptionMatch[2].trim();

  const updatedHabit = await runAIAction({
    action: "update_habit",
    userId,
    data: {
      id: habit.id || habit._id,
      updates: {
        description: newDescription,
      },
    },
  });

  const reply = `Done! I updated **${updatedHabit.name}** description.`;
  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
/*
 * =========================
 * GET NOTES
 * =========================
 */

const isGetNotesRequest =
  lowerMessage.includes("show my notes") ||
  lowerMessage.includes("show notes") ||
  lowerMessage.includes("list my notes") ||
  lowerMessage.includes("list notes") ||
  lowerMessage.includes("my notes");

if (isGetNotesRequest) {
  const notes = await runAIAction({
    action: "get_notes",
    userId,
    data: {},
  });

  if (!notes || notes.length === 0) {
    const reply = "You don't have any notes yet.";

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const reply = notes
    .map(
      (note) =>
        `**${note.title}**\n${note.content}`
    )
    .join("\n\n");

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
  /*
 * =========================
 * NOTE ACTIONS
 * =========================
 */

const findNote = () => {
  const normalizedMessage = normalizeText(message);

  return (context.notes || []).find((note) => {
    const normalizedTitle = normalizeText(note.title);

    if (!normalizedTitle) {
      return false;
    }

    if (normalizedMessage.includes(normalizedTitle)) {
      return true;
    }

    const titleWords = String(note.title || "")
      .toLowerCase()
      .split(/\s+/)
      .map((word) => normalizeText(word))
      .filter((word) => word.length >= 2);

    const matchedWords = titleWords.filter((word) =>
      normalizedMessage.includes(word)
    );

    return (
      titleWords.length > 0 &&
      matchedWords.length >=
        Math.ceil(titleWords.length * 0.5)
    );
  });
};

const note = findNote();

/*
 * CREATE NOTE
 *
 * Examples:
 * Add note React hooks
 * Create note DSA revision
 */

const createNoteMatch = lowerMessage.match(
  /^(?:add|create|make)\s+(?:a\s+)?note\s+(.+)$/i
);

if (createNoteMatch) {
  const content = createNoteMatch[1].trim();

  if (!content) {
    const reply = "Please provide note content.";

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const newNote = await runAIAction({
    action: "create_note",
    userId,
    data: {
      title: content.slice(0, 50),
      content,
    },
  });

  const reply = `Done! I created the note **${newNote.title}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

/*
 * DELETE NOTE
 */

const isDeleteNoteRequest =
  (lowerMessage.includes("delete") ||
    lowerMessage.includes("remove")) &&
  lowerMessage.includes("note");

if (isDeleteNoteRequest && note) {
  const deletedNote = await runAIAction({
    action: "delete_note",
    userId,
    data: {
      id: note.id || note._id,
    },
  });

  if (!deletedNote) {
    const reply = `I couldn't delete **${note.title}**.`;

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const reply = `Done! I deleted **${note.title}** from your notes.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

/*
 * RENAME NOTE
 */

const noteRenameMatch = lowerMessage.match(
  /^(?:rename|change)\s+(?:the\s+)?note(?:\s+titled|\s+named)?\s+["']?(.+?)["']?\s+(?:to|as)\s+["']?(.+?)["']?$/i
);

if (note && noteRenameMatch) {
  const newTitle = noteRenameMatch[2].trim();

  const updatedNote = await runAIAction({
    action: "update_note",
    userId,
    data: {
      id: note.id || note._id,
      updates: {
        title: newTitle,
      },
    },
  });

  const reply = `Done! I renamed the note to **${updatedNote.title}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

/*
 * =========================
 * DOCUMENT ACTIONS
 * =========================
 */

const findDocument = () => {
  const normalizedMessage = normalizeText(message);

  return (context.documents || []).find((document) => {
    const normalizedName = normalizeText(document.name);

    if (!normalizedName) {
      return false;
    }

    return normalizedMessage.includes(normalizedName);
  });
};

const document = findDocument();

/*
 * RENAME DOCUMENT
 */

const documentRenameMatch = lowerMessage.match(
  /^(?:rename|change)\s+document\s+(.+?)\s+(?:to|as)\s+(.+)$/i
);

if (document && documentRenameMatch) {
  const newName = documentRenameMatch[2].trim();

  const updatedDocument = await runAIAction({
    action: "update_document",
    userId,
    data: {
      id: document.id || document._id,
      updates: {
        name: newName,
      },
    },
  });

  const reply = `Done! I renamed the document to **${updatedDocument.name}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
/*
 * DELETE DOCUMENT
 */

const isDeleteDocumentRequest =
  (lowerMessage.includes("delete") ||
    lowerMessage.includes("remove")) &&
  lowerMessage.includes("document");

if (isDeleteDocumentRequest && document) {
  const deletedDocument = await runAIAction({
    action: "delete_document",
    userId,
    data: {
      id: document.id || document._id,
    },
  });

  if (!deletedDocument) {
    const reply = `I couldn't delete **${document.name}**.`;

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const reply = `Done! I deleted **${document.name}** from your documents.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
 
/*
 * =========================
 * NOTIFICATION ACTIONS
 * =========================
 */

/*
 * CREATE NOTIFICATION
 */

const createNotificationMatch = lowerMessage.match(
  /^(?:create|add)\s+(?:a\s+)?notification\s+(?:titled|called|named)\s+(.+?)\s+(?:with\s+)?message\s+(.+)$/i
);

if (createNotificationMatch) {
  const [, title, notificationMessage] = createNotificationMatch;

  const notification = await runAIAction({
    action: "create_notification",
    userId,
    data: {
      title: title.trim(),
      message: notificationMessage.trim(),
      type: "system",
    },
  });

  const reply = `Notification **${notification.title}** created successfully.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

/*
 * MARK NOTIFICATION AS READ
 */

const markNotificationReadMatch = lowerMessage.match(
  /^(?:mark|set)\s+(?:notification\s+)?(.+?)\s+(?:as\s+)?read$/i
);

if (markNotificationReadMatch) {
  const notificationTitle = markNotificationReadMatch[1].trim();

  const notifications = await runAIAction({
    action: "get_notifications",
    userId,
  });

  const notification = notifications.find(
    (item) => {
      const title = normalizeText(item.title);
      const requestedTitle = normalizeText(notificationTitle);

      return (
        title === requestedTitle ||
        requestedTitle.includes(title) ||
        title.includes(requestedTitle)
      );
    }
  );

  if (!notification) {
    const reply = `I couldn't find the notification **${notificationTitle}**.`;

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const updatedNotification = await runAIAction({
    action: "mark_notification_read",
    userId,
    data: {
      id: notification._id,
    },
  });

  const reply = `Done! Notification **${updatedNotification.title}** is marked as read.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
/*
 * DELETE NOTIFICATION
 */

const deleteNotificationMatch = lowerMessage.match(
  /^(?:delete|remove)\s+(?:a\s+)?notification\s+(?:called\s+|titled\s+|named\s+)?(.+)$/i
);

if (deleteNotificationMatch) {
  const notificationTitle = deleteNotificationMatch[1].trim();

  const notifications = await runAIAction({
    action: "get_notifications",
    userId,
  });

  const notification = notifications.find((item) => {
    const title = normalizeText(item.title);
    const requestedTitle = normalizeText(notificationTitle);

    return (
      title === requestedTitle ||
      requestedTitle.includes(title) ||
      title.includes(requestedTitle)
    );
  });

  if (!notification) {
    const reply = `I couldn't find the notification **${notificationTitle}**.`;

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const deletedNotification = await runAIAction({
    action: "delete_notification",
    userId,
    data: {
      id: notification._id,
    },
  });

  const reply = `Done! I deleted notification **${deletedNotification.title}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

// GET / SHOW NOTIFICATIONS

const isGetNotificationsRequest =
  lowerMessage.includes("notification") &&
  !lowerMessage.includes("mark") &&
  !lowerMessage.includes("as read") &&
  (
    lowerMessage.includes("show") ||
    lowerMessage.includes("list") ||
    lowerMessage.includes("my")
  );

if (isGetNotificationsRequest) {
  const notifications = await runAIAction({
    action: "get_notifications",
    userId,
  });

  if (!notifications || notifications.length === 0) {
    const reply = "You don't have any notifications.";

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const notificationList = notifications
    .slice(0, 10)
    .map(
      (notification) =>
        `• **${notification.title}** — ${notification.message}`
    )
    .join("\n");

  const reply =
    `You have **${notifications.length} notification(s)**` +
    ` and **${unreadCount} unread**.\n\n` +
    notificationList;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
/*
 * =========================
 * JOURNAL ACTIONS
 * =========================
 */
const createDocumentMatch = lowerMessage.match(
  /^(?:create|add)\s+(?:a\s+)?document\s+(?:called|named)\s+(.+?)\s+(?:with\s+)?url\s+(\S+)(?:\s+and)?\s+category\s+(.+)$/i
);

if (createDocumentMatch) {
  const [, name, fileUrl, category] = createDocumentMatch;

  const document = await runAIAction({
    action: "create_document",
    userId,
    data: {
      name: name.trim(),
      fileUrl: fileUrl.trim(),
      category: category.trim(),
      sourceType: "url",
    },
  });

  const reply = `Document **${document.name}** created successfully.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
const findJournal = () => {
  const normalizedMessage = normalizeText(message);

  return (context.journals || []).find((journal) => {
    const normalizedTitle = normalizeText(journal.title);

    if (
      normalizedTitle &&
      normalizedMessage.includes(normalizedTitle)
    ) {
      return true;
    }

    return false;
  });
};

const journal = findJournal();

/*
 * CREATE JOURNAL
 *
 * Examples:
 * Add journal Had a productive day
 * Create journal Today I learned React
 */

const createJournalMatch = lowerMessage.match(
  /^(?:add|create|make)\s+(?:a\s+)?journal(?:\s+entry)?(?:\s+(?:about|on|called|titled))?\s+(.+)$/i
);

if (createJournalMatch) {
  const content = createJournalMatch[1].trim();

  const newJournal = await runAIAction({
    action: "create_journal",
    userId,
    data: {
      title: content.slice(0, 50),
      content,
      date: new Date(),
    },
  });

  const reply = `Done! I created a journal entry **${newJournal.title}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

/*
 * DELETE JOURNAL
 */

const isDeleteJournalRequest =
  lowerMessage.includes("delete") ||
  lowerMessage.includes("remove");

if (isDeleteJournalRequest && journal) {
  const deletedJournal = await runAIAction({
    action: "delete_journal",
    userId,
    data: {
      id: journal.id || journal._id,
    },
  });

  if (!deletedJournal) {
    const reply = `I couldn't delete **${journal.title}**.`;

    const conversation = await saveConversation(reply);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  }

  const reply = `Done! I deleted the journal entry **${journal.title}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

/*
 * UPDATE JOURNAL
 */

/*
 * RENAME JOURNAL
 */
const journalRenameMatch = lowerMessage.match(
  /^(?:rename|change)\s+(?:the\s+)?journal(?:\s+entry)?\s+(.+?)\s+(?:to|as)\s+(.+)$/i
);

if (journal && journalRenameMatch) {
  const newTitle = journalRenameMatch[2].trim();

  const updatedJournal = await runAIAction({
    action: "update_journal",
    userId,
    data: {
      id: journal.id || journal._id,
      updates: {
        title: newTitle,
      },
    },
  });

  const reply = `Done! I renamed the journal entry to **${updatedJournal.title}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}

/*
 * UPDATE JOURNAL CONTENT
 */
const journalUpdateMatch = lowerMessage.match(
  /^(?:update|edit|change)\s+(?:the\s+)?journal(?:\s+entry)?\s+(.+?)\s+(?:to|with)\s+(.+)$/i
);

if (journal && journalUpdateMatch) {
  const newContent = journalUpdateMatch[2].trim();

  const updatedJournal = await runAIAction({
    action: "update_journal",
    userId,
    data: {
      id: journal.id || journal._id,
      updates: {
        content: newContent,
      },
    },
  });

  const reply = `Done! I updated the journal entry **${updatedJournal.title}**.`;

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
   /*
 * =========================
 * WEEKLY ACCOMPLISHMENTS
 * =========================
 */

const isWeeklyAccomplishmentRequest =
  lowerMessage.includes("what did i accomplish this week") ||
  lowerMessage.includes("what have i accomplished this week") ||
  lowerMessage.includes("accomplishments this week") ||
  lowerMessage.includes("what did i complete this week") ||
  lowerMessage.includes("what have i completed this week");

if (isWeeklyAccomplishmentRequest) {
  const now = new Date();

  // Monday = start of the current week
  const weekStart = new Date(now);
  const day = weekStart.getDay();

  const daysFromMonday = day === 0 ? 6 : day - 1;

  weekStart.setDate(
    weekStart.getDate() - daysFromMonday
  );
  weekStart.setHours(0, 0, 0, 0);

  const isDateInCurrentWeek = (value) => {
    if (!value) {
      return false;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    return date >= weekStart && date <= now;
  };

  const completedTasks = await runAIAction({
  action: "get_completed_tasks_this_week",
  userId,
  data: {
    weekStart,
    now,
  },
});
  const completedHabits = [];

  (context.habits || []).forEach((habit) => {
    (habit.completedDates || []).forEach((date) => {
      if (isDateInCurrentWeek(date)) {
        completedHabits.push(habit.name);
      }
    });
  });

  const completedGoals = await runAIAction({
  action: "get_completed_goals_this_week",
  userId,
  data: {
    weekStart,
    now,
  },
});

  const completedEvents = await runAIAction({
  action: "get_completed_events_this_week",
  userId,
  data: {
    weekStart,
    now,
  },
});

  const studySessions = (context.studies || []).filter(
    (study) => isDateInCurrentWeek(study.date)
  );

  const totalAccomplishments =
    completedTasks.length +
    completedHabits.length +
    completedGoals.length +
    completedEvents.length +
    studySessions.length;

  let reply = `## 🏆 This Week's Accomplishments\n\n`;

  if (totalAccomplishments === 0) {
    reply +=
      "You haven't recorded any completed activities this week yet.";
  } else {
    if (completedTasks.length > 0) {
      reply += `### ✅ Tasks\n`;

      completedTasks.forEach((task) => {
        reply += `- **${task.title}**\n`;
      });

      reply += "\n";
    }

    if (completedGoals.length > 0) {
      reply += `### 🎯 Goals\n`;

      completedGoals.forEach((goal) => {
        reply += `- **${goal.title}**\n`;
      });

      reply += "\n";
    }

    if (completedHabits.length > 0) {
      reply += `### 🔁 Habits\n`;

      [...new Set(completedHabits)].forEach((habitName) => {
        reply += `- **${habitName}**\n`;
      });

      reply += "\n";
    }

    if (completedEvents.length > 0) {
      reply += `### 📅 Calendar\n`;

      completedEvents.forEach((event) => {
        reply += `- **${event.title}**\n`;
      });

      reply += "\n";
    }

    if (studySessions.length > 0) {
      reply += `### 📚 Study\n`;

      studySessions.forEach((study) => {
        const topic = study.topic
          ? ` — ${study.topic}`
          : "";

        reply += `- **${study.subject}${topic}**\n`;
      });
    }
  }

  const conversation = await saveConversation(reply);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    success: true,
    reply,
    conversationId: conversation._id,
  });
}
    /*
     * =========================
     * AI STUDY PLAN
     * =========================
     */

    const isStudyPlanRequest =
      lowerMessage.includes("study plan") ||
      lowerMessage.includes("study schedule") ||
      lowerMessage.includes("study roadmap") ||
      lowerMessage.includes("make a study plan") ||
      lowerMessage.includes("create a study plan");

    if (isStudyPlanRequest) {
      const workspace = context.studyWorkspace || [];

      if (workspace.length === 0) {
        const reply =
          "You don't have any subjects in your Study Workspace yet.";

        const conversation = await saveConversation(reply);

        if (!conversation) {
          return res.status(404).json({
            success: false,
            message: "Conversation not found",
          });
        }

        return res.status(200).json({
          success: true,
          reply,
          conversationId: conversation._id,
        });
      }

      const studyData = workspace
        .map((subject) => {
          const topics = (subject.topics || [])
            .map(
              (topic) =>
                `- ${topic.title} [${
                  topic.completed
                    ? "Completed"
                    : "Pending"
                }]`
            )
            .join("\n");

          return `Subject: ${subject.subject}\n${topics}`;
        })
        .join("\n\n");

      const studyPlanPrompt = `
Create a practical study plan based ONLY on the user's Study Workspace.

Study Workspace:
${studyData}

Requirements:
- Prioritize pending topics.
- Do not include already completed topics unless useful for revision.
- Organize the plan by subject.
- Give a clear order of what to study.
- Keep it concise and practical.
- Do not invent subjects or topics that are not present.
`;

      const reply = await askAI(
        studyPlanPrompt,
        context
      );

      const conversation = await saveConversation(reply);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        reply,
        conversationId: conversation._id,
      });
    }

    /*
     * =========================
     * NORMAL AI CONVERSATION
     * =========================
     */

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: userId,
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }
    } else {
      conversation = await Conversation.create({
        user: userId,
        title: message.trim().slice(0, 50),
        messages: [],
      });
    }

    const reply = await askAI(
      message,
      context
    );

    conversation.messages.push({
      role: "user",
      content: message.trim(),
    });

    conversation.messages.push({
      role: "assistant",
      content: reply,
    });

    await conversation.save();

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get AI response",
      error: error.message,
    });
  }
};