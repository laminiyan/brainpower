// ==========================================
// i18n-hub.js - 메인 허브 화면 전용 다국어 언어 팩
// ==========================================

const i18nData = {
    ko: {
        hub: {
            title: "🧠 두뇌 피지컬 측정소",
            subtitle: "전두엽 성능을 ms 단위로 정밀 측정하세요.",
            dashboard_btn: "📊 나의 두뇌 기록·추이 확인",
            modal_close: "✕ 닫기",
            btn_help: "도움말",
            btn_settings: "설정",
            games: {
                cannon: { name: "대포 사격", badge: "🎯 동적 피지컬" },
                elevator: { name: "엘리베이터", badge: "🛗 공간 인지" },
                switching: { name: "규칙 전환", badge: "🌀 인지 유연성" }
            },
            details: {
                cannon: {
                    title: "🎯 초정밀 대포 사격 검사",
                    desc: "눈으로 비행 오브젝트를 포착하고 손가락 끝으로 정밀 각도를 가르는 고속 타겟팅 뇌지컬 훈련입니다. 시각 피드백을 통한 <strong>뇌와 손의 조작 협응 속도(ms)</strong>를 가장 과학적으로 검증합니다."
                },
                elevator: {
                    title: "🛗 미스터리 엘리베이터 검사",
                    desc: "화면의 숫자가 완전히 가려진 암흑 구역 내에서 오직 기기 고유의 <strong>미세 진동 횟수(촉각)와 음정의 가변 변화(청각)</strong>만을 결합하여 실시간 최종 도달 위치를 역추적하는 고차원 복합 공간 인지 훈련입니다."
                },
                switching: {
                    title: "🔍 다이내믹 규칙 전환 검사",
                    desc: "눈이 편안한 톤다운 파스텔 화면 위에서 실시간으로 반전되는 변칙 질문 유형에 대응하는 훈련입니다. 뇌의 고정관념을 부수고 <strong>상황 변화에 즉각 대처하는 전두엽의 인지 유연성 및 브레이크 제어(ms)</strong>를 측정합니다."
                },
                enter_btn: "측정소 입장하기 ⚡"
            },
            guide_title: "💡 전 연령대 공통 권장사항",
            guide_desc: "메뉴를 터치해 상세 설명을 확인하세요. 매너모드를 해제하고 집중할 수 있는 환경에서 참여하시면 더욱 정확한 뇌지컬 검사가 가능합니다.",
            footer: "본 플랫폼은 개인 두뇌 관리용 생활 건강 시뮬레이터 허브입니다."
        }
    },
    en: {
        hub: {
            title: "🧠 Brain Physical Hub",
            subtitle: "Precisely measure your frontal lobe performance in ms.",
            dashboard_btn: "📊 Check My Brain Records & Trends",
            modal_close: "✕ Close",
            btn_help: "Help",
            btn_settings: "Settings",
            games: {
                cannon: { name: "Cannon Fire", badge: "🎯 Dynamic Performance" },
                elevator: { name: "Elevator", badge: "🛗 Spatial Cognition" },
                switching: { name: "Rule Switching", badge: "🌀 Cognitive Flexibility" }
            },
            details: {
                cannon: {
                    title: "🎯 High-Precision Cannon Fire Test",
                    desc: "A high-speed targeting brain training session that captures flying objects with your eyes and splits precision angles with your fingertips. It scientifically verifies the <strong>hand-eye coordination speed (ms)</strong> through visual feedback."
                },
                elevator: {
                    title: "🛗 Mystery Elevator Test",
                    desc: "A high-level complex spatial cognitive training session that backtracks the final reached location in real-time by combining only the device's unique <strong>micro-vibrations (haptic) and variable pitch changes (auditory)</strong> within a blackout zone where screen numbers are completely hidden."
                },
                switching: {
                    title: "🔍 Dynamic Rule Switching Test",
                    desc: "A training session that responds to changing anomaly question types in real-time on a comfortable pastel screen. It breaks through brain stereotypes and measures the <strong>cognitive flexibility and brake control (ms) of the frontal lobe</strong> to respond instantly to situational changes."
                },
                enter_btn: "Enter Testing Station ⚡"
            },
            guide_title: "💡 General Recommendations for All Ages",
            guide_desc: "Touch a menu item to view its detailed description. Disabling silent mode and participating in a focused environment will allow for a more accurate cognitive test.",
            footer: "This platform is a lifestyle health simulator hub for personal brain management."
        }
    }
};

