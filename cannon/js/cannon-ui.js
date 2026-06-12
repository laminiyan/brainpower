// ==========================================================================
// cannon-ui.js - 하드코딩 제거 및 i18n 완전 결합형 UI 제어 엔진
// ==========================================================================

function setDifficulty(diff) {
    if (isGaming) return;
    if (DIFFICULTY_CONFIG[diff]) {
        setDifficultyStatus(diff);
        
        document.querySelectorAll('.diff-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`diff-btn-${diff}`);
        if (activeBtn) activeBtn.classList.add('active');
        
        if (typeof i18n !== 'undefined' && typeof i18n.updateUITranslations === 'function') {
            i18n.updateUITranslations();
        }
    }
}

function updateStatusDisplay(seconds) {
    const statusText = document.getElementById('status-text');
    if (statusText) {
        statusText.innerText = typeof i18n !== 'undefined' ? 
            i18n.get('cannon.status_time_left', { time: seconds }) : `⏱️ Time left: ${seconds}s`;
    }
}

function changeScreen(hideId, showId) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);
    if (hideEl) hideEl.style.setProperty('display', 'none', 'important');
    if (showEl) showEl.style.setProperty('display', 'flex', 'important');
}

function endCannonFiringPhase() {
    changeScreen('play-screen', 'input-screen');
    publicState.cannonEndTime = performance.now(); 
    
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    for (let i = 0; i < 3; i++) {
        if (i >= config.activeCannons) {
            publicState.cannonUserAnswers[i] = 0;
            const groupEl = document.getElementById(`group-${i}`);
            const disabledText = typeof i18n !== 'undefined' ? i18n.get('cannon.disabled_label') : "Disabled (0)";
            if (groupEl) groupEl.innerHTML = `<span style="color:#666; font-size:12px;">${disabledText}</span>`;
        } else {
            generateCannonSampleButtons(i, publicState.cannonActualCount[i]);
        }
    }
}

function generateCannonSampleButtons(cannonId, realValue) {
    const groupEl = document.getElementById(`group-${cannonId}`);
    if (!groupEl) return;
    groupEl.innerHTML = ''; 

    let choices = new Set();
    choices.add(realValue); 

    while(choices.size < 4) {
        let offset = Math.floor(Math.random() * 5) - 2; 
        let candidate = realValue + offset;
        if(candidate >= 0) choices.add(candidate);
    }

    let sortedChoices = Array.from(choices).sort((a, b) => a - b);

    sortedChoices.forEach(num => {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.innerText = num;
        
        btn.addEventListener('pointerdown', function(e) {
            e.preventDefault();
            if (!publicState.isCannonFirstClickRecorded) {
                publicState.cannonFirstClickTime = performance.now(); 
                publicState.isCannonFirstClickRecorded = true;
            }

            const brothers = groupEl.getElementsByClassName('num-btn');
            for(let b of brothers) b.classList.remove('selected');
            btn.classList.add('selected');
            
            publicState.cannonUserAnswers[cannonId] = num; 

            if(publicState.cannonUserAnswers.every(ans => ans !== null)) {
                const submitBtn = document.getElementById('submit-btn');
                if (submitBtn) submitBtn.disabled = false;
            }
        });
        groupEl.appendChild(btn);
    });
}

