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
            lrcMaxVisibleLine: 12,
            lrcLineHeight: 36,
            lrcOnClassName: styles['lrc-on']
        });
        this.audio = document.getElementById('audio');
        if (visible && (data && data !== '')) {
            this.addEvents();            
            this.lrc.setOption({ lrcData: LyricHelper.parseLyric(data.lyric) });
        }
    }
    componentDidUpdate() {
        const { data, visible } = this.props;
        const currentLrcId = this.lrc.getCurrentLrcId();
        if (!currentLrcId || currentLrcId !== data.id) {
            if (data && data !== '') {
                this.lrc.setOption({
                    lrcData: LyricHelper.parseLyric(data.lyric),
                    id: data.id
                });
            }
        }
        if (visible) {
            this.addEvents();
        } else {
            this.removeEvents();
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
