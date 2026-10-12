// Şekil, ASCII karakter seti, tema ve arka plan efekti tanımları (tek kaynak).
// Şekil pikselleri: 0 = boş, 1..n = colors[n]. Renkler çizimde video rengiyle karıştırılır.

const K = [0, 0, 0]; // 0. renk kullanılmaz (boş)

export const SHAPES = {
    rose: { label: '🌹 Gül', group: 'Çiçekler', size: 8, colors: [K, [139, 0, 0], [220, 20, 60], [255, 105, 180], [255, 192, 203]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,4,4,3,2,1],
        [1,2,3,4,4,3,2,1],[0,1,2,3,3,2,1,0],[0,0,1,2,2,1,0,0],[0,0,0,1,1,0,0,0]] },
    tulip: { label: '🌷 Lale', group: 'Çiçekler', size: 8, colors: [K, [34, 139, 34], [255, 20, 147], [255, 105, 180], [0, 128, 0]], pixels: [
        [0,0,1,1,1,1,0,0],[0,1,2,2,2,2,1,0],[1,2,3,3,3,3,2,1],[1,2,3,3,3,3,2,1],
        [0,1,2,2,2,2,1,0],[0,0,1,1,1,1,0,0],[0,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,0]] },
    sunflower: { label: '🌻 Ayçiçeği', group: 'Çiçekler', size: 8, colors: [K, [139, 69, 19], [184, 134, 11], [255, 215, 0], [255, 255, 0], [255, 140, 0]], pixels: [
        [0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,4,4,3,2,1],[2,3,4,5,5,4,3,2],
        [2,3,4,5,5,4,3,2],[1,2,3,4,4,3,2,1],[0,1,2,3,3,2,1,0],[0,0,1,2,2,1,0,0]] },
    cherry_blossom: { label: '🌸 Kiraz Çiçeği', group: 'Çiçekler', size: 8, colors: [K, [139, 0, 0], [255, 182, 193], [255, 192, 203]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,2,2,3,2,1],
        [1,2,3,2,2,3,2,1],[0,1,2,3,3,2,1,0],[0,0,1,2,2,1,0,0],[0,0,0,1,1,0,0,0]] },
    daisy: { label: '🌼 Papatya', group: 'Çiçekler', size: 8, colors: [K, [255, 255, 255], [255, 220, 0], [255, 170, 0]], pixels: [
        [0,0,1,0,0,1,0,0],[0,0,1,1,1,1,0,0],[1,1,1,2,2,1,1,1],[0,1,2,3,3,2,1,0],
        [0,1,2,3,3,2,1,0],[1,1,1,2,2,1,1,1],[0,0,1,1,1,1,0,0],[0,0,1,0,0,1,0,0]] },
    lily: { label: '💐 Zambak', group: 'Çiçekler', size: 8, colors: [K, [255, 255, 255], [255, 250, 250], [255, 240, 240], [255, 230, 230], [34, 139, 34]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,4,4,3,2,1],
        [0,1,2,3,3,2,1,0],[0,0,1,5,5,1,0,0],[0,0,0,5,5,0,0,0],[0,0,0,5,5,0,0,0]] },
    orchid: { label: '🦋 Orkide', group: 'Çiçekler', size: 8, colors: [K, [138, 43, 226], [186, 85, 211], [221, 160, 221], [0, 128, 0]], pixels: [
        [0,1,1,0,0,1,1,0],[1,2,2,1,1,2,2,1],[1,2,3,2,2,3,2,1],[0,1,2,3,3,2,1,0],
        [0,0,1,2,2,1,0,0],[0,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,0]] },
    lavender: { label: '🌿 Lavanta', group: 'Çiçekler', size: 8, colors: [K, [230, 230, 250], [216, 191, 216], [186, 85, 211], [0, 100, 0]], pixels: [
        [0,0,1,1,1,1,0,0],[0,1,2,2,2,2,1,0],[1,2,3,3,3,3,2,1],[0,1,2,2,2,2,1,0],
        [0,0,1,1,1,1,0,0],[0,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,0]] },
    jasmine: { label: '🌺 Yasemin', group: 'Çiçekler', size: 8, colors: [K, [255, 255, 255], [255, 250, 240], [255, 245, 230], [34, 139, 34]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,2,2,3,2,1],
        [1,2,3,2,2,3,2,1],[0,1,2,3,3,2,1,0],[0,0,1,4,4,1,0,0],[0,0,0,4,4,0,0,0]] },
    lotus: { label: '🪷 Lotus', group: 'Çiçekler', size: 8, colors: [K, [255, 105, 180], [255, 182, 193], [255, 240, 245], [34, 139, 34]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[1,0,1,2,2,1,0,1],[1,1,2,3,3,2,1,1],
        [0,1,2,3,3,2,1,0],[0,1,1,2,2,1,1,0],[0,0,1,1,1,1,0,0],[0,4,4,4,4,4,4,0]] },

    heart: { label: '❤️ Kalp', group: 'Şekiller', size: 8, colors: [K, [139, 0, 0], [220, 20, 60], [255, 105, 180]], pixels: [
        [0,1,1,0,0,1,1,0],[1,2,2,1,1,2,2,1],[1,2,3,2,2,3,2,1],[1,2,2,3,3,2,2,1],
        [0,1,2,2,2,2,1,0],[0,0,1,2,2,1,0,0],[0,0,0,1,1,0,0,0],[0,0,0,0,0,0,0,0]] },
    star: { label: '⭐ Yıldız', group: 'Şekiller', size: 8, colors: [K, [184, 134, 11], [255, 215, 0], [255, 255, 255]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,0,2,2,0,0,0],[1,1,2,2,2,2,1,1],[0,1,2,3,3,2,1,0],
        [0,0,2,2,2,2,0,0],[0,1,2,1,1,2,1,0],[0,2,1,0,0,1,2,0],[1,1,0,0,0,0,1,1]] },
    diamond: { label: '💎 Elmas', group: 'Şekiller', size: 8, colors: [K, [176, 196, 222], [135, 206, 250], [0, 191, 255], [255, 255, 255]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,1,2,3,3,2,1,0],[1,2,3,4,4,3,2,1],
        [0,1,2,3,3,2,1,0],[0,0,1,2,2,1,0,0],[0,0,0,1,1,0,0,0],[0,0,0,0,0,0,0,0]] },
    circle: { label: '⭕ Daire', group: 'Şekiller', size: 8, colors: [K, [100, 100, 100], [150, 150, 150], [200, 200, 200]], pixels: [
        [0,0,1,1,1,1,0,0],[0,1,2,2,2,2,1,0],[1,2,3,3,3,3,2,1],[1,2,3,3,3,3,2,1],
        [1,2,3,3,3,3,2,1],[1,2,3,3,3,3,2,1],[0,1,2,2,2,2,1,0],[0,0,1,1,1,1,0,0]] },
    square: { label: '⬛ Kare', group: 'Şekiller', size: 8, colors: [K, [50, 50, 50], [100, 100, 100], [150, 150, 150]], pixels: [
        [1,1,1,1,1,1,1,1],[1,2,2,2,2,2,2,1],[1,2,3,3,3,3,2,1],[1,2,3,3,3,3,2,1],
        [1,2,3,3,3,3,2,1],[1,2,3,3,3,3,2,1],[1,2,2,2,2,2,2,1],[1,1,1,1,1,1,1,1]] },
    triangle: { label: '🔺 Üçgen', group: 'Şekiller', size: 8, colors: [K, [90, 90, 90], [160, 160, 160], [230, 230, 230]], pixels: [
        [0,0,0,1,1,0,0,0],[0,0,0,1,1,0,0,0],[0,0,1,2,2,1,0,0],[0,0,1,2,2,1,0,0],
        [0,1,2,3,3,2,1,0],[0,1,2,3,3,2,1,0],[1,2,2,2,2,2,2,1],[1,1,1,1,1,1,1,1]] },
    sparkle: { label: '✨ Işık', group: 'Şekiller', size: 8, colors: [K, [200, 200, 200], [255, 255, 200], [255, 255, 255], [255, 255, 0]], pixels: [
        [0,0,0,1,1,0,0,0],[0,1,0,2,2,0,1,0],[0,0,2,3,3,2,0,0],[1,2,3,4,4,3,2,1],
        [1,2,3,4,4,3,2,1],[0,0,2,3,3,2,0,0],[0,1,0,2,2,0,1,0],[0,0,0,1,1,0,0,0]] },

    ascii_dot: { label: '🔸 Nokta', group: 'Pixel', size: 4, colors: [K, [100, 100, 100], [200, 200, 200]], pixels: [
        [0,1,1,0],[1,2,2,1],[1,2,2,1],[0,1,1,0]] },
    ascii_block: { label: '█ Dolu Blok', group: 'Pixel', size: 4, colors: [K, [200, 200, 200]], pixels: [
        [1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]] },
    pixel_square: { label: '⬜ Pixel Kare', group: 'Pixel', size: 6, colors: [K, [80, 80, 80], [160, 160, 160], [240, 240, 240]], pixels: [
        [1,1,1,1,1,1],[1,2,2,2,2,1],[1,2,3,3,2,1],[1,2,3,3,2,1],[1,2,2,2,2,1],[1,1,1,1,1,1]] },
    pixel_circle: { label: '● Pixel Daire', group: 'Pixel', size: 6, colors: [K, [80, 80, 80], [160, 160, 160], [240, 240, 240]], pixels: [
        [0,1,1,1,1,0],[1,2,2,2,2,1],[1,2,3,3,2,1],[1,2,3,3,2,1],[1,2,2,2,2,1],[0,1,1,1,1,0]] },
    pixel_diamond: { label: '◆ Pixel Elmas', group: 'Pixel', size: 6, colors: [K, [80, 80, 80], [160, 160, 160], [240, 240, 240]], pixels: [
        [0,0,1,1,0,0],[0,1,2,2,1,0],[1,2,3,3,2,1],[1,2,3,3,2,1],[0,1,2,2,1,0],[0,0,1,1,0,0]] },
    led: { label: '💡 LED Ekran', group: 'Pixel', size: 5, colors: [K, [255, 255, 255]], pixels: [
        [0,1,1,1,0],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,0]] },
};

