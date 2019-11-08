import throttle from 'lodash/throttle';
import SongList from 'components/SongList';
import Box from 'components/Box';
import { withRequest } from 'hooks/useRequest';
function theRequest() {
    return {
        url: '/api/search',
        requestConfig: {
            params: { limit: 20, type: 1, keywords: 'friendships' }
        },
        initialData: []
    };
}
function theHandles(setConfig) {
    return {
        onSearch: v => {
            setConfig({
                params: {
                    type: 1,
                    keywords: v
                }
            });
        }
    };
}
@withRequest(theRequest, theHandles)
export default class Search extends React.PureComponent {
    constructor() {
        super();
        this.autocompleteSearchThrottled = throttle(this.autocompleteSearch, 1500);
    }
    autocompleteSearch = v => {
        this.props.onSearch(v);
    };
    handleChange = event => {
        const v = event.target.value;
        this.autocompleteSearchThrottled(v);
    };
    render() {
        const data = this.props.response.data;
        return (
            <Box title="搜索歌曲">
                <input type="text" onChange={this.handleChange} />
                <SongList dataSource={data} />
            </Box>
        );
    }
}
