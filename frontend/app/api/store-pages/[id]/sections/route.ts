import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Belirli bir sayfanın bölümlerini getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const response = await axios.get(`${BACKEND_URL}/api/store-pages/${id}/sections`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Store page ${params.id} bölümleri getirme hatası:`, error);
    return NextResponse.json(
      { error: 'Sayfa bölümleri yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 