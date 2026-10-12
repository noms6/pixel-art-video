// Global değişkenler
let pixelData = null;
let videoElement = null;
let pixelCanvas = null;
let flowerCanvas = null;
let currentTheme = 'romantic';
let currentFlowerType = 'rose';
let currentDensity = 1; // Varsayılan yoğunluk
let pixelSize = 8;
let flowerScale = 3; // Varsayılan çiçek ölçeği
let pixelArtAnimation = null;
let flowerAnimation = null;
let isPixelArtPlaying = false;
let isFlowerPlaying = false;
let transitionProgress = 0;
let isTransitioning = false;
let originalVideoWidth = 0;
let originalVideoHeight = 0;
let videoFps = 10;
let videoQuality = 1;
let maxFrames = 0;
let currentBackgroundElement = 'none';
let backgroundElements = [];

// DOM elementleri
const uploadBox = document.getElementById('uploadBox');
const videoInput = document.getElementById('videoInput');
const uploadSection = document.getElementById('uploadSection');
const videoPreviewSection = document.getElementById('videoPreviewSection');
const flowerDisplaySection = document.getElementById('flowerDisplaySection');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const startBtn = document.getElementById('startBtn');
const saveBtn = document.getElementById('saveBtn');
const shareBtn = document.getElementById('shareBtn');
const messageText = document.getElementById('messageText');

// Ayarlar
const themeSelect = document.getElementById('themeSelect');
const flowerSelect = document.getElementById('flowerSelect');
const densitySlider = document.getElementById('densitySlider');
const densityValue = document.getElementById('densityValue');
const pixelSizeSlider = document.getElementById('pixelSizeSlider');
const pixelSizeValue = document.getElementById('pixelSizeValue');

