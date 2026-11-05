import { bindTyping, characters, readInput, isAutomatic, isLineComplete, commitInput, scorePractice } from './typing-core.mjs?v=10';
import { applyTypeface, initialFont, readCookie, readLegacy, savedSettings, settings } from './settings.mjs?v=10';
import { archivePracticeRecords, practiceRecords, readPracticeRecords } from './practice-history.mjs?v=10';
import { keyboardRows, koreanKeyLabels, nextKeyFor } from './typing-guide.mjs?v=10';
import { additionalPoems, koreanNovels } from './korean-literature.mjs?v=11';

const poemCollections = [
    {
        title: "훈민정음 언해본 서문",
        author: "세종대왕",
        keywords: ["훈민정음", "한글", "세종대왕", "역사", "고전", "서문"],
        lines: [
            "나라의 말이 중국과 달라",
            "문자와 서로 통하지 아니하므로",
            "이런 까닭으로 어리석은 백성이 이르고자 할 바가 있어도",
            "마침내 제 뜻을 능히 펴지 못할 자가 많다.",
            "내가 이를 위하여 가엽게 여겨",
            "새로 스물여덟 글자를 만드니",
            "사람마다 하여금 쉽게 익혀 날마다 씀에 편안케 하고자 할 따름이다."
        ]
    },
    {
        title: "별 헤는 밤",
        author: "윤동주",
        keywords: ["별", "가을", "그리움", "추억", "사랑", "어머니", "윤동주"],
        lines: [
            "계절이 지나가는 하늘에는 가을로 가득 차 있습니다.",
            "나는 아무 걱정도 없이 가을 속의 별들을 다 헤일 듯합니다.",
            "가슴 속에 하나 둘 새겨지는 별을 이제 다 못 헤는 것은",
            "쉬이 아침이 오는 까닭이요, 내일 밤이 남은 까닭이요,",
            "아직 나의 청춘이 다하지 않은 까닭입니다.",
            "별 하나에 추억과, 별 하나에 사랑과,",
            "별 하나에 쓸쓸함과, 별 하나에 동경과,",
            "별 하나에 시와, 별 하나에 어머니, 어머니."
        ]
    },
    {
        title: "진달래꽃",
        author: "김소월",
        keywords: ["사랑", "이별", "슬픔", "전통", "진달래", "김소월"],
        lines: [
            "나 보기가 역겨워 가실 때에는",
            "말없이 고이 보내 드리오리다.",
            "영변에 약산 진달래꽃",
            "아름 따다 가실 길에 뿌리오리다.",
            "가시는 걸음 걸음 놓인 그 꽃을",
            "사뿐히 즈려밟고 가시옵소서.",
            "나 보기가 역겨워 가실 때에는",
            "죽어도 아니 눈물 흘리오리다."
        ]
    },
    {
        title: "서시",
        author: "윤동주",
        keywords: ["자아", "성찰", "별", "부끄럼", "극복", "윤동주"],
        lines: [
            "죽는 날까지 하늘을 우러러",
            "한 점 부끄럼이 없기를,",
            "잎새에 이는 바람에도",
            "나는 괴로워했다.",
            "별을 노래하는 마음으로",
            "모든 죽어가는 것을 사랑해야지.",
            "그리고 나한테 주어진 길을",
            "걸어가야겠다.",
            "오늘 밤에도 별이 바람에 스치운다."
        ]
    },
    {
        title: "초혼",
        author: "김소월",
        keywords: ["이별", "슬픔", "죽음", "사랑", "초혼", "김소월"],
        lines: [
            "산산이 부서진 이름이여!",
            "허공 중에 헤어진 이름이여!",
            "불러도 주인 없는 이름이여!",
            "부르다가 내가 죽을 이름이여!",
            "심중에 남아 있는 말 한 마디는",
            "끝끝내 마저 하지 못하였구나.",
            "사랑하던 그 사람이여!",
            "사랑하던 그 사람이여!"
        ]
    },
    {
        title: "님의 침묵",
        author: "한용운",
        keywords: ["침묵", "님", "불교", "조국", "저항", "한용운", "사랑"],
        lines: [
            "님은 갔습니다. 아아, 사랑하는 나의 님은 갔습니다.",
            "푸른 산빛을 깨치고 단풍나무 숲을 향하여 난 작은 길을 걸어서 차마 떨치고 갔습니다.",
            "황금의 꽃같이 굳고 빛나던 옛 맹세는 차디찬 티끌이 되어서 한숨의 미풍에 날아갔습니다.",
            "날카로운 첫 키스의 추억은 나의 운명의 지침을 돌려 놓고 뒷걸음쳐서 사라졌습니다."
        ]
    }
];

