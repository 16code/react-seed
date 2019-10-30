import { all, call, put, select, takeLatest } from 'redux-saga/effects';
// import { delay } from 'utils';

import { types as playerTypes } from 'reducers/player';
import { types as lyricTypes } from 'reducers/lyric';
import { types as songTypes } from 'reducers/song';
import { loadSongInfo as getSongData } from './apiCalls';

export const getPlayingSongFromState = state => state.player;

// 获取音乐讯息
export function* loadSongData() {
    try {
        const { playingSongId: id, playerState } = yield select(getPlayingSongFromState);
        if (playerState === 'pending' && id) {
            yield put({ type: songTypes.getInfo });
            const data = yield call(getSongData, id);
            if (data) {
                // yield delay(1000);
                const { id, name, blur, album, alia, mv, quality, lyric } = data;
                yield put({ type: lyricTypes.updateLyric, payload: { id, lyric } });
                yield put({ type: songTypes.getInfoSuccess, payload: { id, name, blur, album, alia, mv, quality } });
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
