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
let isGaming = false;              // 현재 엘리베이터가 운행 중인지 체크하는 마스터 플래그

// 💡 각 난이도별 물리 엔진 주기 및 밸런스 스윗 스팟 설정
const DIFFICULTY_CONFIG = {
    silver: {
        modeKey: 'SILVER',          // ✨ 진동 제어 장치와 정확히 싱크를 맞추기 위한 고유 키
        interval: 1500,             // ⏱️ 층간 이동 시간 (1.5초)
        maxJump: 2,                 // 🛗 한 번에 건너뛸 수 있는 최대 층수
        totalSteps: 8,              // 🔢 총 이동 횟수
        blindStart: 5,              // 👁️ 암흑(블라인드)이 시작되는 스텝 단계
        labelKey: "el_silver_label" 
    },
    normal: {
        modeKey: 'NORMAL',          // ✨ 텍스트가 다국어로 바뀌어도 흔들리지 않는 절대값
        interval: 1000,             // ⏱️ 층간 이동 시간 (1.0초)
        maxJump: 3,                 // 🛗 한 번에 건너뛸 수 있는 최대 층수
        totalSteps: 10,             // 🔢 총 이동 횟수
        blindStart: 4,              // 👁️ 암흑(블라인드)이 시작되는 스텝 단계
        labelKey: "el_normal_label" 
    },
    genius: {
        modeKey: 'GENIUS',          // ✨ 천재모드 초고속 주기 압축 판정용
        interval: 700,              // ⏱️ 층간 이동 시간 (0.7초 초고속)
        maxJump: 5,                 // 🛗 한 번에 건너뛸 수 있는 최대 층수
        totalSteps: 12,             // 🔢 총 이동 횟수
        blindStart: 3,              // 👁️ 암흑(블라인드)이 시작되는 스텝 단계
        labelKey: "el_genius_label" 
    }
};

// 실시간 게임 트래킹 변수들
let publicState = {
    elActualStoppedFloor: 1,        // 실제 엘리베이터가 멈춘 정답 층수
    elUserSelectedFloor: null,      // 유저가 찍은 예측 층수
    elDarkEndTime: 0,               // 암흑 종료 시각 (반응속도 측정용)
    elFirstClickTime: 0,            // 유저의 첫 정답 마킹 시각
    isElFirstClickRecorded: false,  // 첫 클릭 기록 여부 플래그
    elevatorShareText: "",          // 결과 공유용 텍스트 저장소
    countdownTimerId: null          // 운행 제어용 타이머 ID
};

// 외부 제어용 상태 변수 세터 함수들
function setGamingStatus(status) { isGaming = status; }

/**
 * 🌟 [난이도 및 언어 팩 결합 최적화]
 * 엔진 스크립트(`elevator-core.js`)나 외부 버튼 인터페이스에서 난이도를 바꿀 때 호출되는 마스터 함수입니다.
 */
function setDifficultyStatus(diff) {
    if (isGaming) return; // 🛑 게임 중에는 난이도 변경 방지

    const config = DIFFICULTY_CONFIG[diff.toLowerCase()];
    if (!config) return;

    currentDifficulty = diff.toLowerCase(); 

    // UI 버튼 선택 스타일 업데이트 (기존 selectElevatorDifficulty 로직 이식)
    const buttons = document.querySelectorAll('.mode-select-btn');
    if (buttons.length >= 3) {
        buttons.forEach(btn => btn.classList.remove('selected'));
        if (currentDifficulty === 'silver') buttons[0].classList.add('selected');
        if (currentDifficulty === 'normal') buttons[1].classList.add('selected');
        if (currentDifficulty === 'genius') buttons[2].classList.add('selected');
    }

    // 🛑 중요: 난이도 상태 변수가 변경된 직후, i18n 언어 팩 내부의 텍스트 리프레시를 자동 호출합니다.
    if (typeof i18n !== 'undefined' && typeof i18n.updateUITranslations === 'function') {
        i18n.updateUITranslations();
    } else {
        // 백업용 구형 상태창 리렌더링 로직
        const statusText = document.getElementById('el-status-text');
        if (statusText && typeof getElText === 'function') {
            const label = getElText(config.labelKey);
            statusText.innerText = `[${label}] ${getElText('el_ready')}`;
        }
    }
}

// ==========================================================================
// 🌐 외부 모듈 및 글로벌 스코프 연동 (CORS / 웹뷰 환경 지원)
// ==========================================================================
window.DIFFICULTY_CONFIG = DIFFICULTY_CONFIG;
window.publicState = publicState;
window.setGamingStatus = setGamingStatus;
window.setDifficultyStatus = setDifficultyStatus;
