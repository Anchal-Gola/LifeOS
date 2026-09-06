import { actionRegistry } from "./actionRegistry.js";

export const runAIAction = async ({
  action,
  userId,
  data = {},
}) => {
  const actionHandler = actionRegistry[action];

  if (!actionHandler) {
    throw new Error(`Unknown AI action: ${action}`);
  }

  return await actionHandler(userId, data);
};