let currentMode = 'easy';
let currentRound = 1;
const totalRounds = 8; // 8판 완주제 고정

const colors = ['pink', 'blue', 'mint'];
const colorNames = { pink: '핑크', blue: '블루', mint: '민트' };
const colorIcons = { pink: '🔴', blue: '🔵', mint: '🟢' };

let gridData = [];
let hardTypeQueue = []; // 매운맛용 8대 변칙 셔플 큐
let currentHardType = ''; 
let startTime = 0;
let totalElapsedTime = 0; // 초 단위 소요 시간
let blindTimeout = null;

function startGame(mode) {
  currentMode = mode;
  currentRound = 1;
  totalElapsedTime = 0;
  startTime = Date.now();
  
  if (currentMode === 'hard') {
    hardTypeQueue = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].sort(() => Math.random() - 0.5);
  }

  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  
  generateRound();
}

// ... [중략] generateRound(), buildInterface() 등 화면 UI 및 25칸 격자 그리기 로직은 기존과 동일 ...

function handleChoice(isCorrect) {
  // 오답일 경우 다음 판으로 안 넘어가고 딜레이 발생 (자연스럽게 planningMs가 늘어나는 패널티 구조)
  if (!isCorrect) return; 

  if (currentRound < totalRounds) {
    currentRound++;
    generateRound();
  } else {
    // 8판 완주 시 최종 밀리초(ms) 계산 (brain-db.js 저장 규격용)
    totalElapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    endGame();
  }
}

/**
 * 🎯 brain-db.js와 완벽하게 싱크를 맞춘 최종 게임 종료 로직
 */
function endGame() {
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
  document.getElementById('progress-bar').style.width = '100%';
  
  const evalText = document.getElementById('evaluation-text');
  const totalPlanningMs = Math.round(totalElapsedTime * 1000); // ms 단위 환산

  // 1. 난이도 코드를 brain-db.js 통계 필터링 규격과 일치화
  let dbDifficulty = 'NORMAL';
  if (currentMode === 'easy') dbDifficulty = 'EASY';
  if (currentMode === 'hard') dbDifficulty = 'GENIUS';

  // 2. 🧠 [공용 엔진 호출] brain-db.js의 저장 기능 연동!!
  // 파라미터: gameName('switching'), 난이도, 성공여부(true), 소요시간(ms)
  saveBrainGameRecord('switching', dbDifficulty, true, totalPlanningMs);

  // 3. 📊 [공용 엔진 호출] 방금 저장된 따끈따끈한 통합 주간 통계 및 그래프 HTML 가져오기
  const stats = getGameStatistics('switching', dbDifficulty);

  // 4. 자존감 가드형 안내 멘트와 하단에 brain-db.js가 그려준 주간 바 그래프 동적 결합
  let reportHtml = "";
  
  if (currentMode === 'easy') {
    reportHtml = `✨ <b>8단계 두뇌 스트레칭 완주 성공!</b><br>시간에 쫓기지 않고 시각 신경을 아주 정확하고 청정하게 활성화하셨습니다.`;
  } else if (currentMode === 'normal') {
    reportHtml = `🏃 <b>파워 워킹 코스 마스터!</b><br>일상적인 인지 렉(Lag) 현상을 훌륭하게 제어하며 안정적인 연산 밸런스를 증명하셨습니다.`;
  } else {
    reportHtml = `🏎️ <b>지옥의 8대 변칙 헬모드 브레이커!</b><br>현재 판 소요 시간: <span style="color:#ff6b6b; font-weight:bold;">${totalElapsedTime}초</span><br>상위 0.1% 괴물 뇌지컬 확정!`;
  }

  // 5. 공용 엔진 통계 데이터가 정상 산출되었다면 UI 하단에 이식
  if (stats) {
    reportHtml += `
      <hr style="border:0; height:1px; background:#444; margin:20px 0;">
      <div style="text-align:left; font-size:13px; color:#aaa; width:100%;">
        <p>📊 총 도전 횟수: <span style="color:#fff;">${stats.totalPlayCount}회</span></p>
        <p>🏆 개인 최고 기록: <span style="color:#00C853;">${stats.bestScore}</span></p>
        <p>⚡ 최근 5회 평균: <span style="color:#ffd93d;">${stats.recentAverage}</span></p>
      </div>
      <p style="text-align:left; font-size:12px; color:#fff; margin-top:15px; width:100%;">📅 4주간 두뇌 피지컬 추이 (클리어 속도)</p>
      ${stats.monthlyReport}
    `;
  }

  evalText.innerHTML = reportHtml;
}

function restartGame() {
  document.getElementById('result-screen').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
}