import ThumbCard from 'components/ThumbCard';
import Box from 'components/Box';
import { withRequest } from 'hooks/useRequest';
import styles from './styles';
const emptyArr = [];
function theRequest() {
    return {
        url: '/api/dashboard',
        requestConfig: null,
        initialData: { playlist: emptyArr, djprogram: emptyArr, artists: emptyArr }
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
                size="146x146"
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
                size="146x96"
            />
        );
    }
    artistRener(item) {
        return (
            <ThumbCard
                shape="circled"
                key={item.id}
                id={item.id}
                name={item.name}
                coverImg={item.img1v1Url}
                size="84x84"
            />
        );
    }
    render() {
        const { playlist, djprogram, artists } = this.props.data;
        return (
            <>
                <Box title="推荐歌单">
                    <div className={styles['playlist-wraper']}>{playlist.map(this.playlistRender)}</div>
                </Box>
                <Box title="推荐电台">
                    <div className={styles['djprogram-wraper']}>{djprogram.map(this.djRender)}</div>
                </Box>
                <Box title="热门歌手">
                    <div className={styles['artists-wraper']}>{artists.map(this.artistRener)}</div>
                </Box>
            </>
        );
    }
}
