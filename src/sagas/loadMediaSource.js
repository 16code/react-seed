import DB from 'services/dbs';
import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { types as playerTypes } from 'reducers/player';
import { types as songTypes } from 'reducers/song';
// import { types as historyTypes } from 'reducers/history';
import { loadSongInfo as getSongData } from './apiCalls';

export const getPlayingSongFromState = state => state.player;
export const getPlayHistoryFromState = state => state.playHistory;

// 获取音乐讯息
export function* loadSongData(action) {
    try {
        const { id } = action.payload || {};
        if (id) {
            yield put({ type: songTypes.getInfo });
            let data = yield call(DB.history.get, id);
            if (!data) {
                data = yield call(getSongData, id);
                yield call(DB.history.put, data);
            }
            yield put({ type: songTypes.getInfoSucceed, payload: data });
        }
    } catch (error) {
        console.error(error);
        yield put({ type: songTypes.getInfoFailed, error });
    }
}
const allowedPlayActions = ['next', 'prev'];
export function getMusicOffset(id, list) {
    return id ? list.findIndex(item => item.id === id) : -1;
}
function* handlePlayNextOrPrev(action) {
    const playAction = action.payload;
    try {
        if (allowedPlayActions.includes(playAction)) {
            const { list } = yield select(getPlayHistoryFromState);
            const { playingSongId } = yield select(getPlayingSongFromState);
            const offset = getMusicOffset(playingSongId, list);
            const listCount = list.length;
            if (offset > -2) {
                let nextOffset = offset;
                switch (playAction) {
                    case 'next':
                        nextOffset = offset === listCount - 1 ? 0 : offset + 1;
                        break;
                    case 'prev':
                        nextOffset = [0, -1].includes(offset) ? listCount - 1 : offset - 1;
                        break;
                    default:
                        break;
                }
                const nextId = list[nextOffset] ? list[nextOffset].id : -1;
                if (nextId) yield put({ type: playerTypes.playSong, payload: { id: nextId } });
            }
        }
    } catch (error) {
        console.log(error);
    }
}
export function* loadMediaSourceSaga() {
    try {
        yield all([
            takeLatest(playerTypes.playSong, loadSongData),
            takeLatest(playerTypes.playNextOrPrevSong, handlePlayNextOrPrev)
        ]);
    } catch (error) {
        console.log(error);
    }
}
