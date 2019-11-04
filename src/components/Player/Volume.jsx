import throttle from 'lodash/debounce';
import RangeSlider from 'components/RangeSlider';

import styles from './volume.less';
export default class VolumeControl extends React.PureComponent {
    barBtnElementRef = React.createRef();
    state = {
        visible: false
    };
    componentDidMount() {
        this.barBtnElement = this.barBtnElementRef.current;
        this.onChangeDebounce = throttle(this.props.onChange, 200);
    }
    componentWillUnmount() {
        this.onChangeDebounce && this.onChangeDebounce.cancel;
    }
    hideVolumeCtrl = () => {
        this.setState({ visible: false }, () => {
            document.removeEventListener('click', this.hideVolumeCtrl);
        });
    };
    handleToggleVolumeCtrl = event => {
        event.stopPropagation();
        this.setState(
            prevState => ({ visible: !prevState.visible }),
            () => {
                if (this.state.visible) {
                    document.addEventListener('click', this.hideVolumeCtrl);
                }
            }
        );
    };
    handleProgressMoved = ({ eventType, origin }) => {
        const inEvent = eventType === 'dragMove' || 'dragEnd';
        if (inEvent) {
            const offset = parseInt(origin * 100, 10);
            this.onChangeDebounce(offset);
            this.barBtnElement.setAttribute('class', this.getIconClass(offset));
        }
    };
    getIconClass(offset) {
        return classNames('iconplayer', styles['volume-icon'], {
            'icon-volume': offset > 60,
            'icon-volume-off': offset === 0,
            'icon-volume-onewave': offset > 0 && offset < 30,
            'icon-volume-twowave': offset >= 30 && offset <= 60
        });
    }
    render() {
        const wraperClass = classNames(styles.volume, { [styles.visible]: this.state.visible });
        const { volume } = this.props;
        const volumeBtnClassStr = this.getIconClass(volume);
        return (
            <div className={wraperClass}>
                <button
                    className={classNames(styles['control-button'], styles['volume-btn'])}
                    onClick={this.handleToggleVolumeCtrl}
                    title="音量调节"
                    role="button"
                >
                    <i ref={this.barBtnElementRef} className={volumeBtnClassStr} />
                </button>
                <div className={styles['volume-controls']}>
                    <RangeSlider direction="vertical" percentage={volume} onChange={this.handleProgressMoved} />
                </div>
            </div>
        );
    }
}
