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
        if (visible && data) {
            this.lrc.setOption({ lrcData: LyricHelper.parseLyric(data.lyric) });
        }
    }
    componentDidUpdate() {
        const { data } = this.props;
        const currentLrcId = this.lrc.getCurrentLrcId();
        if (!currentLrcId || currentLrcId !== data.id) {
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
        this.lrc && this.lrc.update(currentTime);
    };
    render() {
        return (
            <div className={styles['lyrics-box']}>
                <ul ref={this.lrcScrollBoxRef} className={styles.scrollbox} />
            </div>
        );
    }
}
