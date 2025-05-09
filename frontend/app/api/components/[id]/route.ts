import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Belirli bir bileşeni getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const response = await axios.get(`${BACKEND_URL}/api/components/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Component ${params.id} hatası:`, error);
    return NextResponse.json(
      { error: 'Bileşen yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 