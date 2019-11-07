import { connect } from 'react-redux';
import { PLAYER_STATE } from 'common/constants';
import { actions as playerActions } from 'reducers/player';
import styles from './styles.less';

// playState 播放状态 stoped, pending, playing, paused, failed
// theme light, dark
const pausedIcon = (
    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        <path fill="none" d="M0 0h24v24H0z" />
    </svg>
);
const playingIcon = (
    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
        <path d="M8 5v14l11-7z" />
        <path fill="none" d="M0 0h24v24H0z" />
    </svg>
);
const pendingIcon = (
    <span className={styles.pending}>
        <span />
        <span />
    </span>
);
function useIcon(state) {
    let icon;
    switch (state) {
        case 'paused':
        case 'failed':
        case 'stoped':
            icon = playingIcon;
            break;
        case 'pending':
            icon = pendingIcon;
            break;
        default:
            icon = pausedIcon;
            break;
    }
    return icon;
}
function PlayControl({
    songId,
    className,
    theme = 'light',
    playerState,
    disabled,
    inOverlay,
    isCurrentPlay,
    onPlaySong,
    changePlayerState
}) {
    const btnPlayState = isCurrentPlay ? playerState : 'stoped';
    const ctrlClass = classNames(styles['play-control'], className, styles[`${theme}`], {
        [styles['in-overlay']]: inOverlay,
        [styles.disabled]: disabled
    });
    React.useEffect(() => {
        const dom = document.getElementById(`music-${songId}`);
        if (dom) {
            dom.classList.remove('player-paused');
            dom.classList.remove('player-playing');
            if (isCurrentPlay && playerState !== 'stoped') {
                dom.classList.add(`player-${playerState}`);
            }
        }
    });
    const nextState = playerState === PLAYER_STATE.PLAYING ? PLAYER_STATE.PAUSED : PLAYER_STATE.PLAYING;
    return (
        <button
            className={ctrlClass}
            disabled={disabled}
            onClick={() => {
                isCurrentPlay ? changePlayerState(nextState) : onPlaySong({ id: songId });
            }}
        >
            {useIcon(btnPlayState)}
        </button>
    );
}

const areEqual = (prevProps, nextProps) =>
    nextProps.playerState !== prevProps.playerState && nextProps.currentPlayId !== nextProps.songId;
export default connect(
    ({ player }, props) => {
        const currentPlayId = player.playingSongId;
        return {
            currentPlayId,
            playerState: player.playerState,
            isCurrentPlay: currentPlayId === props.songId
        };
    },
    {
        onPlaySong: playerActions.playSong,
        changePlayerState: playerActions.changePlayerState
    }
)(React.memo(PlayControl, areEqual));