function submitCannonAnswer() {
    const finalSubmitTime = performance.now(); 
    const brainPlanningTime = Math.round(publicState.cannonFirstClickTime - publicState.cannonEndTime); 
    const handExecutionTime = Math.round(finalSubmitTime - publicState.cannonFirstClickTime); 

    const isCorrect = publicState.cannonUserAnswers[0] === publicState.cannonActualCount[0] &&
                      publicState.cannonUserAnswers[1] === publicState.cannonActualCount[1] &&
                      publicState.cannonUserAnswers[2] === publicState.cannonActualCount[2];

    changeScreen('input-screen', 'result-screen');
    const pseudoPatientCode = "P_" + Math.random().toString(36).substr(2, 4).toUpperCase();
    
    const resultMeta = document.getElementById('result-meta');
    if (resultMeta && typeof i18n !== 'undefined') {
        resultMeta.innerText = i18n.get('cannon.meta_text', { code: pseudoPatientCode, mode: currentDifficulty.toUpperCase() });
    }

    const resultTitle = document.getElementById('result-title');
    const resultScore = document.getElementById('result-score');

    // 🌐 완벽한 다국어 팩 연동 제어
    if (isCorrect) {
        if (resultTitle) { 
            resultTitle.innerText = typeof i18n !== 'undefined' ? i18n.get('cannon.result_success') : "🎉 SUCCESS!"; 
            resultTitle.style.color = "#4caf50"; 
        }
        if (resultScore) {
            resultScore.innerText = typeof i18n !== 'undefined' ? i18n.get('cannon.desc_success') : "Perfect accuracy!";
        }
    } else {
        if (resultTitle) { 
            resultTitle.innerText = typeof i18n !== 'undefined' ? i18n.get('cannon.result_incorrect') : "❌ INCORRECT"; 
            resultTitle.style.color = "#f44336"; 
        }
        if (resultScore) {
            resultScore.innerText = typeof i18n !== 'undefined' ? 
                i18n.get('cannon.desc_incorrect', {
                    c1: publicState.cannonActualCount[0], c2: publicState.cannonActualCount[1], c3: publicState.cannonActualCount[2],
                    u1: publicState.cannonUserAnswers[0], u2: publicState.cannonUserAnswers[1], u3: publicState.cannonUserAnswers[2]
                }) : "Incorrect calculation.";
        }
    }

    let activeModeLabel = currentDifficulty === 'easy' ? "SILVER" : (currentDifficulty === 'hard' ? "GENIUS" : "NORMAL");
    if (typeof saveBrainGameRecord === 'function') {
        saveBrainGameRecord('cannon', activeModeLabel, isCorrect, brainPlanningTime);
    }

    let statsHtml = "";
    if (typeof getGameStatistics === 'function') {
        const stats = getGameStatistics('cannon', activeModeLabel);
        if (stats) {
            const bestLbl = typeof i18n !== 'undefined' ? i18n.get('cannon.stats_best') : "🥇 Best Speed: ";
            const avgLbl = typeof i18n !== 'undefined' ? i18n.get('cannon.stats_avg') : "⏱️ Recent Avg: ";
            statsHtml = `<hr style="border:0; border-top:1px dashed #333; margin:10px 0;">` +
                        `${bestLbl}<span style="color:#4caf50;">${stats.bestScore}ms</span><br>` +
                        `${avgLbl}<span style="color:#ff9800;">${stats.recentAverage}ms</span>`;
        }
    }

    const resultRt = document.getElementById('result-rt');
    if (resultRt) {
        const speedLbl = typeof i18n !== 'undefined' ? i18n.get('cannon.rt_speed') : "🧠 Brain Speed: ";
        const delayLbl = typeof i18n !== 'undefined' ? i18n.get('cannon.rt_delay') : "⏱️ Eye-Hand Delay: ";
        resultRt.innerHTML = `${speedLbl}<span style="color:#2196F3; font-weight:bold;">${brainPlanningTime}ms</span><br>` +
                             `${delayLbl}<span style="color:#ff9800; font-weight:bold;">${handExecutionTime}ms</span>` + statsHtml; 
    }

    // 🌐 클립보드 템플릿 변수 맵핑
    if (typeof i18n !== 'undefined') {
        publicState.shareText = i18n.get('cannon.share_template', {
            mode: currentDifficulty.toUpperCase(),
            status: isCorrect ? (i18n.getLang() === 'ko' ? "⭕ 검사 성공!" : "⭕ Success!") : (i18n.getLang() === 'ko' ? "❌ 판정 실패" : "❌ Incorrect"),
            brain: brainPlanningTime,
            hand: handExecutionTime
        });
    }
}

function copyToClipboard() {
    const successMsg = typeof i18n !== 'undefined' ? i18n.get('cannon.alert_copied') : "Copied successfully! 😉";
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(publicState.shareText).then(() => {
            alert(successMsg);
        }).catch(() => fallbackCopyToClipboard());
    } else { fallbackCopyToClipboard(); }
}

function fallbackCopyToClipboard() {
    const textArea = document.createElement("textarea");
    textArea.value = publicState.shareText;
    textArea.style.position = "fixed";  
    document.body.appendChild(textArea);
    textArea.focus(); textArea.select();
    const successMsg = typeof i18n !== 'undefined' ? i18n.get('cannon.alert_copied') : "Copied successfully! 😉";
    try {
        document.execCommand('copy');
        alert(successMsg);
    } catch (err) {
        alert("Copy failed.");
    }
    document.body.removeChild(textArea);
}

function resetGame() {
    const adNotice = document.getElementById('ad-notice-text');
    if (adNotice) adNotice.style.setProperty('display', 'block', 'important');

    setTimeout(() => {
        if (adNotice) adNotice.style.setProperty('display', 'none', 'important');
        setGamingStatus(false);
        
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.style.opacity = '1.0'; btn.style.cursor = 'pointer';
        });

        if (document.getElementById('submit-btn')) document.getElementById('submit-btn').disabled = true;
        if (document.getElementById('start-btn')) document.getElementById('start-btn').style.setProperty('display', 'inline-block', 'important');
        if (document.getElementById('lobby-intro-zone')) document.getElementById('lobby-intro-zone').style.setProperty('display', 'block', 'important');
        
        setDifficulty(currentDifficulty);
        changeScreen('result-screen', 'play-screen');
    }, 350); 
}

window.setDifficulty = setDifficulty;
window.submitCannonAnswer = submitCannonAnswer;
window.copyToClipboard = copyToClipboard;
window.resetGame = resetGame;

window.changeScreen = changeScreen;
window.updateStatusDisplay = updateStatusDisplay;
window.endCannonFiringPhase = endCannonFiringPhase;
window.generateMarkingButtons = endCannonFiringPhase; 
window.generateCannonSampleButtons = generateCannonSampleButtons;