import Image from 'components/Image';
import WaveBars from 'components/WaveBars';
import PlayControl from 'components/PlayControl';
import { SingerLink } from 'components/Links';

import styles from './styles';

// playState 播放状态 stoped, pending, playing, paused, failed
function SongItem({ data, size }) {
    const { id, name, dt, ar, al } = data;
    console.log('SongItem re render', id);
    return (
        <div className={classNames(styles['song-item'])}>
            <figure className={styles['song-thumb']}>
                <Image src={al.picUrl} size={size} lazyload />
                <PlayControl
                    onClick={() => {
                        console.log('PlayControl click');
                    }}
                />
            </figure>
            <div className={styles['song-meta']}>
                <h4 className={styles.name}>{name}</h4>
                <div className={styles.singers}>
                    <span>
                        <SingerLink data={ar} id={id} />
                    </span>
                </div>
            </div>
            <div className={styles['song-extra']}>
                <WaveBars />
                <span className={styles.duration}>{formatDuration(dt)}</span>
            </div>
        </div>
    );
}
export default SongItem;
