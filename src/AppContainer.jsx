import 'styles';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import GlobalLayout from 'components/Layout/GlobalLayout';
import { store } from 'store/configureStore';
import AudioPlayer from 'components/Player';
import AppMenu from 'components/Menu';
import PlayCurrent from 'components/PlayCurrent';
import { getMenuData } from 'common/menu';
import Views from 'views';

const menuData = getMenuData();

function BasicLayout() {
    const aside = (
        <>
            <AppMenu data={menuData} />
            <PlayCurrent />
        </>
    );
    const header = 'header';
    const footer = <AudioPlayer />;
    return (
        <>
            <GlobalLayout aside={aside} header={header} footer={footer}>
                <Views />
            </GlobalLayout>
        </>
    );
}

export default function AppContainer() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={BasicLayout} />
                </Switch>
            </BrowserRouter>
        </Provider>
    );
}

AppContainer.displayName = 'AppContainer';
