export default function Icon({ className, type, style }) {
    const clsStr = classNames('iconfont', className, `icon-${type}`);
    return <i className={clsStr} style={style} />;
}
