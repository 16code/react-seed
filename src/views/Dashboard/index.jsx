import ThumbCard from 'components/ThumbCard';
import SongList from 'components/SongList';
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
                coverImg={item.coverImgUrl}
                countNum={item.playCount}
                size="130x130"
            />
        );
    }
    djRender(item) {
        return (
            <ThumbCard
                key={item.id}
                id={item.id}
                name={item.name}
                coverImg={item.picUrl}
                countNum={item.program.listenerCount}
                size="130x96"
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
                coverImg={item.img1v1Url}
                size="72x72"
            />
        );
    }
    render() {
        const { playlist, djprogram, artists, topboard, latest } = this.props.response.data;
        return (
            <>
                <Box title="推荐歌单">
                    <div className={styles['playlist-wraper']}>{playlist.map(this.playlistRender)}</div>
                </Box>
                <div className={styles['songs-wraper']}>
                    <Box title="热门歌曲">
                        <div className={styles['songlist-wraper']}>
                            <SongList dataSource={topboard} />
                        </div>
                    </Box>
                    <Box title="最新歌曲">
                        <div className={styles['songlist-wraper']}>
                            <SongList dataSource={latest} />
                        </div>
                    </Box>
                </div>
                <Box title="推荐电台">
                    <div className={styles['djprogram-wraper']}>{djprogram.map(this.djRender)}</div>
                </Box>
                <Box title="热门歌手">
                    <div className={styles['artists-wraper']}>{artists.map(this.artistRender)}</div>
                </Box>
            </>
        );
    }
}
