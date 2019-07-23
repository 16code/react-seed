import { Layout } from 'antd';
import AppSider from '@components/AppSider';
import GlobalHeader from '@components/GlobalHeader';
import ContainerQuery from '@components/ContainerQuery';
import MediaQuery from '@components/MediaQuery';
import { UiContext, themes } from '@context/ui';
import Views from '@views';
const { Header, Content } = Layout;

export default class BasicLayout extends React.PureComponent {
    static contextType = UiContext
    constructor(props, context) {
        super(props);
        this.state = {
            collapsed: context.collapsed,
            theme: context.theme
        };
    }
    handleToggleAside = () => {
        this.setState(
            prev => ({ collapsed: !prev.collapsed }),
            () => {
                this.context.onToggleAside(this.state.collapsed);
            }
        );
    }
    handleToggleTheme = () => {
        this.setState(state => ({
            theme: state.theme === themes.dark ? themes.light : themes.dark
        }));
    }
    layoutRender = isMobile => {
        const { collapsed, theme } = this.state;
        const contextValue = {
            theme,
            collapsed,
            isMobile,
            onToggleTheme: this.handleToggleTheme,
            onToggleAside: this.handleToggleAside
        };
        return (
            <ContainerQuery>
                <Layout className={classNames('app-layout', `theme-${theme}`)}>
                    <UiContext.Provider value={contextValue}>
                        <AppSider />
                        <Layout>
                            <Header style={{ padding: 0 }}>
                                <GlobalHeader />
                            </Header>
                            <Content className="app-content">
                                <Views />
                            </Content>
                        </Layout>
                    </UiContext.Provider>
                </Layout>
            </ContainerQuery>
        );
    }
    render() {
        return <MediaQuery>{this.layoutRender}</MediaQuery>;
    }
}
