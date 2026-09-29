import {
  markUserActive,
} from "../services/userPresenceService.js";

export const updateUserPresence = (req, res) => {
  try {
    markUserActive(req.user.id);

    res.status(200).json({
      success: true,
      message: "User presence updated",
    });
  } catch (error) {
    console.error(
      "User presence error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};