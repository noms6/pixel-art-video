// Çoklu dil desteği. Çeviriler static/i18n/<kod>.json dosyalarındadır; eksik anahtar İngilizceye,
// o da yoksa anahtarın kendisine düşer. Metinlerde {ad} biçiminde parametreler kullanılır.

export const LANGUAGES = [
    ['tr', 'Türkçe'], ['en', 'English'], ['de', 'Deutsch'], ['fr', 'Français'], ['es', 'Español'],
    ['it', 'Italiano'], ['pt', 'Português'], ['nl', 'Nederlands'], ['pl', 'Polski'], ['ro', 'Română'],
    ['sv', 'Svenska'], ['el', 'Ελληνικά'], ['ru', 'Русский'], ['uk', 'Українська'], ['az', 'Azərbaycanca'],
    ['ar', 'العربية'], ['fa', 'فارسی'], ['hi', 'हिन्दी'], ['ja', '日本語'], ['ko', '한국어'],
    ['zh', '中文 (简体)'], ['id', 'Bahasa Indonesia'], ['vi', 'Tiếng Việt'], ['th', 'ไทย'],
];

const RTL = new Set(['ar', 'fa']);
const cache = new Map();
let strings = {};
let fallback = {};
let current = 'en';

async function fetchStrings(code) {
    if (!cache.has(code)) {
        cache.set(code, fetch(`/static/i18n/${code}.json`).then((r) => {
            if (!r.ok) throw new Error(`i18n ${code}: ${r.status}`);
            return r.json();
        }));
    }
    return cache.get(code);
}

export function t(key, params = {}) {
    const text = strings[key] ?? fallback[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
}

export function language() {
    return current;
}

export function isRtl(code = current) {
    return RTL.has(code);
}

// Kayıtlı tercih → tarayıcı dilleri → İngilizce
export function detectLanguage(saved) {
    const supported = new Set(LANGUAGES.map(([code]) => code));
    const candidates = [saved, ...(navigator.languages || [navigator.language || ''])];
    for (const c of candidates) {
        if (!c) continue;
        const base = String(c).toLowerCase().split(/[-_]/)[0];
        if (supported.has(base)) return base;
    }
    return 'en';
}

export function translateDom(root = document) {
    for (const el of root.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
    for (const el of root.querySelectorAll('[data-i18n-placeholder]')) el.placeholder = t(el.dataset.i18nPlaceholder);
    for (const el of root.querySelectorAll('[data-i18n-aria]')) el.setAttribute('aria-label', t(el.dataset.i18nAria));
}

export async function setLanguage(code) {
    if (!Object.keys(fallback).length) fallback = await fetchStrings('en');
    try {
        strings = await fetchStrings(code);
        current = code;
    } catch {
        strings = fallback;
        current = 'en';
    }
    document.documentElement.lang = current;
    document.documentElement.dir = isRtl() ? 'rtl' : 'ltr';
    translateDom();
    return current;
}

// API'den gelen hatalar (code + params) seçili dilde; kod bilinmiyorsa sunucunun mesajı
export function errorText(error) {
    if (error && error.code && strings[`err.${error.code}`] !== undefined) return t(`err.${error.code}`, error.params || {});
    if (error && error.code && fallback[`err.${error.code}`] !== undefined) return t(`err.${error.code}`, error.params || {});
    return (error && error.message) || String(error);
}
