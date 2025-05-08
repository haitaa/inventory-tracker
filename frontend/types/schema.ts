/**
 * Bu dosya, backend Prisma şemasının TypeScript karşılıklarını içerir.
 * Tüm şema tipleri burada tanımlanacak ve diğer bileşenler tarafından import edilecektir.
 */

/**
 * Represents a category entity
 */
export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  children?: CategoryType[];
  products?: ProductType[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents a brand entity
 */
export interface BrandType {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  products?: ProductType[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents a supplier entity
 */
export interface SupplierType {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  products?: ProductType[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents a product attribute
 */
export interface ProductAttributeType {
  id: string;
  name: string;
  values?: ProductAttributeValueType[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents a product attribute value
 */
export interface ProductAttributeValueType {
  id: string;
  value: string;
  attributeId: string;
  attribute?: ProductAttributeType;
  products?: ProductToAttributeValueType[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents a relation between product and attribute value
 */
export interface ProductToAttributeValueType {
  productId: string;
  attributeValueId: string;
  product?: ProductType;
  attributeValue?: ProductAttributeValueType;
  productVariant?: ProductVariantType;
}

/**
 * Represents a tag entity
 */
export interface TagType {
  id: string;
  name: string;
  slug: string;
  products?: ProductType[];
}

/**
 * Represents a product image
 */
export interface ProductImageType {
  id: string;
  productId: string;
  url: string;
  alt?: string;
  position: number;
  product?: ProductType;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents a product variant
 */
export interface ProductVariantType {
  id: string;
  productId: string;
  product?: ProductType;
  sku: string;
  price?: number;
  cost_price?: number;
  imageUrl?: string;
  stock: number;
  attributeValues?: ProductToAttributeValueType[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents a relation between products
 */
export interface ProductRelationType {
  productId: string;
  relatedProductId: string;
  product?: ProductType;
  relatedProduct?: ProductType;
  type: RelationTypeEnum;
}

/**
 * Represents an inventory transaction
 */
export interface InventoryTransactionType {
  id: string;
  userId?: string;
  user?: UserType;
  productId: string;
  product?: ProductType;
  warehouseId: string;
  warehouse?: WarehouseType;
  type: TransactionTypeEnum;
  quantity: number;
  createdAt?: string;
}

/**
 * Represents a stock record
 */
export interface StockType {
  id: string;
  userId?: string;
  user?: UserType;
  productId: string;
  product?: ProductType;
  warehouseId: string;
  warehouse?: WarehouseType;
  quantity: number;
  version: number;
}

/**
 * Represents a warehouse entity
 */
export interface WarehouseType {
  id: string;
  name?: string;
  code?: string;
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  managerName?: string;
  capacity?: number;
  usedCapacity?: number;
  inventoryTransactions?: InventoryTransactionType[];
  stocks?: StockType[];
}

/**
 * Represents a user entity
 */
export interface UserType {
  id: string;
  email: string;
  username: string;
  products?: ProductType[];
  inventoryTransactions?: InventoryTransactionType[];
  stocks?: StockType[];
  customers?: CustomerType[];
  orders?: OrderType[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Product status enum
 */
export enum ProductStatusEnum {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED"
}

/**
 * Product visibility enum
 */
export enum ProductVisibilityEnum {
  VISIBLE = "VISIBLE",
  HIDDEN = "HIDDEN"
}

/**
 * Relation type enum
 */
export enum RelationTypeEnum {
  RELATED = "RELATED",
  UPSELL = "UPSELL",
  CROSS_SELL = "CROSS_SELL"
}

/**
 * Transaction type enum
 */
export enum TransactionTypeEnum {
  IN = "IN",
  OUT = "OUT"
}

/**
 * Sipariş durumu enum
 */
export enum OrderStatusEnum {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  COMPLETED = "COMPLETED"
}

/**
 * Ödeme tipi enum
 */
export enum PaymentTypeEnum {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  OTHER = "OTHER"
}

/**
 * Müşteri segment türleri
 */
export enum CustomerSegmentEnum {
  REGULAR = "REGULAR",
  VIP = "VIP",
  PREMIUM = "PREMIUM",
  INACTIVE = "INACTIVE",
  NEW = "NEW",
  AT_RISK = "AT_RISK"
}

/**
 * İletişim tercihleri
 */
export interface CommunicationPreferences {
  emailConsent: boolean;
  smsConsent: boolean;
  phoneConsent: boolean;
  preferredChannel: "EMAIL" | "SMS" | "PHONE" | "NONE";
}

/**
 * RFM (Recency, Frequency, Monetary) verisi
 */
export interface RFMData {
  recencyScore: number;
  frequencyScore: number;
  monetaryScore: number;
  totalScore: number;
  lastPurchaseDate?: string;
  purchaseCount: number;
  totalSpent: number;
}

/**
 * İletişim kaydı
 */
export interface CommunicationLogEntry {
  id: string;
  date: string;
  type: "EMAIL" | "SMS" | "PHONE" | "MEETING" | "OTHER";
  subject: string;
  content: string;
  userId: string;
  user?: UserType;
}

/**
 * Müşteriyi temsil eden tip
 */
export interface CustomerType {
  id: string;
  userId: string;
  user?: UserType;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  orders?: OrderType[];
  
  // CRM Özellikleri
  segment?: CustomerSegmentEnum;
  lifetimeValue?: number;
  communicationPreferences?: CommunicationPreferences;
  rfmData?: RFMData;
  communicationLogs?: CommunicationLogEntry[];
  tags?: string[];
  companyName?: string;
  taxId?: string;
  birthDate?: string;
  acquisitionSource?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Siparişi temsil eden tip
 */
export interface OrderType {
  id: string;
  orderNumber: string;
  userId: string;
  user?: UserType;
  customerId: string;
  customer?: CustomerType;
  status: OrderStatusEnum;
  paymentType: PaymentTypeEnum;
  paymentStatus: boolean;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  totalAmount: number;
  notes?: string;
  shippingAddress?: string;
  trackingNumber?: string;
  carrierName?: string;
  items: OrderItemType[];
  logs?: OrderLogType[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sipariş kalemini temsil eden tip
 */
export interface OrderItemType {
  id: string;
  orderId: string;
  order?: OrderType;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  discount?: number;
  totalPrice: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sipariş log kayıtlarını temsil eden tip
 */
export interface OrderLogType {
  id: string;
  orderId: string;
  order?: OrderType;
  userId: string;
  user?: UserType;
  status?: OrderStatusEnum;
  message: string;
  details?: string;
  createdAt: string;
}

/**
 * Ödeme durumu enum
 */
export enum PaymentStatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED"
}

/**
 * Ödeme bilgisini temsil eden tip
 */
export interface PaymentType {
  id: string;
  orderId: string;
  order?: OrderType;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  transactionDate: string;
  status: PaymentStatusEnum;
  errorMessage?: string;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Kredi kartı bilgisi tipi
 */
export interface CreditCardInfo {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

/**
 * Ödeme isteği tipi
 */
export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethodId: string;
  currency: string;
  creditCardInfo?: CreditCardInfo;
  returnUrl?: string;
  description?: string;
}

/**
 * Represents a complete product entity
 */
export interface ProductType {
  id: string;
  userId?: string;
  user?: UserType;
  name: string;
  slug?: string;
  sku: string;
  price: number;
  cost_price?: number;
  compareAtPrice?: number;
  description?: string;
  short_description?: string;
  barcode?: string;
  imageUrl?: string;
  additionalImages?: ProductImageType[];

  // Kategori ilişkisi
  categoryId?: string;
  category?: CategoryType;

  // Marka ilişkisi
  brandId?: string;
  brand?: BrandType;

  // Tedarikçi ilişkisi
  supplierId?: string;
  supplier?: SupplierType;

  // Fiziksel özellikler
  weight?: number;
  width?: number;
  height?: number;
  length?: number;

  // Stok yönetimi
  minStockLevel?: number;
  maxStockLevel?: number;

  // Durum
  status?: ProductStatusEnum;
  visibility?: ProductVisibilityEnum;
  featured?: boolean;

  // Vergi
  taxable?: boolean;
  taxRate?: number;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Barkod seçenekleri
  isbn?: string;
  mpn?: string;
  gtin?: string;

  // İlişkiler
  tags?: TagType[];
  attributeValues?: ProductToAttributeValueType[];
  variants?: ProductVariantType[];
  relatedProducts?: ProductRelationType[];
  relatingProducts?: ProductRelationType[];
  inventoryTransactions?: InventoryTransactionType[];
  stocks?: StockType[];

  // Zaman damgaları
  createdAt?: string;
  updatedAt?: string;
} 