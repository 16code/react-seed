import { createReducer } from 'helper';
export const types = {
    getHistory: 'history/get',
    getHistorySucceed: 'history/getSucceed',
    getHistoryFailed: 'history/getFailed'
};
const initialState = { fetching: false, list: [] };
export const historyReducer = createReducer(initialState, {
    [types.getHistory]: getHistory,
    [types.getHistorySucceed]: getHistorySucceed,
    [types.getHistoryFailed]: getHistoryFailed
});

export const actions = {
    getHistory: payload => ({ type: types.getHistory, payload })
};

function getHistorySucceed(state, action) {
    return { fetching: false, list: action.payload };
}
function getHistoryFailed(state) {
    return {
        ...state,
        fetching: false
    };
}
function getHistory(state) {
    return {
        ...state,
        fetching: true
    };
}
