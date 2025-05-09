import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Belirli bir sayfayı getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const response = await axios.get(`${BACKEND_URL}/api/store-pages/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Store page ${params.id} getirme hatası:`, error);
    return NextResponse.json(
      { error: 'Mağaza sayfası yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Sayfayı güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    const response = await axios.put(`${BACKEND_URL}/api/store-pages/${id}`, data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Store page ${params.id} güncelleme hatası:`, error);
    return NextResponse.json(
      { error: 'Mağaza sayfası güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Sayfayı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const response = await axios.delete(`${BACKEND_URL}/api/store-pages/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Store page ${params.id} silme hatası:`, error);
    return NextResponse.json(
      { error: 'Mağaza sayfası silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 