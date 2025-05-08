import api from "@/app/lib/api";
import { CustomerSegmentEnum, CustomerType, OrderType, RFMData } from "@/types/schema";

/**
 * RFM analizi için skorlama kuralları
 */
interface RFMScoringRules {
  recency: { [key: number]: { maxDays: number } };
  frequency: { [key: number]: { minPurchases: number } };
  monetary: { [key: number]: { minAmount: number } };
}

// Varsayılan RFM skorlama kuralları
const defaultRFMScoringRules: RFMScoringRules = {
  recency: {
    5: { maxDays: 30 },    // 0-30 gün = 5 puan
    4: { maxDays: 60 },    // 31-60 gün = 4 puan
    3: { maxDays: 90 },    // 61-90 gün = 3 puan
    2: { maxDays: 180 },   // 91-180 gün = 2 puan
    1: { maxDays: 365 },   // 181-365 gün = 1 puan
  },
  frequency: {
    5: { minPurchases: 10 },  // 10+ sipariş = 5 puan
    4: { minPurchases: 6 },   // 6-9 sipariş = 4 puan
    3: { minPurchases: 3 },   // 3-5 sipariş = 3 puan
    2: { minPurchases: 2 },   // 2 sipariş = 2 puan
    1: { minPurchases: 1 },   // 1 sipariş = 1 puan
  },
  monetary: {
    5: { minAmount: 10000 },  // 10000+ TL = 5 puan
    4: { minAmount: 5000 },   // 5000-9999 TL = 4 puan
    3: { minAmount: 2500 },   // 2500-4999 TL = 3 puan
    2: { minAmount: 1000 },   // 1000-2499 TL = 2 puan
    1: { minAmount: 1 },      // 1-999 TL = 1 puan
  }
};

/**
 * RFM skorlarına göre müşteri segmentini belirler
 * @param rfmData RFM verileri
 * @returns Müşteri segmenti
 */
export const determineSegment = (rfmData: RFMData): CustomerSegmentEnum => {
  const { recencyScore, frequencyScore, monetaryScore, totalScore } = rfmData;

  // Segmentasyon kuralları
  if (totalScore >= 13) {
    return CustomerSegmentEnum.VIP;
  } else if (totalScore >= 10) {
    return CustomerSegmentEnum.PREMIUM;
  } else if (recencyScore <= 2 && (frequencyScore >= 3 || monetaryScore >= 3)) {
    return CustomerSegmentEnum.AT_RISK;
  } else if (recencyScore >= 4 && totalScore < 7) {
    return CustomerSegmentEnum.NEW;
  } else if (recencyScore <= 2 && frequencyScore <= 2 && monetaryScore <= 2) {
    return CustomerSegmentEnum.INACTIVE;
  } else {
    return CustomerSegmentEnum.REGULAR;
  }
};

/**
 * Müşterinin RFM verilerini hesaplar
 * @param orders Müşteri siparişleri
 * @param rules RFM skorlama kuralları (opsiyonel)
 * @returns RFM verileri
 */
