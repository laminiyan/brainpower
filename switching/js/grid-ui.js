function transitionToGameScreen() {
    document.getElementById('start-screen')?.classList.add('hidden');
    document.getElementById('game-screen')?.classList.remove('hidden');
}

function updateRoundProgressUI() {
    const roundEl = document.getElementById('current-round');
    const barEl = document.getElementById('progress-bar');
    if (roundEl) roundEl.innerText = window.gridState.currentRound;
    if (barEl) barEl.style.width = ((window.gridState.currentRound - 1) / window.gridState.totalRounds) * 100 + '%';
}

function renderGridBoard(cellCount, isHard) {
    const board = document.getElementById('grid-board');
    if (!board) return;
    board.innerHTML = '';
    board.className = isHard ? 'grid-5x5' : 'grid-3x3';

    for (let i = 0; i < cellCount; i++) {
        const item = window.gridState.gridData[i];
        const cell = document.createElement('div');
        cell.className = `grid-cell bg-${item.bg}`;
        board.appendChild(cell);
    }

    // 순간 기억 (Type B 기믹 무대 조작)
    if (isHard && window.gridState.currentHardType === 'B') {
        window.gridState.blindTimeout = setTimeout(() => {
            document.querySelectorAll('.grid-cell').forEach(c => c.className = 'grid-cell bg-blind');
        }, 1500); 
    }

    buildGameInterface();
}

// 인터페이스 빌더 및 텍스트 렌더러
function buildGameInterface() {
    const guide = document.getElementById('guide-box');
    const choiceZone = document.getElementById('choice-zone');
    if (!guide || !choiceZone) return;
    choiceZone.innerHTML = '';

    let counts = { pink: 0, blue: 0, mint: 0 };
    window.gridState.gridData.forEach(item => counts[item.bg]++);

    // --- [🧘 스트레칭 / 🏃 파워 워킹 모드 UI 조립] ---
    if (window.gridState.currentMode !== 'hard') {
        const targetColor = window.GRID_COLORS[Math.floor(Math.random() * window.GRID_COLORS.length)];
        const correctCount = counts[targetColor];

        guide.innerText = window.gridState.currentMode === 'easy'
            ? window.getGridText('easy_guide', { icon: window.gridState.colorIcons[targetColor], name: window.gridState.colorNames[targetColor] })
            : window.getGridText('normal_guide', { name: window.gridState.colorNames[targetColor] });

        let options = [
            { text: `${correctCount}`, isCorrect: true },
            { text: `${correctCount + 1}`, isCorrect: false },
            { text: `${Math.max(0, correctCount - 1)}`, isCorrect: false }
        ].sort(() => Math.random() - 0.5);

        options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'choice-card';
            const suffix = window.gridLocale === 'ko' ? '개' : '';
            card.innerText = window.gridState.currentMode === 'easy' 
                ? `${window.gridState.colorIcons[targetColor]} ${opt.text}${suffix}` 
                : `${opt.text}${suffix}`;
            card.onclick = () => window.handleGridChoice(opt.isCorrect);
            choiceZone.appendChild(card);
        });
        return;
    }

    // --- [🏎️ 분노의 질주 변칙 모드 UI 조립] ---
    let sortedByCount = Object.keys(counts).sort((a, b) => counts[a] - counts[b]); 
    
    switch (window.gridState.currentHardType) {
        case 'A':
            guide.innerText = window.getGridText('type_a');
            createStroopCards(sortedByCount[0]);
            break;
        case 'B':
            guide.innerText = window.getGridText('type_b');
            createNormalCards(sortedByCount[2]);
            break;
        case 'C':
            const targetC = window.GRID_COLORS[Math.floor(Math.random() * window.GRID_COLORS.length)];
            const limit = 8;
            guide.innerText = window.getGridText('type_c', { name: window.gridState.colorNames[targetC], limit: limit });
            createOXCards(counts[targetC] >= limit);
            break;
        case 'D':
            const textKey = window.GRID_COLORS[Math.floor(Math.random() * window.GRID_COLORS.length)];
            const fakeColorKey = window.GRID_COLORS.filter(c => c !== textKey)[0];
            guide.innerHTML = `${window.getGridText('type_d')}<span class="text-${fakeColorKey}" style="font-weight:900;">[${window.gridState.colorNames[textKey]}]</span>`;
            createCountCards(counts[textKey]);
            break;
        case 'E':
            createOXCards(counts[sortedByCount[2]] >= 13);
            guide.innerText = window.getGridText('type_e');
            break;
        case 'F':
            guide.innerText = window.getGridText('type_f');
            createNormalCards(window.GRID_COLORS.find(c => counts[c] === 0));
            break;
        case 'G':
            guide.innerText = window.getGridText('type_g', { pink: window.gridState.colorNames.pink, blue: window.gridState.colorNames.blue });
            createOXCards(counts.pink > counts.blue);
            break;
        case 'H':
            let activeTarget = 'mint';
            guide.innerText = window.getGridText('type_h_start', { name: window.gridState.colorNames[activeTarget] });
            
            window.gridState.blindTimeout = setTimeout(() => {
                activeTarget = 'blue';
                guide.innerText = window.getGridText('type_h_change', { name: window.gridState.colorNames[activeTarget] });
                createCountCards(counts[activeTarget]);
            }, 1800);
            
            createCountCards(counts[activeTarget]);
            break;
    }
}

