import { Layout } from 'antd';
import AppSider from '@components/AppSider';
import GlobalHeader from '@components/GlobalHeader';
import ContainerQuery from '@components/ContainerQuery';
import MediaQuery from '@components/MediaQuery';
import { UiContext, themes } from '@context/ui';

const { Header, Content } = Layout;
export default class BasicLayout extends React.PureComponent {
    static contextType = UiContext;
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
    };
    handleToggleTheme = () => {
        this.setState(state => ({
            theme: state.theme === themes.dark ? themes.light : themes.dark
        }));
    };
    layoutRender = isMobile => {
        const { collapsed, theme } = this.state;
        const contextValue = {
            theme,
            collapsed,
            isMobile: isMobile,
            onToggleTheme: this.handleToggleTheme,
            onToggleAside: this.handleToggleAside
        };
        return (
            <Layout className={classNames('app-layout')}>
                <UiContext.Provider value={contextValue}>
                    <AppSider />
                    <Layout>
                        <Header className="app-header">
                            <GlobalHeader />
                        </Header>
                        <Content className="app-content">
                            <input
                                type="color"
                                onChange={event => {
                                    window.less.modifyVars({
                                        '@primary-color': event.target.value
                                    });
                                }}
                            />
                            <a href="">1313131</a>
                        </Content>
                    </Layout>
                </UiContext.Provider>
            </Layout>
        );
    };
    render() {
        return (
            <ContainerQuery>
                <MediaQuery>{this.layoutRender}</MediaQuery>
            </ContainerQuery>
        );
    }
}