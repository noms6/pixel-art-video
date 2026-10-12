// Şekil, ASCII karakter seti, tema ve arka plan efekti tanımları (tek kaynak).
// Şekil pikselleri: 0 = boş, 1..n = colors[n]. Renkler çizimde video rengiyle karıştırılır.

const K = [0, 0, 0]; // 0. renk kullanılmaz (boş)

export const SHAPES = {
    rose: { emoji: '🌹', group: 'flowers', size: 8, colors: [K, [139, 0, 0], [220, 20, 60], [255, 105, 180], [255, 192, 203]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,4,4,3,2,1],
        [1,2,3,4,4,3,2,1],[0,1,2,3,3,2,1,0],[0,0,1,2,2,1,0,0],[0,0,0,1,1,0,0,0]] },
    tulip: { emoji: '🌷', group: 'flowers', size: 8, colors: [K, [34, 139, 34], [255, 20, 147], [255, 105, 180], [0, 128, 0]], pixels: [
        [0,0,1,1,1,1,0,0],[0,1,2,2,2,2,1,0],[1,2,3,3,3,3,2,1],[1,2,3,3,3,3,2,1],
        [0,1,2,2,2,2,1,0],[0,0,1,1,1,1,0,0],[0,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,0]] },
    sunflower: { emoji: '🌻', group: 'flowers', size: 8, colors: [K, [139, 69, 19], [184, 134, 11], [255, 215, 0], [255, 255, 0], [255, 140, 0]], pixels: [
        [0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,4,4,3,2,1],[2,3,4,5,5,4,3,2],
        [2,3,4,5,5,4,3,2],[1,2,3,4,4,3,2,1],[0,1,2,3,3,2,1,0],[0,0,1,2,2,1,0,0]] },
    cherry_blossom: { emoji: '🌸', group: 'flowers', size: 8, colors: [K, [139, 0, 0], [255, 182, 193], [255, 192, 203]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,2,2,3,2,1],
        [1,2,3,2,2,3,2,1],[0,1,2,3,3,2,1,0],[0,0,1,2,2,1,0,0],[0,0,0,1,1,0,0,0]] },
    daisy: { emoji: '🌼', group: 'flowers', size: 8, colors: [K, [255, 255, 255], [255, 220, 0], [255, 170, 0]], pixels: [
        [0,0,1,0,0,1,0,0],[0,0,1,1,1,1,0,0],[1,1,1,2,2,1,1,1],[0,1,2,3,3,2,1,0],
        [0,1,2,3,3,2,1,0],[1,1,1,2,2,1,1,1],[0,0,1,1,1,1,0,0],[0,0,1,0,0,1,0,0]] },
    lily: { emoji: '💐', group: 'flowers', size: 8, colors: [K, [255, 255, 255], [255, 250, 250], [255, 240, 240], [255, 230, 230], [34, 139, 34]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,4,4,3,2,1],
        [0,1,2,3,3,2,1,0],[0,0,1,5,5,1,0,0],[0,0,0,5,5,0,0,0],[0,0,0,5,5,0,0,0]] },
    orchid: { emoji: '🦋', group: 'flowers', size: 8, colors: [K, [138, 43, 226], [186, 85, 211], [221, 160, 221], [0, 128, 0]], pixels: [
        [0,1,1,0,0,1,1,0],[1,2,2,1,1,2,2,1],[1,2,3,2,2,3,2,1],[0,1,2,3,3,2,1,0],
        [0,0,1,2,2,1,0,0],[0,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,0]] },
    lavender: { emoji: '🌿', group: 'flowers', size: 8, colors: [K, [230, 230, 250], [216, 191, 216], [186, 85, 211], [0, 100, 0]], pixels: [
        [0,0,1,1,1,1,0,0],[0,1,2,2,2,2,1,0],[1,2,3,3,3,3,2,1],[0,1,2,2,2,2,1,0],
        [0,0,1,1,1,1,0,0],[0,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,0]] },
    jasmine: { emoji: '🌺', group: 'flowers', size: 8, colors: [K, [255, 255, 255], [255, 250, 240], [255, 245, 230], [34, 139, 34]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,2,2,3,2,1],
        [1,2,3,2,2,3,2,1],[0,1,2,3,3,2,1,0],[0,0,1,4,4,1,0,0],[0,0,0,4,4,0,0,0]] },
    lotus: { emoji: '🪷', group: 'flowers', size: 8, colors: [K, [255, 105, 180], [255, 182, 193], [255, 240, 245], [34, 139, 34]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[1,0,1,2,2,1,0,1],[1,1,2,3,3,2,1,1],
        [0,1,2,3,3,2,1,0],[0,1,1,2,2,1,1,0],[0,0,1,1,1,1,0,0],[0,4,4,4,4,4,4,0]] },

    heart: { emoji: '❤️', group: 'shapes', size: 8, colors: [K, [139, 0, 0], [220, 20, 60], [255, 105, 180]], pixels: [
        [0,1,1,0,0,1,1,0],[1,2,2,1,1,2,2,1],[1,2,3,2,2,3,2,1],[1,2,2,3,3,2,2,1],
        [0,1,2,2,2,2,1,0],[0,0,1,2,2,1,0,0],[0,0,0,1,1,0,0,0],[0,0,0,0,0,0,0,0]] },
    star: { emoji: '⭐', group: 'shapes', size: 8, colors: [K, [184, 134, 11], [255, 215, 0], [255, 255, 255]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,0,2,2,0,0,0],[1,1,2,2,2,2,1,1],[0,1,2,3,3,2,1,0],
        [0,0,2,2,2,2,0,0],[0,1,2,1,1,2,1,0],[0,2,1,0,0,1,2,0],[1,1,0,0,0,0,1,1]] },
    diamond: { emoji: '💎', group: 'shapes', size: 8, colors: [K, [176, 196, 222], [135, 206, 250], [0, 191, 255], [255, 255, 255]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,4,4,3,2,1],
        [0,1,2,3,3,2,1,0],[0,0,1,2,2,1,0,0],[0,0,0,1,1,0,0,0],[0,0,0,0,0,0,0,0]] },
    circle: { emoji: '⭕', group: 'shapes', size: 8, colors: [K, [100, 100, 100], [150, 150, 150], [200, 200, 200]], pixels: [
        [0,0,1,1,1,1,0,0],[0,1,2,2,2,2,1,0],[1,2,3,3,3,3,2,1],[1,2,3,3,3,3,2,1],
        [1,2,3,3,3,3,2,1],[1,2,3,3,3,3,2,1],[0,1,2,2,2,2,1,0],[0,0,1,1,1,1,0,0]] },
    square: { emoji: '⬛', group: 'shapes', size: 8, colors: [K, [50, 50, 50], [100, 100, 100], [150, 150, 150]], pixels: [
        [1,1,1,1,1,1,1,1],[1,2,2,2,2,2,2,1],[1,2,3,3,3,3,2,1],[1,2,3,3,3,3,2,1],
        [1,2,3,3,3,3,2,1],[1,2,3,3,3,3,2,1],[1,2,2,2,2,2,2,1],[1,1,1,1,1,1,1,1]] },
    triangle: { emoji: '🔺', group: 'shapes', size: 8, colors: [K, [90, 90, 90], [160, 160, 160], [230, 230, 230]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,0,1,2,2,1,0,0],
        [0,1,2,3,3,2,1,0],[0,1,2,3,3,2,1,0],[1,2,2,2,2,2,2,1],[1,1,1,1,1,1,1,1]] },
    sparkle: { emoji: '✨', group: 'shapes', size: 8, colors: [K, [200, 200, 200], [255, 255, 200], [255, 255, 255], [255, 255, 0]], pixels: [
        [0,0,0,1,1,0,0,0],[0,1,0,2,2,0,1,0],[0,0,2,3,3,2,0,0],[1,2,3,4,4,3,2,1],
        [1,2,3,4,4,3,2,1],[0,0,2,3,3,2,0,0],[0,1,0,2,2,0,1,0],[0,0,0,1,1,0,0,0]] },

    ascii_dot: { emoji: '🔸', group: 'pixel', size: 4, colors: [K, [100, 100, 100], [200, 200, 200]], pixels: [
        [0,1,1,0],[1,2,2,1],[1,2,2,1],[0,1,1,0]] },
    ascii_block: { emoji: '█', group: 'pixel', size: 4, colors: [K, [200, 200, 200]], pixels: [
        [1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]] },
    pixel_square: { emoji: '⬜', group: 'pixel', size: 6, colors: [K, [80, 80, 80], [160, 160, 160], [240, 240, 240]], pixels: [
        [1,1,1,1,1,1],[1,2,2,2,2,1],[1,2,3,3,2,1],[1,2,3,3,2,1],[1,2,2,2,2,1],[1,1,1,1,1,1]] },
    pixel_circle: { emoji: '●', group: 'pixel', size: 6, colors: [K, [80, 80, 80], [160, 160, 160], [240, 240, 240]], pixels: [
        [0,1,1,1,1,0],[1,2,2,2,2,1],[1,2,3,3,2,1],[1,2,3,3,2,1],[1,2,2,2,2,1],[0,1,1,1,1,0]] },
    pixel_diamond: { emoji: '◆', group: 'pixel', size: 6, colors: [K, [80, 80, 80], [160, 160, 160], [240, 240, 240]], pixels: [
        [0,0,1,1,0,0],[0,1,2,2,1,0],[1,2,3,3,2,1],[1,2,3,3,2,1],[0,1,2,2,1,0],[0,0,1,1,0,0]] },
    led: { emoji: '💡', group: 'pixel', size: 5, colors: [K, [255, 255, 255]], pixels: [
        [0,1,1,1,0],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,0]] },
};

