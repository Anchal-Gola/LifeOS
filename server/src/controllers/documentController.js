import fs from "fs";
import path from "path";

import {
  createDocumentService,
  getDocumentsService,
  updateDocumentService,
  deleteDocumentService,
} from "../services/documentService.js";

export const createDocument = async (req, res) => {
  try {
    const documentData = {
      ...req.body,
      user: req.user.id,
    };

    // If a file was uploaded, save its server URL
    if (req.file) {
      documentData.fileUrl = `/uploads/documents/${req.file.filename}`;
      documentData.fileName = req.file.originalname;
      documentData.fileType = req.file.mimetype;
      documentData.sourceType = "upload";
    } else {
      documentData.sourceType = "url";
    }

    const document = await createDocumentService(documentData);

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    // Remove uploaded file if database operation fails
    if (req.file) {
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "documents",
        req.file.filename
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await getDocumentsService(req.user.id);

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.fileUrl = `/uploads/documents/${req.file.filename}`;
      updateData.fileName = req.file.originalname;
      updateData.fileType = req.file.mimetype;
      updateData.sourceType = "upload";
    } else if (req.body.fileUrl) {
      updateData.sourceType = "url";
    }

    const document = await updateDocumentService(
      req.params.id,
      req.user.id,
      updateData
    );

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    if (req.file) {
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "documents",
        req.file.filename
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await deleteDocumentService(
      req.params.id,
      req.user.id
    );

    // Delete locally uploaded file
    if (
      document?.sourceType === "upload" &&
      document?.fileUrl
    ) {
      const relativePath = document.fileUrl.replace(/^\//, "");

      const filePath = path.join(
        process.cwd(),
        relativePath
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};