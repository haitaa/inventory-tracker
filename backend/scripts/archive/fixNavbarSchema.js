import { PrismaClient } from "@prisma/client";
import { navbarSchema } from "../data/componentSchemas/navbarSchema.js";

const prisma = new PrismaClient();

async function main() {
  try {
    // Navbar bileşenini bul
    const components = await prisma.component.findMany({
      where: {
        name: "Navbar",
        category: "layout",
      },
      include: {
        versions: true,
      },
    });

    if (components.length === 0) {
      console.log("Navbar bileşeni bulunamadı.");
      return;
    }

    const component = components[0]; // İlk navbar bileşenini seç

    if (component.versions.length === 0) {
      console.log("Bileşen versiyonu bulunamadı.");
      return;
    }

    const version = component.versions[0]; // İlk versiyonu al

    console.log("Mevcut şema:", JSON.stringify(version.schema, null, 2));

    // Düzeltilmiş şemayı hazırla
    const fixedSchema = {
      type: "object",
      properties: navbarSchema.props,
    };

    console.log("Yeni şema:", JSON.stringify(fixedSchema, null, 2));

    // Şemayı güncelle
    const updatedVersion = await prisma.componentVersion.update({
      where: { id: version.id },
      data: {
        schema: fixedSchema,
      },
    });

    console.log(`Şema başarıyla güncellendi: ${version.id}`);
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
