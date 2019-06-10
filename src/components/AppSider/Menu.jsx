import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
export default ({ theme }) => (
    <Menu theme={theme} mode="inline" defaultSelectedKeys={['1']} style={{ padding: '16px 0', width: '100%' }}>
        <Menu.Item key="1">
            <Link to="/dashboard">
                <Icon type="user" />
                <span>dashboard </span>
            </Link>
        </Menu.Item>
        <Menu.Item key="2">
            <Link to="/checkout">
                <Icon type="video-camera" />
                <span>checkout</span>
            </Link>
        </Menu.Item>
        <Menu.Item key="3">
            <Link to="/about">
                <Icon type="upload" />
                <span>about</span>
            </Link>
        </Menu.Item>
    </Menu>
);
