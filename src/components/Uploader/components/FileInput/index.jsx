import styles from './style.less';

export default React.forwardRef(({ onChange, ...rest }, ref) => (
    <input 
        ref={ref}
        onChange={event => {
            onChange && onChange(event.target.files); 
            ref.current.value = '';
        }}
        {...rest}
        className={styles['upload-input']}
        type="file"
    />
));
