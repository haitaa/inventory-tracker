import { PrismaClient } from "@prisma/client";

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

    // Basitleştirilmiş şema - Daha düz bir yapı kullanır
    const improvedSchema = {
      type: "object",
      properties: {
        // Logo özellikleri
        "logo.image": {
          type: "string",
          title: "Logo Görseli",
          description: "Logo görseli URL adresi",
          default: "/images/logo.png",
        },
        "logo.alt": {
          type: "string",
          title: "Logo Alternatif Metin",
          description: "Logo yüklenemediğinde gösterilecek metin",
          default: "Site Logosu",
        },
        "logo.href": {
          type: "string",
          title: "Logo Bağlantısı",
          description: "Logo tıklandığında yönlendirilecek sayfa",
          default: "/",
        },

        // Görünüm ayarları
        "settings.sticky": {
          type: "boolean",
          title: "Sabit Başlık",
          description:
            "Kaydırma sırasında navbar'ın sayfanın üstünde sabit kalması",
          default: false,
        },
        "settings.transparent": {
          type: "boolean",
          title: "Şeffaf Arka Plan",
          description: "Navbar'ın arka planının şeffaf olması",
          default: false,
        },
        "settings.alignment": {
          type: "string",
          title: "Menü Hizalama",
          description: "Menü öğelerinin hizalanma yönü",
          enum: ["left", "center", "right"],
          enumNames: ["Sola", "Ortaya", "Sağa"],
          default: "right",
        },
        "settings.showSearchButton": {
          type: "boolean",
          title: "Arama Butonu",
          description: "Arama butonunun gösterilip gösterilmeyeceği",
          default: false,
        },
        "settings.colorScheme": {
          type: "string",
          title: "Renk Teması",
          description: "Navbar'ın renk teması",
          enum: ["light", "dark", "primary"],
          enumNames: ["Açık", "Koyu", "Ana Renk"],
          default: "light",
        },

        // Menü öğeleri
        menuItems: {
          type: "array",
          title: "Menü Öğeleri",
          description: "Menüde görüntülenecek öğeler",
          items: {
            type: "object",
            title: "Menü Öğesi",
            properties: {
              label: {
                type: "string",
                title: "Başlık",
                description: "Menüde gösterilecek metin",
              },
              href: {
                type: "string",
                title: "Bağlantı",
                description: "Tıklandığında yönlendirilecek sayfa adresi",
              },
              active: {
                type: "boolean",
                title: "Aktif",
                description: "Bu menü öğesinin görünür olup olmadığı",
                default: true,
              },
            },
          },
          default: [
            {
              label: "Ana Sayfa",
              href: "/",
              active: true,
            },
            {
              label: "Hakkımızda",
              href: "/hakkimizda",
              active: true,
            },
            {
              label: "Ürünler",
              href: "/urunler",
              active: true,
            },
            {
              label: "İletişim",
              href: "/iletisim",
              active: true,
            },
          ],
        },
      },
    };

    console.log("Yeni basitleştirilmiş şema ile güncelleniyor...");

    // Şemayı güncelle
    const updatedVersion = await prisma.componentVersion.update({
      where: { id: version.id },
      data: {
        schema: improvedSchema,
      },
    });

    console.log(`Navbar şeması basitleştirildi ve güncellendi: ${version.id}`);
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
