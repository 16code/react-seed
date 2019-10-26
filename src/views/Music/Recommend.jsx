import SongList from 'components/SongList';
import Box from 'components/Box';
import { withRequest } from 'hooks/useRequest';
function theRequest() {
    return {
        url: '/api/songs/top',
        requestConfig: {
            params: { limit: 15 }
        },
        initialData: []
    };
}
@withRequest(theRequest)
export default class Recommend extends React.PureComponent {
    render() {
        const { data } = this.props.data;
        return (
            <Box title="热门歌曲">
                <SongList dataSource={data} />
            </Box>
        );
    }
}
