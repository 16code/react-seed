import { Menu, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
export default ({ theme }) => (
    <Menu theme={theme} mode="inline" defaultSelectedKeys={[]} style={{ padding: '16px 0', width: '100%' }}>
        <Menu.Item key="1">
            <NavLink to="/dashboard">
                <Icon type="user" />
                <span>dashboard </span>
            </NavLink>
        </Menu.Item>
        <Menu.Item key="2">
            <NavLink to="/checkout">
                <Icon type="video-camera" />
                <span>checkout</span>
            </NavLink>
        </Menu.Item>
        <Menu.Item key="3">
            <NavLink to="/about">
                <Icon type="upload" />
                <span>about</span>
            </NavLink>
        </Menu.Item>
        <Menu.Item key="4">
            <NavLink to="/table">
                <Icon type="table" />
                <span>table</span>
            </NavLink>
        </Menu.Item>
    </Menu>
);
