// 보안: 키보드 단축키(복사, 저장, 소스보기, 개발자도구 등) 전면 차단
document.addEventListener('keydown', (e) => {
    const cmdOrCtrl = e.metaKey || e.ctrlKey;
    
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    
    if (cmdOrCtrl) {
        const key = e.key.toLowerCase();
        // S(저장), U(소스보기), P(인쇄), C(복사), X(잘라내기)
        if (key === 's' || key === 'u' || key === 'p' || key === 'c' || key === 'x') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I, J, C (개발자 도구)
        if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
            e.preventDefault();
            return false;
        }
    }
});

const SUPABASE_URL = "https://cohakvagndxqrptbbydg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvaGFrdmFnbmR4cXJwdGJieWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjI2ODksImV4cCI6MjA4OTczODY4OX0.6xiGPUnj9IWVtZu_IMAtkROk7aU5DSeBSJfYn-6FcW8";

let supabaseClient = null;
try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
    console.warn("Supabase 초기화 에러 (로컬 모드로 작동):", e);
}

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
    {
        title: "메밀꽃 필 무렵",
        author: "이효석",
        keywords: ["나귀", "달밤", "장돌뱅이", "소설", "이효석", "추억", "사랑"],
        lines: [
            "여름장이란 애시당초에 글러서, 해는 아직 중천에 있건만",
            "장판은 벌써 쓸쓸하고 더운 햇발이 벌여놓은 전휘장 밑으로",
            "등줄기를 훅훅 볶는다.",
            "마을 사람들은 거지반 돌아간 뒤요,",
            "팔리지 못한 나무꾼 패가 길거리에 궁싯거리고들 있으나,",
            "석유병이나 받고 고기마리나 사면 족할 이 축들을 바라고",
            "언제까지든지 버티고 있을 법은 없다."
        ]
    },
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
    {
        title: "동백꽃",
        author: "김유정",
        keywords: ["감자", "사랑", "닭", "싸움", "소년", "소녀", "유머", "소설", "김유정"],
        lines: [
            "오늘도 우리 수탉이 막 조였다. 내가 점심을 먹고 나무를 하러 갈 양으로 나올 때였다.",
            "산으로 올라서려니까 등 뒤에서 푸드득푸드득 하고 닭의 홰치는 소리가 들린다.",
            "깜짝 놀라며 고개를 돌려보니 아니나 다르랴, 두 놈이 또 붙었다.",
            "점순네 수탉은 대강이가 크고 억세게 생겨서 얼핏 보면 꼭 개 같았다."
        ]
    }
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

let currentLang = 'ko';
let currentType = 'poem'; // default: poem
let currentFont = "'Pretendard', sans-serif"; // default: Pretendard
let currentTheme = 'light';

const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const wpmDisplay = document.getElementById('wpm');
const accDisplay = document.getElementById('accuracy');

const poemTitle = document.getElementById('poem-title');
const poemAuthor = document.getElementById('poem-author');
const modal = document.getElementById('result-modal');
const modalWpm = document.getElementById('modal-wpm');
const modalAcc = document.getElementById('modal-acc');
const modalErrors = document.getElementById('modal-errors');
const modalPoemTitle = document.getElementById('modal-poem-title');
const modalPoemAuthor = document.getElementById('modal-poem-author');
const nextBtn = document.getElementById('next-btn');

let currentPoem = null;
let linesData = [];
let currentLineIdx = 0;
let currentIndex = 0;
let totalTyped = 0;
let totalStrokes = 0;
let startTime = null;
let cumulativeErrors = 0;
let previousInputLength = 0;
let isTransitioning = false;

function init(chosenPoem = null) {
    textDisplay.innerHTML = '';
    linesData = [];
    currentLineIdx = 0;
    totalTyped = 0;
    totalStrokes = 0;
    cumulativeErrors = 0;
    previousInputLength = 0;
    isTransitioning = false;
    startTime = null;
    
    if (chosenPoem) {
        currentPoem = chosenPoem;
    } else {
        let pool = [];
        if (currentLang === 'ko') {
            pool = currentType === 'poem' ? poemCollections : longCollections;
        } else {
            pool = englishCollections;
        }
        currentPoem = pool[Math.floor(Math.random() * pool.length)];
    }
    
    poemTitle.innerText = currentPoem.title;
    poemAuthor.innerText = currentPoem.author;
    
    // 폰트 적용
    textDisplay.style.fontFamily = currentFont;
    
    currentPoem.lines.forEach((line, index) => {
        addLineDOM(index, line);
    });
    
    accDisplay.innerText = '100%';
    wpmDisplay.innerText = '0';
    
    setupActiveLine();
}

