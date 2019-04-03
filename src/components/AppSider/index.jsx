import { Drawer, Layout } from 'antd';
import { ThemeContext } from '@context/theme';
import Logo from '@components/Logo';

import Menu from './Menu';
const drawerStyle = { padding: 0, height: '100vh' };
const siderWidth = 256;

export default class AppSider extends React.PureComponent {
    static contextType = ThemeContext;
    get asideRender() {
        const { siderVisible, theme, isMobile } = this.context;
        return (
            <Layout.Sider
                className="app-aside"
                breakpoint="lg"
                collapsed={!isMobile && siderVisible}
                theme={theme}
                trigger={null}
                width={siderWidth}
                collapsible
            >
                <div className="app-logo">
                    <Logo theme={theme} title="Demo Admin" />
                </div>
                <Menu theme={theme} />
            </Layout.Sider>
        );
    }
    get drawerRender() {
        const { onToggleAside, siderVisible } = this.context;
        return (
            <Drawer
                style={drawerStyle}
                onClose={onToggleAside}
                visible={siderVisible}
                placement="left"
                closable={false}
                width={siderWidth}
                maskClosable
            >
                {this.asideRender}
            </Drawer>
        );
    }
    render() {
        const { isMobile } = this.context;
        return isMobile ? this.drawerRender : this.asideRender;
    }
}
