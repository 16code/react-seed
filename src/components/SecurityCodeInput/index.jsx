import PropTypes from 'prop-types';

import styles from './styles.less';
function SecurityCodeInput({ len = 6, onChange }, ref) {
    const inputsRef = React.useRef(ref);
    const inputs = Array.from({ length: len });
    React.useEffect(() => {
        const inputElements = inputsRef.current;
        inputElements.addEventListener('keypress', onKeypress, false);
        inputElements.addEventListener('paste', onPaste, false);
        inputElements.addEventListener('keyup', onKeydownOrKeyup, false);
        function onValuesChange() {
            const changedValues = [];
            inputElements.querySelectorAll('input').forEach(item => {
                changedValues.push(item.value);
            });
            const valueString = changedValues.join('');
            onChange && onChange(valueString);
        }
        function focusElement(ele) {
            if (ele instanceof HTMLElement) {
                ele.focus();
                ele.select();
            }
            document.activeElement.select();
        }
        function onKeypress(event) {
            event.preventDefault();
            if (event.keyCode === 13) return;
            if (/[a-z\d]/i.test(event.key)) {
                const activeElement = document.activeElement;
                activeElement.value = event.key;
                const nextEle = activeElement.nextElementSibling;
                if (nextEle) {
                    focusElement(nextEle);
                } else {
                    onValuesChange(event);
                }
            }
            document.activeElement.select();
        }
        function onKeydownOrKeyup(event) {
            event.preventDefault();
            if (event.keyCode === 13) return;
            const keys = [8, 37, 39];
            const activeElement = document.activeElement;
            let element = activeElement.previousElementSibling;
            if (keys.includes(event.keyCode)) {
                if (event.keyCode === 39) element = activeElement.nextElementSibling;
                if (element) {
                    focusElement(element);
                }
                onValuesChange(event);
            }
        }
        function onPaste(event) {
            event.preventDefault();
            const paste = (event.clipboardData || window.clipboardData).getData('text');
            if (paste && document.activeElement) {
                const text = paste
                    .replace(/[^a-zA-Z0-9]+/g, '')
                    .substr(0, len)
                    .split('');
                setValue(text);
            }
        }
        function setValue(text) {
            if (text && text.length) {
                inputElements.querySelectorAll('input').forEach((item, index) => {
                    item.value = text[index] || '';
                    if (index === inputs.length - 1) {
                        focusElement(item);
                    }
                });
            }
        }
        return function cleanup() {
            inputElements.removeEventListener('keypress', onKeypress, false);
            inputElements.removeEventListener('paste', onPaste, false);
            inputElements.removeEventListener('keyup', onKeydownOrKeyup, false);
        };
    });
    return (
        <div className={styles['security-code-wraper']} ref={inputsRef}>
            {inputs.map((input, index) => (
                <input
                    key={index}
                    id={`char${index}`}
                    className={styles['char-field']}
                    maxLength="1"
                    spellCheck="false"
                    autoCorrect="off"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoFocus={index === 0}
                    type="tel"
                />
            ))}
        </div>
    );
}
SecurityCodeInput.propTypes = {
    len: PropTypes.number,
    // value: PropTypes.string,
    onChange: PropTypes.func
};

export default React.forwardRef((props, ref) => <SecurityCodeInput {...props} forwardedRef={ref} />);