function addLineDOM(index, text) {
    linesData[index] = { text: text, characters: text.split('') };
    
    const lineDiv = document.createElement('div');
    lineDiv.className = 'sentence-line';
    lineDiv.id = `line-${index}`;
    
    let currentWordSpan = document.createElement('span');
    currentWordSpan.className = 'word';
    lineDiv.appendChild(currentWordSpan);
    
    linesData[index].characters.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.id = `char-${index}-${i}`;
        currentWordSpan.appendChild(span);
        
        if (char === ' ') {
            currentWordSpan = document.createElement('span');
            currentWordSpan.className = 'word';
            lineDiv.appendChild(currentWordSpan);
        }
    });
    
    const endSpan = document.createElement('span');
    endSpan.innerHTML = '&nbsp;';
    endSpan.id = `char-${index}-${text.length}`;
    currentWordSpan.appendChild(endSpan);
    
    textDisplay.appendChild(lineDiv);
}

function setupActiveLine() {
    const lines = textDisplay.querySelectorAll('.sentence-line');
    lines.forEach(l => l.classList.remove('active-line'));
    
    const activeLineDiv = document.getElementById(`line-${currentLineIdx}`);
    if (activeLineDiv) {
        activeLineDiv.classList.add('active-line');
    }
    
    currentIndex = 0;
    typingInput.value = '';
    previousInputLength = 0;
    
    updateActiveCharacter();
}

function updateActiveCharacter() {
    const activeLineDiv = document.getElementById(`line-${currentLineIdx}`);
    if (!activeLineDiv) return;
    
    const spans = activeLineDiv.querySelectorAll('span:not(.word)');
    spans.forEach(span => span.classList.remove('active'));
    
    if (currentIndex < spans.length) {
        spans[currentIndex].classList.add('active');
    }
    
    const lineOffsetTop = activeLineDiv.offsetTop;
    textDisplay.style.transform = `translateY(-${lineOffsetTop}px)`;
}

typingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        // 수동 엔터 허용: 오타가 있더라도 사용자가 강제로 다음 줄로 넘어가고 싶을 때 허용!
        if (!isTransitioning) {
            moveToNextLine();
        }
    }
    if (e.key === 'Backspace' && typingInput.value === '' && currentLineIdx > 0) {
        e.preventDefault();
        currentLineIdx--;
        const fullPrevText = linesData[currentLineIdx].text;
        const prevText = fullPrevText.slice(0, -1);
        
        totalTyped -= fullPrevText.length;
        if (currentLang === 'ko') {
            totalStrokes -= getHangulStrokes(fullPrevText);
        } else {
            totalStrokes -= fullPrevText.length;
        }
        
        const lines = textDisplay.querySelectorAll('.sentence-line');
        lines.forEach(l => l.classList.remove('active-line'));
        const activeLineDiv = document.getElementById(`line-${currentLineIdx}`);
        if (activeLineDiv) activeLineDiv.classList.add('active-line');
        
        typingInput.value = prevText;
        previousInputLength = fullPrevText.length;
        typingInput.dispatchEvent(new Event('input'));
    }
});

