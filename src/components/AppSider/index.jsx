import { Drawer, Layout } from 'antd';
import { UiContext } from '@context/ui';
import Logo from '@components/Logo';

import Menu from './Menu';
const drawerStyle = { padding: 0, height: '100vh' };
const siderWidth = 242;

export default class AppSider extends React.PureComponent {
    static contextType = UiContext;
    get asideRender() {
        const { collapsed, theme, isMobile } = this.context;
        return (
            <Layout.Sider
                className="app-aside"
                breakpoint="lg"
                collapsed={!isMobile && collapsed}
                theme={theme}
                trigger={null}
                width={siderWidth}
                collapsible
            >
                <div className="aside-logo">
                    <Logo theme={theme} title="Demo Admin" />
                </div>
                <Menu theme={theme} />
            </Layout.Sider>
        );
    }
    get drawerRender() {
        const { onToggleAside, collapsed } = this.context;
        return (
            <Drawer
                style={drawerStyle}
                onClose={onToggleAside}
                visible={collapsed}
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
