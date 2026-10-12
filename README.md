# 🎨 Pixel Art Video — Romantik Mesaj Uygulaması

> **English:** Turn any video into pixel art, flower mosaics or ASCII art, add a personal message and share it as
> MP4/WebM, GIF or a single offline HTML page. Runs locally on Windows (exe) or with Python. The interface is
> available in **24 languages** and picks your browser language automatically. Download it from
> [Releases](../../releases).

Videonu pixel art'a, çiçek/şekil mozaiğine ya da ASCII sanatına dönüştür, mesajını ekle;
video, GIF ya da tek dosyalık bir web sayfası olarak sevdiğine gönder.

## ✨ Özellikler

- **Hızlı dönüştürme**: 8 sn'lik 720p video ~1 sn'de, 1 dakikalık 1080p video ~7 sn'de işlenir
- **Her format**: MP4, MOV, WebM, AVI, MKV, WMV, FLV, M4V, 3GP, MPG, TS (en fazla 500 MB)
- **Paletler**: Otomatik (videodan, 2–64 renk), Game Boy, PICO-8, Sweetie 16, CGA, Pastel, Gri, Sepya
- **Dithering**: Bayer 4×4 (retro) ve 8×8
- **Renk ayarları**: parlaklık, kontrast, doygunluk
- **Kırpma**: başlangıç/bitiş saniyesi, maksimum frame
- **28 stil**: düz pixel art, 10 çiçek, 7 şekil, 6 pixel deseni, 4 ASCII seti, Braille (⣿)
- **Oynatıcı**: oynat/duraklat, ileri-geri sarma, 0.5×–2× hız; video her zaman doğru hızda oynar
- **Dışa aktarma**: MP4 / WebM video (orijinal süresinde), GIF (sonsuz döngü), 480–1920 px
- **Siteyi kaydet**: mesajlı, daktilo efektli, tek dosyalık HTML (~100–500 KB, internetsiz çalışır)
- **Paylaş**: telefonda doğrudan paylaşım menüsü, masaüstünde dosya indirme
- **24 dil**: Türkçe, English, Deutsch, Français, Español, Italiano, Português, Nederlands, Polski, Română,
  Svenska, Ελληνικά, Русский, Українська, Azərbaycanca, العربية, فارسی, हिन्दी, 日本語, 한국어, 中文, Bahasa Indonesia,
  Tiếng Việt, ไทย — tarayıcı diline göre otomatik seçilir, Arapça/Farsça sağdan sola
- **20 tema, 15 hareketli arka plan**, mobil uyumlu arayüz, ayarlar tarayıcıda hatırlanır

## 📥 İndir (Windows)

[Releases](../../releases) sayfasından `PixelArtVideo-Windows-x64.zip` dosyasını indir, bir klasöre çıkar ve
`VideoASCIIArtConverter.exe`'yi çalıştır. Python kurmana gerek yok; tarayıcı otomatik açılır.

> **"Windows bilgisayarınızı korudu" uyarısı:** Exe dijital olarak imzalı olmadığı için SmartScreen ilk açılışta
> uyarabilir. **Ek bilgi → Yine de çalıştır** ile açabilirsin. Bazı antivirüsler PyInstaller ile paketlenmiş
> uygulamaları yanlışlıkla işaretleyebilir; kaynak kodun tamamı bu repodadır, istersen kendin derleyebilirsin.

Uygulama yalnızca bu bilgisayarda çalışır (`127.0.0.1`); videoların hiçbir sunucuya gönderilmez.

## 🚀 Çalıştırma (kaynak koddan)

### Python ile

```bash
pip install -r requirements.txt
python start_app.py
```

Tarayıcı otomatik açılır. Port 5000 doluysa sıradaki boş port kullanılır.

### Windows uygulaması (exe)

```bash
build.bat
```

Çıktı: `dist\VideoASCIIArtConverter\VideoASCIIArtConverter.exe`. Klasörün tamamını birlikte taşı.
Tek dosya istersen: `python build_exe.py --onefile` (her açılışta geçici klasöre açıldığı için daha yavaş başlar).

Çalışma verisi exe'de `%LOCALAPPDATA%\PixelArtVideo`, geliştirmede `data/` klasöründedir;
24 saatten eski dosyalar otomatik silinir.

| Ortam değişkeni | Anlamı |
|---|---|
| `PORT` | Tercih edilen port (varsayılan 5000) |
| `PIXELART_NO_BROWSER=1` | Tarayıcıyı açma |
| `PIXELART_DATA_DIR` | Çalışma verisi klasörü |
| `FLASK_DEBUG=1` | `python app.py` için debug modu (yalnızca 127.0.0.1) |

## 🧭 Kullanım

