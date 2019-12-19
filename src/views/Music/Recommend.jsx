import Skeleton from 'components/Skeleton';
import SongList from 'components/SongList';
import Box from 'components/Box';
import { withRequest } from 'hooks/useRequest';
function theRequest(props) {
    const searchParams = new URLSearchParams(props.location.search);
    const id = searchParams.get('id') || 5;
    const limit = searchParams.get('size') || 100;
    return {
        url: '/api/songs/top',
        requestConfig: {
            params: { limit, id }
        },
        initialData: []
    };
}
@withRequest(theRequest)
export default class Recommend extends React.PureComponent {
    render() {
        const { response, isLoading } = this.props;
        const data = response.data;
        return (
            <Box title="热门歌曲">
                {isLoading ? (
                    <Skeleton title size={10} avatar layout="vertical" paragraph={{ rows: 1 }} />
                ) : <SongList dataSource={data} />}
            </Box>
        );
    }
}
