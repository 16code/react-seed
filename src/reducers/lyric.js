import { createReducer } from 'helper';
export const types = {
    toggleVisible: 'lyric/toggleVisible',
    updateLyric: 'lyric/updateLyric'
};
const initialState = { visible: false };
export const lyricReducer = createReducer(initialState, {
    [types.toggleVisible]: toggleVisible,
    [types.updateLyric]: updateLyric
});

export const actions = {
    toggleVisible: payload => ({ type: types.lyricBox, payload })
};

function toggleVisible(state, action) {
    return { visible: typeof action.payload !== 'undefined' ? action.payload : !state.visible };
}

function updateLyric(state, action) {
    return {
        ...state,
        ...action.payload
    };
}
