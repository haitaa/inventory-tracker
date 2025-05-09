import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Bileşen versiyonlarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const response = await axios.get(`${BACKEND_URL}/api/components/${id}/versions`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Component ${params.id} versiyonları hatası:`, error);
    return NextResponse.json(
      { error: 'Bileşen versiyonları yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 