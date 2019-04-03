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
                            {`随着商业化的趋势，越来越多的企业级111产品对更好的用户体验有了进一步的要求。
                        带着这样的一个终极目标，我们（蚂蚁金服体验技术部）经过大量的项目实践和总结，
                        逐步打磨出一个服务于企业级产品的设计体系 Ant Design。基于『确定』和『自然』的设计价值观，
                        通过模块化的解决方案，降低冗余的生产成本，让设计者专注于更好的用户体验。`.repeat(30)}
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
