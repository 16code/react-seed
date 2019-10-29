import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import rootReducers from 'reducers';
import rootSagas from 'sagas';
import playerMiddleware from './player.middleware';

const sagaMiddleware = createSagaMiddleware(rootSagas);
const loggerMiddleware = createLogger({
    collapsed: true,
    timestamp: false,
    level: 'info'
});
/* eslint-disable no-underscore-dangle */
const configureStore = (initialState => {
    const store = createStore(
        rootReducers,
        initialState,
        compose(
            applyMiddleware(playerMiddleware(), loggerMiddleware, sagaMiddleware),
            window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : fn => fn
        )
    );
    sagaMiddleware.run(rootSagas);
    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default;
            store.replaceReducer(nextReducer);
        });
    }
    return store;
})();
export { configureStore as store };
