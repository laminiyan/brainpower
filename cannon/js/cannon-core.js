// ==========================================================================
// 🚀 cannon-core.js - 다국어(i18n) 실시간 싱크 및 코어 게임 루프 엔진
// ==========================================================================

// 🔊 웹 오디오 API 컨텍스트 관리
let audioCtx = null;

/**
 * 🔊 대포 발사 사운드 이펙트 생성 (난이도별 피치 차등 적용)
 */
function playCannonSound() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sine'; 
        
        // 난이도가 어려움일 때 조금 더 긴박한 고음 주파수 생성
        const startFreq = currentDifficulty === 'hard' ? 520 : 440;
        const currentAudioTime = audioCtx.currentTime; 
        
        osc.frequency.setValueAtTime(startFreq, currentAudioTime);
        osc.frequency.exponentialRampToValueAtTime(180, currentAudioTime + 0.14);

        gainNode.gain.setValueAtTime(0.16, currentAudioTime);
        gainNode.gain.linearRampToValueAtTime(0.001, currentAudioTime + 0.14);

        osc.start();
        osc.stop(currentAudioTime + 0.14);
    } catch (e) {
        console.log("오디오 엔진 접근 제한 또는 미지원 브라우저");
    }
}

/**
 * 🚀 대포 멀티태스킹 게임 세션 시작 마스터 함수
 */
function startCannonGame() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const config = DIFFICULTY_CONFIG[currentDifficulty];
    setGamingStatus(true);

    // 1. 난이도 조절 버튼 비활성화 스타일 제어
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.style.opacity = '0.35';
        btn.style.cursor = 'not-allowed';
    });

    if (document.getElementById('start-btn')) document.getElementById('start-btn').style.setProperty('display', 'none', 'important');
    if (document.getElementById('lobby-intro-zone')) document.getElementById('lobby-intro-zone').style.setProperty('display', 'none', 'important');
    
    if (publicState.countdownTimerId) {
        clearInterval(publicState.countdownTimerId);
        publicState.countdownTimerId = null;
    }

    // 2. 실시간 데이터 영역 완전 초기화
    publicState.cannonActualCount = [0, 0, 0]; 
    publicState.cannonUserAnswers = [null, null, null];
    publicState.cannonTimestamps = [];
    publicState.isCannonFirstClickRecorded = false;
    
    // 난이도별 활성화 대포 개수에 따른 투명도 제어
    for (let i = 0; i < 3; i++) {
        const zone = document.getElementById(`ball-zone-${i}`);
        if (zone) zone.innerHTML = '';
        const cannonEl = document.getElementById(`cannon-${i}`);
        if (cannonEl) cannonEl.style.opacity = i >= config.activeCannons ? '0.15' : '1.0';
    }

    // ⚙️ [가변 발사수 계산 및 Fisher-Yates 셔플 알고리즘]
    let pool = [];
    const actualTotalBalls = Math.floor(Math.random() * (config.totalBallsMax - config.totalBallsMin + 1)) + config.totalBallsMin;
    
    // 각 활성화된 대포마다 최소 발사 수량 보장 주입
    for (let c = 0; c < config.activeCannons; c++) {
        for (let j = 0; j < config.minPerCannon; j++) pool.push(c);
    }
    
    // 남은 랜덤 수량을 활성화 대포 풀에 고르게 분배
    let remaining = actualTotalBalls - pool.length;
    for (let i = 0; i < remaining; i++) {
        pool.push(Math.floor(Math.random() * config.activeCannons));
    }
    
    // 난수 패턴 셔플 무작위성 확보
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // 골든 타임 타임라인 스케줄링 맵핑
    let currentSeconds = 0.4; 
    pool.forEach(cannonId => {
        let randomInterval = config.intervalMin + Math.random() * config.intervalRange; 
        currentSeconds += randomInterval;
        if (currentSeconds < (config.playTime / 1000 - 1.2)) {
            publicState.cannonTimestamps.push({ time: currentSeconds * 1000, cannonId: cannonId });
        }
    });

    // 계산된 스케줄 타임스탬프에 맞춰 대포 발사 트리거 가동
    publicState.cannonTimestamps.forEach(event => {
        setTimeout(() => { triggerCannonFire(event.cannonId); }, event.time);
    });

    // ⏱️ 실시간 카운트다운 타이머 구동
    let secondsLeft = config.playTime / 1000;
    
    // 초기 텍스트 렌더링 동기화 호출
    if (typeof window.updateStatusDisplay === 'function') {
        window.updateStatusDisplay(secondsLeft);
    }
    
    publicState.countdownTimerId = setInterval(() => {
        secondsLeft--;
        if (secondsLeft <= 0) {
            clearInterval(publicState.countdownTimerId);
            publicState.countdownTimerId = null;
            
            if (typeof window.endCannonFiringPhase === 'function') {
                window.endCannonFiringPhase();
            }
        } else {
            if (typeof window.updateStatusDisplay === 'function') {
                window.updateStatusDisplay(secondsLeft);
            }
        }
    }, 1000);
}

/**
 * 💥 단일 대포 오브젝트 실제 발사 및 CSS 애니메이션 연산 트리거
 */
