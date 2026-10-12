# Pixel Art Video — Analiz, Test Raporu ve Yol Haritası

_Tarih: 2026-10-12 · Ortam: Windows 10, Python 3.10.11, OpenCV 5.0.0, NumPy 2.2.6, Flask 3.1.3_

---

## 1. Proje ne yapıyor? (Mantık)

Proje adı "video ASCII" olsa da asıl ürün **"Pixel Art Video – Romantik Mesaj"** web uygulaması.
Kullanıcı bir video yüklüyor, video pixel art'a dönüşüyor, START'a basınca her piksel bir
"çiçek/şekil/ASCII karakter" olarak yeniden çiziliyor, mesaj eklenip tek bir HTML dosyası
olarak kaydedilebiliyor.

```
Tarayıcı (script.js)                     Flask (app.py)                        pixel_art_converter.py
─────────────────────                    ───────────────                       ──────────────────────
Video seç ─► loadedmetadata ─► POST /upload ─► dosyayı uploads/'a kaydet ─► video_to_pixel_art()
                                                                             │ her frame için:
                                                                             │  resize(1/pixel_size, NEAREST)
                                                                             │  k-means (16 renk, 10 deneme)  ◄─ darboğaz
                                                                             │  büyüt → tekrar küçült (gereksiz)
                                                                             │  [[r,g,b],...] Python listeleri
                                     ◄─ {filename} ◄── JSON (indent=2) static/outputs/*.json
GET /outputs/x.json (100+ MB) ─► JSON.parse ─► pixelData
  ├─ pixelCanvas: frame'leri setTimeout ile oynat (ImageData)
  ├─ START ─► flowerCanvas: her frame'de N×N çiçek, çiçek başına ~64 fillRect
  ├─ "Siteyi Kaydet" ─► tüm frame'leri PNG/base64'e çevir, tek HTML'e göm
  └─ "Video indir" ─► canvas.captureStream + MediaRecorder (webm)
```

### Dosya haritası

| Dosya | Rol | Durum |
|---|---|---|
| `app.py` | Flask: `/`, `/upload`, `/outputs/<f>`, `/flowers` | Aktif |
| `pixel_art_converter.py` | Video → pixel verisi (OpenCV + k-means) | Aktif, darboğaz |
| `static/script.js` (1778 satır) | Tüm arayüz mantığı, çiçek tanımları, kaydetme, video export | Aktif, monolitik |
| `static/style.css`, `templates/index.html` | Arayüz, 20 tema, 15 arka plan efekti, 28 çiçek/şekil tipi | Aktif |
| `start_app.py` | Paket kontrolü + Flask başlatma + tarayıcı açma + exe temizliği | Aktif (exe giriş noktası) |
| `pixel_flowers.py` | 6 çiçek tanımı (Python) | Sadece `/flowers` kullanıyor, frontend bunu **hiç çağırmıyor** |
| `video_to_ascii.py`, `video_to_ascii_color.py` | Eski terminal ASCII sürümleri | Ölü kod (uygulamaya bağlı değil) |
| `build_exe.py`, `build.bat`, `.spec` | PyInstaller tek-dosya exe (73 MB) | Aktif |
| `run_exe.bat`, `cleanup.bat` | Exe sonrası temizlik | **Tehlikeli** (bkz. H1) |

---

## 2. Yapılan testler ve ölçümler

