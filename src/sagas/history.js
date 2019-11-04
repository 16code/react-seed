import DB from 'services/dbs';
import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { types as historyTypes } from 'reducers/history';

export const getPlayHistoryFromState = state => state.playHistory;

// 获取播放历史
export function* getHistory() {
    try {
        const { visible } = yield select(getPlayHistoryFromState);
        if (visible) {
            const data = yield call(DB.history.get);
            yield put({ type: historyTypes.getHistorySucceed, payload: data });
        }
    } catch (error) {
        console.error(error);
        yield put({ type: historyTypes.getHistoryFailed, error });
    }
}

export function* historySaga() {
    try {
        yield all([takeLatest(historyTypes.toggleVisible, getHistory)]);
    } catch (error) {
        console.log(error);
    }
}
