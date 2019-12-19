import Image from 'components/Image';
import styles from './style.less';

// shape { circled, squared }

function ThumbCard({ id, name, coverImg, countNum, size, wrapClassName, shape = 'squared' }) {
    const cls = classNames(styles['thumb-card'], styles[shape], 'ui-hover-effect');
    const style = size ? sizeFormat(size) : {};
    const content = (
        <a className={cls} style={{ width: style.width }} href={`#/${id}`}>
            {countNum && (
                <small className={styles.count}>
                    <span>{countFormat(countNum)}</span>
                </small>
            )}
            <figure className="masked-img" style={style}>
                <Image src={coverImg} size={size} lazyload />
            </figure>
            <h3>{name}</h3>
        </a>
    );
    return wrapClassName ? (
        <div className={wrapClassName} style={style}>
            {content}
        </div>
    ) : (
        content
    );
}

const areEqual = (prevProps, nextProps) => prevProps.id === nextProps.id;
export default React.memo(props => <ThumbCard {...props} />, areEqual);

export function countFormat(count) {
    count = +count || 0;
    if (count < 1e5) return count;
    return `${Math.ceil(count / 1e4)}万`;
}