// Görüntüleme modları: 'pixel' (düz), 'shape:<ad>', 'ascii:<set>', 'braille'
export const ASCII_SETS = {
    classic: { emoji: '@', chars: ' .:-=+*#%@' },
    dense: { emoji: '▓', chars: ' .:-=+*#%@░▒▓█' },
    blocks: { emoji: '░', chars: ' ░▒▓█' },
    detailed: { emoji: '$', chars: " .'`^\",:;Il!i><~+_-?][}{1)(|tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$" },
};

export const THEMES = {
    romantic: { emoji: '💕', start: '#ff9a9e', end: '#fecfef', primary: '#ff6b9d', secondary: '#c44569' },
    spring: { emoji: '🌸', start: '#a8edea', end: '#fed6e3', primary: '#ff9a9e', secondary: '#e07a8f' },
    sunset: { emoji: '🌅', start: '#ff9a56', end: '#ff6b6b', primary: '#ff6b6b', secondary: '#c0392b' },
    ocean: { emoji: '🌊', start: '#2193b0', end: '#6dd5ed', primary: '#1e6fa8', secondary: '#0b4f7c' },
    forest: { emoji: '🌲', start: '#134e5e', end: '#71b280', primary: '#11998e', secondary: '#0b6e4f' },
    purple: { emoji: '💜', start: '#667eea', end: '#764ba2', primary: '#8e44ad', secondary: '#5b2c83' },
    pink: { emoji: '🌸', start: '#f093fb', end: '#f5576c', primary: '#e84393', secondary: '#b0306a' },
    blue: { emoji: '💙', start: '#4facfe', end: '#00f2fe', primary: '#2980b9', secondary: '#1a5276' },
    green: { emoji: '💚', start: '#56ab2f', end: '#a8e063', primary: '#3d8b1f', secondary: '#2a6115' },
    orange: { emoji: '🧡', start: '#fa709a', end: '#fee140', primary: '#e67e22', secondary: '#b9561a' },
    red: { emoji: '❤️', start: '#ff6b6b', end: '#ee5a6f', primary: '#c0392b', secondary: '#8e2a20' },
    gold: { emoji: '✨', start: '#f6d365', end: '#fda085', primary: '#d4a017', secondary: '#a67c00' },
    lavender: { emoji: '💐', start: '#a8caba', end: '#5d4e75', primary: '#7d5ba6', secondary: '#4e3a6e' },
    rose: { emoji: '🌹', start: '#ffecd2', end: '#fcb69f', primary: '#e17055', secondary: '#b34d36' },
    sunset2: { emoji: '🌆', start: '#ff9a9e', end: '#fad0c4', primary: '#e66767', secondary: '#b33939' },
    aurora: { emoji: '🌌', start: '#00c9ff', end: '#92fe9d', primary: '#00a8cc', secondary: '#007a99' },
    neon: { emoji: '💡', start: '#f093fb', end: '#4facfe', primary: '#9b59b6', secondary: '#2e86de' },
    pastel: { emoji: '🎨', start: '#a1c4fd', end: '#c2e9fb', primary: '#6c8cd5', secondary: '#4a69bd' },
    dark: { emoji: '🌙', start: '#2c3e50', end: '#34495e', primary: '#5d6d7e', secondary: '#2e4053' },
    light: { emoji: '☀️', start: '#ffeaa7', end: '#fab1a0', primary: '#e17055', secondary: '#d35400' },
};

