import Player from './Player.js';
import Ground from './Ground.js';
import CactiController from './CactiController.js';
import Score from './Score.js';
import ItemController from './ItemController.js';
import { sendEvent,socket } from './Socket0.js';


const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;

// 게임 크기
const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;

// 플레이어
// 800 * 200 사이즈의 캔버스에서는 이미지의 기본크기가 크기때문에 1.5로 나눈 값을 사용. (비율 유지)
const PLAYER_WIDTH = 88 / 1.5; // 58
const PLAYER_HEIGHT = 94 / 1.5; // 62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;

// 땅
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_SPEED = 0.5;

// 선인장
const CACTI_CONFIG = [
  { width: 48 / 1.5, height: 100 / 1.5, image: 'images/cactus_1.png' },
  { width: 98 / 1.5, height: 100 / 1.5, image: 'images/cactus_2.png' },
  { width: 68 / 1.5, height: 70 / 1.5, image: 'images/cactus_3.png' },
];

// item.json과 item_unlock.json 데이터를 먼저 로드
let itemData = null;
let itemUnlockData = null;

async function loadItemData() {
  try {
    const itemResponse = await fetch('/assets/item.json');
    const itemUnlockResponse = await fetch('/assets/item_unlock.json');
    
    itemData = await itemResponse.json();
    itemUnlockData = await itemUnlockResponse.json();
  } catch (error) {
    console.error('아이템 데이터 로딩 실패:', error);
    // 에러 발생시 기본값 설정
    itemData = { data: [] };
    itemUnlockData = { data: [] };
  }
}

// ITEM_CONFIG를 item.json 기반으로 수정
const ITEM_CONFIG = [
  { width: 50 / 1.5, height: 50 / 1.5, id: 1, image: 'images/items/pokeball_red.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 2, image: 'images/items/pokeball_yellow.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 3, image: 'images/items/pokeball_purple.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 4, image: 'images/items/pokeball_cyan.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 5, image: 'images/items/pokeball_pink.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 6, image: 'images/items/pokeball_orange.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 7, image: 'images/items/bomb.png' },
];

// 게임 요소들
let player = null;
let ground = null;
let cactiController = null;
let itemController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameover = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

async function createSprites() {
  // 아이템 데이터 로드가 안되어있으면 로드
  if (!itemData || !itemUnlockData) {
    await loadItemData();
  }
  // 비율에 맞는 크기
  // 유저
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  // 땅
  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  // 아이템 이미지 설정
  const itemImages = ITEM_CONFIG.map((item) => {
    const image = new Image();
    image.src = item.image;
    const itemInfo = itemData.data.find(i => i.id === item.id);
    return {
      image,
      id: item.id,
      width: item.width * scaleRatio,
      height: item.height * scaleRatio,
      isBomb: itemInfo ? itemInfo.isBomb : false,
      score: itemInfo ? itemInfo.score : 0
    };
  });

  // 순서 중요: ItemController를 먼저 생성
  itemController = new ItemController(
    ctx, 
    itemImages, 
    scaleRatio, 
    GROUND_SPEED,
    itemUnlockData.data
  );

  // Score는 ItemController 다음에 생성
  score = new Score(ctx, scaleRatio, itemController, socket);

  // 나머지 객체들 생성
  ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_SPEED, scaleRatio);
  
  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio
  );

  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(ctx, cactiImages, scaleRatio, GROUND_SPEED);
}

function getScaleRatio() {
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
  const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);

  // window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

// setScreen() 함수를 async로 변경
async function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  await createSprites();
}

// 게임 시작 시 비동기로 실행
async function startGame() {
  await setScreen();  // createSprites() 호출 포함
  
  window.addEventListener('resize', setScreen);

  if (screen.orientation) {
    screen.orientation.addEventListener('change', setScreen);
  }

  // 게임 오브젝트들이 모두 생성된 후에 이벤트 리스너 추가
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && waitingToStart) {
      reset();
    }
  });

  // 모바일을 위한 터치 이벤트도 추가
  window.addEventListener('touchstart', () => {
    if (waitingToStart) {
      reset();
    }
  });
  
  requestAnimationFrame(gameLoop);
}

startGame();

function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText('GAME OVER', x, y);
}

function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText('Tap Screen or Press Space To Start', x, y);
}

function updateGameSpeed(deltaTime) {
  gameSpeed += deltaTime * GAME_SPEED_INCREMENT;
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameover = false;
  waitingToStart = false;

  ground.reset();
  cactiController.reset();
  itemController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
  
  // 게임시작 핸들러ID 2, payload 에는 게임 시작 시간
  sendEvent(2, { timestamp: Date.now() });
}

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener('keyup', reset, { once: true });
    }, 1000);
  }
}

function clearScreen() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  // 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
  // 프레임 렌더링 속도
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  if (!gameover && !waitingToStart) {
    // update
    // 땅이 움직임
    ground.update(gameSpeed, deltaTime);
    // 선인장
    cactiController.update(gameSpeed, deltaTime);
    itemController.update(gameSpeed, deltaTime);
    // 달리기
    player.update(gameSpeed, deltaTime);
    updateGameSpeed(deltaTime);

    score.update(deltaTime);
  }

  if (!gameover && cactiController.collideWith(player)) {
    gameover = true;
    score.setHighScore();
    setupGameReset();
    
    // 게임 종료 이벤트 전송 (handlerId: 3)
    sendEvent(3, {
        timestamp: Date.now(),
        score: score.getScore()
    });
  }
  const collideWithItem = itemController.collideWith(player);
  if (collideWithItem && collideWithItem.itemId) {
    score.getItem(collideWithItem.itemId);
  }

  // draw
  player.draw();
  cactiController.draw();
  ground.draw();
  score.draw();
  itemController.draw();

  if (gameover) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  // 재귀 호출 (무한반복)
  requestAnimationFrame(gameLoop);
}

// 게임 프레임을 다시 그리는 메서드
requestAnimationFrame(gameLoop);