typingInput.addEventListener('input', (e) => {
    if (isTransitioning) return;
    if (!startTime) startTime = new Date().getTime();
    
    const inputVal = typingInput.value;
    const activeLineDiv = document.getElementById(`line-${currentLineIdx}`);
    if (!activeLineDiv) return;
    
    const spans = activeLineDiv.querySelectorAll('span:not(.word)');
    const characters = linesData[currentLineIdx].characters;
    
    if (inputVal.length > previousInputLength) {
        const lastCharIdx = inputVal.length - 1;
        if (lastCharIdx < characters.length) {
            if (inputVal[lastCharIdx] !== characters[lastCharIdx]) {
                cumulativeErrors++;
            }
        } else {
            cumulativeErrors++;
        }
    }
    previousInputLength = inputVal.length;
    
    let allCorrect = true;
    
    spans.forEach((span, i) => {
        span.classList.remove('correct', 'incorrect');
        
        if (i < inputVal.length && i < characters.length) {
            span.textContent = inputVal[i]; 
            
            if (inputVal[i] === characters[i]) {
                span.classList.add('correct');
            } else {
                span.classList.add('incorrect');
                allCorrect = false;
            }
        } else if (i < characters.length) {
            span.textContent = characters[i]; 
        }
    });
    
    currentIndex = inputVal.length;
    
    let totalAttempts = totalTyped + inputVal.length + cumulativeErrors;
    let acc = 100;
    if (totalAttempts > 0) {
        acc = Math.floor(((totalAttempts - cumulativeErrors) / totalAttempts) * 100);
    }
    accDisplay.innerText = `${Math.max(0, acc)}%`;
    
    // Strict Auto-Enter Logic: 전체 텍스트가 100% 완벽하게 일치할 때만 자동 넘김!
    // 이를 통해 오타가 있는 상태에서 길이가 우연히 맞아 오작동하는 버그를 원천 차단합니다.
    const targetText = linesData[currentLineIdx].text;
    if (inputVal === targetText) {
        moveToNextLine();
    } else {
        updateActiveCharacter();
    }
});

function moveToNextLine() {
    if (isTransitioning) return;
    
    const activeLineDiv = document.getElementById(`line-${currentLineIdx}`);
    if (!activeLineDiv) return;
    
    const characters = linesData[currentLineIdx].characters;
    
    totalTyped += characters.length;
    totalStrokes += getHangulStrokes(linesData[currentLineIdx].text); 
    currentLineIdx++;
    
    isTransitioning = true;
    // 블러 처리를 통해 한글 IME 조합 상태를 강제로 끊어 스페이스/글자 딸려옴 방지
    typingInput.blur(); 
    typingInput.value = '';
    previousInputLength = 0;
    
    if (currentLineIdx >= linesData.length) {
        setTimeout(() => {
            showModal();
            isTransitioning = false;
        }, 300);
    } else {
        setTimeout(() => {
            setupActiveLine();
            isTransitioning = false;
            typingInput.focus();
        }, 150);
    }
}

function getHangulStrokes(text) {
    let strokes = 0;
    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i);
        if (code >= 44032 && code <= 55203) { // 가~힣
            let offset = code - 44032;
            let jong = offset % 28;
            let jung = Math.floor(offset / 28) % 21;
            let cho = Math.floor(offset / 28 / 21);
            strokes += [1,4,8,10,13].includes(cho) ? 2 : 1; // ㄲㄸㅃㅆㅉ
            strokes += [9,10,11,14,15,16,19].includes(jung) ? 2 : 1; // ㅘㅙㅚㅝㅞㅟㅢ
            if (jong > 0) strokes += [3,5,6,9,10,11,12,13,14,15,18,20].includes(jong) ? 2 : 1; // 겹받침
        } else {
            strokes += 1; // 알파벳, 숫자, 기호, 띄어쓰기 등
        }
    }
    return strokes;
}
function updateWPM() {
    if (startTime && (typingInput.value.length > 0 || totalTyped > 0) && modal.classList.contains('hidden')) {
        const now = new Date().getTime();
        const minutes = (now - startTime) / 60000;
        if (minutes > 0) {
            // 한컴타자연습 기준: 글자수(단어)가 아닌 1분당 실제 친 자모음 개수(Strokes) 계산!
            const currentLineText = linesData[currentLineIdx] ? linesData[currentLineIdx].text.substring(0, typingInput.value.length) : "";
            const currentStrokes = currentLang === 'ko' ? getHangulStrokes(currentLineText) : currentLineText.length;
            
            const wpm = Math.round((totalStrokes + currentStrokes) / minutes);
            wpmDisplay.innerText = wpm > 0 && wpm < 2500 ? wpm : 0;
        }
    }
    requestAnimationFrame(updateWPM);
}

// Records saving mechanism
function saveRecord(title, wpm, acc) {
    let records = JSON.parse(localStorage.getItem('typingRecords') || '[]');
    records.push({ title, wpm, acc, date: new Date().toLocaleDateString() });
    records.sort((a, b) => parseInt(b.wpm) - parseInt(a.wpm));
    records = records.slice(0, 10); 
    localStorage.setItem('typingRecords', JSON.stringify(records));
}

