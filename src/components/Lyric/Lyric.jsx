import { SingerLink } from 'components/Links';
import { connect } from 'react-redux';
import LyricHelper from './helper';
import styles from './styles.less';

export function Icon({ className, type }) {
    const clsStr = classNames('iconfont', className, `icon-${type}`);
    return <i className={clsStr} />;
}

@connect(({ playingSong, lyric }) => ({
    data: playingSong,
    visible: lyric.visible
}))
export default class Lyric extends React.PureComponent {
    state = { imgUrl: require('assets/default.jpg') };
    lrcScrollBoxRef = React.createRef();
    static defaultProps = {
        data: {}
    };
    componentDidMount() {
        const { data, visible } = this.props;
        this.lrc = new LyricHelper({
            container: document.querySelector(`.${styles['lyrics-box']}`),
            scrollBox: this.lrcScrollBoxRef.current,
            lrcMaxVisibleLine: 10,
            lrcLineHeight: 24
        });
        this.audio = document.querySelector('audio');
        this.larModal = document.getElementsByClassName('lyric-modal')[0];
        if (visible && data) {
            this.addEvents();
            this.loadCoverImg();
            this.lrc.setOption({ lrcData: LyricHelper.parseLyric(data.lyric) });
            this.hideSibling(this.larModal, visible);
        }
    }
    componentDidUpdate(prevProps) {
        const { data, visible } = this.props;
        if (prevProps.visible !== visible) {
            this.hideSibling(this.larModal, visible);
        }
        const currentLrcId = this.lrc.getCurrentLrcId();
        if (!currentLrcId || currentLrcId !== data.id) {
            this.loadCoverImg();
            this.lrc.setOption({
                lrcData: LyricHelper.parseLyric(data.lyric),
                id: data.id
            });
        }
    }
    componentWillUnmount() {
        this.removeEvents();
        this.lrc = null;
    }
    hideSibling(larModal, visible) {
        if (larModal && larModal.parentNode && larModal.parentNode.id === 'page-content-wrapper') {
            [].forEach.call(larModal.parentNode.childNodes, item => {
                if (!item.classList.contains('lyric-modal')) {
                    item.style.cssText = `; opacity: ${visible ? 0 : ''}; overflow: ${visible ? 'hidden' : ''}`;
                }
            });
        }
    }
    addEvents() {
        this.audio.addEventListener('ended', this.onEnd);
        this.audio.addEventListener('timeupdate', this.onTimeUpdate);
    }
    removeEvents() {
        this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
        this.audio.removeEventListener('ended', this.onEnd);
    }
    onEnd = () => {
        this.onTimeUpdate(0);
    };
    onTimeUpdate = time => {
        const currentTime = time === 0 ? 0 : this.audio.currentTime;
        this.lrc.update(currentTime);
    };
    loadCoverImg = () => {
        const { album = {} } = this.props.data || {};
        if (!album.picUrl) return;
        this.setState({ fetchCoverImg: true }, () => {
            const img = new Image();
            img.onload = () => {
                this.setState({ imgUrl: img.src, fetchCoverImg: false });
            };
            img.src = `${album.picUrl}?param=320y320&quality=60`;
        });
    };
    render() {
        const classStr = classNames(styles.cover, {
            [[styles['cover-loading']]]: this.state.fetchCoverImg
        });
        const { data: songData, playerState, onCloseModal } = this.props;
        const { name, artist, quality, mv, alia } = songData || {};

        return (
            <div className={styles['lyric-show']}>
                <div className={styles['music-meta']}>
                    <div className={styles['header-title']}>
                        <h2 className={styles.name}>{name}</h2>
                        <div className="badges">
                            <span className={classNames('badge badge-small badge-primary', styles.quality)}>
                                {quality}
                            </span>
                            {mv && <span className="badge badge-small badge-green">MV</span>}
                        </div>
                        <div className={styles['btn-group']}>
                            <button className={styles['toggle-modal']} onClick={onCloseModal} role="button">
                                <Icon type="suoxiao" />
                            </button>
                        </div>
                    </div>
                    {alia && <div className={styles.alia}>{alia}</div>}
                    <div className={styles.meta}>
                        {artist && (
                            <span className={styles.singer}>
                                歌手: <SingerLink data={artist} />
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles['music-lyrics']}>
                    <div className={styles['album-box']} data-state={playerState}>
                        <div className={classStr}>
                            <span className={styles.tonearm} />
                            <figure className={styles.album}>
                                {this.state.imgUrl && <img src={this.state.imgUrl} />}
                            </figure>
                            <figure className={styles.cd}>
                                {this.state.imgUrl && (
                                    <img src={this.state.imgUrl} className={styles['vinyl-discCover']} />
                                )}
                            </figure>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.btn} role="button">
                                <Icon className={styles.icon} type="like" />
                            </button>
                            <button className={styles.btn} role="button">
                                <Icon className={styles.icon} type="download" />
                            </button>
                            <button className={styles.btn} role="button">
                                <Icon className={styles.icon} type="share" />
                            </button>
                            <button className={styles.btn} role="button">
                                <Icon className={styles.icon} type="folder-add" />
                            </button>
                        </div>
                    </div>
                    <div className={styles['lyrics-box']}>
                        <ul ref={this.lrcScrollBoxRef} className={styles.scrollbox} />
                    </div>
                </div>
            </div>
        );
    }
}
