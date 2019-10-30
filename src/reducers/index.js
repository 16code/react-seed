import { combineReducers } from 'redux';
import { updatedReducer } from './player';
import { lyricBoxVisibleReducer } from './lyricBox';

export default combineReducers({
    player: updatedReducer,
    lyricBox: lyricBoxVisibleReducer
});
