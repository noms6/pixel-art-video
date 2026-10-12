import cv2
import numpy as np
import os
import sys
from pathlib import Path

# ASCII karakter seti (koyudan açığa)
ASCII_CHARS = "@%#*+=-:. "

def resize_frame(frame, new_width=120):
    """Frame'i yeniden boyutlandır"""
    height, width = frame.shape[:2]
    aspect_ratio = height / width
    new_height = int(new_width * aspect_ratio * 0.55)  # 0.55 karakter yükseklik oranı
    resized = cv2.resize(frame, (new_width, new_height))
    return resized

def frame_to_ascii(frame):
    """Frame'i ASCII karakterlere dönüştür"""
    # Gri tonlamaya çevir
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Her pikseli ASCII karaktere dönüştür
    ascii_frame = ""
    for row in gray:
        for pixel in row:
            # Piksel değerini (0-255) ASCII karakter indeksine (0-9) dönüştür
            index = int(pixel / 255 * (len(ASCII_CHARS) - 1))
            ascii_frame += ASCII_CHARS[index]
        ascii_frame += "\n"
    
    return ascii_frame

def video_to_ascii(video_path, output_path=None, width=120, fps=None):
    """Videoyu ASCII formatına dönüştür"""
    # Video dosyasını aç
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Hata: Video dosyası açılamadı: {video_path}")
        return
    
    # Video özelliklerini al
    original_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if fps is None:
        fps = original_fps
    
    print(f"Video yükleniyor: {video_path}")
    print(f"Toplam frame sayısı: {total_frames}")
    print(f"FPS: {original_fps} -> {fps}")
    print(f"ASCII genişlik: {width} karakter")
    
    # Çıktı dosyası belirtilmişse aç
    output_file = None
    if output_path:
        output_file = open(output_path, 'w', encoding='utf-8')
        print(f"Çıktı dosyası: {output_path}")
    
    frame_count = 0
    frame_skip = int(original_fps / fps) if fps < original_fps else 1
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Frame atlama (FPS düşürme için)
            if frame_count % frame_skip != 0:
                frame_count += 1
                continue
            
            # Frame'i ASCII'ye dönüştür
            resized_frame = resize_frame(frame, width)
            ascii_frame = frame_to_ascii(resized_frame)
            
            # Terminal'e yazdır (çıktı dosyası yoksa)
            if output_file:
                output_file.write(ascii_frame)
                output_file.write("\n" + "="*width + "\n")  # Frame ayırıcı
            else:
                # Terminal'i temizle ve yazdır
                os.system('cls' if os.name == 'nt' else 'clear')
                print(ascii_frame)
                print(f"Frame: {frame_count}/{total_frames}")
            
            frame_count += 1
            
            # Terminal modunda kullanıcı etkileşimi için bekleme
            if not output_file:
                import time
                time.sleep(1 / fps)
    
    except KeyboardInterrupt:
        print("\nİşlem kullanıcı tarafından durduruldu.")
    
    finally:
        cap.release()
        if output_file:
            output_file.close()
            print(f"\nASCII video kaydedildi: {output_path}")
        print(f"Toplam {frame_count} frame işlendi.")

def main():
    """Ana fonksiyon"""
    if len(sys.argv) < 2:
        print("Kullanım: python video_to_ascii.py <video_dosyası> [çıktı_dosyası.txt] [genişlik] [fps]")
        print("\nÖrnekler:")
        print("  python video_to_ascii.py video.mp4")
        print("  python video_to_ascii.py video.mp4 output.txt")
        print("  python video_to_ascii.py video.mp4 output.txt 80")
        print("  python video_to_ascii.py video.mp4 output.txt 80 10")
        sys.exit(1)
    
    video_path = sys.argv[1]
    
    if not os.path.exists(video_path):
        print(f"Hata: Dosya bulunamadı: {video_path}")
        sys.exit(1)
    
    output_path = sys.argv[2] if len(sys.argv) > 2 else None
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 120
    fps = float(sys.argv[4]) if len(sys.argv) > 4 else None
    
    video_to_ascii(video_path, output_path, width, fps)

if __name__ == "__main__":
    main()

