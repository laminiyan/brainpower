// ==========================================================================
// 🌐 i18n-cannon.js - HTML 수정 없이 클래스/태그 역추적 강제 번역 매스터 엔진
// ==========================================================================

const i18nData = {
    ko: {
        cannon: {
            title: "🧠 3-대포 멀티태스킹 인지 검사",
            description: "상단 벽에 부딪히는 동그란 포탄(●)의 개수를 대포별로 정확히 세어보세요.",
            modes: { easy: "🧘 쉬움 (20초)", normal: "🔥 일반 (20초)", hard: "⚡ 어려움 (25초)" },
            status_ready: "[🔥 일반 모드] 20초 세션 선택됨 - 시작 버튼을 누르세요",
            status_ready_easy: "[🧘 쉬움 모드] 20초 세션 선택됨 - 시작 버튼을 누르세요",
            status_ready_hard: "[⚡ 어려움 모드] 25초 세션 선택됨 - 시작 버튼을 누르세요",
            status_time_left: "⏱️ 남은 시간: {time}초",
            boundary_text: "CRITICAL COGNITIVE BOUNDARY",
            cannon_label: "{num}번 대포",
            disabled_label: "비활성화 (0)",
            start_btn: "🚀 뇌 피지컬 검사 시작",
            guide_focus: "• 안내: 검사 중에는 포탄을 세는 데만 집중하세요.",
            guide_sound: "• 소리 권장: 리드미컬한 청각 자극이 분할 인지 연산에 도움을 줍니다.",
            
            input_title: "📝 수량 마킹 단계",
            input_desc: "각 대포가 발사하여 벽에 충돌시킨 포탄의 정확한 총개수를 지정해 주세요.",
            choice_label: "🪘 {num}번 대포 발사 수량 선택",
            submit_btn: "📊 내 두뇌 스펙트럼 확인하기",
            
            result_success: "🎉 검사 성공!",
            result_incorrect: "❌ 판정 실패",
            desc_success: "완벽한 정확도입니다! 당신의 분할 주의력과 멀티태스킹 인지 한계는 최상위 권에 속합니다.",
            desc_incorrect: "실제 발사량: [🤖 1번:{c1}발, 2번:{c2}발, 3번:{c3}발] \n당신의 마킹: [👤 1번:{u1}발, 2번:{u2}발, 3번:{u3}발]",
            meta_text: "검사 코드: [{code}] | 적용 모드: [{mode}]",
            rt_speed: "🧠 두뇌 연산 속도: ",
            rt_delay: "⏱️ 시각-신체 반응 지연: ",
            stats_best: "🥇 역대 최고 속도: ",
            stats_avg: "⏱️ 최근 평균 속도: ",
            alert_copied: "결과가 성공적으로 복사되었습니다! 카톡에 자랑해 보세요. 😉",
            share_template: "[🧠 3-대포 멀티태스킹 인지 검사 결과]\n• 인지 난이도: {mode}\n• 판정 결과: {status}\n• 순수 두뇌 연산 피지컬: {brain}ms\n• 시각-신체 반응 지연속도: {hand}ms\n\n지금 당신의 두뇌 FPS 실시간 스펙트럼을 측정해 보세요! 👇\nhttps://laminiyan.github.io/",

            share_btn: "🔗 뇌지컬 결과 복사하기 (카톡 자랑용)",
            retry_btn: "🔄 다음 세션 반복 훈련하기",
            ad_notice: "뇌 휴식을 위해 임시 광고 동기화 중... 잠시만 기다려주세요.",
            footer_warning: "본 검사는 간이 스크리닝 목적의 인지 훈련 도구이며, 의학적 진단을 대체할 수 없습니다."
        }
    },
    en: {
        cannon: {
            title: "🧠 3-Cannon Multitasking Cognitive Test",
            description: "Accurately count the number of round cannonballs (●) hitting the top wall for each cannon.",
            modes: { easy: "🧘 Easy (20s)", normal: "🔥 Normal (20s)", hard: "⚡ Hard (25s)" },
            status_ready: "[🔥 Normal Mode] 20s session selected - Press the start button",
            status_ready_easy: "[🧘 Easy Mode] 20s session selected - Press the start button",
            status_ready_hard: "[⚡ Hard Mode] 25s session selected - Press the start button",
            status_time_left: "⏱️ Time Left: {time}s",
            boundary_text: "CRITICAL COGNITIVE BOUNDARY",
            cannon_label: "Cannon {num}",
            disabled_label: "Disabled (0)",
            start_btn: "🚀 Start Cognitive Test",
            guide_focus: "• Notice: Focus entirely on counting the cannonballs during the test.",
            guide_sound: "• Sound Recommended: Rhythmical auditory stimuli help divided cognitive computing.",
            
            input_title: "📝 Quantity Marking Stage",
            input_desc: "Please specify the exact total number of cannonballs each cannon fired and hit against the wall.",
            choice_label: "🪘 Select fired quantity for Cannon {num}",
            submit_btn: "📊 Check My Brain Spectrum",
            
            result_success: "🎉 SUCCESS!",
            result_incorrect: "❌ INCORRECT",
            desc_success: "Perfect accuracy! Your divided attention is top-tier.",
            desc_incorrect: "Real: [🤖 C1:{c1}, C2:{c2}, C3:{c3}] \nYours: [👤 C1:{u1}, C2:{u2}, C3:{u3}]",
            meta_text: "ID: [{code}] | MODE: [{mode}]",
            rt_speed: "🧠 Brain Speed: ",
            rt_delay: "⏱️ Eye-Hand Delay: ",
            stats_best: "🥇 Best Speed: ",
            stats_avg: "⏱️ Recent Avg: ",
            alert_copied: "Result copied to clipboard! Share it with your friends. 😉",
            share_template: "[🔫 3-Cannon Cognitive Test Result]\n• Difficulty: {mode}\n• Status: {status}\n• Pure Brain Planning Speed: {brain}ms\n• Hand-Eye Response Delay: {hand}ms\n\nTest your brain FPS now! 👇\nhttps://내게임주소.com",

            share_btn: "🔗 Copy Results (For Sharing)",
            retry_btn: "🔄 Train Next Session Repeatedly",
            ad_notice: "Temporarily syncing ads for brain rest... Please wait a moment.",
            footer_warning: "This test is a cognitive training tool for simple screening purposes and cannot substitute for a medical diagnosis."
        }
    }
};

