import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Navbar bileşenini oluştur
    const navbarComponent = await prisma.component.create({
      data: {
        name: "Navbar",
        description: "Sayfa üzerinde gezinmeyi sağlayan navigasyon menüsü",
        tags: ["navbar", "navigation", "menu", "header"],
        category: "layout",
        versions: {
          create: {
            version: "1.0",
            code: `
              <nav class="navbar {{#if settings.sticky}}navbar-sticky{{/if}} {{#if settings.transparent}}navbar-transparent{{/if}} navbar-{{settings.colorScheme}}">
                <div class="navbar-container">
                  <div class="navbar-logo">
                    <a href="{{logo.href}}">
                      <img src="{{logo.image}}" alt="{{logo.alt}}" />
                    </a>
                  </div>
                  <div class="navbar-menu navbar-align-{{settings.alignment}}">
                    {{#each menuItems}}
                      {{#if this.active}}
                        <div class="navbar-item {{#if this.subItems}}has-dropdown{{/if}}">
                          <a href="{{this.href}}">{{this.label}}</a>
                          {{#if this.subItems}}
                            <div class="navbar-dropdown">
                              {{#each this.subItems}}
                                <a href="{{this.href}}">{{this.label}}</a>
                              {{/each}}
                            </div>
                          {{/if}}
                        </div>
                      {{/if}}
                    {{/each}}
                    {{#if settings.showSearchButton}}
                      <div class="navbar-search">
                        <button type="button" aria-label="Ara">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                        </button>
                      </div>
                    {{/if}}
                  </div>
                  <div class="navbar-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </nav>
            `,
            schema: {
              properties: {
                logo: {
                  type: "object",
                  properties: {
                    image: {
                      type: "string",
                      format: "uri",
                      default: "/images/logo.png",
                    },
                    alt: {
                      type: "string",
                      default: "Site Logosu",
                    },
                    href: {
                      type: "string",
                      default: "/",
                    },
                  },
                },
                menuItems: {
                  type: "array",
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
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      href: { type: "string" },
                      active: { type: "boolean", default: true },
                      subItems: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            label: { type: "string" },
                            href: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
                settings: {
                  type: "object",
                  properties: {
                    sticky: {
                      type: "boolean",
                      default: false,
                    },
                    transparent: {
                      type: "boolean",
                      default: false,
                    },
                    alignment: {
                      type: "string",
                      enum: ["left", "center", "right"],
                      default: "right",
                    },
                    showSearchButton: {
                      type: "boolean",
                      default: false,
                    },
                    colorScheme: {
                      type: "string",
                      enum: ["light", "dark", "primary"],
                      default: "light",
                    },
                  },
                },
              },
            },
            preview: "/preview/navbar-component.jpg",
            isActive: true,
          },
        },
      },
      include: {
        versions: true,
      },
    });

    console.log("Navbar bileşeni oluşturuldu:", navbarComponent);
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
