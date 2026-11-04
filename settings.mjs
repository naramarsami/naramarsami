const typefaces = {
    pretendard: {
        stack: 'Pretendard, "Malgun Gothic", system-ui, sans-serif',
        stylesheet: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css',
    },
    gungsuh: { stack: '"Narat Gungsuh", Gungsuh, "궁서", serif' },
    serif: { stack: '"Noto Serif KR", serif', google: 'Noto+Serif+KR:wght@400;500;700;900' },
    myeongjo: { stack: '"Nanum Myeongjo", serif', google: 'Nanum+Myeongjo:wght@400;700;800' },
    gothic: { stack: '"Nanum Gothic", sans-serif', google: 'Nanum+Gothic:wght@400;700;800' },
    batang: { stack: '"Gowun Batang", serif', google: 'Gowun+Batang:wght@400;700' },
    gamja: { stack: '"Gamja Flower", cursive', google: 'Gamja+Flower' },
    single: { stack: '"Single Day", cursive', google: 'Single+Day' },
    mono: { stack: '"JetBrains Mono", "Malgun Gothic", monospace', google: 'JetBrains+Mono:wght@400;500;700' },
};

const loadedStylesheets = new Set();
let gungsuhRegistered = false;

export function readCookie(key) {
    try {
        const prefix = 'narat-' + key + '=';
        const entry = document.cookie.split('; ').find(cookie => cookie.startsWith(prefix));
        return entry ? JSON.parse(decodeURIComponent(entry.slice(prefix.length))) : null;
    } catch {
        return null;
    }
}

export function readLegacy(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return null;
    }
}

export const savedSettings = readCookie('settings');
export const settings = savedSettings ?? readLegacy('practiceSettings') ?? {};
export const initialFont = Object.hasOwn(typefaces, settings.font) ? settings.font : 'pretendard';

export function applyTypeface(font) {
    const { stack, stylesheet, google } = typefaces[font];
    if (font === 'gungsuh' && !gungsuhRegistered) {
        const source = new URL('./Gungsuh-Regular.woff2', import.meta.url);
        document.fonts.add(new FontFace('Narat Gungsuh', `url("${source}") format("woff2")`, { display: 'swap' }));
        gungsuhRegistered = true;
    }
    const href = stylesheet ?? (google && 'https://fonts.googleapis.com/css2?family=' + google + '&display=swap');
    if (href && !loadedStylesheets.has(href)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.append(link);
        loadedStylesheets.add(href);
    }
    document.documentElement.style.setProperty('--site-font', stack);
}

applyTypeface(initialFont);
