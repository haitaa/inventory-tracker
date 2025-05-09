import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Hero bileşeni için HTML şablonu
const heroTemplate = `<div class="hero-section">
  <div class="hero-content">
    <h1>{{{title}}}</h1>
    <p>{{{description}}}</p>
    <button class="cta-button">{{{buttonText}}}</button>
  </div>
</div>`;

// Hero bileşeni için CSS stili
const heroStyle = `.hero-section {
  background-color: #f8f9fa;
  padding: 60px 20px;
  text-align: center;
}
.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  color: #333;
}
.hero-content p {
  font-size: 18px;
  margin-bottom: 30px;
  color: #666;
}
.cta-button {
  background-color: #4a6cf7;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}`;

// Navbar bileşeni için HTML şablonu (basitleştirilmiş)
const navbarTemplate = `<div class="navbar-container">
  <div class="navbar-logo" style="width: {{{logoWidth}}}px;">
    <a href="{{{logoUrl}}}">
      {{#showLogo}}
      <img src="{{{logoImage}}}" alt="{{{altText}}}" style="max-height: {{{logoHeight}}}px;" />
      {{/showLogo}}
      {{#showLogoText}}
      <span class="logo-text">{{{logoText}}}</span>
      {{/showLogoText}}
    </a>
  </div>
  <div class="navbar-links">
    <a href="{{{link1Url}}}" class="navbar-link">{{{link1Text}}}</a>
    <a href="{{{link2Url}}}" class="navbar-link">{{{link2Text}}}</a>
    <a href="{{{link3Url}}}" class="navbar-link">{{{link3Text}}}</a>
    <a href="{{{link4Url}}}" class="navbar-link">{{{link4Text}}}</a>
  </div>
  <div class="navbar-search">
    <button aria-label="Ara">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
    </button>
  </div>
</div>`;

// Navbar bileşeni için CSS stili (basitleştirilmiş)
const navbarStyle = `.navbar-container {
  display: flex;
  width: 100%;
  height: 70px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.navbar-logo {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.navbar-logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.navbar-logo img {
  display: block;
  object-fit: contain;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
}

.navbar-link {
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.navbar-link:hover {
  color: #3b82f6;
}

.navbar-search button {
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-wrap: wrap;
    height: auto;
    padding: 1rem 1.5rem;
  }
  
  .navbar-logo {
    margin-bottom: 0.5rem;
  }
  
  .navbar-links {
    order: 3;
    width: 100%;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
}`;

// Özellikler bileşeni için HTML şablonu
const featuresTemplate = `<div class="features-section">
  <h2 class="features-title">{{{sectionTitle}}}</h2>
  <div class="features-grid">
    <div class="feature-item">
      <div class="feature-icon">🚀</div>
      <h3>{{{feature1Title}}}</h3>
      <p>{{{feature1Description}}}</p>
    </div>
    <div class="feature-item">
      <div class="feature-icon">⚡</div>
      <h3>{{{feature2Title}}}</h3>
      <p>{{{feature2Description}}}</p>
    </div>
    <div class="feature-item">
      <div class="feature-icon">🔒</div>
      <h3>{{{feature3Title}}}</h3>
      <p>{{{feature3Description}}}</p>
    </div>
  </div>
</div>`;

// Özellikler bileşeni için CSS stili
const featuresStyle = `.features-section {
  padding: 60px 20px;
  background-color: #fff;
}
.features-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 40px;
  color: #333;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
.feature-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}
.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
.feature-icon {
  font-size: 36px;
  margin-bottom: 15px;
}
.feature-item h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}
.feature-item p {
  color: #666;
  line-height: 1.6;
}`;

