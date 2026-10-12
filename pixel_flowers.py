"""
Pixel art çiçek ve romantik element tasarımları
"""

# Pixel art çiçek tasarımları (8x8 veya 16x16)
PIXEL_FLOWERS = {
    'rose': {
        'size': 8,
        'pixels': [
            [0,0,0,1,1,0,0,0],
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,4,4,3,2,1],
            [1,2,3,4,4,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,1,1,0,0,0],
        ],
        'colors': [
            [0, 0, 0],      # 0: Siyah (kenar)
            [139, 0, 0],    # 1: Koyu kırmızı
            [220, 20, 60],  # 2: Kırmızı
            [255, 105, 180], # 3: Pembe
            [255, 192, 203]  # 4: Açık pembe
        ]
    },
    'tulip': {
        'size': 8,
        'pixels': [
            [0,0,1,1,1,1,0,0],
            [0,1,2,2,2,2,1,0],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [0,1,2,2,2,2,1,0],
            [0,0,1,1,1,1,0,0],
            [0,0,0,4,4,0,0,0],
            [0,0,0,4,4,0,0,0],
        ],
        'colors': [
            [0, 0, 0],      # 0: Siyah
            [34, 139, 34],  # 1: Koyu yeşil
            [255, 20, 147], # 2: Pembe
            [255, 105, 180], # 3: Açık pembe
            [0, 128, 0]     # 4: Yeşil sap
        ]
    },
    'sunflower': {
        'size': 8,
        'pixels': [
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,4,4,3,2,1],
            [2,3,4,5,5,4,3,2],
            [2,3,4,5,5,4,3,2],
            [1,2,3,4,4,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
        ],
        'colors': [
            [0, 0, 0],      # 0: Siyah
            [139, 69, 19],  # 1: Kahverengi
            [184, 134, 11], # 2: Altın
            [255, 215, 0],  # 3: Sarı
            [255, 255, 0],  # 4: Açık sarı
            [255, 140, 0]   # 5: Turuncu
        ]
    },
    'cherry_blossom': {
        'size': 8,
        'pixels': [
            [0,0,0,1,1,0,0,0],
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,2,2,3,2,1],
            [1,2,3,2,2,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,1,1,0,0,0],
        ],
        'colors': [
            [0, 0, 0],      # 0: Siyah
            [139, 0, 0],    # 1: Koyu kırmızı
            [255, 182, 193], # 2: Açık pembe
            [255, 192, 203]  # 3: Pembe
        ]
    },
    'heart': {
        'size': 8,
        'pixels': [
            [0,1,1,0,0,1,1,0],
            [1,2,2,1,1,2,2,1],
            [1,2,3,2,2,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
        ],
        'colors': [
            [0, 0, 0],      # 0: Siyah
            [139, 0, 0],    # 1: Koyu kırmızı
            [220, 20, 60],  # 2: Kırmızı
            [255, 105, 180] # 3: Pembe
        ]
    },
    'star': {
        'size': 8,
        'pixels': [
            [0,0,0,1,1,0,0,0],
            [0,0,1,2,2,1,0,0],
            [0,1,2,2,2,2,1,0],
            [1,2,2,3,3,2,2,1],
            [1,2,2,3,3,2,2,1],
            [0,1,2,2,2,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,1,1,0,0,0],
        ],
        'colors': [
            [0, 0, 0],      # 0: Siyah
            [184, 134, 11], # 1: Altın
            [255, 215, 0],  # 2: Sarı
            [255, 255, 255] # 3: Beyaz
        ]
    }
}

def get_flower_by_name(name):
    """Çiçek adına göre pixel art çiçek döndür"""
    return PIXEL_FLOWERS.get(name, PIXEL_FLOWERS['rose'])

def create_flower_from_pixel_data(pixel_data, flower_type='rose', scale=1):
    """Pixel data'dan çiçek oluştur"""
    flower = get_flower_by_name(flower_type)
    size = flower['size'] * scale
    pixels = flower['pixels']
    colors = flower['colors']
    
    # Pixel data'dan renk al (ortalaması)
    if pixel_data and len(pixel_data) > 0:
        # İlk frame'in ortalaması
        avg_color = [0, 0, 0]
        count = 0
        for row in pixel_data:
            for pixel in row:
                avg_color[0] += pixel[0]
                avg_color[1] += pixel[1]
                avg_color[2] += pixel[2]
                count += 1
        if count > 0:
            avg_color = [int(avg_color[0]/count), int(avg_color[1]/count), int(avg_color[2]/count)]
    else:
        avg_color = [255, 192, 203]  # Varsayılan pembe
    
    # Çiçek renklerini pixel data renklerine göre ayarla
    adjusted_colors = []
    for i, color in enumerate(colors):
        if i == 0:  # Siyah kenar
            adjusted_colors.append(color)
        else:
            # Renkleri pixel data'ya göre karıştır
            mix_ratio = 0.6
            r = int(color[0] * (1 - mix_ratio) + avg_color[0] * mix_ratio)
            g = int(color[1] * (1 - mix_ratio) + avg_color[1] * mix_ratio)
            b = int(color[2] * (1 - mix_ratio) + avg_color[2] * mix_ratio)
            adjusted_colors.append([r, g, b])
    
    return {
        'size': size,
        'pixels': pixels,
        'colors': adjusted_colors
    }

def pixel_data_to_flowers(pixel_data, flower_type='rose', density=0.3):
    """Pixel data'yı çiçeklere dönüştür"""
    flowers = []
    flower = get_flower_by_name(flower_type)
    flower_size = flower['size']
    
    if not pixel_data or len(pixel_data) == 0:
        return flowers
    
    height = len(pixel_data)
    width = len(pixel_data[0]) if height > 0 else 0
    
    # Her N pixel'de bir çiçek yerleştir
    step = max(1, int(1 / density))
    
    for y in range(0, height, step):
        for x in range(0, width, step):
            if y < height and x < width:
                pixel_color = pixel_data[y][x]
                flower_data = create_flower_from_pixel_data([pixel_color], flower_type, scale=1)
                flowers.append({
                    'x': x * flower_size,
                    'y': y * flower_size,
                    'flower': flower_data,
                    'color': pixel_color
                })
    
    return flowers

