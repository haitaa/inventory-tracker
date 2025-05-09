import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // İstek gövdesinden mesajı al
    const data = await request.json();
    const userMessage = data.message;

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Mesaj alanı boş olamaz' },
        { status: 400 }
      );
    }

    // Burada gerçek bir AI API'sine bağlanabilirsiniz (örn. OpenAI, Hugging Face vs.)
    // Şimdilik basit bir yanıt döndürelim
    
    // Örnek yanıtlar
    const responses = [
      `"${userMessage}" sorunuza yanıt olarak, size yardımcı olmaktan memnuniyet duyarım.`,
      `İlginç bir soru. "${userMessage}" hakkında daha fazla bilgi verebilir misiniz?`,
      `"${userMessage}" ile ilgili birkaç öneri sunabilirim.`,
      `Bu konuda size yardımcı olabilirim. Şunları deneyebilirsiniz...`,
      `"${userMessage}" sorunuzu anladım. İşte çözüm önerilerim...`
    ];
    
    // Rastgele bir yanıt seç
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // API yanıtı için yapay bir gecikme ekleyelim (gerçekçilik için)
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      message: randomResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat API hatası:', error);
    return NextResponse.json(
      { error: 'Mesaj işlenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 