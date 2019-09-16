import Uploader from '@components/Uploader';

export default class Demo extends React.Component {
    render() {
        return (
            <div>
                <Uploader 
                    {...{
                        maxRetry: 1,
                        multiple: true,
                        autoUpload: false,
                        chunked: true,
                        maxLimit: 20,
                        maxFileSize: (1 << 20) * 5000
                    }}
                />
            </div>
        );
    }
}