let currentLang = localStorage.getItem('global_lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

const i18n = {
    getLang() {
        return currentLang;
    },
    
    setLang(lang) {
        if (i18nData[lang]) {
            currentLang = lang;
            localStorage.setItem('global_lang', lang);
            this.updateUITranslations();
        }
    },
    
    get(keyPath, variables = {}) {
        const keys = keyPath.split('.');
        let result = i18nData[currentLang];
        
        for (const key of keys) {
            if (result[key] === undefined) {
                result = keys.reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : undefined, i18nData['en']);
                break;
            }
            result = result[key];
        }
        
        let text = result || keyPath;
        Object.keys(variables).forEach(vKey => {
            text = text.replace(new RegExp(`{${vKey}}`, 'g'), variables[vKey]);
        });
        
        return text;
    },

    /**
     * 🖥️ 메인 허브 인터페이스 전용 DOM 요소 번역 처리기
     */
    updateUITranslations() {
        if (!document.getElementById('txt-hub-title')) return;

        // 1. 메인 타이틀 및 대시보드 스위칭
        document.getElementById('txt-hub-title').innerText = this.get('hub.title');
        document.getElementById('txt-hub-subtitle').innerText = this.get('hub.subtitle');
        document.getElementById('btn-hub-dashboard').innerText = this.get('hub.dashboard_btn');
        if (document.getElementById('btn-hub-modal-close')) {
            document.getElementById('btn-hub-modal-close').innerText = this.get('hub.modal_close');
        }

        // 2. 상단 유틸리티 바 (도움말 / 설정 버튼)
        if (document.getElementById('btn-hub-help')) {
            document.getElementById('btn-hub-help').innerHTML = `<span>❓</span> ${this.get('hub.btn_help')}`;
        }
        if (document.getElementById('btn-hub-settings')) {
            document.getElementById('btn-hub-settings').innerHTML = `<span>⚙️</span> ${this.get('hub.btn_settings')}`;
        }

        // 3. 게임 선택 카드 영역
        document.getElementById('card-name-cannon').innerText = this.get('hub.games.cannon.name');
        document.getElementById('card-badge-cannon').innerText = this.get('hub.games.cannon.badge');
        document.getElementById('card-name-elevator').innerText = this.get('hub.games.elevator.name');
        document.getElementById('card-badge-elevator').innerText = this.get('hub.games.elevator.badge');
        document.getElementById('card-name-switching').innerText = this.get('hub.games.switching.name');
        document.getElementById('card-badge-switching').innerText = this.get('hub.games.switching.badge');

        // 4. 하단 세부 정보 설명 블록
        document.getElementById('detail-title-cannon').innerText = this.get('hub.details.cannon.title');
        document.getElementById('detail-desc-cannon').innerHTML = this.get('hub.details.cannon.desc');
        document.getElementById('detail-title-elevator').innerText = this.get('hub.details.elevator.title');
        document.getElementById('detail-desc-elevator').innerHTML = this.get('hub.details.elevator.desc');
        document.getElementById('detail-title-switching').innerText = this.get('hub.details.switching.title');
        document.getElementById('detail-desc-switching').innerHTML = this.get('hub.details.switching.desc');

        // 5. 입장 버튼 텍스트 동시 동기화
        document.querySelectorAll('.hub-enter-btn').forEach(btn => {
            btn.innerText = this.get('hub.details.enter_btn');
        });

        // 6. 중간 하단 가이드 팁
        if (document.getElementById('txt-hub-guide-title')) {
            document.getElementById('txt-hub-guide-title').innerText = this.get('hub.guide_title');
        }
        if (document.getElementById('txt-hub-guide-desc')) {
            document.getElementById('txt-hub-guide-desc').innerText = this.get('hub.guide_desc');
        }

        // 7. 최하단 푸터
        if (document.getElementById('txt-hub-footer')) {
            document.getElementById('txt-hub-footer').innerText = this.get('hub.footer');
        }
    }
};

window.i18n = i18n;