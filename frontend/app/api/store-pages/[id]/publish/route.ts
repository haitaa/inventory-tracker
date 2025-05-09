import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Sayfayı yayınla veya yayından kaldır
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    const response = await axios.put(`${BACKEND_URL}/api/store-pages/${id}/publish`, data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Store page ${params.id} yayınlama hatası:`, error);
    return NextResponse.json(
      { error: 'Sayfa yayınlanırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 