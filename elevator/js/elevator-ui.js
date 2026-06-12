function getElScreens() {
    return {
        playScreen: document.getElementById('elevator-play-screen'),
        inputScreen: document.getElementById('elevator-input-screen'),
        resultScreen: document.getElementById('elevator-result-screen')
    };
}

// 🕹️ 게임 시작 (새로운 DIFFICULTY_CONFIG 및 마스터 플래그 동기화)
function startElevatorGame() {
    if (isGaming) return; // 전역 마스터 플래그 참조
    setGamingStatus(true); // 마스터 세터 호출

    if (document.getElementById('el-start-btn')) document.getElementById('el-start-btn').style.display = 'none';
    if (document.getElementById('lobby-intro-zone')) document.getElementById('lobby-intro-zone').style.setProperty('display', 'none', 'important');
    
    // publicState 핵심 인지 트래킹 지표 초기화
    publicState.elActualStoppedFloor = 1; 
    publicState.elUserSelectedFloor = null;
    publicState.isElFirstClickRecorded = false;
    
    if (document.getElementById('el-submit-btn')) document.getElementById('el-submit-btn').disabled = true;
    if (document.getElementById('elevator-display')) {
        document.getElementById('elevator-display').innerText = "1";
        document.getElementById('elevator-display').style.color = "#ff9800";
    }
    if (document.getElementById('el-status-text') && typeof getElText === 'function') {
        document.getElementById('el-status-text').innerText = getElText('el_start_status');
    }

    const config = DIFFICULTY_CONFIG[currentDifficulty];
    if (!config) return;

    let elapsedSteps = 0;
    // 대포 게임 구조와 동일하게 countdownTimerId에 타이머 참조 할당
    publicState.countdownTimerId = setInterval(() => {
        elapsedSteps++;
        const currentDisplay = document.getElementById('elevator-display');
        const currentDisplayBox = document.getElementById('elevator-display-box');

        if (elapsedSteps < config.blindStart) {
            window.simulateElevatorMovement(elapsedSteps, false);
        } 
        else if (elapsedSteps >= config.blindStart && elapsedSteps < config.totalSteps) {
            if (elapsedSteps === config.blindStart) {
                if (currentDisplay) { currentDisplay.innerText = "❓"; currentDisplay.classList.add('blink-error'); }
                if (currentDisplayBox) currentDisplayBox.classList.add('shake-action');
            }
            window.simulateElevatorMovement(elapsedSteps, true); 
        } 
        else if (elapsedSteps === config.totalSteps) {
            clearInterval(publicState.countdownTimerId);
            if (currentDisplay) {
                currentDisplay.classList.remove('blink-error');
                currentDisplay.innerText = "STOP"; 
                currentDisplay.style.color = "#f44336";
            }
            if (currentDisplayBox) currentDisplayBox.classList.remove('shake-action');
            if (document.getElementById('el-status-text') && typeof getElText === 'function') {
                document.getElementById('el-status-text').innerText = getElText('el_stop');
            }
            
            setTimeout(() => { endElevatorFiringPhase(); }, 800);
        }
    }, config.interval);
}

// 🌑 암흑 훈련 단계 종료 후 정답 입력 유도
function endElevatorFiringPhase() {
    const screens = getElScreens();
    if (screens.playScreen) screens.playScreen.style.setProperty('display', 'none', 'important');
    if (screens.inputScreen) screens.inputScreen.style.setProperty('display', 'block', 'important');
    publicState.elDarkEndTime = performance.now();
    generateElevatorSampleButtons(publicState.elActualStoppedFloor);
}

// 🎛️ 객관식 정답 버튼 무작위 레이아웃 연산
function generateElevatorSampleButtons(realFloor) {
    const groupEl = document.getElementById('elevator-btn-group');
    if (!groupEl) return;
    groupEl.innerHTML = '';

    let choices = new Set([realFloor]); 
    while(choices.size < 4) {
        let candidate = realFloor + (Math.floor(Math.random() * 7) - 3);
        if(candidate >= 1) choices.add(candidate);
    }

    Array.from(choices).sort((a, b) => a - b).forEach(floor => {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.innerText = `${floor}`;
        btn.onclick = function() {
            if (!publicState.isElFirstClickRecorded) {
                publicState.elFirstClickTime = performance.now();
                publicState.isElFirstClickRecorded = true;
            }
            const brothers = groupEl.getElementsByClassName('num-btn');
            for(let b of brothers) b.classList.remove('selected');
            btn.classList.add('selected');
            publicState.elUserSelectedFloor = floor; 
            if (document.getElementById('el-submit-btn')) document.getElementById('el-submit-btn').disabled = false; 
        };
        groupEl.appendChild(btn);
    });
}

