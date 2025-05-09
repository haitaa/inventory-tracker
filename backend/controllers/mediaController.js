import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Dosya yükleme yapılandırması
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    // Dizin yoksa oluştur
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Benzersiz dosya adı oluştur
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  // İzin verilen dosya türleri
  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Desteklenmeyen dosya türü. Lütfen JPG, PNG, GIF, WEBP, SVG veya PDF yükleyin."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB maksimum dosya boyutu
});

/**
 * Dosya yükleme
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Dosya bulunamadı" });
    }

    const { originalname, mimetype, filename, size } = req.file;

    // Dosya türünü belirle
    let fileType = "other";
    if (mimetype.startsWith("image/")) {
      fileType = "image";
    } else if (mimetype === "application/pdf") {
      fileType = "document";
    }

    // Dosya yolunu oluştur
    const filePath = `/uploads/${filename}`;

    // Veritabanına kaydet
    const media = await prisma.media.create({
      data: {
        originalName: originalname,
        filename,
        mimeType: mimetype,
        size,
        path: filePath,
        type: fileType,
        alt: req.body.alt || originalname,
        title: req.body.title || originalname,
        description: req.body.description || "",
        folderId: req.body.folderId || null,
      },
    });

    res.status(201).json(media);
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    res.status(500).json({ error: "Dosya yüklenirken bir hata oluştu" });
  }
};

/**
 * Tüm medya dosyalarını getir
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const getAllMedia = async (req, res) => {
  try {
    const { type, folderId, search, page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    // Filtre koşullarını oluştur
    const where = {};

    if (type) {
      where.type = type;
    }

    if (folderId) {
      where.folderId = folderId;
    }

    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Toplam sayıyı al
    const total = await prisma.media.count({ where });

    // Medya dosyalarını getir
    const media = await prisma.media.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      media,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Medya dosyalarını getirme hatası:", error);
    res
      .status(500)
      .json({ error: "Medya dosyaları getirilirken bir hata oluştu" });
  }
};

/**
 * Medya detaylarını getir
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const getMediaById = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return res.status(404).json({ error: "Medya dosyası bulunamadı" });
    }

    res.status(200).json(media);
  } catch (error) {
    console.error("Medya detaylarını getirme hatası:", error);
    res
      .status(500)
      .json({ error: "Medya detayları getirilirken bir hata oluştu" });
  }
};

/**
 * Medya bilgilerini güncelle
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { alt, title, description, folderId } = req.body;

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: {
        alt,
        title,
        description,
        folderId,
      },
    });

    res.status(200).json(updatedMedia);
  } catch (error) {
    console.error("Medya güncelleme hatası:", error);
    res.status(500).json({ error: "Medya güncellenirken bir hata oluştu" });
  }
};

/**
 * Medya dosyasını sil
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // Önce dosya bilgisini al
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return res.status(404).json({ error: "Medya dosyası bulunamadı" });
    }

    // Veritabanından sil
    await prisma.media.delete({
      where: { id },
    });

    // Fiziksel dosyayı sil
    const filePath = path.join(__dirname, "..", media.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Medya dosyası başarıyla silindi" });
  } catch (error) {
    console.error("Medya silme hatası:", error);
    res.status(500).json({ error: "Medya silinirken bir hata oluştu" });
  }
};

/**
 * Klasör oluştur
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Klasör adı gereklidir" });
    }

    const folder = await prisma.mediaFolder.create({
      data: {
        name,
        parentId,
      },
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error("Klasör oluşturma hatası:", error);
    res.status(500).json({ error: "Klasör oluşturulurken bir hata oluştu" });
  }
};

/**
 * Tüm klasörleri getir
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const getAllFolders = async (req, res) => {
  try {
    const folders = await prisma.mediaFolder.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json(folders);
  } catch (error) {
    console.error("Klasörleri getirme hatası:", error);
    res.status(500).json({ error: "Klasörler getirilirken bir hata oluştu" });
  }
};

/**
 * Klasörü güncelle
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Klasör adı gereklidir" });
    }

    const updatedFolder = await prisma.mediaFolder.update({
      where: { id },
      data: {
        name,
        parentId,
      },
    });

    res.status(200).json(updatedFolder);
  } catch (error) {
    console.error("Klasör güncelleme hatası:", error);
    res.status(500).json({ error: "Klasör güncellenirken bir hata oluştu" });
  }
};

/**
 * Klasörü sil
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { moveFilesTo } = req.body;

    // Klasördeki dosyaları kontrol et
    const filesInFolder = await prisma.media.count({
      where: { folderId: id },
    });

    // Dosyalar varsa ve hedef klasör belirtilmemişse hata ver
    if (filesInFolder > 0 && !moveFilesTo) {
      return res.status(400).json({
        error:
          "Klasör içinde dosyalar var. Silmeden önce dosyaları taşıyacağınız bir klasör belirtin veya dosyaları silin.",
        filesCount: filesInFolder,
      });
    }

    // Dosyaları belirtilen klasöre taşı
    if (filesInFolder > 0 && moveFilesTo) {
      await prisma.media.updateMany({
        where: { folderId: id },
        data: { folderId: moveFilesTo },
      });
    }

    // Alt klasörleri kontrol et
    const subFolders = await prisma.mediaFolder.count({
      where: { parentId: id },
    });

    // Alt klasörler varsa hata ver
    if (subFolders > 0) {
      return res.status(400).json({
        error:
          "Klasör içinde alt klasörler var. Önce alt klasörleri silmelisiniz.",
        subFoldersCount: subFolders,
      });
    }

    // Klasörü sil
    await prisma.mediaFolder.delete({
      where: { id },
    });

    res.status(200).json({ message: "Klasör başarıyla silindi" });
  } catch (error) {
    console.error("Klasör silme hatası:", error);
    res.status(500).json({ error: "Klasör silinirken bir hata oluştu" });
  }
};

export {
  uploadMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  createFolder,
  getAllFolders,
  updateFolder,
  deleteFolder,
  upload, // multer middleware'i dışa aktar
};
