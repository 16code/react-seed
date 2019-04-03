import { Icon, Tooltip, Dropdown, Menu, Avatar } from 'antd';
import { ThemeContext } from '@context/theme';
import Logo from '@components/Logo';
import styles from './styles.less';

const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;

function HeaderMenu(props) {
    const menu = (
        <Menu onClick={props.onMenuClick} className={styles.menu} selectedKeys={[]}>
            <MenuItem disabled>
                <Icon type="user" />
                个人中心
            </MenuItem>
            <MenuItem key="changeTheme">
                <Icon type="skin" />
                切换主题
            </MenuItem>
            <MenuDivider />
            <MenuItem key="logout">
                <Icon type="logout" /> 退出登录
            </MenuItem>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} overlayClassName={styles['action-dropdown']} trigger={['click']}>
            <span className={styles.action}>
                <Avatar size="small" icon="user" className={styles.avatar} />
                <span className={styles.name}>Jerry</span>
            </span>
        </Dropdown>
    );
}
export default function GlobalHeader() {
    return (
        <ThemeContext.Consumer>
            {({ isMobile, siderVisible, onToggleAside, onToggleTheme }) => {
                const icon = siderVisible || isMobile ? 'menu-unfold' : 'menu-fold';
                return (
                    <>
                        {isMobile && <Logo width="32" className={styles['global-header-logo']} />}
                        <span
                            className={classNames(styles.action, styles.trigger)}
                            onClick={onToggleAside}
                            role="button"
                        >
                            <Icon type={icon} />
                        </span>
                        <div className={styles.actions}>
                            <Tooltip title="使用文档">
                                <a target="_blank" rel="noopener noreferrer" className={styles.action}>
                                    <Icon type="question-circle-o" />
                                </a>
                            </Tooltip>
                            <HeaderMenu
                                onMenuClick={() => {
                                    onToggleTheme();
                                }}
                            />
                        </div>
                    </>
                );
            }}
        </ThemeContext.Consumer>
    );
}
