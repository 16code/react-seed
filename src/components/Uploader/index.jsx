import PropTypes from 'prop-types';
import Draggable from './components/Draggable';
import FileInput from './components/FileInput';
import FileList from './components/FileList';
import UploadService from './file.upload.service';
import { validator, updateFileById, uuid } from './util';
import styles from './styles.less';

export default class Uploader extends React.PureComponent {
    static propTypes = {
        accept: PropTypes.string, // 允许上传多文件类型
        multiple: PropTypes.bool, // 是否允许多选
        autoUpload: PropTypes.bool, // 是否自动上传
        maxRetry: PropTypes.number, // 上传失败自动重试次数
        maxLimit: PropTypes.number, // 最多允许上传文件数量
        maxFileSize: PropTypes.number, // 单个文件最大尺寸
        showFilelist: PropTypes.bool, // 是否显示文件列表
        filelist: PropTypes.array, // 已上传的文件列表,
        chunked: PropTypes.bool, // 是否要分片处理大文件上传
        chunkSize: PropTypes.number, // 每片文件大小,
        chunkRetry: PropTypes.number, // 允许自动重传次数,
        fieldName: PropTypes.string, // 文件上传域的name
        threads: PropTypes.number // 上传并发数
    };
    static defaultProps = {
        multiple: false,
        autoUpload: true,
        showFilelist: true,
        filelist: [],
        chunked: false,
        threads: 3,
        maxRetry: 0,
        chunkSize: (1 << 20) * 5,
        chunkRetry: 2,
        fieldName: 'file'
    };
    fileInputRef = React.createRef();
    fileHashList = [];
    state = {
        fileList: []
    };
    componentDidMount() {
        const { autoUpload, chunked, threads, chunkSize, chunkRetry, fieldName, maxRetry } = this.props;
        this.fileService = new UploadService({
            autoUpload,
            chunked,
            threads,
            chunkSize,
            chunkRetry,
            fieldName,
            maxRetry,
            onFileAdded: this.handleFileAdded,
            onProgress: this.handleProgress,
            onSuccess: this.handleUploadonSuccess,
            onError: this.handleUploadError
        });
    }
    handleRetry = fileId => {
        const [file] = this.state.fileList.filter(file => file.uuid === fileId);        
        if (file) this.fileService.reUpload(file);
    }
    handleRemoveFile = fileId => {
        const fileList = [...this.state.fileList];
        this.setState({ fileList: fileList.filter(file => file.uuid !== fileId) });
        this.fileService.remove(fileId);
    };
    handleFileAdded = fileId => {
        const newList = updateFileById(fileId, this.state.fileList, {
            uploadStatus: 'pending'
        });
        this.setState({ fileList: [...newList] });
    };
    handleUploadonSuccess = (fileId, response) => {
        console.log(response);
        const newList = updateFileById(fileId, this.state.fileList, {
            uploadStatus: 'done',
            percent: 100
        });
        this.setState({ fileList: [...newList] });
    };
    handleUploadError = (fileId, error) => {
        const newList = updateFileById(fileId, this.state.fileList, {
            uploadStatus: 'failed',
            error
        });
        this.setState({ fileList: [...newList] });
    };
    handleProgress = (fileId, progress) => {
        const newList = updateFileById(fileId, this.state.fileList, { uploadStatus: 'uploading', ...progress });
        this.setState({ fileList: [...newList] });
    };
    handleBrowseFile = () => {
        this.fileInputRef.current.click();
    };
    handleFilesChange = files => {
        const { accept, maxFileSize, maxLimit } = this.props;
        if (maxLimit && maxLimit >= 0) {
            const overMaxLimit = this.state.fileList.length + files.length > maxLimit;
            if (overMaxLimit) return this.showErrorMessage(`已超出上传个数限制, 最多允许添加${maxLimit}个文件`);
        }
        if (accept || maxFileSize) {
            const error = validator(files, accept, maxFileSize);
            if (error) return this.showErrorMessage(error.message);
        }
        const newList = this.checkFileInList(files);
        this.setState(
            prev => ({ fileList: newList.concat(prev.fileList) }),
            () => {
                newList.length && this.fileService.addFile(newList);
            }
        );
    };
    checkFileInList = files => {
        const newList = [];
        const fileHashList = this.fileHashList;
        for (const file of files) {
            const { name, size, lastModified } = file;
            const hash = `${name}-${size}-${lastModified}`;
            if (!fileHashList.includes(hash)) {
                fileHashList.push(hash);
                file.uuid = uuid();
                newList.push(file);
            }
        }
        return newList;
    };
    showErrorMessage = message => {
        this.setState({ validateError: message }, () => {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                this.setState({ validateError: null });
            }, 3000);
        });
    };
    render() {
        const { chunked, accept, multiple, showFilelist } = this.props;
        const { validateError } = this.state;
        const inputProps = { accept, multiple, onChange: this.handleFilesChange };
        return (
            <section className={styles['file-uploader']}>
                <FileInput {...inputProps} ref={this.fileInputRef} />
                <Draggable
                    validateError={validateError}
                    onChange={this.handleFilesChange}
                    onBrowseFile={this.handleBrowseFile}
                />
                {showFilelist && (
                    <FileList
                        isChunked={chunked}
                        onRetry={this.handleRetry}
                        onRemove={this.handleRemoveFile}
                        dataSource={this.state.fileList}
                    />
                )}
            </section>
        );
    }
}
