import styles from './styles';

export default function Box(props) {
    return (
        <div className={styles.box} style={props.style}>
            <h2 className={styles.title}>{props.title}</h2>
            <div className={styles.content}>{props.children}</div>
        </div>
    );
}
