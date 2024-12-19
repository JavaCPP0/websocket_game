class Item {
    // 아이템 초기화
    constructor(ctx, id, x, y, width, height, image, score, isBomb) {
        this.ctx = ctx;         // 캔버스 컨텍스트
        this.id = id;           // 아이템 고유 ID
        this.x = x;             // x 좌표
        this.y = y;             // y 좌표
        this.width = width;     // 너비
        this.height = height;   // 높이
        this.image = image;     // 아이템 이미지
        this.score = score;     // 아이템 점수
        this.isBomb = isBomb;   // 아이템 폭탄 여부
    }

    // 아이템 위치 업데이트
    update(speed, gameSpeed, deltaTime, scaleRatio) {
        // 게임 속도와 화면 비율에 따라 왼쪽으로 이동
        this.x -= speed * gameSpeed * deltaTime * scaleRatio;
    }

    // 아이템 그리기
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // 충돌 감지 및 처리
    collideWith = (sprite) => {
        const adjustBy = 1.4;  // 충돌 박스 크기 조정 값

        // 충돌 박스 계산 (히트박스를 실제 크기보다 작게 설정)
        const result = (
            this.x < sprite.x + sprite.width / adjustBy &&      // 오른쪽 충돌
            this.x + this.width / adjustBy > sprite.x &&        // 왼쪽 충돌
            this.y < sprite.y + sprite.height / adjustBy &&     // 아래쪽 충돌
            this.y + this.height / adjustBy > sprite.y          // 위쪽 충돌
        );

        // 충돌 시 아이템 제거 (크기를 0으로 설정)
        if (result) {
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
        }

        return result;  // 충돌 여부 반환
    }
}

export default Item