const longCollections = [
    ...koreanNovels,
    {
        title: "애국가",
        author: "작자미상",
        keywords: ["애국", "나라", "국가", "노래", "애국가"],
        lines: [
            "동해 물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세",
            "무궁화 삼천리 화려 강산 대한 사람 대한으로 길이 보전하세",
            "남산 위에 저 소나무 철갑을 두른 듯 바람 서리 불변함은 우리 기상일세",
            "가을 하늘 공활한데 높고 구름 없이 밝은 달은 우리 가슴 일편단심일세",
            "이 기상과 이 맘으로 충성을 다하여 괴로우나 즐거우나 나라 사랑하세"
        ]
    },
];

const englishCollections = [
    {
        title: "The Road Not Taken",
        author: "Robert Frost",
        keywords: ["nature", "choice", "classic"],
        lines: [
            "Two roads diverged in a yellow wood,",
            "And sorry I could not travel both",
            "And be one traveler, long I stood",
            "And looked down one as far as I could",
            "To where it bent in the undergrowth;"
        ]
    },
    {
        title: "Daffodils",
        author: "William Wordsworth",
        keywords: ["nature", "beauty", "lake"],
        lines: [
            "I wandered lonely as a cloud",
            "That floats on high o'er vales and hills,",
            "When all at once I saw a crowd,",
            "A host, of golden daffodils;",
            "Beside the lake, beneath the trees,",
            "Fluttering and dancing in the breeze."
        ]
    },
    {
        title: "Ozymandias",
        author: "Percy Bysshe Shelley",
        keywords: ["history", "time", "king"],
        lines: [
            "I met a traveller from an antique land,",
            "Who said—“Two vast and trunkless legs of stone",
            "Stand in the desert. . . . Near them, on the sand,",
            "Half sunk a shattered visage lies, whose frown,",
            "And wrinkled lip, and sneer of cold command,",
            "Tell that its sculptor well those passions read"
        ]
    }
];

