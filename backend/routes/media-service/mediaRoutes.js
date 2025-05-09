import express from "express";
import * as mediaController from "../../controllers/mediaController.js";

const router = express.Router();

// Medya dosyası yükleme
router.post(
  "/upload",
  mediaController.upload.single("file"),
  mediaController.uploadMedia
);

// Tüm medya dosyalarını getir
router.get("/", mediaController.getAllMedia);

// Belirli bir medya dosyasını getir
router.get("/:id", mediaController.getMediaById);

// Medya dosyasını güncelle
router.put("/:id", mediaController.updateMedia);

// Medya dosyasını sil
router.delete("/:id", mediaController.deleteMedia);

// Klasör oluştur
router.post("/folders", mediaController.createFolder);

// Tüm klasörleri getir
router.get("/folders/all", mediaController.getAllFolders);

// Klasörü güncelle
router.put("/folders/:id", mediaController.updateFolder);

// Klasörü sil
router.delete("/folders/:id", mediaController.deleteFolder);

export default router;
