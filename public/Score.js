import { sendEvent } from './Socket0.js';
import ItemController from './ItemController.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStage = 1000;
  nextStageScore = 100;
  scoreMultiplier = 1;
  globalHighScore = 0;
  highScoreUpdated = false;

  constructor(ctx, scaleRatio, itemController, socket) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.itemController = itemController;
    this.socket = socket;

    this.initializeHighScore();
    this.setupSocketListeners(socket);
  }

  initializeHighScore() {
    // 최초 접속 시 전역 최고 점수 요청 (handlerId: 13)
    console.log('Requesting initial high score...');
    sendEvent(13, {});
  }

  setupSocketListeners(socket) {
    // 일반 응답 처리
    socket.on('response', (response) => {
      console.log('Received response:', response);
      // response.data가 있고 score 필드가 있는 경우에만 처리
      if (response.data && response.data.score !== undefined) {
        console.log('Updating high score from response:', response.data.score);
        this.globalHighScore = response.data.score;
        this.highScoreUpdated = true;
        this.draw();
      }
    });

    // 브로드캐스트된 글로벌 하이스코어 업데이트 수신
    socket.on('globalHighScore', (data) => {
      console.log('Received broadcast high score:', data);
      if (data && data.score !== undefined) {
        console.log('Updating high score from broadcast:', data.score);
        this.globalHighScore = data.score;
        this.highScoreUpdated = true;
        this.draw();
      }
    });
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * this.scoreMultiplier;
    
    // 스테이지 변경 체크
    if (Math.floor(this.score) >= this.nextStageScore && this.stageChange) {
      this.stageChange = false;
      this.currentStage++;
      this.nextStageScore *= 2;
      this.scoreMultiplier += 0.5;
      this.itemController.updateStage(this.currentStage);
      
      // 스테이지 변경 이벤트 전송
      sendEvent(11, {
        currentStage: this.currentStage - 1,
        targetStage: this.currentStage,
      });
    }

    // 현재 점수가 최고 점수를 넘었는지 주기적으로 체크
    this.checkHighScore();
    
    // 매 프레임마다 점수 표시 업데이트
    this.draw();
  }

  checkHighScore() {
    const currentScore = Math.floor(this.score);
    if (currentScore > this.globalHighScore) {
      this.setHighScore();
    }
  }

  setHighScore() {
    const currentScore = Math.floor(this.score);
    
    // 서버에 새로운 점수 전송 (handlerId: 12)
    console.log('Sending score to server:', currentScore);
    sendEvent(12, { score: currentScore });
  }

  getItem(itemId) {
    const collidedItem = this.itemController.items.find((item) => item.id === itemId);
    if (collidedItem) {
      const newScore = Math.max(0, this.score + collidedItem.score);
      this.score = newScore;
      
      // 아이템 획득으로 인한 점수 변화 후 최고 점수 체크
      //this.checkHighScore();
    }
  }

  reset() {
    this.score = 0;
    this.currentStage = 1000;
    this.nextStageScore = 100;
    this.scoreMultiplier = 1;
    this.stageChange = true;
  }

  getScore() {
    return Math.floor(this.score);
  }

  draw() {
    const y = 20 * this.scaleRatio;
    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, '0');
    const highScorePadded = this.globalHighScore.toString().padStart(6, '0');

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    if (this.highScoreUpdated) {
      this.highScoreUpdated = false;
    }
  }
}

export default Score;
