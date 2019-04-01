import root from './root';
const rootElement = document.getElementById('root');

const render = Component => {
    ReactDOM.render(<Component />, rootElement);
};
render(root);
