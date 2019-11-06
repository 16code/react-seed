import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import AppContainer from './AppContainer';

setConfig({
    ignoreSFC: false,
    trackTailUpdates: false,
    pureRender: true
});
const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender');
whyDidYouRender(React);
class HotContainer extends React.PureComponent {
    render() {
        return <AppContainer />;
    }
}

export default hot(HotContainer);
