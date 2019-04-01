import { Drawer } from 'antd';
import { ThemeContext } from '@context/theme';

export default class AppSider extends React.PureComponent {
    static contextType = ThemeContext;
    get asideRender() {
        return (
            <aside className="app-aside">
                <div>dadadadad</div>
            </aside>
        );
    }
    get drawerRender() {
        const { onToggleAside, siderVisible } = this.context;
        return (
            <Drawer onClose={onToggleAside} visible={siderVisible} placement="left" closable={false} maskClosable>
                {this.asideRender}
            </Drawer>
        );
    }
    render() {
        const { isMobile } = this.context;
        return isMobile ? this.drawerRender : this.asideRender;
    }
}
