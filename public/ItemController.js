import Item from './Item.js';

// 게임 내 아이템 관리 클래스
class ItemController {
  // 아이템 생성 간격 설정
  INTERVAL_MIN = 5000; // 최소 생성 간격 (ms)
  INTERVAL_MAX = 6000; // 최대 생성 간격 (ms)

  nextInterval = null;
  items = [];
  itemCollectionTimes = []; // 아이템 획득 시간을 기록할 배열
  ABUSE_TIME_WINDOW = 9000; // 어뷰징 검사 시간 윈도우 (12.5초)
  ABUSE_ITEM_THRESHOLD = 2; // 시간 윈도우 내 허용되는 최대 아이템 수
  currentStage = 1000; // 현재 스테이지 정보 추가
  itemUnlockData = []; // itemUnlockData 저장

  constructor(ctx, itemImages, scaleRatio, speed, itemUnlockData) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages; // 아이템 이미지 배열
    this.scaleRatio = scaleRatio; // 화면 크기 비율
    this.speed = speed; // 이동 속도
    this.itemUnlockData = itemUnlockData; // itemUnlockData 저장

    this.setNextItemTime(); // 다음 아이템 생성 시간 설정
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // 새로운 아이템 생성
  // ItemController.js의 createItem 메서드 수정
  createItem() {
    // 현재 스테이지에서 사용 가능한 아이템만 필터링
    const availableItems = this.itemImages.filter((itemImage) => {
        // 폭탄 아이템은 항상 사용 가능
        if (itemImage.isBomb) return true;

        // item_unlock.json의 데이터를 확인하여 현재 스테이지에서 사용 가능한 아이템인지 확인
        return this.itemUnlockData.some(
            (unlockData) =>
                unlockData.item_id === itemImage.id && 
                unlockData.stage_id <= this.currentStage
        );
    });

    console.log('Current Stage:', this.currentStage);
    console.log('Available Items:', availableItems);
    console.log('Item Unlock Data:', this.itemUnlockData);

    if (availableItems.length === 0) return;

    // 일반 아이템과 폭탄 아이템 분리
    const normalItems = availableItems.filter((item) => !item.isBomb);
    const bombItems = availableItems.filter((item) => item.isBomb);

    // 70%는 일반 아이템, 30%는 폭탄이 나오도록 설정
    let selectedItem;
    if (Math.random() < 0.7 && normalItems.length > 0) {
        const index = this.getRandomNumber(0, normalItems.length - 1);
        selectedItem = normalItems[index];
    } else if (bombItems.length > 0) {
        const index = this.getRandomNumber(0, bombItems.length - 1);
        selectedItem = bombItems[index];
    } else {
        return;
    }

    // 화면 오른쪽에서 랜덤한 높이에 생성
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - selectedItem.height);

    const item = new Item(
        this.ctx,
        selectedItem.id,
        x,
        y,
        selectedItem.width,
        selectedItem.height,
        selectedItem.image,
        selectedItem.score,
        selectedItem.isBomb
    );

    this.items.push(item);
}

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  // 충돌 감지 및 아이템 효과 처리
  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      // 아이템 획득 시간 기록
      this.itemCollectionTimes.push(Date.now());

      // 어뷰징 검사
      if (this.isAbusing()) {
        console.log('Abusing detected!');
        // 여기에 어뷰징 처리 로직 추가
        return { isAbusing: true };
      }

      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
        isAbusing: false,
      };
    }
  }

  reset() {
    this.items = [];
    this.itemCollectionTimes = []; // 리셋 시 획득 시간 기록도 초기화
  }

  // 어뷰징 검사 메서드
  isAbusing() {
    const currentTime = Date.now();
    // 10초가 지난 기록은 제거
    this.itemCollectionTimes = this.itemCollectionTimes.filter(
      (time) => currentTime - time < this.ABUSE_TIME_WINDOW,
    );

    // 현재 시간 윈도우 내의 아이템 획득 횟수가 임계값을 초과하면 어뷰징으로 판단
    return this.itemCollectionTimes.length > this.ABUSE_ITEM_THRESHOLD;
  }

  // 스테이지 정보를 업데이트하는 메서드 추가
  updateStage(stage) {
    this.currentStage = stage;
  }
}

export default ItemController;
