import { combineReducers } from 'redux';
import { playerReducer } from './player';
import { lyricReducer } from './lyric';
import { playingSongReducer } from './song';

export default combineReducers({
    player: playerReducer,
    lyric: lyricReducer,
    playingSong: playingSongReducer
});
