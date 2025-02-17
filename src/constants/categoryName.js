export const MOVIES = '영화';
export const TRAVEL = '여행';
export const ART = '미술';
export const MUSIC = '음악';
export const DIY = 'DIY';
export const EXERCISE = '운동';
export const GAMES = '게임';
export const COOKING = '요리';
export const ANIMALS = '동물';
export const ETC = '기타';

import movie from '../../public/movie.png';
import travel from '../../public/travel.png';
import art from '../../public/art.png';
import music from '../../public/music.png';
import diy from '../../public/diy.png';
import exercise from '../../public/exercise.png';
import game from '../../public/game.png';
import cooking from '../../public/cooking.png';
import animal from '../../public/animal.png';
import etc from '../../public/etc.png';

// 카테고리 이름과 이미지를 객체 배열로 만듦
export const categoryArr = [
    { name: MOVIES, img: movie },
    { name: TRAVEL, img: travel },
    { name: ART, img: art },
    { name: MUSIC, img: music },
    { name: DIY, img: diy },
    { name: EXERCISE, img: exercise },
    { name: GAMES, img: game },
    { name: COOKING, img: cooking },
    { name: ANIMALS, img: animal },
    { name: ETC, img: etc }, 
  ];
  