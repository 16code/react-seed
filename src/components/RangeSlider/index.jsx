import throttle from 'lodash/throttle';
import { eventMap } from 'helper';
import styles from './styles.less';

export default class RangeSlider extends React.PureComponent {
    static defaultProps = {
        direction: 'horizontal',
        percentage: 0,
        disabled: false
    };
    rangeSliderRef = React.createRef();
    componentDidMount() {
        this.rangeSlider = this.rangeSliderRef.current;
        this.progressBar = this.rangeSlider.querySelector('.progress-bar');
        this.bindEvents();
    }
    componentWillUnmount() {
        this.removeAllEvents();
    }
    componentDidUpdate() {
        this.bindEvents();
    }
    bindEvents = () => {
        if (!this.props.disabled) {
            this.rangeSlider.addEventListener(eventMap.dragStart, this.onDragStart);
            this.onChangeDebounce = throttle(value => this.props.onChange(value), 200);
        }
    };
    removeAllEvents = () => {
        this.onChangeDebounce && this.onChangeDebounce.cancel;
        window.removeEventListener(eventMap.dragMove, this.onDragMove, false);
        window.removeEventListener(eventMap.dragEnd, this.onDragEnd, false);
    };
    onDragStart = event => {
        if (event.button === 2) return;
        window.addEventListener(eventMap.dragMove, this.onDragMove, false);
        window.addEventListener(eventMap.dragEnd, this.onDragEnd, false);
        const { percentage, origin } = this.getDragdPercentage(event);
        this.onChangeDebounce({ eventType: 'dragStart', percentage, origin });
    };
    onDragMove = event => {
        this.updateProgressBar(event, 'dragMove');
    };
    onDragEnd = event => {
        this.removeAllEvents();
        this.updateProgressBar(event, 'dragEnd');
    };
    updateProgressBar = (event, eventType) => {
        const { percentage, origin } = this.getDragdPercentage(event);
        const styledObj = this.getProgressStyle(percentage);
        const newCssStyle = Object.keys(styledObj)
            .map(k => `${k}: ${styledObj[k]}`)
            .join(';');
        this.progressBar.setAttribute('style', newCssStyle);
        this.onChangeDebounce({ eventType, percentage, origin });
    };
    getDragdPercentage = event => {
        const slider = this.rangeSlider;
        const { left, top } = slider.getBoundingClientRect();
        let K = 0;
        const { direction } = this.props;
        if (direction === 'horizontal') {
            const clientX = event.clientX || event.changedTouches[0].clientX;
            const offsetX = clientX - left;
            const sliderWidth = slider.clientWidth;
            K = offsetX / sliderWidth;
        } else if (direction === 'vertical') {
            const sliderHeight = slider.clientHeight;
            const clientY = event.clientY || event.changedTouches[0].clientY;
            const offsetY = clientY - top;
            // prettier-ignore
            K = 1 - (offsetY / sliderHeight);
        }
        K = Math.max(K, 0);
        K = Math.min(K, 1);
        return { origin: K, percentage: `${parseFloat(K * 100).toFixed(2)}%` };
    };
    getProgressStyle = percentage => {
        const { direction } = this.props;
        const percentageToStr = `${percentage}`.indexOf('%') ? percentage : `${percentage}%`;
        return direction === 'horizontal' ? { width: percentageToStr } : { height: percentageToStr };
    };
    render() {
        const { direction, percentage, disabled, children } = this.props;
        const sliderCls = classNames(styles['range-slider'], [styles[direction]], {
            [styles.disabled]: disabled
        });
        return (
            <div className={sliderCls} ref={this.rangeSliderRef}>
                {children}
                <div className={classNames('progress-bar', styles.progress)} style={this.getProgressStyle(percentage)}>
                    <span className={styles.pin} />
                </div>
            </div>
        );
    }
}
