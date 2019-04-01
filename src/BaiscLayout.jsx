import { enquireScreen, unenquireScreen } from '@helper/enquire';
import { Layout } from 'antd';
import AppSider from '@components/AppSider';
import GlobalHeader from '@components/GlobalHeader';
import { ThemeContext, themes } from '@context/theme';
import ContainerQuery from './ContainerQuery';

export default class BaiscLayout extends React.PureComponent {
    static contextType = ThemeContext;
    constructor(props, context) {
        super(props);
        this.state = {
            siderVisible: context.siderVisible,
            theme: context.theme
        };
    }
    componentDidMount() {
        this.enquireHandler = enquireScreen(mobile => {
            this.setState({ isMobile: mobile });
        });
    }
    componentWillUnmount() {
        this.enquireHandler && unenquireScreen(this.enquireHandler);
    }
    handleToggleAside = () => {
        this.setState(prev => ({ siderVisible: !prev.siderVisible }));
    };
    handleToggleTheme = () => {
        this.setState(state => ({
            theme: state.theme === themes.dark ? themes.light : themes.dark
        }));
    };
    get layoutRender() {
        const { isMobile, siderVisible, theme } = this.state;
        const contextVlaue = {
            theme,
            siderVisible,
            isMobile,
            onToggleAside: this.handleToggleAside
        };
        return (
            <ThemeContext.Provider value={contextVlaue}>
                <Layout className={classNames('app-layout')}>
                    <AppSider />
                    <main className="app-main">
                        <GlobalHeader />
                        <section className="app-content">
                            {`随着商业化的趋势，越来越多的企业级111产品对更好的用户体验有了进一步的要求。
                        带着这样的一个终极目标，我们（蚂蚁金服体验技术部）经过大量的项目实践和总结，
                        逐步打磨出一个服务于企业级产品的设计体系 Ant Design。基于『确定』和『自然』的设计价值观，
                        通过模块化的解决方案，降低冗余的生产成本，让设计者专注于更好的用户体验。`.repeat(100)}
                        </section>
                    </main>
                </Layout>
            </ThemeContext.Provider>
        );
    }
    render() {
        return <ContainerQuery>{this.layoutRender}</ContainerQuery>;
    }
}