1. **Video yükle** — sürükle-bırak ya da "Dosya Seç". İstersen önce **Dönüştürme ayarları**nı aç.
2. **Önizleme** — orijinal ve pixel art yan yana. Ayarları değiştirip **Yeniden dönüştür** diyebilirsin
   (video tekrar yüklenmez).
3. **✨ START ✨** — stili seç (çiçek, şekil, ASCII, Braille…), boyut/yoğunluk/renk karışımını ayarla.
4. **Mesajını yaz**, sonra **İndir** (MP4/WebM/GIF), **Siteyi kaydet** ya da **Paylaş**.

## 🧱 Mimari

```
start_app.py      başlatıcı: paket kontrolü, boş port, waitress sunucusu, tarayıcı
app.py            Flask API (/api/uploads, /api/jobs, /api/config) — tüm hatalar JSON
jobs.py           arka plan iş kuyruğu, ilerleme, iptal, 24 saatlik otomatik temizlik
converter.py      video → palet indeksleri (zaman tabanlı fps, global palet, 32³ renk tablosu)
static/js/
  main.js         arayüz akışı ve durum
  api.js          sunucu istemcisi (yükleme ilerlemesi, iş takibi)
  renderer.js     canvas çizim motoru + oynatıcı (kaydedilen sayfaya da gömülür)
  shapes.js       şekil, ASCII seti, tema ve arka plan tanımları
  i18n.js         dil seçimi ve çeviri (static/i18n/<dil>.json, 24 dil)
  export.js       video kaydı, GIF kodlayıcı, tek dosyalık sayfa
legacy/           eski terminal ASCII scriptleri
tests/            pytest testleri
```

**Veri formatı:** her iş `meta.json` (boyut, fps, palet) ve `frames.bin` (frame × yükseklik × genişlik
adet `uint8` palet indeksi, gzip ile sunulur) üretir. 8 sn'lik 720p video için ~80 KB.

## 🧪 Test

```bash
pip install -r requirements-dev.txt
python -m pytest
```

Yeni dil eklemek: `static/i18n/en.json`'u kopyalayıp çevir, kodunu `static/js/i18n.js` içindeki `LANGUAGES`
listesine ekle. `tests/test_i18n.py` eksik anahtar veya hatalı `{parametre}` olup olmadığını denetler.

Kapsam: dönüştürücü (fps, kırpma, küçük/tek renk videolar, paletler, doğrulama, iptal), API (tam akış,
JSON hatalar, 413, eşzamanlı yüklemeler, TTL temizliği) ve GIF kodlayıcının Pillow ile piksel piksel doğrulanması
(Node.js gerekir).

## 🌐 Tarayıcı desteği

Güncel Chrome, Edge, Firefox ve Safari (16.4+). MP4 kaydı tarayıcı destekliyorsa yapılır; desteklemiyorsa
otomatik WebM'e geçilir. Kaydedilen HTML sayfası JavaScript çalıştırmayan önizleyicilerde (ör. iPhone'da
WhatsApp/Dosyalar önizlemesi) yalnızca mesajı gösterir; animasyon için dosyayı tarayıcıda açmak gerekir.

## 🐛 Sorun giderme

- **Orijinal video önizlemede görünmüyor**: Tarayıcı bazı formatları (AVI, MKV, WMV, FLV) oynatamaz;
  dönüştürme yine de çalışır.
- **Video kaydı uzun sürüyor**: Kayıt gerçek zamanlıdır (10 sn video = 10 sn). Bu sırada sekmeyi açık tut.
  Daha hızlı sonuç için GIF seç.
- **Pixel boyutu otomatik büyüdü**: Grid en fazla 320×320 hücre olabilir; çok yüksek çözünürlükte
  pixel boyutu otomatik artırılır.
- **"Video … frame sınırında kesildi"**: En fazla 3000 frame işlenir. Bitiş zamanı ver ya da fps'i düşür.

## 📚 Geliştirme notları

Proje analizi, test raporları ve yol haritası: [docs/ANALIZ_VE_PLAN.md](docs/ANALIZ_VE_PLAN.md)

Yeni sürüm yayınlamak: GitHub'da bir Release yayınla (ör. `gh release create v1.1.0 --generate-notes`) — GitHub
Actions testleri çalıştırır, exe'yi derler ve `PixelArtVideo-Windows-x64.zip` olarak sürüme ekler.

## 📄 Üçüncü taraf yazılımlar

Exe şu açık kaynak bileşenleri içerir: [OpenCV](https://opencv.org) (Apache 2.0) ve onunla gelen
[FFmpeg](https://ffmpeg.org) (LGPL 2.1), [NumPy](https://numpy.org) (BSD), [Flask](https://flask.palletsprojects.com)
ve Werkzeug/Jinja2 (BSD), [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1), Python (PSF).

## 📜 Lisans

[MIT](LICENSE) © noms6
