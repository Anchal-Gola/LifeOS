import { getDashboardService } from "../services/dashboardService.js";

export const getDashboard = async (req, res) => {
  try {
    const dashboard = await getDashboardService(req.user.id);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};