// Pixel art çiçek tanımları (pixel_flowers.py'den)
const PIXEL_FLOWERS = {
    'rose': {
        size: 8,
        pixels: [
            [0,0,0,1,1,0,0,0],
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,4,4,3,2,1],
            [1,2,3,4,4,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,1,1,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [139, 0, 0],
            [220, 20, 60],
            [255, 105, 180],
            [255, 192, 203]
        ]
    },
    'tulip': {
        size: 8,
        pixels: [
            [0,0,1,1,1,1,0,0],
            [0,1,2,2,2,2,1,0],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [0,1,2,2,2,2,1,0],
            [0,0,1,1,1,1,0,0],
            [0,0,0,4,4,0,0,0],
            [0,0,0,4,4,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [34, 139, 34],
            [255, 20, 147],
            [255, 105, 180],
            [0, 128, 0]
        ]
    },
    'sunflower': {
        size: 8,
        pixels: [
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,4,4,3,2,1],
            [2,3,4,5,5,4,3,2],
            [2,3,4,5,5,4,3,2],
            [1,2,3,4,4,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
        ],
        colors: [
            [0, 0, 0],
            [139, 69, 19],
            [184, 134, 11],
            [255, 215, 0],
            [255, 255, 0],
            [255, 140, 0]
        ]
    },
    'cherry_blossom': {
        size: 8,
        pixels: [
            [0,0,0,1,1,0,0,0],
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,2,2,3,2,1],
            [1,2,3,2,2,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,1,1,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [139, 0, 0],
            [255, 182, 193],
            [255, 192, 203]
        ]
    },
    'heart': {
        size: 8,
        pixels: [
            [0,1,1,0,0,1,1,0],
            [1,2,2,1,1,2,2,1],
            [1,2,3,2,2,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [139, 0, 0],
            [220, 20, 60],
            [255, 105, 180]
        ]
    },
    'star': {
        size: 8,
        pixels: [
            [0,0,0,1,1,0,0,0],
            [0,0,1,2,2,1,0,0],
            [0,1,2,2,2,2,1,0],
            [1,2,2,3,3,2,2,1],
            [1,2,2,3,3,2,2,1],
            [0,1,2,2,2,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,1,1,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [184, 134, 11],
            [255, 215, 0],
            [255, 255, 255]
        ]
    },
    'daisy': {
        size: 8,
        pixels: [
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,4,4,3,2,1],
            [2,3,4,5,5,4,3,2],
            [2,3,4,5,5,4,3,2],
            [1,2,3,4,4,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
        ],
        colors: [
            [0, 0, 0],
            [255, 255, 255],
            [255, 255, 200],
            [255, 255, 150],
            [255, 255, 100],
            [255, 200, 0]
        ]
    },
    'lily': {
        size: 8,
        pixels: [
            [0,0,0,1,1,0,0,0],
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,4,4,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,5,5,1,0,0],
            [0,0,0,5,5,0,0,0],
            [0,0,0,5,5,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [255, 255, 255],
            [255, 250, 250],
            [255, 240, 240],
            [255, 230, 230],
            [34, 139, 34]
        ]
    },
    'orchid': {
        size: 8,
        pixels: [
            [0,1,1,0,0,1,1,0],
            [1,2,2,1,1,2,2,1],
            [1,2,3,2,2,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,4,4,0,0,0],
            [0,0,0,4,4,0,0,0],
            [0,0,0,4,4,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [138, 43, 226],
            [186, 85, 211],
            [221, 160, 221],
            [0, 128, 0]
        ]
    },
    'lavender': {
        size: 8,
        pixels: [
            [0,0,1,1,1,1,0,0],
            [0,1,2,2,2,2,1,0],
            [1,2,3,3,3,3,2,1],
            [0,1,2,2,2,2,1,0],
            [0,0,1,1,1,1,0,0],
            [0,0,0,4,4,0,0,0],
            [0,0,0,4,4,0,0,0],
            [0,0,0,4,4,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [230, 230, 250],
            [216, 191, 216],
            [186, 85, 211],
            [0, 100, 0]
        ]
    },
    'jasmine': {
        size: 8,
        pixels: [
            [0,0,0,1,1,0,0,0],
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,2,2,3,2,1],
            [1,2,3,2,2,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,4,4,1,0,0],
            [0,0,0,4,4,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [255, 255, 255],
            [255, 250, 240],
            [255, 245, 230],
            [34, 139, 34]
        ]
    },
    'lotus': {
        size: 8,
        pixels: [
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,4,4,3,2,1],
            [2,3,4,5,5,4,3,2],
            [2,3,4,5,5,4,3,2],
            [1,2,3,4,4,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
        ],
        colors: [
            [0, 0, 0],
            [255, 182, 193],
            [255, 192, 203],
            [255, 20, 147],
            [255, 105, 180],
            [255, 0, 127]
        ]
    },
    'diamond': {
        size: 8,
        pixels: [
            [0,0,0,1,1,0,0,0],
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,4,4,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,0,0,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [176, 196, 222],
            [135, 206, 250],
            [0, 191, 255],
            [255, 255, 255]
        ]
    },
    'circle': {
        size: 8,
        pixels: [
            [0,0,1,1,1,1,0,0],
            [0,1,2,2,2,2,1,0],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [0,1,2,2,2,2,1,0],
            [0,0,1,1,1,1,0,0],
        ],
        colors: [
            [0, 0, 0],
            [100, 100, 100],
            [150, 150, 150],
            [200, 200, 200]
        ]
    },
    'square': {
        size: 8,
        pixels: [
            [1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1],
        ],
        colors: [
            [0, 0, 0],
            [50, 50, 50],
            [100, 100, 100],
            [150, 150, 150]
        ]
    },
    'triangle': {
        size: 8,
        pixels: [
            [0,0,0,1,1,0,0,0],
            [0,0,1,2,2,1,0,0],
            [0,1,2,3,3,2,1,0],
            [1,2,3,4,4,3,2,1],
            [1,2,3,4,4,3,2,1],
            [0,1,2,3,3,2,1,0],
            [0,0,1,2,2,1,0,0],
            [0,0,0,1,1,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [100, 100, 100],
            [150, 150, 150],
            [200, 200, 200],
            [255, 255, 255]
        ]
    },
    'sparkle': {
        size: 8,
        pixels: [
            [0,0,0,1,1,0,0,0],
            [0,1,0,2,2,0,1,0],
            [0,0,2,3,3,2,0,0],
            [1,2,3,4,4,3,2,1],
            [1,2,3,4,4,3,2,1],
            [0,0,2,3,3,2,0,0],
            [0,1,0,2,2,0,1,0],
            [0,0,0,1,1,0,0,0],
        ],
        colors: [
            [0, 0, 0],
            [200, 200, 200],
            [255, 255, 200],
            [255, 255, 255],
            [255, 255, 0]
        ]
    },
    'ascii_dot': {
        size: 4,
        pixels: [
            [0,1,1,0],
            [1,2,2,1],
            [1,2,2,1],
            [0,1,1,0],
        ],
        colors: [
            [0, 0, 0],
            [100, 100, 100],
            [200, 200, 200]
        ]
    },
    'ascii_block': {
        size: 8,
        pixels: [
            [1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1],
        ],
        colors: [
            [0, 0, 0],
            [50, 50, 50],
            [150, 150, 150],
            [255, 255, 255]
        ]
    },
    'pixel_square': {
        size: 6,
        pixels: [
            [1,1,1,1,1,1],
            [1,2,2,2,2,1],
            [1,2,3,3,2,1],
            [1,2,3,3,2,1],
            [1,2,2,2,2,1],
            [1,1,1,1,1,1],
        ],
        colors: [
            [0, 0, 0],
            [80, 80, 80],
            [160, 160, 160],
            [240, 240, 240]
        ]
    },
    'pixel_circle': {
        size: 6,
        pixels: [
            [0,1,1,1,1,0],
            [1,2,2,2,2,1],
            [1,2,3,3,2,1],
            [1,2,3,3,2,1],
            [1,2,2,2,2,1],
            [0,1,1,1,1,0],
        ],
        colors: [
            [0, 0, 0],
            [80, 80, 80],
            [160, 160, 160],
            [240, 240, 240]
        ]
    },
    'pixel_diamond': {
        size: 6,
        pixels: [
            [0,0,1,1,0,0],
            [0,1,2,2,1,0],
            [1,2,3,3,2,1],
            [1,2,3,3,2,1],
            [0,1,2,2,1,0],
            [0,0,1,1,0,0],
        ],
        colors: [
            [0, 0, 0],
            [80, 80, 80],
            [160, 160, 160],
            [240, 240, 240]
        ]
    },
    'ascii_char': {
        size: 8,
        pixels: [
            [0,1,1,1,1,1,1,0],
            [1,2,2,2,2,2,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,3,4,4,3,2,1],
            [1,2,3,4,4,3,2,1],
            [1,2,3,3,3,3,2,1],
            [1,2,2,2,2,2,2,1],
            [0,1,1,1,1,1,1,0],
        ],
        colors: [
            [0, 0, 0],
            [50, 50, 50],
            [120, 120, 120],
            [200, 200, 200],
            [255, 255, 255]
        ]
    },
    'ascii_art': {
        size: 1,
        isAscii: true,
        chars: '@%#*+=-:. '
    },
    'ascii_dense': {
        size: 1,
        isAscii: true,
        chars: '█▓▒░@%#*+=-:. '
    },
    'ascii_light': {
        size: 1,
        isAscii: true,
        chars: '░▒▓█@%#*+=-:. '
    }
};

// Tema renkleri
const THEMES = {
    romantic: { start: '#ff9a9e', end: '#fecfef' },
    spring: { start: '#a8edea', end: '#fed6e3' },
    sunset: { start: '#ff9a56', end: '#ff6b6b' },
    ocean: { start: '#43e97b', end: '#38f9d7' },
    forest: { start: '#134e5e', end: '#71b280' },
    purple: { start: '#667eea', end: '#764ba2' },
    pink: { start: '#f093fb', end: '#f5576c' },
    blue: { start: '#4facfe', end: '#00f2fe' },
    green: { start: '#43e97b', end: '#38f9d7' },
    orange: { start: '#fa709a', end: '#fee140' },
    red: { start: '#ff6b6b', end: '#ee5a6f' },
    gold: { start: '#f6d365', end: '#fda085' },
    lavender: { start: '#a8caba', end: '#5d4e75' },
    rose: { start: '#ffecd2', end: '#fcb69f' },
    sunset2: { start: '#ff9a9e', end: '#fad0c4' },
    aurora: { start: '#00c9ff', end: '#92fe9d' },
    neon: { start: '#f093fb', end: '#4facfe' },
    pastel: { start: '#ffecd2', end: '#fcb69f' },
    dark: { start: '#2c3e50', end: '#34495e' },
    light: { start: '#ffeaa7', end: '#fab1a0' }
};

// İnit
document.addEventListener('DOMContentLoaded', () => {
    pixelCanvas = document.getElementById('pixelCanvas');
    flowerCanvas = document.getElementById('flowerCanvas');
    videoElement = document.getElementById('videoPreview');
    
    setupEventListeners();
    applyTheme(currentTheme);
    initBackgroundElements();
});

function initBackgroundElements() {
    // Mevcut öğeleri temizle
    const existingContainer = document.querySelector('.background-elements');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    if (currentBackgroundElement === 'none') {
        return;
    }
    
    // Container oluştur
    const container = document.createElement('div');
    container.className = 'background-elements';
    document.body.appendChild(container);
    
    // Öğe sayısı
    const elementCount = getElementCount(currentBackgroundElement);
    const elements = getElementSymbols(currentBackgroundElement);
    
    // Öğeleri oluştur
    for (let i = 0; i < elementCount; i++) {
        const element = document.createElement('div');
        // Class isimlerini düzelt (CSS'teki class isimleriyle eşleştir)
        const elementClass = getElementClass(currentBackgroundElement);
        element.className = `bg-element ${elementClass}`;
        element.textContent = elements[Math.floor(Math.random() * elements.length)];
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 5 + 's';
        element.style.fontSize = (Math.random() * 1 + 1) + 'rem';
        container.appendChild(element);
    }
    
    backgroundElements = Array.from(container.children);
}

function getElementCount(type) {
    // Görsellik için öğe sayıları artırıldı
    const counts = {
        'flowers': 20,
        'stars': 30,
        'hearts': 18,
        'leaves': 25,
        'butterflies': 15,
        'snowflakes': 40,
        'sparkles': 50,
        'bubbles': 20,
        'cherry_blossoms': 30,
        'rose_petals': 35,
        'fireflies': 20,
        'raindrops': 50,
        'confetti': 30,
        'music_notes': 18
    };
    return counts[type] || 20;
}

function getElementSymbols(type) {
    const symbols = {
        'flowers': ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '💐', '🪷'],
        'stars': ['⭐', '✨', '🌟', '💫', '⭐', '✨'],
        'hearts': ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞'],
        'leaves': ['🍃', '🌿', '🍀', '🌱', '🍃', '🌿'],
        'butterflies': ['🦋', '🦋', '🦋'],
        'snowflakes': ['❄️', '❄️', '❄️', '❄️'],
        'sparkles': ['✨', '⭐', '💫', '✨', '⭐'],
        'bubbles': ['💭', '🫧', '💭', '🫧'],
        'cherry_blossoms': ['🌸', '🌸', '🌸', '🌸'],
        'rose_petals': ['🌹', '🌹', '🌹', '🌹'],
        'fireflies': ['✨', '⭐', '✨', '⭐'],
        'raindrops': ['💧', '💧', '💧', '💧'],
        'confetti': ['🎊', '🎉', '🎊', '🎉'],
        'music_notes': ['🎵', '🎶', '🎵', '🎶']
    };
    return symbols[type] || ['✨'];
}

function getElementClass(type) {
    const classMap = {
        'flowers': 'flower',
        'stars': 'star',
        'hearts': 'heart',
        'leaves': 'leaf',
        'butterflies': 'butterfly',
        'snowflakes': 'snowflake',
        'sparkles': 'sparkle',
        'bubbles': 'bubble',
        'cherry_blossoms': 'cherry',
        'rose_petals': 'petal',
        'fireflies': 'firefly',
        'raindrops': 'raindrop',
        'confetti': 'confetti',
        'music_notes': 'music'
    };
    return classMap[type] || 'sparkle';
}

function setupEventListeners() {
    // Dosya yükleme
    uploadBox.addEventListener('click', () => videoInput.click());
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('dragover');
    });
    uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('dragover'));
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });
    videoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    // Ayarlar
    themeSelect.addEventListener('change', (e) => {
        currentTheme = e.target.value;
        applyTheme(currentTheme);
        // Tema değiştiğinde arka plan öğelerini güncelle
        if (currentBackgroundElement !== 'none') {
            initBackgroundElements();
        }
    });
    flowerSelect.addEventListener('change', (e) => {
        currentFlowerType = e.target.value;
        if (pixelData) updateFlowers();
    });
    densitySlider.addEventListener('input', (e) => {
        currentDensity = parseFloat(e.target.value);
        densityValue.textContent = currentDensity;
        if (pixelData) {
            // Debounce ile güncelle
            clearTimeout(updateFlowersTimeout);
            updateFlowersTimeout = setTimeout(() => {
                if (isFlowerPlaying) {
                    // Animasyon devam ederken mevcut frame'i güncelle
                    const currentFrame = Math.floor((Date.now() / (1000 / (pixelData.fps || 10))) % pixelData.frames.length);
                    updateFlowersForFrame(currentFrame);
                } else {
                    updateFlowers();
                }
            }, 300);
        }
    });
    pixelSizeSlider.addEventListener('input', (e) => {
        pixelSize = parseInt(e.target.value);
        pixelSizeValue.textContent = pixelSize;
        // Pixel boyutu değiştiğinde sadece mevcut pixel art'ı güncelle
        // Video yeniden yüklenmesin, sadece görsel güncellensin
        if (pixelData) {
            // Mevcut pixel art'ı yeni boyutla güncelle
            if (isFlowerPlaying) {
                // Animasyon devam ederken mevcut frame'i güncelle
                const currentFrame = Math.floor((Date.now() / (1000 / (pixelData.fps || 10))) % pixelData.frames.length);
                updateFlowersForFrame(currentFrame);
            } else {
                updateFlowers();
            }
        }
    });
    
    // Arka plan öğesi
    const backgroundElementSelect = document.getElementById('backgroundElementSelect');
    if (backgroundElementSelect) {
        backgroundElementSelect.addEventListener('change', (e) => {
            currentBackgroundElement = e.target.value;
            initBackgroundElements();
        });
    }
    
    // İnce ayarlar
    const advancedSettingsBtn = document.getElementById('advancedSettingsBtn');
    const advancedSettings = document.getElementById('advancedSettings');
    const flowerScaleSlider = document.getElementById('flowerScaleSlider');
    const flowerScaleValue = document.getElementById('flowerScaleValue');
    const videoFpsInput = document.getElementById('videoFpsInput');
    const videoQualitySelect = document.getElementById('videoQualitySelect');
    const maxFramesInput = document.getElementById('maxFramesInput');
    
    if (advancedSettingsBtn) {
        advancedSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Navbar gizleme butonuna tıklama yayılmasını engelle
            advancedSettings.style.display = advancedSettings.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    if (flowerScaleSlider) {
        flowerScaleSlider.addEventListener('input', (e) => {
            flowerScale = parseInt(e.target.value);
            flowerScaleValue.textContent = flowerScale;
            if (pixelData && isFlowerPlaying) {
                clearTimeout(updateFlowersTimeout);
                updateFlowersTimeout = setTimeout(() => updateFlowers(), 300);
            }
        });
    }
    
    if (videoFpsInput) {
        videoFpsInput.addEventListener('change', (e) => {
            videoFps = parseInt(e.target.value) || 10;
        });
    }
    
    if (videoQualitySelect) {
        videoQualitySelect.addEventListener('change', (e) => {
            videoQuality = parseFloat(e.target.value);
        });
    }
    
    if (maxFramesInput) {
        maxFramesInput.addEventListener('change', (e) => {
            maxFrames = parseInt(e.target.value) || 0;
        });
    }
    
    // Navbar gizleme
    const toggleNavBtn = document.getElementById('toggleNavBtn');
    const showNavBtn = document.getElementById('showNavBtn');
    
    if (toggleNavBtn && showNavBtn) {
        toggleNavBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // İnce ayarlar menüsüne tıklama yayılmasını engelle
            const topSettings = document.getElementById('topSettings');
            const advancedSettings = document.getElementById('advancedSettings');
            
            // Gizle
            topSettings.style.display = 'none';
            if (advancedSettings) {
                advancedSettings.style.display = 'none';
            }
            toggleNavBtn.style.display = 'none';
            showNavBtn.style.display = 'block';
        });
        
        showNavBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const topSettings = document.getElementById('topSettings');
            
            // Göster
            topSettings.style.display = 'block';
            showNavBtn.style.display = 'none';
            toggleNavBtn.style.display = 'inline-block';
        });
    }
    
    // Butonlar
    startBtn.addEventListener('click', startFlowerTransformation);
    saveBtn.addEventListener('click', saveSite);
    shareBtn.addEventListener('click', shareSite);
    
    // Video indirme butonları
    const downloadPixelVideoBtn = document.getElementById('downloadPixelVideoBtn');
    const downloadFlowerVideoBtn = document.getElementById('downloadFlowerVideoBtn');
    
    if (downloadPixelVideoBtn) {
        downloadPixelVideoBtn.addEventListener('click', () => downloadVideo('pixel'));
    }
    if (downloadFlowerVideoBtn) {
        downloadFlowerVideoBtn.addEventListener('click', () => downloadVideo('flower'));
    }
}

