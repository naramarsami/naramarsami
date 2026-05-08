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

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC09ckhYiiZwyWpL4qDPB2MCWIZP8DrHRA",
    authDomain: "naramarsami-b85a7.firebaseapp.com",
    projectId: "naramarsami-b85a7",
    storageBucket: "naramarsami-b85a7.firebasestorage.app",
    messagingSenderId: "956231831002",
    appId: "1:956231831002:web:828c8096375a255ef344e3",
    measurementId: "G-Z4RNVJSKQ3"
};

let db = null;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) {
    console.warn("Firebase가 아직 설정되지 않았습니다. 로컬 모드로 작동합니다.");
}

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
    
    const feedbackData = {
        content: text,
        date: new Date().toLocaleString(),
        timestamp: Date.now()
    };
    
    // Firebase 연동 상태에 따라 저장 방식 결정
    if (db && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        try {
            await addDoc(collection(db, "feedbacks"), feedbackData);
            alert('소중한 의견이 서버에 성공적으로 기록되었습니다!');
        } catch(e) {
            alert('서버 전송 실패. 로컬에 임시 저장합니다.');
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

const targetHash = "-1873070671";

function hashPassword(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
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
    
    if (db && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        try {
            const q = query(collection(db, "feedbacks"), orderBy("timestamp", "desc"));
            const snapshot = await getDocs(q);
            snapshot.forEach(doc => feedbacks.push(doc.data()));
        } catch (e) {
            list.innerHTML = '<p style="text-align:center; color:red;">서버에서 불러오기 실패</p>';
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
    if (!isModalOpen && e.target.tagName !== 'BUTTON' && e.target.id !== 'feedback-btn') {
        typingInput.focus();
    }
});

init();
typingInput.focus();
requestAnimationFrame(updateWPM);