function triggerCannonFire(cannonId) {
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    publicState.cannonActualCount[cannonId]++; // 실제 정답 카운터 가산
    
    const cannonEl = document.getElementById(`cannon-${cannonId}`);
    const localBallZone = document.getElementById(`ball-zone-${cannonId}`);
    const barrierLine = document.querySelector('.barrier-line');

    // 대포 반동 이펙트 클래스 토글
    if (cannonEl) cannonEl.classList.add('recoil');
    setTimeout(() => { if (cannonEl) cannonEl.classList.remove('recoil'); }, 100);
    
    // 화면 흔들림 연산 제어
    document.body.classList.add('shake-screen');
    setTimeout(() => document.body.classList.remove('shake-screen'), 150);

    playCannonSound();
    if (navigator.vibrate) navigator.vibrate(currentDifficulty === 'hard' ? 10 : 15); 

    // 동적 포탄(●) 돔 생성
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.innerText = '●';
    
    let speed = 0.4; 
    if (barrierLine && localBallZone) {
        const barrierRect = barrierLine.getBoundingClientRect();
        const zoneRect = localBallZone.getBoundingClientRect();
        const travelDistance = zoneRect.bottom - barrierRect.bottom - 4; 
        ball.style.setProperty('--travel-dist', `-${travelDistance}px`);
        
        // 속도 계수를 활용한 해상도별 등속 연산 스윗스팟 제어
        speed = travelDistance * config.speedCoef;
        if (speed < config.minSpeed) speed = config.minSpeed;  
        if (speed > config.maxSpeed) speed = config.maxSpeed;  
    } else {
        ball.style.setProperty('--travel-dist', '-300px');
    }
    
    ball.style.animationDuration = `${speed}s`;
    if (localBallZone) {
        localBallZone.appendChild(ball); 
        setTimeout(() => { 
            createBurstImpact(cannonId); 
            ball.remove(); // 상단 경계선 충돌 후 메모리 해제
        }, speed * 1000); 
    }
}

/**
 * ✨ 상단 최선 인지 장벽(Critical Barrier) 충돌 파티클 이펙트 생성
 */
function createBurstImpact(cannonId) {
    const gameContainer = document.getElementById('game-container');
    const barrierLine = document.querySelector('.barrier-line');
    const localBallZone = document.getElementById(`ball-zone-${cannonId}`);
    if (!gameContainer || !barrierLine || !localBallZone) return;

    const containerRect = gameContainer.getBoundingClientRect();
    const barrierRect = barrierLine.getBoundingClientRect();
    const zoneRect = localBallZone.getBoundingClientRect();

    const burst = document.createElement('div');
    burst.className = 'burst-effect';
    
    const absoluteTop = barrierRect.bottom - containerRect.top;
    const absoluteLeft = (zoneRect.left + zoneRect.width / 2) - containerRect.left;
    burst.style.top = `${absoluteTop}px`;
    burst.style.left = `${absoluteLeft}px`;
    
    const particles = ['💥', '🔥', '✨', '⚡'];
    const pCount = currentDifficulty === 'easy' ? 4 : 6; 

    for (let i = 0; i < pCount; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.innerText = particles[Math.floor(Math.random() * particles.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 25; 
        p.style.setProperty('--mx', `${Math.cos(angle) * radius}px`);
        p.style.setProperty('--my', `${Math.sin(angle) * radius}px`);
        burst.appendChild(p);
    }
    gameContainer.appendChild(burst); 
    setTimeout(() => { burst.remove(); }, 300); 
}

// ==========================================================================
// 🌐 [다국어 상태 동기화 및 글로벌 인터페이스 브릿지 시스템]
// ==========================================================================

/**
 * ⏱️ 1. 게임 진행 중 실시간 남은 시간 타이머 다국어 동기화 인터페이스
 */
window.updateStatusDisplay = function(secondsLeft) {
    const statusEl = document.getElementById('status-text');
    if (!statusEl) return;

    // 전역 i18n 패키지가 정의되어 있다면 로컬스토리지 언어 설정 포맷에 최적화 매핑 ({time} 가변 변수 치환)
    if (typeof i18n !== 'undefined' && typeof i18n.get === 'function') {
        statusEl.innerText = i18n.get('cannon.status_time_left', { time: secondsLeft });
    } else {
        // 백업용 폴백 디스플레이
        statusEl.innerText = `⏱️ Time Left: ${secondsLeft}s`;
    }
};

/**
 * 📝 2. 카운트다운 종료 후 수량 마킹 입력 단계 전환 브릿지 인터페이스
 */
window.endCannonFiringPhase = function() {
    setGamingStatus(false); 

    if (publicState.countdownTimerId) {
        clearInterval(publicState.countdownTimerId);
        publicState.countdownTimerId = null;
    }

    const playScreen = document.getElementById('play-screen');
    const inputScreen = document.getElementById('input-screen');
    
    if (playScreen) playScreen.style.display = 'none';
    if (inputScreen) {
        inputScreen.style.display = 'flex';
        inputScreen.style.flexDirection = 'column';
    }

    // 🌟 [언어팩 싱크] 수량 입력 마킹 단계로 넘어오는 즉시 UI 텍스트 지정된 언어로 강제 초기화
    if (typeof i18n !== 'undefined' && typeof i18n.updateUITranslations === 'function') {
        i18n.updateUITranslations();
    }

    // UI 인풋 제어용 버튼 스케줄러 동적 생성 트리거 가동
    if (typeof window.generateMarkingButtons === 'function') {
        window.generateMarkingButtons();
    }
};

// 💡 글로벌 전역 스코프 함수 바인딩 배포
window.startCannonGame = startCannonGame;