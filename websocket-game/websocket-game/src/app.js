// 메인 서버 애플리케이션
import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);    // HTTP 서버 생성 (WebSocket 지원용)
const PORT = 3000;

// 미들웨어 설정
app.use('/assets', express.static('assets'));
app.use(express.static('public'));   // 정적 파일 서비스
app.use(express.json());            // JSON 파싱
app.use(express.urlencoded({ extended: false }));

let numUsers = 0;

initSocket(server);

// 기본 라우트
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 서버 시작
server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // 게임 에셋 로드
    try {
        const assets = await loadGameAssets();
        console.log('Assets loaded successfully');
    } catch (e) {
        console.error('Failed to load game assets:', e);
    }
});