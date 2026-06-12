// ==========================================================================
// 🧠 [전역 난이도 설정 및 상태 변수] - 다국어 동기화 및 트롤링 방지벽 완비
// ==========================================================================

const userLocale = localStorage.getItem('global_lang') === 'ko' ? 'ko' : 'en';

// 🌟 [핵심 연동] 판단된 최종 언어셋을 i18n 패키지에 주입 후 즉시 화면 리렌더링
if (typeof i18n !== 'undefined') {
    i18n.setLang(userLocale);
    if (typeof i18n.updateUITranslations === 'function') {
        i18n.updateUITranslations();
    }
}

let currentDifficulty = 'normal'; // 기본값: 일반 모드
let isGaming = false;              // 현재 대포가 발사 중인지 체크하는 마스터 플래그

// 💡 인간이 초집중할 수 있는 20~25초 골든 타임과 가변형 발사수 스윗 스팟 설정
const DIFFICULTY_CONFIG = {
    easy: {
        playTime: 20000,    // ⏱️ 골든 타임 20초 (시니어층 인지 피로도를 고려한 상한선)
        totalBallsMin: 10,   // 🥎 최소 10발에서
        totalBallsMax: 13,   // 🥎 최대 13발 사이로 매 판 총 수량이 비밀스럽게 가변됨!
        intervalMin: 1.4,   
        intervalRange: 0.6,
        speedCoef: 0.0026,  
        minSpeed: 0.65,     
        maxSpeed: 0.95,     
        activeCannons: 2,   // 1번, 2번 대포만 활성화 (3번은 숨김)
        minPerCannon: 3     // 각 대포당 최소 3발 무조건 보장 (0~2발 억까 방지)
    },
    normal: {
        playTime: 20000,    // ⏱️ 초집중 골든 타임 20초 (가장 몰입감이 뛰어난 최적의 시간)
        totalBallsMin: 16,   // 🥎 최소 16발에서
        totalBallsMax: 20,   // 🥎 최대 20발 사이로 매 판 총 수량이 비밀스럽게 가변됨!
        intervalMin: 0.9,   
        intervalRange: 0.4,
        speedCoef: 0.0020,
        minSpeed: 0.50,
        maxSpeed: 0.80,
        activeCannons: 3,   // 대포 3개 전체 사용
        minPerCannon: 3     // 각 대포당 최소 3발 무조건 보장 (0~2발 억까 방지)
    },
    hard: {
        playTime: 25000,    // ⏱️ 한계 돌파 25초 (도파민과 집중력을 100% 쏟아붓는 마지노선)
        totalBallsMin: 32,   // 🥎 최소 32발에서
        totalBallsMax: 38,   // 🥎 최대 38발 사이로 매 판 총 수량이 비밀스럽게 가변됨!
        intervalMin: 0.5,   
        intervalRange: 0.3,
        speedCoef: 0.0011,  
        minSpeed: 0.26,     
        maxSpeed: 0.42,
        activeCannons: 3,   // 대포 3개 전체 사용
        minPerCannon: 6     // 각 대포당 최소 6발 무조건 보장 (0~5발 억까 방지)
    }
};

// 실시간 게임 트래킹 변수들
let publicState = {
    cannonActualCount: [0, 0, 0],
    cannonUserAnswers: [null, null, null],
    cannonTimestamps: [],
    cannonEndTime: 0,
    cannonFirstClickTime: 0,
    isCannonFirstClickRecorded: false,
    shareText: "",
    countdownTimerId: null
};

// 외부 제어용 상태 변수 세터 함수들
function setGamingStatus(status) { isGaming = status; }

/**
 * 🌟 [난이도 및 언어 팩 결합 최적화]
 * 엔진 스크립트(`cannon-core.js`)나 외부 버튼 인터페이스에서 난이도를 바꿀 때 호출되는 마스터 함수입니다.
 */
function setDifficultyStatus(diff) { 
    currentDifficulty = diff; 
    
    // 🛑 중요: 난이도 상태 변수가 변경된 직후, i18n 언어 팩 내부의 텍스트 리프레시를 자동 호출합니다.
    if (typeof i18n !== 'undefined' && typeof i18n.updateUITranslations === 'function') {
        i18n.updateUITranslations();
    }
}