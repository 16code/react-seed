import * as Vibrant from 'node-vibrant';
import { connect } from 'react-redux';
import { actions } from 'reducers/lyric';
import useAudioEffect from 'hooks/useAudioEffect';
import ParticleEffect from 'components/ParticleEffect';
import Icon from 'components/Icon';
import Img from 'components/Image';
import LyricBox from './Lyric';
import styles from './wrapper.less';

const canvasId = `canvas-${Math.random(36)
    .toString(36)
    .substr(2, 7)}`;

export function parseColor(src, cb) {
    const img = document.createElement('img');
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
        Vibrant.from(img.src)
            .getPalette()
            .then(palette => {
                const rgb = palette.LightVibrant.rgb.map(n => parseInt(n, 10)).join(',');                
                cb({
                    primary: `rgb(${rgb})`,
                    secondary: `rgba(${rgb}, .3)`
                });
            });
    };
    img.src = src;
}
function LyricWrapper({ playingSong, visible, isPlaying, toggleVisible }) {
    const { visualizer, setCanvasWrap } = useAudioEffect(canvasId);
    const [fillColor, setFillColor] = React.useState();
    const { name, quality, mv } = playingSong;
    React.useEffect(() => {
        setCanvasWrap(document.getElementById('canvasEffectBox'));
        const { picUrl } = playingSong.album || {};
        const coverImg = picUrl ? `${picUrl}?param=180y180&quality=80` : null;        
        visualizer.updateSongInfo(
            {
                fetching: playingSong.fetching,
                coverImg,
                id: playingSong.id
            },
            visible
        );
        if (coverImg) {
            parseColor(coverImg, ({ primary, secondary }) => {
                visualizer.setupOption({
                    danceBarColor: primary,
                    progressBarColor: primary
                });
                setFillColor(secondary);
            });
        }

        return function cleanup() {
            visualizer.destroy();
        };
    }, [playingSong, setCanvasWrap, fillColor, visible, visualizer]);
    return (
        <div
            id="lyric-effect-box"
            className={classNames(styles['lyric-effect-box'], {
                [styles.visible]: visible
            })}
        >
            {playingSong.blur && (
                <figure>
                    <Img src={playingSong.blur && `/media/${playingSong.blur}/blur?param=800y560&quality=50`} />
                </figure>
            )}
            <header className={styles['meta-title']}>
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
                            fillColor,
                            radius: 88 + 34
                        }}
                    />
                </div>
                <div className={styles.right}>
                    <div className={styles.meta}>
                        <h2> {name} </h2>
                        {quality && <span className={classNames('badge badge-primary', styles.badge)}>{quality}K</span>}
                        {mv && <span className={classNames('badge badge-primary', styles.badge)}>MV</span>}
                    </div>
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
