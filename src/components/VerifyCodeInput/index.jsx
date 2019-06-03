import styles from './styles.less';

export default class VerifyCodeInput extends React.PureComponent {
    static defaultProps = { len: 6, codeType: 'any' };
    unMounted = false;
    inputRefs = {};
    state = {
        currentFocused: 0,
        values: {}
    };
    componentDidMount() {
        document.addEventListener('keyup', this.onKeyup, false);
    }
    componentWillUnmount() {
        this.unMounted = true;
        document.removeEventListener('keyup', this.onKeyup, false);
    }
    onKeyup = event => {
        event.preventDefault();
        const { len, codeType } = this.props;
        const { key, keyCode } = event;
        const reg = codeType === 'number' ? /[0-9]{1}/ : /[A-Za-z0-9]{1}/;
        const { currentFocused, values } = this.state;
        if (keyCode === 8) {
            const next = currentFocused - 1;
            if (next > -1) {
                values[next] = null;
                this.triggerChange({ currentFocused: next, ...values });
            }
        } else {
            if (keyCode === 32 || !reg.test(key)) return;
            const next = currentFocused + 1;
            if (next < len + 1 && key.length === 1) {
                values[currentFocused] = key;
                this.triggerChange({ currentFocused: next, ...values });
            }
        }
    };

    triggerChange = ({ currentFocused, ...rest }) => {
        const { onChange, len } = this.props;
        if (this.unMounted) return;
        this.setState({ currentFocused, ...rest }, () => {
            const keyList = Object.keys(rest);
            if (keyList.length === len) {
                const values = keyList.map(key => rest[key]).join('');
                onChange && onChange(values);
            }
        });
    };
    get renderInputs() {
        const { values } = this.state;
        return Array.from({ length: this.props.len }).map((item, index) => {
            this.inputRefs[index] = React.createRef();
            return (
                <label key={index} className={styles['code-item']}>
                    <span
                        className={classNames(styles.input, {
                            [styles.focus]: values[index]
                        })}
                        ref={this.inputRefs[index]}
                    >
                        {values[index]}
                    </span>
                </label>
            );
        });
    }
    render() {
        return (
            <span className={styles['verify-code-inputs']} ref={this.verifyCodeInputRef}>
                {this.renderInputs}
            </span>
        );
    }
}
