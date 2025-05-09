import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debugNavbar() {
  try {
    // Navbar bileşenini bul
    const navbarComponent = await prisma.component.findFirst({
      where: {
        name: "Navbar",
        category: "layout",
      },
      include: {
        versions: true,
      },
    });

    if (!navbarComponent) {
      console.log("Navbar bileşeni bulunamadı.");
      return;
    }

    if (navbarComponent.versions.length === 0) {
      console.log("Bileşen versiyonu bulunamadı.");
      return;
    }

    const version = navbarComponent.versions[0]; // İlk versiyonu al

    console.log("Mevcut Navbar Şablonu:", version.code);
    console.log(
      "Mevcut Navbar Şeması:",
      JSON.stringify(version.schema, null, 2)
    );

    // Düzeltilmiş şablon
    const updatedCode = version.code
      .replace(/\{\{href\}\}/g, "{{{href}}}")
      .replace(/\{\{label\}\}/g, "{{{label}}}")
      .replace(/\{\{#menuItems\}\}/g, "{{#menuItems}}")
      .replace(/\{\{\/menuItems\}\}/g, "{{/menuItems}}");

    // Kodu güncelle
    const updatedVersion = await prisma.componentVersion.update({
      where: { id: version.id },
      data: {
        code: updatedCode,
      },
    });

    console.log("Navbar şablonu düzeltildi.");
    console.log("Düzeltilmiş Navbar Şablonu:", updatedVersion.code);
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

debugNavbar();
