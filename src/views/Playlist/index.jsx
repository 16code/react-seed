import { useRequest } from 'hooks/useRequest';
import Img from 'components/Image';
import SongList from 'components/SongList';
import Skeleton from 'components/Skeleton';
import Box from 'components/Box';
import s from './style.less';

function Playlist(props) {
    const { id } = props.match.params;
    const [{ data, isLoading }] = useRequest('/api/playlist/:id', { body: { id } }, { playlist: {} });
    const { name, description, coverImgUrl, tracks, tags = [] } = data.playlist;    
    return (
        <>
            <Box>
                <div className={s['playlist-details']}>
                    <figure className={s.cover}>
                        <Img src={coverImgUrl} size="200x200" lazyload />
                    </figure>
                    <div className={s.meta}>
                        {isLoading ?
                            <Skeleton {...{
                                size: 1,
                                avatar: false,
                                title: true,
                                layout: 'vertical',
                                paragraph: { rows: 9 }
                            }}
                            /> : (
                                <>
                                    <h2>{name}</h2>
                                    <div>{tags.map(tag =>
                                        (
                                            <span
                                                className={classNames('badge badge-primary1', s.badge)}
                                                key={tag}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p>{description}</p>
                                </>
                            )
                        }
                    </div>
                </div>
            </Box>
            <div style={{ margin: '0 24px' }}><hr className="line" /></div>
            <Box>
                <div className={s.tracks}>
                    {isLoading ? 
                        <Skeleton {...{
                            size: 10,
                            avatar: true,
                            title: true,
                            layout: 'vertical',
                            paragraph: { rows: 1 }
                        }}
                        /> : <SongList size="54x54" dataSource={tracks} />
                    }
                </div>
            </Box>
        </>
    );
}

export default hot(Playlist);