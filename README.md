# 🎨 Pixel Art Video - Romantik Mesaj Uygulaması

Videolarınızı pixel art çiçeklere dönüştüren ve sevdiğinize özel mesajlar oluşturmanızı sağlayan web uygulaması.

## ✨ Özellikler

- 🎬 **Video Yükleme**: Video dosyalarınızı yükleyin
- 🎨 **Pixel Art Dönüştürme**: Video yavaş yavaş pixel art'a dönüşür
- 🌸 **Çiçek Dönüşümü**: START butonuna basınca tüm site pixel art çiçeklerden oluşur
- 🎭 **Tema Sistemi**: 5 farklı romantik tema (Romantik, Bahar, Gün Batımı, Okyanus, Orman)
- 🌹 **Çiçek Tipleri**: 6 farklı pixel art çiçek (Gül, Lale, Ayçiçeği, Kiraz Çiçeği, Kalp, Yıldız)
- 💕 **Mesaj Yazma**: Sevdiğinize özel mesaj yazabilirsiniz
- 💾 **Site Kaydetme**: Tüm siteyi tek HTML dosyası olarak kaydedip gönderebilirsiniz
- ⚡ **Performans Optimizasyonu**: Site kasmasın diye optimize edilmiş

## 📦 Kurulum

### 🚀 EXE Oluşturma (Önerilen)

1. `build.bat` dosyasını çift tıklayarak çalıştırın
2. `dist/VideoASCIIArtConverter.exe` dosyası oluşturulacak
3. Exe dosyasını çalıştırın - otomatik olarak:
   - ✅ Python kontrolü yapılır (yoksa Python sitesine yönlendirir)
   - ✅ Eksik paketler yüklenir
   - ✅ Tarayıcı otomatik açılır

### 📝 Normal Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
pip install -r requirements.txt
```

### 2. Uygulamayı Başlatın

```bash
python app.py
```

### 3. Tarayıcıda Açın

```
http://localhost:5000
```

## 🚀 Kullanım

### Adım 1: Video Yükleme
1. Video dosyanızı sürükleyip bırakın veya "Dosya Seç" butonuna tıklayın
2. Video otomatik olarak pixel art'a dönüştürülmeye başlar

### Adım 2: Ayarları Özelleştirin
Üst panelden:
- **Tema**: Renk temasını seçin
- **Çiçek Tipi**: Hangi çiçek tipini kullanmak istediğinizi seçin
- **Çiçek Yoğunluğu**: Çiçeklerin ne kadar sık olacağını ayarlayın
- **Pixel Boyutu**: Pixel art'ın detay seviyesini ayarlayın

### Adım 3: START Butonuna Basın
- Video pixel art'a dönüştükten sonra "✨ START ✨" butonuna basın
- Tüm site pixel art çiçeklerden oluşacak

### Adım 4: Mesaj Yazın ve Kaydedin
- Mesaj alanına sevdiğinize özel bir mesaj yazın
- "💾 Siteyi Kaydet" butonuna basarak tek HTML dosyası olarak kaydedin
- Kaydedilen dosyayı sevdiğinize gönderebilirsiniz

## 🎨 Temalar

- **💕 Romantik**: Pembe tonları
- **🌸 Bahar**: Açık yeşil ve pembe
- **🌅 Gün Batımı**: Turuncu ve kırmızı
- **🌊 Okyanus**: Mavi ve yeşil
- **🌲 Orman**: Koyu yeşil tonları

## 🌸 Çiçek Tipleri

- **🌹 Gül**: Klasik kırmızı gül
- **🌷 Lale**: Renkli lale
- **🌻 Ayçiçeği**: Sarı ayçiçeği
- **🌸 Kiraz Çiçeği**: Pembe kiraz çiçeği
- **❤️ Kalp**: Romantik kalp
- **⭐ Yıldız**: Parlayan yıldız

## 📁 Dosya Yapısı

```
video-ascıı/
├── app.py                      # Flask web uygulaması
├── pixel_art_converter.py      # Pixel art dönüştürücü
├── pixel_flowers.py            # Pixel art çiçek tasarımları
├── video_to_ascii_color.py      # Renkli ASCII dönüştürücü (eski)
├── requirements.txt            # Python bağımlılıkları
├── templates/
│   └── index.html              # Web arayüzü
├── static/
│   ├── style.css               # Stil dosyası
│   └── script.js               # JavaScript
├── uploads/                    # Yüklenen videolar
└── static/outputs/             # Pixel art JSON çıktıları
```

## ⚙️ Teknik Detaylar

### Pixel Art Dönüştürme
- Video frame'leri küçük pixel boyutlarına indirgenir
- Renk paleti sınırlandırılır (16 renk)
- Nearest neighbor interpolation kullanılır

### Performans Optimizasyonları
- Maksimum 30 frame işlenir (ayarlanabilir)
- ImageData ile batch rendering
- RequestAnimationFrame kullanımı
- Debouncing ile güncelleme optimizasyonu

### Site Kaydetme
- Tüm içerik tek HTML dosyasına gömülür
- Canvas verisi base64 olarak kaydedilir
- Mesaj ve tema bilgileri korunur
- Offline çalışabilir

## 🎯 Kullanım Senaryoları

1. **Romantik Mesaj**: Sevgilinize özel bir video mesajı oluşturun
2. **Doğum Günü**: Doğum günü videosunu pixel art çiçeklere dönüştürün
3. **Özel Günler**: Anneler günü, sevgililer günü gibi özel günler için
4. **Sanat Eseri**: Videolarınızı sanat eserine dönüştürün

## 🐛 Sorun Giderme

### Video Yüklenemiyor
- Dosya formatını kontrol edin (mp4, avi, mov, mkv, webm desteklenir)
- Dosya boyutu 500MB'dan küçük olmalı

### İşleme Yavaş
- Pixel boyutunu artırın (daha az detay = daha hızlı)
- Çiçek yoğunluğunu azaltın
- Daha kısa videolar kullanın

### Site Kasıyor
- Çiçek yoğunluğunu azaltın
- Pixel boyutunu artırın
- Daha küçük videolar kullanın

## 📝 Notlar

- İlk frame'den çiçekler oluşturulur
- Çiçek renkleri video pixel renklerine göre ayarlanır
- Kaydedilen HTML dosyası herhangi bir tarayıcıda açılabilir
- İnternet bağlantısı olmadan da çalışır (kaydedildikten sonra)

## 🙏 Teşekkürler

Sevdiğinize özel pixel art mesajlar oluşturun! 💕🎨✨
