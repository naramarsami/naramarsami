import { additionalPoems, koreanNovels } from './korean-literature.mjs?v=12';

const poemCollections = [
    {
        slug: 'hunminjeongeum-preface',
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
        slug: 'star-counting-night',
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
        slug: 'azaleas',
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
        slug: 'prologue',
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
        slug: 'chohon',
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
        slug: 'silence-of-love',
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
        slug: 'aegukga',
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
        slug: 'the-road-not-taken',
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
        slug: 'daffodils',
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
        slug: 'ozymandias',
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

export const collections = {
    poem: [...poemCollections, ...additionalPoems],
    long: longCollections,
    en: englishCollections,
};

export const practiceWorks = Object.entries(collections).flatMap(([mode, works]) =>
    works.map(work => ({ mode, work })),
);