function handleFileSelect(file) {
    if (!file.type.startsWith('video/')) {
        alert('Lütfen bir video dosyası seçin!');
        return;
    }
    
    const url = URL.createObjectURL(file);
    videoElement.src = url;
    videoElement.style.display = 'block';
    videoPreviewSection.style.display = 'block';
    
    // Video yüklendiğinde pixel art'a dönüştür
    videoElement.addEventListener('loadedmetadata', () => {
        originalVideoWidth = videoElement.videoWidth;
        originalVideoHeight = videoElement.videoHeight;
        uploadVideo(file);
    });
}

function uploadVideo(file) {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('pixel_size', pixelSize);
    // max_frames 0 ise tüm frame'leri işle
    formData.append('max_frames', maxFrames > 0 ? maxFrames : 0);
    // fps 0 ise orijinal FPS kullan
    formData.append('fps', videoFps > 0 ? videoFps : 0);
    
    progressSection.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Video işleniyor...';
    
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            progressFill.style.width = '100%';
            progressText.textContent = 'Pixel art dönüştürme tamamlandı!';
            loadPixelData(data.filename);
        } else {
            alert('Hata: ' + data.error);
            progressSection.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Hata:', error);
        alert('Bir hata oluştu: ' + error.message);
        progressSection.style.display = 'none';
    });
}

