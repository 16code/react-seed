import { connect } from 'react-redux';
import { actions } from 'reducers/lyric';
import { actions as playerActions } from 'reducers/player';
import useAudioEffect from 'hooks/useAudioEffect';
import PlayControl from 'components/PlayControl';
import styles from './wrapper.less';

const canvasId = `canvas-${Math.random(36)
    .toString(36)
    .substr(2, 7)}`;
function LyricWrapper({ playingSong, visible, toggleVisible, playSong }) {
    const { visualizer, setCanvasWrap } = useAudioEffect(canvasId);
    React.useEffect(() => {
        setCanvasWrap(document.getElementById('canvasEffectBox'));
        const { picUrl } = playingSong.album || {};
        console.log(playingSong.blur);

        visualizer.updateVisible(visible);
        visualizer.updateSongInfo({
            fetching: playingSong.fetching,
            coverImg: picUrl ? `${picUrl}?param=440y440&&quality=80` : null,
            id: playingSong.id
        });
        return function cleanup() {
            visualizer.destroy();
        };
    }, [playingSong, setCanvasWrap, visible, visualizer]);
    return (
        <div
            className={classNames(styles['lyric-effect-box'], {
                [styles.visible]: visible
            })}
        >
            <figure />
            <div className={classNames(styles.wrapper)}>
                <div className={styles.left} id="canvasEffectBox" />
                <div className={styles.right}>
                    <button onClick={toggleVisible}>x</button>
                    <PlayControl
                        songId={playingSong.id}
                        onClick={() => {
                            playSong({ id: playingSong.id });
                        }}
                        theme="dark"
                    />
                </div>
            </div>
        </div>
    );
}

const areEqual = (prev, next) => prev.visible === next.visible && prev.playingSong.id === next.playingSong.id;
export default hot(
    connect(
        ({ playingSong, lyric }) => ({
            visible: lyric.visible,
            playingSong
        }),
        {
            playSong: playerActions.playSong,
            toggleVisible: actions.toggleVisible
        }
    )(React.memo(LyricWrapper, areEqual))
);
