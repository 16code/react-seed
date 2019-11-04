import { createReducer } from 'helper';
export const types = {
    getHistory: 'history/get',
    getHistorySucceed: 'history/getSucceed',
    getHistoryFailed: 'history/getFailed',
    toggleVisible: 'history/toggleVisible'
};
const initialState = { fetching: false, visible: false, list: [] };
export const historyReducer = createReducer(initialState, {
    [types.getHistory]: getHistory,
    [types.getHistorySucceed]: getHistorySucceed,
    [types.getHistoryFailed]: getHistoryFailed,
    [types.toggleVisible]: toggleVisible
});

export const actions = {
    getHistory: payload => ({ type: types.getHistory, payload }),
    toggleVisible: () => ({ type: types.toggleVisible })
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
function toggleVisible(state) {
    return { ...state, visible: !state.visible };
}
