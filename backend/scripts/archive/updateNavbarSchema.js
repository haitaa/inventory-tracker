import { PrismaClient } from "@prisma/client";
import { navbarSchema } from "../data/componentSchemas/navbarSchema.js";

const prisma = new PrismaClient();

async function main() {
  try {
    // Tüm navbar bileşenlerini bul
    const components = await prisma.component.findMany({
      where: {
        name: "Navbar",
        category: "layout",
      },
      include: {
        versions: true,
      },
    });

    console.log(`${components.length} adet navbar bileşeni bulundu.`);

    if (components.length === 0) {
      console.log("Güncellenecek navbar bileşeni bulunamadı.");
      return;
    }

    // Her navbar bileşeni için en son versiyonu güncelle
    for (const component of components) {
      if (component.versions.length === 0) {
        console.log(
          `${component.id} ID'li bileşenin versiyonu bulunamadı, atlıyorum.`
        );
        continue;
      }

      const latestVersion = component.versions[0];
      console.log(`${component.id} ID'li bileşenin şeması güncelleniyor...`);

      // Mevcut schema'yı yeni schema ile birleştir
      const updatedVersion = await prisma.componentVersion.update({
        where: { id: latestVersion.id },
        data: {
          schema: navbarSchema.props, // Yeni şemayı kullan
        },
      });

      console.log(`${latestVersion.id} ID'li versiyon güncellendi.`);
    }

    console.log("Tüm navbar bileşenleri başarıyla güncellendi.");
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
