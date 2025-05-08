import api from "@/app/lib/api";
import { OrderType, OrderStatusEnum, PaymentTypeEnum } from "@/types/schema";

/**
 * Tüm siparişleri getirir.
 * @returns {Promise<OrderType[]>} Sipariş listesi
 */
export const getOrders = async (): Promise<OrderType[]> => {
  const response = await api.get<OrderType[]>("/orders");
  return response.data;
};

/**
 * ID'ye göre sipariş detaylarını getirir.
 * @param {string} id - Siparişin ID'si
 * @returns {Promise<OrderType>} Sipariş detayları
 */
export const getOrderById = async (id: string): Promise<OrderType> => {
  const response = await api.get<OrderType>(`/orders/${id}`);
  return response.data;
};

/**
 * Sipariş kalemi için ürün özet bilgilerini hazırlar
 */
export interface OrderItemInput {
  productId: string;
  quantity: number;
  unitPrice?: number;
  discount?: number;
  taxRate?: number;
  notes?: string;
}

/**
 * Sipariş oluşturma için gerekli veriler
 */
export interface OrderInput {
  customerId: string;
  items: OrderItemInput[];
  paymentType?: PaymentTypeEnum;
  paymentStatus?: boolean;
  status?: OrderStatusEnum;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  notes?: string;
  shippingAddress?: string;
  trackingNumber?: string;
  carrierName?: string;
}

/**
 * Yeni sipariş oluşturur.
 * @param {OrderInput} order - Oluşturulacak sipariş bilgileri
 * @returns {Promise<OrderType>} Oluşturulan sipariş
 */
export const createOrder = async (order: OrderInput): Promise<OrderType> => {
  const response = await api.post<OrderType>("/orders", order);
  return response.data;
};

/**
 * Sipariş durumunu günceller.
 * @param {string} id - Siparişin ID'si
 * @param {OrderStatusEnum} status - Yeni sipariş durumu
 * @returns {Promise<OrderType>} Güncellenmiş sipariş
 */
export const updateOrderStatus = async (
  id: string,
  status: OrderStatusEnum
): Promise<OrderType> => {
  const response = await api.patch<OrderType>(`/orders/${id}/status`, { status });
  return response.data;
};

/**
 * Sipariş ödeme bilgilerini günceller.
 * @param {string} id - Siparişin ID'si
 * @param {boolean} paymentStatus - Ödeme durumu
 * @param {PaymentTypeEnum} paymentType - Ödeme tipi
 * @returns {Promise<OrderType>} Güncellenmiş sipariş
 */
export const updatePaymentStatus = async (
  id: string,
  paymentStatus: boolean,
  paymentType?: PaymentTypeEnum
): Promise<OrderType> => {
  const response = await api.patch<OrderType>(`/orders/${id}/payment`, { 
    paymentStatus, 
    paymentType 
  });
  return response.data;
};

/**
 * Sipariş kargo bilgilerini günceller.
 * @param {string} id - Siparişin ID'si
 * @param {object} shippingInfo - Kargo bilgileri
 * @returns {Promise<OrderType>} Güncellenmiş sipariş
 */
export const updateShippingInfo = async (
  id: string,
  shippingInfo: {
    shippingAddress?: string;
    trackingNumber?: string;
    carrierName?: string;
  }
): Promise<OrderType> => {
  const response = await api.patch<OrderType>(`/orders/${id}/shipping`, shippingInfo);
  return response.data;
};

/**
 * Siparişi iptal eder.
 * @param {string} id - Siparişin ID'si
 * @returns {Promise<OrderType>} İptal edilen sipariş
 */
export const cancelOrder = async (id: string): Promise<OrderType> => {
  const response = await api.post<OrderType>(`/orders/${id}/cancel`);
  return response.data;
};

/**
 * Sipariş durumu için Türkçe açıklama döndürür.
 * @param {OrderStatusEnum} status - Sipariş durumu
 * @returns {string} Türkçe açıklaması
 */
export const getOrderStatusLabel = (status: OrderStatusEnum): string => {
  const statusLabels = {
    [OrderStatusEnum.PENDING]: "Beklemede",
    [OrderStatusEnum.PROCESSING]: "İşleniyor",
    [OrderStatusEnum.SHIPPED]: "Kargoya Verildi",
    [OrderStatusEnum.DELIVERED]: "Teslim Edildi",
    [OrderStatusEnum.CANCELLED]: "İptal Edildi",
    [OrderStatusEnum.RETURNED]: "İade Edildi",
    [OrderStatusEnum.COMPLETED]: "Tamamlandı",
  };
  return statusLabels[status] || "Bilinmiyor";
};

