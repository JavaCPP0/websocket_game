import Redis from 'ioredis';

// Redis 클라이언트 생성
const redis = new Redis({
    host: 'localhost',
    port: 6379
});

// Redis 키 설정
const GLOBAL_HIGH_SCORE_KEY = 'global:highscore';
const USER_HIGH_SCORE_PREFIX = 'user:highscore:';

// 사용자별 최고 점수를 저장할 객체 (메모리 캐시용)
const userHighScores = new Map();

const handleHighScore = async (userId, payload) => {
    try {
        const { score } = payload;
        
        // 현재 전역 최고 점수 조회
        let globalHighScore = parseInt(await redis.get(GLOBAL_HIGH_SCORE_KEY)) || 0;

        // 새로운 점수가 전체 최고 점수보다 높은 경우 업데이트
        if (score > globalHighScore) {
            console.log(`New high score achieved:`, {
                userId,
                newScore: score,
                previousScore: globalHighScore
            });

            // Redis 업데이트
            await Promise.all([
                redis.set(GLOBAL_HIGH_SCORE_KEY, score),
                redis.set(`${USER_HIGH_SCORE_PREFIX}${userId}`, score)
            ]);
            
            // 브로드캐스트를 위한 응답 설정
            return {
                status: 'success',
                broadcast: true,  // 브로드캐스트 필요
                event: 'globalHighScore',  // 브로드캐스트 이벤트 이름
                data: { 
                    score: score,
                    achievedBy: userId
                }
            };
        }

        // 사용자의 개인 최고 점수 업데이트
        const userBestScore = parseInt(await redis.get(`${USER_HIGH_SCORE_PREFIX}${userId}`)) || 0;
        if (score > userBestScore) {
            await redis.set(`${USER_HIGH_SCORE_PREFIX}${userId}`, score);
            userHighScores.set(userId, score);
        }

        return {
            status: 'success',
            data: { 
                score: globalHighScore 
            }
        };

    } catch (error) {
        console.error('Error handling high score:', error);
        return {
            status: 'error',
            message: 'Failed to update high score'
        };
    }
};

// 최초 접속 시 현재 최고 점수를 조회하는 함수
const getGlobalHighScore = async () => {
    try {
        const globalHighScore = parseInt(await redis.get(GLOBAL_HIGH_SCORE_KEY)) || 0;
        
        return {
            status: 'success',
            event: 'globalHighScore',
            data: {
                score: globalHighScore
            }
        };
    } catch (error) {
        console.error('Error getting global high score:', error);
        return {
            status: 'error',
            message: 'Failed to get global high score'
        };
    }
};

// Redis 연결 에러 처리
redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export { handleHighScore, getGlobalHighScore };