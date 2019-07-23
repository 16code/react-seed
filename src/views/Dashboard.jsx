import Uploader from '@components/Uploader';

const props = {
    maxRetry: 1,
    multiple: true,
    autoUpload: true,
    maxLimit: 20,
    maxFileSize: (1 << 20) * 5000
};

export default () => (
    <div>
        <Uploader {...props} />
    </div>
);
