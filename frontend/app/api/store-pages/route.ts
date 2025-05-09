import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    // Backend'den store-pages'i al
    const response = await axios.get(`${BACKEND_URL}/api/store-pages`);
    
    // Verileri döndür
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Store pages API hatası:', error);
    return NextResponse.json(
      { error: 'Mağaza sayfaları yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // İstek verilerini al
    const data = await request.json();
    
    // Backend'e gönder
    const response = await axios.post(`${BACKEND_URL}/api/store-pages`, data);
    
    // Yanıtı döndür
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Store page oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Mağaza sayfası oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 