// Görüntüleme modları: 'pixel' (düz), 'shape:<ad>', 'ascii:<set>', 'braille'
export const ASCII_SETS = {
    classic: { label: '@ ASCII Klasik', chars: ' .:-=+*#%@' },
    dense: { label: '▓ ASCII Yoğun', chars: ' .:-=+*#%@░▒▓█' },
    blocks: { label: '░ ASCII Blok', chars: ' ░▒▓█' },
    detailed: { label: '$ ASCII Detaylı', chars: " .'`^\",:;Il!i><~+_-?][}{1)(|tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$" },
};

export const THEMES = {
    romantic: { label: '💕 Romantik', start: '#ff9a9e', end: '#fecfef', primary: '#ff6b9d', secondary: '#c44569' },
    spring: { label: '🌸 Bahar', start: '#a8edea', end: '#fed6e3', primary: '#ff9a9e', secondary: '#e07a8f' },
    sunset: { label: '🌅 Gün Batımı', start: '#ff9a56', end: '#ff6b6b', primary: '#ff6b6b', secondary: '#c0392b' },
    ocean: { label: '🌊 Okyanus', start: '#2193b0', end: '#6dd5ed', primary: '#1e6fa8', secondary: '#0b4f7c' },
    forest: { label: '🌲 Orman', start: '#134e5e', end: '#71b280', primary: '#11998e', secondary: '#0b6e4f' },
    purple: { label: '💜 Mor', start: '#667eea', end: '#764ba2', primary: '#8e44ad', secondary: '#5b2c83' },
    pink: { label: '🌸 Pembe', start: '#f093fb', end: '#f5576c', primary: '#e84393', secondary: '#b0306a' },
    blue: { label: '💙 Mavi', start: '#4facfe', end: '#00f2fe', primary: '#2980b9', secondary: '#1a5276' },
    green: { label: '💚 Yeşil', start: '#56ab2f', end: '#a8e063', primary: '#3d8b1f', secondary: '#2a6115' },
    orange: { label: '🧡 Turuncu', start: '#fa709a', end: '#fee140', primary: '#e67e22', secondary: '#b9561a' },
    red: { label: '❤️ Kırmızı', start: '#ff6b6b', end: '#ee5a6f', primary: '#c0392b', secondary: '#8e2a20' },
    gold: { label: '✨ Altın', start: '#f6d365', end: '#fda085', primary: '#d4a017', secondary: '#a67c00' },
    lavender: { label: '💐 Lavanta', start: '#a8caba', end: '#5d4e75', primary: '#7d5ba6', secondary: '#4e3a6e' },
    rose: { label: '🌹 Gül', start: '#ffecd2', end: '#fcb69f', primary: '#e17055', secondary: '#b34d36' },
    sunset2: { label: '🌆 Şehir Gün Batımı', start: '#ff9a9e', end: '#fad0c4', primary: '#e66767', secondary: '#b33939' },
    aurora: { label: '🌌 Aurora', start: '#00c9ff', end: '#92fe9d', primary: '#00a8cc', secondary: '#007a99' },
    neon: { label: '💡 Neon', start: '#f093fb', end: '#4facfe', primary: '#9b59b6', secondary: '#2e86de' },
    pastel: { label: '🎨 Pastel', start: '#a1c4fd', end: '#c2e9fb', primary: '#6c8cd5', secondary: '#4a69bd' },
    dark: { label: '🌙 Karanlık', start: '#2c3e50', end: '#34495e', primary: '#5d6d7e', secondary: '#2e4053' },
    light: { label: '☀️ Aydınlık', start: '#ffeaa7', end: '#fab1a0', primary: '#e17055', secondary: '#d35400' },
};

