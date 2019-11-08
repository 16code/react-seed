import { emitter } from 'components/AudioEventEmitter';
import LyricHelper from './helper';
import styles from './styles.less';

export default class LyricBox extends React.PureComponent {
    lrcScrollBoxRef = React.createRef();
    static defaultProps = {
        data: {},
        visible: false
    };
    componentDidMount() {
        const { data, visible } = this.props;
        this.lrc = new LyricHelper({
            container: document.querySelector(`.${styles['lyrics-box']}`),
            scrollBox: this.lrcScrollBoxRef.current,
            lrcMaxVisibleLine: 13,
            lrcLineHeight: 32,
            lrcOnClassName: styles['lrc-on']
        });
        this.audio = document.getElementById('audio');
        this.addEvents();
        if (visible && (data && data !== '')) {
            this.lrc.setOption({ lrcData: LyricHelper.parseLyric(data.lyric) });
        }
    }
    componentDidUpdate() {
        const { data } = this.props;
        const currentLrcId = this.lrc.getCurrentLrcId();
        if (!currentLrcId || currentLrcId !== data.id) {
            if (data && data !== '') {
                this.lrc.setOption({
                    lrcData: LyricHelper.parseLyric(data.lyric),
                    id: data.id
                });
            }
        }
    }
    componentWillUnmount() {
        this.removeEvents();
        this.lrc = null;
    }
    addEvents() {
        emitter.on('ended', this.onEnd);
        emitter.on('timeupdate', this.onTimeUpdate);
    }
    removeEvents() {
        emitter.off('ended', this.onEnd);
        emitter.off('timeupdate', this.onTimeUpdate);
    }
    onEnd = () => {
        this.onTimeUpdate(0);
    };
    onTimeUpdate = time => {
        const currentTime = time === 0 ? 0 : this.audio.currentTime;
        this.lrc && this.lrc.update(currentTime);
    };
    render() {
        const noLyric = !this.props.data || this.props.data.lyric === '';
        return (
            <div
                className={classNames(styles['lyrics-box'], {
                    [styles.nolyric]: noLyric
                })}
            >
                {noLyric && <span>暂无歌词</span>}
                <ul ref={this.lrcScrollBoxRef} className={styles.scrollbox} />
            </div>
        );
    }
}