const byId = id => document.getElementById(id);
const typingInput = byId('typing-input');
const textDisplay = byId('text-display');
const passage = textDisplay.parentElement;
const resultDialog = byId('result-modal');
const stagePreview = byId('stage-preview');
const countdownText = byId('stage-countdown');
const stageSteps = byId('stage-steps');
const searchDialog = byId('search-modal');
const historyDialog = byId('ranking-modal');
const settingsDialog = byId('settings-modal');
const practiceGuide = byId('practice-guide');
const guideToggle = byId('help-btn');
const guideKeys = new Map();
const guideKeyNames = { Space: '스페이스', Backspace: '⌫', Shift: 'Shift' };
const guideLanguage = byId('guide-language');
const guideLanguageNote = byId('guide-language-note');
const guideProgress = byId('guide-progress');
const guideProgressValue = byId('guide-progress-value');
const guideNextKey = byId('guide-next-key');
const desktopTyping = matchMedia('(min-width: 769px) and (pointer: fine)');
const mobileTyping = matchMedia('(max-width: 768px), (pointer: coarse)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const collections = { poem: [...poemCollections, ...additionalPoems], long: longCollections, en: englishCollections };
const modeLabels = { poem: '한글 시', long: '긴 글', en: '영어' };
let mode = 'poem';
let koreanMode = 'poem';
let work;
let stageIndex = 0;
let completedStages = new Set();
let stageTimer;
let lines = [];
let lineIndex = 0;
let composing = false;
let startedAt = null;
let clock = null;
let result = null;
let alignFrame = null;
let caretIndex = 0;
let animateNextLine = false;
let lineMotion;
let autoSpace = mobileTyping.matches;
let inputLanguage;
let activeGuideKeys = [];

let recordStorage;
try { recordStorage = window.localStorage; } catch { recordStorage = null; }
archivePracticeRecords(recordStorage, readCookie('records'));

function writeCookie(key, value) {
    try {
        const encoded = encodeURIComponent(JSON.stringify(value));
        if (encoded.length > 3500) return false;
        const directory = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
        const secure = location.protocol === 'https:' ? '; Secure' : '';
        const entry = 'narat-' + key + '=' + encoded;
        document.cookie = entry + '; Path=' + directory + '; Max-Age=31536000; SameSite=Lax' + secure;
        return document.cookie.split('; ').includes(entry);
    } catch {
        return false;
    }
}

function focusTyping() {
    typingInput.focus({ preventScroll: desktopTyping.matches });
}

function show(dialog, focus, resumeTyping = false) {
    if (resumeTyping) dialog.addEventListener('close', () => {
        if (desktopTyping.matches && !result && !document.querySelector('dialog[open]')) focusTyping();
    }, { once: true });
    dialog.showModal();
    focus?.focus();
}

function language() {
    return mode === 'en' ? 'en' : 'ko';
}

function buildGuideKeyboard() {
    const rows = keyboardRows.map(keys => {
        const row = document.createElement('div');
        row.className = 'guide-keyboard-row';
        for (const key of keys) {
            const cap = document.createElement('kbd');
            cap.className = 'guide-key';
            cap.dataset.key = key;
            cap.textContent = guideKeyNames[key] ?? key.toUpperCase();
            if (koreanKeyLabels[key]) {
                const korean = document.createElement('small');
                korean.textContent = koreanKeyLabels[key];
                cap.append(korean);
            }
            row.append(cap);
            guideKeys.set(key, cap);
        }
        return row;
    });
    byId('guide-keyboard').append(...rows);
}

function updateGuideLanguage() {
    const needsSwitch = inputLanguage && inputLanguage !== language();
    const label = inputLanguage === 'ko' ? 'KR' : inputLanguage === 'en' ? 'EN' : '대기';
    const note = needsSwitch ? (language() === 'ko' ? '한글로 바꿔 주세요.' : '영어로 바꿔 주세요.')
        : inputLanguage ? '마지막으로 입력한 언어예요.' : '입력하면 표시돼요.';
    if (guideLanguage.textContent !== label) guideLanguage.textContent = label;
    if (guideLanguageNote.textContent !== note) guideLanguageNote.textContent = note;
    guideLanguageNote.classList.toggle('guide-language-warning', Boolean(needsSwitch));
}

function observeInputLanguage(event) {
    const letter = event.data?.match(/[a-z\p{Script=Hangul}]/giu)?.at(-1);
    if (!letter) return;
    const detected = /\p{Script=Hangul}/u.test(letter) ? 'ko' : 'en';
    if (detected === inputLanguage) return;
    inputLanguage = detected;
    if (!practiceGuide.hidden) updateGuideLanguage();
}

function updatePracticeGuide(line, input, caret) {
    if (practiceGuide.hidden) return;
    const correct = line.target.filter((char, index) => line.input[index] === char).length;
    const percent = Math.floor(correct * 100 / line.target.length);
    guideProgress.value = percent;
    guideProgressValue.textContent = percent + '%';

    const composingChar = composing && input[caret - 1] !== line.input[caret - 1] ? input[caret - 1] : undefined;
    const position = composingChar ? caret - 1 : caret;
    const extra = input.length > line.target.length && position >= line.target.length;
    const hint = extra ? { key: 'Backspace', shift: false }
        : nextKeyFor(line.target[position], composingChar) ?? nextKeyFor(line.target[caret]);
    const caps = hint ? [guideKeys.get(hint.key), hint.shift ? guideKeys.get('Shift') : null].filter(Boolean) : [];
    for (const cap of activeGuideKeys) cap.classList.remove('is-next');
    for (const cap of caps) cap.classList.add('is-next');
    activeGuideKeys = caps;

    if (result) guideNextKey.textContent = '연습 완료';
    else if (extra) guideNextKey.textContent = '추가 입력 지우기';
    else if (hint && guideKeys.has(hint.key)) {
        guideNextKey.textContent = (hint.shift ? 'Shift + ' : '') + (guideKeyNames[hint.key] ?? hint.key.toUpperCase());
    } else if (line.target[position]) guideNextKey.textContent = '「' + line.target[position] + '」 입력';
    else guideNextKey.textContent = '앞쪽 입력을 확인해 주세요.';
}

function showPracticeGuide(open) {
    if (open && !guideKeys.size) buildGuideKeyboard();
    practiceGuide.hidden = !open;
    guideToggle.setAttribute('aria-expanded', String(open));
    practiceGuide.dataset.layout = language();
    if (open) {
        const line = lines[lineIndex];
        updateGuideLanguage();
        updatePracticeGuide(line, line.visibleInput ?? line.input, caretIndex);
    }
    scheduleAlignment();
}

function speedLabel(lang) {
    return lang === 'en' ? '분당 글자' : '타수';
}

function stopClock() {
    clearInterval(clock);
    clock = null;
}

function elapsed() {
    return startedAt === null ? 0 : performance.now() - startedAt;
}

function refreshStats() {
    const duration = elapsed();
    const score = result ?? scorePractice(lines, language(), duration);
    const speed = String(result || duration >= 1000 ? score.speed : 0);
    const accuracy = score.accuracy + '%';
    if (byId('wpm').textContent !== speed) byId('wpm').textContent = speed;
    if (byId('accuracy').textContent !== accuracy) byId('accuracy').textContent = accuracy;
}

function startClock() {
    if (startedAt !== null) return;
    startedAt = performance.now();
    clock = setInterval(refreshStats, 250);
}

function pickWork() {
    const pool = collections[mode];
    const available = pool.filter(item => item !== work);
    const choices = available.length ? available : pool;
    return choices[Math.floor(Math.random() * choices.length)];
}

function renderNovelStage() {
    const stage = work.stages?.[stageIndex];
    byId('novel-stage').hidden = !stage;
    if (!stage) return;
    byId('stage-title').textContent = stage.title + ' · 발췌';
    stageSteps.replaceChildren(...work.stages.map((item, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        const label = (index + 1) + '단계';
        button.textContent = label;
        button.setAttribute('aria-label', label + ' ' + item.title + (completedStages.has(index + 1) ? ' 완료' : ''));
        if (index === stageIndex) button.setAttribute('aria-current', 'step');
        if (completedStages.has(index + 1)) button.classList.add('is-done');
        button.addEventListener('click', event => {
            if (stageIndex === index) return;
            const focusTypingField = event.detail > 0 && desktopTyping.matches;
            startPractice(work, focusTypingField, index);
            if (!focusTypingField) stageSteps.querySelector('[aria-current="step"]')?.focus();
        });
        return button;
    }));
}

function startPractice(selectedWork = pickWork(), focus = false, selectedStage = 0) {
    stopStageCountdown();
    stopClock();
    startedAt = null;
    result = null;
    composing = false;
    animateNextLine = false;
    lineMotion?.cancel();
    resetInput();
    lineIndex = 0;
    if (selectedWork !== work) {
        completedStages = new Set(selectedWork.stages
            ? readPracticeRecords(recordStorage, readCookie('records'))
                .filter(record => record.title === selectedWork.title && record.author === selectedWork.author)
                .map(record => record.stage).filter(Number.isInteger)
            : []);
    }
    work = selectedWork;
    stageIndex = selectedStage;
    inputLanguage = undefined;
    autoSpace = mobileTyping.matches;
    const spacingHint = autoSpace ? '띄어쓰기는 자동으로 들어가요.' : '띄어쓰기도 직접 입력해 주세요.';
    const practiceHint = '문장부호까지 한 줄을 정확히 입력하면 자동으로 넘어가요. ' + spacingHint;
    byId('practice-hint').textContent = practiceHint;
    byId('help-typing-hint').textContent = practiceHint;
    const practiceLines = work.stages?.[stageIndex]?.lines ?? work.lines;
    lines = practiceLines.map(source => {
        const text = source.normalize('NFC');
        return { text, reference: Array.from(text), target: characters(text, autoSpace), input: [], attempts: 0, errors: 0 };
    }).filter(line => line.target.length);
    document.querySelectorAll('[data-language]').forEach(button => {
        const active = button.dataset.language === language();
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-mode]').forEach(button => {
        const active = button.dataset.mode === koreanMode;
        button.classList.toggle('selected', active);
        button.setAttribute('aria-pressed', String(active));
    });
    byId('poem-title').textContent = work.title;
    byId('poem-author').textContent = work.author;
    const sourceLink = byId('work-source');
    sourceLink.hidden = !work.source;
    if (work.source) sourceLink.href = work.source;
    renderNovelStage();
    byId('speed-label').textContent = language() === 'en' ? '분당 글자' : '타수';
    byId('speed-label').title = language() === 'en' ? '맞게 입력한 분당 글자 수' : '맞게 입력한 분당 한글 자소 수';
    typingInput.lang = language();
    typingInput.readOnly = false;
    practiceGuide.dataset.layout = language();
    if (!practiceGuide.hidden) updateGuideLanguage();
    renderWork();
    displayLine();
    refreshStats();
    if (focus) focusTyping();
}

