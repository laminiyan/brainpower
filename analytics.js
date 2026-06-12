// ========================================================
// 📊 [두뇌 피지컬 측정소] 전 웹페이지 공용 GA4 통합 추적 엔진 (analytics.js)
// ========================================================
(function() {
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // 👈 발급받으신 구글 측정 ID

    // 1. 구글 gtag.js 비동기 스크립트 강제 주입
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gaScript);

    // 2. 글로벌 데이터 레이어 및 gtag 함수 정의
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
})();