function loadPixelData(filename) {
    fetch(`/outputs/${filename}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Content-Type kontrolü
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Yanıt JSON formatında değil');
            }
            return response.text(); // Önce text olarak al
        })
        .then(text => {
            if (!text || text.trim() === '') {
                throw new Error('Boş yanıt alındı');
            }
            try {
                const data = JSON.parse(text);
                pixelData = data;
                if (!pixelData.frames || pixelData.frames.length === 0) {
                    throw new Error('Pixel verisi geçersiz: frames yok');
                }
                startPixelTransition();
            } catch (parseError) {
                console.error('JSON parse hatası:', parseError);
                console.error('Yanıt içeriği:', text.substring(0, 200));
                throw new Error('JSON parse hatası: ' + parseError.message);
            }
        })
        .catch(error => {
            console.error('Hata:', error);
            alert('Pixel verisi yüklenemedi: ' + error.message);
            // pixelData'yı null yap ki tekrar deneme yapılabilsin
            pixelData = null;
        });
}

function startPixelTransition() {
    if (!pixelData || pixelData.frames.length === 0) return;
    
    isTransitioning = true;
    transitionProgress = 0;
    const totalFrames = Math.min(pixelData.frames.length, 10); // Maksimum 10 frame (performans)
    let currentFrameIndex = 0;
    
    // Video'yu pixel art'a yavaş yavaş dönüştür (requestAnimationFrame ile)
    function animate() {
        if (currentFrameIndex >= totalFrames) {
            isTransitioning = false;
            progressText.textContent = 'Pixel art dönüşümü tamamlandı! START butonuna tıklayın.';
            // Animasyonu başlat
            startPixelArtAnimation();
            return;
        }
        
        drawPixelFrame(pixelData.frames[currentFrameIndex]);
        transitionProgress = (currentFrameIndex + 1) / totalFrames;
        progressFill.style.width = (transitionProgress * 100) + '%';
        progressText.textContent = `Pixel art'a dönüştürülüyor... ${currentFrameIndex + 1}/${totalFrames}`;
        
        currentFrameIndex++;
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

function startPixelArtAnimation() {
    if (!pixelData || !pixelCanvas) return;
    
    isPixelArtPlaying = true;
    let currentFrameIndex = 0;
    const totalFrames = pixelData.frames.length;
    const fps = pixelData.fps || 10;
    const frameDelay = 1000 / fps;
    
    function animate() {
        if (!isPixelArtPlaying) return;
        
        drawPixelFrame(pixelData.frames[currentFrameIndex]);
        currentFrameIndex = (currentFrameIndex + 1) % totalFrames;
        
        pixelArtAnimation = setTimeout(animate, frameDelay);
    }
    
    animate();
}

function stopPixelArtAnimation() {
    isPixelArtPlaying = false;
    if (pixelArtAnimation) {
        clearTimeout(pixelArtAnimation);
        pixelArtAnimation = null;
    }
}

function drawPixelFrame(frameData) {
    if (!pixelCanvas) return;
    
    const ctx = pixelCanvas.getContext('2d');
    const width = frameData.width;
    const height = frameData.height;
    const pixels = frameData.pixels;
    
    // Canvas boyutunu ayarla
    pixelCanvas.width = width * pixelSize;
    pixelCanvas.height = height * pixelSize;
    
    // ImageData kullanarak daha hızlı rendering
    const imageData = ctx.createImageData(width * pixelSize, height * pixelSize);
    const data = imageData.data;
    
    // Pixel'leri çiz
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const color = pixels[y][x];
            const r = color[0];
            const g = color[1];
            const b = color[2];
            
            // Her pixel için pixelSize x pixelSize blok çiz
            for (let py = 0; py < pixelSize; py++) {
                for (let px = 0; px < pixelSize; px++) {
                    const idx = ((y * pixelSize + py) * width * pixelSize + (x * pixelSize + px)) * 4;
                    data[idx] = r;
                    data[idx + 1] = g;
                    data[idx + 2] = b;
                    data[idx + 3] = 255;
                }
            }
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function startFlowerTransformation() {
    if (!pixelData) {
        alert('Önce bir video yükleyin!');
        return;
    }
    
    if (!pixelData.frames || pixelData.frames.length === 0) {
        alert('Video işleniyor, lütfen bekleyin...');
        return;
    }
    
    // Pixel art animasyonunu durdur
    stopPixelArtAnimation();
    
    // Loading göster
    progressSection.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Çiçekler oluşturuluyor...';
    
    // Tüm siteyi gizle, sadece çiçekleri göster
    uploadSection.style.display = 'none';
    videoPreviewSection.style.display = 'none';
    flowerDisplaySection.style.display = 'flex';
    
    // Scroll'u en üste al
    window.scrollTo(0, 0);
    
    // Tüm frame'lerden çiçekler oluştur ve animasyonu başlat
    setTimeout(() => {
        startFlowerAnimation();
        progressFill.style.width = '100%';
        progressText.textContent = 'Çiçekler hazır!';
        setTimeout(() => {
            progressSection.style.display = 'none';
        }, 500);
    }, 100);
}

function startFlowerAnimation() {
    if (!pixelData || !flowerCanvas) return;
    
    isFlowerPlaying = true;
    let currentFrameIndex = 0;
    const totalFrames = pixelData.frames.length;
    const fps = pixelData.fps || videoFps || 10; // Orijinal FPS
    const frameDelay = 1000 / fps;
    let lastFrameTime = Date.now();
    
    function animate() {
        if (!isFlowerPlaying) return;
        
        const now = Date.now();
        // Throttle: Minimum 8ms (120 FPS max) bekle - daha akıcı
        if (now - lastFrameTime >= Math.max(8, frameDelay)) {
            // Tüm frame'leri sırayla işle
            updateFlowersForFrame(currentFrameIndex);
            currentFrameIndex = (currentFrameIndex + 1) % totalFrames;
            lastFrameTime = now;
        }
        
        flowerAnimation = requestAnimationFrame(animate);
    }
    
    animate();
}

function stopFlowerAnimation() {
    isFlowerPlaying = false;
    if (flowerAnimation) {
        cancelAnimationFrame(flowerAnimation);
        flowerAnimation = null;
    }
}

let updateFlowersTimeout = null;

function updateFlowers() {
    if (!pixelData || !flowerCanvas) {
        console.warn('updateFlowers: pixelData veya flowerCanvas yok');
        return;
    }
    updateFlowersForFrame(0);
}

function updateFlowersForFrame(frameIndex) {
    if (!pixelData || !flowerCanvas) {
        console.warn('updateFlowersForFrame: pixelData veya flowerCanvas yok');
        return;
    }
    
    if (!pixelData.frames || pixelData.frames.length === 0) {
        console.warn('updateFlowersForFrame: frames yok');
        return;
    }
    
    const frameData = pixelData.frames[frameIndex] || pixelData.frames[0];
    if (!frameData) {
        console.warn('updateFlowersForFrame: frameData yok');
        return;
    }
    
    const flower = PIXEL_FLOWERS[currentFlowerType];
    if (!flower) {
        console.warn('updateFlowersForFrame: flower yok, currentFlowerType:', currentFlowerType);
        return;
    }
    
    // ASCII art modu kontrolü
    if (flower.isAscii) {
        try {
            drawAsciiArt(frameData, flower);
        } catch (error) {
            console.error('drawAsciiArt hatası:', error);
            // Hata durumunda normal çiçek çizimine geç
        }
        return;
    }
    
    const baseFlowerSize = flower.size;
    const scaledFlowerSize = baseFlowerSize * flowerScale;
    const pixels = frameData.pixels;
    const width = frameData.width;
    const height = frameData.height;
    
    // Orijinal video boyutunu kullan
    const videoWidth = originalVideoWidth || width * pixelSize;
    const videoHeight = originalVideoHeight || height * pixelSize;
    
    // Ekrana sığacak şekilde ölçekle (aspect ratio koru)
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.8;
    const aspectRatio = videoWidth / videoHeight;
    
    let canvasWidth = videoWidth;
    let canvasHeight = videoHeight;
    
    if (canvasWidth > maxWidth) {
        canvasWidth = maxWidth;
        canvasHeight = canvasWidth / aspectRatio;
    }
    if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = canvasHeight * aspectRatio;
    }
    
    // Canvas boyutunu ayarla
    flowerCanvas.width = videoWidth;
    flowerCanvas.height = videoHeight;
    
    const ctx = flowerCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    
    // Çiçeklerin video boyutuna göre yerleşimi
    const flowersPerRow = Math.ceil(videoWidth / scaledFlowerSize);
    const flowersPerCol = Math.ceil(videoHeight / scaledFlowerSize);
    const scaleX = width / flowersPerRow;
    const scaleY = height / flowersPerCol;
    
    // Çiçekleri çiz (yoğunluk ayarına göre) - Optimize edilmiş rendering
    let flowerCount = 0;
    const totalPossibleFlowers = flowersPerRow * flowersPerCol;
    // Yoğunluk 3'e kadar çıkabilir, bu yüzden maksimum çiçek sayısını artır
    const maxFlowers = Math.min(3000, Math.floor(totalPossibleFlowers * currentDensity)); // Yoğunluk artırıldı
    
    // Yoğunluk ayarına göre çiçekleri seyrek veya sık çiz
    // Yoğunluk 1'den büyükse step=1 (tüm çiçekleri çiz), küçükse seyrelt
    const step = currentDensity >= 1 ? 1 : Math.max(1, Math.floor(1 / currentDensity));
    
    // Rastgelelik için önceden hesaplanmış seed
    const randomSeed = frameIndex % 100;
    
    // Çiçekleri çiz (optimize edilmiş - doğrudan çiz)
    for (let screenY = 0; screenY < flowersPerCol && flowerCount < maxFlowers; screenY += step) {
        for (let screenX = 0; screenX < flowersPerRow && flowerCount < maxFlowers; screenX += step) {
            const pixelX = Math.floor(screenX * scaleX);
            const pixelY = Math.floor(screenY * scaleY);
            
            if (pixelY < height && pixelX < width) {
                // Yoğunluk >= 1 ise her zaman çiz, < 1 ise rastgele seç
                if (currentDensity < 1) {
                    // Deterministik rastgelelik (performans için)
                    const hash = (pixelX * 31 + pixelY * 17 + randomSeed) % 100;
                    if (hash >= currentDensity * 100) continue;
                }
                
                const pixelColor = pixels[pixelY][pixelX];
                const drawX = screenX * scaledFlowerSize;
                const drawY = screenY * scaledFlowerSize;
                drawFlowerScaled(ctx, drawX, drawY, pixelColor, flower, scaledFlowerSize);
                flowerCount++;
            }
        }
    }
    
    // Canvas'ı ortala ve ekrana sığdır
    flowerCanvas.style.display = 'block';
    flowerCanvas.style.width = canvasWidth + 'px';
    flowerCanvas.style.height = canvasHeight + 'px';
    flowerCanvas.style.position = 'relative';
    flowerCanvas.style.margin = '0 auto';
    flowerCanvas.style.zIndex = '1';
    flowerCanvas.style.maxWidth = '100%';
    flowerCanvas.style.maxHeight = '70vh';
}

function drawAsciiArt(frameData, flower) {
    const pixels = frameData.pixels;
    const width = frameData.width;
    const height = frameData.height;
    const asciiChars = flower.chars || '@%#*+=-:. ';
    
    // Orijinal video boyutunu kullan
    const videoWidth = originalVideoWidth || width * pixelSize;
    const videoHeight = originalVideoHeight || height * pixelSize;
    
    // Ekrana sığacak şekilde ölçekle
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.8;
    const aspectRatio = videoWidth / videoHeight;
    
    let canvasWidth = videoWidth;
    let canvasHeight = videoHeight;
    
    if (canvasWidth > maxWidth) {
        canvasWidth = maxWidth;
        canvasHeight = canvasWidth / aspectRatio;
    }
    if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = canvasHeight * aspectRatio;
    }
    
    // ASCII karakter boyutu (font size'a göre)
    const charSize = Math.max(4, Math.floor(canvasWidth / width));
    const charsPerRow = Math.floor(canvasWidth / charSize);
    const charsPerCol = Math.floor(canvasHeight / charSize);
    
    // Canvas boyutunu ayarla
    flowerCanvas.width = canvasWidth;
    flowerCanvas.height = canvasHeight;
    
    const ctx = flowerCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Font ayarları
    ctx.font = `${charSize}px 'Courier New', monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    // ASCII karakterleri çiz
    const scaleX = width / charsPerRow;
    const scaleY = height / charsPerCol;
    
    for (let charY = 0; charY < charsPerCol; charY++) {
        for (let charX = 0; charX < charsPerRow; charX++) {
            const pixelX = Math.floor(charX * scaleX);
            const pixelY = Math.floor(charY * scaleY);
            
            if (pixelY < height && pixelX < width) {
                const pixelColor = pixels[pixelY][pixelX];
                
                // Gri tonlama hesapla
                const gray = Math.floor(pixelColor[0] * 0.299 + pixelColor[1] * 0.587 + pixelColor[2] * 0.114);
                
                // ASCII karakter seç
                const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
                const char = asciiChars[charIndex];
                
                // Renkli çiz
                ctx.fillStyle = `rgb(${pixelColor[0]}, ${pixelColor[1]}, ${pixelColor[2]})`;
                ctx.fillText(char, charX * charSize, charY * charSize);
            }
        }
    }
    
    // Canvas'ı ortala ve ekrana sığdır
    flowerCanvas.style.display = 'block';
    flowerCanvas.style.width = canvasWidth + 'px';
    flowerCanvas.style.height = canvasHeight + 'px';
    flowerCanvas.style.position = 'relative';
    flowerCanvas.style.margin = '0 auto';
    flowerCanvas.style.zIndex = '1';
    flowerCanvas.style.maxWidth = '100%';
    flowerCanvas.style.maxHeight = '70vh';
}

function drawFlowerScaled(ctx, x, y, pixelColor, flower, scaledSize) {
    const pixels = flower.pixels;
    const colors = flower.colors;
    const baseSize = flower.size;
    const scale = scaledSize / baseSize;
    
    // Renkleri pixel color'a göre ayarla
    const adjustedColors = colors.map((color, i) => {
        if (i === 0) return color; // Siyah kenar
        const mixRatio = 0.7; // Daha fazla video rengi
        return [
            Math.floor(color[0] * (1 - mixRatio) + pixelColor[0] * mixRatio),
            Math.floor(color[1] * (1 - mixRatio) + pixelColor[1] * mixRatio),
            Math.floor(color[2] * (1 - mixRatio) + pixelColor[2] * mixRatio)
        ];
    });
    
    // Çiçeği ölçeklenmiş boyutta çiz
    for (let fy = 0; fy < baseSize; fy++) {
        for (let fx = 0; fx < baseSize; fx++) {
            const colorIndex = pixels[fy][fx];
            if (colorIndex === 0) continue; // Siyah kenarları atla (daha hızlı)
            
            const color = adjustedColors[colorIndex];
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(
                Math.floor(x + fx * scale),
                Math.floor(y + fy * scale),
                Math.ceil(scale),
                Math.ceil(scale)
            );
        }
    }
}

function drawFlower(ctx, x, y, pixelColor, flower) {
    const pixels = flower.pixels;
    const colors = flower.colors;
    const size = flower.size;
    
    // Renkleri pixel color'a göre ayarla
    const adjustedColors = colors.map((color, i) => {
        if (i === 0) return color; // Siyah kenar
        const mixRatio = 0.6;
        return [
            Math.floor(color[0] * (1 - mixRatio) + pixelColor[0] * mixRatio),
            Math.floor(color[1] * (1 - mixRatio) + pixelColor[1] * mixRatio),
            Math.floor(color[2] * (1 - mixRatio) + pixelColor[2] * mixRatio)
        ];
    });
    
    // Çiçeği çiz
    for (let fy = 0; fy < size; fy++) {
        for (let fx = 0; fx < size; fx++) {
            const colorIndex = pixels[fy][fx];
            const color = adjustedColors[colorIndex];
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(x + fx, y + fy, 1, 1);
        }
    }
}

function applyTheme(theme) {
    document.body.className = `theme-${theme}`;
    const themeColors = THEMES[theme];
    if (themeColors) {
        document.documentElement.style.setProperty('--bg-gradient-start', themeColors.start);
        document.documentElement.style.setProperty('--bg-gradient-end', themeColors.end);
    }
}

function saveSite() {
    // Tüm içeriği tek HTML dosyası olarak kaydet
    const htmlContent = generateStandaloneHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pixel_art_message.html';
    a.click();
    URL.revokeObjectURL(url);
}

function generateStandaloneHTML() {
    const message = messageText.value || 'Sevdiğinize özel bir mesaj...';
    const currentThemeColors = THEMES[currentTheme];
    
    // Tüm frame'leri base64'e çevir
    const pixelArtFrames = [];
    const flowerFrames = [];
    
    if (pixelData && pixelData.frames) {
        // Pixel art frame'leri
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        pixelData.frames.forEach((frameData, index) => {
            // Pixel art frame
            const width = frameData.width;
            const height = frameData.height;
            tempCanvas.width = width * pixelSize;
            tempCanvas.height = height * pixelSize;
            
            const imageData = tempCtx.createImageData(width * pixelSize, height * pixelSize);
            const data = imageData.data;
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const color = frameData.pixels[y][x];
                    for (let py = 0; py < pixelSize; py++) {
                        for (let px = 0; px < pixelSize; px++) {
                            const idx = ((y * pixelSize + py) * width * pixelSize + (x * pixelSize + px)) * 4;
                            data[idx] = color[0];
                            data[idx + 1] = color[1];
                            data[idx + 2] = color[2];
                            data[idx + 3] = 255;
                        }
                    }
                }
            }
            tempCtx.putImageData(imageData, 0, 0);
            pixelArtFrames.push(tempCanvas.toDataURL('image/png'));
            
            // Çiçek/ASCII frame
            const screenWidth = 800;
            const screenHeight = 600;
            tempCanvas.width = screenWidth;
            tempCanvas.height = screenHeight;
            tempCtx.clearRect(0, 0, screenWidth, screenHeight);
            tempCtx.imageSmoothingEnabled = false;
            
            const flower = PIXEL_FLOWERS[currentFlowerType];
            
            // ASCII art modu kontrolü
            if (flower.isAscii) {
                drawAsciiArtToCanvas(tempCtx, frameData, screenWidth, screenHeight, flower);
            } else {
                const scaledFlowerSize = flower.size * flowerScale;
                const flowersPerRow = Math.ceil(screenWidth / scaledFlowerSize);
                const flowersPerCol = Math.ceil(screenHeight / scaledFlowerSize);
                const scaleX = width / flowersPerRow;
                const scaleY = height / flowersPerCol;
                
                for (let screenY = 0; screenY < flowersPerCol; screenY++) {
                    for (let screenX = 0; screenX < flowersPerRow; screenX++) {
                        const pixelX = Math.floor(screenX * scaleX);
                        const pixelY = Math.floor(screenY * scaleY);
                        if (pixelY < height && pixelX < width) {
                            const pixelColor = frameData.pixels[pixelY][pixelX];
                            const drawX = screenX * scaledFlowerSize;
                            const drawY = screenY * scaledFlowerSize;
                            drawFlowerScaled(tempCtx, drawX, drawY, pixelColor, flower, scaledFlowerSize);
                        }
                    }
                }
            }
            flowerFrames.push(tempCanvas.toDataURL('image/png'));
        });
    }
    
    const fps = pixelData ? (pixelData.fps || 10) : 10;
    const frameDelay = 1000 / fps;
    
    return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pixel Art Mesaj</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, ${currentThemeColors.start} 0%, ${currentThemeColors.end} 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-x: hidden;
        }
        .message-container {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            max-width: 90%;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            margin-bottom: 30px;
            z-index: 10;
            position: relative;
        }
        .message-text {
            font-size: 1.5rem;
            color: white;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            line-height: 1.6;
        }
        .video-section {
            margin: 20px 0;
            text-align: center;
        }
        .video-title {
            color: white;
            font-size: 1.2rem;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        .animated-canvas {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        }
    </style>
</head>
<body>
    <div class="message-container">
        <div class="message-text">${message.replace(/\n/g, '<br>')}</div>
    </div>
    
    <div class="video-section">
        <div class="video-title">🎨 Pixel Art Video</div>
        <canvas id="pixelArtCanvas" class="animated-canvas" width="800" height="600"></canvas>
    </div>
    
    <div class="video-section">
        <div class="video-title">🌸 Çiçekli Video</div>
        <canvas id="flowerCanvas" class="animated-canvas" width="800" height="600"></canvas>
    </div>
    
    <script>
        const pixelArtFrames = ${JSON.stringify(pixelArtFrames)};
        const flowerFrames = ${JSON.stringify(flowerFrames)};
        const fps = ${fps};
        const frameDelay = ${frameDelay};
        
        let pixelArtIndex = 0;
        let flowerIndex = 0;
        
        const pixelArtCanvas = document.getElementById('pixelArtCanvas');
        const flowerCanvas = document.getElementById('flowerCanvas');
        const pixelArtCtx = pixelArtCanvas.getContext('2d');
        const flowerCtx = flowerCanvas.getContext('2d');
        
        function animatePixelArt() {
            if (pixelArtFrames.length > 0) {
                const img = new Image();
                img.onload = function() {
                    pixelArtCanvas.width = img.width;
                    pixelArtCanvas.height = img.height;
                    pixelArtCtx.drawImage(img, 0, 0);
                };
                img.src = pixelArtFrames[pixelArtIndex];
                pixelArtIndex = (pixelArtIndex + 1) % pixelArtFrames.length;
                setTimeout(animatePixelArt, frameDelay);
            }
        }
        
        function animateFlowers() {
            if (flowerFrames.length > 0) {
                const img = new Image();
                img.onload = function() {
                    flowerCanvas.width = img.width;
                    flowerCanvas.height = img.height;
                    flowerCtx.drawImage(img, 0, 0);
                };
                img.src = flowerFrames[flowerIndex];
                flowerIndex = (flowerIndex + 1) % flowerFrames.length;
                setTimeout(animateFlowers, frameDelay);
            }
        }
        
        animatePixelArt();
        animateFlowers();
    </script>
</body>
</html>`;
}

function shareSite() {
    if (navigator.share) {
        const message = messageText.value || 'Sevdiğinize özel bir pixel art mesaj!';
        navigator.share({
            title: 'Pixel Art Mesaj',
            text: message,
            url: window.location.href
        });
    } else {
        // Fallback: kopyala
        const htmlContent = generateStandaloneHTML();
        navigator.clipboard.writeText(htmlContent).then(() => {
            alert('HTML içeriği panoya kopyalandı!');
        });
    }
}

async function downloadVideo(type) {
    if (!pixelData || pixelData.frames.length === 0) {
        alert('Önce bir video yükleyin!');
        return;
    }
    
    progressSection.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = `${type === 'pixel' ? 'Pixel art' : 'Çiçekli'} video oluşturuluyor...`;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Video boyutunu orijinal boyuta göre ayarla
    const width = originalVideoWidth || 800;
    const height = originalVideoHeight || 600;
    canvas.width = width;
    canvas.height = height;
    
    // TÜM frame'leri işle
    const frames = maxFrames > 0 ? pixelData.frames.slice(0, maxFrames) : pixelData.frames;
    const fps = videoFps || 10;
    
    // MediaRecorder API kullan
    const stream = canvas.captureStream(fps);
    const mimeType = 'video/webm;codecs=vp9';
    let mediaRecorder;
    
    try {
        mediaRecorder = new MediaRecorder(stream, { mimeType });
    } catch (e) {
        // Fallback
        mediaRecorder = new MediaRecorder(stream);
    }
    
    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type === 'pixel' ? 'pixel_art' : 'flower'}_video.webm`;
        a.click();
        URL.revokeObjectURL(url);
        progressSection.style.display = 'none';
    };
    
    mediaRecorder.start();
    
    // Tüm frame'leri sırayla render et
    let frameIndex = 0;
    const frameDelay = 1000 / fps;
    
    function renderFrame() {
        if (frameIndex >= frames.length) {
            setTimeout(() => {
                mediaRecorder.stop();
                stream.getTracks().forEach(track => track.stop());
            }, 100);
            return;
        }
        
        const frameData = frames[frameIndex];
        ctx.clearRect(0, 0, width, height);
        
        if (type === 'pixel') {
            drawPixelFrameToCanvas(ctx, frameData, width, height);
        } else {
            drawFlowerFrameToCanvas(ctx, frameData, width, height);
        }
        
        frameIndex++;
        progressFill.style.width = ((frameIndex / frames.length) * 100) + '%';
        progressText.textContent = `${type === 'pixel' ? 'Pixel art' : 'Çiçekli'} video oluşturuluyor... ${frameIndex}/${frames.length}`;
        
        setTimeout(renderFrame, frameDelay);
    }
    
    renderFrame();
}

function drawPixelFrameToCanvas(ctx, frameData, targetWidth, targetHeight) {
    const pixels = frameData.pixels;
    const frameWidth = frameData.width;
    const frameHeight = frameData.height;
    
    const scaleX = targetWidth / frameWidth;
    const scaleY = targetHeight / frameHeight;
    
    for (let y = 0; y < frameHeight; y++) {
        for (let x = 0; x < frameWidth; x++) {
            const color = pixels[y][x];
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(x * scaleX, y * scaleY, scaleX, scaleY);
        }
    }
}

function drawFlowerFrameToCanvas(ctx, frameData, targetWidth, targetHeight) {
    const flower = PIXEL_FLOWERS[currentFlowerType];
    
    // ASCII art modu kontrolü
    if (flower.isAscii) {
        drawAsciiArtToCanvas(ctx, frameData, targetWidth, targetHeight, flower);
        return;
    }
    
    const scaledFlowerSize = flower.size * flowerScale;
    const pixels = frameData.pixels;
    const frameWidth = frameData.width;
    const frameHeight = frameData.height;
    
    // Video boyutuna göre çiçek yerleşimi
    const flowersPerRow = Math.ceil(targetWidth / scaledFlowerSize);
    const flowersPerCol = Math.ceil(targetHeight / scaledFlowerSize);
    const scaleX = frameWidth / flowersPerRow;
    const scaleY = frameHeight / flowersPerCol;
    
    ctx.imageSmoothingEnabled = false;
    
    // Tüm çiçekleri çiz
    for (let screenY = 0; screenY < flowersPerCol; screenY++) {
        for (let screenX = 0; screenX < flowersPerRow; screenX++) {
            const pixelX = Math.floor(screenX * scaleX);
            const pixelY = Math.floor(screenY * scaleY);
            
            if (pixelY < frameHeight && pixelX < frameWidth) {
                const pixelColor = pixels[pixelY][pixelX];
                const drawX = screenX * scaledFlowerSize;
                const drawY = screenY * scaledFlowerSize;
                drawFlowerScaled(ctx, drawX, drawY, pixelColor, flower, scaledFlowerSize);
            }
        }
    }
}

function drawAsciiArtToCanvas(ctx, frameData, targetWidth, targetHeight, flower) {
    const pixels = frameData.pixels;
    const width = frameData.width;
    const height = frameData.height;
    const asciiChars = flower.chars || '@%#*+=-:. ';
    
    // ASCII karakter boyutu
    const charSize = Math.max(6, Math.floor(targetWidth / width));
    const charsPerRow = Math.floor(targetWidth / charSize);
    const charsPerCol = Math.floor(targetHeight / charSize);
    
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    
    // Font ayarları
    ctx.font = `${charSize}px 'Courier New', monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    // ASCII karakterleri çiz
    const scaleX = width / charsPerRow;
    const scaleY = height / charsPerCol;
    
    for (let charY = 0; charY < charsPerCol; charY++) {
        for (let charX = 0; charX < charsPerRow; charX++) {
            const pixelX = Math.floor(charX * scaleX);
            const pixelY = Math.floor(charY * scaleY);
            
            if (pixelY < height && pixelX < width) {
                const pixelColor = pixels[pixelY][pixelX];
                
                // Gri tonlama hesapla
                const gray = Math.floor(pixelColor[0] * 0.299 + pixelColor[1] * 0.587 + pixelColor[2] * 0.114);
                
                // ASCII karakter seç
                const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
                const char = asciiChars[charIndex];
                
                // Renkli çiz
                ctx.fillStyle = `rgb(${pixelColor[0]}, ${pixelColor[1]}, ${pixelColor[2]})`;
                ctx.fillText(char, charX * charSize, charY * charSize);
            }
        }
    }
}
