import express from "express";
import multer from "multer";
import path from "path";
import {
  importProductsFromExcel,
  importProductsFromCsv,
  importProductsFromGoogleSheet,
  importProductsFromJson,
  importProductsFromXml,
} from "../../controllers/file-import-service/fileImportController.js";
import {
  exportProductsToCsv,
  exportProductsToJson,
  exportProductsToExcel,
  exportProductsToXml,
} from "../../controllers/file-export-service/fileExportController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const fileImportRouter = express.Router();
const upload = multer({ dest: "uploads/" });

fileImportRouter.post(
  "/import",
  requireAuth,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Dosya bulunamadı." });
      }
      const filePath = path.resolve(req.file.path);
      const count = await importProductsFromExcel(filePath, req.userId);
      res.json({ success: true, imported: count });
    } catch (err) {
      next(err);
    }
  }
);

// CSV import endpoint
fileImportRouter.post(
  "/import-csv",
  requireAuth,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Dosya bulunamadı." });
      }
      const filePath = path.resolve(req.file.path);
      const count = await importProductsFromCsv(filePath, req.userId);
      res.json({ success: true, imported: count });
    } catch (err) {
      next(err);
    }
  }
);

// Google Sheets import endpoint
fileImportRouter.post(
  "/import-sheets",
  requireAuth,
  express.json(),
  async (req, res, next) => {
    try {
      const { sheetUrl } = req.body;
      if (!sheetUrl) {
        return res.status(400).json({ error: "Google Sheets URL gerekli." });
      }
      const count = await importProductsFromGoogleSheet(sheetUrl, req.userId);
      res.json({ success: true, imported: count });
    } catch (err) {
      next(err);
    }
  }
);

// JSON import endpoint
fileImportRouter.post(
  "/import-json",
  requireAuth,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Dosya bulunamadı." });
      }
      const filePath = path.resolve(req.file.path);
      const count = await importProductsFromJson(filePath, req.userId);
      res.json({ success: true, imported: count });
    } catch (err) {
      next(err);
    }
  }
);

// XML import endpoint
fileImportRouter.post(
  "/import-xml",
  requireAuth,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Dosya bulunamadı." });
      }
      const filePath = path.resolve(req.file.path);
      const count = await importProductsFromXml(filePath, req.userId);
      res.json({ success: true, imported: count });
    } catch (err) {
      next(err);
    }
  }
);

// Export endpoints
fileImportRouter.get("/export-csv", requireAuth, async (req, res, next) => {
  try {
    await exportProductsToCsv(res, req.userId);
  } catch (err) {
    next(err);
  }
});
fileImportRouter.get("/export-json", requireAuth, async (req, res, next) => {
  try {
    await exportProductsToJson(res, req.userId);
  } catch (err) {
    next(err);
  }
});
fileImportRouter.get("/export-excel", requireAuth, async (req, res, next) => {
  try {
    await exportProductsToExcel(res, req.userId);
  } catch (err) {
    next(err);
  }
});
fileImportRouter.get("/export-xml", requireAuth, async (req, res, next) => {
  try {
    await exportProductsToXml(res, req.userId);
  } catch (err) {
    next(err);
  }
});

export default fileImportRouter;
