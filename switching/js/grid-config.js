// ==========================================================================
// ⚙️ 공용 환경 변수 및 설정 데이터 (다국어 동기화 및 트롤링 방지벽 완비)
// ==========================================================================
// 💡 각 게임들의 *-config.js 내부 최상단에 언어 감지 로직으로 이 코드가 세팅되어 있어야 합니다.
const userLocale = localStorage.getItem('global_lang') === 'ko' ? 'ko' : 'en';

// 🌟 [핵심 연동] 판단된 최종 언어셋을 i18n 패키지에 주입 후 즉시 화면 리렌더링
if (typeof i18n !== 'undefined') {
    i18n.setLang(userLocale);
    if (typeof i18n.updateUITranslations === 'function') {
        i18n.updateUITranslations();
    }
}

const GRID_COLORS = ['pink', 'blue', 'mint'];

// ⏱️ 각 모드(난이도)별 게임 밸런스 및 규칙 스윗 스팟 설정
const GRID_MODE_CONFIG = {
    easy: {
        modeKey: 'EASY',            // ✨ 시스템 내부 판정용 고유 절대값 키
        totalRounds: 8,             // 🔢 총 플레이 라운드
        hasBlind: false,            // 👁️ 암흑(블라인드) 효과 여부
        labelKey: "grid_easy_label"
    },
    normal: {
        modeKey: 'NORMAL',          // ✨ 변칙 규칙 제어 장치 동기화용 키
        totalRounds: 8,             // 🔢 총 플레이 라운드
        hasBlind: false,            // 👁️ 암흑(블라인드) 효과 여부
        labelKey: "grid_normal_label"
    },
    hard: {
        modeKey: 'HARD',            // ✨ 8대 변칙 헬모드 브레이커 판정용 키
        totalRounds: 8,             // 🔢 총 플레이 라운드
        hasBlind: true,             // 👁️ 암흑(블라인드) 효과 여부
        labelKey: "grid_hard_label"
    }
};

// ==========================================================================
// 🌐 독립 구동형 다국어 딕셔너리 (CORS 우회 장치)
// ==========================================================================
const gridI18nMap = {
    ko: {
        grid_easy_label: "이지 모드",
        grid_normal_label: "노말 모드",
        grid_hard_label: "하드 모드",
        color_pink: "핑크", color_blue: "블루", color_mint: "민트",
        easy_guide: "💡 {icon} {name}색 칸은 총 몇 개일까요?",
        normal_guide: "📝 [{name}] 색상의 정확한 개수를 고르세요.",
        type_a: "🚨 화면에서 가장 [적게] 배치된 색상은?",
        type_b: "⏱️ 잔상 집중! 방금 가장 [많이] 깔려있던 색상은?",
        type_c: "⚖️ [{name}] 칸의 개수가 {limit}개 이상입니까?",
        type_d: "🎨 가이드의 '글자 이름' 개수는? ",
        type_e: "📢 현재 화면의 과반수(13칸 이상)를 점령한 색상이 존재합니까?",
        type_f: "🔍 현재 화면에 단 '한 칸도 존재하지 않는' 색상은?",
        type_g: "⚔️ [{pink}] 칸이 [{blue}] 칸보다 개수가 더 많습니까?",
        type_h_start: "⚡ [{name}] 개수를 찾으세요!",
        type_h_change: "🔄 변경!! [{name}] 개수를 찾으세요!",
        ox_yes: "👍 참 (YES)", ox_no: "👎 거짓 (NO)",
        penalty_text: "⚠️ <span style='color:#ff6b6b; font-weight:bold;'>오답 패널티 +500ms! 판이 재배치됩니다.</span>",
        result_easy: "✨ <b>8단계 두뇌 스트레칭 완주 성공!</b><br>총 소요 시간: <b>{time}</b><br>시간에 쫓기지 않고 시각 신경을 아주 정확하고 침침함 없이 청정하게 활성화하셨습니다. 당신의 전두엽은 현재 건강하고 신중한 상태입니다.",
        result_normal: "🏃 <b>파워 워킹 코스 마스터!</b><br>총 소요 시간: <b>{time}</b><br>일반적인 인지 렉(Lag) 현상을 훌륭하게 제어하며 안정적인 연산 밸런스를 증명하셨습니다. 규칙 유연성 상위 권역입니다.",
        result_hard: "🏎️ <b>지옥의 8대 변칙 헬모드 브레이커!</b><br>최종 기록: <span style='color:#ff6b6b; font-weight:bold; font-size:1.4rem;'>{time}</span>{penalty}<br><br>찰나의 ms 단위 인지 유턴 비용을 완벽하게 무력화했습니다. 상위 0.1% 괴물 뇌지컬 확정!",
        penalty_alert: "<br><small style='color:#aaa;'>(오답 패널티 +{ms}ms 포함)</small>"
    },
    en: {
        grid_easy_label: "Easy Mode",
        grid_normal_label: "Normal Mode",
        grid_hard_label: "Hard Mode",
        color_pink: "Pink", color_blue: "Blue", color_mint: "Mint",
        easy_guide: "💡 How many {icon} {name} cells are there in total?",
        normal_guide: "📝 Choose the exact number of [{name}] cells.",
        type_a: "🚨 Which color has the [LEAST] number of cells?",
        type_b: "⏱️ Focus! Which color had the [MOST] cells just now?",
        type_c: "⚖️ Are there {limit} or more [{name}] cells?",
        type_d: "🎨 How many cells match the 'Text Word'? ",
        type_e: "📢 Is there a color occupying the majority (13+ cells)?",
        type_f: "🔍 Which color is 'COMPLETELY MISSING' from the screen?",
        type_g: "⚔️ Are there more [{pink}] cells than [{blue}] cells?",
        type_h_start: "⚡ Find the number of [{name}] cells!",
        type_h_change: "🔄 CHANGED!! Find the number of [{name}] cells!",
        ox_yes: "👍 TRUE (YES)", ox_no: "👎 FALSE (NO)",
        penalty_text: "⚠️ <span style='color:#ff6b6b; font-weight:bold;'>Incorrect! Penalty +500ms! Board reshuffling.</span>",
        result_easy: "✨ <b>8-Step Brain Stretching Completed!</b><br>Total Time: <b>{time}</b><br>You activated your visual nerves accurately without rushing.",
        result_normal: "🏃 <b>Power Walking Course Master!</b><br>Total Time: <b>{time}</b><br>Excellent control of cognitive lag and stable arithmetic balance.",
        result_hard: "🏎️ <b>8 Anomalies Hell Mode Breaker!</b><br>Final Score: <span style='color:#ff6b6b; font-weight:bold; font-size:1.4rem;'>{time}</span>{penalty}<br><br>Perfectly neutralized millisecond-level cognitive costs. Top 0.1% Brainpower!",
        penalty_alert: "<br><small style='color:#aaa;'>(Includes +{ms}ms penalty)</small>"
    }
};

