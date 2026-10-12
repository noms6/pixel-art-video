from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import sys
import atexit
import shutil
from pathlib import Path
from pixel_art_converter import video_to_pixel_art
from pixel_flowers import pixel_data_to_flowers, PIXEL_FLOWERS
import json

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max dosya boyutu

def get_base_dir():
    """Çalışma dizinini belirle"""
    if getattr(sys, 'frozen', False):
        # Exe modunda - exe'nin bulunduğu dizin
        return Path(sys.executable).parent
    else:
        # Normal modda - script'in bulunduğu dizin
        return Path(__file__).parent

def ensure_folders():
    """Klasörlerin var olduğundan emin ol"""
    base_dir = get_base_dir()
    uploads_dir = base_dir / 'uploads'
    outputs_dir = base_dir / 'static' / 'outputs'
    
    # Klasörleri oluştur
    uploads_dir.mkdir(parents=True, exist_ok=True)
    outputs_dir.mkdir(parents=True, exist_ok=True)
    
    return str(uploads_dir), str(outputs_dir)

# Klasörleri oluştur ve yapılandırmayı ayarla
uploads_folder, outputs_folder = ensure_folders()
app.config['UPLOAD_FOLDER'] = uploads_folder
app.config['OUTPUT_FOLDER'] = outputs_folder

# Exe modunda temizlik fonksiyonu
def cleanup_on_exit():
    """Exe kapanırken geçici klasörleri temizle"""
    if not getattr(sys, 'frozen', False):
        return  # Normal modda temizlik yapma
    
    try:
        exe_dir = Path(sys.executable).parent
        folders_to_clean = ['uploads', 'static']
        
        for folder_name in folders_to_clean:
            folder_path = exe_dir / folder_name
            if folder_path.exists() and folder_path.is_dir():
                try:
                    # Birkaç kez dene (dosyalar kilitli olabilir)
                    for attempt in range(3):
                        try:
                            shutil.rmtree(folder_path, ignore_errors=True)
                            break
                        except Exception:
                            if attempt < 2:
                                import time
                                time.sleep(0.5)
                except Exception:
                    pass
    except Exception:
        pass

# NOT: teardown_appcontext kullanmıyoruz çünkü her request sonunda çalışır
# ve klasörleri hemen siler. Sadece atexit kullanıyoruz - program gerçekten kapanırken çalışır

# Atexit handler - sadece program kapanırken çalışır
atexit.register(cleanup_on_exit)

ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'video' not in request.files:
        return jsonify({'error': 'Video dosyası bulunamadı'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'Dosya seçilmedi'}), 400
    
    if file and allowed_file(file.filename):
        # Klasörlerin var olduğundan emin ol
        ensure_folders()
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Parametreleri al
        pixel_size = int(request.form.get('pixel_size', 8))
        max_frames_input = request.form.get('max_frames', '0')
        max_frames = int(max_frames_input) if max_frames_input and max_frames_input != '0' else None
        fps_limit_input = request.form.get('fps', '0')
        fps_limit = float(fps_limit_input) if fps_limit_input and fps_limit_input != '0' else None
        
        # Video'yu pixel art'a dönüştür
        try:
            import traceback
            result = video_to_pixel_art(filepath, pixel_size=pixel_size, max_frames=max_frames, fps_limit=fps_limit)
            
            if result and result.get('frames'):
                # JSON dosyasına kaydet
                output_filename = f"{os.path.splitext(filename)[0]}_pixel.json"
                output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
                
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(result, f, ensure_ascii=False, indent=2)
                
                return jsonify({
                    'success': True,
                    'filename': output_filename,
                    'total_frames': result['total_frames'],
                    'fps': result['fps'],
                    'pixel_size': result['pixel_size']
                })
            else:
                error_msg = 'Video işlenemedi'
                if result is None:
                    error_msg = 'Video açılamadı veya okunamadı'
                elif not result.get('frames'):
                    error_msg = f"Hiç frame işlenemedi. Toplam frame: {result.get('total_frames', 0)}"
                return jsonify({'error': error_msg}), 500
                
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"Video işleme hatası: {error_trace}")
            return jsonify({'error': f'İşleme hatası: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Geçersiz dosya formatı'}), 400

@app.route('/outputs/<filename>')
def get_output(filename):
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)

@app.route('/flowers')
def get_flowers():
    """Mevcut çiçek tiplerini döndür"""
    return jsonify({'flowers': list(PIXEL_FLOWERS.keys())})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
