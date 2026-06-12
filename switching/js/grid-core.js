function startGame(mode) {
    window.gridState.currentMode = mode;
    window.gridState.currentRound = 1;
    window.gridState.totalElapsedTime = 0;
    window.gridState.penaltyTimeMs = 0;
    window.gridState.isProcessing = false;
    window.gridState.startTime = Date.now();
    
    if (window.gridState.currentMode === 'hard') {
        window.gridState.hardTypeQueue = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].sort(() => Math.random() - 0.5);
    }

    // UI 제어 함수 트리거 (UI 파일에 정의됨)
    if (typeof window.transitionToGameScreen === 'function') {
        window.transitionToGameScreen();
    }
    
    generateGridRound();
}


function generateGridRound() {
    if (window.gridState.blindTimeout) clearTimeout(window.gridState.blindTimeout);
    window.gridState.isProcessing = false; 
    
    if (typeof window.updateRoundProgressUI === 'function') {
        window.updateRoundProgressUI();
    }

    const isHard = (window.gridState.currentMode === 'hard');
    const cellCount = isHard ? 25 : 9;

    if (isHard) {
        window.gridState.currentHardType = window.gridState.hardTypeQueue[window.gridState.currentRound - 1];
    }

    let activeColors = [...window.GRID_COLORS];
    if (isHard && window.gridState.currentHardType === 'F') {
        const blindColor = window.GRID_COLORS[Math.floor(Math.random() * window.GRID_COLORS.length)];
        activeColors = window.GRID_COLORS.filter(c => c !== blindColor);
    }

    window.gridState.gridData = [];
    for (let i = 0; i < cellCount; i++) {
        const bgColor = activeColors[Math.floor(Math.random() * activeColors.length)];
        window.gridState.gridData.push({ bg: bgColor });
    }

    if (typeof window.renderGridBoard === 'function') {
        window.renderGridBoard(cellCount, isHard);
    }
}


function handleGridChoice(isCorrect) {
    if (window.gridState.isProcessing) return; 
    window.gridState.isProcessing = true;

    if (!isCorrect) {
        if (window.gridState.currentMode === 'hard') {
            window.gridState.penaltyTimeMs += 500; 
            if (typeof window.renderPenaltyUI === 'function') {
                window.renderPenaltyUI();
            }
            setTimeout(() => {
                window.gridState.isProcessing = false;
                generateGridRound(); 
            }, 600);
        } else {
            window.gridState.isProcessing = false; 
        }
        return;
    }

    window.gridState.isProcessing = false; 

    if (window.gridState.currentRound < window.gridState.totalRounds) {
        window.gridState.currentRound++;
        generateGridRound();
    } else {
        const endTime = Date.now();
        const pureElapsedTimeMs = endTime - window.gridState.startTime; 

        if (window.gridState.currentMode === 'hard') {
            const totalMs = pureElapsedTimeMs + window.gridState.penaltyTimeMs;
            window.gridState.totalElapsedTime = `${totalMs.toLocaleString()}ms`; 
        } else {
            window.gridState.totalElapsedTime = `${(pureElapsedTimeMs / 1000).toFixed(2)}${window.gridLocale === 'ko' ? '초' : 's'}`;
        }
        
        if (typeof window.endGridGame === 'function') {
            window.endGridGame();
        }
    }
}

window.startGame = startGame;
window.generateGridRound = generateGridRound;
window.handleGridChoice = handleGridChoice;