// 게임 스테이지 데이터 관리 모듈

// 사용자별 스테이지 정보 저장소
const stages = {};

/**
 * 새로운 스테이지 생성
 * @param {string} uuid - 사용자 ID
 */
export const createStage = (uuid) => {
    stages[uuid] = [];  // 빈 스테이지 배열 초기화
};

/**
 * 스테이지 정보 조회
 * @param {string} uuid - 사용자 ID
 * @returns {Array} 스테이지 정보 배열
 */
export const getStage = (uuid) => {
    return stages[uuid];
};

/**
 * 새로운 스테이지 정보 추가
 * @param {string} uuid - 사용자 ID
 * @param {string} id - 스테이지 ID
 * @param {number} timestamp - 시작 시간
 */
export const setStage = (uuid, id, timestamp) => {
    return stages[uuid].push({ id, timestamp });
};

/**
 * 스테이지 정보 초기화
 * @param {string} uuid - 사용자 ID
 */
export const clearStage = (uuid) => {
    stages[uuid] = [];
};
