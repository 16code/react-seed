import SongList from 'components/SongList';
import Skeleton from 'components/Skeleton';
import Box from 'components/Box';
import { withRequest } from 'hooks/useRequest';
function theRequest(props) {
    const searchParams = new URLSearchParams(props.location.search);
    const id = searchParams.get('id') || 0;
    const limit = searchParams.get('size') || 30;
    return {
        url: '/api/songs/top',
        requestConfig: {
            params: { limit, id }
        },
        initialData: []
    };
}
function theHandles(setConfig) {
    const searchParams = new URLSearchParams(location.search);
    const limit = searchParams.get('size') || 30;
    return {
        onSearch: id => {
            setConfig({
                params: {
                    id,
                    limit
                }
            });
        }
    };
}
@withRequest(theRequest, theHandles)
export default class Top extends React.PureComponent {
    state = { categories: [] };
    componentDidMount() {
        this.getCategories();
    }
    async getCategories() {
        const { data } = await request('/api/songs/categories').catch(error => {
            console.log(error);
        });
        if (Array.isArray(data)) {
            this.setState({ categories: data });
        }
    }
    handleCategoryChange = event => {
        this.props.onSearch(event.target.value);
    };
    render() {
        const { response, isLoading } = this.props;
        const data = response.data;
        return (
            <Box title="榜单">
                <select onChange={this.handleCategoryChange}>
                    {this.state.categories.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <br />
                <br />
                {isLoading ? (
                    <Skeleton title size={10} avatar layout="vertical" paragraph={{ rows: 1 }} />
                ) : <SongList dataSource={data} size="54x54" ordered />}
            </Box>
        );
    }
}
