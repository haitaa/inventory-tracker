import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Belirli bir bileşen versiyonunu getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const response = await axios.get(`${BACKEND_URL}/api/component-versions/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Component version ${params.id} hatası:`, error);
    return NextResponse.json(
      { error: 'Bileşen versiyonu yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 