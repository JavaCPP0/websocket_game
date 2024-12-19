// 게임의 지형(바닥) 관리 클래스
class Ground {
    constructor(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;              // 이동 속도
        this.scaleRatio = scaleRatio;    // 화면 크기 비율

        // 초기 위치 설정
        this.x = 0;
        this.y = this.canvas.height - this.height;

        // 이미지 로드
        this.groundImage = new Image();
        this.groundImage.src = "images/ground.png";
    }

    // 지형 위치 업데이트
    update(gameSpeed, deltaTime) {
        // 왼쪽으로 이동
        this.x -= gameSpeed * deltaTime * this.speed * this.scaleRatio;

        // 화면 밖으로 나가면 위치 리셋
        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    // 지형 렌더링
    draw() {
        // 연속적인 지형 표현을 위해 2개의 이미지 연결
        this.ctx.drawImage(
            this.groundImage,
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.ctx.drawImage(
            this.groundImage,
            this.x + this.width,  // 첫 번째 이미지 바로 뒤에 위치
            this.y,
            this.width,
            this.height
        );
    }

    reset() {
        this.x = 0;
    }
}

export default Ground;