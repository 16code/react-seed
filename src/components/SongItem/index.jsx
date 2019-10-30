import Image from 'components/Image';
import WaveBars from 'components/WaveBars';
import { SingerLink } from 'components/Links';
import PlayControl from 'components/PlayControl';

import styles from './styles';

function SongItem({ data, size }) {
    const { id: songId, name, dt, ar, al } = data;
    return (
        <div className={classNames(styles['song-item'])}>
            <figure className={styles['song-thumb']}>
                <Image src={al.picUrl} size={size} lazyload />
                <PlayControl songId={songId} />
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
                <span className={styles.duration}>{formatDuration(dt)}</span>
            </div>
        </div>
    );
}

export default SongItem;
