import Image from 'components/Image';
import styles from './style.less';

// shape { circled, squared }

function ThumbCard({ name, coverImg, countNum, size, wrapClassName, shape = 'squared' }) {
    const cls = classNames(styles['thumb-card'], styles[shape], 'ui-hover-effect');
    const style = size ? sizeFormat(size) : null;
    const content = (
        <div className={cls} style={style}>
            {countNum && (
                <small className={styles.count}>
                    <span>{countFormat(countNum)}</span>
                </small>
            )}
            <figure className="masked-img">
                <Image src={coverImg} size={size} lazyload />
                <figcaption>
                    <a href="#">{name}</a>
                </figcaption>
            </figure>
        </div>
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
