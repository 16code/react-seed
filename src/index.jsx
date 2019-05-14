import ErrorBoundary from '@components/ErrorBoundary';
import root from './root';
const rootElement = document.getElementById('root');

const render = Component => {
    ReactDOM.render(
        <ErrorBoundary>
            <Component />
        </ErrorBoundary>,
        rootElement
    );
};
render(root);
