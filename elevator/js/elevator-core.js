// ==========================================
// 🎮 난이도 선택 제어 (새로운 DIFFICULTY_CONFIG 규격 완벽 반영)
// ==========================================
function selectElevatorDifficulty(mode) {
    if (isGaming) return; // 전역 마스터 플래그 참조

    // 인자값 소문자 표준화 ('SILVER' -> 'silver')
    const diffKey = mode.toLowerCase();
    if (!DIFFICULTY_CONFIG[diffKey]) return;

    // 1. 글로벌 난이도 상태 변경 마스터 함수 호출
    setDifficultyStatus(diffKey);

    // 2. 화면 상의 모든 난이도 버튼 클래스 초기화
    const buttons = document.querySelectorAll('.mode-select-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));

    // 3. 소문자 키를 기반으로 정확한 타겟 버튼을 찾아 'selected' 클래스 주입
    let targetButton = null;
    if (diffKey === 'silver') {
        targetButton = buttons[0];  // 쉬움🧘 (실버)
    } else if (diffKey === 'normal') {
        targetButton = buttons[1];  // 일반🧑 (노멀)
    } else if (diffKey === 'genius') {
        targetButton = buttons[2];  // 어려움⚡ (천재)
    }

    if (targetButton) {
        targetButton.classList.add('selected');
    }

    // 4. 상태 텍스트 출력 다국어 연동
    const statusText = document.getElementById('el-status-text');
    if (statusText) {
        const config = DIFFICULTY_CONFIG[diffKey];
        const label = typeof getElText === 'function' ? getElText(config.labelKey) : config.modeKey;
        statusText.innerText = `[${label}] ${typeof getElText === 'function' ? getElText('el_ready') : 'Ready!'}`;
    }
}

function playElevatorSound(floorOffset) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // 1~5층에 대응하는 직관적인 음계 (도, 레, 미, 파, 솔)
    // 5층으로 갈수록 소리가 높아지지만, 훨씬 깔끔합니다.
    const scales = [261.63, 293.66, 329.63, 349.23, 392.00];
    osc.frequency.value = scales[Math.min(floorOffset, 5) - 1];
    
    // 부드러운 사인파 사용 (정신 사납지 않음)
    osc.type = 'sine';
    
    // 짧고 간결하게 (0.2초)
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

// ==========================================
// 🎧 오감 학습용 사전 테스트 함수 (currentDifficulty 기반 진동 제어)
// ==========================================
function testHapticHint(floorOffset) {
    // 1. 함수 존재 여부 안전 체크
    if (typeof window.playElevatorSound === 'function') {
        window.playElevatorSound(floorOffset);
    } else {
        console.warn("playElevatorSound 함수가 정의되지 않았습니다.");
    }
    
    // 2. 진동 테스트
    if (navigator.vibrate) {
        let pattern = [];
        // currentDifficulty가 없을 경우 'silver'로 대체하여 오류 방지
        const diff = typeof currentDifficulty !== 'undefined' ? currentDifficulty : 'silver';
        
        if (diff === 'genius') {
            pattern = [35, 20, 35, 20]; // 테스트용 짧은 패턴
        } else {
            pattern = [100, 50]; 
        }
        navigator.vibrate(pattern);
        console.log("진동 패턴 실행:", pattern);
    } else {
        console.log("이 기기는 진동(Vibrate API)을 지원하지 않습니다.");
    }
    
    // 3. UI 피드백
    const displayBox = document.getElementById('elevator-display-box');
    if (displayBox) {
        displayBox.style.boxShadow = direction === 'UP' ? "0 0 25px #4caf50" : "0 0 25px #f44336";
        setTimeout(() => { displayBox.style.boxShadow = "none"; }, 150);
    }
}

// ==========================================
// 🕹️ 실시간 층수 연산 및 오감 제어 장치 (publicState 바인딩 완비)
// ==========================================
function simulateElevatorMovement(tick, isDark) {
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    if (!config) return;

    let isUp = Math.random() > 0.50; 
    
    // 이탈 방지용 안전 영역 마지노선 연산
    if (publicState.elActualStoppedFloor <= 3) {
        isUp = Math.random() > 0.20; 
    } else if (publicState.elActualStoppedFloor >= 25) {
        isUp = Math.random() > 0.80; 
    }

    let floorOffset = Math.floor(Math.random() * config.maxJump) + 1; 
    
    if (isUp) {
        publicState.elActualStoppedFloor += floorOffset;
    } else {
        publicState.elActualStoppedFloor = Math.max(1, publicState.elActualStoppedFloor - floorOffset); 
    }

    // 🔊 움직임 발생 시 소리 재생 호출
    playElevatorSound(publicState.elActualStoppedFloor);

    const currentDisplay = document.getElementById('elevator-display');
    const currentDisplayBox = document.getElementById('elevator-display-box');
    const statusText = document.getElementById('el-status-text');

    // UI 업데이트 로직 (암흑 구간 처리 포함)
    if (!isDark) {
        if (statusText && typeof getElText === 'function') statusText.innerText = getElText('el_moving');
        if (currentDisplay) currentDisplay.innerText = publicState.elActualStoppedFloor;
    } else {
        if (tick === Math.floor(config.totalSteps * 0.7)) {
            if (currentDisplay) {
                currentDisplay.innerText = publicState.elActualStoppedFloor;
                currentDisplay.style.color = "#2196F3"; 
            }
            setTimeout(() => {
                if (tick < config.totalSteps - 1) {
                    if (currentDisplay) {
                        currentDisplay.innerText = "❓";
                        currentDisplay.style.color = "#ff9800";
                    }
                }
            }, 300);
        } else {
            if (currentDisplay) currentDisplay.innerText = "❓";
        }
    }

    // 🎯 진동 제어
    if (navigator.vibrate) {
        let pattern = [];
        // 진동 패턴 생성 로직
        if (currentDifficulty === 'genius') {
            for (let i = 0; i < floorOffset; i++) { pattern.push(35, 20); }
        } else if (currentDifficulty === 'normal') {
            const t = isUp ? 65 : 95; const g = isUp ? 40 : 55;
            for (let i = 0; i < floorOffset; i++) { pattern.push(t, g); }
        } else {
            const t = isUp ? 140 : 180; const g = isUp ? 70 : 90;
            for (let i = 0; i < floorOffset; i++) { pattern.push(t, g); }
        }
        navigator.vibrate(pattern);
    }

    // 시각 힌트
    if (currentDisplayBox) {
        currentDisplayBox.style.boxShadow = isUp ? "0 0 25px #4caf50" : "0 0 25px #f44336";
        setTimeout(() => { currentDisplayBox.style.boxShadow = "none"; }, 150);
    }
}

// ==========================================
// 📦 글로벌 스코프 전역 객체 바인딩 등록
// ==========================================
window.selectElevatorDifficulty = selectElevatorDifficulty;
window.testHapticHint = testHapticHint;
window.simulateElevatorMovement = simulateElevatorMovement;
