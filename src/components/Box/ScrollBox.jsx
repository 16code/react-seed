
import styles from './scrollbox.less';

export default class ScrollBox extends React.PureComponent {
    state = {
        disabledLeft: true,
        disabledRight: false
    }
    scrollBoxRef = React.createRef();
    componentDidMount() {
        const scrollBox = this.scrollBoxRef.current;
        scrollBox.onscroll = this.onScroll;
    }
    onScroll = () => {
        const scrollBox = this.scrollBoxRef.current;
        if (scrollBox.scrollWidth - scrollBox.scrollLeft <= scrollBox.clientWidth) {
            this.setState({ disabledRight: true, disabledLeft: false });
            return;
        }
        if (scrollBox.scrollLeft > 0) {
            this.setState({ disabledLeft: false, disabledRight: false });
        } else if (scrollBox.scrollLeft === 0) {
            this.setState({ disabledLeft: true, disabledRight: false });
        }
    }
    handleSLeft = () => {
        if (this.state.disabledLeft) return;
        const scrollBox = this.scrollBoxRef.current;
        const nextScroll = scrollBox.scrollLeft - (scrollBox.clientWidth / 2);  
        scrollBox.scrollLeft = nextScroll;          
        this.setState({ disabledLeft: nextScroll <= 0, disabledRight: false });
    }
    handleSRight = () => {
        if (this.state.disabledRight) return;
        const scrollBox = this.scrollBoxRef.current;
        const nextScroll = scrollBox.scrollLeft + (scrollBox.clientWidth / 2);
        scrollBox.scrollLeft = nextScroll;
        this.setState({
            disabledRight: nextScroll >= scrollBox.scrollWidth - scrollBox.clientWidth,
            disabledLeft: false
        });
    }
    render() {
        return (
            <section className={styles['scroll-outer']}>
                <span
                    onClick={this.handleSLeft}
                    className={classNames(styles.arrow, classNames({
                        [styles.disabled]: this.state.disabledLeft
                    }), styles['arrow-left'])}
                >
                    &#xe660;
                </span>
                <div className={styles['scroll-inner']} ref={this.scrollBoxRef}>
                    {this.props.children}
                </div>
                <span
                    onClick={this.handleSRight}
                    className={classNames(styles.arrow, classNames({
                        [styles.disabled]: this.state.disabledRight
                    }), styles['arrow-right'])}
                >&#xe65f;
                </span>
            </section>
        );
    }
}
