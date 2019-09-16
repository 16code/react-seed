import { Icon } from 'antd';
import styles from './style.less';

export default function FileIcon({ ext, size, ...rest }) {
    const iconSize = `file-icon-${size}`;
    const iconSizeCls = styles[iconSize] ? styles[iconSize] : false;
    return ext ? (
        <i
            className={classNames(styles['file-icon'], iconSizeCls)}
            data-type={ext}
        />
    ) : <Icon {...rest} />;
}
