import { createReducer } from 'helper';
export const types = {
    lyricBox: 'lyricBox/toggleVisible'
};
export const lyricReducer = createReducer(
    { visible: false },
    {
        [types.lyricBox]: cb
    }
);

export const actions = {
    toggleVisible: payload => ({ type: types.lyricBox, payload })
};

function cb(state, action) {
    return { visible: typeof action.payload !== 'undefined' ? action.payload : !state.visible };
}
