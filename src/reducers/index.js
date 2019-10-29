import { combineReducers } from 'redux';
import { ajaxReducer } from './ajax';
import { updatedReducer } from './playerState';
import { lyricBoxVisibleReducer } from './lyricBox';
import { documentTitleReducer } from './title';

export default combineReducers({
    ajax: ajaxReducer,
    player: updatedReducer,
    lyricBox: lyricBoxVisibleReducer,
    documentTitle: documentTitleReducer
});
