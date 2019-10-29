// import { takeLatest } from 'redux-saga';
import { all } from 'redux-saga/effects';
import { loadMediaSourceSaga } from './loadMediaSource';

export default function* rootSaga() {
    try {
        yield all([loadMediaSourceSaga()]);
    } catch (error) {
        console.log(error);
    }
}
