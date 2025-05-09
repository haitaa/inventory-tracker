import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Tüm bileşen versiyonlarını getir
export async function GET(request: NextRequest) {
  try {
    // URL parametrelerini al
    const { searchParams } = new URL(request.url);
    const componentId = searchParams.get('componentId');
    
    let url = `${BACKEND_URL}/api/components`;
    
    // Eğer componentId varsa, o bileşenin versiyonlarını getir
    if (componentId) {
      url = `${BACKEND_URL}/api/components/${componentId}/versions`;
    }
    
    const response = await axios.get(url);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Component versions API hatası:', error);
    return NextResponse.json(
      { error: 'Bileşen versiyonları yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 