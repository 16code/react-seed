import { createReducer } from 'helper';
export const types = {
    getInfo: 'playingSong/getInfo',
    getInfoSucceed: 'playingSong/getInfoSucceed',
    getInfoFailed: 'playingSong/getInfoFailed'
};
const initialState = {
    fetching: false
};
export const playingSongReducer = createReducer(initialState, {
    [types.getInfo]: getSongInfo,
    [types.getInfoSucceed]: getSongInfoSuccess,
    [types.getInfoFailed]: getInfoFailed
});
function getSongInfo(state) {
    return { ...state, fetching: true };
}
function getSongInfoSuccess(state, action) {
    return { fetching: false, ...action.payload };
}
function getInfoFailed() {
    return { fetching: false };
}
