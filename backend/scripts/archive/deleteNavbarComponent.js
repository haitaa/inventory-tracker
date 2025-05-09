import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Navbar bileşenlerini bul
    const navbars = await prisma.component.findMany({
      where: {
        name: "Navbar",
        category: "layout",
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        versions: true,
      },
    });

    console.log(`${navbars.length} adet navbar bileşeni bulundu.`);

    if (navbars.length <= 1) {
      console.log("Silinecek fazladan navbar bileşeni yok.");
      return;
    }

    // En eski navbar bileşenini seç (ilk oluşturulan)
    const oldestNavbar = navbars[0];

    console.log(
      `Silinecek navbar: ID=${oldestNavbar.id}, Oluşturma Tarihi=${oldestNavbar.createdAt}`
    );

    // Bu bileşen versiyonlarının ID'lerini al
    const versionIds = oldestNavbar.versions.map((v) => v.id);

    // İlişkili sayfa bölümlerini bul ve sil
    for (const versionId of versionIds) {
      const sections = await prisma.pageSection.findMany({
        where: { componentVersionId: versionId },
      });

      if (sections.length > 0) {
        console.log(
          `${versionId} versiyonunu kullanan ${sections.length} adet sayfa bölümü bulundu.`
        );

        // Sayfa bölümlerini sil
        const deletedSections = await prisma.pageSection.deleteMany({
          where: { componentVersionId: versionId },
        });

        console.log(`${deletedSections.count} adet sayfa bölümü silindi.`);
      } else {
        console.log(
          `${versionId} versiyonunu kullanan sayfa bölümü bulunamadı.`
        );
      }
    }

    // Sonra bileşen versiyonlarını sil
    for (const version of oldestNavbar.versions) {
      await prisma.componentVersion.delete({
        where: { id: version.id },
      });
      console.log(`Versiyon silindi: ${version.id}`);
    }

    // En son bileşeni sil
    const deletedComponent = await prisma.component.delete({
      where: { id: oldestNavbar.id },
    });

    console.log(`Navbar bileşeni silindi: ${deletedComponent.id}`);
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
