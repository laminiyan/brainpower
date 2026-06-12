// ==========================================
// 🔊 오디오 엔진 (아이폰 대응형: 싱글톤)
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = (type === 'SPECIAL') ? 880 : (type === 'UP' ? 600 : 300);
    gain.gain.value = 0.1;
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// ==========================================
// 🎮 난이도 선택 제어
// ==========================================
function selectElevatorDifficulty(mode) {
    if (isGaming) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const diffKey = mode.toLowerCase();
    if (!DIFFICULTY_CONFIG[diffKey]) return;

    setDifficultyStatus(diffKey);

    const buttons = document.querySelectorAll('.mode-select-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));

    let targetButton = null;
    if (diffKey === 'silver') targetButton = buttons[0];
    else if (diffKey === 'normal') targetButton = buttons[1];
    else if (diffKey === 'genius') targetButton = buttons[2];

    if (targetButton) targetButton.classList.add('selected');

    const statusText = document.getElementById('el-status-text');
    if (statusText) {
        const config = DIFFICULTY_CONFIG[diffKey];
        const label = typeof getElText === 'function' ? getElText(config.labelKey) : config.modeKey;
        statusText.innerText = `[${label}] ${typeof getElText === 'function' ? getElText('el_ready') : 'Ready!'}`;
    }
}

// ==========================================
// 🕹️ 실시간 층수 연산 및 오감 제어 장치 (전체 로직 포함)
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

    const currentFloor = publicState.elActualStoppedFloor;
    const currentDisplay = document.getElementById('elevator-display');
    const currentDisplayBox = document.getElementById('elevator-display-box');
    const statusText = document.getElementById('el-status-text');

    // 🔔 1층/3층 도달 시 특수 피드백 (도착 이벤트)
    if (currentFloor === 1 || currentFloor === 3) {
        playSound('SPECIAL');
        if (currentDisplayBox) {
            currentDisplayBox.style.transition = "background-color 0.2s";
            currentDisplayBox.style.backgroundColor = "#ffeb3b";
            setTimeout(() => { currentDisplayBox.style.backgroundColor = "transparent"; }, 300);
        }
        if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
    } else {
        playSound(isUp ? 'UP' : 'DOWN');
    }

    // 렌더링 및 암흑 구간 연출
    if (!isDark) {
        if (statusText && typeof getElText === 'function') statusText.innerText = getElText('el_moving');
        if (currentDisplay) currentDisplay.innerText = currentFloor;
    } else {
        if (tick === Math.floor(config.totalSteps * 0.7)) {
            if (currentDisplay) {
                currentDisplay.classList.remove('blink-error');
                currentDisplay.innerText = currentFloor;
                currentDisplay.style.color = "#2196F3"; 
            }
            if (currentDisplayBox) currentDisplayBox.classList.remove('shake-action');
            if (statusText && typeof getElText === 'function') statusText.innerText = getElText('el_indicator');
            setTimeout(() => {
                if (tick < config.totalSteps - 1) {
                    const postDisplay = document.getElementById('elevator-display');
                    const postDisplayBox = document.getElementById('elevator-display-box');
                    const postStatus = document.getElementById('el-status-text');
                    if (postDisplay) {
                        postDisplay.innerText = "❓";
                        postDisplay.style.color = "#ff9800";
                        postDisplay.classList.add('blink-error');
                    }
                    if (postDisplayBox) postDisplayBox.classList.add('shake-action');
                    if (postStatus && typeof getElText === 'function') postStatus.innerText = getElText('el_dark_again');
                }
            }, 300);
        } else {
            if (currentDisplay) currentDisplay.innerText = "❓";
        }
    }

    // 🎯 진동 제어
    if (navigator.vibrate && currentFloor !== 1 && currentFloor !== 3) {
        let pattern = [];
        const baseTick = (currentDifficulty === 'genius') ? 35 : (isUp ? 65 : 95);
        const baseGap = (currentDifficulty === 'genius') ? 20 : (isUp ? 40 : 55);
        for (let i = 0; i < floorOffset; i++) { pattern.push(baseTick, baseGap); }
        navigator.vibrate(pattern);
    }

    // 테두리 강조
    if (currentDisplayBox && tick !== Math.floor(config.totalSteps * 0.7)) {
        currentDisplayBox.style.boxShadow = isUp ? "0 0 25px #4caf50" : "0 0 25px #f44336";
        setTimeout(() => { currentDisplayBox.style.boxShadow = "none"; }, 150);
    }
}

window.selectElevatorDifficulty = selectElevatorDifficulty;
window.simulateElevatorMovement = simulateElevatorMovement;