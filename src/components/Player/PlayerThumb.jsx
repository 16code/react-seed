import { SingerLink } from 'components/Links';
import Image from 'components/Image';
import styles from './thumb.less';

export default ({ data, onClick, lyricModalVisible }) => {
    const { album = {}, name, artist } = data || {};
    const iconCls = lyricModalVisible ? 'icon-suoxiao' : 'icon-bianda';
    const imgProps = {
        size: '44x44',
        alt: name
    };
    if (album.picUrl) imgProps.src = `${album.picUrl}?param=88y88&quality=60`;
    return (
        <div className={styles.playing}>
            <figure>
                <Image {...imgProps} />
                <button className={styles['btn-handle']} role="button" onClick={onClick}>
                    <i className={`iconfont ${iconCls}`} />
                </button>
            </figure>
            <div className={styles.content}>
                <h3
                    className={classNames(styles.name, {
                        [styles['default-name']]: !name
                    })}
                    title={name}
                    role="button"
                    onClick={onClick}
                >
                    {name || '当前未播放歌曲'}
                </h3>
                <span className={styles.singer}>
                    <SingerLink data={artist} />
                </span>
            </div>
        </div>
    );
};
