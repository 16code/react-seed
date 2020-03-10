import { NavLink, withRouter } from 'react-router-dom';
export function Icon({ className, type }) {
    const clsStr = classNames('iconfont', className, `icon-${type}`);
    return <i className={clsStr} />;
}

const clsStr = (str = '') => `color color${str.toLowerCase().replace(/\//g, '-')}`;

@withRouter
@displayName('AppMenu')
export default class Menu extends React.Component {
    static defaultProps = {
        width: 220
    };
    shouldComponentUpdate(nextProps) {
        return nextProps.location.pathname !== this.props.location.pathname;
    }
    handleToggle = () => {
        if (this.props.lyricBoxVisible) this.props.toggleLrcBoxVisible();
    };
    renderItem = (items = []) =>
        items.map(
            item =>
                !item.hidden && (
                    <li className="menu-item" key={item.keyIndex || item.path}>
                        <NavLink
                            className="menu-link ellipsis"
                            activeClassName="menu-link-selected"
                            to={item.path}
                            onClick={this.handleToggle}
                        >
                            {item.icon ? <Icon type={item.icon} /> : <span className={clsStr(item.path)} />}
                            <span className="menu-name">{item.name}</span>
                        </NavLink>
                    </li>
                )
        );
    renderGroup = item => {
        if (item.children) {
            return (
                <div className="app-menu-item-group" key={item.keyIndex}>
                    <div className="app-menu-item-group-title">{item.name}</div>
                    <ul className="app-menu-item-children-list list-unstyled">
                        {item.children && this.renderItem(item.children)}
                    </ul>
                </div>
            );
        }
        return (
            <NavLink activeClassName="menu-link-selected" key={item.path} to={item.path}>
                {item.icon && <Icon type={item.icon} />}
                <span className="menu-name">{item.name}</span>
            </NavLink>
        );
    };
    render() {
        const { data } = this.props;
        return <div className="app-menu">{data.map(this.renderGroup)}</div>;
    }
}
