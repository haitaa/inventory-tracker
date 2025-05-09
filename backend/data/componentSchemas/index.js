import { headerSchema } from "./headerSchema.js";
import { footerSchema } from "./footerSchema.js";
import { heroSchema } from "./heroSchema.js";
import { textSectionSchema } from "./textSectionSchema.js";
import { productCardSchema } from "./productCardSchema.js";
import { navbarSchema } from "./navbarSchema.js";

/**
 * Kullanılabilir tüm bileşenler ve şemaları
 */
export const componentSchemas = {
  header: headerSchema,
  footer: footerSchema,
  hero: heroSchema,
  textSection: textSectionSchema,
  productCard: productCardSchema,
  navbar: navbarSchema,
};

/**
 * Bileşen kategorileri
 */
export const componentCategories = [
  {
    id: "layout",
    name: "Sayfa Düzeni",
    description: "Sayfaların temel düzenini oluşturan bileşenler",
    icon: "layout",
    slug: "layout",
    components: ["header", "footer", "navbar"],
  },
  {
    id: "hero",
    name: "Kahraman Bölümleri",
    description: "Sayfanın üst kısmında dikkat çekici içerikler",
    icon: "star",
    slug: "hero",
    components: ["hero"],
  },
  {
    id: "content",
    name: "İçerik Bileşenleri",
    description: "Metin ve medya içerikleri",
    icon: "file-text",
    slug: "content",
    components: ["textSection"],
  },
  {
    id: "ecommerce",
    name: "E-Ticaret",
    description: "Ürün listeleme ve alışveriş bileşenleri",
    icon: "shopping-bag",
    slug: "ecommerce",
    components: ["productCard"],
  },
];
