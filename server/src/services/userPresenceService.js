const activeUsers = new Map();

const ACTIVE_WINDOW = 30 * 1000;

export const markUserActive = (userId) => {
  activeUsers.set(userId.toString(), Date.now());
};

export const isUserActive = (userId) => {
  const userKey = userId.toString();

  const lastSeen = activeUsers.get(userKey);

  if (!lastSeen) {
    return false;
  }

  const isActive =
    Date.now() - lastSeen < ACTIVE_WINDOW;

  if (!isActive) {
    activeUsers.delete(userKey);
  }

  return isActive;
};

export const removeUserPresence = (userId) => {
  activeUsers.delete(userId.toString());
};