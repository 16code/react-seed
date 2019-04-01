import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import AppContainer from './AppContainer';

whyDidYouRender(React);
setConfig({
    ignoreSFC: false,
    pureRender: true,
    logLevel: 'error'
});
@hot
export default class HotContainer extends React.PureComponent {
    render() {
        return <AppContainer />;
    }
}
