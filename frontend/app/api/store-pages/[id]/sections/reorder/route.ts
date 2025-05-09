import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Sayfa bölümlerini yeniden sırala
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    const response = await axios.put(`${BACKEND_URL}/api/store-pages/${id}/sections/reorder`, data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Store page ${params.id} bölüm sıralama hatası:`, error);
    return NextResponse.json(
      { error: 'Bölüm sıralaması güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 