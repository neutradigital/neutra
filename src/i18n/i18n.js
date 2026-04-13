/**
 * ══════════════════════════════════════════════════════
 * NEUTRA i18n ENGINE — Vanilla JS, Zero Dependencies
 * Supports: ES (default) / EN
 * ══════════════════════════════════════════════════════
 */

import en from './en.json';
import es from './es.json';

// ── Dictionary map ────────────────────────────────────
const dictionaries = { en, es };

// ── Runtime state ─────────────────────────────────────
let currentLang = 'es';

// ── Nested key resolver ───────────────────────────────
// e.g. get('hero.h1Line1') → dictionaries['es'].hero.h1Line1
function get(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], dictionaries[currentLang]) ?? key;
}

// ── DOM: Apply all translations ───────────────────────
function applyTranslations() {
    // 1. [data-i18n] → textContent (XSS-safe)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const val = get(el.dataset.i18n);
        if (val && val !== el.dataset.i18n) el.textContent = val;
    });

    // 2. [data-i18n-html] → innerHTML (for elements with <strong>, <br>, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const val = get(el.dataset.i18nHtml);
        if (val && val !== el.dataset.i18nHtml) el.innerHTML = val;
    });

    // 3. [data-i18n-content] → meta content attribute
    document.querySelectorAll('[data-i18n-content]').forEach(el => {
        const val = get(el.dataset.i18nContent);
        if (val && val !== el.dataset.i18nContent) el.setAttribute('content', val);
    });

    // 4. [data-i18n-title] → document.title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const val = get(el.dataset.i18nTitle);
        if (val && val !== el.dataset.i18nTitle) document.title = val;
    });

    // 5. [data-i18n-placeholder] → placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const val = get(el.dataset.i18nPlaceholder);
        if (val && val !== el.dataset.i18nPlaceholder) el.setAttribute('placeholder', val);
    });

    // 6. [data-i18n-aria] → aria-label attribute
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const val = get(el.dataset.i18nAria);
        if (val && val !== el.dataset.i18nAria) el.setAttribute('aria-label', val);
    });
}

// ── SEO: Update html[lang] and og:locale ─────────────
function updateSEO() {
    // Update <html lang>
    document.documentElement.lang = currentLang;

    // Update og:locale
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
        ogLocale.setAttribute('content', currentLang === 'en' ? 'en_US' : 'es_MX');
    }
}

// ── SEO: Inject hreflang alternate links ─────────────
function injectHreflang() {
    // Remove previously injected tags to avoid duplicates on lang switch
    document.querySelectorAll('link[data-neutra-hreflang]').forEach(l => l.remove());

    const canonical = 'https://www.neutra.mx/';

    [
        { hreflang: 'es', href: canonical },
        { hreflang: 'en', href: canonical },
        { hreflang: 'x-default', href: canonical },
    ].forEach(({ hreflang, href }) => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hreflang;
        link.href = href;
        link.setAttribute('data-neutra-hreflang', '');
        document.head.appendChild(link);
    });
}

// ── UI: Update toggle button active states ────────────
function updateToggleUI() {
    const btnEn = document.getElementById('btn-lang-en');
    const btnEs = document.getElementById('btn-lang-es');
    if (!btnEn || !btnEs) return;

    const isEn = currentLang === 'en';

    // EN button
    btnEn.classList.toggle('text-white', isEn);
    btnEn.classList.toggle('font-bold', isEn);
    btnEn.classList.toggle('opacity-100', isEn);
    btnEn.classList.toggle('text-white/40', !isEn);
    btnEn.classList.toggle('font-normal', !isEn);

    // ES button
    btnEs.classList.toggle('text-white', !isEn);
    btnEs.classList.toggle('font-bold', !isEn);
    btnEs.classList.toggle('opacity-100', !isEn);
    btnEs.classList.toggle('text-white/40', isEn);
    btnEs.classList.toggle('font-normal', isEn);
}

// ── Language detection (priority: localStorage → browser → default) ──
function detectLanguage() {
    const stored = localStorage.getItem('neutra-lang');
    if (stored && dictionaries[stored]) return stored;

    const browser = (navigator.language || navigator.userLanguage || 'es').slice(0, 2).toLowerCase();
    return dictionaries[browser] ? browser : 'es';
}

// ── Public: setLang — exposed as window.setLang ───────
export function setLang(lang) {
    if (!dictionaries[lang] || lang === currentLang) return;

    currentLang = lang;
    localStorage.setItem('neutra-lang', lang);

    // Expose globally for main.js slide-over and form handlers
    window.__neutraLang = currentLang;
    window.__neutraTranslations = dictionaries[currentLang];

    applyTranslations();
    updateSEO();
    updateToggleUI();
}

// ── Public: t() helper — for use in JS (e.g. main.js) ─
export function t(key) {
    return get(key);
}

// ── Public: initI18n — called once on DOMContentLoaded ─
export function initI18n() {
    currentLang = detectLanguage();

    // Expose globally
    window.setLang = setLang;
    window.__neutraLang = currentLang;
    window.__neutraTranslations = dictionaries[currentLang];

    // Run pipeline
    injectHreflang();
    applyTranslations();
    updateSEO();
    updateToggleUI();
}
