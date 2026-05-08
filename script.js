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

const textCollections = [
    {
        title: "훈민정음 언해본 서문",
        author: "세종대왕",
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
        title: "메밀꽃 필 무렵",
        author: "이효석",
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
        title: "서시",
        author: "윤동주",
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
    }
];

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
let startTime = null;
let cumulativeErrors = 0;
let previousInputLength = 0;
let isTransitioning = false;

function init() {
    textDisplay.innerHTML = '';
    linesData = [];
    currentLineIdx = 0;
    totalTyped = 0;
    cumulativeErrors = 0;
    previousInputLength = 0;
    isTransitioning = false;
    startTime = null;
    
    currentPoem = textCollections[Math.floor(Math.random() * textCollections.length)];
    poemTitle.innerText = currentPoem.title;
    poemAuthor.innerText = currentPoem.author;
    
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
    
    // Auto-Enter Logic with IME Blur Bug Fix
    if (inputVal.length >= characters.length && allCorrect) {
        totalTyped += characters.length;
        currentLineIdx++;
        
        isTransitioning = true;
        // 핵심 수정: 블러 처리를 통해 한글 IME 조합 상태를 강제로 끊어 스페이스/글자 딸려옴 방지
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
    } else {
        updateActiveCharacter();
    }
});

function updateWPM() {
    if (startTime && (typingInput.value.length > 0 || totalTyped > 0) && modal.classList.contains('hidden')) {
        const now = new Date().getTime();
        const minutes = (now - startTime) / 60000;
        if (minutes > 0) {
            const wpm = Math.round(((totalTyped + typingInput.value.length) / 5) / minutes);
            wpmDisplay.innerText = wpm > 0 && wpm < 1500 ? wpm : 0;
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
    const text = `나랏말싸미 📜\n[${currentPoem.title}] 타수: ${modalWpm.innerText} | 정확도: ${modalAcc.innerText}\n#나랏말싸미 #한글타자`;
    navigator.clipboard.writeText(text).then(() => {
        alert('기록이 클립보드에 복사되었습니다! SNS에 자랑해보세요.');
    });
});

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
    
    // 디스코드 웹훅 연동 (개발자가 본인 웹훅 주소로 변경하면 실제 디스코드로 메시지가 감)
    const webhookUrl = "여기에_디스코드_웹훅_URL을_붙여넣으세요"; 
    
    if (webhookUrl.includes("여기에")) {
        alert('소중한 의견이 기록되었습니다! (감사합니다!)');
    } else {
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    content: `📜 **나랏말싸미 새 의견 도착**\n> ${text}` 
                })
            });
            alert('소중한 의견이 성공적으로 전송되었습니다!');
        } catch(error) {
            alert('전송 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
        }
    }
    
    document.getElementById('feedback-text').value = '';
    document.getElementById('feedback-modal').classList.add('hidden');
});

// Manage global focus
document.addEventListener('click', (e) => {
    const isModalOpen = document.querySelectorAll('.modal:not(.hidden)').length > 0;
    if (!isModalOpen && e.target.tagName !== 'BUTTON' && e.target.id !== 'feedback-btn') {
        typingInput.focus();
    }
});

init();
typingInput.focus();
requestAnimationFrame(updateWPM);
