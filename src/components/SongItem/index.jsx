import Image from 'components/Image';
import WaveBars from 'components/WaveBars';
import { SingerLink } from 'components/Links';
import PlayControl from 'components/PlayControl';

import styles from './styles';

function SongItem({ data, size }) {
    const { id: songId, name, dt, duration, ar, al, album } = data;
    const useAlbum = al ? al : album;
    const picUrl = useAlbum.picUrl ? useAlbum.picUrl : useAlbum.artist.img1v1Url;
    return (
        <div className={classNames(styles['song-item'])}>
            <figure className={styles['song-thumb']}>
                <Image src={`${picUrl}?param=100y100&quality=60`} size={size} lazyload />
                <PlayControl theme="light" songId={songId} inOverlay />
            </figure>
            <div className={styles['song-meta']}>
                <h4 className={styles.name}>{name}</h4>
                <div className={styles.singers}>
                    <span>
                        <SingerLink data={ar} />
                    </span>
                </div>
            </div>
            <div className={styles['song-extra']}>
                <WaveBars id={songId} />
                <span className={styles.duration}>{formatDuration(dt || duration)}</span>
            </div>
        </div>
    );
}

export default SongItem;
