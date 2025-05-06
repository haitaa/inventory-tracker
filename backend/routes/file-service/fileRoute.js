import express from "express";
import multer from "multer";
import path from "path";
import { importProductsFromExcel } from "../../controllers/file-import-service/fileImportController.js";
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
  },
);

export default fileImportRouter;
