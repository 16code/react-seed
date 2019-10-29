import { createReducer } from 'helper';
export const types = {
    setTitle: 'document/setTitle'
};
export const documentTitleReducer = createReducer(
    { title: 'React Music' },
    {
        [types.setTitle]: cb
    }
);

export const actions = {
    updateTitle: payload => ({ type: types.setTitle, payload })
};

function cb(state, action) {
    return { title: action.payload };
}
