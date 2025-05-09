import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Sayfa bölümünü güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    const response = await axios.put(`${BACKEND_URL}/api/page-sections/${id}`, data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Sayfa bölümü ${params.id} güncelleme hatası:`, error);
    return NextResponse.json(
      { error: 'Sayfa bölümü güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Sayfa bölümünü sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const response = await axios.delete(`${BACKEND_URL}/api/page-sections/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Sayfa bölümü ${params.id} silme hatası:`, error);
    return NextResponse.json(
      { error: 'Sayfa bölümü silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 