// 카드 조립용 단위 서브 컴포넌트 렌더러
function createNormalCards(correctColor) {
    const zone = document.getElementById('choice-zone');
    window.GRID_COLORS.forEach(c => {
        const card = document.createElement('div');
        card.className = 'choice-card';
        card.innerText = window.gridState.colorNames[c];
        card.onclick = () => window.handleGridChoice(c === correctColor);
        zone.appendChild(card);
    });
}

function createStroopCards(correctColor) {
    const zone = document.getElementById('choice-zone');
    const trapMap = { pink: 'blue', blue: 'mint', mint: 'pink' };
    window.GRID_COLORS.forEach(c => {
        const card = document.createElement('div');
        card.className = `choice-card text-${trapMap[c]}`;
        card.innerText = window.gridState.colorNames[c];
        card.onclick = () => window.handleGridChoice(c === correctColor);
        zone.appendChild(card);
    });
}

function createOXCards(isTrue) {
    const zone = document.getElementById('choice-zone');
    [[window.getGridText('ox_yes'), true], [window.getGridText('ox_no'), false]].forEach(item => {
        const card = document.createElement('div');
        card.className = 'choice-card';
        card.innerText = item[0];
        card.onclick = () => window.handleGridChoice(item[1] === isTrue);
        zone.appendChild(card);
    });
}

function createCountCards(correctCount) {
    const zone = document.getElementById('choice-zone');
    zone.innerHTML = '';
    let options = [correctCount, correctCount + 2, Math.max(0, correctCount - 2)];
    options = [...new Set(options)].sort(() => Math.random() - 0.5);
    
    options.forEach(num => {
        const card = document.createElement('div');
        card.className = 'choice-card';
        const suffix = window.gridLocale === 'ko' ? '개' : '';
        card.innerText = `${num}${suffix}`;
        card.onclick = () => window.handleGridChoice(num === correctCount);
        zone.appendChild(card);
    });
}

function renderPenaltyUI() {
    const guide = document.getElementById('guide-box');
    if (guide) guide.innerHTML = window.getGridText('penalty_text');
}

// 엔딩 리포트 렌더링 장치
function endGridGame() {
    document.getElementById('game-screen')?.classList.add('hidden');
    document.getElementById('result-screen')?.classList.remove('hidden');
    
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = '100%';
    
    const evalText = document.getElementById('evaluation-text');
    if (!evalText) return;

    if (window.gridState.currentMode === 'easy') {
        evalText.innerHTML = window.getGridText('result_easy', { time: window.gridState.totalElapsedTime });
    } else if (window.gridState.currentMode === 'normal') {
        evalText.innerHTML = window.getGridText('result_normal', { time: window.gridState.totalElapsedTime });
    } else {
        const penaltyStr = window.gridState.penaltyTimeMs > 0 
            ? window.getGridText('penalty_alert', { ms: window.gridState.penaltyTimeMs.toLocaleString() }) 
            : '';
        evalText.innerHTML = window.getGridText('result_hard', { time: window.gridState.totalElapsedTime, penalty: penaltyStr });
    }
}

function resetGridGame() {
    document.getElementById('result-screen')?.classList.add('hidden');
    document.getElementById('start-screen')?.classList.remove('hidden');
}

// 전역 공유 등록
window.transitionToGameScreen = transitionToGameScreen;
window.updateRoundProgressUI = updateRoundProgressUI;
window.renderGridBoard = renderGridBoard;
window.renderPenaltyUI = renderPenaltyUI;
window.endGridGame = endGridGame;
window.resetGridGame = resetGridGame;