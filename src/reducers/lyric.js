import { createReducer } from 'helper';
export const types = {
    toggleVisible: 'lyric/toggleVisible',
    updateLyric: 'lyric/updateLyric'
};
const initialState = { visible: true };
export const lyricReducer = createReducer(initialState, {
    [types.toggleVisible]: toggleVisible
});

export const actions = {
    toggleVisible: () => ({ type: types.toggleVisible })
};

function toggleVisible(state) {
    return { visible: !state.visible };
}
