/**
 * Navbar bileşeni şeması
 * @type {object}
 */
export const navbarSchema = {
  name: "Navbar",
  description: "Sayfa üzerinde gezinmeyi sağlayan navigasyon menüsü",
  category: "layout",
  icon: "navigation",
  version: "1.0.0",
  props: {
    logo: {
      type: "object",
      title: "Logo Ayarları",
      description: "Navbar'da görüntülenecek logo ayarları",
      properties: {
        image: {
          type: "string",
          format: "uri",
          title: "Logo Görseli",
          description: "Logo görseli URL adresi",
          default: "/images/logo.png",
          ui: {
            component: "image-input",
          },
        },
        alt: {
          type: "string",
          title: "Alternatif Metin",
          description: "Logo yüklenemediğinde gösterilecek metin",
          default: "Site Logosu",
        },
        href: {
          type: "string",
          title: "Bağlantı",
          description: "Logo tıklandığında yönlendirilecek sayfa",
          default: "/",
        },
      },
    },
    menuItems: {
      type: "array",
      title: "Menü Öğeleri",
      description: "Menüde görüntülenecek öğeler",
      ui: {
        component: "array-editor",
        addButtonText: "Yeni Menü Öğesi Ekle",
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
          subItems: {
            type: "array",
            title: "Alt Menü Öğeleri",
            description: "Açılır menüde görüntülenecek alt öğeler (varsa)",
            ui: {
              component: "array-editor",
              addButtonText: "Alt Menü Öğesi Ekle",
            },
            items: {
              type: "object",
              properties: {
                label: {
                  type: "string",
                  title: "Başlık",
                  description: "Alt menüde gösterilecek metin",
                },
                href: {
                  type: "string",
                  title: "Bağlantı",
                  description: "Tıklandığında yönlendirilecek sayfa adresi",
                },
              },
            },
          },
        },
      },
    },
    settings: {
      type: "object",
      title: "Görünüm Ayarları",
      description: "Navbar'ın görünümüne ilişkin ayarlar",
      properties: {
        sticky: {
          type: "boolean",
          title: "Sabit Başlık",
          description:
            "Kaydırma sırasında navbar'ın sayfanın üstünde sabit kalması",
          default: false,
          ui: {
            component: "switch",
          },
        },
        transparent: {
          type: "boolean",
          title: "Şeffaf Arka Plan",
          description: "Navbar'ın arka planının şeffaf olması",
          default: false,
          ui: {
            component: "switch",
          },
        },
        alignment: {
          type: "string",
          title: "Menü Hizalama",
          description: "Menü öğelerinin hizalanma yönü",
          enum: ["left", "center", "right"],
          enumNames: ["Sola", "Ortaya", "Sağa"],
          default: "right",
          ui: {
            component: "radio-group",
          },
        },
        showSearchButton: {
          type: "boolean",
          title: "Arama Butonu",
          description: "Arama butonunun gösterilip gösterilmeyeceği",
          default: false,
          ui: {
            component: "switch",
          },
        },
        colorScheme: {
          type: "string",
          title: "Renk Teması",
          description: "Navbar'ın renk teması",
          enum: ["light", "dark", "primary"],
          enumNames: ["Açık", "Koyu", "Ana Renk"],
          default: "light",
          ui: {
            component: "select",
          },
        },
      },
    },
  },
  template: `
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
};
