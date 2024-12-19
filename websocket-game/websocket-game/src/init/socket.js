import {Server as SocketIO} from 'socket.io';//socket.io 라이브러리에서 Server 클래스를 가져오며, 이 클래스는 서버 측 WebSocket 통신을 관리합니다.
import registerHandler from '../handlers/register.handler.js';
import redis from 'socket.io-redis';

const initSocket = (server)=>{
    const io = new SocketIO();//io 객체는 WebSocket 서버를 나타내며, 클라이언트와의 실시간 통신을 관리합니다.
    io.attach(server);//WebSocket 서버(io)를 기존의 HTTP 서버(server)에 연결

    io.adapter(redis({ host: 'localhost', port: 6379 }));

    registerHandler(io);//WebSocket 서버(io)에 이벤트 핸들러를 등록
}

export default initSocket;