function renderWork() {
    for (const line of lines) {
        const paragraph = document.createElement('div');
        paragraph.className = 'sentence-line';
        paragraph.lang = language();
        line.spans = [];
        line.displayCharacters = [];
        let word = document.createElement('span');
        word.className = 'word';
        paragraph.append(word);
        for (const char of line.reference) {
            if (isAutomatic(char, autoSpace)) {
                word.append(char);
            } else {
                const span = document.createElement('span');
                span.textContent = char;
                word.append(span);
                line.spans.push(span);
                line.displayCharacters.push(char);
            }
            if (/\s/u.test(char)) {
                word = document.createElement('span');
                word.className = 'word';
                paragraph.append(word);
            }
        }
        line.extra = document.createElement('span');
        line.extra.className = 'overflow-input';
        paragraph.append(line.extra);
        line.element = paragraph;
    }
    textDisplay.replaceChildren(...lines.map(line => line.element));
}

function displayLine(animate = false) {
    const line = lines[lineIndex];
    lines.forEach((item, index) => item.element.classList.toggle('active-line', index === lineIndex));
    byId('line-instruction').textContent = line.text;
    typingInput.value = '';
    resetInput();
    animateNextLine = animate;
    updateHighlights(line.input, line.input.length);
}

function updateHighlights(input, caret) {
    const line = lines[lineIndex];
    caretIndex = caret;
    const previousInput = line.visibleInput ?? [];
    const changedComposition = line.visibleComposing !== composing;
    line.spans.forEach((span, index) => {
        const typed = input[index];
        if (!changedComposition && previousInput[index] === typed) return;
        const text = typed === undefined || typed === line.target[index] ? line.displayCharacters[index] : typed;
        const inComposition = composing && typed !== undefined && typed !== line.input[index];
        if (span.textContent !== text) span.textContent = text;
        span.classList.toggle('composing', inComposition);
        span.classList.toggle('correct', !inComposition && typed === line.target[index]);
        span.classList.toggle('incorrect', !inComposition && typed !== undefined && typed !== line.target[index]);
    });
    line.spans[line.visibleCaret]?.classList.remove('active');
    line.spans[caret]?.classList.add('active');
    line.visibleInput = input;
    line.visibleCaret = caret;
    line.visibleComposing = composing;
    const extra = input.slice(line.target.length).join('');
    if (line.extra.textContent !== extra) line.extra.textContent = extra;
    line.extra.classList.toggle('incorrect', !!extra && !composing);
    line.extra.classList.toggle('composing', !!extra && composing);
    updatePracticeGuide(line, input, caret);
    scheduleAlignment();
}

