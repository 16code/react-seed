import styles from './style.less';
const enumEvent = { removeEvent: 'removeEventListener', addEvent: 'addEventListener' };
const highlightStyle = styles['on-file-dragover'];
const uploadIcon = require('./cloud-upload.svg');

function attachDragEvent(type) {
    const body = document.body;
    const eventType = enumEvent[type]
    ;['dragenter', 'dragover'].forEach(eventName => {
        body[eventType](eventName, highlightDragArea, false);
    })
    ;['dragleave', 'drop'].forEach(eventName => {
        body[eventType](eventName, unhighlightDragArea, false);
    });
}
function highlightDragArea(event) {
    event.preventDefault();
    event.stopPropagation();
    this.classList.add(highlightStyle);
}
function unhighlightDragArea(event) {
    event.preventDefault();
    event.stopPropagation();
    this.classList.remove(highlightStyle);
}
function handleFileDrop(onChange, event) {
    event.preventDefault();
    onChange && onChange(event.dataTransfer.files);
}

export default function Draggable({ onChange, onBrowseFile, validateError, className }) {
    const fileDropAreaRef = React.useRef(null);
    React.useEffect(() => {
        const fileDropArea = fileDropAreaRef.current;
        fileDropArea.addEventListener('drop', handleFileDrop.bind(null, onChange), false);
        attachDragEvent('addEvent');
        return function cleanup() {
            attachDragEvent('removeEvent');
            fileDropArea.removeEventListener('drop', handleFileDrop.bind(null, onChange), false);
        };
    });
    const classNameStr = classNames(styles['draggable-wrapper'], {
        [styles['on-select-error']]: validateError
    }, className);
    const browseBtn = (
        <a onClick={onBrowseFile ? onBrowseFile : null}>
            browse
        </a>
    );
    return (
        <section className={classNameStr}>
            <div ref={fileDropAreaRef} className={styles.draggable}>
                <span className={styles['upload-icon']}>
                    <img src={uploadIcon} draggable="false" />
                </span>
                <span className={styles['hint-wrapper']}>
                    <span className={styles.hint}>
                        <span className={styles['drop-message']}>释放文件即可上传</span>
                        <span>Drag and drop, or {browseBtn} your files</span>
                        <span className={styles['error-message']}>{validateError}</span>
                    </span>
                </span>
            </div>
        </section>
    );
}
