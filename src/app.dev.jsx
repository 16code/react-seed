import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import AppContainer from './AppContainer';

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
