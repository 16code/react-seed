import { all, put, fork, delay } from 'redux-saga/effects';
import { types as playerTypes } from 'reducers/player';
import { loadMediaSourceSaga } from './loadMediaSource';
import { historySaga } from './history';

function* initialSaga() {
    try {
        yield delay(1000000);
        yield put({ type: playerTypes.playSong, payload: { id: 1396568325 } });
    } catch (error) {
        console.log(error);
    }
}
export default function* rootSaga() {
    try {
        yield fork(initialSaga);
        yield all([loadMediaSourceSaga(), historySaga()]);
    } catch (error) {
        console.log(error);
    }
}
