import ThumbCard from 'components/ThumbCard';
import SongList from 'components/SongList';
import Skeleton from 'components/Skeleton';
import Box from 'components/Box';
import { withRequest } from 'hooks/useRequest';
import styles from './styles';

const emptyArr = [];
function theRequest() {
    return {
        url: '/api/dashboard',
        requestConfig: null,
        initialData: {
            data: {
                playlist: emptyArr,
                djprogram: emptyArr,
                artists: emptyArr,
                topboard: emptyArr,
                latest: emptyArr
            }
        }
    };
}
function theHandles(updateRequestConfig) {
    return {
        onClick: () => {
            updateRequestConfig({
                params: {
                    id: 33333
                }
            });
        }
    };
}

@hot
@withErrorBoundary
@withRequest(theRequest, theHandles)
export default class Dashboard extends React.PureComponent {
    playlistRender(item) {        
        return (
            <ThumbCard
                key={item.id}
                id={item.id}
                name={item.name}
                coverImg={`${item.coverImgUrl}?param=150y150&quality=50`}
                countNum={item.playCount}
                size="170x170"
            />
        );
    }
    djRender(item) {
        return (
            <ThumbCard
                key={item.id}
                id={item.id}
                name={item.name}
                coverImg={`${item.picUrl}?param=170y132&quality=50`}
                countNum={item.program.listenerCount}
                size="170x132"
            />
        );
    }
    artistRender(item) {
        return (
            <ThumbCard
                shape="circled"
                key={item.id}
                id={item.id}
                name={item.name}
                coverImg={`${item.img1v1Url}?param=180y180&quality=60`}
                size="100x100"
            />
        );
    }
    skeletonRender(props) {
        return <Skeleton {...props} />;
    }
    render() {
        const { isLoading, response } = this.props;
        const { playlist, djprogram, topboard, latest } = response.data;        
        return (
            <>
                <Box title="推荐歌单" scroll>
                    {isLoading ?
                        this.skeletonRender({
                            size: 5,
                            avatar: sizeFormat('170x170'),
                            layout: 'horizontal'
                        }) :
                        playlist.map(this.playlistRender)}
                </Box>
                <Box title="热门歌曲">
                    <div className={styles['songlist-dashboard']}>
                        {isLoading ?
                            this.skeletonRender({
                                size: 10,
                                avatar: true,
                                layout: 'vertical',
                                paragraph: { rows: 1 }
                            }) :
                            <SongList dataSource={topboard} />}
                    </div>
                </Box>
                <Box title="推荐电台">
                    <div className={styles['djprogram-wraper']}>
                        {isLoading ?
                            this.skeletonRender({
                                size: 5,
                                avatar: sizeFormat('170x132'),
                                layout: 'horizontal',
                                paragraph: { rows: 1 }
                            }) :
                            djprogram.map(this.djRender)}
                    </div>
                </Box>
                <Box title="最新歌曲">
                    <div className={styles['songlist-dashboard']}>
                        {isLoading ?
                            this.skeletonRender({
                                size: 10,
                                avatar: true,
                                layout: 'vertical',
                                paragraph: { rows: 1 }
                            }) :
                            <SongList dataSource={latest} />}
                    </div>
                </Box>
                {/* <Box title="热门歌手">
                    <div className={styles['artists-wraper']}>{artists.map(this.artistRender)}</div>
                </Box> */}
            </>
        );
    }
}
