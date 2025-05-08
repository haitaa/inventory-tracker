/**
 * Footer (alt bilgi) bileşeni JSON şeması ve varsayılan değerleri
 */
export const footerSchema = {
  schema: {
    type: "object",
    properties: {
      layout: {
        type: "string",
        enum: ["simple", "multi-column", "centered", "modern"],
        default: "multi-column",
        description: "Footer düzeni",
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
      },
      columns: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Sütun başlığı",
            },
            links: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: {
                    type: "string",
                    description: "Bağlantı metni",
                  },
                  href: {
                    type: "string",
                    description: "Bağlantı URL'si",
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
          required: ["title", "links"],
        },
      },
      socialLinks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            platform: {
              type: "string",
              enum: [
                "facebook",
                "twitter",
                "instagram",
                "youtube",
                "linkedin",
                "pinterest",
                "tiktok",
              ],
              description: "Sosyal medya platformu",
            },
            url: {
              type: "string",
              format: "uri",
              description: "Sosyal medya profili URL'si",
            },
            icon: {
              type: "string",
              description:
                "Özel ikon (varsayılan ikon kullanmak için boş bırakın)",
            },
          },
          required: ["platform", "url"],
        },
      },
      newsletter: {
        type: "object",
        properties: {
          enabled: {
            type: "boolean",
            default: false,
            description: "Bülten kaydı formunu göster",
          },
          title: {
            type: "string",
            description: "Bülten başlığı",
          },
          subtitle: {
            type: "string",
            description: "Bülten açıklaması",
          },
          buttonText: {
            type: "string",
            default: "Abone Ol",
            description: "Bülten buton metni",
          },
        },
      },
      copyrightText: {
        type: "string",
        description: "Telif hakkı metni",
      },
      contactInfo: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            description: "E-posta adresi",
          },
          phone: {
            type: "string",
            description: "Telefon numarası",
          },
          address: {
            type: "string",
            description: "Fiziksel adres",
          },
        },
      },
      backgroundColor: {
        type: "string",
        format: "color",
        default: "#212529",
        description: "Arka plan rengi",
      },
      textColor: {
        type: "string",
        format: "color",
        default: "#ffffff",
        description: "Metin rengi",
      },
      borderTop: {
        type: "boolean",
        default: true,
        description: "Üst kenarda çizgi göster",
      },
    },
    required: ["layout"],
  },
  defaultProps: {
    layout: "multi-column",
    logo: {
      src: "/logo-white.png",
      alt: "Mağaza Logosu",
      width: 120,
      height: 40,
    },
    columns: [
      {
        title: "Hakkımızda",
        links: [
          {
            text: "Hakkımızda",
            href: "/about",
          },
          {
            text: "Kariyer",
            href: "/careers",
          },
          {
            text: "Mağazalarımız",
            href: "/stores",
          },
          {
            text: "Kurumsal",
            href: "/corporate",
          },
        ],
      },
      {
        title: "Müşteri Hizmetleri",
        links: [
          {
            text: "Yardım Merkezi",
            href: "/help",
          },
          {
            text: "Sipariş Takibi",
            href: "/orders/track",
          },
          {
            text: "İade ve Değişim",
            href: "/returns",
          },
          {
            text: "Sıkça Sorulan Sorular",
            href: "/faq",
          },
        ],
      },
      {
        title: "Politikalar",
        links: [
          {
            text: "Gizlilik Politikası",
            href: "/privacy",
          },
          {
            text: "Kullanım Koşulları",
            href: "/terms",
          },
          {
            text: "İade Politikası",
            href: "/return-policy",
          },
          {
            text: "Teslimat Bilgileri",
            href: "/shipping",
          },
        ],
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://facebook.com",
      },
      {
        platform: "twitter",
        url: "https://twitter.com",
      },
      {
        platform: "instagram",
        url: "https://instagram.com",
      },
    ],
    newsletter: {
      enabled: true,
      title: "Bültenimize Abone Olun",
      subtitle:
        "En son haberler, yeni ürünler ve özel teklifler için abone olun",
      buttonText: "Abone Ol",
    },
    copyrightText: "© 2023 Mağaza Adı. Tüm hakları saklıdır.",
    contactInfo: {
      email: "info@example.com",
      phone: "+90 212 123 45 67",
      address: "İstanbul, Türkiye",
    },
    backgroundColor: "#212529",
    textColor: "#ffffff",
    borderTop: true,
  },
};
