import Uploader from '@components/Uploader';
import NavLink from '@components/NavLink';

export default class Demo extends React.Component {
    render() {
        return (
            <div>
                <NavLink 
                    to="dashboard" 
                    search={{ a: 1, b: 2, c: 3, status: true }}
                >
                    dashboard
                </NavLink>
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
