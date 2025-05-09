/**
 * Sayfayı yayınlama veya yayından kaldırma
 * @param {Object} req - Express request nesnesi
 * @param {Object} res - Express response nesnesi
 */
const publishPage = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const { isPublished } = req.body;

    if (typeof isPublished !== "boolean") {
      return res.status(400).json({
        error: "isPublished alanı boolean tipinde olmalıdır",
      });
    }

    const updatedPage = await prisma.storePage.update({
      where: { id },
      data: { isPublished },
    });

    res.status(200).json(updatedPage);
  } catch (error) {
    console.error("Sayfa yayınlama hatası:", error);
    res.status(500).json({ error: "Sayfa yayınlanırken bir hata oluştu" });
  }
};

export { publishPage };
