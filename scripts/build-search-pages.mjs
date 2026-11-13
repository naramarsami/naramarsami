import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { practiceWorks } from '../practice-works.mjs';

const output = process.argv[2];
if (!output) throw new Error('Usage: node scripts/build-search-pages.mjs <output directory>');

const origin = 'https://xn--lg3by0shrak48b.kro.kr';
const catalogPath = '/works/';
const dateModified = '2026-11-13';
const siteName = '나랏말싸미';
const escape = value => value.replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const detailPath = slug => catalogPath + slug + '/';
const practicePath = slug => '/?work=' + encodeURIComponent(slug);

const featured = {
    'star-counting-night': {
        description: '윤동주의 「별 헤는 밤」에서 가을 하늘과 별을 떠올리는 대목을 한 줄씩 따라 칩니다.',
        tip: '쉼표가 이어지는 부분에서는 화면에 보이는 문장부호까지 입력하세요. 띄어쓰기를 직접 연습하려면 설정에서 자동 띄어쓰기를 끌 수 있습니다.',
    },
    prologue: {
        description: '윤동주의 「서시」를 처음부터 마지막 줄까지 한 줄씩 따라 칩니다.',
        tip: '짧은 줄과 긴 줄이 번갈아 나옵니다. 줄 끝 쉼표와 마침표가 맞아야 다음 줄로 이동합니다.',
    },
    azaleas: {
        description: '김소월의 「진달래꽃」에서 반복되는 구절과 각 연의 문장을 따라 칩니다.',
        tip: '비슷한 구절이 뒤에 다시 나옵니다. 기억에 의존하기보다 화면에 나온 어미와 마침표를 확인하며 입력해 보세요.',
    },
    camellia: {
        description: '김유정의 소설 「동백꽃」에서 수탉이 등장하는 대목을 세 단계로 나누어 따라 칩니다.',
        tip: '닭싸움을 묘사하는 의성어와 긴 문장을 연습할 수 있습니다. 각 단계는 연습 화면의 단계 메뉴에서 고를 수 있습니다.',
    },
    'when-buckwheat-flowers-bloom': {
        description: '이효석의 「메밀꽃 필 무렵」에서 한낮의 장터부터 장을 떠나는 대목까지 세 단계로 나누어 따라 칩니다.',
        tip: '장터를 묘사하는 긴 문장은 화면의 쉼표를 기준으로 끊어 읽어 보세요. 연습 결과에서 타수와 정확도를 확인할 수 있습니다.',
    },
};

const slugs = new Set(practiceWorks.map(({ work }) => work.slug));
if (slugs.size !== practiceWorks.length || [...slugs].some(slug => !/^[a-z0-9-]+$/.test(slug))) {
    throw new Error('Every practice work must have a unique URL slug');
}
for (const slug of Object.keys(featured)) {
    if (!slugs.has(slug)) throw new Error('Unknown featured work: ' + slug);
}

function renderPage({ path, title, description, content, entity, breadcrumb = [] }) {
    const url = origin + path;
    const trail = [{ path: '/', name: siteName }, ...breadcrumb];
    const data = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                ...entity,
                '@id': url + '#webpage',
                url,
                name: title,
                description,
                inLanguage: 'ko',
                isPartOf: { '@id': origin + '/#website' },
                breadcrumb: { '@id': url + '#breadcrumb' },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': url + '#breadcrumb',
                itemListElement: trail.map((entry, index) => ({
                    '@type': 'ListItem', position: index + 1, name: entry.name, item: origin + entry.path,
                })),
            },
        ],
    };
    return `<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escape(title)}">
    <meta property="og:description" content="${escape(description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="${siteName}">
    <meta property="og:locale" content="ko_KR">
    <link rel="stylesheet" href="/guide.css?v=12">
    <script type="module" src="/settings.mjs?v=10"></script>
    <script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>
</head>
<body class="guide">
    <div class="guide-shell">
        <header class="guide-header">
            <a class="wordmark" href="/">나랏말싸미</a>
            <nav class="guide-nav" aria-label="안내 메뉴">
                <a href="/works/"${path === catalogPath ? ' aria-current="page"' : ''}>작품 목록</a>
                <a href="/about.html">연습 안내</a>
            </nav>
        </header>
        <main>
            ${content}
        </main>
        <footer class="guide-footer">
            <a href="/">타자 연습</a>
            <a href="/brand.html">브랜드 가이드</a>
        </footer>
    </div>
</body>
</html>
`;
}

