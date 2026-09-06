import { globalSearchService } from "../services/globalSearchService.js";

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const results = await globalSearchService(
      req.user.id,
      q
    );

    res.status(200).json({
      success: true,
      query: q,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Global search error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};