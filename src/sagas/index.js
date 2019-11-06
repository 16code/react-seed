import { all, fork, delay, put } from 'redux-saga/effects';
import { types as historyTypes } from 'reducers/history';
import { loadMediaSourceSaga } from './loadMediaSource';
import { historySaga } from './history';

function* initialSaga() {
    try {
        yield delay(1000);
        yield put({
            type: historyTypes.getHistory,
            payload: {
                isInitGet: true
            }
        });
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
