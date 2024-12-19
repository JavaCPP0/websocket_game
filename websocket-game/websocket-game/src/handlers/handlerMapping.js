import { moveStageHandler } from './stage.handler.js';
import { gameEnd, gameStart } from './game.handler.js';
import { handleHighScore, getGlobalHighScore } from './high.score.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  12: handleHighScore,
  13: getGlobalHighScore,
};

export default handlerMappings;