function alignPassage() {
    const line = lines[lineIndex];
    if (!line?.element) return;
    const current = caretIndex >= line.spans.length && line.extra.textContent
        ? line.extra : line.spans[Math.min(caretIndex, line.spans.length - 1)];
    const bottom = current.offsetTop + current.offsetHeight + 16;
    const offset = Math.max(line.element.offsetTop, bottom - passage.clientHeight);
    const position = 'translateY(' + -offset + 'px)';
    const previous = textDisplay.style.transform;
    const shouldAnimate = animateNextLine && !reducedMotion.matches;
    animateNextLine = false;
    if (previous === position) return;
    lineMotion?.cancel();
    textDisplay.style.transform = position;
    if (shouldAnimate && previous && typeof textDisplay.animate === 'function') {
        lineMotion = textDisplay.animate(
            [{ transform: previous }, { transform: position }],
            { duration: 160, easing: 'cubic-bezier(.2,.65,.3,1)' },
        );
    }
}

function scheduleAlignment() {
    if (alignFrame !== null) return;
    alignFrame = requestAnimationFrame(() => {
        alignFrame = null;
        alignPassage();
    });
}

window.addEventListener('resize', scheduleAlignment);
mobileTyping.addEventListener('change', () => {
    if (startedAt === null) startPractice(work, false, stageIndex);
});
document.fonts?.addEventListener('loadingdone', scheduleAlignment);
passage.addEventListener('click', () => {
    if (result) show(resultDialog);
    else focusTyping();
});

function restoreMobileOffset(formatted, prefix) {
    let count = Array.from(prefix.normalize('NFC').replace(/\s/gu, '')).length;
    if (!count) return 0;
    let offset = 0;
    for (const char of formatted) {
        offset += char.length;
        if (!/\s/u.test(char) && --count === 0) return offset;
    }
    return formatted.length;
}

function readLineInput(value) {
    return readInput(value, lines[lineIndex].reference, autoSpace);
}

function countInputBefore(text) {
    return characters(text, autoSpace).length;
}

function acceptInput(selection) {
    if (result) return;
    composing = false;
    animateNextLine = false;
    lineMotion?.cancel();
    const line = lines[lineIndex];
    const value = typingInput.value;
    const start = typingInput.selectionStart ?? value.length;
    const end = typingInput.selectionEnd ?? start;
    const { input, formatted } = readLineInput(value);
    const caret = start === value.length ? input.length : countInputBefore(value.slice(0, start));
    // Only mobile spacing is rewritten, using the number of non-space characters to restore the caret.
    if (autoSpace && formatted !== value) {
        typingInput.value = formatted;
        typingInput.setSelectionRange(
            restoreMobileOffset(formatted, value.slice(0, start)),
            restoreMobileOffset(formatted, value.slice(0, end)),
        );
    }
    commitInput(line, input, selection);
    if (line.input.length) startClock();
    updateHighlights(line.input, caret);
    refreshStats();
    if (!isLineComplete(line)) return;
    if (lineIndex === lines.length - 1) finishPractice();
    else {
        lineIndex++;
        displayLine(true);
    }
}

