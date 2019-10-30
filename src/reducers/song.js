import { createReducer } from 'helper';
export const types = {
    getInfo: 'song/getInfo',
    getInfoSuccess: 'song/getInfoSuccess',
    getInfoFailed: 'song/getInfoFailed'
};
const initialState = {
    fetching: false
};
export const songInfoReducer = createReducer(initialState, {
    [types.getInfo]: getSongInfo,
    [types.getInfoSuccess]: getSongInfoSuccess,
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
