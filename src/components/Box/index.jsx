import ScrollBox from './ScrollBox';
import styles from './styles';

export default function Box(props) {
    const scroll = props.scroll;
    return (
        <div className={styles.box} style={props.style}>
            {props.title && <h2 className={styles.title}>{props.title}</h2>}
            <div className={styles.content}>{scroll ? <ScrollBox>{props.children}</ScrollBox> : props.children}</div>
        </div>
    );
}
