import { combineReducers } from 'redux';
import { playerReducer } from './player';
import { lyricReducer } from './lyric';

export default combineReducers({
    player: playerReducer,
    lyricBox: lyricReducer
});
