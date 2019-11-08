import ErrorBoundary from 'components/ErrorBoundary';
import audioEventEmitter from 'components/AudioEventEmitter';
import root from './root';
const rootElement = document.getElementById('root');

audioEventEmitter();

const render = Component => {
    ReactDOM.render(
        <ErrorBoundary>
            <Component />
        </ErrorBoundary>,
        rootElement
    );
};
render(root);
