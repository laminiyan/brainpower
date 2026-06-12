// ==========================================================================
// 🌐 [i18n-switching.js] - 인지 전환 스위칭 게임 전용 통합 언어 엔진 (HTML 싱크 완료)
// ==========================================================================

const i18nData = {
    ko: {
        switching: {
            title: "🧠 두뇌 인지 유연성 검사",
            description: "내 뇌 컨디션에 맞는 모드를 선택하세요.",
            modes: { 
                easy: "🧘 쉬움 모드", 
                normal: "🏃 일반 모드", 
                hard: "🏎️ 어려움 모드" 
            },
            round_indicator: "라운드: <span id='current-round'>{current}</span> / {total}",
            guide_loading: "가이드 로딩중...",
            result_complete: "검사 완료 🎯",
            evaluation_perfect: "정확도 100% 완주!",
            retry_btn: "다시 도전하기 🔄"
        }
    },
    en: {
        switching: {
            title: "🧠 Brain Cognitive Flexibility Test",
            description: "Select a mode that fits your current brain condition.",
            modes: { 
                easy: "🧘 Easy Mode", 
                normal: "🏃 Normal Mode", 
                hard: "🏎️ Hard Mode" 
            },
            round_indicator: "Round: <span id='current-round'>{current}</span> / {total}",
            guide_loading: "Loading Guide...",
            result_complete: "Test Completed 🎯",
            evaluation_perfect: "Finished with 100% Accuracy!",
            retry_btn: "Try Again 🔄"
        }
    }
};

// 📌 글로벌 대포/엘리베이터 명세와 동일하게 localStorage 기반 글로벌 동기화
let currentLang = localStorage.getItem('global_lang') === 'ko' ? 'ko' : 'en';

const i18n = {
    /**
     * 현재 설정된 언어셋 반환
     */
    getLang() { 
        return currentLang; 
    },
    
    /**
     * 🌟 [핵심 마스터 세터] 언어셋을 변경하고 로컬스토리지 동기화 및 즉시 리렌더링을 유도
     */
    setLang(lang) {
        if (i18nData[lang]) {
            currentLang = lang;
            localStorage.setItem('global_lang', lang);
        }
        // 언어가 변경되면 UI 텍스트 자동 갱신 트리거 작동
        if (typeof this.updateUITranslations === 'function') {
            this.updateUITranslations();
        }
    },
    
    /**
     * 🔍 다국어 키 탐색 및 변수 가변 치환 (치환 오류 방지 안전망 포함)
     */
    get(keyPath, variables = {}) {
        const keys = keyPath.split('.');
        let result = i18nData[currentLang];
        
        for (const key of keys) {
            if (!result || result[key] === undefined) {
                // 현재 언어팩에 키가 없으면 영어(en) 백업 데이터에서 폴백 추적
                result = keys.reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : undefined, i18nData['en']);
                break;
            }
            result = result[key];
        }
        
        let text = result || keyPath;
        
        // 가변 인자 매핑 ({current}, {total} 문자열 1:1 정확히 치환)
        Object.keys(variables).forEach(vKey => {
            text = text.split(`{${vKey}}`).join(variables[vKey]);
        });
        
        return text;
    },

    /**
     * 🌟 [HTML 싱크로율 100% 리렌더링 코어 인터페이스]
     * 보내주신 마크업 내의 ID를 직접 추적하여 누락 없이 다국어를 실시간 주입합니다.
     */
    updateUITranslations() {
        // 1. 메인 시작 화면 (Start Screen) 번역
        const titleEl = document.getElementById('switching-title');
        if (titleEl) titleEl.innerText = this.get('switching.title');

        const descEl = document.getElementById('switching-desc');
        if (descEl) descEl.innerText = this.get('switching.description');

        // 2. 난이도 메뉴 버튼 번역 (마크업 내의 실제 ID 대응)
        const btnEasy = document.getElementById('btn-easy');
        if (btnEasy) btnEasy.innerText = this.get('switching.modes.easy');

        const btnNormal = document.getElementById('btn-normal');
        if (btnNormal) btnNormal.innerText = this.get('switching.modes.normal');

        const btnHard = document.getElementById('btn-hard');
        if (btnHard) btnHard.innerText = this.get('switching.modes.hard');

        // 3. 게임 화면 (Game Screen) 기본 가이드 초기화 대응
        const guideBox = document.getElementById('guide-box');
        // 아직 게임이 시작하기 전이거나 로딩 중 문구일 때만 다국어 변경을 안전하게 처리
        if (guideBox && (guideBox.innerText.includes("로딩") || guideBox.innerText.includes("Loading"))) {
            guideBox.innerText = this.get('switching.guide_loading');
        }

        // 4. 결과 화면 (Result Screen) 번역
        const resComplete = document.getElementById('result-complete');
        if (resComplete) resComplete.innerText = this.get('switching.result_complete');

        const evalTitle = document.getElementById('evaluation-title');
        if (evalTitle && evalTitle.innerText.includes("100%")) {
            evalTitle.innerText = this.get('switching.evaluation_perfect');
        }

        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) retryBtn.innerText = this.get('switching.retry_btn');
    }
};

// ==========================================================================
// 📦 글로벌 스코프 전역 객체 바인딩 등록 (CORS / 모바일 웹뷰 대응 보강)
// ==========================================================================
window.i18n = i18n;

// 문서 로드가 완료되면 최초 1회 자동으로 언어팩 상태에 맞춰 UI를 일괄 번역합니다.
document.addEventListener('DOMContentLoaded', () => {
    if (typeof i18n !== 'undefined' && typeof i18n.updateUITranslations === 'function') {
        i18n.updateUITranslations();
    }
});