// 📊 정답 제출 및 통계 데이터 이식
function submitElevatorAnswer() {
    const finalSubmitTime = performance.now();
    const elBrainPlanningTime = Math.round(publicState.elFirstClickTime - publicState.elDarkEndTime); 
    const elHandExecutionTime = Math.round(finalSubmitTime - publicState.elFirstClickTime); 
    const isCorrect = (publicState.elUserSelectedFloor === publicState.elActualStoppedFloor);
    
    const screens = getElScreens();
    if (screens.inputScreen) screens.inputScreen.style.setProperty('display', 'none', 'important');
    if (screens.resultScreen) screens.resultScreen.style.setProperty('display', 'block', 'important');

    const pseudoPatientCode = "P_" + Math.random().toString(36).substr(2, 4).toUpperCase();
    if (document.getElementById('el-result-meta')) {
        document.getElementById('el-result-meta').innerText = `ID: [${pseudoPatientCode}] / Sandbox`;
    }

    const titleEl = document.getElementById('el-result-title');
    const scoreEl = document.getElementById('el-result-score');

    if (isCorrect) {
        if (titleEl) { titleEl.innerText = typeof getElText === 'function' ? getElText('el_success') : '🎉 Success'; titleEl.style.color = "#4caf50"; }
        if (scoreEl && typeof getElText === 'function') scoreEl.innerText = getElText('el_success_desc');
    } else {
        if (titleEl) { titleEl.innerText = typeof getElText === 'function' ? getElText('el_fail') : '❌ Incorrect'; titleEl.style.color = "#f44336"; }
        if (scoreEl && typeof getElText === 'function') {
            scoreEl.innerText = getElText('el_fail_desc', { real: publicState.elActualStoppedFloor, user: publicState.elUserSelectedFloor });
        }
    }

    // 컨피그 객체 내부의 고유 대문자 식별자 'modeKey' 바인딩
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    let activeModeLabel = config ? config.modeKey : "NORMAL";

    // 공용 데이터 엔진 연동 ('elevator')
    if (typeof saveBrainGameRecord === 'function') {
        saveBrainGameRecord('elevator', activeModeLabel, isCorrect, elBrainPlanningTime);
    }

    let statsHtml = "";
    if (typeof getGameStatistics === 'function') {
        const stats = getGameStatistics('elevator', activeModeLabel);
        if (stats) {
            statsHtml = `<hr style="border:0; border-top:1px dashed #444; margin:15px 0;">` +
                        `<div style="text-align:left; font-size:13px; color:#aaa; line-height:1.6;">` +
                        `🥇 [${activeModeLabel}] Best: <span style="color:#00C853; font-weight:bold;">${stats.bestScore}</span><br>` +
                        `⏱️ Avg: <span style="color:#ffd93d; font-weight:bold;">${stats.recentAverage}</span><br>` +
                        `<p style="font-size:12px; color:#fff; margin:10px 0 5px 0;">📅 4주간 두뇌 피지컬 추이 (클리어 속도)</p>` +
                        stats.monthlyReport +
                        `</div>`;
        }
    }

    if (document.getElementById('el-result-rt') && typeof getElText === 'function') {
        document.getElementById('el-result-rt').innerHTML = 
            getElText('el_speed_brain') + `<span style="color:#2196F3; font-weight:bold;">${elBrainPlanningTime}ms</span><br>` +
            getElText('el_speed_hand') + `<span style="color:#ff9800; font-weight:bold;">${elHandExecutionTime}ms</span>` + statsHtml;
    }

    publicState.elevatorShareText = `[🛗 Mystery Elevator Cognitive Test]\n• Status: ${isCorrect ? "⭕ Success" : "❌ Fail"}\n• Brain Speed: ${elBrainPlanningTime}ms\n• Code: ${pseudoPatientCode}`;
}

// 📋 결과 링크 복사 클립보드 장치
function copyElevatorResult() {
    if (!publicState.elevatorShareText) return;
    navigator.clipboard.writeText(publicState.elevatorShareText).then(() => {
        alert("Copied!");
    });
}

// 🔄 재도전 및 락 해제 초기화 엔진
function resetElevatorGame() {
    const adNotice = document.getElementById('ad-notice-text');
    if (adNotice) adNotice.style.display = 'block';

    setTimeout(() => {
        if (adNotice) adNotice.style.display = 'none';
        
        setGamingStatus(false); // 마스터 플래그 초기화
        
        if (document.getElementById('lobby-intro-zone')) document.getElementById('lobby-intro-zone').style.setProperty('display', 'block', 'important');
        if (document.getElementById('el-submit-btn')) document.getElementById('el-submit-btn').disabled = true;
        if (document.getElementById('el-start-btn')) document.getElementById('el-start-btn').style.display = 'inline-block';
        if (document.getElementById('el-status-text') && typeof getElText === 'function') {
            document.getElementById('el-status-text').innerText = getElText('el_retry_status');
        }
        
        if (document.getElementById('elevator-display')) {
            document.getElementById('elevator-display').innerText = "1";
            document.getElementById('elevator-display').style.color = "#ff9800";
        }
        const screens = getElScreens();
        if (screens.resultScreen) screens.resultScreen.style.setProperty('display', 'none', 'important');
        if (screens.playScreen) screens.playScreen.style.setProperty('display', 'block', 'important');
    }, 350); 
}

// ==========================================
// 📦 글로벌 스코프 전역 객체 바인딩 등록
// ==========================================
window.startElevatorGame = startElevatorGame;
window.submitElevatorAnswer = submitElevatorAnswer;
window.copyElevatorResult = copyElevatorResult;
window.resetElevatorGame = resetElevatorGame;