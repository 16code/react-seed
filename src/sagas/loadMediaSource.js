import { all, call, put, takeLatest } from 'redux-saga/effects';

import { types as playerTypes } from 'reducers/player';
import { types as songTypes } from 'reducers/song';
import { loadSongInfo as getSongData } from './apiCalls';

export const getPlayingSongFromState = state => state.player;

// 获取音乐讯息
export function* loadSongData(action) {
    try {
        // const { playerState } = yield select(getPlayingSongFromState);
        const id = action.payload.id;
        if (id) {
            yield put({ type: songTypes.getInfo });
            const data = yield call(getSongData, id);
            if (data) {
                yield put({ type: songTypes.getInfoSuccess, payload: data });
            }
        }
    } catch (error) {
        yield put({ type: songTypes.getInfoFailed });
    }
}

export function* loadMediaSourceSaga() {
    try {
        yield all([
            takeLatest(playerTypes.playSong, loadSongData),
            takeLatest(playerTypes.playNextOrPrevSong, loadSongData)
        ]);
    } catch (error) {
        console.log(error);
    }
}
