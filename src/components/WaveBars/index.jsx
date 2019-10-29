import styles from './styles';

export default function WaveBars({ id = parseInt(Math.random() * 100, 10) }) {
    const barEmberId = `bar-ember${id}`;
    const barMaskId = `bar-mask-ember${id}`;
    const barMaskUrl = `url(${barMaskId})`;
    return (
        <span id={`music-${id}`} className={classNames(styles.wavebars)}>
            <svg className={styles['wavebars-svg']} viewBox="0 0 11 11">
                <defs>
                    <rect id={barEmberId} x="0" width="2.1" y="0" height="11" rx=".25" />
                    <mask id={barMaskId}>
                        <use href={`#${barEmberId}`} fill="white" />
                    </mask>
                </defs>
                <g mask={barMaskUrl}>
                    <use
                        className={classNames(styles['wavebars-bar'], styles['wavebars-bar--1'])}
                        href={`#${barEmberId}`}
                    />
                </g>
                <g mask={barMaskUrl} transform="translate(2.9668 0)">
                    <use
                        className={classNames(styles['wavebars-bar'], styles['wavebars-bar--2'])}
                        href={`#${barEmberId}`}
                    />
                </g>
                <g mask={barMaskUrl} transform="translate(5.9333 0)">
                    <use
                        className={classNames(styles['wavebars-bar'], styles['wavebars-bar--3'])}
                        href={`#${barEmberId}`}
                    />
                </g>
                <g mask={barMaskUrl} transform="translate(8.8999 0)">
                    <use
                        className={classNames(styles['wavebars-bar'], styles['wavebars-bar--4'])}
                        href={`#${barEmberId}`}
                    />
                </g>
            </svg>
        </span>
    );
}
