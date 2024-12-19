import { CLIENT_VERSION } from './Constants.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

socket.on('globalHighScore', (data) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] Global high score broadcast received:`, {
    score: data.score,
    previousScore: window.lastHighScore || 0
  });
  window.lastHighScore = data.score;  // 이전 점수 저장
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent, socket };