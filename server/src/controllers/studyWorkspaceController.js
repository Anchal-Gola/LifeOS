import {
  createSubjectService,
  getSubjectsService,
  getSubjectService,
  updateSubjectService,
  deleteSubjectService,
  addTopicService,
  toggleTopicService,
} from "../services/studyWorkspaceService.js";

export const createSubject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    const workspace = await createSubjectService(
      userId,
      subject
    );

    return res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    console.error("Create subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create subject",
      error: error.message,
    });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const workspaces = await getSubjectsService(userId);

    return res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    console.error("Get subjects error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get subjects",
      error: error.message,
    });
  }
};

export const getSubject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const workspace = await getSubjectService(
      id,
      userId
    );

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    console.error("Get subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get subject",
      error: error.message,
    });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const workspace = await updateSubjectService(
      id,
      userId,
      req.body
    );

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    console.error("Update subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update subject",
      error: error.message,
    });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const workspace = await deleteSubjectService(
      id,
      userId
    );

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Delete subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete subject",
      error: error.message,
    });
  }
};

export const addTopic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic title is required",
      });
    }

    const workspace = await addTopicService(
      id,
      userId,
      title
    );

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    console.error("Add topic error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add topic",
      error: error.message,
    });
  }
};

export const toggleTopic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, topicId } = req.params;

    const workspace = await toggleTopicService(
      id,
      userId,
      topicId
    );

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Subject or topic not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    console.error("Toggle topic error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update topic",
      error: error.message,
    });
  }
};