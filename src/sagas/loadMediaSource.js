import DB from 'services/dbs';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { types as playerTypes } from 'reducers/player';
import { types as songTypes } from 'reducers/song';
import { loadSongInfo as getSongData } from './apiCalls';

export const getPlayingSongFromState = state => state.player;

// 获取音乐讯息
export function* loadSongData(action) {
    try {
        const id = action.payload.id;
        if (id) {
            yield put({ type: songTypes.getInfo });
            let data = yield call(DB.history.get, id);
            if (!data) {
                data = yield call(getSongData, id);
                yield call(DB.history.put, data);
            }
            yield put({ type: songTypes.getInfoSuccess, payload: data });
        }
    } catch (error) {
        console.error(error);
        yield put({ type: songTypes.getInfoFailed, error });
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
