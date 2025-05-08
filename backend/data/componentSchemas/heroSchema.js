/**
 * Hero (kahraman) bileşeni JSON şeması ve varsayılan değerleri
 */
export const heroSchema = {
  schema: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["simple", "withImage", "withVideo", "carousel", "splitContent"],
        default: "withImage",
        description: "Hero tipi",
      },
      height: {
        type: "string",
        enum: ["small", "medium", "large", "fullScreen"],
        default: "medium",
        description: "Hero yüksekliği",
      },
      title: {
        type: "string",
        description: "Ana başlık",
      },
      subtitle: {
        type: "string",
        description: "Alt başlık",
      },
      alignment: {
        type: "string",
        enum: ["left", "center", "right"],
        default: "center",
        description: "İçerik hizalama",
      },
      backgroundColor: {
        type: "string",
        format: "color",
        default: "#f8f9fa",
        description: "Arka plan rengi",
      },
      textColor: {
        type: "string",
        format: "color",
        default: "#212529",
        description: "Metin rengi",
      },
      image: {
        type: "object",
        properties: {
          src: {
            type: "string",
            format: "uri",
            description: "Görsel URL'si",
          },
          alt: {
            type: "string",
            description: "Görsel için alternatif metin",
          },
          position: {
            type: "string",
            enum: ["left", "right", "center", "top", "bottom"],
            default: "center",
            description: "Görsel konumu",
          },
          overlay: {
            type: "boolean",
            default: false,
            description: "Görselin üzerine overlay ekle",
          },
          overlayColor: {
            type: "string",
            format: "color",
            default: "rgba(0,0,0,0.5)",
            description: "Overlay rengi",
          },
        },
        required: ["src"],
      },
      video: {
        type: "object",
        properties: {
          src: {
            type: "string",
            format: "uri",
            description: "Video URL'si",
          },
          type: {
            type: "string",
            enum: ["youtube", "vimeo", "mp4"],
            default: "youtube",
            description: "Video türü",
          },
          autoplay: {
            type: "boolean",
            default: true,
            description: "Otomatik oynat",
          },
          muted: {
            type: "boolean",
            default: true,
            description: "Sessiz",
          },
          loop: {
            type: "boolean",
            default: true,
            description: "Döngü",
          },
          controls: {
            type: "boolean",
            default: false,
            description: "Kontrolleri göster",
          },
          overlay: {
            type: "boolean",
            default: false,
            description: "Videonun üzerine overlay ekle",
          },
          overlayColor: {
            type: "string",
            format: "color",
            default: "rgba(0,0,0,0.5)",
            description: "Overlay rengi",
          },
        },
        required: ["src", "type"],
      },
      carousel: {
        type: "array",
        items: {
          type: "object",
          properties: {
            image: {
              type: "string",
              format: "uri",
              description: "Slayt görseli URL'si",
            },
            title: {
              type: "string",
              description: "Slayt başlığı",
            },
            subtitle: {
              type: "string",
              description: "Slayt alt başlığı",
            },
          },
          required: ["image"],
        },
      },
      buttons: {
        type: "array",
        items: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "Buton metni",
            },
            href: {
              type: "string",
              description: "Buton URL'si",
            },
            isExternal: {
              type: "boolean",
              default: false,
              description: "Harici bağlantı mı?",
            },
            variant: {
              type: "string",
              enum: ["primary", "secondary", "outlined", "text"],
              default: "primary",
              description: "Buton varyantı",
            },
            size: {
              type: "string",
              enum: ["small", "medium", "large"],
              default: "medium",
              description: "Buton boyutu",
            },
          },
          required: ["text", "href"],
        },
      },
    },
    required: ["type", "title"],
  },
  defaultProps: {
    type: "withImage",
    height: "medium",
    title: "En Kaliteli Ürünler",
    subtitle:
      "Çok çeşitli ürünler arasından seçim yapın ve hemen alışverişe başlayın",
    alignment: "center",
    backgroundColor: "#f8f9fa",
    textColor: "#212529",
    image: {
      src: "/images/hero-background.jpg",
      alt: "Ürünlerimizi keşfedin",
      position: "center",
      overlay: true,
      overlayColor: "rgba(0,0,0,0.4)",
    },
    buttons: [
      {
        text: "Alışverişe Başla",
        href: "/products",
        variant: "primary",
        size: "large",
      },
      {
        text: "Daha Fazla Bilgi",
        href: "/about",
        variant: "outlined",
        size: "large",
      },
    ],
  },
};
