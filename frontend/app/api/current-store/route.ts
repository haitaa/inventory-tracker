import { NextResponse, NextRequest } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function GET(request: NextRequest) {
  try {
    // Cookie'lerden mağaza id'sini al (Promise olarak işle)
    const cookieStore = await cookies();
    const storeId = cookieStore.get('currentStoreId')?.value;
    
    // Eğer cookie'de mağaza id yoksa, default mağazayı getir
    if (!storeId) {
      // Store-builder-service API endpoint'ini kullan
      const response = await axios.get(`${BACKEND_URL}/api/stores/default`);
      return NextResponse.json(response.data);
    }
    
    // Cookie'de bulunan mağaza id'sini kullanarak mağaza bilgilerini getir
    const response = await axios.get(`${BACKEND_URL}/api/stores/${storeId}`);
    
    // Verileri döndür
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    // Hata türünü Axios hatasına dönüştür
    const axiosError = error as AxiosError;
    console.error('Current store API hatası:', axiosError);
    
    // Daha fazla hata bilgisi ekle
    const errorDetail = 
      axiosError.response?.data ? JSON.stringify(axiosError.response.data) : 
      axiosError.message || 'Bilinmeyen hata';
    
    return NextResponse.json(
      { 
        error: 'Mağaza bilgisi alınamadı', 
        detail: errorDetail,
        url: axiosError.config?.url 
      },
      { status: 500 }
    );
  }
} 