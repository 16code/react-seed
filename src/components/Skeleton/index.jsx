import s from './styles.less';

export default function Skeleton({ avatar, layout, paragraph, title, size = 1 }) {
    const { rows } = paragraph || { rows: 0 };    
    const list = Array.from({ length: size });
    const styles = typeof avatar === 'object' ? avatar : {};
    return list.map((__, index) => (
        <div
            key={index}
            className={classNames(s.skeleton, {
                [s.vertical]: avatar && layout === 'vertical',
                [s.horizontal]: avatar && layout === 'horizontal',
                [s['skeleton-paragraph-without-title']]: !title
            })}
        >
            {avatar && <div style={styles} className={classNames(s['skeleton-avatar'], s.shine)} />}
            <div className={s['skeleton-content']}>
                {title && <h3 className={classNames(s['skeleton-title'], s.shine)} />}
                <ul className={classNames(s['skeleton-paragraph'])}>
                    {Array.from({ length: rows }).map(
                        (__, index) => (
                            <li
                                key={index}
                                className={s.shine}
                            />
                        )
                    )}
                </ul>
            </div>
        </div>
    ));
}
