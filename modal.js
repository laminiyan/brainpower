/**
 * ❓ 도움말 모달을 화면에 동적으로 생성하여 띄우는 함수 (다국어 연동 완료)
 */
function openHelpModal() {
    if (document.getElementById('dynamic-help-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'dynamic-help-overlay';
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: '99999', padding: '20px', boxSizing: 'border-box'
    });

    const modal = document.createElement('div');
    Object.assign(modal.style, {
        backgroundColor: '#151515', color: '#fff', width: '100%', maxWidth: '360px',
        border: '1px solid #282828', borderRadius: '12px', padding: '24px', boxSizing: 'border-box',
        textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', position: 'relative'
    });

    // 전역 i18n 객체가 구현되어 있으면 다국어 데이터를, 없으면 기본 한국어 텍스트를 바인딩합니다.
    const hasI18n = (typeof i18n !== 'undefined');
    const titleText = hasI18n ? i18n.get('hub.guide_title') : "💡 두뇌 측정소 안내";
    const descText = hasI18n ? i18n.get('hub.guide_desc') : "본 플랫폼은 인간의 전두엽 피지컬(반응 속도, 공간 인지력, 인지 유연성)을 ms(밀리초) 단위로 정밀하게 측정하는 시뮬레이터입니다.<br><br>집중할 수 있는 환경을 만들어 참여하시면 더욱 정확한 측정 결과를 얻을 수 있습니다.";
    const closeText = hasI18n ? i18n.get('hub.modal_close') : "✕ 닫기";

    modal.innerHTML = `
        <h3 style="margin: 0; font-size: 18px; color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px;">
            ${titleText}
        </h3>
        <hr style="border: 0; border-top: 1px solid #282828; margin: 16px 0;">
        <p style="font-size: 14px; color: #aaa; line-height: 1.6; text-align: left; margin-top: 0; margin-bottom: 24px; word-break: keep-all;">
            ${descText}
        </p>
        <button id="btn-close-dynamic-help" style="
            width: 100%; background: #222; color: #fff; border: 1px solid #333;
            padding: 12px 0; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer;
        ">${closeText}</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden'; 

    const closeModal = () => { overlay.remove(); document.body.style.overflow = ''; };
    modal.querySelector('#btn-close-dynamic-help').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
}

/**
 * ⚙️ 설정(언어 선택) 모달을 화면에 동적으로 생성하여 띄우는 함수 (실시간 하이라이트 스위칭 반영)
 */
function openSettingsModal() {
    if (document.getElementById('dynamic-settings-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'dynamic-settings-overlay';
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: '99999', padding: '20px', boxSizing: 'border-box'
    });

    const modal = document.createElement('div');
    Object.assign(modal.style, {
        backgroundColor: '#151515', color: '#fff', width: '100%', maxWidth: '320px',
        border: '1px solid #282828', borderRadius: '12px', padding: '24px', boxSizing: 'border-box',
        textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
    });

    // 최신 통합 설정인 global_lang 키를 기준으로 현재 선택 언어 셋업
    const currentLang = localStorage.getItem('global_lang') || 'ko';

    modal.innerHTML = `
        <h3 style="margin: 0; font-size: 18px; color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>⚙️</span> 시스템 설정
        </h3>
        <hr style="border: 0; border-top: 1px solid #282828; margin: 16px 0;">
        
        <p style="font-size: 13px; color: #888; text-align: left; margin: 0 0 8px 0;">언어 설정 (Language)</p>
        <div style="display: flex; gap: 8px; margin-bottom: 24px;">
            <button id="lang-set-ko" style="
                flex: 1; padding: 12px 0; font-size: 14px; font-weight: bold; cursor: pointer; border-radius: 6px;
                background: ${currentLang === 'ko' ? '#007aff' : '#222'};
                color: ${currentLang === 'ko' ? '#fff' : '#aaa'};
                border: 1px solid ${currentLang === 'ko' ? '#007aff' : '#333'};
                transition: all 0.2s ease;
            ">한국어</button>
            
            <button id="lang-set-en" style="
                flex: 1; padding: 12px 0; font-size: 14px; font-weight: bold; cursor: pointer; border-radius: 6px;
                background: ${currentLang === 'en' ? '#007aff' : '#222'};
                color: ${currentLang === 'en' ? '#fff' : '#aaa'};
                border: 1px solid ${currentLang === 'en' ? '#007aff' : '#333'};
                transition: all 0.2s ease;
            ">English</button>
        </div>

        <button id="btn-close-dynamic-settings" style="
            width: 100%; background: #222; color: #fff; border: 1px solid #333;
            padding: 12px 0; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer;
        ">✕ 닫기</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const btnKo = modal.querySelector('#lang-set-ko');
    const btnEn = modal.querySelector('#lang-set-en');
    const closeModal = () => { overlay.remove(); document.body.style.overflow = ''; };

    // 🎨 [핵심 기능] 버튼 클릭 시 파란색 하이라이트 스타일을 즉시 스위칭하는 헬퍼 함수
    const updateModalButtonUI = (selected) => {
        if (selected === 'ko') {
            Object.assign(btnKo.style, { background: '#007aff', color: '#fff', borderColor: '#007aff' });
            Object.assign(btnEn.style, { background: '#222', color: '#aaa', borderColor: '#333' });
        } else {
            Object.assign(btnKo.style, { background: '#222', color: '#aaa', borderColor: '#333' });
            Object.assign(btnEn.style, { background: '#007aff', color: '#fff', borderColor: '#007aff' });
        }
    };

    // 한국어 버튼 클릭 시
    btnKo.addEventListener('click', () => {
        updateModalButtonUI('ko'); // 1. 화면 파란 불빛 즉시 이동
        if (typeof toggleLanguage === 'function') {
            toggleLanguage('ko');  // 2. index.html의 다국어 전환 함수 작동
        }
        setTimeout(closeModal, 150); // 3. 유저 인지를 위해 0.15초 후 모달 닫기
    });

    // 영어 버튼 클릭 시
    btnEn.addEventListener('click', () => {
        updateModalButtonUI('en'); // 1. 화면 파란 불빛 즉시 이동
        if (typeof toggleLanguage === 'function') {
            toggleLanguage('en');  // 2. index.html의 다국어 전환 함수 작동
        }
        setTimeout(closeModal, 150); // 3. 유저 인지를 위해 0.15초 후 모달 닫기
    });

    // 모달 닫기 제어
    modal.querySelector('#btn-close-dynamic-settings').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
}