/**
 * Sipariş durumu için renk kodu döndürür.
 * @param {OrderStatusEnum} status - Sipariş durumu
 * @returns {string} Renk sınıfı
 */
export const getOrderStatusColor = (status: OrderStatusEnum): string => {
  const statusColors = {
    [OrderStatusEnum.PENDING]: "bg-yellow-100 text-yellow-800",
    [OrderStatusEnum.PROCESSING]: "bg-blue-100 text-blue-800",
    [OrderStatusEnum.SHIPPED]: "bg-indigo-100 text-indigo-800",
    [OrderStatusEnum.DELIVERED]: "bg-green-100 text-green-800",
    [OrderStatusEnum.CANCELLED]: "bg-red-100 text-red-800",
    [OrderStatusEnum.RETURNED]: "bg-purple-100 text-purple-800",
    [OrderStatusEnum.COMPLETED]: "bg-green-100 text-green-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

/**
 * Ödeme tipi için Türkçe açıklama döndürür.
 * @param {PaymentTypeEnum} paymentType - Ödeme tipi
 * @returns {string} Türkçe açıklaması
 */
export const getPaymentTypeLabel = (paymentType: PaymentTypeEnum): string => {
  const paymentLabels = {
    [PaymentTypeEnum.CASH]: "Nakit",
    [PaymentTypeEnum.CREDIT_CARD]: "Kredi Kartı",
    [PaymentTypeEnum.BANK_TRANSFER]: "Banka Havalesi",
    [PaymentTypeEnum.OTHER]: "Diğer",
  };
  return paymentLabels[paymentType] || "Bilinmiyor";
};

/**
 * Siparişleri CSV formatında dışa aktarır.
 * @param {OrderType[]} orders - Dışa aktarılacak siparişler
 * @returns {Promise<void>}
 */
export const exportOrdersToCSV = async (orders: OrderType[]): Promise<void> => {
  // Başlıklar
  const headers = [
    "Sipariş No",
    "Müşteri",
    "E-posta",
    "Telefon",
    "Tarih",
    "Durum",
    "Ödeme Tipi",
    "Toplam Tutar",
    "Kargo Adresi",
    "Takip No",
    "Kargo Firması",
    "Notlar"
  ];

  // Veriler
  const data = orders.map(order => [
    order.orderNumber,
    `${order.customer?.firstName} ${order.customer?.lastName}`,
    order.customer?.email || "",
    order.customer?.phone || "",
    new Date(order.createdAt!).toLocaleDateString("tr-TR"),
    getOrderStatusLabel(order.status),
    getPaymentTypeLabel(order.paymentType),
    `${order.totalAmount.toFixed(2)} ₺`,
    order.shippingAddress || "",
    order.trackingNumber || "",
    order.carrierName || "",
    order.notes || ""
  ]);

  // CSV içeriği oluştur
  let csvContent = headers.join(",") + "\n";
  
  data.forEach(row => {
    // Virgül ve tırnak içeren değerleri düzgün biçimlendir
    const formattedRow = row.map(value => {
      // Değer virgül veya çift tırnak içeriyorsa, çift tırnak içine al ve iç tırnakları iki tırnakla değiştir
      if (value.includes(",") || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    
    csvContent += formattedRow.join(",") + "\n";
  });

  // Dosyayı indirme
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  // Tarih formatını dosya adı için hazırla
  const date = new Date();
  const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  
  link.setAttribute("href", url);
  link.setAttribute("download", `siparisler_${formattedDate}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Sipariş detaylarını PDF olarak dışa aktarır
 * @param {OrderType} order - Dışa aktarılacak sipariş
 * @returns {Promise<void>}
 */
export const exportOrderToPDF = async (order: OrderType): Promise<void> => {
  // Bu kısmı dinamik olarak yükleyeceğiz çünkü jspdf sunucu tarafında çalışmıyor
  const jsPDF = (await import('jspdf')).default;
  const autoTable = (await import('jspdf-autotable')).default;
  
  // PDF oluştur
  const doc = new jsPDF();
  
  // Firma Bilgileri
  doc.setFontSize(20);
  doc.text("E-Ticaret Sipariş Raporu", 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text("Firma Adı: Türkçe E-Ticaret", 14, 30);
  doc.text("Telefon: +90 555 123 4567", 14, 35);
  doc.text("E-posta: info@turkceeticaret.com", 14, 40);
  
  // Sipariş Bilgileri
  doc.setFontSize(16);
  doc.text("Sipariş Bilgileri", 14, 55);
  
  doc.setFontSize(11);
  const orderDate = new Date(order.createdAt!).toLocaleDateString("tr-TR");
  
  doc.text(`Sipariş No: ${order.orderNumber}`, 14, 65);
  doc.text(`Tarih: ${orderDate}`, 14, 70);
  doc.text(`Durum: ${getOrderStatusLabel(order.status)}`, 14, 75);
  doc.text(`Ödeme Tipi: ${getPaymentTypeLabel(order.paymentType)}`, 14, 80);
  doc.text(`Ödeme Durumu: ${order.paymentStatus ? "Ödendi" : "Beklemede"}`, 14, 85);
  
  // Müşteri Bilgileri
  doc.setFontSize(16);
  doc.text("Müşteri Bilgileri", 14, 100);
  
  doc.setFontSize(11);
  doc.text(`Müşteri: ${order.customer?.firstName} ${order.customer?.lastName}`, 14, 110);
  if (order.customer?.email) {
    doc.text(`E-posta: ${order.customer.email}`, 14, 115);
  }
  if (order.customer?.phone) {
    doc.text(`Telefon: ${order.customer.phone}`, 14, 120);
  }
  
  // Teslimat Bilgileri
  if (order.shippingAddress) {
    doc.setFontSize(16);
    doc.text("Teslimat Bilgileri", 14, 135);
    
    doc.setFontSize(11);
    doc.text(`Adres: ${order.shippingAddress}`, 14, 145);
    if (order.trackingNumber) {
      doc.text(`Takip No: ${order.trackingNumber}`, 14, 150);
    }
    if (order.carrierName) {
      doc.text(`Kargo Firması: ${order.carrierName}`, 14, 155);
    }
  }
  
  // Ürünler Tablosu
  doc.setFontSize(16);
  doc.text("Sipariş Kalemleri", 14, 170);
  
  const tableData = order.items.map(item => [
    item.productName,
    item.productSku,
    item.quantity.toString(),
    `${item.unitPrice.toFixed(2)} ₺`,
    item.discount ? `${item.discount.toFixed(2)} ₺` : "-",
    `${item.totalPrice.toFixed(2)} ₺`
  ]);
  
  autoTable(doc, {
    head: [['Ürün', 'SKU', 'Miktar', 'Birim Fiyat', 'İndirim', 'Toplam']],
    body: tableData,
    startY: 175,
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Toplam Tablosu
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  const araToplam = order.items.reduce((total, item) => total + item.totalPrice, 0);
  
  const totalData = [
    ['Ara Toplam', `${araToplam.toFixed(2)} ₺`],
    ...(order.shippingFee ? [['Kargo', `${order.shippingFee.toFixed(2)} ₺`]] : []),
    ...(order.tax ? [['Vergi', `${order.tax.toFixed(2)} ₺`]] : []),
    ...(order.discount ? [['İndirim', `-${order.discount.toFixed(2)} ₺`]] : []),
    ['Toplam', `${order.totalAmount.toFixed(2)} ₺`]
  ];
  
  autoTable(doc, {
    body: totalData,
    startY: finalY,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 100, fontStyle: 'bold' },
      1: { halign: 'right', cellWidth: 30 }
    },
    margin: { left: 100 }
  });
  
  // Notlar
  if (order.notes) {
    const finalY2 = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.text("Notlar:", 14, finalY2);
    doc.setFontSize(10);
    
    // Uzun notları satırlara böl
    const notLines = doc.splitTextToSize(order.notes, 180);
    doc.text(notLines, 14, finalY2 + 7);
  }
  
  // Altbilgi
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(10);
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Sayfa ${i} / ${pageCount}`, 105, 287, { align: 'center' });
    doc.text(`${new Date().toLocaleDateString("tr-TR")} tarihinde oluşturuldu`, 105, 292, { align: 'center' });
  }
  
  // PDF'i indir
  doc.save(`siparis_${order.orderNumber}.pdf`);
};

/**
 * Siparişlerin durumunu toplu olarak günceller.
 * @param {string[]} ids - Siparişlerin ID'leri
 * @param {OrderStatusEnum} status - Yeni sipariş durumu
 * @returns {Promise<OrderType[]>} Güncellenmiş siparişler
 */
export const bulkUpdateOrderStatus = async (
  ids: string[],
  status: OrderStatusEnum
): Promise<OrderType[]> => {
  if (!ids.length) return [];
  
  const response = await api.patch<OrderType[]>("/orders/bulk-status", { 
    ids, 
    status 
  });
  return response.data;
};

/**
 * Siparişi günceller.
 * @param {string} id - Siparişin ID'si
 * @param {Partial<OrderInput>} orderData - Güncellenecek sipariş verileri
 * @returns {Promise<OrderType>} Güncellenmiş sipariş
 */
export const updateOrder = async (
  id: string,
  orderData: Partial<OrderInput>
): Promise<OrderType> => {
  const response = await api.put<OrderType>(`/orders/${id}`, orderData);
  return response.data;
}; 