import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 게임 에셋을 저장할 객체
let gameAssets = {};

// ES 모듈에서 현재 파일 절대경로를 얻기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// assets 폴더의 절대 경로 설정
const basePath = path.join(__dirname, '../../assets');

/**
 * JSON 파일을 비동기적으로 읽어서 파싱하는 함수
 * @param {string} filename - 읽을 파일의 이름
 * @returns {Promise<Object>} 파싱된 JSON 데이터를 담은 Promise
 */
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

/**
 * 게임에 필요한 모든 JSON 에셋 파일들을 동시에 로드하는 함수
 * @returns {Promise<Object>} 로드된 모든 게임 에셋을 담은 객체
 * @throws {Error} 파일 로드 실패시 에러
 */
export const loadGameAssets = async () =>{
    try{
        const [stages,items,itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('item_unlock.json'),
        ]);
    
        gameAssets = {stages,items,itemUnlocks};
        return gameAssets;
    } catch(e){
        throw new Error('failed to load game assets:'+ e.message);
    }
}

/**
 * 현재 로드된 게임 에셋을 반환하는 함수
 * @returns {gameAssets} 현재 로드된 게임 에셋 객체
 */
export const getGameAssets = () => {
  return gameAssets;
};
