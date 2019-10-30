import { all, call, put, select, takeLatest } from 'redux-saga/effects';
// import { delay } from 'utils';

import { types } from 'reducers/player';
import { loadSongInfo as getSongData } from './apiCalls';

export const getPlayingSongFromState = state => state.player;

// 获取音乐讯息
export function* loadSongData() {
    try {
        const { playingSongId: id, playerState } = yield select(getPlayingSongFromState);
        if (playerState === 'pending' && id) {
            yield put({ type: types.fetchSongDataRequest });
            const data = yield call(getSongData, id);
            if (data) {
                // yield delay(1000);
                yield put({ type: types.fetchSongDataSuccess, payload: data });
            }
        }
    } catch (error) {
        yield put({ type: types.fetchSongDataFailure });
    }
}

export function* loadMediaSourceSaga() {
    try {
        yield all([takeLatest(types.playSong, loadSongData), takeLatest(types.playNextOrPrevSong, loadSongData)]);
    } catch (error) {
        console.log(error);
    }
}