// 📌 브라우저 기본 언어 자동 매칭 (기본값 ko)
const gridLocale = userLocale || (navigator.language.substring(0, 2) === 'ko' ? 'ko' : 'en');
const targetDict = gridI18nMap[gridLocale] || gridI18nMap['ko'];

// ==========================================================================
// 📌 글로벌 실시간 동적 상태 관리 객체 (엘레베이터 구조 동기화)
// ==========================================================================
const gridState = {
    currentMode: 'easy',            // 기본값: 이지 모드
    isProcessing: false,            // 현재 그리드 연산/게임이 진행 중인지 체크하는 마스터 플래그
    currentRound: 1,                // 현재 진행 라운드
    totalRounds: 8,                 // 총 라운드 수
    colorNames: { 
        pink: targetDict.color_pink, 
        blue: targetDict.color_blue, 
        mint: targetDict.color_mint 
    },
    colorIcons: { pink: '🔴', blue: '🔵', mint: '🟢' },
    gridData: [],
    hardTypeQueue: [],
    currentHardType: '',
    startTime: 0,
    totalElapsedTime: 0,
    blindTimeout: null,
    penaltyTimeMs: 0
};

// 다국어 치환 유틸리티 함수
function getGridText(key, replaceObj = {}) {
    let msg = gridI18nMap[gridLocale]?.[key] || gridI18nMap['ko'][key] || key;
    for (let k in replaceObj) {
        msg = msg.split(`{${k}}`).join(replaceObj[k]);
    }
    return msg;
}

// 외부 제어용 상태 변수 세터 함수들
function setGamingStatus(status) { 
    gridState.isProcessing = status; 
}

/**
 * 🌟 [난이도 및 언어 팩 결합 최적화]
 * 엔진 스크립트(`grid-core.js`)나 외부 버튼 인터페이스에서 모드(난이도)를 바꿀 때 호출되는 마스터 함수입니다.
 */
function setGridModeStatus(mode) {
    if (gridState.isProcessing) return; // 🛑 게임 연산 중에는 모드 변경 방지

    const config = GRID_MODE_CONFIG[mode.toLowerCase()];
    if (!config) return;

    gridState.currentMode = mode.toLowerCase();
    gridState.totalRounds = config.totalRounds; // 난이도 설정에 맞춰 총 라운드 동적 동기화

    // UI 버튼 선택 스타일 업데이트 (엘레베이터 로직 이식)
    const buttons = document.querySelectorAll('.mode-select-btn');
    if (buttons.length >= 3) {
        buttons.forEach(btn => btn.classList.remove('selected'));
        if (gridState.currentMode === 'easy') buttons[0].classList.add('selected');
        if (gridState.currentMode === 'normal') buttons[1].classList.add('selected');
        if (gridState.currentMode === 'hard') buttons[2].classList.add('selected');
    }

    // 🛑 중요: 모드 상태 변수가 변경된 직후, i18n 언어 팩 내부의 텍스트 리프레시를 자동 호출합니다.
    if (typeof i18n !== 'undefined' && typeof i18n.updateUITranslations === 'function') {
        i18n.updateUITranslations();
    } else {
        // 백업용 독립 딕셔너리 기반 상단 가이드/상태창 리렌더링 로직
        const guideText = document.getElementById('grid-guide-text');
        if (guideText) {
            const label = getGridText(config.labelKey);
            guideText.innerText = `[${label}] 준비 완료`;
        }
    }
}

// ==========================================================================
// 🌐 외부 모듈 및 글로벌 스코프 연동 (CORS / 웹뷰 환경 지원)
// ==========================================================================
window.GRID_COLORS = GRID_COLORS;
window.GRID_MODE_CONFIG = GRID_MODE_CONFIG;
window.gridState = gridState;
window.getGridText = getGridText;
window.setGamingStatus = setGamingStatus;
window.setGridModeStatus = setGridModeStatus;
