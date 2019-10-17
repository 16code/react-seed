import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import AppContainer from './AppContainer';

setConfig({
    ignoreSFC: false,
    trackTailUpdates: false,
    pureRender: true
});
class HotContainer extends React.PureComponent {
    render() {
        return <AppContainer />;
    }
}

export default hot(HotContainer);
