import Image from 'components/Image';
import WaveBars from 'components/WaveBars';
import { SingerLink } from 'components/Links';
import PlayControl from 'components/PlayControl';

import styles from './styles';

function SongItem({ data, size }) {
    const { id: songId, name, dt, duration, ar, artists, al, disable } = data;
    const useDuration = duration ? duration : dt;
    const picUrl = al.picUrl;
    return (
        <div className={classNames(styles['song-item'], { [styles.disabled]: disable })}>
            <figure className={styles['song-thumb']}>
                <Image src={`${picUrl}?param=100y100&quality=50`} size={size} lazyload />
                <PlayControl disabled={disable} theme="light" songId={songId} inOverlay />
            </figure>
            <div className={styles['song-meta']}>
                <h4 className={styles.name}>{name}</h4>
                <div className={styles.singers}>
                    <span>
                        <SingerLink data={ar || artists} />
                    </span>
                </div>
            </div>
            <div className={styles['song-extra']}>
                <WaveBars id={songId} />
                <span className={styles.duration}>{formatDuration(useDuration)}</span>
            </div>
        </div>
    );
}

export default SongItem;
