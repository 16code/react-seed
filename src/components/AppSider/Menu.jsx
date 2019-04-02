import { Menu, Icon } from 'antd';
export default ({ theme }) => (
    <Menu theme={theme} mode="inline" defaultSelectedKeys={['1']} style={{ padding: '16px 0', width: '100%' }}>
        <Menu.Item key="1">
            <Icon type="user" />
            <span>nav 1</span>
        </Menu.Item>
        <Menu.Item key="2">
            <Icon type="video-camera" />
            <span>nav 2</span>
        </Menu.Item>
        <Menu.Item key="3">
            <Icon type="upload" />
            <span>nav 3</span>
        </Menu.Item>
    </Menu>
);
