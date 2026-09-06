import {
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
  getCompletedTasksThisWeekAction,
} from "./actions/taskActions.js";

import {
  createGoalAction,
  updateGoalAction,
  deleteGoalAction,
  completeGoalTodayAction,
  getCompletedGoalsThisWeekAction,
} from "./actions/goalActions.js";

import {
  addStudyTopicAction,
} from "./actions/studyActions.js";

import {
  createHabitAction,
  updateHabitAction,
  deleteHabitAction,
  completeHabitAction,
} from "./actions/habitActions.js";

import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
  completeEventAction,
  getCompletedEventsThisWeekAction,
} from "./actions/eventActions.js";

import {
  createNoteAction,
  getNotesAction,
  updateNoteAction,
  deleteNoteAction,
} from "./actions/noteActions.js";

import {
  createJournalAction,
  getJournalsAction,
  updateJournalAction,
  deleteJournalAction,
} from "./actions/journalActions.js";

import {
  createDocumentAction,
  getDocumentsAction,
  updateDocumentAction,
  deleteDocumentAction,
} from "./actions/documentActions.js";

import {
  createNotificationAction,
  getNotificationsAction,
  markNotificationReadAction,
  deleteNotificationAction,
} from "./actions/notificationActions.js";

export const actionRegistry = {
  create_task: createTaskAction,
  update_task: updateTaskAction,
  delete_task: deleteTaskAction,
  get_completed_tasks_this_week: getCompletedTasksThisWeekAction,

  create_goal: createGoalAction,
  update_goal: updateGoalAction,
  delete_goal: deleteGoalAction,
  complete_goal_today: completeGoalTodayAction,
  get_completed_goals_this_week: getCompletedGoalsThisWeekAction,

  add_study_topic: addStudyTopicAction,

  create_habit: createHabitAction,
  update_habit: updateHabitAction,
  delete_habit: deleteHabitAction,
  complete_habit: completeHabitAction,

  create_event: createEventAction,
update_event: updateEventAction,
delete_event: deleteEventAction,
complete_event: completeEventAction,
get_completed_events_this_week: getCompletedEventsThisWeekAction,

create_note: createNoteAction,
update_note: updateNoteAction,
delete_note: deleteNoteAction,
get_notes: getNotesAction,

create_journal: createJournalAction,
update_journal: updateJournalAction,
delete_journal: deleteJournalAction,
get_journals: getJournalsAction,

create_document: createDocumentAction,
get_documents: getDocumentsAction,
update_document: updateDocumentAction,
delete_document: deleteDocumentAction,

create_notification: createNotificationAction,
get_notifications: getNotificationsAction,
mark_notification_read: markNotificationReadAction,
delete_notification: deleteNotificationAction,
};