const resetInput = bindTyping(typingInput, {
    countBefore: countInputBefore,
    preview(value, offset) {
        if (result) return;
        composing = true;
        animateNextLine = false;
        lineMotion?.cancel();
        const { input } = readLineInput(value);
        if (input.length) startClock();
        updateHighlights(input, offset === value.length ? input.length : countInputBefore(value.slice(0, offset)));
    },
    commit: acceptInput,
});
typingInput.addEventListener('input', observeInputLanguage, { capture: true });
typingInput.addEventListener('compositionupdate', observeInputLanguage);
typingInput.addEventListener('keyup', event => {
    if (result || composing || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    updateHighlights(lines[lineIndex].input, countInputBefore(typingInput.value.slice(0, typingInput.selectionStart)));
});
typingInput.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !composing && !event.isComposing && event.keyCode !== 229) {
        event.preventDefault();
    }
});
for (const eventName of ['paste', 'drop']) {
    typingInput.addEventListener(eventName, event => event.preventDefault());
}

function savePracticeRecord(record) {
    const recent = [record, ...practiceRecords(readCookie('records'))];
    const archived = archivePracticeRecords(recordStorage, recent);
    const records = recent.slice(0, 12);
    while (records.length > 1 && encodeURIComponent(JSON.stringify(records)).length > 3500) records.pop();
    return writeCookie('records', records) || archived;
}

function stopStageCountdown() {
    clearTimeout(stageTimer);
    stageTimer = undefined;
    stagePreview.classList.remove('is-counting');
    countdownText.textContent = '자동 이동 멈춤';
}

function openNextStage(focus = false) {
    if (!resultDialog.open || !result || !work.stages?.[stageIndex + 1]) return;
    stopStageCountdown();
    resultDialog.close();
    startPractice(work, focus, stageIndex + 1);
    if (!focus) stageSteps.querySelector('[aria-current="step"]')?.focus({ preventScroll: true });
}

function startStageCountdown() {
    if (document.hidden) return;
    const endAt = performance.now() + 5000;
    stagePreview.classList.add('is-counting');
    function tick() {
        if (!resultDialog.open || document.hidden) {
            stopStageCountdown();
            return;
        }
        const remaining = endAt - performance.now();
        if (remaining <= 0) {
            openNextStage(desktopTyping.matches);
            return;
        }
        const seconds = Math.ceil(remaining / 1000);
        countdownText.textContent = seconds + '초 후 자동 이동';
        stageTimer = setTimeout(tick, Math.max(1, remaining - (seconds - 1) * 1000));
    }
    tick();
}

function finishPractice() {
    const elapsedMs = elapsed();
    result = { ...scorePractice(lines, language(), elapsedMs), elapsedMs };
    stopClock();
    typingInput.readOnly = true;
    typingInput.blur();
    refreshStats();
    updatePracticeGuide(lines[lineIndex], lines[lineIndex].input, caretIndex);

    const stage = work.stages?.[stageIndex];
    const nextStage = work.stages?.[stageIndex + 1];
    if (stage) {
        completedStages.add(stageIndex + 1);
        renderNovelStage();
    }
    const heading = byId('modal-title');
    const allStagesDone = stage && work.stages.every((_, index) => completedStages.has(index + 1));
    heading.textContent = stage ? (allStagesDone && !nextStage ? '작품 연습 완료' : (stageIndex + 1) + '단계 완료') : '작성 완료';
    byId('result-work').textContent = work.title + ' · ' + (stage ? stage.title : work.author);
    stagePreview.hidden = !nextStage;
    byId('next-btn').hidden = Boolean(nextStage);
    byId('result-close-form').hidden = Boolean(nextStage);
    byId('close-result-btn').textContent = stage ? '그만하기' : '닫기';
    byId('retry-btn').textContent = stage ? '이 단계 다시' : '같은 작품 다시';
    if (nextStage) {
        byId('stage-preview-step').textContent = '다음 단계 · ' + (stageIndex + 2) + ' / ' + work.stages.length;
        byId('stage-preview-title').textContent = nextStage.title;
        byId('stage-preview-line').textContent = nextStage.lines[0];
    }
    byId('result-speed-label').textContent = speedLabel(language());
    byId('modal-wpm').textContent = result.speed;
    byId('modal-acc').textContent = result.accuracy + '%';
    byId('modal-errors').textContent = result.errors;
    byId('result-time').textContent = '연습 시간 ' + Math.round(result.elapsedMs / 1000) + '초';
    const savedAt = Date.now();
    const record = {
        id: crypto.randomUUID?.() ?? savedAt + '-' + Math.random().toString(36).slice(2), savedAt,
        title: work.title, author: work.author, language: language(), mode,
        ...(stage ? { stage: stageIndex + 1, stageTitle: stage.title } : {}),
        speed: result.speed, accuracy: result.accuracy, errors: result.errors,
        date: new Date(savedAt).toLocaleDateString('ko-KR'),
    };
    const saved = savePracticeRecord(record);
    byId('result-status').textContent = saved ? '이 브라우저에 기록을 저장했어요.' : '브라우저 저장 공간에 기록을 저장할 수 없어요.';
    show(resultDialog, heading);
    if (nextStage) startStageCountdown();
}

