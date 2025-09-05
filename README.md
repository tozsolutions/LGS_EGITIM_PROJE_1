# LGS Eğitim Platformu

Modern ve kapsamlı bir LGS (Lise Giriş Sınavı) hazırlık platformu. Bu proje, öğrencilerin LGS sınavına hazırlanmaları için gerekli tüm araçları sunan full-stack bir web uygulamasıdır.

## 🚀 Özellikler

### 👨‍🎓 Öğrenci Özellikleri
- **Kapsamlı Soru Bankası**: Tüm LGS derslerinden binlerce soru
- **Gerçekçi Sınav Deneyimi**: LGS formatına uygun deneme sınavları
- **Performans Analizi**: Detaylı istatistikler ve ilerleme takibi
- **Konu Bazında Çalışma**: Derslere ve konulara göre filtrelenmiş sorular
- **Zaman Yönetimi**: Soru başına süre takibi

### 👨‍🏫 Öğretmen Özellikleri
- **Soru Oluşturma**: Yeni sorular ekleme ve düzenleme
- **Sınav Hazırlama**: Özel sınavlar oluşturma
- **Öğrenci Takibi**: Öğrenci performanslarını izleme
- **İçerik Yönetimi**: Eğitim materyalleri yükleme

### 🔧 Yönetici Özellikleri
- **Kullanıcı Yönetimi**: Öğrenci ve öğretmen hesaplarını yönetme
- **Sistem Analizi**: Detaylı platform istatistikleri
- **İçerik Moderasyonu**: Soru ve sınav onayları

## 🏗️ Teknoloji Stack'i

### Backend
- **Node.js** & **TypeScript** - Server-side development
- **Express.js** - Web framework
- **SQLite** - Database (Knex.js ORM)
- **JWT** - Authentication
- **Joi** - Input validation
- **Winston** - Logging
- **Bcrypt** - Password hashing

### Frontend
- **React 18** & **TypeScript** - Modern UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

### Güvenlik
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Validation** - XSS ve injection koruması

## 📦 Kurulum

### Gereksinimler
- Node.js (v16+)
- npm (v8+)

### 1. Projeyi İndirin
```bash
git clone <repository-url>
cd lgs-egitim-proje
```

### 2. Backend Kurulumu
```bash
# Bağımlılıkları yükleyin
npm install

# Veritabanını başlatın
npm run migrate
npm run seed

# Development sunucusunu başlatın
npm run dev:server
```

### 3. Frontend Kurulumu
```bash
# Client dizinine gidin
cd client

# Bağımlılıkları yükleyin
npm install

# Development sunucusunu başlatın
npm run dev
```

### 4. Her İkisini Birden Çalıştırma
```bash
# Ana dizinden
npm run dev
```

## 🔑 Demo Hesapları

### Yönetici
- **E-posta**: admin@lgs-egitim.com
- **Şifre**: Admin123!

### Öğretmen
- **E-posta**: ogretmen@lgs-egitim.com
- **Şifre**: teacher123

### Öğrenci
- **E-posta**: ogrenci@lgs-egitim.com
- **Şifre**: ogrenci123

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Kullanıcı girişi
- `POST /api/v1/auth/register` - Kullanıcı kaydı
- `GET /api/v1/auth/profile` - Kullanıcı profili
- `POST /api/v1/auth/refresh` - Token yenileme
- `POST /api/v1/auth/logout` - Çıkış yapma

### Questions
- `GET /api/v1/questions` - Soruları listele
- `POST /api/v1/questions` - Yeni soru oluştur
- `GET /api/v1/questions/:id` - Soru detayı
- `PUT /api/v1/questions/:id` - Soru güncelle
- `DELETE /api/v1/questions/:id` - Soru sil
- `GET /api/v1/questions/random` - Rastgele sorular

### Exams
- `GET /api/v1/exams` - Sınavları listele
- `POST /api/v1/exams` - Yeni sınav oluştur
- `GET /api/v1/exams/:id` - Sınav detayı
- `POST /api/v1/exams/:id/start` - Sınava başla
- `POST /api/v1/exams/:id/submit` - Sınavı teslim et

## 📊 Veritabanı Yapısı

### Ana Tablolar
- **users** - Kullanıcı bilgileri
- **student_profiles** - Öğrenci detayları
- **teacher_profiles** - Öğretmen detayları
- **questions** - Soru bankası
- **question_options** - Soru seçenekleri
- **exams** - Sınav bilgileri
- **exam_questions** - Sınav-soru ilişkisi
- **exam_attempts** - Sınav denemeleri

## 🎯 LGS Ders Yapısı

### Desteklenen Dersler
1. **Türkçe** (20 soru) 📚
2. **Matematik** (20 soru) 🧮
3. **Fen Bilimleri** (20 soru) 🔬
4. **Sosyal Bilgiler** (10 soru) 🌍
5. **İngilizce** (10 soru) 🇬🇧
6. **Din Kültürü ve Ahlak Bilgisi** (10 soru) ☪️

### Zorluk Seviyeleri
- **Kolay** (1 puan)
- **Orta** (2 puan)
- **Zor** (3 puan)

## 🔧 Geliştirme

### Kod Kalitesi
```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Testing
npm run test
npm run test:watch
```

### Build
```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Vercel (Recommended)
1. GitHub repository'yi Vercel'e bağlayın
2. Build ayarları:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment variables'ları ekleyin
4. Deploy edin

### Netlify
1. GitHub repository'yi Netlify'ye bağlayın
2. Build ayarları:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Environment variables'ları ekleyin
4. Deploy edin

### Docker
```bash
# Docker image oluştur
npm run docker:build

# Container çalıştır
npm run docker:run
```

## 📁 Proje Yapısı

```
lgs-egitim-proje/
├── src/
│   ├── server/
│   │   ├── config/         # Konfigürasyon dosyaları
│   │   ├── middleware/     # Express middleware'ler
│   │   ├── routes/         # API route'ları
│   │   ├── utils/          # Yardımcı fonksiyonlar
│   │   ├── migrations/     # Veritabanı migration'ları
│   │   └── seeds/          # Test verileri
│   └── shared/
│       ├── types/          # TypeScript type tanımları
│       └── constants/      # Sabitler
├── client/
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
│   │   ├── contexts/       # React context'leri
│   │   ├── lib/            # Yardımcı kütüphaneler
│   │   └── styles/         # CSS dosyaları
│   └── public/             # Statik dosyalar
├── public/                 # Server statik dosyaları
├── logs/                   # Log dosyaları
└── database.sqlite         # SQLite veritabanı
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **E-posta**: info@lgs-egitim.com
- **Website**: [lgs-egitim.com](https://lgs-egitim.com)

## 🙏 Teşekkürler

Bu projeyi geliştirirken kullanılan açık kaynak kütüphanelere ve toplulukta katkıda bulunan herkese teşekkürler.

---

**LGS Eğitim Platformu** - Hayalindeki liseye giden yol burada başlıyor! 🎓