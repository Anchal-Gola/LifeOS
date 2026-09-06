import {
  createStudyService,
  getStudiesService,
  updateStudyService,
  deleteStudyService,
} from "../services/studyService.js";

export const createStudy = async (req, res) => {
  try {
    const study = await createStudyService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: study,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStudies = async (req, res) => {
  try {
    const studies = await getStudiesService(req.user.id);

    res.status(200).json({
      success: true,
      data: studies,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateStudy = async (req, res) => {
  try {
    const study = await updateStudyService(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: study,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteStudy = async (req, res) => {
  try {
    const study = await deleteStudyService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: study,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};