byId('continue-stage-btn').addEventListener('click', () => openNextStage(true));
byId('stop-stage-btn').addEventListener('click', () => {
    stopStageCountdown();
    resultDialog.close();
    stageSteps.querySelector('[aria-current="step"]')?.focus();
});
resultDialog.addEventListener('cancel', stopStageCountdown);
resultDialog.addEventListener('close', () => {
    if (!resultDialog.open) stopStageCountdown();
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopStageCountdown();
});
byId('retry-btn').addEventListener('click', () => {
    resultDialog.close();
    startPractice(work, true, stageIndex);
});
byId('next-btn').addEventListener('click', () => {
    resultDialog.close();
    startPractice(pickWork(), true);
});

byId('share-btn').addEventListener('click', async () => {
    if (!result) return;
    stopStageCountdown();
    const text = '나랏말싸미 · ' + work.title + '\n' + speedLabel(language()) + ' ' + result.speed + ' · 정확도 ' + result.accuracy + '%';
    try {
        if (navigator.share) {
            await navigator.share({ title: '나랏말싸미 연습 기록', text, url: location.href });
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            byId('result-status').textContent = '공유 문구를 복사했어요.';
        } else {
            byId('result-status').textContent = text;
        }
    } catch (error) {
        if (error.name !== 'AbortError') byId('result-status').textContent = '기록을 공유할 수 없어요. 잠시 후 다시 시도해 주세요.';
    }
});

const historyFilter = byId('history-filter');
function renderHistory() {
    const scope = historyFilter.value;
    const records = scope === 'legacy'
        ? [...practiceRecords(readLegacy('typingRecordsV2')), ...practiceRecords(readLegacy('typingRecords'))]
        : readPracticeRecords(recordStorage, readCookie('records'));
    const selected = records.filter(record => {
        if (scope === 'work') return record.title === work.title && record.author === work.author && record.mode === mode;
        if (scope === 'ko' || scope === 'en') return record.language === scope;
        return true;
    });
    const list = byId('ranking-list');
    list.replaceChildren();
    if (!selected.length) {
        const empty = document.createElement('li');
        empty.textContent = '이 범위에 저장된 기록이 없어요.';
        list.append(empty);
        return;
    }
    for (const record of selected) {
        const item = document.createElement('li');
        const title = document.createElement('strong');
        const metrics = document.createElement('p');
        title.textContent = Number.isInteger(record.stage)
            ? [record.title, record.stage + '단계', record.stageTitle].filter(Boolean).join(' · ')
            : record.title;
        metrics.textContent = scope === 'legacy'
            ? '이전 기록 · 타수 ' + (record.speed ?? record.wpm) + ' · 정확도 ' + (record.accuracy !== undefined ? record.accuracy + '%' : record.acc) + ' · ' + record.date
            : speedLabel(record.language) + ' ' + record.speed + ' · 정확도 ' + record.accuracy + '% · ' + record.date;
        item.append(title, metrics);
        list.append(item);
    }
}
function openHistory(event) {
    if (resultDialog.open) stopStageCountdown();
    historyFilter.value = 'all';
    renderHistory();
    show(historyDialog, null, event.detail > 0);
}
byId('history-btn').addEventListener('click', openHistory);
byId('ranking-btn').addEventListener('click', openHistory);
historyFilter.addEventListener('change', renderHistory);