export const BACKGROUNDS = {
    none: { emoji: '❌' },
    flowers: { emoji: '🌸', cls: 'flower', count: 20, symbols: ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '💐'] },
    stars: { emoji: '⭐', cls: 'star', count: 30, symbols: ['⭐', '✨', '🌟', '💫'] },
    hearts: { emoji: '❤️', cls: 'heart', count: 18, symbols: ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞'] },
    leaves: { emoji: '🍃', cls: 'leaf', count: 25, symbols: ['🍃', '🌿', '🍀', '🌱'] },
    butterflies: { emoji: '🦋', cls: 'butterfly', count: 15, symbols: ['🦋'] },
    snowflakes: { emoji: '❄️', cls: 'snowflake', count: 40, symbols: ['❄️'] },
    sparkles: { emoji: '✨', cls: 'sparkle', count: 40, symbols: ['✨', '⭐', '💫'] },
    bubbles: { emoji: '🫧', cls: 'bubble', count: 20, symbols: ['🫧', '💭'] },
    cherry_blossoms: { emoji: '🌸', cls: 'cherry', count: 30, symbols: ['🌸'] },
    rose_petals: { emoji: '🌹', cls: 'petal', count: 30, symbols: ['🌹'] },
    fireflies: { emoji: '✨', cls: 'firefly', count: 20, symbols: ['✨', '⭐'] },
    raindrops: { emoji: '💧', cls: 'raindrop', count: 40, symbols: ['💧'] },
    confetti: { emoji: '🎊', cls: 'confetti', count: 30, symbols: ['🎊', '🎉'] },
    music_notes: { emoji: '🎵', cls: 'music', count: 18, symbols: ['🎵', '🎶'] },
};

