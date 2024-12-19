import { getGameAssets } from "../init/assets.js";
import { getStage,setStage,clearStage } from "../models/stage.model.js";

/**
 * 게임 시작 핸들러
 * @param {string} uuid - 유저 식별자
 * @param {object} payload - 클라이언트에서 전송한 데이터 (timestamp 포함)
 * @returns {object} 게임 시작 상태
 */
export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  // 이전 스테이지 기록 초기화
  clearStage(uuid);
  // stages 배열에서 첫 번째 스테이지 설정
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('Stage: ', getStage(uuid));

  return { status: 'success' };
};

/**
 * 게임 종료 핸들러
 * @param {string} uuid - 유저 식별자
 * @param {object} payload - 클라이언트에서 전송한 데이터 (종료 시간과 점수 포함)
 * @returns {object} 게임 종료 상태와 검증된 점수
 */
export const gameEnd = (uuid, payload) => {
  // 클라이언트로부터 받은 게임 종료 시간과 최종 점수
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);

  // 스테이지 기록이 없는 경우 처리
  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지별 소요 시간을 합산하여 총 점수 계산
  let totalScore = 0;

  stages.forEach((stage, index) => {
    let stageEndTime;
    // 마지막 스테이지인 경우 게임 종료 시간을 사용
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시작 시간을 현재 스테이지의 종료 시간으로 사용
      stageEndTime = stages[index + 1].timestamp;
    }

    // 스테이지 지속 시간을 초 단위로 계산
    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration;
  });

  // 클라이언트에서 보낸 점수와 서버에서 계산한 점수의 차이가 5 이상인 경우 검증 실패
  if(Math.abs(score-totalScore)>5){
    return {status:"fail",message:"Score verification failed"}
  }

  return { status: 'success',message: "Game ended",score };
};
