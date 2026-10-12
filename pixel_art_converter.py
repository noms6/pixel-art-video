import cv2
import numpy as np
import json
from PIL import Image

def quantize_colors(image, num_colors=16):
    """Renkleri sınırlı palete indirge (pixel art efekti)"""
    # Reshape image to be a list of pixels
    data = image.reshape((-1, 3))
    data = np.float32(data)
    
    # K-means clustering ile renk paleti oluştur
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
    k = num_colors
    _, labels, centers = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    
    # Renkleri palete göre değiştir
    centers = np.uint8(centers)
    quantized = centers[labels.flatten()]
    quantized = quantized.reshape(image.shape)
    
    return quantized, centers

def pixelate_frame(frame, pixel_size=8):
    """Frame'i pixel art'a dönüştür"""
    height, width = frame.shape[:2]
    
    # Küçült
    small_width = width // pixel_size
    small_height = height // pixel_size
    
    # Küçük boyutta yeniden boyutlandır (nearest neighbor)
    small = cv2.resize(frame, (small_width, small_height), interpolation=cv2.INTER_NEAREST)
    
    # Renk paletini sınırla
    quantized, palette = quantize_colors(small, num_colors=16)
    
    # Tekrar büyüt (pixel art efekti)
    pixelated = cv2.resize(quantized, (width, height), interpolation=cv2.INTER_NEAREST)
    
    return pixelated, palette

def frame_to_pixel_data(frame, pixel_size=8):
    """Frame'i pixel data'ya dönüştür (her pixel bir renk)"""
    pixelated, palette = pixelate_frame(frame, pixel_size)
    
    # Küçük boyutta pixel verilerini al
    height, width = pixelated.shape[:2]
    small_width = width // pixel_size
    small_height = height // pixel_size
    
    small = cv2.resize(pixelated, (small_width, small_height), interpolation=cv2.INTER_NEAREST)
    
    # RGB'ye çevir
    rgb_small = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
    
    # Pixel verilerini JSON'a uygun formata çevir
    pixel_data = []
    for row in rgb_small:
        pixel_row = []
        for pixel in row:
            pixel_row.append([int(pixel[0]), int(pixel[1]), int(pixel[2])])
        pixel_data.append(pixel_row)
    
    # Palette'i de dönüştür
    palette_rgb = []
    for color in palette:
        bgr_to_rgb = cv2.cvtColor(np.uint8([[color]]), cv2.COLOR_BGR2RGB)[0][0]
        palette_rgb.append([int(bgr_to_rgb[0]), int(bgr_to_rgb[1]), int(bgr_to_rgb[2])])
    
    return {
        'pixels': pixel_data,
        'palette': palette_rgb,
        'width': small_width,
        'height': small_height
    }

def video_to_pixel_art(video_path, pixel_size=8, max_frames=None, fps_limit=None):
    """Videoyu pixel art'a dönüştür"""
    print(f"Video işleniyor: {video_path}")
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Hata: Video açılamadı: {video_path}")
        return None
    
    original_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    print(f"Video bilgileri: FPS={original_fps}, Toplam Frame={total_frames}")
    
    if fps_limit and fps_limit < original_fps:
        frame_skip = max(1, int(original_fps / fps_limit))
    else:
        frame_skip = 1
    
    print(f"Frame skip: {frame_skip}, Max frames: {max_frames}")
    
    frames = []
    frame_count = 0
    processed_count = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print(f"Frame okuma durdu: frame_count={frame_count}, processed={processed_count}")
                break
            
            # Frame skip kontrolü
            if frame_count % frame_skip != 0:
                frame_count += 1
                continue
            
            # Max frames kontrolü
            if max_frames and processed_count >= max_frames:
                print(f"Max frame limitine ulaşıldı: {max_frames}")
                break
            
            try:
                pixel_data = frame_to_pixel_data(frame, pixel_size)
                frames.append(pixel_data)
                processed_count += 1
                
                if processed_count % 10 == 0:
                    print(f"İşlenen frame: {processed_count}")
            except Exception as e:
                print(f"Frame işleme hatası (frame {frame_count}): {e}")
                # Hatalı frame'i atla, devam et
            
            frame_count += 1
    
    except Exception as e:
        print(f"Video okuma hatası: {e}")
        import traceback
        traceback.print_exc()
    finally:
        cap.release()
    
    print(f"Toplam işlenen frame: {len(frames)}")
    
    if len(frames) == 0:
        print("UYARI: Hiç frame işlenemedi!")
        return None
    
    result_fps = original_fps / frame_skip if frame_skip > 1 else original_fps
    
    return {
        'frames': frames,
        'fps': result_fps,
        'total_frames': len(frames),
        'original_fps': original_fps,
        'pixel_size': pixel_size
    }