export const calculateRFM = (
  orders: OrderType[],
  rules: RFMScoringRules = defaultRFMScoringRules
): RFMData => {
  if (!orders.length) {
    return {
      recencyScore: 0,
      frequencyScore: 0,
      monetaryScore: 0,
      totalScore: 0,
      purchaseCount: 0,
      totalSpent: 0
    };
  }

  // Siparişleri tarihe göre sırala (en yeniden en eskiye)
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
  });

  // Recency - Son sipariş tarihi
  const lastOrderDate = new Date(sortedOrders[0].createdAt || '');
  const today = new Date();
  const daysSinceLastOrder = Math.floor(
    (today.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Frequency - Sipariş sayısı
  const purchaseCount = orders.length;

  // Monetary - Toplam harcama
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Skorları hesapla
  let recencyScore = 0;
  for (let i = 5; i >= 1; i--) {
    if (daysSinceLastOrder <= rules.recency[i].maxDays) {
      recencyScore = i;
      break;
    }
  }

  let frequencyScore = 0;
  for (let i = 5; i >= 1; i--) {
    if (purchaseCount >= rules.frequency[i].minPurchases) {
      frequencyScore = i;
      break;
    }
  }

  let monetaryScore = 0;
  for (let i = 5; i >= 1; i--) {
    if (totalSpent >= rules.monetary[i].minAmount) {
      monetaryScore = i;
      break;
    }
  }

  const totalScore = recencyScore + frequencyScore + monetaryScore;

  return {
    recencyScore,
    frequencyScore,
    monetaryScore,
    totalScore,
    lastPurchaseDate: sortedOrders[0].createdAt,
    purchaseCount,
    totalSpent
  };
};

/**
 * Müşterinin yaşam boyu değerini hesaplar
 * @param orders Müşteri siparişleri
 * @returns Yaşam boyu değer
 */
export const calculateLifetimeValue = (orders: OrderType[]): number => {
  if (!orders.length) return 0;

  // Toplam harcama
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // İlk ve son sipariş arasındaki gün sayısı
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
  });

  const firstOrderDate = new Date(sortedOrders[0].createdAt || '');
  const lastOrderDate = new Date(sortedOrders[sortedOrders.length - 1].createdAt || '');
  const daysBetween = Math.max(
    1,
    Math.floor((lastOrderDate.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  // Ortalama sipariş değeri
  const avgOrderValue = totalSpent / orders.length;

  // Sipariş sıklığı (gün başına)
  const purchaseFrequency = orders.length / daysBetween;

  // Müşterinin ortalama ömrü (gün olarak) - varsayılan olarak 365*3 (3 yıl)
  const customerLifespan = 365 * 3;

  // LTV = Ortalama Sipariş Değeri * Sipariş Sıklığı * Müşteri Ömrü
  return avgOrderValue * purchaseFrequency * customerLifespan;
};

/**
 * Tüm müşteriler için segmentasyon yapar
 * @param customers Müşteriler listesi
 * @param customerOrders Müşterilerin siparişleri
 * @returns Segmentlenmiş müşteriler
 */
export const segmentCustomers = async (
  customers: CustomerType[]
): Promise<CustomerType[]> => {
  const segmentedCustomers = await Promise.all(
    customers.map(async (customer) => {
      // Müşterinin siparişlerini al
      const orders = await api.get<OrderType[]>(`/customers/${customer.id}/orders`);
      
      // RFM hesapla
      const rfmData = calculateRFM(orders.data);
      
      // Segmenti belirle
      const segment = determineSegment(rfmData);
      
      // LTV hesapla
      const lifetimeValue = calculateLifetimeValue(orders.data);
      
      // Müşteriyi güncelle
      return api.put<CustomerType>(`/customers/${customer.id}`, {
        segment,
        lifetimeValue,
        rfmData
      }).then(response => response.data);
    })
  );

  return segmentedCustomers;
};

/**
 * Segmentlere göre gruplandırılmış müşteri sayılarını döndürür
 * @param customers Müşteriler listesi
 * @returns Segment bazlı müşteri sayıları
 */
export const getSegmentDistribution = (
  customers: CustomerType[]
): Record<CustomerSegmentEnum, number> => {
  const distribution: Record<CustomerSegmentEnum, number> = {
    [CustomerSegmentEnum.VIP]: 0,
    [CustomerSegmentEnum.PREMIUM]: 0,
    [CustomerSegmentEnum.REGULAR]: 0,
    [CustomerSegmentEnum.NEW]: 0,
    [CustomerSegmentEnum.INACTIVE]: 0,
    [CustomerSegmentEnum.AT_RISK]: 0
  };

  customers.forEach(customer => {
    if (customer.segment) {
      distribution[customer.segment]++;
    } else {
      distribution[CustomerSegmentEnum.REGULAR]++;
    }
  });

  return distribution;
};

/**
 * Aylık yeni müşteri kazanım oranını hesaplar
 * @param customers Müşteriler listesi
 * @param monthsBack Geriye dönük kaç aylık veri incelenecek
 * @returns Aylık yeni müşteri sayıları
 */
export const getMonthlyCustomerAcquisition = (
  customers: CustomerType[],
  monthsBack: number = 12
): { month: string; count: number }[] => {
  const now = new Date();
  const result: { month: string; count: number }[] = [];

  // Son {monthsBack} ayı döngüye al
  for (let i = 0; i < monthsBack; i++) {
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

    // Bu ay içinde oluşturulan müşterileri say
    const count = customers.filter(customer => {
      const createdAt = new Date(customer.createdAt || '');
      return createdAt >= monthStart && createdAt <= monthEnd;
    }).length;

    result.push({
      month: `${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`,
      count
    });
  }

  // Tarihe göre artan sıralama
  return result.reverse();
};

/**
 * Müşterilerin coğrafi dağılımını hesaplar
 * @param customers Müşteriler listesi
 * @returns Şehir bazlı müşteri sayıları
 */
export const getCustomerGeographicDistribution = (
  customers: CustomerType[]
): { city: string; count: number }[] => {
  const distribution: Record<string, number> = {};

  customers.forEach(customer => {
    if (customer.city) {
      if (!distribution[customer.city]) {
        distribution[customer.city] = 0;
      }
      distribution[customer.city]++;
    }
  });

  return Object.entries(distribution)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);
}; 