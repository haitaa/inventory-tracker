import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateNavbarComponent() {
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

    // Yeni şema tanımla
    const navbarSchema = {
      properties: {
        logo: {
          type: "object",
          properties: {
            image: {
              type: "string",
              title: "Logo Resmi",
              default: "https://via.placeholder.com/150x50",
            },
            alt: {
              type: "string",
              title: "Logo Alt Metni",
              default: "Şirket Logosu",
            },
          },
        },
        menuItems: {
          type: "array",
          title: "Menü Öğeleri",
          items: {
            type: "object",
            properties: {
              href: {
                type: "string",
                title: "Link URL",
              },
              label: {
                type: "string",
                title: "Link Metni",
              },
              active: {
                type: "boolean",
                title: "Aktif Mi",
                default: false,
              },
            },
          },
          default: [
            {
              href: "/",
              label: "Ana Sayfa",
              active: true,
            },
            {
              href: "/abonelik",
              label: "Abonelik",
              active: false,
            },
            {
              href: "/urunler",
              label: "Ürünler",
              active: false,
            },
            {
              href: "/iletisim",
              label: "İletişim",
              active: false,
            },
          ],
        },
      },
    };

    // HTML ve CSS
    const navbarTemplate = `<nav class="navbar" id="main-navbar">
  <div class="navbar-container">
    <div class="navbar-logo">
      <a href="/">
        <img src="{{{logo.image}}}" alt="{{{logo.alt}}}" />
      </a>
    </div>
    <div class="navbar-menu">
      {{#menuItems}}
      <div class="navbar-item">
        <a href="{{href}}" {{#active}}class="active"{{/active}}>{{label}}</a>
      </div>
      {{/menuItems}}
      <div class="navbar-search">
        <button type="button" aria-label="Ara">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        </button>
      </div>
    </div>
    <div class="navbar-toggle">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</nav>`;

    const navbarStyle = `.navbar {
  display: flex;
  width: 100%;
  height: 70px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
  font-family: var(--font-sans, sans-serif);
}
  
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
}
  
.navbar-logo {
  display: flex;
  align-items: center;
}
  
.navbar-logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
}
  
.navbar-logo img {
  max-height: 40px;
  max-width: 200px;
  object-fit: contain;
}
  
.navbar-menu {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: auto;
}
  
.navbar-item {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 0.5rem;
}
  
.navbar-item a {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}
  
.navbar-item a:hover {
  color: var(--color-primary, #3b82f6);
}

.navbar-item a.active {
  color: var(--color-primary, #3b82f6);
  font-weight: 600;
}
  
.navbar-search {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}
  
.navbar-search button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}
  
.navbar-search button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
  
.navbar-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  cursor: pointer;
}
  
.navbar-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #333;
  transition: all 0.3s ease;
}
  
/* Mobil Uyumlu Görünüm */
@media (max-width: 768px) {
  .navbar-toggle {
    display: flex;
  }
  
  .navbar-menu {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background-color: inherit;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .navbar-menu.open {
    display: flex;
  }
  
  .navbar-item {
    width: 100%;
    margin: 0;
    height: auto;
  }
  
  .navbar-item a {
    width: 100%;
    padding: 1rem 0;
  }
  
  .navbar-search {
    width: 100%;
    margin: 1rem 0 0;
    justify-content: flex-start;
  }
}`;

    const updatedCode = `
<!-- HTML Template -->
${navbarTemplate}

<!-- CSS Styles -->
<style>
${navbarStyle}
</style>

<!-- JavaScript -->
<script>
// Navbar mobile toggle
document.addEventListener('DOMContentLoaded', function() {
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  
  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', function() {
      navbarMenu.classList.toggle('open');
    });
  }
});
</script>
    `;

    console.log("Navbar bileşeni güncelleniyor...");

    // Kodu ve şemayı güncelle
    const updatedVersion = await prisma.componentVersion.update({
      where: { id: version.id },
      data: {
        code: updatedCode,
        schema: navbarSchema,
      },
    });

    console.log(`Navbar bileşeni başarıyla güncellendi: ${version.id}`);
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateNavbarComponent();
