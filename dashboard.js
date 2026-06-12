const BrainDB = {
    // 저장: 전체 데이터를 불러와서, 특정 게임Key만 갱신 후 다시 저장
    saveRecord: (gameKey, newRecord) => {
        let db = JSON.parse(localStorage.getItem('brain_hub_records') || '{}');
        if (!db[gameKey]) db[gameKey] = [];
        db[gameKey].push(newRecord);
        localStorage.setItem('brain_hub_records', JSON.stringify(db));
    },
    
    // 로드: 전체 DB를 안전하게 가져옴
    getAll: () => {
        try {
            return JSON.parse(localStorage.getItem('brain_hub_records') || '{}');
        } catch(e) { return {}; }
    }
};

function renderMiniBrainDashboard() {
    const targetContainer = document.getElementById('brain-mini-dashboard');
    if (!targetContainer) return;

    // 1. BrainDB를 통해 안전하게 데이터 로드
    const db = BrainDB.getAll();
    
    // 데이터가 아예 비어있거나 객체 형식이 아닌 경우 처리
    if (!db || typeof db !== 'object' || Object.keys(db).length === 0) {
        return targetContainer.innerHTML = `
            <div class="mini-db-card" style="text-align:center; padding:10px 0;">
                <p style="color:#666; margin:0; font-size:13px;">👋 반가워요! 아직 측정 기록이 없습니다.<br>훈련을 시작해 전두엽 피지컬을 기록하세요! 🧠</p>
            </div>`;
    }

    // 속도형 데이터 계산 헬퍼
    const calculateSpeedMetrics = (records, badgeStyleTailwind = '') => {
        const playCount = records.length;
        const scores = records.map(r => r.score).filter(s => typeof s === 'number' && s > 0);
        const best = scores.length > 0 ? Math.min(...scores) + "ms" : "-";
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) + "ms" : "-";
        
        const recent = records.slice(-5).reverse();
        let trendHtml = recent.length > 0 ? "" : "<span style='color:#555; font-size:10px;'>기록 없음</span>";
        recent.forEach(r => {
            trendHtml += `<span class="trend-badge success" style="${badgeStyleTailwind}">🎯 ${r.score}ms</span> `;
        });
        return { playCount, best, avg, trendHtml };
    };

    // 📊 데이터 가공
    const cannon = calculateSpeedMetrics(db.cannon || []);
    
    const elRecords = db.elevator || [];
    const elPlayCount = elRecords.length;
    const elCorrectCount = elRecords.filter(r => r.success === true || r.success === 1).length;
    const elSuccessRate = elPlayCount > 0 ? Math.round((elCorrectCount / elPlayCount) * 100) + "%" : "-";
    let elTrendHtml = elRecords.slice(-5).reverse().map(r => 
        (r.success === true || r.success === 1) ? `<span class="trend-badge success">🟢</span>` : `<span class="trend-badge fail">🔴</span>`
    ).join(' ');

    const switching = calculateSpeedMetrics(db.switching || [], "background:#1d3557; color:#a8dadc; border-color:#457b9d;");

    // 💻 렌더링
    targetContainer.innerHTML = `
        <div class="mini-db-card">
            <h3 style="margin-bottom: 12px; font-size:15px;">📊 나의 두뇌 피지컬 정밀 리포트</h3>
            
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #ff8a8a; font-weight: bold;">🚀 초정밀 대포 사격</p>
            <div class="db-grid" style="margin-bottom: 12px;">
                <div class="db-item"><strong>총 훈련</strong><br><span class="db-val">${cannon.playCount}회</span></div>
                <div class="db-item"><strong>최고</strong><br><span class="db-val" style="color:#ff4444;">${cannon.best}</span></div>
                <div class="db-item"><strong>평균</strong><br><span class="db-val" style="color:#ff8a8a;">${cannon.avg}</span></div>
            </div>

            <hr style="border:0; border-top:1px solid #2d2d2d; margin:14px 0;">

            <p style="margin: 0 0 6px 0; font-size: 12px; color: #8aff96; font-weight: bold;">🛗 미스터리 엘리베이터</p>
            <div class="db-grid" style="margin-bottom: 12px;">
                <div class="db-item"><strong>총 훈련</strong><br><span class="db-val">${elPlayCount}회</span></div>
                <div class="db-item"><strong>정답률</strong><br><span class="db-val" style="color:#4caf50;">${elSuccessRate}</span></div>
                <div class="db-item"><strong>최근</strong><br><div style="display:flex; gap:2px;">${elTrendHtml}</div></div>
            </div>

            <hr style="border:0; border-top:1px solid #2d2d2d; margin:14px 0;">

            <p style="margin: 0 0 6px 0; font-size: 12px; color: #a8dadc; font-weight: bold;">🌀 다이내믹 규칙 전환</p>
            <div class="db-grid">
                <div class="db-item"><strong>총 훈련</strong><br><span class="db-val">${switching.playCount}회</span></div>
                <div class="db-item"><strong>최고</strong><br><span class="db-val" style="color:#2196F3;">${switching.best}</span></div>
                <div class="db-item"><strong>평균</strong><br><span class="db-val" style="color:#a8dadc;">${switching.avg}</span></div>
            </div>
        </div>
    `;
}