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

// ==========================================
// 🎧 오감 학습용 사전 테스트 함수 (currentDifficulty 기반 진동 제어)
// ==========================================
function testHapticHint(direction, floorOffset) {
    if (typeof playElevatorSound === 'function') {
        playElevatorSound(direction);
    }
    
    if (navigator.vibrate) {
        let pattern = [];
        
        // 🎯 변경된 currentDifficulty 상태값을 직접 바라보고 판정 (텍스트 비교 버그 원천 차단)
        if (currentDifficulty === 'genius') {
            // 🔥 [GENIUS] 초고속 뇌지컬 구간 (박자를 셀 수 없을 만큼 촘촘하게 압축)
            const baseTick = 35;
            const baseGap = 20;
            for (let i = 0; i < floorOffset; i++) {
                pattern.push(baseTick);
                pattern.push(baseGap);
            }
        } else if (currentDifficulty === 'normal') {
            // 🏃 [NORMAL] 스탠다드 구간 (기존 리듬보다 선명한 속도감 제공)
            const baseTick = direction === 'UP' ? 65 : 95;
            const baseGap = direction === 'UP' ? 40 : 55;
            for (let i = 0; i < floorOffset; i++) {
                pattern.push(baseTick);
                pattern.push(baseGap);
            }
        } else {
            // 🧘 [SILVER] 넉넉한 힐링 코스 (여유롭게 카운팅 가능)
            const baseTick = direction === 'UP' ? 140 : 180;
            const baseGap = direction === 'UP' ? 70 : 90;
            for (let i = 0; i < floorOffset; i++) {
                pattern.push(baseTick);
                pattern.push(baseGap);
            }
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
// 🕹️ 실시간 층수 연산 및 오감 제어 장치 (publicState 바인딩 완비)
// ==========================================
function simulateElevatorMovement(tick, isDark) {
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    if (!config) return;

    let isUp = Math.random() > 0.50; 
    
    // 이탈 방지용 안전 영역 마지노선 연산 (elState -> publicState로 변경)
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

    const currentDisplay = document.getElementById('elevator-display');
    const currentDisplayBox = document.getElementById('elevator-display-box');
    const statusText = document.getElementById('el-status-text');

    // 암흑(Blind) 구간 및 찰나의 힌트 연출 분기 처리
    if (!isDark) {
        if (statusText && typeof getElText === 'function') statusText.innerText = getElText('el_moving');
        if (currentDisplay) currentDisplay.innerText = publicState.elActualStoppedFloor;
    } 
    else {
        // 전체 스텝의 70% 시점에서 찰나의 눈부심(중간 인디케이터) 노출
        if (tick === Math.floor(config.totalSteps * 0.7)) {
            if (currentDisplay) {
                currentDisplay.classList.remove('blink-error');
                currentDisplay.innerText = publicState.elActualStoppedFloor;
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

    // 🎯 진동 모듈 제어 (currentDifficulty 상태를 직접 바라보고 매핑)
    if (navigator.vibrate) {
        let pattern = [];

        if (currentDifficulty === 'genius') {
            const baseTick = 35;
            const baseGap = 20;
            for (let i = 0; i < floorOffset; i++) {
                pattern.push(baseTick);
                pattern.push(baseGap);
            }
        } else if (currentDifficulty === 'normal') {
            const baseTick = isUp ? 65 : 95;
            const baseGap = isUp ? 40 : 55;
            for (let i = 0; i < floorOffset; i++) {
                pattern.push(baseTick);
                pattern.push(baseGap);
            }
        } else {
            const baseTick = isUp ? 140 : 180;
            const baseGap = isUp ? 70 : 90;
            for (let i = 0; i < floorOffset; i++) {
                pattern.push(baseTick);
                pattern.push(baseGap);
            }
        }
        navigator.vibrate(pattern);
    }

    // 디스플레이 테두리 시각 힌트 갱신
    if (currentDisplayBox && tick !== Math.floor(config.totalSteps * 0.7)) {
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
