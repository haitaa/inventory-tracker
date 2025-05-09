import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Sayfa bölümü oluştur
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const response = await axios.post(`${BACKEND_URL}/api/page-sections`, data);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Sayfa bölümü oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Sayfa bölümü oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 