// Stil seçeneği grupları; t() ile seçili dilde etiketlenir
export function modeOptions(t) {
    const shapes = (group) => Object.entries(SHAPES)
        .filter(([, s]) => s.group === group)
        .map(([id, s]) => [`shape:${id}`, `${s.emoji} ${t(`shape.${id}`)}`]);
    return [
        { label: t('mode.group_basic'), items: [['pixel', `🟪 ${t('mode.pixel')}`]] },
        { label: t('mode.group_flowers'), items: shapes('flowers') },
        { label: t('mode.group_shapes'), items: shapes('shapes') },
        { label: t('mode.group_pixel'), items: shapes('pixel') },
        {
            label: t('mode.group_ascii'),
            items: [
                ...Object.entries(ASCII_SETS).map(([id, a]) => [`ascii:${id}`, `${a.emoji} ${t(`ascii.${id}`)}`]),
                ['braille', `⣿ ${t('mode.braille')}`],
            ],
        },
    ];
}

// 'shape:rose' gibi bir mod değerinden renderer stilini üret
export function styleFor(mode, { scale, density, mix }) {
    if (mode.startsWith('shape:')) {
        return { mode: 'shape', shape: SHAPES[mode.slice(6)] || SHAPES.rose, scale, density, mix };
    }
    if (mode.startsWith('ascii:')) {
        const set = ASCII_SETS[mode.slice(6)] || ASCII_SETS.classic;
        return { mode: 'ascii', chars: set.chars, scale };
    }
    if (mode === 'braille') return { mode: 'braille', scale };
    return { mode: 'pixel' };
}
