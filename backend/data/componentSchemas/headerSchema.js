/**
 * Header bileşeni JSON şeması ve varsayılan değerleri
 */
export const headerSchema = {
  schema: {
    type: "object",
    properties: {
      layout: {
        type: "string",
        enum: ["simple", "centered", "split", "fullWidth"],
        default: "simple",
        description: "Header düzeni",
      },
      logo: {
        type: "object",
        properties: {
          src: {
            type: "string",
            format: "uri",
            description: "Logo görseli URL'si",
          },
          alt: {
            type: "string",
            description: "Logo için alternatif metin",
          },
          width: {
            type: "number",
            description: "Logo genişliği (px)",
          },
          height: {
            type: "number",
            description: "Logo yüksekliği (px)",
          },
        },
        required: ["src"],
      },
      navigation: {
        type: "array",
        items: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "Navigasyon bağlantı metni",
            },
            href: {
              type: "string",
              description: "Navigasyon bağlantı URL'si",
            },
            isExternal: {
              type: "boolean",
              default: false,
              description: "Harici bağlantı mı?",
            },
            subMenu: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: {
                    type: "string",
                    description: "Alt menü bağlantı metni",
                  },
                  href: {
                    type: "string",
                    description: "Alt menü bağlantı URL'si",
                  },
                  isExternal: {
                    type: "boolean",
                    default: false,
                    description: "Harici bağlantı mı?",
                  },
                },
                required: ["text", "href"],
              },
            },
          },
          required: ["text", "href"],
        },
      },
      showSearch: {
        type: "boolean",
        default: true,
        description: "Arama alanını göster",
      },
      showCart: {
        type: "boolean",
        default: true,
        description: "Sepet butonunu göster",
      },
      showAccount: {
        type: "boolean",
        default: true,
        description: "Hesap butonunu göster",
      },
      sticky: {
        type: "boolean",
        default: false,
        description: "Sayfa kaydırılırken başlık sabit kalsın mı?",
      },
      backgroundColor: {
        type: "string",
        format: "color",
        default: "#ffffff",
        description: "Arka plan rengi",
      },
      textColor: {
        type: "string",
        format: "color",
        default: "#333333",
        description: "Metin rengi",
      },
      borderBottom: {
        type: "boolean",
        default: true,
        description: "Alt kenarda çizgi göster",
      },
    },
    required: ["layout"],
  },
  defaultProps: {
    layout: "simple",
    logo: {
      src: "/logo.png",
      alt: "Mağaza Logosu",
      width: 120,
      height: 40,
    },
    navigation: [
      {
        text: "Ana Sayfa",
        href: "/",
      },
      {
        text: "Ürünler",
        href: "/products",
        subMenu: [
          {
            text: "Yeni Gelenler",
            href: "/products/new",
          },
          {
            text: "En Çok Satanlar",
            href: "/products/bestsellers",
          },
        ],
      },
      {
        text: "Hakkımızda",
        href: "/about",
      },
      {
        text: "İletişim",
        href: "/contact",
      },
    ],
    showSearch: true,
    showCart: true,
    showAccount: true,
    sticky: false,
    backgroundColor: "#ffffff",
    textColor: "#333333",
    borderBottom: true,
  },
};
