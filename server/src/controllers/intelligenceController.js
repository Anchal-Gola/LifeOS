import { getLifeInsightsService } from "../services/intelligenceService.js";

export const getLifeInsights = async (req, res) => {
  try {
    const data = await getLifeInsightsService(req.user.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("LifeOS intelligence error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};