document.querySelectorAll('[data-mode]').forEach(button => {
    button.addEventListener('click', () => {
        koreanMode = button.dataset.mode;
        if (mode === koreanMode) return;
        mode = koreanMode;
        startPractice();
    });
});
document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => {
        if (language() === button.dataset.language) {
            if (desktopTyping.matches && !result) focusTyping();
            return;
        }
        mode = button.dataset.language === 'en' ? 'en' : koreanMode;
        startPractice(undefined, desktopTyping.matches);
    });
});
byId('skip-btn').addEventListener('click', () => startPractice(undefined, desktopTyping.matches));

const searchInput = byId('search-input');
const searchFilter = byId('search-filter');
const searchIndex = Object.entries(collections).flatMap(([kind, texts]) => texts.map(text => ({
    text, kind, query: [text.title, text.author, ...(text.keywords ?? []), ...(text.stages ? ['소설', ...text.stages.map(stage => stage.title)] : [])]
        .join(' ').normalize('NFC').toLowerCase(),
})));

function renderSearch() {
    const query = searchInput.value.normalize('NFC').toLowerCase().trim().split(/\s+/u).filter(Boolean);
    const kind = searchFilter.value;
    const matches = searchIndex.filter(item => {
        const matchesKind = kind === 'novel' ? Boolean(item.text.stages) : kind === 'all' || item.kind === kind;
        return matchesKind && query.every(word => item.query.includes(word));
    });
    const list = byId('search-results');
    list.replaceChildren();
    for (const item of matches) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'search-result-card';
        const title = document.createElement('strong');
        const caption = document.createElement('span');
        title.textContent = item.text.title;
        const type = item.text.stages ? '소설 · ' + item.text.stages.length + '단계' : modeLabels[item.kind];
        caption.textContent = item.text.author + ' · ' + type;
        title.className = 'sr-title';
        caption.className = 'sr-author';
        button.append(title, caption);
        button.addEventListener('click', () => {
            mode = item.kind;
            if (mode !== 'en') koreanMode = mode;
            searchDialog.close();
            startPractice(item.text, true);
        });
        list.append(button);
    }
    byId('search-status').textContent = matches.length ? matches.length + '개 작품' : '찾는 작품이 없어요.';
    byId('clear-search-btn').hidden = matches.length > 0;
}
byId('search-btn').addEventListener('click', event => {
    searchInput.value = '';
    searchFilter.value = 'all';
    renderSearch();
    show(searchDialog, searchInput, event.detail > 0);
});
searchInput.addEventListener('input', renderSearch);
searchFilter.addEventListener('change', renderSearch);

const fontChoices = document.querySelectorAll('[data-font-choice]');
const themeChoices = document.querySelectorAll('[data-theme-choice]');
let font = initialFont;
let theme = settings && Array.from(themeChoices).some(button => button.dataset.themeChoice === settings.theme)
    ? settings.theme : 'light';

function applySettings() {
    applyTypeface(font);
    document.documentElement.dataset.theme = theme;
    for (const button of [...fontChoices, ...themeChoices]) {
        const selected = button.dataset.fontChoice === font || button.dataset.themeChoice === theme;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
    }
    alignPassage();
}
applySettings();
if (!savedSettings) writeCookie('settings', { font, theme });
for (const button of [...fontChoices, ...themeChoices]) {
    button.addEventListener('click', () => {
        font = button.dataset.fontChoice ?? font;
        theme = button.dataset.themeChoice ?? theme;
        applySettings();
        writeCookie('settings', { font, theme });
    });
}
const settingsTabs = document.querySelectorAll('.settings-tab-btn');
for (const tab of settingsTabs) {
    tab.addEventListener('click', () => {
        for (const other of settingsTabs) {
            const active = other === tab;
            other.classList.toggle('active', active);
            other.setAttribute('aria-pressed', String(active));
            byId(other.dataset.target).style.display = active ? 'block' : 'none';
        }
    });
}
byId('settings-btn').addEventListener('click', event => show(settingsDialog, null, event.detail > 0));

guideToggle.addEventListener('click', event => {
    showPracticeGuide(practiceGuide.hidden);
    if (event.detail > 0 && desktopTyping.matches && !result) focusTyping();
});
byId('settings-guide-btn').addEventListener('click', () => {
    settingsDialog.close();
    showPracticeGuide(true);
    guideToggle.focus();
});
byId('close-guide-btn').addEventListener('click', () => {
    showPracticeGuide(false);
    guideToggle.focus();
});
byId('clear-search-btn').addEventListener('click', () => {
    searchInput.value = '';
    searchFilter.value = 'all';
    renderSearch();
    searchInput.focus();
});

startPractice(undefined, desktopTyping.matches);
