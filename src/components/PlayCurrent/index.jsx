import { connect } from 'react-redux';
import Image from 'components/Image';
import { actions } from 'reducers/lyric';
import { SingerLink } from 'components/Links';
import styles from './index.less';

function PlayCurrent({ data, onClick, lyricModalVisible, isPlaying, toggleVisible }) {
    const { album = {}, name, artist } = data || {};
    const iconCls = lyricModalVisible ? 'icon-suoxiao' : 'icon-bianda';
    const imgProps = {
        size: '44x44',
        alt: name
    };
    if (album.picUrl) imgProps.src = `${album.picUrl}?param=180y180&quality=60`;
    return (
        <div
            className={classNames(styles['play-current'], {
                [styles.playing]: isPlaying
            })}
        >
            <figure>
                <Image {...imgProps} />
                <button onClick={toggleVisible} className={styles['btn-handle']}>
                    <i className={`iconfont ${iconCls}`} />
                </button>
            </figure>
            <div className={styles['song-info']}>
                <h3 className={styles.name} title={name} role="button" onClick={onClick}>
                    {name || '当前未播放歌曲'}
                </h3>
                <span className={styles.singer}>
                    <SingerLink data={artist} />
                </span>
            </div>
        </div>
    );
}

export default connect(
    ({ lyric, playingSong, player }) => ({
        data: playingSong,
        isPlaying: !player.isUnplayed && player.playerState !== 'paused',
        lyricBoxVisible: lyric.visible
    }),
    {
        toggleVisible: actions.toggleVisible
    }
)(PlayCurrent);