// Sidebar bileşeni için HTML şablonu
const sidebarTemplate = `<div class="sidebar">
  <div class="sidebar-header">
    <h3>{{{sidebarTitle}}}</h3>
  </div>
  <div class="sidebar-content">
    <div class="sidebar-section">
      <h4>{{{section1Title}}}</h4>
      <ul class="sidebar-menu">
        <li><a href="{{{link1Url}}}">{{{link1Text}}}</a></li>
        <li><a href="{{{link2Url}}}">{{{link2Text}}}</a></li>
        <li><a href="{{{link3Url}}}">{{{link3Text}}}</a></li>
        <li><a href="{{{link4Url}}}">{{{link4Text}}}</a></li>
      </ul>
    </div>
    <div class="sidebar-section">
      <h4>{{{section2Title}}}</h4>
      <p>{{{section2Content}}}</p>
    </div>
    {{{showContact}}} 
    <div class="sidebar-contact">
      <h4>İletişim</h4>
      <p>{{{contactInfo}}}</p>
    </div>
    {{{/showContact}}}
  </div>
</div>`;

// Sidebar bileşeni için CSS stili
const sidebarStyle = `.sidebar {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 20px;
  height: 100%;
}
.sidebar-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
}
.sidebar-header h3 {
  font-size: 20px;
  color: #333;
  margin: 0;
}
.sidebar-section {
  margin-bottom: 25px;
}
.sidebar-section h4 {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}
.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-menu li {
  margin-bottom: 8px;
}
.sidebar-menu li a {
  color: #4a6cf7;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}
.sidebar-menu li a:hover {
  color: #2843b6;
}
.sidebar-contact {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
}
.sidebar-contact h4 {
  font-size: 16px;
  color: #555;
  margin-top: 0;
  margin-bottom: 10px;
}
.sidebar-contact p {
  font-size: 14px;
  color: #666;
  margin: 0;
}`;

// Footer bileşeni için HTML şablonu
const footerTemplate = `<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-logo-section">
      <img src="{{{logoUrl}}}" alt="{{{companyName}}} Logo" class="footer-logo" />
      <p>{{{companyDescription}}}</p>
    </div>
    
    <div class="footer-links">
      <div class="footer-column">
        <h4>{{{column1Title}}}</h4>
        <ul>
          <li><a href="{{{column1Link1Url}}}">{{{column1Link1Text}}}</a></li>
          <li><a href="{{{column1Link2Url}}}">{{{column1Link2Text}}}</a></li>
          <li><a href="{{{column1Link3Url}}}">{{{column1Link3Text}}}</a></li>
        </ul>
      </div>
      
      <div class="footer-column">
        <h4>{{{column2Title}}}</h4>
        <ul>
          <li><a href="{{{column2Link1Url}}}">{{{column2Link1Text}}}</a></li>
          <li><a href="{{{column2Link2Url}}}">{{{column2Link2Text}}}</a></li>
          <li><a href="{{{column2Link3Url}}}">{{{column2Link3Text}}}</a></li>
        </ul>
      </div>
      
      <div class="footer-column">
        <h4>İletişim</h4>
        <address>
          {{{address}}}<br>
          <a href="mailto:{{{email}}}">{{{email}}}</a><br>
          <a href="tel:{{{phone}}}">{{{phone}}}</a>
        </address>
      </div>
    </div>
  </div>
  
  <div class="footer-bottom">
    <p>{{{copyright}}}</p>
    <div class="social-links">
      <a href="{{{socialLink1}}}" aria-label="Facebook">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="social-icon"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
      </a>
      <a href="{{{socialLink2}}}" aria-label="Twitter">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="social-icon"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
      </a>
      <a href="{{{socialLink3}}}" aria-label="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="social-icon"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
    </div>
  </div>
</footer>`;

// Footer bileşeni için CSS stili
const footerStyle = `.site-footer {
  background-color: #1f2937;
  color: #e5e7eb;
  padding: 60px 0 20px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px;
}

.footer-logo-section {
  flex: 0 0 100%;
  max-width: 350px;
  margin-bottom: 30px;
}

.footer-logo {
  max-height: 50px;
  margin-bottom: 15px;
}

.footer-logo-section p {
  font-size: 14px;
  line-height: 1.6;
  color: #9ca3af;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  justify-content: space-around;
}

.footer-column {
  flex: 0 0 25%;
  min-width: 160px;
  margin-bottom: 30px;
}

.footer-column h4 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #fff;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 8px;
}

.footer-column a {
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-column a:hover {
  color: #fff;
}

address {
  font-style: normal;
  line-height: 1.6;
  font-size: 14px;
  color: #9ca3af;
}

.footer-bottom {
  border-top: 1px solid #374151;
  margin-top: 20px;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}

.footer-bottom p {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-icon {
  color: #9ca3af;
  transition: color 0.2s;
}

.social-icon:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
  }
  
  .footer-links {
    flex-direction: column;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
}`;