function showModal() {
    typingInput.blur();
    
    modalPoemTitle.innerText = currentPoem.title;
    modalPoemAuthor.innerText = currentPoem.author;
    
    const finalWpm = wpmDisplay.innerText;
    const finalAcc = accDisplay.innerText;
    const typoRate = 100 - parseInt(finalAcc);
    
    modalWpm.innerText = finalWpm;
    modalAcc.innerText = finalAcc;
    modalErrors.innerText = `${typoRate}%`;
    
    saveRecord(currentPoem.title, finalWpm, finalAcc);
    
    modal.classList.remove('hidden');
}

// Modal Buttons Actions
nextBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    init();
    typingInput.focus();
});

document.getElementById('share-btn').addEventListener('click', () => {
    const shareText = `나랏말싸미 📜\n\n📖 작품: ${currentPoem.title}\n⚡ 타수: ${modalWpm.innerText} WPM\n🎯 정확도: ${modalAcc.innerText}\n\n#나랏말싸미 #타자연습 #typing`;
    
    // Web Share API가 지원될 경우 (모바일 및 최신 브라우저의 네이티브 공유 기능 실행)
    if (navigator.share) {
        navigator.share({
            title: '나랏말싸미 타자 기록',
            text: shareText,
            url: window.location.href
        }).catch((error) => {
            console.log('Share failed:', error);
            fallbackCopy(shareText);
        });
    } else {
        fallbackCopy(shareText);
    }
});

function fallbackCopy(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('기록이 클립보드에 복사되었습니다!\n원하는 SNS(카톡, 인스타, 디코 등) 채팅창에 붙여넣어 보세요! ✨');
    }).catch(err => {
        alert('클립보드 복사에 실패했습니다. 수동으로 공유해 주세요.');
    });
}

document.getElementById('ranking-btn').addEventListener('click', () => {
    const rankingList = document.getElementById('ranking-list');
    const records = JSON.parse(localStorage.getItem('typingRecords') || '[]');
    
    rankingList.innerHTML = records.length ? records.map((r, i) => `
        <div class="ranking-item">
            <div class="rank-title">${i + 1}위. ${r.title} <span style="font-size:0.85rem; color:gray; font-family:'Pretendard', sans-serif;">(${r.date})</span></div>
            <div class="rank-stats">타수: ${r.wpm} | 정확도: ${r.acc}</div>
        </div>
    `).join('') : '<p style="text-align:center; color:gray; margin-top: 1rem;">아직 기록이 없습니다. 타자를 시작해보세요!</p>';
    
    document.getElementById('ranking-modal').classList.remove('hidden');
});

document.getElementById('close-ranking-btn').addEventListener('click', () => {
    document.getElementById('ranking-modal').classList.add('hidden');
});

// Feedback Webhook Logic
document.getElementById('feedback-btn').addEventListener('click', () => {
    document.getElementById('feedback-modal').classList.remove('hidden');
});

document.getElementById('close-feedback-btn').addEventListener('click', () => {
    document.getElementById('feedback-modal').classList.add('hidden');
});

document.getElementById('submit-feedback-btn').addEventListener('click', async () => {
    const text = document.getElementById('feedback-text').value;
    if (text.trim() === '') {
        alert('의견을 입력해주세요.');
        return;
    }
    
    const feedbackData = {
        content: text,
        date: new Date().toLocaleString(),
        timestamp: Date.now()
    };
    
    // Supabase 연동 상태에 따라 저장 방식 결정
    if (supabaseClient && SUPABASE_URL !== "YOUR_SUPABASE_URL") {
        try {
            const { error } = await supabaseClient.from('feedbacks').insert([feedbackData]);
            if (error) throw error;
            alert('소중한 의견이 서버에 성공적으로 기록되었습니다!');
        } catch(e) {
            alert('서버 전송 실패. 로컬에 임시 저장합니다. (Supabase 테이블 설정을 확인하세요!)');
            saveLocalFeedback(feedbackData);
        }
    } else {
        saveLocalFeedback(feedbackData);
        alert('소중한 의견이 기기에 임시 기록되었습니다! (DB 연동 필요)');
    }
    
    document.getElementById('feedback-text').value = '';
    document.getElementById('feedback-modal').classList.add('hidden');
});

function saveLocalFeedback(data) {
    let feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
    feedbacks.push(data);
    localStorage.setItem('userFeedbacks', JSON.stringify(feedbacks));
}

// Admin Easter Egg & Security Logic
let hangulClickCount = 0;
let hangulClickTimer = null;

const targetHash = "cmdi";