| Test | Sonuç |
|---|---|
| `GET /` , `GET /flowers` | 200 OK |
| Dosyasız / yanlış uzantılı upload | 400, doğru mesaj |
| `input.mp4` (1280×720, 24 fps, 8 sn) – arayüz varsayılanlarıyla (fps=10, px=8) | **16 sn** işlem, **96 frame → 106.7 MB JSON** |
| Dönüştürücü profili (30 frame) | 94.6 ms/frame; bunun **74 ms'si (%78) k-means** |
| Aynı veri `indent=2` yerine kompakt JSON | 31.2 MB → 4.8 MB (6.5× küçük) |
| Tarayıcı: 106.7 MB indir + parse | 466 ms + 263 ms, JS heap ≈ 168 MB (güçlü PC'de) |
| Tarayıcı: tek çiçek frame'i (rose, ölçek 3) | 40 ms; yoğunluk 3'te 62 ms; ASCII modu 64 ms (12 fps bütçesi 83 ms — zayıf cihazda kaçırır) |
| "Siteyi Kaydet" | **5.6 sn ana thread donması**, 13.2 MB HTML (sadece 8 sn'lik video için) |
| 55 sn örnek video (1330 frame) mevcut çıktı | `dist/static/outputs/...json` = **190 MB** |

### Prototip karşılaştırması (aynı 96 frame, px=8)

| Yöntem | ms/frame | Not |
|---|---|---|
| A. Mevcut: k-means, 10 deneme, random init | 72.9 | Her frame farklı palet → **renk titremesi** |
| B. k-means, 1 deneme, k-means++ init | **5.9** (12×) | Aynı kalite, çok daha hızlı |
| C. Global palet (örnek frame'lerden) + NumPy en yakın renk | 10.6 (7×) | **Titreme yok**, tutarlı palet |
| D. PIL `quantize(16)` | 7.7 (9×) | Basit alternatif |

**Çıktı formatı:** palet indeksleri `uint8` olarak saklanınca 106.7 MB → **1.38 MB**, gzip ile **0.08 MB** (≈1300× küçük).

---

## 2B. Tur 2 — Kapsamlı test (gerçek yükleme akışı, 26 video, exe, CLI)

Test ortamı: proje dosyalarına dokunmadan, çıktıları geçici klasöre yönlendiren bir test sunucusu;
videolar arayüzdeki gerçek `<input type=file>` / sürükle-bırak yolundan verildi. Tarayıcı paneli gizliyken
`requestAnimationFrame` durduğu için testlerde rAF → setTimeout yaması kullanıldı.

### Backend format/uç durum matrisi (fps=10, px=8 — arayüz varsayılanları)

| Video | Codec | Sonuç | Süre | Çıktı | Not |
|---|---|---|---|---|---|
| h264.mp4, clip.mov, audio.mp4 (sesli) | H.264 | ✅ 200 | 0.8 sn | 2.3 MB / 2 sn video | Ses atılıyor |
| hevc.mp4 | HEVC | ✅ 200 | 0.9 sn | 2.3 MB | |
| clip.webm | VP9 | ✅ 200 | 0.9 sn | 2.3 MB | |
| clip.avi / .mkv / .wmv / .flv | MJPEG / MPEG-4 / WMV2 / FLV1 | ✅ 200 (backend) | ~0.5 sn | | **Arayüzden yüklenemiyor** (bkz. H18) |
| vertical_360x640.mp4 | MPEG-4 | ✅ | 1.6 sn | 4.5 MB | Dikey oran doğru (45×80) |
| odd_333x177.mp4 | MPEG-4 | ✅ | | | Grid 41×22 — kenar pikselleri kırpılıyor |
| one_frame.mp4 | | ✅ 1 frame | | | |
| black.mp4 (tek renk) | | ✅ | | | k-means uyarısız geçti |
| fps60.mp4 | | ✅ 10 fps | | | |
| ntsc_2997.mp4 (29.97 fps) | H.264 | ⚠️ 200 | 4.6 sn | 12.6 MB / 3 sn | 10 fps istendi → **14.985 fps** |
| uhd_3840x2160.mp4 (1 sn 4K) | MPEG-4 | ⚠️ 200 | 47 sn* | **122 MB / 1 sn video** | Python tepe bellek 189 MB |
| long_1080p_60s.mp4 (60 sn 1080p) | H.264 | ⚠️ 200 | 563 sn* | **1.5 GB JSON** | **Python tepe bellek ~1.75 GB** |
| small_40x30.mp4, tiny_16x16.mp4 | | ❌ 500 | | | k-means "N < K" çökmesi; mesaj yanlış: "Video açılamadı" |
| corrupt.mp4, truncated.mp4 | | ✅ 500 + doğru mesaj | | | |
| çiçek_düğün.mp4 | | ✅ | | `cicek_dugun_pixel.json` | Türkçe karakterler atılıyor |

\* tracemalloc açıkken ölçüldü. **Gerçek sunucu üzerinden ölçüm (60 sn 1080p):** 199 sn işlem, sunucu süreci tepe
RAM **2.1 GB**, çıktı 1.50 GB. Bu JSON tarayıcıda açılmaya çalışılınca **sekme çöktü** ("Target crashed").

### Parametre / dosya adı / eşzamanlılık

| Girdi | Sonuç |
|---|---|
| `max_frames=-5` | 500 "Video açılamadı" (yanlış mesaj; aslında hiç frame işlenmeden çıkılıyor) |
| `fps=abc`, `max_frames=1.5`, `pixel_size=abc` | **500 HTML** sayfası (JSON değil) |
| `fps=-1` | Kabul ediliyor, sessizce yok sayılıyor |
| `pixel_size=1` | Kabul ediliyor → 1080p'de frame başı 2 milyon `[r,g,b]` = devasa çıktı |
| Dosya > MAX_CONTENT_LENGTH | **413 HTML** (frontend'de "Unexpected token <") |
| `.mp4` adlı dosya | `uploads/mp4` adıyla, uzantısız kaydediliyor |
| `../../evil.mp4`, `con.mp4` | Güvenli (secure_filename) ✅ |
| Aynı adla 2 eşzamanlı yükleme | **Biri çöküyor** ("moov atom not found" — dosya okunurken üzerine yazıldı), diskteki çıktı diğer kullanıcının videosu |

### Arayüz (gerçek yükleme akışı)

| Test | Sonuç |
|---|---|
| input.mp4 tam akış (yükle → pixel → START → çiçek) | ✅ çalışıyor; yüklemeden oynatmaya 17.5 sn |
| 55 sn örnek video (55 sn, 640×360) tam akış | ✅ 30 sn işlem, 665 frame, **JS heap 355 MB** |
| Çiçek animasyonu gerçek fps | Hedef 12 fps → **10 fps** (video ağır çekim oynuyor; zaman tabanlı değil, frame sayaçlı) |
| 28 çiçek/şekil tipi tek tek | ✅ hata yok, 17–63 ms/frame. **Kopyalar:** Üçgen = Gül, Papatya = Lotus = Ayçiçeği, Kare = ASCII Blok (aynı desen) |
| Yoğunluk 1 / 1.5 / 3 | **Piksel piksel aynı görüntü** — kaydırıcının 1–3 aralığı işlevsiz |
| Yoğunluk 1, Ölçek 2 (720p) | **Videonun alt kısmı boş** (3000 çiçek sınırı kesiyor) |
| Yoğunluk < 1 | Hem `step` hem rastgele filtre uygulanıyor → çifte seyrelme; çiçek konumları her frame değişiyor (titreme) |
| 20 tema | ✅ ama 2 kopya: Okyanus = Yeşil, Gül = Pastel |
| 15 arka plan efekti | ✅ hepsinin animasyonu var; tema değişince boşuna yeniden oluşturuluyor |
| Navbar gizle/göster, İnce Ayarlar | ✅ |
| Mobil (375×812) ve 800 px genişlik | ❌ Sabit üst panel **349 px (%43 ekran)**, başlığı tamamen örtüyor |
| "Dosya Seç" butonu | ❌ Dosya seçiciyi **2 kez** tetikliyor (buton onclick + kutu click) |
| Video olmayan dosya bırakma | ✅ uyarı veriyor |
| Sahte `.mp4` (bozuk içerik) | ❌ **Hiçbir uyarı yok**, boş önizleme açık kalıyor |
| Sahte dosyadan sonra gerçek video | ❌ 2 yükleme; eski dinleyici sahte dosyayı da yüklüyor → sağlam video için "Video açılamadı" uyarısı |
| 8 farklı dosyayı art arda seçme | ❌ Yükleme sayısı her seferinde artıyor (7.–8. seçimde 7–8 paralel yükleme), JSON yarışından "JSON parse hatası" / "Failed to fetch" uyarı yağmuru |
| AVI / MKV / WMV / FLV / MPEG-4 (mp4v) MP4 | ❌ **Hiç yüklenmiyor, hata da yok** (bkz. H18) |
| FPS alanına 0 | 10'a dönüşüyor ("orijinal FPS" seçilemiyor); 60 yazılabiliyor (max=30'a rağmen) |
| Maksimum Frame -5 | Kabul ediliyor → sunucuda yanlış hata |
| START sonrası yeni video | ❌ Yükleme bölümüne dönüş yolu yok (sayfa yenilemek gerekiyor); `stopFlowerAnimation` hiç çağrılmıyor |
| Mesaj + "Siteyi Kaydet" (input.mp4) | 5.8 sn donma, 13.2 MB. **XSS doğrulandı:** `<img onerror>` ve `<script>` kaydedilen dosyada çalıştı |
| "Siteyi Kaydet" (55 sn örnek video) | **33.7 sn donma, 69 MB HTML** (e-posta eki sınırı 25 MB) |
| Kaydedilen HTML'de çiçek videosu | 800×600 sabit → 16:9 / dikey videolar **bozuk oranlı** |
| Piksel video indir | ✅ WebM, 1280×720, ama **10.5 sn (orijinal 8 sn)** — %30 yavaş |
| Çiçek video indir | ✅ WebM, ama **12.8 sn (orijinal 8 sn)** — %60 yavaş; çiçek aralarındaki boşluk **siyah** |
| Format = MP4 seçili | Yok sayılıyor, hep WebM (oysa tarayıcı `video/mp4` kaydını destekliyor) |
| Paylaş | `navigator.share` yok → 13–69 MB HTML'i panoya yazmaya çalışıyor (kullanıcı panosunu bozmamak için tetiklenmedi) |

### Exe (`dist/VideoASCIIArtConverter.exe`, izole kopya)

| Test | Sonuç |
|---|---|
| Çıktı yönlendirilmiş başlatma (log, başlatıcı, görev zamanlayıcı) | ❌ **Anında çöküyor:** emoji yazdırırken `UnicodeEncodeError` (cp1254); hata işleyicisi de `✗` yazarken ikinci kez çöküyor |
| Normal konsol penceresi | ✅ 4.1 sn'de açılıyor, yükleme çalışıyor |
| Her açılışta TEMP'e açılan dosya | **318 MB** (`_MEIxxxx`); zorla kapanınca TEMP'te kalıyor |
| Konsol penceresini kapatma | ❌ **Temizlik çalışmadı** — `uploads/` ve `static/outputs/` yerinde kaldı |
| Port 5000 doluysa | Kontrol yok, açılmaz |

### Eski CLI scriptleri

| Test | Sonuç |
|---|---|
| `video_to_ascii.py video out.txt 80` | ✅ 48 frame, 134 KB |
| `fps=0` | ❌ ZeroDivisionError |
| `width=0` | ❌ cv2 resize assert |
| `video_to_ascii_color.py` çıktı yönlendirilince | ❌ `█` karakterinde UnicodeEncodeError (cp1254) |
| Terminal oynatma | Her frame `os.system('cls')` → titreme ve yavaşlık |

---

## 3. Hatalar (önem sırasına göre)

### 🔴 Kritik

**H1 — `cleanup.bat` proje kaynaklarını silebilir (veri kaybı).**
`cleanup.bat` göreli yol kullanıyor: `rmdir /s /q "static"`. `run_exe.bat` proje kökünde duruyor ve
`%~dp0VideoASCIIArtConverter.exe` arıyor; exe ise `dist/` içinde. Kökten çift tıklanırsa exe bulunamaz,
ardından `cleanup.bat` **projedeki `static/` (script.js, style.css) ve `uploads/` klasörlerini siler.**
(Bu yıkıcı olduğu için çalıştırarak test etmedim; kod okumayla doğrulandı.)

**H2 — `python app.py` = ağa açık uzaktan kod çalıştırma.**
`app.run(debug=True, host='0.0.0.0')` Werkzeug debugger'ını tüm yerel ağa açıyor; aynı ağdaki biri
hata sayfasından Python konsolu açabilir. README tam olarak bu komutu öneriyor.

**H3 — Devasa JSON çıktısı.** 8 sn video → 107 MB, 55 sn video → 190 MB. `[r,g,b]` listeleri + `indent=2`.
Diski dolduruyor, tarayıcı belleğini şişiriyor, düşük RAM'li cihazda sekme çöker.

### 🟠 Yüksek

**H4 — Senkron, ilerlemesiz işlem.** `/upload` tüm videoyu işleyene kadar istek açık kalıyor (8 sn video = 16 sn).
İlerleme çubuğu sahte (0% → 100%). Uzun videolarda tarayıcı/proxy zaman aşımı riski.

**H5 — Geçersiz parametre → HTML 500.** `pixel_size=abc` → `ValueError` try bloğunun dışında → Flask HTML hata
sayfası döner; frontend `response.json()` patlar, kullanıcı anlamsız "Unexpected token <" görür.

**H6 — Yanlış hata mesajları.** `pixel_size=0` veya negatif → her frame `resize` assert'iyle düşer, tüm video boşuna
taranır, sonra "Video açılamadı" denir. Ayrıca frame boyutu < 16 piksel olunca (çok büyük pixel_size veya küçük video)
k-means "N < K" hatası verir. `pixel_size=400` → çöküyor.

**H7 — Frame'ler arası renk titremesi.** Her frame bağımsız, rastgele başlatılmış k-means → aynı sahnede palet
sürekli değişiyor.

**H8 — "Siteyi Kaydet" UI'ı donduruyor** (5.6 sn, uzun videoda dakikalar) ve dosya şişkin (her frame iki kez PNG/base64).

**H9 — Kaydedilen HTML'de enjeksiyon.** Mesaj `message.replace(/\n/g,'<br>')` ile ham HTML olarak gömülüyor.
`<script>`/`<img onerror>` içeren mesaj, alıcı dosyayı açınca çalışır; `</script>` içeren mesaj sayfayı bozar.

**H18 — Tarayıcının oynatamadığı videolar sessizce reddediliyor.** Yükleme `<video>`'nun `loadedmetadata`
olayına bağlı. AVI, MKV, WMV, FLV ve MPEG-4 Part 2 codec'li MP4'lerde tarayıcı videoyu çözemediği için olay
hiç tetiklenmiyor: **yükleme yapılmıyor, hata da gösterilmiyor.** Oysa backend (OpenCV/FFmpeg) bu formatların
hepsini sorunsuz işliyor ve README bunları "destekleniyor" diye listeliyor. Telefonlardan gelen bazı videolar da etkilenir.

**H19 — Olay dinleyicisi birikmesi → paralel yükleme ve bozuk JSON.** (H10'un ölçülmüş hali) 8 dosya art arda
seçilince tek seçim 8 yükleme başlattı; aynı çıktı dosyasına yazan istekler yarıştı, kullanıcıya
"JSON parse hatası" ve "Failed to fetch" uyarıları yağdı.

**H20 — Dışa aktarılan videolar yanlış hızda.** Piksel videosu %30, çiçek videosu %60 yavaş (8 sn → 10.5 / 12.8 sn).
Sebep: `setTimeout(frameDelay)` çizim süresinin üstüne ekleniyor, ayrıca `pixelData.fps` (12) yerine `videoFps` (10) kullanılıyor.
Canlı önizleme de aynı sebeple 12 yerine 10 fps oynuyor.

**H21 — Exe çıktı yönlendirilince çöküyor** (cp1254 + emoji), konsol kapatılınca temizlik çalışmıyor, her açılışta 318 MB TEMP.

**H22 — Mobilde arayüz kullanılamaz:** sabit ayar paneli ekranın %43'ü, başlığı örtüyor.

**H23 — Uzun/yüksek çözünürlüklü videolar sistemi kilitler:** 60 sn 1080p → 1.5 GB JSON, ~1.75 GB Python RAM;
1 sn 4K → 122 MB. Sunucu tarafında süre/çözünürlük sınırı yok.

### 🟡 Orta

- **H24 — İşlevsiz/yanıltıcı kontroller (ölçüldü):** yoğunluk 1–3 aralığı birebir aynı görüntü; ölçek 2'de 720p videonun
  alt kısmı boş (3000 çiçek sınırı); 4 şekil ve 2 tema başka bir öğenin kopyası; "Dosya Seç" seçiciyi 2 kez açıyor.
- **H25 — START sonrası geri dönüş yok:** yeni video için sayfayı yenilemek gerekiyor; çiçek animasyonu hiç durdurulmuyor.
- **H26 — Kaydedilen HTML'de oran bozuk** (çiçek videosu 800×600 sabit) ve dışa aktarılan çiçek videosunda boşluklar siyah.
- **H27 — Sessiz hatalar:** bozuk/sahte video seçilince hiçbir uyarı yok; 413/500 hatalarında JSON yerine HTML dönüyor.
- **H28 — Eski CLI'lar:** `fps=0`/`width=0` çökmesi, yönlendirilmiş çıktıda Unicode çökmesi.

- **H10 — İkinci video seçilince çift yükleme:** `handleFileSelect` her seferinde yeni `loadedmetadata` listener ekliyor,
  eski animasyonlar durdurulmuyor, `createObjectURL` hiç `revoke` edilmiyor.
- **H11 — Dosya adı çakışmaları:** `secure_filename` Türkçe karakterleri atıyor (`ığ.mp4` → `g.mp4`); aynı ada sahip
  videolar birbirinin çıktısını eziyor. Eşzamanlı iki kullanıcı aynı dosyayı paylaşır.
- **H12 — Dosyalar hiç silinmiyor** (normal modda). `uploads/` ve `static/outputs/` sınırsız büyüyor
  (şu an ~460 MB çöp çıktı var). Exe modunda ise tam tersi: kapanışta *tüm* sonuçlar siliniyor, ama konsol penceresi
  X ile kapatılınca `atexit` çalışmadığı için silinmiyor da (dist'te 190 MB dosya duruyor).
- **H13 — FPS ayarı yanlış:** `frame_skip = int(orig/limit)` → 24 fps'de 10 istenince 12 fps; 30 fps'de 25 istenince hiç düşmüyor.
  Ayrıca istemci `videoFps` alanının min=5 olması "0=orijinal" seçeneğini imkânsız kılıyor.
- **H14 — Ölü/yanıltıcı ayarlar:** "Video Formatı: MP4" seçili ama hep WebM indiriliyor; "Video Kalitesi" hiç kullanılmıyor;
  "Pixel Boyutu" kaydırıcısı işlendikten sonra sadece görüntüyü ölçekliyor, veriyi değiştirmiyor.
- **H15 — "Paylaş"** `window.location.href` (127.0.0.1) paylaşıyor — alıcı için anlamsız.
- **H16 — Canvas boyutu orijinal çözünürlük:** 4K video → 3840×2160 canvas'a her frame onbinlerce `fillRect`.
- **H17 — Video export zamanlaması:** `setTimeout(frameDelay)` + ağır çizim → kaydedilen videonun hızı tutarsız.

### ⚪ Düşük / temizlik

- Gereksiz işlem: küçült → k-means → büyüt → **tekrar küçült** (`frame_to_pixel_data`).
- Piksel küçültmede `INTER_NEAREST` → aliasing; `INTER_AREA` daha temiz sonuç verir.
- Çiçek tanımları iki yerde (Python 6, JS 28) ve tutarsız; `/flowers` endpoint'i kullanılmıyor.
- `drawFlower`, `pixel_data_to_flowers`, `create_flower_from_pixel_data`, iki ASCII script ölü kod.
- `drawFlowerScaled` her çiçek için palet karışımını ve `fillStyle` string'ini yeniden üretiyor.
- `requirements.txt` içinde `pyinstaller` runtime bağımlılığı gibi duruyor.
- Konsol logları Windows'ta bozuk karakter (cp1254/cp1252) basıyor.
- `start_app.py`'deki "Python kontrolü" anlamsız (script zaten Python'da çalışıyor); README exe için yanlış bilgi veriyor.
- Port 5000 sabit; doluysa uygulama açılmıyor.
- `--onefile` + `collect-all cv2` → 73 MB exe, her açılışta TEMP'e açılıyor (yavaş başlangıç).
- Git deposu yok, test yok.

---

## 4. Optimizasyon planı (nasıl hızlı/verimli çalıştırırız)

### 4.1 Backend dönüştürücü (en büyük kazanç)

1. **Palet stratejisi:** Videonun ~her 8. frame'inden örnek alıp **tek global palet** çıkar (k-means++ , 3 deneme),
   tüm frame'leri NumPy ile en yakın renge eşle. → 7× hız + titreme yok. Seçenek olarak "frame başı palet" (B yöntemi, 12×) kalsın.
2. Küçültmeyi `INTER_AREA` ile yap; büyüt-küçült döngüsünü kaldır.
3. Python döngüleriyle liste kurmayı kaldır; NumPy dizisinde kal.
4. Seek ile frame atlama (`cap.grab()` ile decode etmeden geç) → fps düşürmede okuma maliyeti azalır.
5. Doğru FPS örnekleme: zaman tabanlı (`t = i / hedef_fps`) seçim.
6. Opsiyonel: frame'leri `concurrent.futures.ProcessPoolExecutor` ile paralel işle (12 çekirdek var).

### 4.2 Veri formatı

```
Mevcut:  {"frames":[{"pixels":[[[r,g,b],...]...], "palette":..., "width":..}, ...]}   → 107 MB
Yeni:    meta.json  {w, h, fps, frame_count, palette:[[r,g,b]×16]}
         frames.bin (uint8 palet indeksleri, frame_count × h × w)  + gzip            → 0.08–1.4 MB
```
Frontend `fetch → arrayBuffer → Uint8Array` ile alır; parse maliyeti ~0, bellek ~1 MB.
(Alternatif: frame başına küçük PNG — tarayıcı yerleşik decode eder.)

### 4.3 Asenkron işleme + gerçek ilerleme

- `POST /jobs` → hemen `job_id` döner; işlem arka plan thread/process'te.
- `GET /jobs/<id>` (veya SSE `/jobs/<id>/events`) → `{"progress": 0.42, "stage": "quantize"}`.
- `DELETE /jobs/<id>` ile iptal. Dosya adı = `uuid` → çakışma ve Türkçe karakter sorunu biter.
- TTL temizliği: 24 saatten eski upload/çıktılar otomatik silinir.

### 4.4 Frontend render

1. **Çiçek sprite önbelleği:** Her çiçek tipi + 16 palet rengi için 16 adet önceden çizilmiş `OffscreenCanvas` sprite.
   Frame çizimi = `drawImage` × N (şu an N × 64 `fillRect` + string üretimi). Palet sabit olduğu için cache kusursuz çalışır → 10–30× hızlanma.
2. ASCII modu için de glyph atlası (karakter × renk) → `fillText` yerine `drawImage`.
3. Canvas'ı ekran boyutuna (CSS boyut × devicePixelRatio) göre ayarla, orijinal çözünürlüğe değil.
4. Ağır işleri (kaydetme, export) **Web Worker + OffscreenCanvas**'a taşı → UI donmaz.
5. Oynatmayı `requestAnimationFrame` + zaman damgasıyla yap (setTimeout zinciri yerine), görünmezken dur (`visibilitychange`).
6. Arka plan emojileri: 50 DOM elemanı + CSS animasyon yerine tek canvas parçacık sistemi (veya `will-change: transform`).

### 4.5 Kaydedilen HTML ("Siteyi Kaydet")

- PNG frame'leri gömmek yerine **meta + palet indeksleri (base64, ~100 KB) + küçük oynatıcı JS** göm;
  çiçek/ASCII çizimini alıcının tarayıcısı yapsın. 13 MB → ~200 KB, kaydetme anında.
- Mesajı `textContent` ile yerleştir (H9 çözümü), JSON'u `</script>` kaçışlı göm.

### 4.6 Paketleme / çalıştırma

- `python app.py` → `debug=False`, `host=127.0.0.1`; geliştirme için `FLASK_DEBUG` ortam değişkeni.
- Üretim sunucusu olarak **waitress** (Windows'ta sorunsuz, çok thread).
- Boş port otomatik seçimi; tarayıcıyı sunucu hazır olunca aç (sabit 2 sn bekleme yerine).
- Exe: `--onedir` (hızlı açılış) veya onefile kalacaksa `opencv-python-headless` + gereksiz cv2 modüllerini dışla → boyut ~%40 küçülür.
- Çıktılar exe yanına değil `%LOCALAPPDATA%\PixelArtVideo\` altına; `cleanup.bat`/`run_exe.bat` kaldırılsın.
- `requirements.txt` → runtime / `requirements-dev.txt` (pyinstaller, pytest) ayrımı.

---

## 5. Yeni özellik fikirleri

### Dönüştürme / görsel
- **Palet seçimi:** otomatik, sabit paletler (Game Boy 4 renk, NES, PICO-8, CGA, sepya, pastel), kullanıcı özel paleti, renk sayısı kaydırıcısı (2–64).
- **Dithering:** Floyd–Steinberg / Bayer ordered dithering seçeneği (gerçek retro görünüm).
- **Kenar/kontur vurgusu** (Canny ile siyah outline) — "sprite" görünümü.
- **Parlaklık/kontrast/doygunluk** ve gamma ayarı, işleme öncesi.
- **Kırpma ve zaman aralığı seçimi** (başlangıç/bitiş saniyesi) — uzun videoların sadece bir kısmını işle.
- **Klasik ASCII modu geri dönüşü:** eski `video_to_ascii*` mantığını web'e taşı; Braille (⣿) ve blok (▀▄) karakter setleri ile 2–4× çözünürlük; düz metin/ANSI olarak dışa aktarım.
- **Mozaik modu:** pikselleri emoji ya da kullanıcının yüklediği küçük resimlerle doldur (foto-mozaik).
- **Geçiş efektleri:** orijinal video → pixel art arası gerçek animasyonlu geçiş (pixel boyutu yavaşça büyür, "çözünme", çiçeklerin açması).

### Mesaj / hediye deneyimi
- **Müzik/ses:** videonun orijinal sesini veya seçilen müziği koru; kaydedilen HTML'de "dokun ve başlat".
- **Animasyonlu yazı:** daktilo efekti, pixel font, mesajın frame'ler üzerinde belirmesi; çoklu sayfa/sahne.
- **Hazır şablonlar:** Sevgililer Günü, doğum günü, yıldönümü, anneler günü (tema + arka plan + font + yazı kombinasyonu).
- **Fotoğraf desteği:** sadece video değil, foto/çoklu foto slayt → pixel art.
- **Webcam'den kayıt** ve canlı pixel art önizleme (tarayıcıda gerçek zamanlı).
- **QR kod ile paylaşım:** kaydedilen sayfayı yerel ağda sun veya ücretsiz statik barındırma; QR üret.

### Dışa aktarım
- **GIF** (gifenc/gif.js), **MP4** (WebCodecs veya backend'de ffmpeg), **PNG sprite sheet**, **APNG/WebP animasyon**.
- Çözünürlük ve kalite seçimi gerçekten çalışsın; dışa aktarım Worker'da, ilerleme çubuğuyla.

### Kullanılabilirlik
- **Canlı önizleme:** ayar değiştiğinde ilk frame anında güncellensin (sunucuya gitmeden, istemci tarafı quantize).
- Oynat/duraklat, frame frame ilerleme, hız (0.5×–2×), döngü modu (ping-pong).
- Ayarları hatırlama (localStorage), geri al/ileri al.
- **Proje kaydet/aç** (`.pxv` dosyası: meta + frames.bin + ayarlar).
- Çoklu dil (TR/EN), mobil uyumlu düzen, klavye kısayolları, erişilebilirlik (kontrast, aria etiketleri).
- Geçmiş: önceki dönüşümler listesi, tekrar açma/silme.

### Teknik
- **Tamamen istemci tarafı mod:** WebCodecs/`<video>` + canvas ile tüm dönüşüm tarayıcıda → sunucu gereksiz, GitHub Pages'te yayınlanabilir.
- CLI: `pixelvideo convert in.mp4 --palette gameboy --dither --out out.gif` (backend'i paylaşan).

---

## 6. Uygulama yol haritası

### Faz 0 — Güvenlik ve emniyet (½ gün) — *hemen*
- [ ] `git init`, `.gitignore` (uploads/, static/outputs/, build/, dist/, __pycache__/, *.mp4)
- [ ] `cleanup.bat` / `run_exe.bat` kaldır veya mutlak yolla güvenli hale getir (H1)
- [ ] `app.py`: `debug=False`, `host=127.0.0.1` (H2)
- [ ] Mesaj kaçışı (H9)
- [ ] ~460 MB eski çıktıyı temizle

### Faz 1 — Hata düzeltmeleri (1 gün)
- [ ] Parametre doğrulama: `pixel_size` 2–64, `fps` > 0, `max_frames` ≥ 0; hatalar her zaman JSON (H5, H6)
- [ ] Global `@app.errorhandler` → JSON hata; `MAX_CONTENT_LENGTH` aşımında 413 JSON
- [ ] Küçük frame koruması (piksel sayısı < k ise k'yı düşür)
- [ ] UUID dosya adları (H11), `handleFileSelect` listener/animasyon sızıntısı (H10)
- [ ] Zaman tabanlı FPS örnekleme (H13), ölü ayarları ya kaldır ya çalıştır (H14), Paylaş'ı düzelt (H15)
- [ ] Yüklemeyi `loadedmetadata`'dan ayır: dosya hemen sunucuya gitsin, önizleme oynatılamazsa sadece bilgi mesajı (H18)
- [ ] Tek bir `currentJob` durumu: yeni seçimde eski isteği `AbortController` ile iptal et, animasyonları durdur (H19, H25)
- [ ] "Yeni video" butonu; `stopFlowerAnimation` bağlantısı (H25)
- [ ] Oynatma/dışa aktarmada zaman tabanlı frame seçimi + `pixelData.fps` kullanımı; MediaRecorder'da MP4 desteği (H20, H14)
- [ ] Yoğunluk kaydırıcısını 0.1–1 aralığına indir, 3000 sınırını kaldır (sprite cache ile gerek kalmaz), kopya şekil/temaları düzelt (H24)
- [ ] Kaydedilen HTML ve dışa aktarımda gerçek en-boy oranı + tema arka planı (H26)
- [ ] Bozuk video için `videoElement.onerror` mesajı; 413/500 için JSON hata işleyicisi (H27)
- [ ] Sunucu sınırları: maks. süre (ör. 60 sn), maks. grid (ör. 320×180), `pixel_size` ≥ 2 (H23)
- [ ] Exe: `sys.stdout.reconfigure(encoding='utf-8', errors='replace')`, port kontrolü (H21)
- [ ] Mobil: üst paneli açılır/kapanır çekmeceye çevir, `position: sticky` + daraltılmış varsayılan (H22)
- [ ] `pytest` test paketi: dönüştürücü birim testleri + Flask test client ile endpoint testleri (bu raporda elle yapılanların otomatiği)

### Faz 2 — Performans (2–3 gün)
- [ ] Global palet + NumPy eşleme + INTER_AREA (4.1) — hedef: 8 sn video < 2 sn
- [ ] Binary format (4.2) — hedef: çıktı < 2 MB
- [ ] Async job + SSE ilerleme + iptal + TTL temizliği (4.3)
- [ ] Sprite önbellekli renderer + ekran boyutlu canvas (4.4) — hedef: çiçek frame'i < 5 ms
- [ ] Hafif "Siteyi Kaydet" (4.5) — hedef: < 300 KB, < 200 ms
- [ ] Worker'da export

### Faz 3 — Kod yapısı (1–2 gün)
- [ ] `script.js`'i ES modüllerine böl: `api.js`, `player.js`, `renderers/{pixel,flower,ascii}.js`, `export.js`, `ui.js`, `shapes.js`
- [ ] Çiçek/şekil tanımlarını tek kaynakta tut (`shapes.json`), Python tarafındaki kopyayı kaldır
- [ ] Ölü kodu sil ya da `legacy/` klasörüne taşı; ASCII mantığını yeni renderer'a aktar
- [ ] waitress, otomatik port, `%LOCALAPPDATA%` veri klasörü, onedir build, requirements ayrımı (4.6)

### Faz 4 — Özellikler (iteratif)
1. Palet seçimi + dithering + renk sayısı (en yüksek etki/emek oranı)
2. GIF/MP4 export + ses desteği
3. Kırpma/zaman aralığı + canlı önizleme
4. Şablonlar + animasyonlu mesaj + pixel font
5. Braille/blok ASCII modları + metin export
6. Tamamen istemci tarafı mod (sunucusuz yayın)

### Başarı ölçütleri
| Metrik | Şimdi | Hedef |
|---|---|---|
| 8 sn 720p video işleme | 16 sn | < 2 sn |
| Çıktı boyutu | 107 MB | < 2 MB |
| Tarayıcı belleği | ~170 MB | < 30 MB |
| Çiçek frame çizimi | 40–64 ms | < 5 ms |
| Siteyi kaydet | 5.6 sn / 13 MB | < 0.2 sn / < 300 KB |
| Exe açılış / boyut | onefile 73 MB | onedir, < 1 sn açılış |

---

## 7. Uygulama durumu — 2026-10-12

Faz 0, Faz 1, Faz 2 ve Faz 3 tamamlandı; Faz 4'ten ilk özellik paketi eklendi. `python -m pytest` → 42 test geçiyor.

### Ölçülen sonuçlar (aynı makine, aynı videolar)

| Metrik | Önce | Sonra |
|---|---|---|
| 8 sn 720p video işleme | 16 sn | **1.0 sn** |
| 55 sn örnek video (55 sn): yükle → oynat | 34 sn, 190 MB JSON | **1.1 sn, 337 KB** |
| 60 sn 1080p | 199 sn, 1.5 GB, 2.1 GB RAM, sekme çöktü | **6.8 sn, 479 KB, 25 MB RAM** |
| Tarayıcı belleği (55 sn örnek) | 355 MB | **5 MB** |
| Çiçek frame çizimi | 33–63 ms | **~1 ms** (ASCII ~13 ms) |
| Siteyi kaydet (55 sn örnek) | 33.7 sn donma, 69 MB | **0.14 sn, 448 KB** |
| Video export süresi (8 sn video) | 10.5 / 12.8 sn | **7.9 sn** (MP4 gerçekten MP4) |
| Exe klasörü | 73 MB onefile + 157 MB eski çöp içeride | 157 MB onedir, 3 sn açılış |

### Kapanan hatalar
H1 (cleanup.bat silindi) · H2 (127.0.0.1, debug kapalı) · H3/H23 (ikili format, sınırlar) · H4 (arka plan işi,
gerçek ilerleme, iptal) · H5/H6/H27 (doğrulama, tüm hatalar JSON) · H7 (global palet) · H8 (hafif kayıt) ·
H9 (XSS — test edildi) · H10/H19 (tek iş durumu, eski iş sunucuda da iptal) · H11 (UUID klasörler) ·
H12 (24 saat TTL temizliği, %LOCALAPPDATA%) · H13 (zaman tabanlı fps) · H14 (MP4 çalışıyor, ölü ayarlar
kaldırıldı) · H15 (Web Share / indirme) · H16 (canvas ekran boyutunda) · H17/H20 (zaman çizelgeli kayıt) ·
H18 (yükleme önizlemeden bağımsız; AVI/MKV/WMV/FLV çalışıyor) · H21 (UTF-8 konsol, boş port) ·
H22 (mobil düzen) · H24 (yoğunluk gerçekten çalışıyor, kopya şekil/temalar düzeltildi, seçici tek açılıyor) ·
H25 (Yeni video / Geri butonları) · H26 (gerçek en-boy oranı, tema arka planı) · H28 (CLI doğrulama, UTF-8)

### Eklenen özellikler
Hazır paletler (Game Boy, PICO-8, Sweetie 16, CGA, Pastel, Gri, Sepya) · renk sayısı 2–64 · Bayer dithering ·
parlaklık/kontrast/doygunluk · başlangıç/bitiş kırpma · yeniden dönüştürme (tekrar yüklemeden) · oynatıcı
(duraklat, sarma, hız) · Braille modu · 4 ASCII seti · LED şekli · GIF export (kendi kodlayıcı) · export
boyutu seçimi · daktilo efektli mesaj · sayfa başlığı · ayarların hatırlanması · erişilebilirlik (klavye,
hareket azaltma tercihi)

### Kalan fikirler (Faz 4 devamı)
Ses/müzik desteği · fotoğraf ve çoklu foto slayt · webcam canlı mod · animasyonlu geçiş efektleri · şablonlar ·
proje kaydet/aç · tamamen istemci tarafı (sunucusuz) mod · çoklu dil

> Not: Eski `uploads/`, `static/outputs/` (~270 MB) ve `dist/` içindeki eski çıktılar yeni uygulama tarafından
> kullanılmıyor ve git'e dahil değil; istersen silinebilir.
