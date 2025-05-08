# Envanter & E-Ticaret Yönetim Sistemi

Bu proje, işletmelerin envanter, ürün, müşteri ve sipariş yönetimi süreçlerini kolaylaştırmak için geliştirilmiş modern bir web uygulamasıdır.

## Özellikler

### Ürün Yönetimi

- Ürün ekleme, düzenleme, silme ve listeleme
- Görsel ürün kartları ile kolay navigasyon
- Otomatik kategori bazlı ikonlar
- Stok yönetimi ve takibi
- Detaylı ürün bilgileri ve özellikleri

### Müşteri Yönetimi

- Müşteri ekleme, düzenleme ve listeleme
- Müşteri bilgileri (ad, soyad, e-posta, telefon, adres)
- Türkçe ve global telefon formatlaması
- Ülke kodu seçici

### Sipariş Yönetimi

- Sipariş oluşturma ve takip etme
- Detaylı sipariş bilgileri
- Görsel zaman çizelgesi (timeline) ile sipariş durumu
- OpenStreetMap entegrasyonu ile sipariş takibi
- Kargo firması entegrasyonu

### Gelişmiş Arama ve Filtreleme

- Ürünler için kategori, fiyat ve stok bazlı filtreleme
- Müşteriler için şehir, ülke, e-posta ve telefon bazlı filtreleme
- Anlık arama sonuçları
- Aktif filtre gösterimi ve kolay filtreleme arayüzü

## Teknolojiler

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Tanstack Table
- Lucide React (ikonlar)

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL

## Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- NPM veya Yarn
- PostgreSQL

### Adımlar

1. Repoyu klonlayın:

```bash
git clone https://github.com/kullanici-adi/envanter-yonetim.git
cd envanter-yonetim
```

2. Backend için bağımlılıkları yükleyin:

```bash
cd backend
npm install
```

3. Frontend için bağımlılıkları yükleyin:

```bash
cd ../frontend
npm install
```

4. `.env` dosyalarını oluşturun:

Backend için (.env):

```
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/envanter_db"
PORT=3001
JWT_SECRET="gizli-anahtar"
```

Frontend için (.env.local):

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

5. Veritabanını oluşturun:

```bash
cd ../backend
npx prisma migrate dev
```

6. Uygulamayı başlatın:

Backend:

```bash
npm run dev
```

Frontend (yeni bir terminal penceresinde):

```bash
cd ../frontend
npm run dev
```

7. Tarayıcınızda http://localhost:3000 adresine gidin.

## Geliştiriciler İçin

### Önemli Klasörler

#### Frontend

- `frontend/app`: Next.js sayfa yapısı
- `frontend/components`: Yeniden kullanılabilir UI bileşenleri
- `frontend/lib`: Servis ve yardımcı fonksiyonlar
- `frontend/types`: TypeScript tip tanımlamaları

#### Backend

- `backend/controllers`: İş mantığı kontrolörleri
- `backend/routes`: API endpoint tanımlamaları
- `backend/prisma`: Veritabanı şeması ve migrations
- `backend/middleware`: Ara yazılımlar

### Geliştirme Komutları

Lint kontrolü:

```bash
npm run lint
```

Testleri çalıştırma:

```bash
npm test
```

Derleme:

```bash
npm run build
```

## Lisans

MIT Lisansı