export const BACKGROUNDS = {
    none: { label: '❌ Yok' },
    flowers: { label: '🌸 Çiçekler', cls: 'flower', count: 20, symbols: ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '💐'] },
    stars: { label: '⭐ Yıldızlar', cls: 'star', count: 30, symbols: ['⭐', '✨', '🌟', '💫'] },
    hearts: { label: '❤️ Kalpler', cls: 'heart', count: 18, symbols: ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞'] },
    leaves: { label: '🍃 Yapraklar', cls: 'leaf', count: 25, symbols: ['🍃', '🌿', '🍀', '🌱'] },
    butterflies: { label: '🦋 Kelebekler', cls: 'butterfly', count: 15, symbols: ['🦋'] },
    snowflakes: { label: '❄️ Kar Tanesi', cls: 'snowflake', count: 40, symbols: ['❄️'] },
    sparkles: { label: '✨ Işıltılar', cls: 'sparkle', count: 40, symbols: ['✨', '⭐', '💫'] },
    bubbles: { label: '🫧 Baloncuklar', cls: 'bubble', count: 20, symbols: ['🫧', '💭'] },
    cherry_blossoms: { label: '🌸 Kiraz Çiçekleri', cls: 'cherry', count: 30, symbols: ['🌸'] },
    rose_petals: { label: '🌹 Gül Yaprakları', cls: 'petal', count: 30, symbols: ['🌹'] },
    fireflies: { label: '✨ Ateş Böcekleri', cls: 'firefly', count: 20, symbols: ['✨', '⭐'] },
    raindrops: { label: '💧 Yağmur Damlaları', cls: 'raindrop', count: 40, symbols: ['💧'] },
    confetti: { label: '🎊 Konfeti', cls: 'confetti', count: 30, symbols: ['🎊', '🎉'] },
    music_notes: { label: '🎵 Müzik Notaları', cls: 'music', count: 18, symbols: ['🎵', '🎶'] },
};

export function modeOptions() {
    const groups = [{ label: '🎬 Temel', items: [['pixel', '🟪 Düz Pixel Art']] }];
    const byGroup = {};
    for (const [id, s] of Object.entries(SHAPES)) {
        (byGroup[s.group] = byGroup[s.group] || []).push([`shape:${id}`, s.label]);
    }
    groups.push({ label: '🌺 Çiçekler', items: byGroup['Çiçekler'] });
    groups.push({ label: '✨ Şekiller', items: byGroup['Şekiller'] });
    groups.push({ label: '🎨 Pixel', items: byGroup['Pixel'] });
    groups.push({
        label: '🔤 ASCII',
        items: [...Object.entries(ASCII_SETS).map(([id, a]) => [`ascii:${id}`, a.label]), ['braille', '⣿ Braille (yüksek çözünürlük)']],
    });
    return groups;
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
