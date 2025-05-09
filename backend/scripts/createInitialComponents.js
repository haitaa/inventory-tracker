import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Temel Hero bileşeni oluştur
    const heroComponent = await prisma.component.create({
      data: {
        name: "Hero Bölümü",
        description:
          "Bir sayfanın üst kısmında görünen ana görsel ve metin içeren bileşen",
        tags: ["hero", "banner", "header"],
        category: "header",
        versions: {
          create: {
            version: "1.0",
            code: `
              <div class="hero-container">
                <h1>{{title}}</h1>
                <p>{{subtitle}}</p>
                <a href="{{buttonUrl}}" class="button">{{buttonText}}</a>
                <img src="{{imageUrl}}" alt="{{imageAlt}}">
              </div>
            `,
            schema: {
              properties: {
                title: { type: "string", default: "Ana Başlık" },
                subtitle: {
                  type: "string",
                  default: "Alt başlık metni buraya gelecek",
                },
                buttonText: { type: "string", default: "Tıkla" },
                buttonUrl: { type: "string", default: "#" },
                imageUrl: {
                  type: "string",
                  default: "/images/default-hero.jpg",
                },
                imageAlt: { type: "string", default: "Hero görsel açıklaması" },
              },
            },
            preview: "/preview/hero-component.jpg",
            isActive: true,
          },
        },
      },
      include: {
        versions: true,
      },
    });

    // Temel özellikler bileşeni oluştur
    const featuresComponent = await prisma.component.create({
      data: {
        name: "Özellikler Bölümü",
        description: "Ürün veya hizmet özelliklerini gösteren bileşen",
        tags: ["features", "list", "benefits"],
        category: "content",
        versions: {
          create: {
            version: "1.0",
            code: `
              <div class="features-container">
                <h2>{{title}}</h2>
                <div class="features-grid">
                  {{#each features}}
                    <div class="feature-item">
                      <img src="{{this.icon}}" alt="{{this.title}}">
                      <h3>{{this.title}}</h3>
                      <p>{{this.description}}</p>
                    </div>
                  {{/each}}
                </div>
              </div>
            `,
            schema: {
              properties: {
                title: { type: "string", default: "Özellikler" },
                features: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      icon: {
                        type: "string",
                        default: "/icons/feature-icon.svg",
                      },
                      title: { type: "string", default: "Özellik Başlığı" },
                      description: {
                        type: "string",
                        default: "Özellik açıklaması buraya gelecek",
                      },
                    },
                  },
                  default: [
                    {
                      icon: "/icons/feature1.svg",
                      title: "Özellik 1",
                      description: "Birinci özellik açıklaması",
                    },
                    {
                      icon: "/icons/feature2.svg",
                      title: "Özellik 2",
                      description: "İkinci özellik açıklaması",
                    },
                    {
                      icon: "/icons/feature3.svg",
                      title: "Özellik 3",
                      description: "Üçüncü özellik açıklaması",
                    },
                  ],
                },
              },
            },
            preview: "/preview/features-component.jpg",
            isActive: true,
          },
        },
      },
      include: {
        versions: true,
      },
    });

    console.log("Hero bileşeni oluşturuldu:", heroComponent);
    console.log("Özellikler bileşeni oluşturuldu:", featuresComponent);
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
