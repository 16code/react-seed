import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
export default ({ theme }) => (
    <Menu theme={theme} mode="inline" defaultSelectedKeys={['1']} style={{ padding: '16px 0', width: '100%' }}>
        <Menu.Item key="1">
            <Icon type="user" />
            <span>
                <Link to="/dashboard">dashboard</Link>
            </span>
        </Menu.Item>
        <Menu.Item key="2">
            <Icon type="video-camera" />
            <span>
                <Link to="/checkout">checkout</Link>
            </span>
        </Menu.Item>
        <Menu.Item key="3">
            <Icon type="upload" />
            <span>
                <Link to="/about">about</Link>
            </span>
        </Menu.Item>
    </Menu>
);
