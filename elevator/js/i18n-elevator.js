// ==========================================================================
// 🌐 i18n-elevator.js - 최종 완성형 (난이도 버튼 포함)
// ==========================================================================

const i18nData = {
    ko: {
        elevator: {
            title: "🛗 미스터리 엘리베이터",
            description: "암흑 구간 동안 오직 미세 진동과 음정 변화로 최종 층수를 추론하세요.",
            difficulty_title: "⚙️ 난이도 선택",
            modes: { easy: "쉬움🧘", normal: "일반🧑", hard: "어려움⚡" },
            practice_title: "🎧 소리/진동 미리 연습",
            btn_up_test: "🔼 상승 (3층)",
            btn_down_test: "🔽 하강 (1층)",
            status_ready: "준비가 완료되면 아래 버튼을 누르세요.",
            start_btn: "훈련 시작",
            input_title: "엘리베이터가 최종 멈춘 층수를 고르세요",
            choice_title: "예측 최종 층수",
            submit_btn: "정답 제출",
            result_title: "측정 결과",
            share_btn: "📋 결과 복사해서 자랑하기",
            retry_btn: "다시 도전하기",
            guide_title: "💡 오감 극대화 훈련 필수 가이드",
            guide_li_1: "원활한 측정을 위해 스마트폰의 무음/매너 모드를 해제하세요.",
            guide_li_2: "아이폰은 사파리 하단 [공유] ➡️ [홈 화면에 추가]로 실행해야 진동이 활성화됩니다.",
            footer_warning_1: "본 엔진은 순수한 인지 템포 측정 및 개인 두뇌 관리용 생활 건강(웰니스) 시뮬레이터입니다.",
            footer_warning_2: "의학적 진단, 치매의 치료 및 예방 등 의료 목적으로 설계되지 않았습니다."
        }
    },
    en: {
        elevator: {
            title: "🛗 Mystery Elevator",
            description: "Deduce the final floor using only micro-vibrations and pitch changes during the blackout period.",
            difficulty_title: "⚙️ Select Difficulty",
            modes: { easy: "Easy🧘", normal: "Normal🧑", hard: "Hard⚡" },
            practice_title: "🎧 Sound/Vibration Practice",
            btn_up_test: "🔼 Move Up (3F)",
            btn_down_test: "🔽 Move Down (1F)",
            status_ready: "Press the button below when you are ready.",
            start_btn: "Start Training",
            input_title: "Select the final floor where the elevator stopped",
            choice_title: "Predicted Final Floor",
            submit_btn: "Submit Answer",
            result_title: "Measurement Result",
            share_btn: "📋 Copy Results to Share",
            retry_btn: "Try Again",
            guide_title: "💡 Essential Guide to Maximize Five Senses Training",
            guide_li_1: "Please disable silent/manner mode on your smartphone for smooth measurement.",
            guide_li_2: "For iPhones, you must run it via Safari's bottom [Share] ➡️ [Add to Home Screen] to activate vibration.",
            footer_warning_1: "This engine is a lifestyle health (wellness) simulator intended purely for cognitive tempo measurement and personal brain management.",
            footer_warning_2: "It is not designed for medical purposes such as medical diagnosis, treatment, or prevention of dementia."
        }
    }
};

let currentLang = localStorage.getItem('global_lang') === 'ko' ? 'ko' : 'en';

const i18n = {
    getLang() { return currentLang; },
    setLang(lang) {
        if (i18nData[lang]) {
            currentLang = lang;
            localStorage.setItem('global_lang', lang);
        }
    },
    get(keyPath, variables = {}) {
        const keys = keyPath.split('.');
        let result = i18nData[currentLang];
        for (const key of keys) { result = result ? result[key] : undefined; }
        let text = result || keyPath;
        Object.keys(variables).forEach(vKey => {
            text = text.replace(new RegExp(`{${vKey}}`, 'g'), variables[vKey]);
        });
        return text;
    },

    updateUITranslations() {
        // 1. 헤더 텍스트
        const title = document.querySelector('.title-text');
        if (title) title.innerText = this.get('elevator.title');
        const desc = document.querySelector('.desc-text');
        if (desc) desc.innerText = this.get('elevator.description');

        // 2. 난이도 및 연습 버튼 치환 (추가됨)
        const diffBtns = document.querySelectorAll('.mode-select-btn');
        if (diffBtns.length >= 3) {
            diffBtns[0].innerText = this.get('elevator.modes.easy');
            diffBtns[1].innerText = this.get('elevator.modes.normal');
            diffBtns[2].innerText = this.get('elevator.modes.hard');
        }

        // 3. 버튼 및 가이드
        if (document.getElementById('el-start-btn')) document.getElementById('el-start-btn').innerText = this.get('elevator.start_btn');
        if (document.getElementById('difficulty-title')) document.getElementById('difficulty-title').innerText = this.get('elevator.difficulty_title');
        if (document.getElementById('practice-title')) document.getElementById('practice-title').innerText = this.get('elevator.practice_title');
        if (document.getElementById('btn-up-test')) document.getElementById('btn-up-test').innerText = this.get('elevator.btn_up_test');
        if (document.getElementById('btn-down-test')) document.getElementById('btn-down-test').innerText = this.get('elevator.btn_down_test');
        if (document.getElementById('el-status-text')) document.getElementById('el-status-text').innerText = this.get('elevator.status_ready');
        
        // 4. 인풋/결과 화면
        if (document.getElementById('input-screen-title')) document.getElementById('input-screen-title').innerText = this.get('elevator.input_title');
        if (document.getElementById('choice-screen-title')) document.getElementById('choice-screen-title').innerText = this.get('elevator.choice_title');
        if (document.getElementById('el-submit-btn')) document.getElementById('el-submit-btn').innerText = this.get('elevator.submit_btn');
        if (document.getElementById('el-result-title')) document.getElementById('el-result-title').innerText = this.get('elevator.result_title');
        if (document.getElementById('el-share-btn')) document.getElementById('el-share-btn').innerText = this.get('elevator.share_btn');
        if (document.getElementById('el-retry-btn')) document.getElementById('el-retry-btn').innerText = this.get('elevator.retry_btn');

        // 5. 하단 가이드 및 푸터
        if (document.getElementById('guide-title')) document.getElementById('guide-title').innerText = this.get('elevator.guide_title');
        if (document.getElementById('guide-li-1')) document.getElementById('guide-li-1').innerText = this.get('elevator.guide_li_1');
        if (document.getElementById('guide-li-2')) document.getElementById('guide-li-2').innerText = this.get('elevator.guide_li_2');
        if (document.getElementById('footer-warning-1')) document.getElementById('footer-warning-1').innerText = this.get('elevator.footer_warning_1');
        if (document.getElementById('footer-warning-2')) document.getElementById('footer-warning-2').innerText = this.get('elevator.footer_warning_2');
    }
};

// [핵심] 로딩 시 화면 숨김 & 번역 적용
document.write('<style>body { opacity: 0; transition: opacity 0.3s; }</style>');
window.addEventListener('load', () => {
    i18n.updateUITranslations();
    document.body.style.opacity = '1';
});

window.i18n = i18n;