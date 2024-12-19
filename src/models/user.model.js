// 사용자 정보를 저장할 배열 (임시 데이터베이스 역할)
const users = []; 

/**
 * 새로운 사용자를 배열에 추가하는 함수 (인메모리)
 * @param {Object} user - 사용자 객체 {uuid: 사용자UUID, socketId: 소켓ID}
 */
export const addUser = (user) => {
    users.push(user);
};

/**
 * 소켓 ID를 기반으로 사용자를 배열에서 제거하는 함수
 * @param {string} socketId - 제거할 사용자의 소켓 ID
 * @returns {Object|undefined} 제거된 사용자 객체 또는 undefined
 */
export const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

/**
 * 모든 사용자 목록을 반환하는 함수
 * @returns {Array} 사용자 객체 배열
 */
export const getUser = () => {
    return users;
};