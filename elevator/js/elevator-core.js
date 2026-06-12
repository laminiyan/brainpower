// ==========================================
// 🔊 보조 함수: 1층/3층 전용 특수 사운드 재생
// ==========================================
function playSpecialArrivalSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880; // 도착 시 고음 알림
        gain.gain.value = 0.2;
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) { console.warn("Audio error:", e); }
}

// ==========================================
// 🎮 난이도 선택 제어
// ==========================================
function selectElevatorDifficulty(mode) {
    if (isGaming) return;
    const diffKey = mode.toLowerCase();
    if (!DIFFICULTY_CONFIG[diffKey]) return;
    setDifficultyStatus(diffKey);
    const buttons = document.querySelectorAll('.mode-select-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    let targetButton = (diffKey === 'silver') ? buttons[0] : (diffKey === 'normal' ? buttons[1] : buttons[2]);
    if (targetButton) targetButton.classList.add('selected');
    const statusText = document.getElementById('el-status-text');
    if (statusText) {
        const config = DIFFICULTY_CONFIG[diffKey];
        const label = typeof getElText === 'function' ? getElText(config.labelKey) : config.modeKey;
        statusText.innerText = `[${label}] ${typeof getElText === 'function' ? getElText('el_ready') : 'Ready!'}`;
    }
}

// ==========================================
// 🎧 오감 학습용 사전 테스트 함수
// ==========================================
function testHapticHint(direction, floorOffset) {
    if (typeof playElevatorSound === 'function') playElevatorSound(direction);
    if (navigator.vibrate) {
        let pattern = [];
        if (currentDifficulty === 'genius') {
            for (let i = 0; i < floorOffset; i++) pattern.push(35, 20);
        } else if (currentDifficulty === 'normal') {
            const base = direction === 'UP' ? [65, 40] : [95, 55];
            for (let i = 0; i < floorOffset; i++) pattern.push(...base);
        } else {
            const base = direction === 'UP' ? [140, 70] : [180, 90];
            for (let i = 0; i < floorOffset; i++) pattern.push(...base);
        }
        navigator.vibrate(pattern);
    }
    const displayBox = document.getElementById('elevator-display-box');
    if (displayBox) {
        displayBox.style.boxShadow = direction === 'UP' ? `0 0 25px #4caf50` : `0 0 25px #f44336`;
        setTimeout(() => { displayBox.style.boxShadow = "none"; }, 150);
    }
}

// ==========================================
// 🕹️ 실시간 층수 연산 및 오감 제어 장치 (1층/3층 피드백 추가)
// ==========================================
function simulateElevatorMovement(tick, isDark) {
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    if (!config) return;

    let isUp = Math.random() > 0.50; 
    if (publicState.elActualStoppedFloor <= 3) isUp = Math.random() > 0.20;
    else if (publicState.elActualStoppedFloor >= 25) isUp = Math.random() > 0.80;

    let floorOffset = Math.floor(Math.random() * config.maxJump) + 1; 
    if (isUp) publicState.elActualStoppedFloor += floorOffset;
    else publicState.elActualStoppedFloor = Math.max(1, publicState.elActualStoppedFloor - floorOffset); 

    const floor = publicState.elActualStoppedFloor;
    const currentDisplay = document.getElementById('elevator-display');
    const currentDisplayBox = document.getElementById('elevator-display-box');
    const statusText = document.getElementById('el-status-text');

    // [특수 이벤트: 1층/3층 도착 시]
    if (floor === 1 || floor === 3) {
        playSpecialArrivalSound();
        if (currentDisplayBox) {
            currentDisplayBox.style.transition = "background-color 0.2s";
            currentDisplayBox.style.backgroundColor = "#ffeb3b";
            setTimeout(() => currentDisplayBox.style.backgroundColor = "transparent", 300);
        }
        if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
    }

    // [기존 렌더링 로직]
    if (!isDark) {
        if (statusText && typeof getElText === 'function') statusText.innerText = getElText('el_moving');
        if (currentDisplay) currentDisplay.innerText = floor;
    } else {
        if (tick === Math.floor(config.totalSteps * 0.7)) {
            if (currentDisplay) { currentDisplay.innerText = floor; currentDisplay.style.color = "#2196F3"; }
            setTimeout(() => {
                if (tick < config.totalSteps - 1) {
                    const postDisplay = document.getElementById('elevator-display');
                    if (postDisplay) { postDisplay.innerText = "❓"; postDisplay.style.color = "#ff9800"; }
                }
            }, 300);
        } else if (currentDisplay) currentDisplay.innerText = "❓";
    }

    // [일반 이동 시 진동]
    if (navigator.vibrate && floor !== 1 && floor !== 3) {
        let pattern = [];
        const diff = currentDifficulty;
        const baseTick = (diff === 'genius') ? 35 : (isUp ? 65 : 95);
        const baseGap = (diff === 'genius') ? 20 : (isUp ? 40 : 55);
        for (let i = 0; i < floorOffset; i++) pattern.push(baseTick, baseGap);
        navigator.vibrate(pattern);
    }
}

window.selectElevatorDifficulty = selectElevatorDifficulty;
window.testHapticHint = testHapticHint;
window.simulateElevatorMovement = simulateElevatorMovement;