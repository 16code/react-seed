import { Progress } from 'antd';
import FileIcon from '../FileIcon';
import { fileSizeFormat, templates } from '../../util';

import styles from './style.less';
const UPLOAD_STATUS_ENUM = {
    pending: 'normal', // 等待上传
    uploading: 'normal', // 上传中,
    processing: 'active', // 处理文件,
    done: 'success', // 上传成功,
    failed: 'exception' // 上传失败
};
function fileItemRender(props, onRemove, onRetry, isChunked) {
    const { uuid, name, size, percent, progressInfo = {}, uploadStatus = 'pending', error } = props;
    const isFailed = uploadStatus === 'failed';
    const isDone = uploadStatus === 'done';
    const isPending = uploadStatus === 'pending';
    let uploadProgress;
    if (isFailed) {
        uploadProgress = error.message;
    } else {
        uploadProgress = isDone || isPending ? fileSizeFormat(size) : templates.parse('uploadProgress', progressInfo);
    }
    const disableReload = !isPending && !isFailed;
    const fileName = document.body.offsetWidth <= 500 && name.length > 26 ? `${name.substr(0, 26)}...` : name;
    const hiddenPauseButton = !isChunked;
    return (
        <li className={styles.fileitem} key={uuid}>
            <div className={styles['file-icon']}>
                <FileIcon size="md" ext={name.split('.').pop()} />
            </div>
            <div className={styles['file-meta']}>
                <span className={styles['file-name']}>{fileName}</span>
                <span className={styles['progress-bar']}>
                    <Progress status={UPLOAD_STATUS_ENUM[uploadStatus]} percent={percent} size="small" />
                </span>
                <span className={styles['progress-infos']}>{uploadProgress}</span>
            </div>
            <div className={styles['file-actions']}>
                <span
                    className={styles.action}
                    disabled={disableReload}
                    onClick={() => {
                        onRetry && onRetry(uuid);
                    }}
                >
                    <FileIcon type={isPending ? 'caret-right' : 'reload'} />
                </span>
                <span className={styles.action} disabled={!isChunked} hidden={hiddenPauseButton}>
                    <FileIcon type={isPending ? 'caret-right' : 'pause'} />
                </span>
                <span
                    className={styles.action}
                    onClick={() => {
                        onRemove && onRemove(uuid);
                    }}
                >
                    <FileIcon type="delete" />
                </span>
            </div>
        </li>
    );
}

export default function FileList({ dataSource = [], onRemove, onRetry, isChunked }) {
    return (
        <ul className={styles.filelist}>
            {dataSource.map(item => fileItemRender(item, onRemove, onRetry, isChunked))}
        </ul>
    );
}
