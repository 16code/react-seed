import Image from 'components/Image';
import WaveBars from 'components/WaveBars';
import { SingerLink } from 'components/Links';
import PlayControl from 'components/PlayControl';

import styles from './styles';

function SongItem({ data, size, ordered, index }) {
    const { id: songId, name, dt, duration, ar, artists, al, disable } = data;
    const useDuration = duration ? duration : dt;
    const picUrl = al.picUrl;
    const order = index < 9 ? `0${index + 1}` : index + 1;
    const style = size ? sizeFormat(size) : {};
    return (
        <div className={classNames(styles['song-item'], { [styles.disabled]: disable })}>
            {ordered && <span className={classNames(styles.order, 'number')}>{order}</span>}
            <figure className={styles['song-thumb']} style={style}>
                <Image src={`${picUrl}?param=180y180&quality=60`} size={size} masked lazyload />
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
