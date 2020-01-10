import 'styles';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeContext } from 'hooks/useTheme';
import GlobalLayout from 'components/Layout/GlobalLayout';
import { store } from 'store/configureStore';
import AudioPlayer from 'components/Player';
import AppMenu from 'components/Menu';
import PlayCurrent from 'components/PlayCurrent';
import LyricModal from 'components/Lyric';
import { getMenuData } from 'common/menu';
import Views from 'views';

const menuData = getMenuData();

class BasicLayout extends React.PureComponent {
    static contextType = ThemeContext;
    constructor(props, context) {
        super(props);
        context.changeTheme(context.theme);
        this.state = {
            theme: context.theme,
            themes: context.themes
        };
    }
    handleChangeTheme = v => {
        this.setState({ theme: v }, () => {
            this.context.changeTheme(v);
        });
    }
    render() {
        const { theme, themes } = this.state;
        const contextValue = {
            theme,
            themes,
            changeTheme: this.handleChangeTheme
        };
        const aside = (
            <>
                <AppMenu data={menuData} />
                <PlayCurrent />
            </>
        );
        const header = 'header';
        const footer = <AudioPlayer />;
        return (
            <ThemeContext.Provider value={contextValue}>
                <GlobalLayout aside={aside} header={header} footer={footer}>
                    <Views />
                </GlobalLayout>
                <LyricModal />
            </ThemeContext.Provider>
        );  
    }
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
