import { getAnalyticsService } from "../services/analyticsService.js";

export const getAnalytics = async (req, res) => {
  try {
    const analytics = await getAnalyticsService(req.user.id);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};