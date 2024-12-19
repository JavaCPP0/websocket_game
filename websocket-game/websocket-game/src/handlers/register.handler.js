// WebSocket 연결 및 사용자 등록 처리 핸들러
import { addUser } from "../models/user.model.js";
import {v4 as uuidv4} from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";

const registerHandler = (io) => {
    // 새로운 클라이언트 연결 시 실행
    io.on('connection', (socket) => {
        // 고유 사용자 ID 생성
        const userUUID = uuidv4();
        
        // 사용자 정보 등록
        addUser({uuid: userUUID, socketId: socket.id});

        // 초기 연결 설정
        handleConnection(socket, userUUID);

        // 이벤트 핸들러 등록
        socket.on('event', (data) => handlerEvent(io, socket, data));
        
        // 연결 해제 핸들러 등록
        socket.on('disconnect', () => handleDisconnect(socket, userUUID));
    })
}

export default registerHandler