function renderCatalog() {
    const groups = { poem: '한글 시와 고전', long: '소설과 긴 글', en: '영어 시' };
    const items = Object.entries(groups).map(([mode, label]) => {
        const list = practiceWorks.filter(entry => entry.mode === mode).map(({ work }) => {
            const title = escape(work.title);
            const author = escape(work.author);
            const route = Object.hasOwn(featured, work.slug) ? detailPath(work.slug) : practicePath(work.slug);
            const summary = work.stages ? ` · 발췌문 ${work.stages.length}단계` : '';
            const lang = mode === 'en' ? ' lang="en"' : '';
            return `<li><a href="${route}"${lang}>${title}</a><span${lang}>${author}${summary}</span></li>`;
        }).join('\n');
        return `<section class="guide-section" aria-labelledby="works-${mode}">
                <h2 id="works-${mode}">${label}</h2>
                <ul class="works-list">${list}</ul>
            </section>`;
    }).join('\n');
    const description = `한국 시·소설과 영어 시를 포함한 타자 연습 지문 ${practiceWorks.length}편을 골라 보세요. 윤동주 「별 헤는 밤」, 김소월 「진달래꽃」, 김유정 「동백꽃」 등을 따라 칠 수 있습니다.`;
    return renderPage({
        path: catalogPath,
        title: '타자 연습 작품 목록 | 나랏말싸미',
        description,
        content: `<div class="guide-hero">
                <h1>타자 연습 작품 목록</h1>
                <p class="guide-lead">한국 시·소설과 영어 시를 포함한 ${practiceWorks.length}편의 지문을 한 줄씩 따라 칠 수 있습니다.</p>
            </div>
            ${items}`,
        entity: { '@type': 'CollectionPage' },
        breadcrumb: [{ path: catalogPath, name: '작품 목록' }],
    });
}

function renderWork(work, notes) {
    const title = escape(work.title);
    const author = escape(work.author);
    const path = detailPath(work.slug);
    const scope = work.stages
        ? `발췌문 ${work.stages.length}단계, 총 ${work.stages.reduce((count, stage) => count + stage.lines.length, 0)}줄`
        : `연습 지문 ${work.lines.length}줄`;
    const source = work.source
        ? `<p><a href="${escape(work.source)}">작품 원문 보기</a></p>`
        : '';
    return renderPage({
        path,
        title: `${work.title} 타자 연습 (${work.author}) | 나랏말싸미`,
        description: notes.description + ' ' + scope + '을 로그인 없이 연습할 수 있습니다.',
        content: `<div class="guide-hero">
                <p class="guide-label">${author} · ${work.stages ? '소설 발췌' : '한글 시'}</p>
                <h1>${title} 타자 연습</h1>
                <p class="guide-lead">${escape(notes.description)}</p>
                <a class="guide-action" href="${practicePath(work.slug)}">이 작품으로 연습하기 <span aria-hidden="true">→</span></a>
            </div>
            <section class="guide-section" aria-labelledby="practice-scope">
                <h2 id="practice-scope">연습할 내용</h2>
                <div class="guide-copy"><p>${scope}</p><p>${escape(notes.tip)}</p>${source}</div>
            </section>
            <nav class="guide-footer" aria-label="연습 안내">
                <a href="/works/">다른 작품 고르기</a>
                <a href="/about.html#typing-score">타수와 정확도 계산 기준</a>
            </nav>`,
        entity: {
            '@type': 'WebPage',
            about: { '@type': 'CreativeWork', name: work.title, author: { '@type': 'Person', name: work.author } },
        },
        breadcrumb: [{ path: catalogPath, name: '작품 목록' }, { path, name: work.title }],
    });
}

async function writePage(path, content) {
    const directory = join(output, path.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), content, 'utf8');
}

const newPaths = [catalogPath];
await writePage(catalogPath, renderCatalog());
for (const { work } of practiceWorks) {
    if (!Object.hasOwn(featured, work.slug)) continue;
    const path = detailPath(work.slug);
    await writePage(path, renderWork(work, featured[work.slug]));
    newPaths.push(path);
}

const sitemapFile = join(output, 'sitemap.xml');
const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
const entries = newPaths.map(path => `  <url><loc>${origin}${path}</loc><lastmod>${dateModified}</lastmod></url>`).join('\n');
if (!sitemap.includes('</urlset>') || sitemap.includes(origin + catalogPath)) {
    throw new Error('Expected the base sitemap before adding work pages');
}
await writeFile(sitemapFile, sitemap.replace('</urlset>', entries + '\n</urlset>'), 'utf8');
