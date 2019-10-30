import { connect } from 'react-redux';
import { PLAYER_STATE } from 'common/constants';
import { actions as playerActions } from 'reducers/player';
import styles from './styles.less';

// playState 播放状态 stoped, pending, playing, paused, failed
// theme light, dark

function PlayControl({
    songId,
    className,
    style,
    theme = 'dark',
    playerState,
    disabled = false,
    isCurrentPlay,
    onPlaySong,
    changePlayerState
}) {
    const btnPlayState = isCurrentPlay ? playerState : 'stoped';
    const ctrlClass = classNames(styles['play-control'], className, styles[`${theme}`], styles[btnPlayState]);
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
            style={style}
            className={ctrlClass}
            role="button"
            disabled={disabled}
            onClick={() => {
                isCurrentPlay ? changePlayerState(nextState) : onPlaySong({ id: songId });
            }}
        />
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
