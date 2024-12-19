import Cactus from "./Cactus.js";

// 장애물(선인장) 관리 클래스
class CactiController {

    // 선인장 생성 간격 설정
    CACTUS_INTERVAL_MIN = 500;      // 최소 생성 간격 (ms)
    CACTUS_INTERVAL_MAX = 2000;     // 최대 생성 간격 (ms)

    nextCactusInterval = null;
    cacti = [];


    constructor(ctx, cactiImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.cactiImages = cactiImages;     // 선인장 이미지 배열
        this.scaleRatio = scaleRatio;       // 화면 크기 비율
        this.speed = speed;                 // 이동 속도

        this.setNextCactusTime();           // 다음 선인장 생성 시간 설정
    }

    // 랜덤한 시간 간격으로 다음 선인장 생성 시간 설정
    setNextCactusTime() {
        this.nextCactusInterval = this.getRandomNumber(
            this.CACTUS_INTERVAL_MIN,
            this.CACTUS_INTERVAL_MAX
        );
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // 새로운 선인장 생성
    createCactus() {
        const index = this.getRandomNumber(0, this.cactiImages.length - 1);
        const cactusImage = this.cactiImages[index];
        // 화면 오른쪽 끝에서 생성
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - cactusImage.height;

        const cactus = new Cactus(
            this.ctx,
            x,
            y,
            cactusImage.width,
            cactusImage.height,
            cactusImage.image
        );

        this.cacti.push(cactus);
    }


    // 선인장 상태 업데이트
    update(gameSpeed, deltaTime) {
        // 새로운 선인장 생성 시간이 되었는지 체크
        if(this.nextCactusInterval <= 0) {
            this.createCactus();
            this.setNextCactusTime();
        }

        this.nextCactusInterval -= deltaTime;

        // 모든 선인장 위치 업데이트
        this.cacti.forEach((cactus) => {
            cactus.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        });

        // 화면 밖으로 나간 선인장 제거
        this.cacti = this.cacti.filter(cactus => cactus.x > -cactus.width);
    }

    draw() {
        this.cacti.forEach((cactus) => cactus.draw());
    }

    collideWith(sprite) {
        //console.log('collideWith called with sprite:', this.cacti.some(cactus => cactus.collideWith(sprite)));
        return this.cacti.some(cactus => cactus.collideWith(sprite));
    }

    reset() {
        this.cacti = [];
    }
}

export default CactiController;