// Bileşen şablonlarını güncellemek için ana fonksiyon
async function updateComponentTemplates() {
  try {
    // Navbar bileşenini kontrol et
    const createNavbar = await prisma.component.findFirst({
      where: {
        name: {
          contains: "Navbar",
        },
      },
    });

    // Navbar bileşeni yoksa oluştur
    if (!createNavbar) {
      console.log("Navbar bileşeni oluşturuluyor...");
      const navbarComponent = await prisma.component.create({
        data: {
          name: "Navbar",
          description: "Dinamik olarak özelleştirilebilir navigasyon menüsü",
          tags: ["navbar", "menu", "navigasyon"],
          category: "layout",
        },
      });

      // Navbar bileşeni için versiyon oluştur
      const navbarSchema = {
        properties: {
          logoImage: {
            type: "string",
            title: "Logo Görseli",
            default: "https://via.placeholder.com/150x50",
          },
          logoUrl: {
            type: "string",
            title: "Logo Bağlantısı",
            default: "/",
          },
          altText: {
            type: "string",
            title: "Logo Alt Metni",
            default: "Site Logosu",
          },
          logoWidth: {
            type: "number",
            title: "Logo Genişliği (px)",
            default: 150,
          },
          logoHeight: {
            type: "number",
            title: "Logo Yüksekliği (px)",
            default: 40,
          },
          showLogo: {
            type: "boolean",
            title: "Logo Görseli Göster",
            default: true,
          },
          showLogoText: {
            type: "boolean",
            title: "Logo Metni Göster",
            default: false,
          },
          logoText: {
            type: "string",
            title: "Logo Metni",
            default: "Site Adı",
          },
          link1Url: {
            type: "string",
            title: "Link 1 URL",
            default: "/",
          },
          link1Text: {
            type: "string",
            title: "Link 1 Metni",
            default: "Ana Sayfa",
          },
          link2Url: {
            type: "string",
            title: "Link 2 URL",
            default: "/abonelik",
          },
          link2Text: {
            type: "string",
            title: "Link 2 Metni",
            default: "Abonelik",
          },
          link3Url: {
            type: "string",
            title: "Link 3 URL",
            default: "/urunler",
          },
          link3Text: {
            type: "string",
            title: "Link 3 Metni",
            default: "Ürünler",
          },
          link4Url: {
            type: "string",
            title: "Link 4 URL",
            default: "/iletisim",
          },
          link4Text: {
            type: "string",
            title: "Link 4 Metni",
            default: "İletişim",
          },
        },
      };

      const navbarCode = `
<!-- HTML Template -->
${navbarTemplate}

<!-- CSS Styles -->
<style>
${navbarStyle}
</style>
      `;

      await prisma.componentVersion.create({
        data: {
          componentId: navbarComponent.id,
          version: "1.0.0",
          code: navbarCode,
          schema: navbarSchema,
          preview: `data:image/svg+xml;base64,${Buffer.from(
            '<svg width="200" height="50" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffffff"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#333" text-anchor="middle">Navbar</text></svg>'
          ).toString("base64")}`,
          isActive: true,
        },
      });

      console.log(`Navbar bileşeni başarıyla oluşturuldu.`);
    }

    // Yeni bileşenler oluşturacak mıyız kontrol et
    const createSidebar = await prisma.component.findFirst({
      where: {
        name: {
          contains: "Sidebar",
        },
      },
    });

    const createFooter = await prisma.component.findFirst({
      where: {
        name: {
          contains: "Footer",
        },
      },
    });

    // Sidebar bileşeni yoksa oluştur
    if (!createSidebar) {
      console.log("Sidebar bileşeni oluşturuluyor...");
      const sidebarComponent = await prisma.component.create({
        data: {
          name: "Sidebar Bölümü",
          description:
            "Yan menü için kullanılabilecek özelleştirilebilir kenar çubuğu",
          tags: ["sidebar", "menu", "kenar çubuğu"],
          category: "Layout",
        },
      });

      // Sidebar bileşeni için versiyon oluştur
      const sidebarSchema = {
        properties: {
          sidebarTitle: {
            type: "string",
            title: "Sidebar Başlığı",
            default: "Kenar Çubuğu",
          },
          section1Title: {
            type: "string",
            title: "1. Bölüm Başlığı",
            default: "Hızlı Linkler",
          },
          link1Text: {
            type: "string",
            title: "Link 1 Metni",
            default: "Ana Sayfa",
          },
          link1Url: {
            type: "string",
            title: "Link 1 URL",
            default: "/",
          },
          link2Text: {
            type: "string",
            title: "Link 2 Metni",
            default: "Ürünler",
          },
          link2Url: {
            type: "string",
            title: "Link 2 URL",
            default: "/products",
          },
          link3Text: {
            type: "string",
            title: "Link 3 Metni",
            default: "Hakkımızda",
          },
          link3Url: {
            type: "string",
            title: "Link 3 URL",
            default: "/about",
          },
          link4Text: {
            type: "string",
            title: "Link 4 Metni",
            default: "İletişim",
          },
          link4Url: {
            type: "string",
            title: "Link 4 URL",
            default: "/contact",
          },
          section2Title: {
            type: "string",
            title: "2. Bölüm Başlığı",
            default: "Bilgi",
          },
          section2Content: {
            type: "string",
            title: "2. Bölüm İçeriği",
            default: "Bu alanda kısa bir bilgi veya açıklama yer alabilir.",
          },
          showContact: {
            type: "boolean",
            title: "İletişim Göster",
            default: true,
          },
          contactInfo: {
            type: "string",
            title: "İletişim Bilgileri",
            default: "Email: info@example.com\nTel: 0212 555 55 55",
          },
        },
      };

      const sidebarCode = `
<!-- HTML Template -->
${sidebarTemplate}

<!-- CSS Styles -->
<style>
${sidebarStyle}
</style>

<!-- JavaScript -->
<script>
// Sidebar specific JavaScript
</script>
      `;

      await prisma.componentVersion.create({
        data: {
          componentId: sidebarComponent.id,
          version: "1.0.0",
          code: sidebarCode,
          schema: sidebarSchema,
          preview: `data:image/svg+xml;base64,${Buffer.from(
            '<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#333" text-anchor="middle">Sidebar Bölümü</text></svg>'
          ).toString("base64")}`,
          isActive: true,
        },
      });

      console.log(`Sidebar bileşeni başarıyla oluşturuldu.`);
    }

    // Footer bileşeni yoksa oluştur
    if (!createFooter) {
      console.log("Footer bileşeni oluşturuluyor...");
      const footerComponent = await prisma.component.create({
        data: {
          name: "Footer Bölümü",
          description:
            "Sayfa altı bölüm için kullanılabilecek özelleştirilebilir footer",
          tags: ["footer", "alt bilgi"],
          category: "Layout",
        },
      });

      // Footer bileşeni için versiyon oluştur
      const footerSchema = {
        properties: {
          logoUrl: {
            type: "string",
            title: "Logo URL",
            default: "https://via.placeholder.com/150x50",
          },
          companyName: {
            type: "string",
            title: "Şirket Adı",
            default: "Şirket Adı",
          },
          companyDescription: {
            type: "string",
            title: "Şirket Açıklaması",
            default:
              "Şirketimiz hakkında kısa bir açıklama metni. Bu alanda işletmenizin değerlerini ve misyonunu belirtebilirsiniz.",
          },
          column1Title: {
            type: "string",
            title: "1. Sütun Başlığı",
            default: "Şirket",
          },
          column1Link1Text: {
            type: "string",
            title: "1. Sütun Link 1 Metni",
            default: "Hakkımızda",
          },
          column1Link1Url: {
            type: "string",
            title: "1. Sütun Link 1 URL",
            default: "/about",
          },
          column1Link2Text: {
            type: "string",
            title: "1. Sütun Link 2 Metni",
            default: "Kariyer",
          },
          column1Link2Url: {
            type: "string",
            title: "1. Sütun Link 2 URL",
            default: "/careers",
          },
          column1Link3Text: {
            type: "string",
            title: "1. Sütun Link 3 Metni",
            default: "Blog",
          },
          column1Link3Url: {
            type: "string",
            title: "1. Sütun Link 3 URL",
            default: "/blog",
          },
          column2Title: {
            type: "string",
            title: "2. Sütun Başlığı",
            default: "Destek",
          },
          column2Link1Text: {
            type: "string",
            title: "2. Sütun Link 1 Metni",
            default: "Yardım Merkezi",
          },
          column2Link1Url: {
            type: "string",
            title: "2. Sütun Link 1 URL",
            default: "/help",
          },
          column2Link2Text: {
            type: "string",
            title: "2. Sütun Link 2 Metni",
            default: "Gizlilik Politikası",
          },
          column2Link2Url: {
            type: "string",
            title: "2. Sütun Link 2 URL",
            default: "/privacy",
          },
          column2Link3Text: {
            type: "string",
            title: "2. Sütun Link 3 Metni",
            default: "Kullanım Şartları",
          },
          column2Link3Url: {
            type: "string",
            title: "2. Sütun Link 3 URL",
            default: "/terms",
          },
          address: {
            type: "string",
            title: "Adres",
            default: "Adres Caddesi No: 123\nŞehir/İlçe, 34000",
          },
          email: {
            type: "string",
            title: "E-posta",
            default: "info@example.com",
          },
          phone: {
            type: "string",
            title: "Telefon",
            default: "+90 212 555 55 55",
          },
          copyright: {
            type: "string",
            title: "Telif Hakkı Metni",
            default: "© 2023 Şirket Adı. Tüm hakları saklıdır.",
          },
          socialLink1: {
            type: "string",
            title: "Sosyal Medya 1 URL",
            default: "https://facebook.com",
          },
          socialLink2: {
            type: "string",
            title: "Sosyal Medya 2 URL",
            default: "https://twitter.com",
          },
          socialLink3: {
            type: "string",
            title: "Sosyal Medya 3 URL",
            default: "https://instagram.com",
          },
        },
      };

      const footerCode = `
<!-- HTML Template -->
${footerTemplate}

<!-- CSS Styles -->
<style>
${footerStyle}
</style>

<!-- JavaScript -->
<script>
// Footer specific JavaScript
</script>
      `;

      await prisma.componentVersion.create({
        data: {
          componentId: footerComponent.id,
          version: "1.0.0",
          code: footerCode,
          schema: footerSchema,
          preview: `data:image/svg+xml;base64,${Buffer.from(
            '<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1f2937"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#ffffff" text-anchor="middle">Footer Bölümü</text></svg>'
          ).toString("base64")}`,
          isActive: true,
        },
      });

      console.log(`Footer bileşeni başarıyla oluşturuldu.`);
    }

    // Tüm bileşenleri al
    const components = await prisma.component.findMany();

    if (components.length === 0) {
      console.log("Bileşen bulunamadı. Önce bileşenler oluşturulmalı.");
      return;
    }

    // Her bileşeni kontrol et ve şablonları güncelle
    for (const component of components) {
      console.log(`Bileşen işleniyor: ${component.name}`);

      // Bileşenin versiyonlarını al
      const versions = await prisma.componentVersion.findMany({
        where: {
          componentId: component.id,
        },
      });

      // İsme göre şablon ve şema seç
      let template = "";
      let style = "";
      let schemaObj = {};

      if (component.name.toLowerCase().includes("hero")) {
        template = heroTemplate;
        style = heroStyle;
        schemaObj = {
          properties: {
            title: {
              type: "string",
              title: "Başlık",
              default: "Modern Web Sitesi Oluşturun",
            },
            description: {
              type: "string",
              title: "Açıklama",
              default:
                "Kullanımı kolay araçlarımızla profesyonel bir web sitesi oluşturun. Sürükle ve bırak arayüzü ile dakikalar içinde hazır olun.",
            },
            buttonText: {
              type: "string",
              title: "Buton Metni",
              default: "Hemen Başlayın",
            },
          },
        };
      } else if (
        component.name.toLowerCase().includes("özellik") ||
        component.name.toLowerCase().includes("feature")
      ) {
        template = featuresTemplate;
        style = featuresStyle;
        schemaObj = {
          properties: {
            sectionTitle: {
              type: "string",
              title: "Bölüm Başlığı",
              default: "Öne Çıkan Özellikler",
            },
            feature1Title: {
              type: "string",
              title: "Özellik 1 Başlığı",
              default: "Kolay Kullanım",
            },
            feature1Description: {
              type: "string",
              title: "Özellik 1 Açıklaması",
              default:
                "Kullanıcı dostu arayüzümüz sayesinde teknik bilgiye gerek kalmadan site oluşturabilirsiniz.",
            },
            feature2Title: {
              type: "string",
              title: "Özellik 2 Başlığı",
              default: "Hızlı Performans",
            },
            feature2Description: {
              type: "string",
              title: "Özellik 2 Açıklaması",
              default:
                "Optimize edilmiş kodlar sayesinde siteleriniz her zaman hızlı yüklenir ve sorunsuz çalışır.",
            },
            feature3Title: {
              type: "string",
              title: "Özellik 3 Başlığı",
              default: "Güvenli Altyapı",
            },
            feature3Description: {
              type: "string",
              title: "Özellik 3 Açıklaması",
              default:
                "En son güvenlik önlemleriyle siteniz ve verileriniz her zaman koruma altındadır.",
            },
          },
        };
      } else if (component.name.toLowerCase() === "navbar") {
        // Navbar bileşeni zaten yukarıda oluşturuldu, güncelleme yapmayalım
        console.log("Navbar bileşeni zaten güncel.");
        continue;
      } else if (component.name.toLowerCase().includes("sidebar")) {
        // Sidebar bileşeni güncellenmesin, zaten yukarıda oluşturuldu
        console.log("Sidebar bileşeni zaten güncel.");
        continue;
      } else if (component.name.toLowerCase().includes("footer")) {
        // Footer bileşeni güncellenmesin, zaten yukarıda oluşturuldu
        console.log("Footer bileşeni zaten güncel.");
        continue;
      } else {
        // Diğer bileşenler için varsayılan şablon
        template = `<div class="component">
  <h2>{{{title}}}</h2>
  <p>{{{content}}}</p>
</div>`;
        style = `.component {
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #eee;
  border-radius: 8px;
}`;
        schemaObj = {
          properties: {
            title: {
              type: "string",
              title: "Başlık",
              default: "Bileşen Başlığı",
            },
            content: {
              type: "string",
              title: "İçerik",
              default: "Bileşen içeriği burada yer alacak.",
            },
          },
        };
      }

      // HTML, CSS ve şema bilgilerini birleştir
      const fullCode = `
<!-- HTML Template -->
${template}

<!-- CSS Styles -->
<style>
${style}
</style>

<!-- JavaScript -->
<script>
// Component specific JavaScript
</script>
      `;

      // Veritabanında güncelle
      if (versions.length > 0) {
        // Var olan versiyonu güncelle
        await prisma.componentVersion.update({
          where: { id: versions[0].id },
          data: {
            code: fullCode,
            schema: schemaObj,
            isActive: true,
          },
        });
        console.log(`Bileşen versiyonu güncellendi: ${component.name}`);
      } else {
        // Yeni versiyon oluştur
        await prisma.componentVersion.create({
          data: {
            componentId: component.id,
            version: "1.0.0",
            code: fullCode,
            schema: schemaObj,
            preview: `data:image/svg+xml;base64,${Buffer.from(
              '<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#333" text-anchor="middle">' +
                component.name +
                "</text></svg>"
            ).toString("base64")}`,
            isActive: true,
          },
        });
        console.log(`Yeni bileşen versiyonu oluşturuldu: ${component.name}`);
      }

      // Varsayılan prop değerlerini konsola yazdır (sadece bilgi amaçlı)
      console.log(
        `${component.name} için şema:`,
        JSON.stringify(schemaObj, null, 2)
      );
    }

    console.log("Tüm bileşen şablonları başarıyla güncellendi.");
  } catch (error) {
    console.error("Bileşen şablonları güncellenirken hata oluştu:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Scripti çalıştır
updateComponentTemplates();
