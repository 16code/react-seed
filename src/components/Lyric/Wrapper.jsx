import { connect } from 'react-redux';
import { actions } from 'reducers/lyric';
import useAudioEffect from 'hooks/useAudioEffect';
import Icon from 'components/Icon';
import ParticleEffect from 'components/ParticleEffect';
import LyricBox from './Lyric';
import styles from './wrapper.less';

const canvasId = `canvas-${Math.random(36)
    .toString(36)
    .substr(2, 7)}`;
function LyricWrapper({ playingSong, visible, isPlaying, toggleVisible }) {
    const { visualizer, setCanvasWrap } = useAudioEffect(canvasId);
    const { name, quality, mv } = playingSong;
    React.useEffect(() => {
        setCanvasWrap(document.getElementById('canvasEffectBox'));
        const { picUrl } = playingSong.album || {};
        visualizer.updateSongInfo(
            {
                fetching: playingSong.fetching,
                coverImg: picUrl ? `${picUrl}?param=180y180&quality=60` : null,
                id: playingSong.id
            },
            visible
        );
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
            <figure
                style={{
                    backgroundImage: playingSong.blur && `url(/media/${playingSong.blur}/blur?param=800y560&quality=50)`
                }}
            />
            <header className={styles['meta-title']}>
                <div className={styles['meta-left']}>
                    <span className={styles.headset}>
                        <Icon type="headset" />
                    </span>
                    <h2> {name} </h2>
                    <span className={classNames('badge badge-primary', styles.badge)}>{quality}K</span>
                    {mv && <span className={classNames('badge badge-primary', styles.badge)}>MV</span>}
                </div>
                <div className={styles['meta-right']}>
                    <button onClick={toggleVisible} role="button">
                        <Icon type="suoxiao" />
                    </button>
                </div>
            </header>
            <div className={classNames(styles.wrapper)}>
                <div className={styles.left} id="canvasEffectBox">
                    <ParticleEffect
                        playing={isPlaying && visible}
                        option={{
                            radius: 88 + 26
                        }}
                    />
                </div>
                <div className={styles.right}>
                    <LyricBox visible={visible} data={playingSong} />
                </div>
            </div>
        </div>
    );
}

const areEqual = (prev, next) =>
    prev.visible === next.visible && prev.playingSong.id === next.playingSong.id && prev.isPlaying === next.isPlaying;
export default hot(
    connect(
        ({ playingSong, lyric, player }) => ({
            visible: lyric.visible,
            isPlaying: player.playerState === 'playing',
            playingSong
        }),
        {
            toggleVisible: actions.toggleVisible
        }
    )(React.memo(LyricWrapper, areEqual))
);
