import { combineReducers } from 'redux';
import { updatedReducer } from './playerState';
import { lyricBoxVisibleReducer } from './lyricBox';

export default combineReducers({
    player: updatedReducer,
    lyricBox: lyricBoxVisibleReducer
});