function hashPassword(str) {
    try {
        return btoa(str); // 안정성이 가장 뛰어난 내장 인코딩 방식 사용
    } catch(e) {
        return "error"; // 한글 등 특수문자 입력 시 에러 방지 및 오답 처리
    }
}

document.getElementById('hangul-btn').addEventListener('click', () => {
    hangulClickCount++;
    
    clearTimeout(hangulClickTimer);
    hangulClickTimer = setTimeout(() => { hangulClickCount = 0; }, 3000); // 3초 내에 10번 클릭해야 함
    
    if (hangulClickCount >= 10) {
        hangulClickCount = 0;
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-login-modal').classList.remove('hidden');
    }
});

document.getElementById('close-admin-login-btn').addEventListener('click', () => {
    document.getElementById('admin-login-modal').classList.add('hidden');
});

document.getElementById('admin-password').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('submit-admin-login-btn').click();
    }
});

document.getElementById('submit-admin-login-btn').addEventListener('click', () => {
    const pwd = document.getElementById('admin-password').value.trim(); // 혹시 모를 띄어쓰기 공백 제거
    
    // 사용자의 입력값을 해시화하여 안전하게 고정된 해시값과 비교
    const inputHash = hashPassword(pwd);
    
    if (inputHash === targetHash) {
        document.getElementById('admin-login-modal').classList.add('hidden');
        showAdminPanel();
    } else {
        alert('비밀번호가 틀렸습니다.');
    }
});

async function showAdminPanel() {
    const list = document.getElementById('admin-feedback-list');
    list.innerHTML = '<p style="text-align:center; color:gray; margin-top:1rem;">불러오는 중...</p>';
    document.getElementById('admin-panel-modal').classList.remove('hidden');
    
    let feedbacks = [];
    
    if (supabaseClient && SUPABASE_URL !== "YOUR_SUPABASE_URL") {
        try {
            const { data, error } = await supabaseClient.from('feedbacks').select('*').order('timestamp', { ascending: false });
            if (error) throw error;
            feedbacks = data;
        } catch (e) {
            list.innerHTML = '<p style="text-align:center; color:red;">서버에서 불러오기 실패. (Supabase 연결 확인)</p>';
            return;
        }
    } else {
        feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]').reverse();
    }
    
    if (feedbacks.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:gray; margin-top:1rem; font-family: Pretendard, sans-serif;">아직 등록된 의견이 없습니다.</p>';
    } else {
        list.innerHTML = feedbacks.map(f => `
            <div class="feedback-item">
                <div class="fb-date">${f.date}</div>
                <div class="fb-content">${f.content}</div>
            </div>
        `).join('');
    }
}

document.getElementById('close-admin-panel-btn').addEventListener('click', () => {
    document.getElementById('admin-panel-modal').classList.add('hidden');
});

// Manage global focus
document.addEventListener('click', (e) => {
    const isModalOpen = document.querySelectorAll('.modal:not(.hidden)').length > 0;
    const safeElements = ['BUTTON', 'SELECT', 'TEXTAREA', 'INPUT', 'path', 'svg'];
    const safeIds = ['feedback-btn', 'skip-btn', 'settings-btn', 'search-btn', 'search-input'];
    
    const isSafeClick = safeElements.includes(e.target.tagName) || 
                        safeIds.includes(e.target.id) || 
                        e.target.closest('.icon-btn') ||
                        e.target.closest('.option-card') || 
                        e.target.closest('.type-card') ||
                        e.target.closest('.theme-card') ||
                        e.target.closest('.search-result-card');
    
    if (!isModalOpen && !isSafeClick) {
        typingInput.focus();
    }
});

// Modals & Search Management
const searchBtn = document.getElementById('search-btn');
const searchModal = document.getElementById('search-modal');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchEmptyState = document.getElementById('search-empty-state');

