import cv2
import numpy as np
import base64
import io
from PIL import Image

# Daha detaylı ASCII karakter seti (koyudan açığa)
ASCII_CHARS = "@%#*+=-:. "
# Alternatif daha detaylı set
ASCII_CHARS_DETAILED = "█▓▒░@%#*+=-:. "

def rgb_to_ansi(r, g, b, background=False):
    """RGB değerlerini ANSI renk koduna dönüştür"""
    if background:
        return f"\033[48;2;{r};{g};{b}m"
    else:
        return f"\033[38;2;{r};{g};{b}m"

def resize_frame(frame, new_width=150):
    """Frame'i yeniden boyutlandır (daha yüksek kalite için)"""
    height, width = frame.shape[:2]
    aspect_ratio = height / width
    new_height = int(new_width * aspect_ratio * 0.5)  # Karakter yükseklik oranı
    resized = cv2.resize(frame, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)
    return resized

def frame_to_ascii_colored(frame, use_color=True, detailed=True):
    """Frame'i renkli ASCII karakterlere dönüştür"""
    chars = ASCII_CHARS_DETAILED if detailed else ASCII_CHARS
    
    # BGR'den RGB'ye çevir
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Gri tonlamayı da hesapla (karakter seçimi için)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    ascii_frame = ""
    reset_code = "\033[0m" if use_color else ""
    
    for i, (row, gray_row) in enumerate(zip(rgb_frame, gray)):
        for j, (pixel, gray_val) in enumerate(zip(row, gray_row)):
            r, g, b = pixel
            
            # Karakter seçimi (gri tonlamaya göre)
            index = int(gray_val / 255 * (len(chars) - 1))
            char = chars[index]
            
            if use_color:
                # Renk kodunu ekle
                color_code = rgb_to_ansi(r, g, b)
                ascii_frame += f"{color_code}{char}{reset_code}"
            else:
                ascii_frame += char
        ascii_frame += "\n"
    
    return ascii_frame

def frame_to_html_colored(frame, detailed=True):
    """Frame'i HTML renkli ASCII'ye dönüştür (web için)"""
    chars = ASCII_CHARS_DETAILED if detailed else ASCII_CHARS
    
    # BGR'den RGB'ye çevir
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    html_frame = ""
    
    for row, gray_row in zip(rgb_frame, gray):
        for pixel, gray_val in zip(row, gray_row):
            r, g, b = pixel
            
            # Karakter seçimi
            index = int(gray_val / 255 * (len(chars) - 1))
            char = chars[index]
            
            # HTML span ile renklendir
            color = f"rgb({r},{g},{b})"
            # Özel karakterler için HTML entity
            if char == " ":
                char = "&nbsp;"
            elif char == "<":
                char = "&lt;"
            elif char == ">":
                char = "&gt;"
            
            html_frame += f'<span style="color: {color};">{char}</span>'
        html_frame += "<br>"
    
    return html_frame

def video_to_ascii_json(video_path, width=150, max_frames=None, fps_limit=None):
    """Videoyu JSON formatında renkli ASCII frame'lere dönüştür (web için)"""
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        return None
    
    original_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if fps_limit and fps_limit < original_fps:
        frame_skip = int(original_fps / fps_limit)
    else:
        frame_skip = 1
    
    if max_frames:
        total_frames = min(total_frames, max_frames * frame_skip)
    
    frames = []
    frame_count = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % frame_skip != 0:
                frame_count += 1
                continue
            
            if max_frames and len(frames) >= max_frames:
                break
            
            resized_frame = resize_frame(frame, width)
            html_ascii = frame_to_html_colored(resized_frame, detailed=True)
            
            frames.append({
                'frame': html_ascii,
                'number': len(frames)
            })
            
            frame_count += 1
    
    finally:
        cap.release()
    
    return {
        'frames': frames,
        'fps': original_fps / frame_skip,
        'total_frames': len(frames),
        'original_fps': original_fps
    }

def video_to_ascii_stream(video_path, width=150, fps=None):
    """Videoyu stream olarak renkli ASCII'ye dönüştür (generator)"""
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        return
    
    original_fps = cap.get(cv2.CAP_PROP_FPS)
    if fps is None:
        fps = original_fps
    
    frame_skip = int(original_fps / fps) if fps < original_fps else 1
    frame_count = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % frame_skip != 0:
                frame_count += 1
                continue
            
            resized_frame = resize_frame(frame, width)
            ascii_frame = frame_to_ascii_colored(resized_frame, use_color=True, detailed=True)
            
            yield ascii_frame
            frame_count += 1
    
    finally:
        cap.release()

if __name__ == "__main__":
    import sys
    import os
    
    if len(sys.argv) < 2:
        print("Kullanım: python video_to_ascii_color.py <video_dosyası> [genişlik] [fps]")
        sys.exit(1)
    
    video_path = sys.argv[1]
    width = int(sys.argv[2]) if len(sys.argv) > 2 else 150
    fps = float(sys.argv[3]) if len(sys.argv) > 3 else None
    
    if not os.path.exists(video_path):
        print(f"Hata: Dosya bulunamadı: {video_path}")
        sys.exit(1)
    
    import time
    for ascii_frame in video_to_ascii_stream(video_path, width, fps):
        os.system('cls' if os.name == 'nt' else 'clear')
        print(ascii_frame)
        if fps:
            time.sleep(1 / fps)

