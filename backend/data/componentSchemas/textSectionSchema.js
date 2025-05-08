/**
 * Metin Bölümü bileşeni JSON şeması ve varsayılan değerleri
 */
export const textSectionSchema = {
  schema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Bölüm başlığı",
      },
      subtitle: {
        type: "string",
        description: "Bölüm alt başlığı",
      },
      content: {
        type: "string",
        description: "Metin içeriği (HTML desteği var)",
      },
      alignment: {
        type: "string",
        enum: ["left", "center", "right", "justify"],
        default: "left",
        description: "Metin hizalama",
      },
      padding: {
        type: "object",
        properties: {
          top: {
            type: "number",
            default: 40,
            description: "Üst kenar boşluğu (px)",
          },
          right: {
            type: "number",
            default: 0,
            description: "Sağ kenar boşluğu (px)",
          },
          bottom: {
            type: "number",
            default: 40,
            description: "Alt kenar boşluğu (px)",
          },
          left: {
            type: "number",
            default: 0,
            description: "Sol kenar boşluğu (px)",
          },
        },
      },
      maxWidth: {
        type: "string",
        default: "800px",
        description: "Maksimum genişlik",
      },
      backgroundColor: {
        type: "string",
        format: "color",
        default: "transparent",
        description: "Arka plan rengi",
      },
      textColor: {
        type: "string",
        format: "color",
        default: "#212529",
        description: "Metin rengi",
      },
      titleColor: {
        type: "string",
        format: "color",
        default: "#212529",
        description: "Başlık rengi",
      },
      subtitleColor: {
        type: "string",
        format: "color",
        default: "#6c757d",
        description: "Alt başlık rengi",
      },
      titleSize: {
        type: "string",
        default: "2rem",
        description: "Başlık yazı boyutu",
      },
      subtitleSize: {
        type: "string",
        default: "1.25rem",
        description: "Alt başlık yazı boyutu",
      },
      contentSize: {
        type: "string",
        default: "1rem",
        description: "İçerik yazı boyutu",
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
    required: ["content"],
  },
  defaultProps: {
    title: "Bölüm Başlığı",
    subtitle: "Bölüm Alt Başlığı",
    content:
      '<p>Buraya metin içeriğini girin. Bu bölüm HTML etiketi desteği içerir, böylece <strong>kalın</strong>, <em>italik</em> ve <a href="#">bağlantılar</a> ekleyebilirsiniz.</p><p>Paragraflar, listeler ve diğer HTML öğeleri de desteklenir.</p>',
    alignment: "left",
    padding: {
      top: 40,
      right: 20,
      bottom: 40,
      left: 20,
    },
    maxWidth: "800px",
    backgroundColor: "transparent",
    textColor: "#212529",
    titleColor: "#212529",
    subtitleColor: "#6c757d",
    titleSize: "2rem",
    subtitleSize: "1.25rem",
    contentSize: "1rem",
    buttons: [
      {
        text: "Daha Fazla",
        href: "#",
        variant: "outlined",
        size: "medium",
      },
    ],
  },
};