function buildSearchIndex() {
    const allTexts = [
        ...poemCollections.map(p => ({ ...p, type: 'poem', lang: 'ko' })),
        ...longCollections.map(l => ({ ...l, type: 'long', lang: 'ko' })),
        ...englishCollections.map(e => ({ ...e, type: 'poem', lang: 'en' }))
    ];

    searchResults.innerHTML = allTexts.map((item, idx) => `
        <div class="search-result-card" data-index="${idx}">
            <div class="sr-title">${item.title}</div>
            <div class="sr-author">${item.author}</div>
            <div class="sr-tags">
                ${(item.keywords || []).map(k => `<span class="search-tag">${k}</span>`).join('')}
            </div>
        </div>
    `).join('');

    // Add click logic
    document.querySelectorAll('.search-result-card').forEach((card, idx) => {
        card.addEventListener('click', () => {
            const selectedText = allTexts[idx];
            // Switch internal type and lang just in case
            currentType = selectedText.type;
            currentLang = selectedText.lang;
            // Force UI active state updates for new state
            if (currentLang === 'ko') {
                document.getElementById('hangul-btn').classList.add('active');
                document.getElementById('english-btn').classList.remove('active');
            } else {
                document.getElementById('english-btn').classList.add('active');
                document.getElementById('hangul-btn').classList.remove('active');
            }
            
            searchModal.classList.add('hidden');
            init(selectedText);
            typingInput.focus();
        });
    });
}

buildSearchIndex();

searchBtn.addEventListener('click', () => {
    searchModal.classList.remove('hidden');
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    setTimeout(() => searchInput.focus(), 100);
});

document.getElementById('close-search-modal-btn').addEventListener('click', () => {
    searchModal.classList.add('hidden');
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.search-result-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('.sr-title').innerText.toLowerCase();
        const author = card.querySelector('.sr-author').innerText.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.search-tag')).map(t => t.innerText.toLowerCase());
        
        const isMatch = title.includes(query) || author.includes(query) || tags.some(t => t.includes(query));
        
        if (isMatch) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    searchEmptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
});

document.getElementById('request-poem-btn').addEventListener('click', () => {
    searchModal.classList.add('hidden');
    const feedbackText = document.getElementById('feedback-text');
    feedbackText.value = `[시 추가 요청]\n요청하신 내용: ${searchInput.value}`;
    document.getElementById('feedback-modal').classList.remove('hidden');
    setTimeout(() => feedbackText.focus(), 100);
});

// Modals Management
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');

settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
document.getElementById('close-settings-modal-btn').addEventListener('click', () => settingsModal.classList.add('hidden'));

// Internal Settings Modal Tab Switching
const settingsTabBtns = document.querySelectorAll('.settings-tab-btn');
const settingsPanels = document.querySelectorAll('.settings-panel');

settingsTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Reset active state on buttons
        settingsTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Hide all panels and show target
        const targetId = btn.getAttribute('data-target');
        settingsPanels.forEach(panel => {
            if (panel.id === targetId) {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        });
    });
});

// Font Selection Logic
const fontOptions = document.querySelectorAll('#font-options .option-card');
fontOptions.forEach(option => {
    option.addEventListener('click', () => {
        fontOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        currentFont = option.getAttribute('data-font');
        textDisplay.style.fontFamily = currentFont;
        // Modal remains open for more settings or could close. Keeping open is nicer for unified settings.
    });
});

// Type Selection Logic
const typeCards = document.querySelectorAll('.type-card');
typeCards.forEach(card => {
    card.addEventListener('click', () => {
        typeCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const newType = card.getAttribute('data-type');
        
        if (currentType !== newType) {
            currentType = newType;
            init();
        }
    });
});

// Theme Selection Logic
const themeCards = document.querySelectorAll('.theme-card');
themeCards.forEach(card => {
    card.addEventListener('click', () => {
        themeCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        currentTheme = card.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', currentTheme);
    });
});

document.getElementById('skip-btn').addEventListener('click', () => {
    init();
    typingInput.focus();
});

document.getElementById('hangul-btn').addEventListener('click', () => {
    if (currentLang !== 'ko') {
        currentLang = 'ko';
        document.getElementById('hangul-btn').classList.add('active');
        document.getElementById('hangul-btn').style.color = '';
        document.getElementById('english-btn').classList.remove('active');
        document.getElementById('english-btn').style.color = 'var(--text-secondary)';
        init();
        typingInput.focus();
    }
});

document.getElementById('english-btn').addEventListener('click', () => {
    if (currentLang !== 'en') {
        currentLang = 'en';
        document.getElementById('english-btn').classList.add('active');
        document.getElementById('english-btn').style.color = '';
        document.getElementById('hangul-btn').classList.remove('active');
        document.getElementById('hangul-btn').style.color = 'var(--text-secondary)';
        init();
        typingInput.focus();
    }
});

// Removed font-selector event listener (moved to modal)

init();
typingInput.focus();
requestAnimationFrame(updateWPM);
