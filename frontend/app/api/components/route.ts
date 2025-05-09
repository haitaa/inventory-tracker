import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Tüm bileşenleri getir
export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/components`);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Components API hatası:', error);
    return NextResponse.json(
      { error: 'Bileşenler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 