let currentLang = localStorage.getItem('global_lang') || 'en';

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

    updateUITranslations() {
        const getEl = id => document.getElementById(id);
        
        // -------------------------------------------------------------
        // 🔥 [유연한 크로스 매핑 스캔] ID가 없어도 클래스 구조로 강제 번역 인젝션
        // -------------------------------------------------------------
        
        // 1. 메인 대제목 & 설명글 (ID 폴백 및 H2, P 태그 스캔)
        const mainTitle = getEl('cannon-main-title') || document.querySelector('#play-screen h2');
        if (mainTitle) mainTitle.innerText = this.get('cannon.title');

        const mainDesc = getEl('cannon-main-desc') || document.querySelector('#play-screen p');
        if (mainDesc && !mainDesc.id?.includes('status')) mainDesc.innerText = this.get('cannon.description');

        // 2. 난이도 버튼 3종 클래스 자동 순서 추적
        const diffBtns = document.querySelectorAll('.diff-btn');
        if (diffBtns.length >= 3) {
            diffBtns[0].innerText = this.get('cannon.modes.easy');
            diffBtns[1].innerText = this.get('cannon.modes.normal');
            diffBtns[2].innerText = this.get('cannon.modes.hard');
        }

        // 3. 상태 대기 메세지창
        const statusText = getEl('status-text') || document.querySelector('[style*="color: rgb(255, 235, 59)"]') || document.querySelector('[style*="color:#ffeb3b"]');
        if (statusText) {
            const activeBtn = document.querySelector('.diff-btn.active');
            let currentDiff = 'normal';
            if (activeBtn) {
                if (activeBtn.innerText.includes('쉬움') || activeBtn.innerText.includes('Easy')) currentDiff = 'easy';
                if (activeBtn.innerText.includes('어려움') || activeBtn.innerText.includes('Hard')) currentDiff = 'hard';
            }
            
            if (currentDiff === 'easy') statusText.innerText = this.get('cannon.status_ready_easy');
            else if (currentDiff === 'hard') statusText.innerText = this.get('cannon.status_ready_hard');
            else statusText.innerText = this.get('cannon.status_ready');
        }

        // 4. 중앙 바운더리 점선 라인 텍스트
        const boundaryText = getEl('cannon-boundary-text') || document.querySelector('.barrier-line') || document.querySelector('[style*="border-top: 4px dashed"]');
        if (boundaryText) boundaryText.innerText = this.get('cannon.boundary_text');

        // 5. 대포 3개 하단 한글 라벨 강제 변환 (★캡처화면 속 범인 격파)
        const cannonContainers = document.querySelectorAll('.cannon-container');
        cannonContainers.forEach((container, index) => {
            // 대포 컨테이너 내부에 글씨가 적힌 하위 div나 span을 찾아 영어로 덮어씀
            const textNodes = Array.from(container.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
            if (textNodes.length > 0) {
                textNodes[0].textContent = this.get('cannon.cannon_label', { num: index + 1 });
            } else {
                // 내부 자식 요소 순회 변경
                const innerDiv = container.querySelector('div:last-child') || container;
                if (innerDiv && innerDiv !== container) {
                    innerDiv.innerText = this.get('cannon.cannon_label', { num: index + 1 });
                }
            }
        });
        
        // ID 기반 백업
        if (getEl('cannon-label-0')) getEl('cannon-label-0').innerText = this.get('cannon.cannon_label', {num: 1});
        if (getEl('cannon-label-1')) getEl('cannon-label-1').innerText = this.get('cannon.cannon_label', {num: 2});
        if (getEl('cannon-label-2')) getEl('cannon-label-2').innerText = this.get('cannon.cannon_label', {num: 3});

        if (getEl('input-title')) getEl('input-title').innerText = this.get('cannon.input_title');
        if (getEl('input-desc')) getEl('input-desc').innerText = this.get('cannon.input_desc');
        if (getEl('choice-label-0')) getEl('choice-label-0').innerText = this.get('cannon.choice_label', {num: 1});
        if (getEl('choice-label-1')) getEl('choice-label-1').innerText = this.get('cannon.choice_label', {num: 2});
        if (getEl('choice-label-2')) getEl('choice-label-2').innerText = this.get('cannon.choice_label', {num: 3});
        if (getEl('submit-btn')) getEl('submit-btn').innerText = this.get('cannon.submit_btn');

        // 10. 결과 화면 (Result Report)
        if (getEl('result-title')) getEl('result-title').innerText = this.get('cannon.result_success').replace('!', ''); // 예시
        if (getEl('share-btn')) getEl('share-btn').innerText = this.get('cannon.share_btn');
        if (getEl('retry-btn')) getEl('retry-btn').innerText = this.get('cannon.retry_btn');
        if (getEl('ad-notice-text')) getEl('ad-notice-text').innerText = this.get('cannon.ad_notice');
        
        // 6. 메인 검사 시작 버튼 (ID 검출 실패 시 버튼 스타일로 강제 타겟팅)
        const startBtn = getEl('start-btn') || document.querySelector('#play-screen button:not(.diff-btn)');
        if (startBtn) startBtn.innerText = this.get('cannon.start_btn');

        // 7. 하단 가이드 문구 2종 추적 치환
        const guideBox = document.querySelector('.guide-zone') || document.querySelector('div[style*="border: 1px dashed"]');
        if (guideBox) {
            const paragraphs = guideBox.querySelectorAll('p');
            if (paragraphs.length >= 2) {
                paragraphs[0].innerHTML = this.get('cannon.guide_focus');
                paragraphs[1].innerHTML = this.get('cannon.guide_sound');
            }
        }
        if (getEl('guide-focus')) getEl('guide-focus').innerHTML = this.get('cannon.guide_focus');
        if (getEl('guide-sound')) getEl('guide-sound').innerHTML = this.get('cannon.guide_sound');

        // 8. 최하단 푸터 경고문구
        const footerWarning = getEl('footer-warning') || document.querySelector('.footer-text') || document.querySelector('footer') || document.body.lastElementChild;
        if (footerWarning && footerWarning.innerText.includes('의학적')) {
            footerWarning.innerText = this.get('cannon.footer_warning');
        }

        
    }
};

window.i18n = i18n;

// 1. DOM 구조가 준비되었을 때 1차 실행
document.addEventListener('DOMContentLoaded', () => {
    if (typeof i18n !== 'undefined' && typeof i18n.updateUITranslations === 'function') {
        i18n.updateUITranslations();
    }
});

// 2. 이미지, 스타일 등 모든 리소스가 완벽히 렌더링된 직후 2차 강제 실행 (★핵심 방어벽)
window.addEventListener('load', () => {
    if (typeof i18n !== 'undefined' && typeof i18n.updateUITranslations === 'function') {
        i18n.updateUITranslations();
    }
    
    // 3. 간혹 발생하는 브라우저 타이밍 억까까지 완벽 차단하기 위해 100ms 뒤 최종 확인 사살
    setTimeout(() => {
        if (typeof i18n !== 'undefined' && typeof i18n.updateUITranslations === 'function') {
            console.log("🌐 [i18n] 영어 레이아웃 강제 동기화 최종 완료");
            i18n.updateUITranslations();
        }
    }, 100);
});