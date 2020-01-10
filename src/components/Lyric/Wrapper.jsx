import { connect } from 'react-redux';
import { actions } from 'reducers/lyric';
import useAudioEffect from 'hooks/useAudioEffect';
import ParticleEffect from 'components/ParticleEffect';
import { preloadImg, parseColorFormImg } from 'helper';
import Icon from 'components/Icon';
import Img from 'components/Image';
import LyricBox from './Lyric';
import styles from './wrapper.less';

const canvasId = `canvas-${Math.random(36)
    .toString(36)
    .substr(2, 7)}`;

function LyricWrapper({ playingSong, visible, isPlaying, toggleVisible }) {    
    const { visualizer, setCanvasWrap } = useAudioEffect(canvasId);
    const [fillColor, setFillColor] = React.useState();
    const { name, mv } = playingSong;
    const { picUrl } = playingSong.album || {};
    React.useEffect(() => {
        setCanvasWrap(document.getElementById('canvasEffectBox'));
        const coverImg = picUrl ? `${picUrl}?param=180y180&quality=80` : null;   
        document.querySelector(`.${styles['lyric-effect-box']} > figure`).style.opacity = 0;
        visualizer.updateSongInfo(
            {
                fetching: playingSong.fetching,
                coverImg,
                id: playingSong.id
            },
            visible
        );
        if (coverImg) {
            parseColorFormImg(coverImg, ({ primary, secondary }) => {
                visualizer.setupOption({
                    danceBarColor: primary,
                    progressBarColor: primary
                });
                setFillColor(secondary);
                document.documentElement.style
                    .setProperty('--lyric-title-color', primary);
                document.documentElement.style.setProperty('--lyric-on-color', primary);
            });
        }

        return function cleanup() {
            visualizer.destroy();
            document.documentElement.style.removeProperty('--lyric-on-color');
        };
    }, [playingSong, setCanvasWrap, fillColor, visible, visualizer, picUrl]);
    const coverBlur = playingSong.blur ? `/media/blur?url=${picUrl}` : null;
    preloadImg(coverBlur, function () {
        document.querySelector(`.${styles['lyric-effect-box']} > figure`).style.opacity = 1;
    });
    return (
        <div
            className={classNames(styles['lyric-effect-box'], {
                [styles.visible]: visible
            })}
        >
            <figure>
                {coverBlur && <Img src={coverBlur} />}
            </figure>
            <button className={styles.toggle} onClick={toggleVisible} role="button">
                <Icon type="suoxiao" />
            </button>
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
