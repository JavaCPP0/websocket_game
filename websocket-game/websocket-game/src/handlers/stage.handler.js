import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

// 게임 스테이지 관리 핸들러
export const moveStageHandler = (userId, payload) => {
    // 현재 스테이지 정보 조회
    let currentStages = getStage(userId);
    if (!currentStages.length) {
        return { status: 'fail', message: 'No stages found for user' };
    }

    // 현재 스테이지 검증
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    if (currentStage.id !== payload.currentStage) {
        return { status: 'fail', message: 'Current Stage mismatch' };
    }

    // 스테이지 클리어 시간 검증
    const serverTime = Date.now();
    const elapsedTime = (serverTime - currentStage.timeStamp) / 1000;

    // 스테이지 클리어 시간이 유효한지 확인 (100~105초 사이)
    if (elapsedTime < 100 || elapsedTime > 105) {
        return {status: 'fail', message: 'Invalid elapsed time'};
    }

    // 다음 스테이지 유효성 검증
    const { stages } = getGameAssets();
    if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
        return { status: 'fail', message: 'Target stage not found' };
    }

    // 새로운 스테이지 설정
    setStage(userId, payload.targetStage, serverTime);

    return { status: 'success' };
};

export default moveStageHandler;
