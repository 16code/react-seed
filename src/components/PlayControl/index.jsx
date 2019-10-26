import styles from './styles.less';

// playState 播放状态 stoped, pending, playing, paused, failed
// theme light, dark

export default ({ playState = 'stoped', theme = 'dark', onClick, disabled = false }) => {
    const ctrlClass = classNames(styles['play-control'], styles[`${theme}`], styles[playState]);
    const content = <button className={ctrlClass} role="button" disabled={disabled} onClick={onClick} />;
    return content;
};
